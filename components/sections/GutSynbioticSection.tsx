'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Bubble {
  x: number;
  y: number;
  r: number;
  v: number;
  a: number;
  label?: string;
  popped?: boolean;
}

export default function GutSynbioticSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [poppedCount, setPoppedCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const labels = ['Prebiotic', 'Probiotic', 'Yeast Protein', 'Leucine', 'GLP-1', 'B. coagulans', 'FOS', 'Gut Active'];

    let bubbles: Bubble[] = Array.from({ length: 24 }, (_, i) => ({
      x: Math.random() * width,
      y: height + Math.random() * 200,
      r: 18 + Math.random() * 26,
      v: 0.5 + Math.random() * 0.9,
      a: Math.random() * 6,
      label: labels[i % labels.length],
    }));

    let mouseX = -999;
    let mouseY = -999;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      bubbles.forEach((b) => {
        const d = Math.hypot(clickX - b.x, clickY - b.y);
        if (d < b.r + 10) {
          b.popped = true;
          b.y = -100;
          setPoppedCount((prev) => prev + 1);
        }
      });
    };

    const handleResize = () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      bubbles.forEach((b) => {
        b.y -= b.v;
        b.a += 0.02;
        b.x += Math.sin(b.a) * 0.45;

        // Pointer repulsion
        const dx = b.x - mouseX;
        const dy = b.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0) {
          const force = (1 - dist / 120) * 4;
          b.x += (dx / dist) * force;
          b.y += (dy / dist) * force;
        }

        // Reset if floated above top
        if (b.y < -b.r * 2) {
          b.y = height + b.r * 2 + Math.random() * 80;
          b.x = Math.random() * width;
        }

        // Draw glowing gradient bubble
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(
          b.x - b.r * 0.3,
          b.y - b.r * 0.3,
          b.r * 0.1,
          b.x,
          b.y,
          b.r
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        grad.addColorStop(0.5, 'rgba(255, 138, 43, 0.25)');
        grad.addColorStop(1, 'rgba(91, 33, 182, 0.35)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.stroke();

        // Label inside bubble
        if (b.label) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.label, b.x, b.y);
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      id="gut"
      ref={containerRef}
      className="min-h-screen px-[8vw] py-[20vh] flex flex-col justify-center relative overflow-hidden"
      data-bar="1.25 0.6 0.4 0.4 0 0.2 0 0"
      data-orb="-1 0 0.8 90 0.5"
    >
      {/* Background Interactive Bubble Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-0"
      />

      <div className="relative z-10">
        <span className="mono mb-2 block">07 — Synbiotic gut ecology</span>

        <h2 className="text-[clamp(2.4rem,6.5vw,5.5rem)] font-extralight tracking-tight leading-[0.95] max-w-[13ch] my-4 text-fg">
          Light. Comfortable. Steady.
        </h2>

        <p className="max-w-[48ch] text-mut mb-6">
          Powered by clinically studied prebiotic fibre and probiotics.* Push the bubbles or pop them by tapping:
        </p>

        {/* 3 Gut Health Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[680px] my-6">
          <div className="p-5 rounded-2xl border border-line bg-glass backdrop-blur-md">
            <span className="mono text-[10px] text-amber-500 block mb-1">Glycemic control</span>
            <h3 className="text-lg font-light mb-1 text-fg">Lock blood sugar</h3>
            <p className="text-xs text-mut leading-relaxed">
              Soluble chicory & date prebiotic fibre slows digestion for zero rapid sugar spikes.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-line bg-glass backdrop-blur-md">
            <span className="mono text-[10px] text-purple-400 block mb-1">Natural satiety</span>
            <h3 className="text-lg font-light mb-1 text-fg">GLP-1 & PYY</h3>
            <p className="text-xs text-mut leading-relaxed">
              Fermentation byproducts signal healthy fullness directly to hunger receptors in the brain.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-line bg-glass backdrop-blur-md">
            <span className="mono text-[10px] text-emerald-400 block mb-1">Microbiome active</span>
            <h3 className="text-lg font-light mb-1 text-fg">Effortless Gut</h3>
            <p className="text-xs text-mut leading-relaxed">
              Spore-forming probiotics survive stomach acid to flourish inside your lower intestines.
            </p>
          </div>
        </div>

        {poppedCount > 0 && (
          <span className="mono text-xs text-amber-500 animate-pulse">
            {poppedCount} synbiotic nutrient bubbles released ✓
          </span>
        )}
      </div>
    </section>
  );
}
