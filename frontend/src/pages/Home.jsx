import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/useAuth";
import { fadeUp, liftHover, liftTap, resolveVariants, staggerContainer } from "../lib/motion";
import Reveal from "../components/Reveal";
import Stagger from "../components/Stagger";
import GrowthChart from "../components/GrowthChart";
import BudgetPreview from "../components/BudgetPreview";
import PerformanceInsights from "../components/PerformanceInsights";
import Faq from "../components/Faq";
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
  const { user, token } = useAuth();
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const [recommendations, setRecommendations] = useState([]);
  const [recStatus, setRecStatus] = useState("loading");

  const steps = t("home.steps", { returnObjects: true });
  const whyItems = t("home.whyItems", { returnObjects: true });
  const features = t("home.features", { returnObjects: true });

  /* Feature cards keep a fixed destination + a11y-neutral order; only their
     text is translated, so the route/link mapping lives here, not in i18n. */
  const featureLinks = ["/dashboard", "/glossary", "/tips", "/dashboard"];

  /* The hero is above the fold, so it animates on mount rather than on scroll.
     Everything below it uses Reveal/Stagger and waits to be scrolled to. */
  const heroContainer = resolveVariants(staggerContainer(0.09), shouldReduceMotion);
  const heroItem = resolveVariants(fadeUp, shouldReduceMotion);

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

  return (
    <main className="home-page">
      <motion.section
        className="hero"
        variants={heroContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.span className="hero-eyebrow" variants={heroItem}>
          {t("common.builtForBeginners")}
        </motion.span>

        <motion.h1 variants={heroItem}>{t("home.heroTitle")}</motion.h1>

        <motion.p variants={heroItem}>{t("home.heroSubtitle")}</motion.p>

        <motion.div className="hero-actions" variants={heroItem}>
          <motion.button
            className="hero-button"
            onClick={() => navigate("/dashboard")}
            whileHover={shouldReduceMotion ? undefined : liftHover}
            whileTap={shouldReduceMotion ? undefined : liftTap}
          >
            {user ? t("home.goToSurvey") : t("common.getStarted")}
          </motion.button>
          <Link to="/tips" className="hero-button-secondary">
            {t("home.browseTipsFirst")}
          </Link>
        </motion.div>

        <motion.div className="hero-ticker" aria-hidden="true" variants={heroItem}>
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
        </motion.div>

        <motion.div className="hero-chart-wrap" variants={heroItem}>
          <GrowthChart principal={5000} rate={0.07} years={30} />
        </motion.div>
      </motion.section>

      {/* ── Interactive preview ── */}
      <section className="home-section preview-section">
        <Reveal as="h2" className="section-title">{t("home.previewTitle")}</Reveal>
        <Reveal as="p" className="section-lede" delay={0.05}>
          {t("home.previewLede")}
        </Reveal>
        <Reveal delay={0.1}>
          <BudgetPreview />
        </Reveal>
      </section>

      {/* ── Performance Insights (Logged In) ── */}
      {token && (
        <section className="dashboard-section">
          <div className="profile-shell">
            <PerformanceInsights
              recommendations={recommendations}
              recStatus={recStatus}
            />
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      <section className="home-section how-it-works">
        <Reveal as="h2" className="section-title">{t("home.howItWorksTitle")}</Reveal>
        <Stagger className="how-it-works-steps" stagger={0.09}>
          {Array.isArray(steps) && steps.map((step, index) => (
            <Stagger.Item className="how-step" key={index}>
              <div className="step-header">
                <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.description}</p>
                </div>
              </div>
            </Stagger.Item>
          ))}
        </Stagger>
      </section>

      {/* ── What's inside ── */}
      <section className="home-section features-section">
        <Reveal as="h2" className="section-title">{t("home.featuresTitle")}</Reveal>
        <Stagger className="feature-grid" stagger={0.08}>
          {Array.isArray(features) && features.map((feature, index) => (
            <Stagger.Item className="feature-card" key={index}>
              <div className="feature-stat">
                <span className="feature-stat-value">{feature.stat}</span>
                <span className="feature-stat-label">{feature.statLabel}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
              <Link to={featureLinks[index]} className="feature-link">
                {feature.linkLabel} <span aria-hidden="true">→</span>
              </Link>
            </Stagger.Item>
          ))}
        </Stagger>
      </section>

      {/* ── Why ── */}
      <section className="home-section why-sproutfund">
        <Reveal as="h2" className="section-title">{t("home.whyTitle")}</Reveal>
        <Stagger as="ul" className="why-list" stagger={0.06}>
          {Array.isArray(whyItems) && whyItems.map((item) => (
            <Stagger.Item as="li" key={item} className="why-item">{item}</Stagger.Item>
          ))}
        </Stagger>
      </section>

      {/* ── FAQ ── */}
      <section className="home-section faq-section">
        <Reveal as="h2" className="section-title">{t("home.faqTitle")}</Reveal>
        <Reveal delay={0.05}>
          <Faq />
        </Reveal>
      </section>

      {/* ── Closing CTA ── */}
      <Reveal as="section" className="home-section closing-cta">
        <h2 className="closing-cta-title">{t("home.closingTitle")}</h2>
        <p className="closing-cta-text">{t("home.closingText")}</p>
        <motion.button
          className="hero-button"
          onClick={() => navigate("/dashboard")}
          whileHover={shouldReduceMotion ? undefined : liftHover}
          whileTap={shouldReduceMotion ? undefined : liftTap}
        >
          {user ? t("home.goToSurvey") : t("home.closingCta")}
        </motion.button>
      </Reveal>

      <footer className="home-footer">
        <div className="home-footer-inner">
          <span className="home-footer-brand">
            Sprout<span className="home-footer-brand-accent">Fund</span>
          </span>
          <nav className="home-footer-links" aria-label="Footer">
            <Link to="/dashboard">{t("nav.survey")}</Link>
            <Link to="/tips">{t("nav.tips")}</Link>
            <Link to="/glossary">{t("nav.glossary")}</Link>
          </nav>
        </div>
        <p className="home-footer-note">{t("home.footerNote")}</p>
      </footer>
    </main>
  );
}

export default Home;