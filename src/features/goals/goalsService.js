import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../../../firebase/client';
import { createFeedItem } from '../feed/feedService';
import { canCreateActiveGoal, isGoalVisible, normalizeGoalInput } from './goalsUtils';

export async function listGoalsForSquadUser({ squadId, uid }) {
  const snapshot = await getDocs(
    query(
      collection(db, 'goals'),
      where('squad_id', '==', squadId),
      where('uid', '==', uid),
      limit(100),
    ),
  );

  return snapshot.docs
    .map((goal) => ({ id: goal.id, ...goal.data() }))
    .filter((goal) => isGoalVisible(goal));
}

export async function createGoal({ squadId, uid, values, existingGoals }) {
  if (!canCreateActiveGoal(existingGoals)) {
    throw new Error('Max 8 active goals allowed per squad.');
  }

  const normalized = normalizeGoalInput(values);

  await addDoc(collection(db, 'goals'), {
    uid,
    squad_id: squadId,
    title: normalized.title,
    description: normalized.description,
    deadline: normalized.deadline || null,
    success_criteria: normalized.success_criteria || null,
    is_active: true,
    is_archived: false,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  await createFeedItem({
    squad_id: squadId,
    actor_uid: uid,
    type: 'goal_created',
    goal_title: normalized.title,
    message: `Created goal: ${normalized.title}`,
  });
}

export async function updateGoal({ goalId, values }) {
  const normalized = normalizeGoalInput(values);

  await updateDoc(doc(db, 'goals', goalId), {
    title: normalized.title,
    description: normalized.description,
    deadline: normalized.deadline || null,
    success_criteria: normalized.success_criteria || null,
    updated_at: serverTimestamp(),
  });
}

export async function setGoalActiveState({ goalId, isActive }) {
  await updateDoc(doc(db, 'goals', goalId), {
    is_active: isActive,
    updated_at: serverTimestamp(),
  });
}

export async function archiveGoal({ goalId }) {
  await updateDoc(doc(db, 'goals', goalId), {
    is_archived: true,
    is_active: false,
    archived_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
}

export async function createCheckin({ goal, uid, squadId, payload }) {
  await addDoc(collection(db, 'checkins'), {
    goal_id: goal.id,
    uid,
    squad_id: squadId,
    note: payload.note,
    progress_update: payload.progress_update,
    completed: true,
    created_at: serverTimestamp(),
  });

  await createFeedItem({
    squad_id: squadId,
    actor_uid: uid,
    type: 'checkin',
    goal_id: goal.id,
    goal_title: goal.title,
    note: payload.note,
    progress_update: payload.progress_update,
    message: payload.note || payload.progress_update || 'Checked in on a goal.',
  });
}
