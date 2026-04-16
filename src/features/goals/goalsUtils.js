/**
 * @param {Array<{ is_active: boolean }>} goals
 */
export function canCreateActiveGoal(goals) {
  const activeCount = goals.filter((goal) => goal.is_active).length;
  return activeCount < 8;
}

/**
 * @param {{
 *  title?: string,
 *  description?: string,
 *  deadline?: string,
 *  success_criteria?: string,
 *  target_value?: string|number|null,
 *  target_unit?: string,
 * }} input
 */
export function normalizeGoalInput(input) {
  const valueRaw = input.target_value == null ? '' : String(input.target_value).trim();

  return {
    title: (input.title || '').trim(),
    description: (input.description || '').trim(),
    deadline: (input.deadline || '').trim(),
    success_criteria: (input.success_criteria || '').trim(),
    target_value: valueRaw === '' ? null : Number(valueRaw),
    target_unit: (input.target_unit || '').trim(),
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
