import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Work", path: "/" },
  { label: "Personal", path: "/personal" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: scrolled ? "1px solid #1f1f1f" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        backgroundColor: scrolled ? "rgba(8,8,8,0.85)" : "transparent",
        transition: "all 0.3s ease",
        padding: "0 2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "#e8ff47",
            textDecoration: "none",
            letterSpacing: "0.05em",
          }}
        >
          VD
        </Link>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            alignItems: "center",
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.75rem",
                  color: isActive ? "#f0f0f0" : "#555555",
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  position: "relative",
                  paddingBottom: "4px",
                  transition: "color 0.2s ease",
                }}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      backgroundColor: "#e8ff47",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: location + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "0.7rem",
              color: "#555555",
              letterSpacing: "0.06em",
            }}
            className="location-text"
          >
            Lawrence, KS
          </span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              display: "none",
              flexDirection: "column",
              gap: "5px",
            }}
            className="hamburger"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              style={{
                display: "block",
                width: "20px",
                height: "1px",
                backgroundColor: "#f0f0f0",
                transformOrigin: "center",
              }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              style={{
                display: "block",
                width: "20px",
                height: "1px",
                backgroundColor: "#f0f0f0",
              }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              style={{
                display: "block",
                width: "20px",
                height: "1px",
                backgroundColor: "#f0f0f0",
                transformOrigin: "center",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: "hidden",
              borderTop: "1px solid #1f1f1f",
              backgroundColor: "#080808",
            }}
          >
            <div style={{ padding: "1.5rem 0", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      fontFamily: "DM Mono, monospace",
                      fontSize: "0.85rem",
                      color: isActive ? "#e8ff47" : "#f0f0f0",
                      textDecoration: "none",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
          .location-text { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
