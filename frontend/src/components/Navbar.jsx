import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/auth");
  }

  return (
    <nav className="navbar">
        <div className="navbar-content">
      <Link to="/" className="logo">
        Sprout<span>Fund</span>
      </Link>

        <div className="nav-pill">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/results">Results</Link>
            <Link to="/tips">Tips</Link>

            <div className="settings-wrapper">
              <button
                className="nav-button"
                onClick={() => setSettingsOpen(!settingsOpen)}
                type="button"
              >
                Settings
              </button>

              {settingsOpen && (
                <div className="settings-menu">
                  <button onClick={toggleTheme} type="button">
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
              )}
            </div>

            <button className="nav-button" onClick={handleLogout} type="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/tips">Tips</Link>

            <button
              className="nav-button"
              onClick={toggleTheme}
              type="button"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <Link to="/auth" className="cta-link">
              Get Started
            </Link>
          </>
        )}
        </div>
    </div>
    </nav>
  );
}

export default Navbar;