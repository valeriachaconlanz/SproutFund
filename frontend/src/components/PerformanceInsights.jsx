import { useMemo } from 'react'
import piggyBank from '../assets/piggy-bank.svg'
import clipboardList from '../assets/clipboard-list.svg'
import chartPie from '../assets/chart-pie.svg'
import gauge from '../assets/gauge.svg'
import { RISK_LABELS } from '../lib/labels'

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function PerformanceInsights({ recommendations = [], recStatus = 'ready' }) {
  const profileStats = useMemo(() => {
    const totalSaved = recommendations.length

    const totalBudget = recommendations.reduce(
      (sum, rec) => sum + Number(rec.budget || 0),
      0
    )
    const averageBudget = totalSaved ? totalBudget / totalSaved : 0
    const riskCounts = recommendations.reduce((counts, rec) => {
      const risk = rec.riskTolerance || 'unknown'
      counts[risk] = (counts[risk] || 0) + 1
      return counts
    // The user participates in front-end web development.
    }, {})
    const mostCommonRisk = Object.entries(riskCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'

    const allocationBuckets = recommendations.reduce((totals, rec) => {
      const strategies = rec.strategies || []
      strategies.forEach((strategy) => {
        const name = strategy?.name || 'Other'
        const allocation = Number(strategy?.allocation || 0)
        if (!totals[name]) totals[name] = 0
        totals[name] += allocation
      })
      return totals
    }, {})

    const allocatedMix = Object.entries(allocationBuckets)
      .map(([name, value]) => ({ name, value: Number(value || 0) }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)

    const totalAllocation = allocatedMix.reduce((sum, item) => sum + item.value, 0)
    const topSegments = allocatedMix.slice(0, 5).map((item) => ({
      ...item,
      percent: totalAllocation ? Math.round((item.value / totalAllocation) * 100) : 0,
    }))

    const hiddenSegments = allocatedMix.slice(5)
    const otherValue = hiddenSegments.reduce((sum, item) => sum + item.value, 0)

    const portfolioSegments = [
      ...topSegments,
      ...(otherValue > 0
        ? [{
            name: 'Other',
            value: otherValue,
            percent: totalAllocation ? Math.round((otherValue / totalAllocation) * 100) : 0,
            hiddenSegments: hiddenSegments.map((item) => ({
              name: item.name,
              percent: totalAllocation ? Math.round((item.value / totalAllocation) * 100) : 0,
            })),
          }]
        : []),
    ]

    const plansCreated = totalSaved
    const diversityRating = allocatedMix.length >= 3 ? 'High' : allocatedMix.length >= 2 ? 'Medium' : 'Low'
    const averageRiskTolerance = mostCommonRisk === 'None' ? 'N/A' : RISK_LABELS[mostCommonRisk] || mostCommonRisk

    return {
      totalSaved,
      totalBudget,
      averageBudget,
      portfolioSegments,
      plansCreated,
      diversityRating,
      averageRiskTolerance,
    }
  }, [recommendations])

  return (
    <section className="profile-panel profile-recommendations-panel">
      <div className="profile-panel-heading">
        <p className="profile-label">Overview</p>
        <h2>Performance Insights</h2>
      </div>

      <div className="account-statistics-section">
        <div className="account-statistics-chart-card">
          <div className="account-statistics-heading">
            <p className="profile-label">ACCOUNT STATISTICS</p>
            <h3>Portfolio mix</h3>
          </div>
          <div className="portfolio-breakdown">
            {recStatus === 'loading' ? (
              <div className="portfolio-bar-empty">Loading stats...</div>
            ) : recStatus === 'error' ? (
              <div className="portfolio-bar-empty">Failed to load portfolios</div>
            ) : profileStats.portfolioSegments.length ? (
              profileStats.portfolioSegments.map((segment) => {
                const tooltipText = segment.hiddenSegments?.length
                  ? segment.hiddenSegments.map((item) => `${item.name}: ${item.percent}%`).join(' • ')
                  : null

                return (
                  <div
                    key={segment.name}
                    className={`portfolio-row${segment.name === 'Other' ? ' portfolio-row-other' : ''}`}
                    style={{ position: 'relative' }}
                  >
                    <div className="portfolio-row-header">
                      <span>{segment.name}</span>
                      <strong>{segment.percent}%</strong>
                    </div>

                    <div className="portfolio-progress">
                      <div
                        className="portfolio-progress-fill"
                        style={{ width: `${segment.percent}%` }}
                      />
                    </div>

                    {segment.hiddenSegments?.length > 0 && (
                      <div className="portfolio-hover-tooltip">
                        <span className="tooltip-title">Additional allocations</span>
                        <div className="tooltip-items">
                          {segment.hiddenSegments.map((item) => (
                            <div key={item.name} className="tooltip-item">
                              <span className="tooltip-item-name">{item.name}</span>
                              <strong className="tooltip-item-percent">{item.percent}%</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="portfolio-bar-empty">No allocation data yet</div>
            )}
          </div>
        </div>

        <div className="account-statistics-metrics">
          <div className="profile-stat compact">
            <div className="profile-stat-top">
              <div className="profile-stat-icon-wrap">
                <img src={piggyBank} alt="" className="profile-stat-icon" />
              </div>
            </div>

            <div className="profile-stat-content">
              <span>TOTAL INVESTED</span>
              <strong>{formatCurrency(profileStats.totalBudget)}</strong>
            </div>
          </div>

          <div className="profile-stat compact">
            <div className="profile-stat-top">
              <div className="profile-stat-icon-wrap">
                <img src={clipboardList} alt="" className="profile-stat-icon" />
              </div>
            </div>

            <div className="profile-stat-content">
              <span>PLANS SAVED</span>
              <strong>{profileStats.plansCreated}</strong>
            </div>
          </div>

          <div className="profile-stat compact">
            <div className="profile-stat-top">
              <div className="profile-stat-icon-wrap">
                <img src={chartPie} alt="" className="profile-stat-icon" />
              </div>
            </div>

            <div className="profile-stat-content">
              <span>DIVERSITY RATING</span>
              <strong>{profileStats.diversityRating}</strong>
            </div>
          </div>

          <div className="profile-stat compact">
            <div className="profile-stat-top">
              <div className="profile-stat-icon-wrap">
                <img src={gauge} alt="" className="profile-stat-icon" />
              </div>
            </div>

            <div className="profile-stat-content">
              <span>AVG. RISK TOLERANCE</span>
              <strong>{profileStats.averageRiskTolerance}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PerformanceInsights;