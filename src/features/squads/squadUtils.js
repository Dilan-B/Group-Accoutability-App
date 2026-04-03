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
