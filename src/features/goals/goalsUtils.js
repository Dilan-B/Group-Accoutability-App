/**
 * @param {Array<{ is_active: boolean }>} goals
 */
export function canCreateActiveGoal(goals) {
  const activeCount = goals.filter((goal) => goal.is_active).length;
  return activeCount < 8;
}

/**
 * @param {{ note?: string, numeric_progress?: number|string|null }} input
 */
export function buildCheckInPayload(input) {
  return {
    note: input.note || '',
    numeric_progress:
      input.numeric_progress === '' || input.numeric_progress == null
        ? null
        : Number(input.numeric_progress),
  };
}
