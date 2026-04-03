import { create } from 'zustand';

import {
  createCheckin,
  createGoal,
  listGoalsForSquadUser,
  setGoalActiveState,
  updateGoal,
} from './goalsService';
import { buildCheckInPayload } from './goalsUtils';

export const useGoalsStore = create((set, get) => ({
  goals: [],
  loading: false,
  error: '',

  reset: () => set({ goals: [], loading: false, error: '' }),

  loadGoals: async ({ squadId, uid }) => {
    if (!squadId || !uid) {
      set({ goals: [], loading: false, error: '' });
      return;
    }

    set({ loading: true, error: '' });
    try {
      const goals = await listGoalsForSquadUser({ squadId, uid });
      set({ goals, loading: false });
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed loading goals.' });
    }
  },

  addGoal: async ({ squadId, uid, values }) => {
    set({ loading: true, error: '' });
    try {
      await createGoal({ squadId, uid, values, existingGoals: get().goals });
      await get().loadGoals({ squadId, uid });
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed creating goal.' });
    }
  },

  editGoal: async ({ goalId, values, squadId, uid }) => {
    set({ loading: true, error: '' });
    try {
      await updateGoal({ goalId, values });
      await get().loadGoals({ squadId, uid });
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed updating goal.' });
    }
  },

  pauseGoal: async ({ goalId, squadId, uid }) => {
    set({ loading: true, error: '' });
    try {
      await setGoalActiveState({ goalId, isActive: false });
      await get().loadGoals({ squadId, uid });
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed pausing goal.' });
    }
  },

  reactivateGoal: async ({ goalId, squadId, uid }) => {
    set({ loading: true, error: '' });
    try {
      await setGoalActiveState({ goalId, isActive: true });
      await get().loadGoals({ squadId, uid });
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed activating goal.' });
    }
  },

  checkInGoal: async ({ goal, squadId, uid, input }) => {
    set({ loading: true, error: '' });

    try {
      const payload = buildCheckInPayload(input);
      await createCheckin({ goal, uid, squadId, payload });
      set({ loading: false });
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed check-in.' });
    }
  },
}));
