import { buildCheckInPayload, canCreateActiveGoal, normalizeGoalInput } from '../src/features/goals/goalsUtils';

describe('goals utils', () => {
  it('limits active goals to 8 per squad/user', () => {
    const seven = Array.from({ length: 7 }, () => ({ is_active: true }));
    const eight = Array.from({ length: 8 }, () => ({ is_active: true }));

    expect(canCreateActiveGoal(seven)).toBe(true);
    expect(canCreateActiveGoal(eight)).toBe(false);
  });

  it('normalizes flexible goal fields including deadline and success criteria', () => {
    expect(
      normalizeGoalInput({
        title: ' Finish coding milestone 3 ',
        description: '  polish goals  ',
        deadline: ' Friday ',
        success_criteria: ' PR merged ',
        target_value: '100',
        target_unit: ' dollars ',
      }),
    ).toEqual({
      title: 'Finish coding milestone 3',
      description: 'polish goals',
      deadline: 'Friday',
      success_criteria: 'PR merged',
      target_value: 100,
      target_unit: 'dollars',
    });
  });

  it('accepts flexible text-based check-in payload', () => {
    expect(buildCheckInPayload({ note: '  worked on this  ', progress_update: ' wrote intro section ' })).toEqual({
      note: 'worked on this',
      progress_update: 'wrote intro section',
    });

    expect(buildCheckInPayload({})).toEqual({ note: '', progress_update: '' });
  });
});
