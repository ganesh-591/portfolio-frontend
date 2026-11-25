import React, { useRef, useEffect, useCallback } from "react";

/**
 * TechText - Interactive blueprint / technical text component inspired by React Bits
 * Features dashed letter outlines, bounding box selection, dimension labels,
 * floating technical specks, idle sweep, and spring physics (drag & clickKick).
 */
export default function TechText({
  text = "GANESH\nKOPPARTHI",
  fontSize = 68,
  fontWeight = 800,
  fontFamily = "'Space Grotesk', 'Inter', sans-serif",
  letterSpacing = -0.04,
  lineHeight = 1.05,
  color = "currentColor",
  accentColor = "currentColor",
  lineStyle = "dashed",
  dashLength = 4,
  dashGap = 2,
  strokeWidth = 1.5,
  reach = 180,
  softness = 0.7,
  specks = 15,
  selection = true,
  labels = true,
  draggable = true,
  clickKick = true,
  bounce = 0.4,
  sweep = true,
  speed = 1,
  align = "left", // 'left' | 'center' | 'right'
  className = "",
  style = {},
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Interaction and animation state (kept in ref to avoid re-renders at 60fps)
  const stateRef = useRef({
    pointer: { x: -9999, y: -9999, isDown: false, isOver: false },
    activeCharIndex: -1,
    draggedCharIndex: -1,
    dragOffset: { x: 0, y: 0 },
    lastPointerMoveTime: Date.now(),
    sweepPos: -100,
    glyphs: [],
    speckList: [],
    animId: null,
  });

  // Helper to resolve CSS color or currentColor
  const resolveColor = useCallback((col) => {
    if (!col || col === "currentColor") {
      if (containerRef.current) {
        return window.getComputedStyle(containerRef.current).color || "#FFFFFF";
      }
      return "#FFFFFF";
    }
    return col;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    // Initialize specks pool
    stateRef.current.speckList = Array.from({ length: specks }, () => ({
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      size: Math.random() > 0.5 ? 2.5 : 3.5,
      opacity: Math.random() * 0.7 + 0.3,
      driftAngle: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.8 + 0.3,
    }));

    // Calculate layout of characters
    const calculateGlyphs = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      if (width <= 0 || height <= 0) return;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Responsive base upper-limit font size
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
      let calculatedFontSize = fontSize;
      if (screenWidth < 360) {
        calculatedFontSize = Math.min(calculatedFontSize, 40);
      } else if (screenWidth < 480) {
        calculatedFontSize = Math.min(calculatedFontSize, 48);
      } else if (screenWidth < 768) {
        calculatedFontSize = Math.min(calculatedFontSize, 66);
      } else if (screenWidth < 1200) {
        calculatedFontSize = Math.min(calculatedFontSize, 96);
      }

      const lines = text.split("\n");

      // Measure text width using actual canvas metrics to GUARANTEE no clipping of letters like 'H' and 'I'
      const safeWidth = Math.max(50, width - 12);
      ctx.font = `${fontWeight} ${calculatedFontSize}px ${fontFamily}`;

      let maxLineWidth = 0;
      lines.forEach((lineStr) => {
        let lineW = 0;
        for (const char of lineStr) {
          const m = ctx.measureText(char);
          lineW += m.width + calculatedFontSize * letterSpacing;
        }
        if (lineW > maxLineWidth) maxLineWidth = lineW;
      });

      // If measured line width exceeds safe container width, scale font size down proportionally
      if (maxLineWidth > safeWidth && maxLineWidth > 0) {
        calculatedFontSize = Math.max(18, Math.floor(calculatedFontSize * (safeWidth / maxLineWidth)));
        ctx.font = `${fontWeight} ${calculatedFontSize}px ${fontFamily}`;
      }

      // Also ensure height fits container safely
      const lineHeights = calculatedFontSize * lineHeight;
      const totalTextHeight = lines.length * lineHeights;
      if (totalTextHeight > height - 8 && height > 40) {
        calculatedFontSize = Math.max(18, Math.floor(calculatedFontSize * ((height - 8) / totalTextHeight)));
        ctx.font = `${fontWeight} ${calculatedFontSize}px ${fontFamily}`;
      }

      const finalLineHeights = calculatedFontSize * lineHeight;
      const finalTotalHeight = lines.length * finalLineHeights;
      const startY = Math.max(
        calculatedFontSize * 0.82,
        (height - finalTotalHeight) / 2 + calculatedFontSize * 0.82
      );

      const glyphs = [];

      lines.forEach((lineStr, lineIdx) => {
        const chars = Array.from(lineStr);
        let currentLineY = startY + lineIdx * finalLineHeights;

        // Measure line width with letterSpacing
        let lineWidth = 0;
        const charMetrics = chars.map((char) => {
          const m = ctx.measureText(char);
          const charW = m.width + calculatedFontSize * letterSpacing;
          lineWidth += charW;
          return {
            char,
            width: m.width,
            advance: charW,
            ascent: m.actualBoundingBoxAscent || calculatedFontSize * 0.75,
            descent: m.actualBoundingBoxDescent || calculatedFontSize * 0.2,
          };
        });

        // Determine line start X
        let currentLineX = 0;
        if (align === "center") {
          currentLineX = Math.max(2, (width - lineWidth) / 2);
        } else if (align === "right") {
          currentLineX = Math.max(2, width - lineWidth - 10);
        } else {
          currentLineX = 2; // Left align
        }

        chars.forEach((char, charIdx) => {
          const m = charMetrics[charIdx];
          glyphs.push({
            char,
            lineIndex: lineIdx,
            charIndex: charIdx,
            baseX: currentLineX,
            baseY: currentLineY,
            width: m.width,
            height: m.ascent + m.descent,
            ascent: m.ascent,
            descent: m.descent,
            x: currentLineX,
            y: currentLineY,
            offsetX: 0,
            offsetY: 0,
            vx: 0,
            vy: 0,
            springK: 0.14 + (1 - Math.min(0.9, bounce)) * 0.08,
            damping: 0.8 + Math.min(0.12, (1 - bounce) * 0.1),
          });
          currentLineX += m.advance;
        });
      });

      stateRef.current.glyphs = glyphs;
    };

    calculateGlyphs();

    // Re-calculate when web fonts (Space Grotesk) finish loading over the network
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        calculateGlyphs();
      });
    }

    const handleResize = () => {
      calculateGlyphs();
    };

    window.addEventListener("resize", handleResize);

    // Watch container size changes (e.g. intro dismiss, reflow, responsive scale)
    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        calculateGlyphs();
      });
      resizeObserver.observe(container);
    }

    // Pointer events
    const getPointerCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onPointerMove = (e) => {
      const coords = getPointerCoords(e);
      stateRef.current.pointer.x = coords.x;
      stateRef.current.pointer.y = coords.y;
      stateRef.current.pointer.isOver = true;
      stateRef.current.lastPointerMoveTime = Date.now();

      // Handle dragging
      if (draggable && stateRef.current.pointer.isDown && stateRef.current.draggedCharIndex !== -1) {
        const glyph = stateRef.current.glyphs[stateRef.current.draggedCharIndex];
        if (glyph) {
          glyph.offsetX = coords.x - glyph.baseX - stateRef.current.dragOffset.x;
          glyph.offsetY = coords.y - glyph.baseY - stateRef.current.dragOffset.y;
          glyph.vx = 0;
          glyph.vy = 0;
        }
      }
    };

    const onPointerDown = (e) => {
      const coords = getPointerCoords(e);
      stateRef.current.pointer.x = coords.x;
      stateRef.current.pointer.y = coords.y;
      stateRef.current.pointer.isDown = true;

      // Find clicked glyph
      let clickedIdx = -1;
      stateRef.current.glyphs.forEach((g, idx) => {
        const centerX = g.baseX + g.width / 2 + g.offsetX;
        const centerY = g.baseY - g.ascent / 2 + g.offsetY;
        const boxLeft = g.baseX + g.offsetX - 6;
        const boxRight = g.baseX + g.width + g.offsetX + 6;
        const boxTop = g.baseY - g.ascent + g.offsetY - 6;
        const boxBottom = g.baseY + g.descent + g.offsetY + 6;

        if (coords.x >= boxLeft && coords.x <= boxRight && coords.y >= boxTop && coords.y <= boxBottom) {
          clickedIdx = idx;
        }
      });

      if (clickedIdx !== -1) {
        const g = stateRef.current.glyphs[clickedIdx];
        if (draggable) {
          stateRef.current.draggedCharIndex = clickedIdx;
          stateRef.current.dragOffset.x = coords.x - (g.baseX + g.offsetX);
          stateRef.current.dragOffset.y = coords.y - (g.baseY + g.offsetY);
        }

        if (clickKick) {
          // Kick active letter upward
          g.vy -= 18;
          // Send ripple to neighbors
          if (stateRef.current.glyphs[clickedIdx - 1]) {
            stateRef.current.glyphs[clickedIdx - 1].vy -= 9;
          }
          if (stateRef.current.glyphs[clickedIdx + 1]) {
            stateRef.current.glyphs[clickedIdx + 1].vy -= 9;
          }
        }
      }
    };

    const onPointerUp = () => {
      stateRef.current.pointer.isDown = false;
      stateRef.current.draggedCharIndex = -1;
    };

    const onPointerLeave = () => {
      stateRef.current.pointer.x = -9999;
      stateRef.current.pointer.y = -9999;
      stateRef.current.pointer.isOver = false;
      stateRef.current.pointer.isDown = false;
      stateRef.current.draggedCharIndex = -1;
      stateRef.current.activeCharIndex = -1;
    };

    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);

    // Animation Loop
    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min(32, time - lastTime) / 1000;
      lastTime = time;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const resolvedTextColor = resolveColor(color);
      const resolvedAccentColor = resolveColor(accentColor);

      // Determine active glyph directly under cursor pointer
      const pointer = stateRef.current.pointer;
      let activeIdx = -1;

      if (stateRef.current.draggedCharIndex !== -1) {
        activeIdx = stateRef.current.draggedCharIndex;
      } else if (pointer.isOver) {
        let minDistance = 9999;
        stateRef.current.glyphs.forEach((g, idx) => {
          const charCenterX = g.x + g.width / 2;
          const charCenterY = g.y - g.ascent / 2;
          const boxLeft = g.x - 8;
          const boxRight = g.x + g.width + 8;
          const boxTop = g.y - g.ascent - 8;
          const boxBottom = g.y + g.descent + 8;

          const inside =
            pointer.x >= boxLeft &&
            pointer.x <= boxRight &&
            pointer.y >= boxTop &&
            pointer.y <= boxBottom;
          const dist = Math.hypot(pointer.x - charCenterX, pointer.y - charCenterY);

          if (inside) {
            activeIdx = idx;
            minDistance = -1;
          } else if (minDistance >= 0 && dist < 45 && dist < minDistance) {
            minDistance = dist;
            activeIdx = idx;
          }
        });
      }

      stateRef.current.activeCharIndex = activeIdx;

      // Render each glyph
      stateRef.current.glyphs.forEach((g, idx) => {
        if (!g.char.trim()) return; // Skip spaces

        const charCenterX = g.x + g.width / 2;
        const charCenterY = g.y - g.ascent / 2;

        const isTargetLetter = idx === stateRef.current.activeCharIndex;

        // Bounding box dimensions
        const padX = 6;
        const padY = 6;
        const boxX = g.x - padX;
        const boxY = g.y - g.ascent - padY;
        const boxW = g.width + padX * 2;
        const boxH = g.ascent + g.descent + padY * 2;

        if (isTargetLetter) {
          // Technical Dashed Outline state ONLY for the hovered letter
          ctx.lineWidth = strokeWidth;
          if (lineStyle === "dashed") {
            ctx.setLineDash([dashLength, dashGap]);
          } else {
            ctx.setLineDash([]);
          }
          ctx.strokeStyle = resolvedTextColor;
          ctx.strokeText(g.char, g.x, g.y);
        } else {
          // Normal solid block state for all other letters
          ctx.setLineDash([]);
          ctx.fillStyle = resolvedTextColor;
          ctx.fillText(g.char, g.x, g.y);
        }

        // Selection Box & Handles ONLY for the active glyph
        if (isTargetLetter && selection) {
          // Bounding Box Rectangle
          ctx.save();
          ctx.setLineDash([]);
          ctx.lineWidth = 1;
          ctx.strokeStyle = resolvedAccentColor;
          ctx.strokeRect(boxX, boxY, boxW, boxH);

          // 4 Corner Square Handles
          const handleSize = 4.5;
          const halfH = handleSize / 2;
          ctx.fillStyle = resolvedAccentColor;

          // Top-Left
          ctx.fillRect(boxX - halfH, boxY - halfH, handleSize, handleSize);
          // Top-Right
          ctx.fillRect(boxX + boxW - halfH, boxY - halfH, handleSize, handleSize);
          // Bottom-Left
          ctx.fillRect(boxX - halfH, boxY + boxH - halfH, handleSize, handleSize);
          // Bottom-Right
          ctx.fillRect(boxX + boxW - halfH, boxY + boxH - halfH, handleSize, handleSize);

          // Top Technical Metric Label (e.g. "G  52 x 78")
          if (labels) {
            ctx.font = `600 9px monospace`;
            ctx.fillStyle = resolvedAccentColor;
            const labelStr = `${g.char.toLowerCase()}  ${Math.round(boxW)} × ${Math.round(boxH)}`;
            ctx.fillText(labelStr, boxX, boxY - 6);
          }

          // Technical Floating Specks / Bits
          if (specks > 0) {
            stateRef.current.speckList.forEach((spk, sIdx) => {
              spk.driftAngle += 0.04 * spk.driftSpeed;
              const radiusX = boxW * 0.75;
              const radiusY = boxH * 0.75;
              const spkX = charCenterX + Math.cos(spk.driftAngle + sIdx) * radiusX;
              const spkY = charCenterY + Math.sin(spk.driftAngle * 1.2 + sIdx) * radiusY;

              ctx.fillStyle = resolvedAccentColor;
              ctx.globalAlpha = spk.opacity;
              ctx.fillRect(spkX - spk.size / 2, spkY - spk.size / 2, spk.size, spk.size);
            });
            ctx.globalAlpha = 1;
          }

          ctx.restore();
        }
      });

      ctx.restore();
      stateRef.current.animId = requestAnimationFrame(render);
    };

    stateRef.current.animId = requestAnimationFrame(render);

    return () => {
      if (stateRef.current.animId) {
        cancelAnimationFrame(stateRef.current.animId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [
    text,
    fontSize,
    fontWeight,
    fontFamily,
    letterSpacing,
    lineHeight,
    color,
    accentColor,
    lineStyle,
    dashLength,
    dashGap,
    strokeWidth,
    reach,
    softness,
    specks,
    selection,
    labels,
    draggable,
    clickKick,
    bounce,
    sweep,
    speed,
    align,
    resolveColor,
  ]);

  return (
    <div
      ref={containerRef}
      className={`tech-text-container ${className}`}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: "default",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          touchAction: "none",
        }}
        aria-label={text.replace("\n", " ")}
      />
    </div>
  );
}
