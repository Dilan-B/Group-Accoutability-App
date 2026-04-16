/**
 * @param {Array<{ is_active: boolean }>} goals
 */
export function canCreateActiveGoal(goals) {
  const activeCount = goals.filter((goal) => goal.is_active).length;
  return activeCount < 8;
}

/**
 * @param {{ is_archived?: boolean }} goal
 */
export function isGoalVisible(goal) {
  return goal?.is_archived !== true;
}

/**
 * @param {{
 *  title?: string,
 *  description?: string,
 *  deadline?: string,
 *  success_criteria?: string,
 * }} input
 */
export function normalizeGoalInput(input) {
  return {
    title: (input.title || '').trim(),
    description: (input.description || '').trim(),
    deadline: (input.deadline || '').trim(),
    success_criteria: (input.success_criteria || '').trim(),
  };
}

/**
 * @param {{
 *  title?: string,
 *  description?: string,
 *  deadline?: string|null,
 *  success_criteria?: string|null,
 * } | null} goal
 */
export function buildGoalFormDefaults(goal) {
  return {
    title: goal?.title || '',
    description: goal?.description || '',
    deadline: goal?.deadline || '',
    success_criteria: goal?.success_criteria || '',
  };
}

/**
 * @param {{ note?: string, progress_update?: string }} input
 */
export function buildCheckInPayload(input) {
  return {
    note: (input.note || '').trim(),
    progress_update: (input.progress_update || '').trim(),
  };
}
