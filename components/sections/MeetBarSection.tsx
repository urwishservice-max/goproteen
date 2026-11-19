'use client';

import React, { useState } from 'react';

interface MeetBarSectionProps {
  isWrapped: boolean;
  onToggleWrap: (wrapped: boolean) => void;
  onCrunch: () => void;
}

export default function MeetBarSection({
  isWrapped,
  onToggleWrap,
  onCrunch,
}: MeetBarSectionProps) {
  return (
    <section
      id="meet"
      className="min-h-screen px-[8vw] py-[20vh] flex flex-col justify-center items-center text-center relative"
      data-bar="0 -0.05 1.4 -0.5 0 1 1 0"
      data-orb="0 0 1.5 0 1"
      data-theme="v"
    >
      <span className="mono mb-2">05 — Meet GoProteen</span>

      <h2 className="text-[clamp(4rem,14vw,11rem)] font-extrabold tracking-[-0.05em] leading-[0.85] text-fg select-none my-3">
        UNWRAP
      </h2>

      <div className="my-6 z-10">
        <button
          className="btn s"
          onClick={() => onToggleWrap(!isWrapped)}
        >
          {isWrapped ? 'Unwrap the bar' : 'Wrap it again'}
        </button>
      </div>

      <span className="mono text-xs tracking-widest my-2 text-mut">
        Drag to spin · click to crunch
      </span>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mt-12 w-full z-10">
        <div className="p-4 rounded-xl border border-line bg-glass backdrop-blur-md">
          <div className="text-2xl font-semibold text-fg">10 g</div>
          <div className="text-xs text-mut uppercase font-mono mt-1">Fermented yeast</div>
        </div>
        <div className="p-4 rounded-xl border border-line bg-glass backdrop-blur-md">
          <div className="text-2xl font-semibold text-fg">102</div>
          <div className="text-xs text-mut uppercase font-mono mt-1">Calories only</div>
        </div>
        <div className="p-4 rounded-xl border border-line bg-glass backdrop-blur-md">
          <div className="text-2xl font-semibold text-fg">0%</div>
          <div className="text-xs text-mut uppercase font-mono mt-1">Added sugar</div>
        </div>
        <div className="p-4 rounded-xl border border-line bg-glass backdrop-blur-md">
          <div className="text-2xl font-semibold text-fg">100%</div>
          <div className="text-xs text-mut uppercase font-mono mt-1">Vegan & clean</div>
        </div>
      </div>
    </section>
  );
}
