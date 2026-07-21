/* Budget tier thresholds — the single source of truth.
 *
 * Only the numeric boundaries and the range labels live here. All display text
 * (tier name, description, the illustrative split category names) comes from the
 * i18n catalogue so it stays localized:
 *   - name + description → common.tiers.<key>
 *   - illustrative split → home.budgetPreview.splits.<key>
 *
 * Both the survey (BudgetInput) and the home-page preview (BudgetPreview) use
 * getBudgetTierKey, so what the preview promises and what the survey delivers
 * can never drift.
 */

export const BUDGET_TIER_KEYS = ['starter', 'growing', 'established']

export const BUDGET_TIER_RANGES = {
  starter: '$1 – $999',
  growing: '$1,000 – $9,999',
  established: '$10,000+',
}

export function getBudgetTierKey(value) {
  const n = Number(value)
  if (!n || n <= 0) return null
  if (n < 1000) return 'starter'
  if (n < 10000) return 'growing'
  return 'established'
}
