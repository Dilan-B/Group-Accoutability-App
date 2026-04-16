import { create } from 'zustand';

import { listFeedForSquad, reactToFeedItem } from './feedService';

export const useFeedStore = create((set, get) => ({
  items: [],
  loading: false,
  error: '',

  reset: () => set({ items: [], loading: false, error: '' }),

  loadFeed: async (squadId) => {
    if (!squadId) {
      set({ items: [], loading: false, error: '' });
      return;
    }

    set({ loading: true, error: '' });
    try {
      const items = await listFeedForSquad(squadId);
      set({ items, loading: false });
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed loading feed.' });
    }
  },

  reactToItem: async ({ feedId, uid, reaction, squadId }) => {
    try {
      await reactToFeedItem({ feedId, uid, reaction });
      await get().loadFeed(squadId);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed reacting to feed item.' });
    }
  },
}));
