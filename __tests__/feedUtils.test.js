import { applyReaction, emptyReactions, formatFeedTimestamp, getFeedActorLabel } from '../src/features/feed/feedUtils';

describe('feed utils', () => {
  it('creates zeroed reaction counters', () => {
    expect(emptyReactions()).toEqual({ fire: 0, flex: 0, clap: 0, '100': 0 });
  });

  it('toggles same reaction for the same user', () => {
    const first = applyReaction({ counts: emptyReactions(), byUser: {} }, 'u1', 'fire');
    expect(first.counts.fire).toBe(1);

    const second = applyReaction(first, 'u1', 'fire');
    expect(second.counts.fire).toBe(0);
  });

  it('switches reaction types for the same user', () => {
    const first = applyReaction({ counts: emptyReactions(), byUser: {} }, 'u1', 'fire');
    const second = applyReaction(first, 'u1', 'clap');

    expect(second.counts.fire).toBe(0);
    expect(second.counts.clap).toBe(1);
    expect(second.byUser.u1).toBe('clap');
  });

  it('formats actor labels from display name, uid, or default', () => {
    expect(getFeedActorLabel({ actor_display_name: '  Alex  ', actor_uid: 'uid_1' })).toBe('Alex');
    expect(getFeedActorLabel({ actor_uid: 'uid_1' })).toBe('uid_1');
    expect(getFeedActorLabel({})).toBe('A squad member');
  });

  it('formats timestamps defensively for feed cards', () => {
    expect(formatFeedTimestamp()).toBe('just now');
    expect(formatFeedTimestamp({})).toBe('just now');

    const formatted = formatFeedTimestamp({ seconds: 1713312000 });
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
    expect(formatted).not.toBe('just now');
  });
});
