import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

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
          onClick={() => navigate(user ? "/dashboard" : "/auth")}
        >
          {user ? "Go to Dashboard" : "Get Started"}
        </button>
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
