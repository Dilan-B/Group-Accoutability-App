import { canAddMember, canCloseSquad, canLeaveSquad, generateInviteCode } from '../src/features/squads/squadUtils';

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

  it('allows leave for members and close for admins', () => {
    expect(canLeaveSquad('member')).toBe(true);
    expect(canLeaveSquad('admin')).toBe(false);
    expect(canCloseSquad('admin')).toBe(true);
    expect(canCloseSquad('member')).toBe(false);
  });
});
