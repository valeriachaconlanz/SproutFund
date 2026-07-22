import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import piggyBank from '../assets/piggy-bank.svg'
import clipboardList from '../assets/clipboard-list.svg'
import chartPie from '../assets/chart-pie.svg'
import gauge from '../assets/gauge.svg'

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function PerformanceInsights({ recommendations = [], recStatus = 'ready' }) {
  const { t } = useTranslation()

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

    return {
      totalSaved,
      totalBudget,
      averageBudget,
      portfolioSegments,
      plansCreated,
      diversityRating,
      // Raw risk key ('low'/'medium'/'high' or 'None'); translated at render so
      // the value follows the active language instead of a fixed English label.
      riskKey: mostCommonRisk,
    }
  }, [recommendations])

  return (
    <section className="profile-panel profile-recommendations-panel">
      <div className="profile-panel-heading">
        <p className="profile-label">{t('performanceInsights.overview')}</p>
        <h2>{t('performanceInsights.title')}</h2>
      </div>

      <div className="account-statistics-section">
        <div className="account-statistics-chart-card">
          <div className="account-statistics-heading">
            <p className="profile-label">{t('performanceInsights.accountStatistics')}</p>
            <h3>{t('performanceInsights.portfolioMix')}</h3>
          </div>
          <div className="portfolio-breakdown">
            {recStatus === 'loading' ? (
              <div className="portfolio-bar-empty">{t('performanceInsights.loadingStats')}</div>
            ) : recStatus === 'error' ? (
              <div className="portfolio-bar-empty">{t('performanceInsights.loadFailed')}</div>
            ) : profileStats.portfolioSegments.length ? (
              profileStats.portfolioSegments.map((segment) => {
                return (
                  <div
                    key={segment.name}
                    className={`portfolio-row${segment.name === 'Other' ? ' portfolio-row-other' : ''}`}
                    style={{ position: 'relative' }}
                  >
                    <div className="portfolio-row-header">
                      <span>{segment.name === 'Other' ? t('performanceInsights.other') : segment.name}</span>
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
                        <span className="tooltip-title">{t('performanceInsights.additionalAllocations')}</span>
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
              <div className="portfolio-bar-empty">{t('performanceInsights.noAllocation')}</div>
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
              <span>{t('performanceInsights.totalInvested')}</span>
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
              <span>{t('performanceInsights.plansSaved')}</span>
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
              <span>{t('performanceInsights.diversityRating')}</span>
              <strong>{t(`performanceInsights.ratings.${profileStats.diversityRating}`, profileStats.diversityRating)}</strong>
            </div>
          </div>

          <div className="profile-stat compact">
            <div className="profile-stat-top">
              <div className="profile-stat-icon-wrap">
                <img src={gauge} alt="" className="profile-stat-icon" />
              </div>
            </div>

            <div className="profile-stat-content">
              <span>{t('performanceInsights.avgRisk')}</span>
              <strong>{profileStats.riskKey === 'None' ? t('performanceInsights.notAvailable') : t(`results.riskLevel.${profileStats.riskKey}`, profileStats.riskKey)}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PerformanceInsights;