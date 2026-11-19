'use client';

import React, { useState, useRef } from 'react';

export default function CellsSection() {
  const [isAwake, setIsAwake] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const cells = containerRef.current.querySelectorAll<HTMLElement>('.cell-node');

    cells.forEach((cell) => {
      const rect = cell.getBoundingClientRect();
      const cellCenterX = rect.left + rect.width / 2;
      const cellCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cellCenterX, e.clientY - cellCenterY);
      const intensity = Math.max(0, 1 - dist / 110);

      cell.style.transform = `scale(${1 + intensity * 0.85})`;
      if (!isAwake) {
        cell.style.backgroundColor = intensity > 0.05 ? `rgba(255, 138, 43, ${intensity})` : '';
      }
    });
  };

  const handlePointerLeave = () => {
    if (!containerRef.current) return;
    const cells = containerRef.current.querySelectorAll<HTMLElement>('.cell-node');
    cells.forEach((cell) => {
      cell.style.transform = 'scale(1)';
      if (!isAwake) {
        cell.style.backgroundColor = '';
      }
    });
  };

  return (
    <section
      className="min-h-screen px-[8vw] py-[20vh] flex flex-col justify-center relative"
      data-bar="0 0 0.3 0 0 0 0 0"
      data-orb="0 0 1.2 120 0.6"
      data-theme="v"
    >
      <span className="mono mb-2">Hard-of-hearing cells</span>

      <h2 className="text-[clamp(2.4rem,6.5vw,5.5rem)] font-extralight tracking-tight leading-[0.95] max-w-[13ch] my-4 text-fg">
        It was never a lack of discipline.
      </h2>

      <p className="max-w-[48ch] text-mut mb-6">
        Muscle can respond less to ordinary protein signals as we age. Dense, high-quality protein rich in leucine may help muscle listen again.* Move your cursor over the cells.
      </p>

      {/* 60 Interactive Cell Nodes Grid */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-3 max-w-[560px] p-6 rounded-2xl border border-line bg-glass backdrop-blur-md my-4 transition-all duration-700 ${
          isAwake ? 'shadow-[0_0_35px_rgba(255,138,43,0.35)] border-amber-500/40' : ''
        }`}
      >
        {Array.from({ length: 60 }).map((_, i) => (
          <i
            key={i}
            className={`cell-node w-5 h-5 rounded-full border border-line transition-all duration-200 block ${
              isAwake
                ? 'bg-gradient-to-br from-amber-500 to-rose-500 border-transparent shadow-[0_0_8px_rgba(255,138,43,0.7)]'
                : 'bg-fg/10'
            }`}
          />
        ))}
      </div>

      <div className="mt-4">
        <button
          className={`btn ${isAwake ? 's border-amber-500' : ''}`}
          onClick={() => setIsAwake(!isAwake)}
        >
          {isAwake ? 'Cells awake (Leucine saturated)' : 'Wake the cells with leucine'}
        </button>
      </div>

      {/* Anabolic Resistance Story Disclosure */}
      <details className="story">
        <summary>Read the full story · The “hard-of-hearing” cells (anabolic resistance)</summary>
        <div>
          <p>
            “Notice what happens when you eat your normal meals… or go for your daily walks… doing everything you were told was ‘right.’ And yet… when you look in the mirror… your firm muscle tone is fading away. You feel progressively weaker… wondering why your honest effort isn’t paying off.
          </p>
          <p>
            Here is the hidden truth your body has been keeping from you: Your muscle cells have developed anabolic resistance. They have gone hard of hearing… completely ignoring the standard protein signals… you send them every single day. They discard precious amino acids… instead of using them to rebuild your strength.
          </p>
          <p>
            Your middle-aged muscle receptors require a precise, dense concentration of leucine… to bypass this cellular barrier and wake up your repair engines. Isn’t it a relief to understand that it was never a lack of discipline… but simply your cells turning hard of hearing to ordinary food? Hold that thought… because what I am about to share next explains that heavy afternoon slump you feel every single day…”
          </p>
        </div>
      </details>
    </section>
  );
}
