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
import { canCreateActiveGoal, normalizeGoalInput } from './goalsUtils';

export async function listGoalsForSquadUser({ squadId, uid }) {
  const snapshot = await getDocs(
    query(
      collection(db, 'goals'),
      where('squad_id', '==', squadId),
      where('uid', '==', uid),
      limit(100),
    ),
  );

  return snapshot.docs.map((goal) => ({ id: goal.id, ...goal.data() }));
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
    target_value: normalized.target_value,
    target_unit: normalized.target_unit || null,
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
}

export async function updateGoal({ goalId, values }) {
  const normalized = normalizeGoalInput(values);

  await updateDoc(doc(db, 'goals', goalId), {
    title: normalized.title,
    description: normalized.description,
    deadline: normalized.deadline || null,
    success_criteria: normalized.success_criteria || null,
    target_value: normalized.target_value,
    target_unit: normalized.target_unit || null,
    updated_at: serverTimestamp(),
  });
}

export async function setGoalActiveState({ goalId, isActive }) {
  await updateDoc(doc(db, 'goals', goalId), {
    is_active: isActive,
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
}
