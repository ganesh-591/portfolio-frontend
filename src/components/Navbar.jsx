import React, { useState, useEffect } from "react";
import { ArrowUpRight, Sun, Moon } from "lucide-react";
import "./Navbar.css";

const NAV_ITEMS = [
  { id: "home", label: "HOME", num: "01" },
  { id: "about", label: "ABOUT", num: "02" },
  { id: "skills", label: "SKILLS", num: "03" },
  { id: "experience", label: "EXPERIENCE", num: "04" },
  { id: "projects", label: "PROJECTS", num: "05" },
  { id: "contact", label: "CONTACT", num: "06" },
];

export default function Navbar({ theme, onToggleTheme }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35);

      // Determine active section
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLinkClick = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className={`global-navbar ${isScrolled ? "is-scrolled" : ""}`}>
        {/* Brand Logo */}
        <a
          href="#home"
          className="nav-brand-logo"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick("home");
          }}
          aria-label="Ganesh Kopparthi Home"
        >
          <span className="nav-logo-text">
            Ganesh<span className="nav-logo-accent">.K</span>
          </span>
        </a>

        {/* Desktop Links */}
        <nav className="nav-links-cluster" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link-item ${isActive ? "is-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
              >
                {item.label}
                {isActive && <span className="nav-active-pill" layoutId="activeNav" />}
              </a>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="nav-actions-cluster">
          {/* Theme Toggle */}
          <button
            type="button"
            className="theme-toggle-btn"
            data-theme={theme}
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            <span className="theme-icon-moon">
              <Moon size={14} />
            </span>
            <span className="theme-icon-sun">
              <Sun size={14} />
            </span>
            <span className="theme-toggle-knob" />
          </button>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="nav-cta-btn"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("contact");
            }}
          >
            <span>LET'S TALK</span>
            <ArrowUpRight size={13} className="nav-cta-arrow" />
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={`nav-mobile-toggle ${isMenuOpen ? "is-open" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer & Backdrop */}
      <div
        className={`mobile-nav-backdrop ${isMenuOpen ? "is-open" : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <aside className={`nav-mobile-drawer ${isMenuOpen ? "is-open" : ""}`} aria-hidden={!isMenuOpen}>
        <div className="mobile-nav-links">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`mobile-nav-link ${activeSection === item.id ? "is-active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.id);
              }}
            >
              <span>{item.label}</span>
              <span className="mobile-nav-index">{item.num}</span>
            </a>
          ))}
        </div>

        <div className="mobile-nav-footer">
          <a
            href="#contact"
            className="mobile-nav-cta"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("contact");
            }}
          >
            <span>START A PROJECT</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </aside>
    </>
  );
}
