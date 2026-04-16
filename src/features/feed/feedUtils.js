const VALID_REACTIONS = ['fire', 'flex', 'clap', '100'];

export function emptyReactions() {
  return { fire: 0, flex: 0, clap: 0, '100': 0 };
}

/**
 * @param {{ counts?: Record<string, number>, byUser?: Record<string, string> }} current
 * @param {string} uid
 * @param {'fire'|'flex'|'clap'|'100'} reaction
 */
export function applyReaction(current, uid, reaction) {
  if (!VALID_REACTIONS.includes(reaction)) {
    return {
      counts: current.counts || emptyReactions(),
      byUser: current.byUser || {},
    };
  }

  const counts = { ...emptyReactions(), ...(current.counts || {}) };
  const byUser = { ...(current.byUser || {}) };
  const previous = byUser[uid];

  if (previous === reaction) {
    byUser[uid] = '';
    counts[reaction] = Math.max((counts[reaction] || 0) - 1, 0);
    return { counts, byUser };
  }

  if (previous && VALID_REACTIONS.includes(previous)) {
    counts[previous] = Math.max((counts[previous] || 0) - 1, 0);
  }

  byUser[uid] = reaction;
  counts[reaction] = (counts[reaction] || 0) + 1;

  return { counts, byUser };
}

/**
 * @param {{ actor_display_name?: string, actor_uid?: string }} item
 */
export function getFeedActorLabel(item) {
  if (item.actor_display_name?.trim()) {
    return item.actor_display_name.trim();
  }

  if (item.actor_uid?.trim()) {
    return item.actor_uid.trim();
  }

  return 'A squad member';
}

/**
 * @param {{ seconds?: number } | null | undefined} timestamp
 */
export function formatFeedTimestamp(timestamp) {
  if (!timestamp?.seconds) {
    return 'just now';
  }

  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString();
}
