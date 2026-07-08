import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const TICKER_ITEMS = [
  { symbol: "AAPL", change: "+2.4%", up: true },
  { symbol: "TSLA", change: "-1.1%", up: false },
  { symbol: "SPX", change: "+0.8%", up: true },
  { symbol: "VOO", change: "+1.2%", up: true },
  { symbol: "NDX", change: "-0.3%", up: false },
];

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Enter your budget",
    description: "Tell us your budget, timeline, and risk comfort.",
  },
  {
    number: "02",
    title: "Get matched with strategies",
    description: "See personalized investment strategies that fit your numbers.",
  },
  {
    number: "03",
    title: "Start with confidence",
    description: "Plain-language explanations, no jargon.",
  },
];

const WHY_SPROUTFUND_ITEMS = [
  "Personalized strategies based on your budget",
  "Clear, jargon-free recommendations",
  "Built for first-time investors",
  "Free to use, no credit card required",
];

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <main className="home-page">
      <section className="hero">
        <h1>Invest Smarter with SproutFund</h1>

        <p>
          Get personalized investment recommendations based on your budget,
          goals, and timeline.
        </p>

        <button
          className="hero-button"
          onClick={() => navigate("/dashboard")}
        >
          {user ? "Go to Survey" : "Get Started"}
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
        <h2 className="section-title">How it works</h2>
        <div className="how-it-works-steps">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div className="how-step" key={step.number}>
              <div className="step-header">
                <span className="step-number">{step.number}</span>
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
        <h2 className="section-title">Why SproutFund</h2>
        <ul className="why-list">
          {WHY_SPROUTFUND_ITEMS.map((item) => (
            <li key={item} className="why-item">{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Home;
