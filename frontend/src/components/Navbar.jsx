import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { bounceSpring, quickFade, resolveTransition } from "../lib/motion";
import { useScrolled } from "../hooks/useScrolled";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

const AUTHED_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/results", label: "Results" },
  { to: "/history", label: "Saved Plans" },
  { to: "/tips", label: "Tips" },
  { to: "/glossary", label: "Glossary" },
];

const GUEST_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/tips", label: "Tips" },
  { to: "/glossary", label: "Glossary" },
];

function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isScrolled } = useScrolled();
  const shouldReduceMotion = useReducedMotion();

  async function handleLogout() {
    await logout();
    navigate("/auth");
  }

  const links = user ? AUTHED_LINKS : GUEST_LINKS;

  return (
    <nav className={`navbar${isScrolled ? " scrolled" : ""}`}>
      <div className="navbar-content">
        <Link to="/" className="logo">
          <motion.span
            className="logo-inner"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
            transition={resolveTransition(bounceSpring, shouldReduceMotion)}
          >
            Sprout
            <motion.span
              className="logo-accent"
              whileHover={shouldReduceMotion ? undefined : { rotate: [0, -8, 8, -4, 0] }}
              transition={{ duration: 0.4 }}
            >
              Fund
            </motion.span>
          </motion.span>
        </Link>

        <div className="nav-pill">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav-link">
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="nav-active-pill"
                      transition={resolveTransition(bounceSpring, shouldReduceMotion)}
                    />
                  )}
                  <span className={`nav-link-label${isActive ? " active" : ""}`}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {user ? (
            <>
              <div className="settings-wrapper">
                <button
                  className="nav-button"
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  type="button"
                >
                  Settings
                </button>

                <AnimatePresence>
                  {settingsOpen && (
                    <motion.div
                      className="settings-menu"
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: resolveTransition(bounceSpring, shouldReduceMotion),
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        y: -6,
                        transition: resolveTransition(quickFade, shouldReduceMotion),
                      }}
                    >
                      <ThemeToggle />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="nav-button" onClick={handleLogout} type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <ThemeToggle />
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
