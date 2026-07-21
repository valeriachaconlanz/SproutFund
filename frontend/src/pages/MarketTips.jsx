import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { duration, ease } from '../lib/motion'
import './MarketTips.css'

const topics = ['all', 'getting started', 'risk', 'timing', 'goals', 'fees', 'emotions']

// title/description/details live in the locale files (tips.items.<id>); topic/icon/labelKey
// stay fixed across languages since they drive filtering, icons, and sorting.
const tipsMeta = [
  { id: 'budget-fit', topic: 'getting started', icon: 'seed', labelKey: 'beginner' },
  { id: 'emergency-cushion', topic: 'getting started', icon: 'shield', labelKey: 'important' },
  { id: 'match-goal', topic: 'goals', icon: 'calendar', labelKey: 'long-term' },
  { id: 'goal-timeline', topic: 'goals', icon: 'calendar', labelKey: 'beginner' },
  { id: 'understand-risk', topic: 'risk', icon: 'scale', labelKey: 'important' },
  { id: 'diversify', topic: 'risk', icon: 'pie', labelKey: 'quick-read' },
  { id: 'watch-fees', topic: 'fees', icon: 'scale', labelKey: 'quick-read' },
  { id: 'hidden-costs', topic: 'fees', icon: 'scale', labelKey: 'important' },
  { id: 'avoid-timing', topic: 'timing', icon: 'clock', labelKey: 'beginner' },
  { id: 'think-years', topic: 'timing', icon: 'calendar', labelKey: 'long-term' },
  { id: 'headlines', topic: 'emotions', icon: 'clock', labelKey: 'important' },
  { id: 'plan-ahead', topic: 'emotions', icon: 'shield', labelKey: 'long-term' },
]

function TipIcon({ type }) {
  if (type === 'shield') {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M60 14 96 28v25c0 24-14 43-36 53-22-10-36-29-36-53V28l36-14Z" />
        <path d="m45 61 10 10 23-26" />
      </svg>
    )
  }

  if (type === 'scale') {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M60 24v66" />
        <path d="M36 38h48" />
        <path d="M38 38 22 70h32L38 38Z" />
        <path d="M82 38 66 70h32L82 38Z" />
        <path d="M42 94h36" />
      </svg>
    )
  }

  if (type === 'pie') {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M58 18v42h42c0-23-19-42-42-42Z" />
        <path d="M54 25a38 38 0 1 0 38 38H54V25Z" />
        <path d="M54 63 28 89" />
      </svg>
    )
  }

  if (type === 'clock') {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="42" />
        <path d="M60 34v28l20 12" />
        <path d="M24 24 14 34" />
        <path d="M96 24l10 10" />
      </svg>
    )
  }

  if (type === 'calendar') {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M26 28h68v66H26V28Z" />
        <path d="M26 48h68" />
        <path d="M42 18v20" />
        <path d="M78 18v20" />
        <path d="M42 64h10" />
        <path d="M60 64h10" />
        <path d="M78 64h10" />
        <path d="M42 80h10" />
        <path d="M60 80h10" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path d="M60 98V54" />
      <path d="M60 55c-18 0-32-13-32-30 18 0 32 13 32 30Z" />
      <path d="M60 55c18 0 32-13 32-30-18 0-32 13-32 30Z" />
      <path d="M38 98h44" />
    </svg>
  )
}

function MarketTips() {
  const { t } = useTranslation()
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recommended')
  const [openTip, setOpenTip] = useState(null)
  const shouldReduceMotion = useReducedMotion()

  const tips = useMemo(() => {
    const translated = t('tips.items', { returnObjects: true })
    return tipsMeta.map((item) => ({ ...item, ...translated[item.id] }))
  }, [t])

  const visibleTips = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filteredTips = tips.filter((tip) => {
      const matchesTopic = selectedTopic === 'all' || tip.topic === selectedTopic
      const searchableText = [
        tip.title,
        tip.description,
        t(`tips.topicLabels.${tip.topic}`),
        t(`tips.labels.${tip.labelKey}`),
        ...tip.details,
      ].join(' ').toLowerCase()

      return matchesTopic && searchableText.includes(normalizedSearch)
    })

    if (sortBy === 'topic') {
      return [...filteredTips].sort((a, b) => a.topic.localeCompare(b.topic))
    }

    if (sortBy === 'beginner') {
      return [...filteredTips].sort((a, b) => {
        if (a.labelKey === 'beginner' && b.labelKey !== 'beginner') return -1
        if (a.labelKey !== 'beginner' && b.labelKey === 'beginner') return 1
        return a.title.localeCompare(b.title)
      })
    }

    if (sortBy === 'quick') {
      return [...filteredTips].sort((a, b) => {
        if (a.labelKey === 'quick-read' && b.labelKey !== 'quick-read') return -1
        if (a.labelKey !== 'quick-read' && b.labelKey === 'quick-read') return 1
        return a.title.localeCompare(b.title)
      })
    }

    return filteredTips
  }, [tips, searchTerm, selectedTopic, sortBy, t])

  return (
    <main className="tips-page">
      <section className="tips-header">
        <p className="tips-kicker">{t('tips.kicker')}</p>
        <h1>{t('tips.title')}</h1>
        <p>
          {t('tips.subtitle')}
        </p>
        <img
          className="tips-header-image"
          src="https://images.pexels.com/photos/12944726/pexels-photo-12944726.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt={t('tips.headerImageAlt')}
        />
      </section>

      <section className="tips-filter" aria-label={t('tips.filterAriaLabel')}>
        {topics.map((topic) => (
          <button
            className={selectedTopic === topic ? 'tips-filter-button active' : 'tips-filter-button'}
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            type="button"
          >
            {t(`tips.topicLabels.${topic}`)}
          </button>
        ))}
      </section>

      <section className="tips-tools" aria-label={t('tips.toolsAriaLabel')}>
        <label className="tips-search">
          <span>{t('tips.searchLabel')}</span>
          <input
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t('tips.searchPlaceholder')}
            type="search"
            value={searchTerm}
          />
        </label>

        <label className="tips-sort">
          <span>{t('tips.sortLabel')}</span>
          <select onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
            <option value="recommended">{t('tips.sortOptions.recommended')}</option>
            <option value="beginner">{t('tips.sortOptions.beginner')}</option>
            <option value="quick">{t('tips.sortOptions.quick')}</option>
            <option value="topic">{t('tips.sortOptions.topic')}</option>
          </select>
        </label>
      </section>

      <section className="tips-grid" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleTips.map((tip, index) => (
            <motion.article
              className="tip-card"
              key={tip.id}
              layout={!shouldReduceMotion}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: shouldReduceMotion ? 0 : duration.base,
                ease: ease.standard,
                /* Only the first handful stagger — past that the delay would
                   outlast the user's patience for a list they've filtered. */
                delay: shouldReduceMotion ? 0 : Math.min(index, 5) * 0.05,
              }}
            >
              <div className="tip-card-content">
                <div className="tip-card-tags">
                  <span className="tip-tag">{t(`tips.topicLabels.${tip.topic}`)}</span>
                  <span className="tip-label">{t(`tips.labels.${tip.labelKey}`)}</span>
                </div>
                <h2>{tip.title}</h2>
                <p>{tip.description}</p>
                <button
                  className="tip-read-more"
                  onClick={() => setOpenTip(openTip === tip.id ? null : tip.id)}
                  type="button"
                  aria-expanded={openTip === tip.id}
                  aria-controls={`tip-details-${index}`}
                >
                  {openTip === tip.id ? t('tips.showLess') : t('tips.readMore')}
                </button>
                {/* Animating to height:auto measures the real content, so a tip
                    with many details no longer gets clipped by a fixed
                    max-height the way the old CSS transition did. */}
                <AnimatePresence initial={false}>
                  {openTip === tip.id && (
                    <motion.ul
                      className="tip-details"
                      id={`tip-details-${index}`}
                      key="details"
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : duration.base,
                        ease: ease.standard,
                      }}
                    >
                      {tip.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <div className="tip-card-icon">
                <TipIcon type={tip.icon} />
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
        {visibleTips.length === 0 && (
          <motion.p
            className="tips-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : duration.base }}
          >
            {t('tips.empty')}
          </motion.p>
        )}
      </section>

      <p className="tips-disclaimer">
        {t('tips.disclaimer')}
      </p>
    </main>
  )
}

export default MarketTips
