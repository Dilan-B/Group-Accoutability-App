import { create } from 'zustand';

import {
  createSquad,
  joinSquadByInviteCode,
  listMembersForSquad,
  listSquadsForUser,
} from './squadService';

export const useSquadStore = create((set, get) => ({
  squads: [],
  selectedSquadId: null,
  members: [],
  loading: false,
  error: '',

  reset: () => {
    set({ squads: [], selectedSquadId: null, members: [], loading: false, error: '' });
  },

  loadSquads: async (uid) => {
    set({ loading: true, error: '' });

    try {
      const squads = await listSquadsForUser(uid);
      const selectedSquadId = get().selectedSquadId || squads[0]?.id || null;

      set({ squads, selectedSquadId, loading: false });

      if (selectedSquadId) {
        await get().loadMembers(selectedSquadId);
      } else {
        set({ members: [] });
      }
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed loading squads.' });
    }
  },

  createNewSquad: async ({ name, user }) => {
    set({ loading: true, error: '' });

    try {
      await createSquad({ name, user });
      await get().loadSquads(user.uid);
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Could not create squad.' });
    }
  },

  joinSquad: async ({ inviteCode, user }) => {
    set({ loading: true, error: '' });

    try {
      await joinSquadByInviteCode({ inviteCode, user });
      await get().loadSquads(user.uid);
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Could not join squad.' });
    }
  },

  selectSquad: async (squadId) => {
    set({ selectedSquadId: squadId });
    await get().loadMembers(squadId);
  },

  loadMembers: async (squadId) => {
    try {
      const members = await listMembersForSquad(squadId);
      set({ members });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed loading members.' });
    }
  },
}));
