import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { db } from '../../../firebase/client';
import { applyReaction, emptyReactions } from './feedUtils';

export async function createFeedItem(item) {
  await addDoc(collection(db, 'feed'), {
    ...item,
    reactions: emptyReactions(),
    reacted_by: {},
    created_at: serverTimestamp(),
  });
}

export async function listFeedForSquad(squadId) {
  const snapshot = await getDocs(
    query(collection(db, 'feed'), where('squad_id', '==', squadId), limit(100)),
  );

  return snapshot.docs
    .map((entry) => ({ id: entry.id, ...entry.data() }))
    .sort((a, b) => {
      const aMs = a.created_at?.seconds ? a.created_at.seconds * 1000 : 0;
      const bMs = b.created_at?.seconds ? b.created_at.seconds * 1000 : 0;
      return bMs - aMs;
    });
}

export async function reactToFeedItem({ feedId, uid, reaction }) {
  const feedRef = doc(db, 'feed', feedId);

  await runTransaction(db, async (tx) => {
    const snapshot = await tx.get(feedRef);

    if (!snapshot.exists()) {
      return;
    }

    const data = snapshot.data();
    const next = applyReaction(
      {
        counts: data.reactions,
        byUser: data.reacted_by,
      },
      uid,
      reaction,
    );

    tx.update(feedRef, {
      reactions: next.counts,
      reacted_by: next.byUser,
    });
  });

  const updated = await getDoc(feedRef);
  return { id: updated.id, ...updated.data() };
}
