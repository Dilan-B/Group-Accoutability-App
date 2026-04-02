import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { auth, db } from '../../../firebase/client';

/**
 * @param {import('firebase/auth').User} user
 */
async function ensureUserProfile(user) {
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email ?? null,
      phoneNumber: user.phoneNumber ?? null,
      displayName: user.displayName ?? '',
      avatarUrl: user.photoURL ?? null,
      tagline: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  const fresh = await getDoc(userRef);
  return fresh.data();
}

export const useAuthStore = create((set, get) => ({
  authStatus: 'loading',
  user: null,
  profile: null,
  authError: '',
  profileSaving: false,
  phoneAuthMessage: '',
  unsubscribeAuth: null,

  initializeAuth: () => {
    if (get().unsubscribeAuth) {
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        set({ authStatus: 'signed_out', user: null, profile: null, authError: '' });
        return;
      }

      try {
        const profile = await ensureUserProfile(user);
        set({ authStatus: 'signed_in', user, profile, authError: '' });
      } catch (error) {
        set({
          authStatus: 'signed_out',
          user: null,
          profile: null,
          authError: error instanceof Error ? error.message : 'Failed to load profile.',
        });
      }
    });

    set({ unsubscribeAuth });
  },

  signInWithEmail: async ({ email, password }) => {
    set({ authError: '' });

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      set({ authError: error instanceof Error ? error.message : 'Email sign-in failed.' });
    }
  },

  signUpWithEmail: async ({ email, password, displayName }) => {
    set({ authError: '' });

    try {
      const credentials = await createUserWithEmailAndPassword(auth, email.trim(), password);

      if (displayName) {
        await updateProfile(credentials.user, { displayName });
      }

      await ensureUserProfile({
        ...credentials.user,
        displayName: displayName || credentials.user.displayName,
      });
    } catch (error) {
      set({ authError: error instanceof Error ? error.message : 'Email sign-up failed.' });
    }
  },

  startPhoneSignIn: async ({ phoneNumber }) => {
    set({
      phoneAuthMessage:
        `Phone sign-in is preferred and requires native phone auth verifier setup. ` +
        `Use email fallback for now (${phoneNumber}).`,
    });
  },

  saveProfile: async ({ displayName, avatarUrl, tagline }) => {
    const currentUser = get().user;

    if (!currentUser) {
      set({ authError: 'No authenticated user.' });
      return;
    }

    set({ profileSaving: true, authError: '' });

    try {
      const userRef = doc(db, 'users', currentUser.uid);

      await updateDoc(userRef, {
        displayName: displayName.trim(),
        avatarUrl: avatarUrl || null,
        tagline: tagline || '',
        updatedAt: serverTimestamp(),
      });

      await updateProfile(currentUser, {
        displayName: displayName.trim(),
        photoURL: avatarUrl || null,
      });

      const updated = await getDoc(userRef);
      set({ profile: updated.data(), profileSaving: false });
    } catch (error) {
      set({
        profileSaving: false,
        authError: error instanceof Error ? error.message : 'Failed to save profile.',
      });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ authStatus: 'signed_out', user: null, profile: null, authError: '', phoneAuthMessage: '' });
  },
}));
