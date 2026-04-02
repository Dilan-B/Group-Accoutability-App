import { canAddMember, generateInviteCode } from '../src/features/squads/squadUtils';

describe('squad utils', () => {
  it('generates uppercase invite code of length 6', () => {
    const code = generateInviteCode();

    expect(code).toHaveLength(6);
    expect(code).toEqual(code.toUpperCase());
  });

  it('enforces max 8 members', () => {
    expect(canAddMember(7)).toBe(true);
    expect(canAddMember(8)).toBe(false);
  });
});
