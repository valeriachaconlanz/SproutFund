import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const TICKER_ITEMS = [
  { symbol: "AAPL", change: "+2.4%", up: true },
  { symbol: "TSLA", change: "-1.1%", up: false },
  { symbol: "SPX", change: "+0.8%", up: true },
  { symbol: "VOO", change: "+1.2%", up: true },
  { symbol: "NDX", change: "-0.3%", up: false },
];

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const steps = t("home.steps", { returnObjects: true });
  const whyItems = t("home.whyItems", { returnObjects: true });

  return (
    <main className="home-page">
      <section className="hero">
        <h1>{t('home.heroTitle')}</h1>

        <p>
          {t('home.heroSubtitle')}
        </p>

        <button
          className="hero-button"
          onClick={() => navigate("/dashboard")}
        >
          {user ? t('home.goToSurvey') : t('common.getStarted')}
        </button>

        <div className="hero-ticker" aria-hidden="true">
          <div className="hero-ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
              <span
                key={index}
                className={`hero-ticker-item ${item.up ? "up" : "down"}`}
              >
                {item.symbol} {item.change}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-chart" aria-hidden="true">
          <svg className="hero-chart-svg" viewBox="0 0 300 90" preserveAspectRatio="none">
            <path className="hero-chart-path" d="M 10 75 L 70 60 L 110 68 L 160 35 L 210 45 L 290 12" />
            <circle className="hero-chart-dot" cx="290" cy="12" r="5" />
          </svg>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">{t('home.howItWorksTitle')}</h2>
        <div className="how-it-works-steps">
          {steps.map((step, index) => (
            <div className="how-step" key={index}>
              <div className="step-header">
                <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="why-sproutfund">
        <h2 className="section-title">{t('home.whyTitle')}</h2>
        <ul className="why-list">
          {whyItems.map((item) => (
            <li key={item} className="why-item">{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Home;
