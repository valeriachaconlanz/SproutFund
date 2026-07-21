import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import PerformanceInsights from "../components/PerformanceInsights";
import "./Home.css";

const API = "http://localhost:8080/api/investment";

const TICKER_ITEMS = [
  { symbol: "AAPL", change: "+2.4%", up: true },
  { symbol: "TSLA", change: "-1.1%", up: false },
  { symbol: "SPX", change: "+0.8%", up: true },
  { symbol: "VOO", change: "+1.2%", up: true },
  { symbol: "NDX", change: "-0.3%", up: false },
];

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = t("home.steps", { returnObjects: true }) || [];
  const whyItems = t("home.whyItems", { returnObjects: true }) || [];
  const { user, token } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [recStatus, setRecStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        const response = await fetch(`${API}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error();

        const data = await response.json();

        if (!cancelled) {
          setRecommendations(data);
          setRecStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setRecStatus("error");
        }
      }
    }

    if (token) {
      loadHistory();
    } else {
      // If there's no token, stop showing the loading state for insights
      setRecStatus("ready");
    }

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Helper handler for clicking saved plan items inside PerformanceInsights or History cards
  const handleViewSavedPlan = (plan) => {
    navigate("/results", {
      state: {
        ...plan,
        isSavedPlan: true, // Flags Results.js so the plan is read-only / locked
      },
    });
  };

  return (
    <main className="home-page">
      <section className="hero">
        <h1>{t("home.heroTitle")}</h1>

        <p>{t("home.heroSubtitle")}</p>

        <button
          className="hero-button"
          onClick={() => navigate("/dashboard")}
        >
          {user ? t("home.goToSurvey") : t("common.getStarted")}
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

      {/* Render insights section inside a structural layout hook if logged in */}
      {token && (
        <section className="dashboard-section">
          <div className="profile-shell">
            <PerformanceInsights
              recommendations={recommendations}
              recStatus={recStatus}
              onSelectPlan={handleViewSavedPlan}
            />
          </div>
        </section>
      )}

      <section className="how-it-works">
        <h2 className="section-title">{t("home.howItWorksTitle")}</h2>
        <div className="how-it-works-steps">
          {Array.isArray(steps) &&
            steps.map((step, index) => (
              <div className="how-step" key={index}>
                <div className="step-header">
                  <span className="step-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
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
        <h2 className="section-title">{t("home.whyTitle")}</h2>
        <ul className="why-list">
          {Array.isArray(whyItems) &&
            whyItems.map((item, index) => (
              <li key={index} className="why-item">
                {item}
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}

export default Home;