import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

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
    </main>
  );
}

export default Home;