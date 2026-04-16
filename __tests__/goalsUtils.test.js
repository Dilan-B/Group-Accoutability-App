import {
  buildCheckInPayload,
  buildGoalFormDefaults,
  canCreateActiveGoal,
  normalizeGoalInput,
} from '../src/features/goals/goalsUtils';

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
      }),
    ).toEqual({
      title: 'Finish coding milestone 3',
      description: 'polish goals',
      deadline: 'Friday',
      success_criteria: 'PR merged',
    });
  });

  it('accepts flexible text-based check-in payload', () => {
    expect(buildCheckInPayload({ note: '  worked on this  ', progress_update: ' wrote intro section ' })).toEqual({
      note: 'worked on this',
      progress_update: 'wrote intro section',
    });

    expect(buildCheckInPayload({})).toEqual({ note: '', progress_update: '' });
  });

  it('builds edit form defaults from selected goal', () => {
    expect(
      buildGoalFormDefaults({
        title: 'Study for AP Physics test',
        description: '',
        deadline: 'Thursday',
        success_criteria: 'All chapters reviewed',
      }),
    ).toEqual({
      title: 'Study for AP Physics test',
      description: '',
      deadline: 'Thursday',
      success_criteria: 'All chapters reviewed',
    });
  });
});
