import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import "./Navbar.css";

function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo" onClick={() => setSettingsOpen(false)}>
          Sprout<span>Fund</span>
        </Link>

        <div className="nav-pill">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setSettingsOpen(false)}>
                Dashboard
              </Link>
              <Link to="/results" onClick={() => setSettingsOpen(false)}>
                Results
              </Link>
              <Link to="/tips" onClick={() => setSettingsOpen(false)}>
                Tips
              </Link>
              <Link to="/glossary" onClick={() => setSettingsOpen(false)}>
                Glossary
              </Link>

              <div className="settings-wrapper">
                <button
                  className="nav-button"
                  onClick={() => setSettingsOpen((current) => !current)}
                  type="button"
                >
                  Settings
                </button>

                {settingsOpen && (
                  <div className="settings-menu">
                    <ThemeToggle />
                  </div>
                )}
              </div>

              <div className="user-menu-inline">
                <span className="nav-user-greeting">Hi, {firstName}</span>
                <UserMenu />
              </div>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setSettingsOpen(false)}>
                Home
              </Link>
              <Link to="/dashboard" onClick={() => setSettingsOpen(false)}>
                Dashboard
              </Link>
              <Link to="/tips" onClick={() => setSettingsOpen(false)}>
                Tips
              </Link>
              <Link to="/glossary" onClick={() => setSettingsOpen(false)}>
                Glossary
              </Link>

              <div className="settings-wrapper">
                <button
                  className="nav-button"
                  onClick={() => setSettingsOpen((current) => !current)}
                  type="button"
                >
                  Settings
                </button>

                {settingsOpen && (
                  <div className="settings-menu">
                    <ThemeToggle />
                  </div>
                )}
              </div>

              <Link to="/auth" className="cta-link" onClick={() => setSettingsOpen(false)}>
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