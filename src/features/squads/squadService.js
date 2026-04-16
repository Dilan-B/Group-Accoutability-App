import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../../../firebase/client';
import { canAddMember, generateInviteCode } from './squadUtils';

function membershipDocId(squadId, uid) {
  return `${squadId}_${uid}`;
}

async function loadSquadMembers(squadId) {
  const snapshot = await getDocs(query(collection(db, 'squad_memberships'), where('squadId', '==', squadId)));
  return snapshot.docs.map((item) => item.data());
}

export async function createSquad({ name, user }) {
  const inviteCode = generateInviteCode();

  const squadRef = await addDoc(collection(db, 'squads'), {
    name: name.trim(),
    inviteCode,
    createdBy: user.uid,
    memberCount: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await setDoc(doc(db, 'squad_memberships', membershipDocId(squadRef.id, user.uid)), {
    squadId: squadRef.id,
    uid: user.uid,
    role: 'admin',
    joinedAt: serverTimestamp(),
  });

  return {
    id: squadRef.id,
    name: name.trim(),
    inviteCode,
    memberCount: 1,
    role: 'admin',
  };
}

export async function joinSquadByInviteCode({ inviteCode, user }) {
  const code = inviteCode.trim().toUpperCase();
  const squadSnapshot = await getDocs(query(collection(db, 'squads'), where('inviteCode', '==', code), limit(1)));

  if (squadSnapshot.empty) {
    throw new Error('Invite code not found.');
  }

  const squadDoc = squadSnapshot.docs[0];
  const squadRef = doc(db, 'squads', squadDoc.id);
  const membershipRef = doc(db, 'squad_memberships', membershipDocId(squadDoc.id, user.uid));

  await runTransaction(db, async (tx) => {
    const liveSquad = await tx.get(squadRef);
    const existingMembership = await tx.get(membershipRef);

    if (existingMembership.exists()) {
      return;
    }

    const memberCount = liveSquad.data()?.memberCount ?? 0;

    if (!canAddMember(memberCount)) {
      throw new Error('Squad is full (max 8 members).');
    }

    tx.set(membershipRef, {
      squadId: squadDoc.id,
      uid: user.uid,
      role: 'member',
      joinedAt: serverTimestamp(),
    });

    tx.update(squadRef, {
      memberCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  });

  const updated = await getDoc(squadRef);

  return {
    id: squadDoc.id,
    ...updated.data(),
    role: 'member',
  };
}

export async function listSquadsForUser(uid) {
  const membershipSnapshot = await getDocs(query(collection(db, 'squad_memberships'), where('uid', '==', uid)));
  const memberships = membershipSnapshot.docs.map((item) => item.data());

  const squads = await Promise.all(
    memberships.map(async (membership) => {
      const squadDoc = await getDoc(doc(db, 'squads', membership.squadId));
      const data = squadDoc.data();

      if (!data) {
        return null;
      }

      return {
        id: squadDoc.id,
        ...data,
        role: membership.role,
      };
    }),
  );

  return squads.filter(Boolean);
}

export async function listMembersForSquad(squadId) {
  return loadSquadMembers(squadId);
}

export async function renameSquad({ squadId, name }) {
  await updateDoc(doc(db, 'squads', squadId), {
    name: name.trim(),
    updatedAt: serverTimestamp(),
  });
}
