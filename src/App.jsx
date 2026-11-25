import React, { useState, useEffect } from "react";
import AtmosphericBackground from "./components/AtmosphericBackground";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("portfolio-theme");
      if (saved === "light" || saved === "dark") return saved;
      return "dark"; // Default to dark theme on first visit
    } catch {
      return "dark";
    }
  });

  // Ensure scroll position resets to Hero on load/refresh and disable automatic restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // storage unavailable
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      {/* Global Interactive Cursor & Atmospheric Canvas */}
      <CustomCursor theme={theme} />
      <AtmosphericBackground theme={theme} />

      {/* Fixed Top Navbar with Theme Toggle & Mobile Menu */}
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      {/* Portfolio Sections */}
      <main id="main-content">
        <Hero theme={theme} onToggleTheme={toggleTheme} />
        <About theme={theme} />
        <Skills theme={theme} />
        <Experience theme={theme} />
        <Projects theme={theme} />
        <Contact theme={theme} />
      </main>

      {/* Floating WhatsApp Chat Button */}
      <WhatsAppButton />
    </>
  );
}

export default App;
