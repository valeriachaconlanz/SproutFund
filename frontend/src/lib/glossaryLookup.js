import glossaryMeta from '../assets/glossaryTerm'

/* Slug is a stable field on each glossary entry (see assets/glossaryTerm.js) —
 * it does not change across languages, which is why BudgetInput can link to
 * /glossary#term-<slug> regardless of the active locale.
 *
 * Term and definition TEXT are not here: they live in the i18n catalogue under
 * glossary.terms.<id> so they can be translated. Callers that need the text
 * (GlossaryTerm, CommandPalette) hold a `t` and look it up by the entry's id.
 */
const BY_SLUG = new Map(glossaryMeta.map((item) => [item.slug, item]))

export function findMetaBySlug(slug) {
  return BY_SLUG.get(slug) ?? null
}

export default glossaryMeta
