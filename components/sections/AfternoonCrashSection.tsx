'use client';

import React, { useState } from 'react';

const MEAL_PATHS = [
  // 0: Rice + roti: quick peak, sharp crash
  "M0 110 C90 110 110 30 180 30 S260 140 340 140 S430 110 520 110",
  // 1: Tea + biscuit: sudden steep spike, drastic deep slump
  "M0 110 C60 110 90 10 150 20 S230 150 330 148 S440 120 520 118",
  // 2: With GoProteen: smooth, balanced, steady sustained curve
  "M0 100 C130 90 200 70 260 74 S400 90 520 84",
];

export default function AfternoonCrashSection() {
  const [activeMeal, setActiveMeal] = useState(0);

  return (
    <section
      className="min-h-screen px-[8vw] py-[20vh] flex flex-col justify-center relative"
      data-bar="1.25 0.7 0.4 0.4 0 0.25 0 0"
      data-orb="-1 0 0.7 300 0.5"
    >
      <span className="mono mb-2">Midday</span>

      <h2 className="text-[clamp(2.4rem,6.5vw,5.5rem)] font-extralight tracking-tight leading-[0.95] max-w-[13ch] my-4 text-fg">
        The afternoon crash.
      </h2>

      <p className="max-w-[48ch] text-mut mb-6">
        Carb-heavy lunches can mean a quick spike, then a slump. Pick a meal and watch the energy curve.
      </p>

      {/* Meal Selection Chips */}
      <div className="flex flex-wrap gap-2.5 my-4">
        {[
          { id: 0, label: 'Rice + roti' },
          { id: 1, label: 'Tea + biscuit' },
          { id: 2, label: 'With GoProteen' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveMeal(chip.id)}
            className={`pill cursor-pointer transition-all duration-300 ${
              activeMeal === chip.id
                ? 'bg-fg text-bg border-fg shadow-lg scale-105'
                : 'hover:border-fg/40'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Dynamic SVG Energy Curve */}
      <div className="max-w-[560px] my-6">
        <svg
          viewBox="0 0 520 160"
          className="w-full h-auto overflow-visible"
          aria-label="Illustrative blood sugar energy curve"
        >
          <line x1="0" y1="150" x2="520" y2="150" stroke="currentColor" opacity="0.2" />
          <path
            d={MEAL_PATHS[activeMeal]}
            fill="none"
            stroke="url(#energyGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="energyGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF8A2B" />
              <stop offset="100%" stopColor="#5B21B6" />
            </linearGradient>
          </defs>
        </svg>
        <span className="mono block mt-2 text-[10px]">Illustrative only</span>
      </div>

      {/* Silent 10g deficit indicator */}
      <div className="max-w-md my-4">
        <div className="h-2 w-full bg-fg/10 rounded-full overflow-hidden flex">
          <div
            className={`h-full transition-all duration-500 ${
              activeMeal === 2 ? 'w-full bg-emerald-500' : 'w-[25%] bg-amber-500'
            }`}
          />
        </div>
        <p className="mono mt-2 text-[10px]">
          {activeMeal === 2
            ? 'Complete 10 g cellular protein delivered ✓'
            : 'The silent 10 g daily deficit'}
        </p>
      </div>

      {/* Story disclosure */}
      <details className="story">
        <summary>Read the full story · The silent 10-gram deficit & afternoon crash</summary>
        <div>
          <p>
            “Think about your usual afternoon… 2:00 PM or 3:30 PM arrives… You feel that sudden, undeniable fog settling into your mind. Your eyes grow heavy… Your mental sharpness blurs… You find yourself reaching for another sweet tea, a sugary biscuit, or coffee just to keep pushing forward.
          </p>
          <p>
            You thought it was just fatigue, right? But the real science tells a very different story. Standard high-carb meals cause a violent glucose spike… followed by an inevitable crash. Even worse: they starve your body of the essential amino acids it desperately needs to maintain steady neurotransmitters and sustained energy.
          </p>
          <p>
            By missing 10 grams of clean, slow-digesting protein at lunch, your body enters a silent metabolic deficit. It sends emergency hunger and fatigue signals… forcing you to crave quick carbs that restart the vicious cycle all over again…”
          </p>
        </div>
      </details>
    </section>
  );
}
