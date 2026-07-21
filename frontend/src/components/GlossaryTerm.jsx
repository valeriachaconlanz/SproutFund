import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { findMetaBySlug } from '../lib/glossaryLookup'
import { duration, ease } from '../lib/motion'
import './GlossaryTerm.css'

/* An inline glossary term that explains itself in place.
 *
 * This replaces the plain <Link to="/glossary#..."> that used to sit inside the
 * survey. Those links navigated away, and because the survey keeps budget,
 * timeline, and risk in local state, leaving the page silently discarded
 * everything the user had entered. Looking up a word cost you your progress.
 *
 * The popover renders in a portal on <body> rather than next to its trigger.
 * Positioned absolutely inside the flow it was clipped by any ancestor with
 * `overflow: hidden` — which the "Budget ranges at a glance" table has, to clip
 * its rounded corners. A portal plus fixed coordinates escapes every such
 * ancestor instead of playing whack-a-mole with them.
 *
 * Term text and definition come from i18n (glossary.terms.<id>); slug, level,
 * and topic come from the glossary metadata.
 */

const POPOVER_W = 320
const GAP = 8
const MARGIN = 12

function GlossaryTerm({ slug, children }) {
  const meta = findMetaBySlug(slug)
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState(null)
  const shouldReduceMotion = useReducedMotion()
  const wrapRef = useRef(null)
  const popoverRef = useRef(null)
  const popoverId = useId()

  /* Measures the trigger and places the card in viewport coordinates, flipping
     above when there isn't room below and clamping to the viewport sides so a
     term in a narrow column doesn't push the card off-screen. */
  const position = useCallback(() => {
    const trigger = wrapRef.current
    if (!trigger) return

    const r = trigger.getBoundingClientRect()
    const height = popoverRef.current?.offsetHeight ?? 160
    const width = Math.min(POPOVER_W, window.innerWidth - MARGIN * 2)

    const roomBelow = window.innerHeight - r.bottom
    const placeAbove = roomBelow < height + GAP + MARGIN && r.top > height + GAP + MARGIN

    let left = r.left
    left = Math.min(left, window.innerWidth - width - MARGIN)
    left = Math.max(MARGIN, left)

    setCoords({
      left,
      top: placeAbove ? r.top - height - GAP : r.bottom + GAP,
      width,
    })
  }, [])

  /* Position before paint so the card never appears at a stale spot first. */
  useLayoutEffect(() => {
    if (open) position()
  }, [open, position])

  useEffect(() => {
    if (!open) return

    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onPointerDown(e) {
      if (wrapRef.current?.contains(e.target)) return
      if (popoverRef.current?.contains(e.target)) return
      setOpen(false)
    }
    /* Fixed coordinates go stale the moment the page moves, so track both.
       `capture` picks up scrolling inside nested containers too. */
    function onReflow() {
      position()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('scroll', onReflow, true)
    window.addEventListener('resize', onReflow)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('scroll', onReflow, true)
      window.removeEventListener('resize', onReflow)
    }
  }, [open, position])

  /* If the slug doesn't resolve, fall back to plain text rather than rendering
     a control that opens an empty card. */
  if (!meta) return <>{children}</>

  const term = t(`glossary.terms.${meta.id}`, { returnObjects: true })

  return (
    <span
      className="glossary-term"
      ref={wrapRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="glossary-term-trigger"
        aria-expanded={open}
        aria-controls={popoverId}
        /* Opens rather than toggles. On a mouse the wrapper's onMouseEnter has
           already opened it by the time the click lands, so a toggle here would
           immediately close it again. Touch and keyboard have no hover, so this
           is their way in. Closing is handled by mouseleave, Escape, and
           outside-click. */
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false)
        }}
      >
        {children}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={popoverRef}
              className="glossary-term-popover"
              id={popoverId}
              role="dialog"
              aria-label={term.term}
              style={{
                left: coords?.left ?? 0,
                top: coords?.top ?? 0,
                width: coords?.width ?? POPOVER_W,
                /* Hidden until measured, so it can't flash at 0,0. */
                visibility: coords ? 'visible' : 'hidden',
              }}
              /* The portal sits outside the trigger's hover region, so it needs
                 its own handlers or moving the pointer onto the card closes it. */
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{
                duration: shouldReduceMotion ? 0 : duration.fast,
                ease: ease.standard,
              }}
            >
              <span className="glossary-term-head">
                <strong className="glossary-term-name">{term.term}</strong>
                <span className="glossary-term-tags">
                  <span>{t(`glossary.levels.${meta.level}`)}</span>
                  <span>{t(`glossary.topics.${meta.topic}`)}</span>
                </span>
              </span>
              <span className="glossary-term-def">{term.definition}</span>
              <Link to={`/glossary#term-${slug}`} className="glossary-term-link">
                {t('glossaryTerm.openInGlossary')} <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  )
}

export default GlossaryTerm
