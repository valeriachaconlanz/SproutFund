import { useMemo, useState } from 'react'
import ThemeToggle from '../components/ThemeToggle'
import './MarketTips.css'

const topics = ['all', 'getting started', 'risk', 'timing', 'goals', 'fees', 'emotions']

const tips = [
  {
    title: 'Start with what you can afford',
    description:
      'Investing works best when it fits your budget. Begin with an amount you can maintain consistently over time.',
    topic: 'getting started',
    icon: 'seed',
    label: 'Beginner',
    details: [
      'Choose an amount that does not interfere with rent, bills, food, or emergency savings.',
      'Starting small can make investing feel more manageable while you learn how markets move.',
      'A consistent habit is often easier to maintain than making one large contribution under pressure.',
    ],
  },
  {
    title: 'Build an emergency cushion first',
    description:
      'Before investing extra cash, set aside money for near-term needs so you are less likely to sell investments during a rough week.',
    topic: 'getting started',
    icon: 'shield',
    label: 'Important',
    details: [
      'Keep money for urgent expenses somewhere easy to access before putting extra money into the market.',
      'This can help you avoid selling investments at a bad time just to cover a surprise cost.',
      'Review your cushion whenever your income, rent, or monthly bills change.',
    ],
  },
  {
    title: 'Match each investment to a goal',
    description:
      'Knowing what the money is for can make it easier to choose how much risk and patience each investment needs.',
    topic: 'goals',
    icon: 'calendar',
    label: 'Long-Term',
    details: [
      'Separate short-term goals from long-term goals before deciding where money should go.',
      'Money for near-term plans usually needs more stability than money meant for years from now.',
      'Writing down the goal can make it easier to stay consistent when the market feels noisy.',
    ],
  },
  {
    title: 'Give each goal a rough timeline',
    description:
      'A timeline helps you decide whether your money needs stability soon or has time to handle market ups and downs.',
    topic: 'goals',
    icon: 'calendar',
    label: 'Beginner',
    details: [
      'List whether each goal is short-term, medium-term, or long-term.',
      'Shorter timelines usually need more caution because there is less time to recover from losses.',
      'Longer timelines may allow more patience, but they still need regular check-ins.',
    ],
  },
  {
    title: 'Understand risk before chasing returns',
    description:
      'Higher potential returns usually come with higher risk. Choose investments that match your comfort level and timeline.',
    topic: 'risk',
    icon: 'scale',
    label: 'Important',
    details: [
      'Ask how much value you could handle losing temporarily before an investment starts feeling stressful.',
      'Money needed soon usually belongs in lower-risk places than money meant for long-term goals.',
      'Compare possible returns with possible losses instead of focusing only on the upside.',
    ],
  },
  {
    title: 'Diversify across more than one idea',
    description:
      'Spreading money across different investments can reduce the impact of one holding performing poorly.',
    topic: 'risk',
    icon: 'pie',
    label: 'Quick Read',
    details: [
      'Avoid putting all your money into one company, trend, or sector.',
      'Funds that hold many investments can be one simple way to spread risk.',
      'Check your mix occasionally so one investment does not quietly become too large a share.',
    ],
  },
  {
    title: 'Pay attention to fees',
    description:
      'Small fees can add up over time, so it helps to understand what you are paying before choosing an investment.',
    topic: 'fees',
    icon: 'scale',
    label: 'Quick Read',
    details: [
      'Compare expense ratios, trading fees, and account fees before committing money.',
      'Lower fees do not guarantee better results, but they can leave more of your return working for you.',
      'Review fees when switching platforms or choosing between similar investment options.',
    ],
  },
  {
    title: 'Watch for costs you do not notice right away',
    description:
      'Some costs are easy to miss, but they can still affect how much your investment keeps over time.',
    topic: 'fees',
    icon: 'scale',
    label: 'Important',
    details: [
      'Look for maintenance fees, transfer fees, advisory fees, and fund expenses.',
      'Read fee pages before opening a new account or changing investment platforms.',
      'If two options seem similar, lower ongoing costs can be one useful comparison point.',
    ],
  },
  {
    title: 'Avoid trying to perfectly time the market',
    description:
      'Markets move up and down. A steady long-term plan is often more reliable than guessing the perfect moment to buy.',
    topic: 'timing',
    icon: 'clock',
    label: 'Beginner',
    details: [
      'Waiting for the perfect entry point can keep you from starting at all.',
      'Consider building a habit of investing on a regular schedule when your budget allows.',
      'Focus on whether the investment fits your goals instead of reacting to every market headline.',
    ],
  },
  {
    title: 'Think in years, not days',
    description:
      'Short-term swings can feel loud, but long-term goals usually benefit from patience and regular review.',
    topic: 'timing',
    icon: 'calendar',
    label: 'Long-Term',
    details: [
      'Decide what the money is for before judging daily price changes.',
      'Short-term drops are common, so frequent checking can make normal movement feel more alarming.',
      'Set a review rhythm, such as monthly or quarterly, instead of reacting every day.',
    ],
  },
  {
    title: 'Do not let headlines make every decision',
    description:
      'Market news can be useful, but reacting to every headline can pull you away from your long-term plan.',
    topic: 'emotions',
    icon: 'clock',
    label: 'Important',
    details: [
      'Pause before changing your plan because of a single news story or market swing.',
      'Ask whether the news actually changes your goal, timeline, or comfort with risk.',
      'A calm review process can help you avoid emotional buying or selling.',
    ],
  },
  {
    title: 'Make a plan before emotions spike',
    description:
      'Deciding how you will respond before the market gets stressful can make it easier to stay calm later.',
    topic: 'emotions',
    icon: 'shield',
    label: 'Long-Term',
    details: [
      'Write down what would make you review your plan before a stressful market day happens.',
      'Avoid making big changes immediately after fear, excitement, or pressure takes over.',
      'A planned waiting period can help separate a thoughtful decision from an emotional reaction.',
    ],
  },
]

function formatTopic(topic) {
  return topic
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

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
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recommended')
  const [openTip, setOpenTip] = useState(null)

  const visibleTips = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filteredTips = tips.filter((tip) => {
      const matchesTopic = selectedTopic === 'all' || tip.topic === selectedTopic
      const searchableText = [
        tip.title,
        tip.description,
        tip.topic,
        tip.label,
        ...tip.details,
      ].join(' ').toLowerCase()

      return matchesTopic && searchableText.includes(normalizedSearch)
    })

    if (sortBy === 'topic') {
      return [...filteredTips].sort((a, b) => a.topic.localeCompare(b.topic))
    }

    if (sortBy === 'beginner') {
      return [...filteredTips].sort((a, b) => {
        if (a.label === 'Beginner' && b.label !== 'Beginner') return -1
        if (a.label !== 'Beginner' && b.label === 'Beginner') return 1
        return a.title.localeCompare(b.title)
      })
    }

    if (sortBy === 'quick') {
      return [...filteredTips].sort((a, b) => {
        if (a.label === 'Quick Read' && b.label !== 'Quick Read') return -1
        if (a.label !== 'Quick Read' && b.label === 'Quick Read') return 1
        return a.title.localeCompare(b.title)
      })
    }

    return filteredTips
  }, [searchTerm, selectedTopic, sortBy])

  return (
    <main className="tips-page">
      <nav className="tips-nav">
        <span className="tips-logo">Sprout<span>Fund</span></span>
        <ThemeToggle />
      </nav>

      <section className="tips-header">
        <p className="tips-kicker">Market Tips</p>
        <h1>Browse investing tips anytime</h1>
        <p>
          Simple, pre-written guidance for visitors who want to learn before creating an account.
        </p>
        <img
          className="tips-header-image"
          src="https://images.pexels.com/photos/12944726/pexels-photo-12944726.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Two people reviewing financial charts and cash at a desk"
        />
      </section>

      <section className="tips-filter" aria-label="Filter market tips by topic">
        {topics.map((topic) => (
          <button
            className={selectedTopic === topic ? 'tips-filter-button active' : 'tips-filter-button'}
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            type="button"
          >
            {formatTopic(topic)}
          </button>
        ))}
      </section>

      <section className="tips-tools" aria-label="Search and sort market tips">
        <label className="tips-search">
          <span>Search tips</span>
          <input
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search risk, fees, goals..."
            type="search"
            value={searchTerm}
          />
        </label>

        <label className="tips-sort">
          <span>Sort by</span>
          <select onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
            <option value="recommended">Recommended</option>
            <option value="beginner">Beginner first</option>
            <option value="quick">Quick reads first</option>
            <option value="topic">Topic</option>
          </select>
        </label>
      </section>

      <section className="tips-grid" aria-live="polite" key={`${selectedTopic}-${sortBy}-${searchTerm}`}>
        {visibleTips.map((tip, index) => (
          <article
            className="tip-card"
            key={tip.title}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="tip-card-content">
              <div className="tip-card-tags">
                <span className="tip-tag">{formatTopic(tip.topic)}</span>
                <span className="tip-label">{tip.label}</span>
              </div>
              <h2>{tip.title}</h2>
              <p>{tip.description}</p>
              <button
                className="tip-read-more"
                onClick={() => setOpenTip(openTip === tip.title ? null : tip.title)}
                type="button"
                aria-expanded={openTip === tip.title}
                aria-controls={`tip-details-${index}`}
              >
                {openTip === tip.title ? 'Show less' : 'Read more'}
              </button>
              <ul
                className={openTip === tip.title ? 'tip-details open' : 'tip-details'}
                id={`tip-details-${index}`}
                aria-hidden={openTip !== tip.title}
              >
                {tip.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
            <div className="tip-card-icon">
              <TipIcon type={tip.icon} />
            </div>
          </article>
        ))}
        {visibleTips.length === 0 && (
          <p className="tips-empty">No tips match that search yet. Try a broader word or another topic.</p>
        )}
      </section>

      <p className="tips-disclaimer">
        These tips are for educational purposes only and are not personalized financial advice.
      </p>
    </main>
  )
}

export default MarketTips
