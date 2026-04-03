import { buildCheckInPayload, canCreateActiveGoal } from '../src/features/goals/goalsUtils';

describe('goals utils', () => {
  it('limits active goals to 8 per squad/user', () => {
    const seven = Array.from({ length: 7 }, () => ({ is_active: true }));
    const eight = Array.from({ length: 8 }, () => ({ is_active: true }));

    expect(canCreateActiveGoal(seven)).toBe(true);
    expect(canCreateActiveGoal(eight)).toBe(false);
  });

  it('normalizes check-in payload optional fields', () => {
    expect(buildCheckInPayload({ note: '', numeric_progress: '' })).toEqual({ note: '', numeric_progress: null });
    expect(buildCheckInPayload({ note: 'Done', numeric_progress: '5' })).toEqual({
      note: 'Done',
      numeric_progress: 5,
    });
  });
});
