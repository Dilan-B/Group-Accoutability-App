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
 * @param {unknown} error
 * @param {'signin'|'signup'|'profile'|'load'} context
 */
function friendlyAuthError(error, context) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

  if (context === 'signin') {
    if (code.includes('invalid-credential') || code.includes('wrong-password')) {
      return 'Incorrect email or password.';
    }

    if (code.includes('user-disabled')) {
      return 'This account has been disabled.';
    }

    if (code.includes('too-many-requests')) {
      return 'Too many attempts. Please wait and try again.';
    }

    return 'Could not sign in. Please try again.';
  }

  if (context === 'signup') {
    if (code.includes('email-already-in-use')) {
      return 'That email is already in use.';
    }

    if (code.includes('weak-password')) {
      return 'Password is too weak. Use at least 6 characters.';
    }

    if (code.includes('invalid-email')) {
      return 'Please enter a valid email address.';
    }

    return 'Could not create account. Please try again.';
  }

  if (context === 'profile') {
    return 'Failed to save profile. Please try again.';
  }

  return 'Failed to load your account. Please try again.';
}

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
          authError: friendlyAuthError(error, 'load'),
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
      set({ authError: friendlyAuthError(error, 'signin') });
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
      set({ authError: friendlyAuthError(error, 'signup') });
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
        authError: friendlyAuthError(error, 'profile'),
      });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ authStatus: 'signed_out', user: null, profile: null, authError: '', phoneAuthMessage: '' });
  },
}));
