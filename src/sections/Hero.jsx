import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowUpRight,
  ChevronDown,
  FileText,
  Mail,
  Code2,
  Download,
} from "lucide-react";
import portraitImg from "../assets/images/ganesh-portrait.png";
import TechText from "../components/TechText";
import "./Hero.css";

function GithubIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Hero({ theme }) {
  const heroRef = useRef(null);
  const viewportRef = useRef(null);
  const portraitRef = useRef(null);
  const backgroundLayerRef = useRef(null);
  const portraitImageRef = useRef(null);
  const introRef = useRef(null);
  const [introDismissed, setIntroDismissed] = useState(false);

  // Floating ambient embers
  const embers = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 85 + 8}%`,
    bottom: `${Math.random() * 25}%`,
    size: Math.random() * 2.5 + 1.8,
    duration: Math.random() * 4 + 4.5,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.5 + 0.25,
  }));

  // Cinematic Identity Reveal Intro
  useEffect(() => {
    const intro = introRef.current;
    if (!intro || introDismissed) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setIntroDismissed(true);
      intro.style.display = "none";
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroDismissed(true);
        if (intro) intro.style.display = "none";
      },
    });

    tl.fromTo(
      ".intro-welcome",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.35 }
    )
      .fromTo(
        ".intro-name",
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 0.45 },
        "-=0.1"
      )
      .fromTo(
        ".intro-role",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3 },
        "-=0.1"
      )
      .to(
        ".intro-progress-fill",
        {
          width: "100%",
          duration: 1.1,
          ease: "power2.inOut",
        },
        "-=0.05"
      )
      .to(intro, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
      });

    const handleSkip = (e) => {
      if (e.key === "Escape" || e.type === "click") {
        tl.progress(1);
      }
    };

    window.addEventListener("keydown", handleSkip);

    return () => {
      tl.kill();
      window.removeEventListener("keydown", handleSkip);
    };
  }, [introDismissed]);

  // Entrance animations for cockpit elements (runs once after intro is dismissed)
  useEffect(() => {
    if (!introDismissed) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        ".cockpit-viewport",
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.9 }
      )
        .fromTo(
          ".hud-hero-title-tech-wrapper",
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          ".hud-hero-subtitle, .hud-hero-tagline, .hud-action-cluster",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.4"
        )
        .fromTo(
          ".cockpit-portrait-layer",
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 1.0 },
          "-=0.7"
        )
        .fromTo(
          ".corner-bracket, .cockpit-top-notches, .scroll-indicator-widget, .cockpit-bottom-bar",
          { opacity: 0 },
          { opacity: 1, duration: 0.6, stagger: 0.05 },
          "-=0.4"
        );
    }, heroRef);

    return () => ctx.revert();
  }, [introDismissed]);

  // 3D Mouse Parallax Effect on Portrait & Cockpit Viewport
  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    const handlePointerMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (portraitImageRef.current) {
        gsap.to(portraitImageRef.current, {
          rotationY: x * 6,
          rotationX: -y * 4,
          x: x * 10,
          y: y * 6,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (backgroundLayerRef.current) {
        gsap.to(backgroundLayerRef.current, {
          x: -x * 12,
          y: -y * 8,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const handlePointerLeave = () => {
      if (portraitImageRef.current) {
        gsap.to(portraitImageRef.current, {
          rotationX: 0,
          rotationY: 0,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (backgroundLayerRef.current) {
        gsap.to(backgroundLayerRef.current, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <section className="cyber-cockpit-hero" ref={heroRef} id="home">
      {/* Cinematic Intro Screen */}
      {!introDismissed && (
        <div className="portfolio-intro" ref={introRef} onClick={() => setIntroDismissed(true)}>
          <div className="intro-content">
            <p className="intro-welcome">WELCOME TO THE PORTFOLIO OF</p>

            <h1 className="intro-name">
              GANESH KOPPARTHI<span>.</span>
            </h1>

            <p className="intro-role">JAVA FULL STACK DEVELOPER</p>

            <div className="intro-racing-loader">
              <div className="intro-progress-track">
                <div className="intro-progress-fill" />
              </div>
            </div>

            <div className="intro-actions-row">
              <span className="intro-caption">INITIALIZING CINEMATIC 3D EXPERIENCE</span>
              <button
                type="button"
                className="intro-skip-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIntroDismissed(true);
                }}
              >
                SKIP INTRO [ESC]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main 3D Cockpit Viewport */}
      <div className="cockpit-viewport-container">
        <div className="cockpit-viewport" ref={viewportRef}>
          {/* Background Layer with Volumetric Glow & Embers */}
          <div className="cockpit-background-layer" ref={backgroundLayerRef}>
            <div className="volumetric-smoke-cloud" />
            <div className="cockpit-ambient-rim" />

            <div className="cockpit-embers-field">
              {embers.map((ember) => (
                <span
                  key={ember.id}
                  className="cockpit-ember"
                  style={{
                    left: ember.left,
                    bottom: ember.bottom,
                    width: `${ember.size}px`,
                    height: `${ember.size}px`,
                    animationDuration: `${ember.duration}s`,
                    animationDelay: `${ember.delay}s`,
                    opacity: ember.opacity,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Portrait Layer - Seamless Blending with Natural Mask */}
          <div className="cockpit-portrait-layer" ref={portraitRef}>
            <div className="portrait-figure-wrapper">
              <img
                ref={portraitImageRef}
                className="portrait-image-element"
                src={portraitImg}
                alt="Portrait of Ganesh Kopparthi"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/ganesh-portrait.png";
                }}
              />
            </div>
          </div>

          {/* Left Content Overlay */}
          <div className="cockpit-content-overlay">
            <h1 className="hud-hero-title-tech-wrapper" aria-label="Ganesh Kopparthi">
              <TechText
                text={"GANESH\nKOPPARTHI"}
                fontWeight={900}
                fontSize={120}
                lineHeight={0.98}
                dashLength={4}
                dashGap={2}
                specks={15}
                clickKick
                guides={false}
                fontFamily="'Space Grotesk', sans-serif"
                letterSpacing={-0.03}
                accentColor="currentColor"
                reach={45}
                softness={0.7}
                lineStyle="dashed"
                strokeWidth={1.5}
                speed={1}
                bounce={0.4}
                selection
                labels
                color="currentColor"
                align="left"
                draggable
                sweep={false}
              />
            </h1>

            <h2 className="hud-hero-subtitle">
              JAVA FULL STACK DEVELOPER
              <span className="pipe">|</span>
              <span className="role-highlight">SPRING BOOT &amp; REACT</span>
            </h2>

            <p className="hud-hero-tagline">
              Architecting resilient, high-throughput microservices and crafting
              modern reactive web experiences with Java, Spring Boot, MySQL, and React.js.
            </p>

            <div className="hud-action-cluster">
              <a
                href="#projects"
                className="cockpit-primary-pill-btn"
                data-cursor="VIEW"
              >
                <span>EXPLORE MY WORK</span>
                <ChevronDown size={14} className="pill-dropdown-icon" />
              </a>

              <a
                href="#contact"
                className="cockpit-secondary-pill-btn"
                data-cursor="TALK"
              >
                <Mail size={14} />
                <span>CONTACT ME</span>
              </a>

              <a
                href="/resume.pdf"
                download="Ganesh_Kopparthi_Resume.pdf"
                className="cockpit-resume-btn"
                data-cursor="RESUME"
                aria-label="Download Ganesh Kopparthi's Resume PDF"
              >
                <Download size={14} />
                <span>DOWNLOAD RESUME</span>
              </a>
            </div>
          </div>

          {/* Viewport Tech Accents */}
          <div className="cockpit-top-notches">
            <span className="notch n1" />
            <span className="notch n2" />
            <span className="notch n3" />
          </div>

          <div className="corner-bracket top-left" />
          <div className="corner-bracket top-right" />
          <div className="corner-bracket bottom-left" />
          <div className="corner-bracket bottom-right" />

          <div className="scroll-indicator-widget">
            <div className="scroll-mouse-icon">
              <span className="scroll-dot" />
            </div>
            <span className="scroll-text">SCROLL DOWN</span>
          </div>

          {/* Bottom Coordinates & Metadata Bar */}
          <div className="cockpit-bottom-bar">
            <div className="bottom-marker-left">
              <span className="tech-code">SYS.STATUS // ACTIVE</span>
              <span className="tech-sep">|</span>
              <span className="tech-code">LOC: HYDERABAD, INDIA</span>
            </div>

            <div className="bottom-marker-right">
              <a
                href="https://github.com/ganesh-591"
                target="_blank"
                rel="noreferrer"
                className="hud-social-link"
                data-cursor="GITHUB"
              >
                <GithubIcon size={13} />
                <span>GITHUB</span>
              </a>

              <a
                href="https://www.linkedin.com/in/ganesh-kopparthi-716664300/"
                target="_blank"
                rel="noreferrer"
                className="hud-social-link"
                data-cursor="LINKEDIN"
              >
                <LinkedinIcon size={13} />
                <span>LINKEDIN</span>
              </a>

              <a
                href="mailto:ganeshkopparthi591@gmail.com"
                className="hud-social-link"
                data-cursor="EMAIL"
              >
                <Mail size={13} />
                <span>EMAIL</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
