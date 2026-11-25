import React, { useEffect, useRef } from "react";

export default function AtmosphericBackground({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smoothing
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 280,
    };

    // Responsive particle count based on screen width
    const particleCount = width < 768 ? 35 : 75;
    const particles = [];

    const isDark = theme === "dark";
    const particleColor = isDark ? "255, 255, 255" : "255, 255, 255";
    const spotlightColor = isDark
      ? "rgba(255, 255, 255, 0.035)"
      : "rgba(255, 255, 255, 0.055)";

    class Particle {
      constructor() {
        this.reset();
        // Distribute initially
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 20;
        this.size = Math.random() * 1.8 + 0.6; // depth simulation
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.baseOpacity = Math.random() * 0.45 + 0.15;
        this.opacity = this.baseOpacity;
        this.depth = Math.random() * 0.6 + 0.4;
      }

      update() {
        this.y -= this.speedY * this.depth;
        this.x += this.speedX;

        // Subtle reaction to cursor spotlight
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.6;
          this.x -= (dx / dist) * force;
          this.y -= (dy / dist) * force;
          this.opacity = Math.min(0.85, this.baseOpacity + force * 0.5);
        } else {
          this.opacity = this.baseOpacity;
        }

        if (this.y < -20 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${this.opacity})`;
        ctx.shadowBlur = this.size > 1.2 ? 6 : 0;
        ctx.shadowColor = `rgba(${particleColor}, 0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handlePointerMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", handleResize);

    const render = () => {
      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Draw cursor-reactive radial spotlight
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        mouse.radius
      );
      gradient.addColorStop(0, spotlightColor);
      gradient.addColorStop(0.5, isDark ? "rgba(255, 255, 255, 0.012)" : "rgba(255, 255, 255, 0.025)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
}
