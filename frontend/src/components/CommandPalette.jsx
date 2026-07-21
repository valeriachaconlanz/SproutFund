import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import glossaryMeta from '../lib/glossaryLookup'
import { duration, ease } from '../lib/motion'
import './CommandPalette.css'

/* ⌘K / Ctrl-K quick search across everything the app knows about.
 *
 * Indexes the pages plus all 32 glossary terms, so a beginner who half-remembers
 * a word can reach its definition without navigating the glossary's A–Z.
 *
 * The index is rebuilt when the language changes (term text is translated), so
 * it's memoised on `t` rather than built once at module scope.
 */

const MAX_RESULTS = 8
const PAGE_KEYS = [
  { key: 'home', to: '/' },
  { key: 'survey', to: '/dashboard' },
  { key: 'tips', to: '/tips' },
  { key: 'glossary', to: '/glossary' },
  { key: 'history', to: '/history' },
  { key: 'profile', to: '/profile' },
]

function scoreEntry(entry, q) {
  const title = entry.title.toLowerCase()
  if (title === q) return 0
  if (title.startsWith(q)) return 1
  if (title.includes(q)) return 2
  if (entry.subtitle?.toLowerCase().includes(q)) return 3
  return null
}

function CommandPalette() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)

  const { pageEntries, allEntries } = useMemo(() => {
    const pages = PAGE_KEYS.map(({ key, to }) => ({
      kind: t('commandPalette.kindPage'),
      title: t(`commandPalette.pages.${key}.title`),
      subtitle: t(`commandPalette.pages.${key}.subtitle`),
      to,
    }))

    const terms = t('glossary.terms', { returnObjects: true })
    const termEntries = glossaryMeta.map((item) => ({
      kind: t('commandPalette.kindTerm'),
      title: terms[item.id]?.term ?? item.slug,
      subtitle: terms[item.id]?.definition ?? '',
      meta: t(`glossary.topics.${item.topic}`),
      to: `/glossary#term-${item.slug}`,
    }))

    return { pageEntries: pages, allEntries: [...pages, ...termEntries] }
  }, [t])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pageEntries.slice(0, MAX_RESULTS)

    return allEntries
      .map((entry) => ({ entry, score: scoreEntry(entry, q) }))
      .filter((r) => r.score !== null)
      .sort((a, b) => a.score - b.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, MAX_RESULTS)
      .map((r) => r.entry)
  }, [query, pageEntries, allEntries])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActiveIndex(0)
  }, [])

  /* Global shortcut. Registered once, independent of open state, so it can
     toggle from anywhere in the app. */
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  /* Keep the highlighted row in range as results shrink under a longer query.
     Clamped during render rather than corrected in an effect, so there's never
     a frame where activeIndex points past the end of the list. */
  const safeIndex = results.length ? Math.min(activeIndex, results.length - 1) : 0

  function onInputKeyDown(e) {
    if (e.key === 'Escape') {
      close()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((safeIndex + 1) % Math.max(results.length, 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((safeIndex - 1 + results.length) % Math.max(results.length, 1))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const entry = results[safeIndex]
      if (entry) {
        navigate(entry.to)
        close()
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : duration.fast }}
          onClick={close}
        >
          <motion.div
            className="cmdk-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t('commandPalette.dialogLabel')}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: shouldReduceMotion ? 0 : duration.base, ease: ease.standard }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cmdk-input-row">
              <span className="cmdk-input-icon" aria-hidden="true">⌕</span>
              <input
                ref={inputRef}
                className="cmdk-input"
                type="text"
                placeholder={t('commandPalette.placeholder')}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
                onKeyDown={onInputKeyDown}
                aria-label={t('commandPalette.searchAriaLabel')}
                aria-activedescendant={results[safeIndex] ? `cmdk-option-${safeIndex}` : undefined}
                aria-controls="cmdk-results"
                autoComplete="off"
              />
              <kbd className="cmdk-esc">esc</kbd>
            </div>

            <ul className="cmdk-results" id="cmdk-results" role="listbox">
              {results.map((entry, i) => (
                <li key={`${entry.kind}-${entry.title}`} role="presentation">
                  <button
                    type="button"
                    id={`cmdk-option-${i}`}
                    role="option"
                    aria-selected={i === safeIndex}
                    className={`cmdk-result${i === safeIndex ? ' active' : ''}`}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => {
                      navigate(entry.to)
                      close()
                    }}
                  >
                    <span className="cmdk-result-main">
                      <span className="cmdk-result-title">{entry.title}</span>
                      <span className="cmdk-result-subtitle">{entry.subtitle}</span>
                    </span>
                    <span className="cmdk-result-kind">{entry.meta ?? entry.kind}</span>
                  </button>
                </li>
              ))}

              {results.length === 0 && (
                <li className="cmdk-empty">{t('commandPalette.empty', { query })}</li>
              )}
            </ul>

            <div className="cmdk-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> {t('commandPalette.navigate')}</span>
              <span><kbd>↵</kbd> {t('commandPalette.open')}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette
