import { NavLink, Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { bounceSpring, resolveTransition } from "../lib/motion";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import "./Navbar.css";

const AUTHED_LINKS = [
  { to: "/dashboard", label: "Survey" },
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
  const { user } = useAuth();
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
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          <ThemeToggle />
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/auth" className="nav-signin">
                Sign in
              </Link>
              <Link to="/dashboard" className="nav-cta">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
