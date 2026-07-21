import { NavLink, Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { bounceSpring, resolveTransition } from "../lib/motion";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import UserMenu from "./UserMenu";
import "./Navbar.css";

const AUTHED_LINKS = [
  { to: "/dashboard", labelKey: "nav.survey" },
  { to: "/results", labelKey: "nav.results" },
  { to: "/history", labelKey: "nav.savedPlans" },
  { to: "/tips", labelKey: "nav.tips" },
  { to: "/glossary", labelKey: "nav.glossary" },
];

const GUEST_LINKS = [
  { to: "/", labelKey: "nav.home", end: true },
  { to: "/tips", labelKey: "nav.tips" },
  { to: "/glossary", labelKey: "nav.glossary" },
];

function Navbar() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const links = user ? AUTHED_LINKS : GUEST_LINKS;

  return (
    <div className="navbar-shell">
      <nav className="navbar-pill">
        <Link to="/" className="logo">
          <motion.span
            className="logo-inner"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
            transition={resolveTransition(bounceSpring, shouldReduceMotion)}
          >
            Sprout<span className="logo-accent">Fund</span>
          </motion.span>
        </Link>

        <div className="navbar-links">
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
                    {t(link.labelKey)}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          <ThemeToggle />
          <LanguageToggle />
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/auth" className="nav-signin">
                {t("nav.signIn")}
              </Link>
              <Link to="/dashboard" className="nav-cta">
                {t("common.getStarted")}
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
