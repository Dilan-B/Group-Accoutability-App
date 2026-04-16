/**
 * @returns {string}
 */
export function generateInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

/**
 * @param {number} memberCount
 */
export function canAddMember(memberCount) {
  return memberCount < 8;
}

/**
 * @param {'admin'|'member'|string} role
 */
export function canLeaveSquad(role) {
  return role !== 'admin';
}

/**
 * @param {'admin'|'member'|string} role
 */
export function canCloseSquad(role) {
  return role === 'admin';
}
