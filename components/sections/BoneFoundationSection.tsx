'use client';

import React, { useState } from 'react';

export default function BoneFoundationSection() {
  const [years, setYears] = useState(0);

  // Spine curvature calculations
  // At years=0: straight line M100 54 Q100 130 100 200
  // At years=20: curved posture arching to Q135 130 115 200
  const curveOffset = 100 + years * 1.8;
  const bottomOffset = 100 + years * 0.7;
  const spineD = `M100 54 Q${curveOffset} 130 ${bottomOffset} 200`;
  const headX = 100 + years * 0.9;

  return (
    <section
      id="bone"
      className="min-h-screen px-[8vw] py-[20vh] flex flex-col justify-center relative"
      data-bar="-1.25 0.7 0.4 0.4 0 0.25 0 0"
      data-orb="1 0 0.7 160 0.5"
    >
      <span className="mono mb-2">The fading foundation</span>

      <h2 className="text-[clamp(2.4rem,6.5vw,5.5rem)] font-extralight tracking-tight leading-[0.95] max-w-[13ch] my-4 text-fg">
        Stand tall.
      </h2>

      <p className="max-w-[48ch] text-mut mb-6">
        Every year after middle age, your body quietly surrenders 1% of its bone density and systemic mineral matrix. Without a complete amino acid framework to lock calcium into place, your internal structure accelerates its breakdown.* How strong and upright do you want to feel a decade from now?
      </p>

      {/* Years from now slider */}
      <div className="max-w-md my-4">
        <input
          type="range"
          min="0"
          max="20"
          value={years}
          onChange={(e) => setYears(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-fg/15 rounded-lg appearance-none cursor-pointer accent-amber-500"
          aria-label="Years from now"
        />
        <div className="mono mt-2">
          {years === 0 ? 'Today (Upright)' : `+${years} years from now (Postural shift)`}
        </div>
      </div>

      {/* SVG Spine Posture Line */}
      <svg
        className="w-[200px] h-[240px] my-4 transition-all duration-500 ease-out"
        viewBox="0 0 200 240"
        aria-label="Spine posture curve"
      >
        <circle
          cx={headX}
          cy="30"
          r="16"
          fill="currentColor"
          className="text-fg transition-all duration-500"
        />
        <path
          d={spineD}
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          className="text-fg transition-all duration-500"
        />
      </svg>

      {/* Story disclosure */}
      <details className="story">
        <summary>Read the full story · The fading foundation (1% annual mineral loss)</summary>
        <div>
          <p>
            “Picture this… You step out of bed in the quiet of the morning… and feel that unfamiliar stiffness whispering through your joints. You look back at a recent photograph… and notice your posture, gently slumping. Your physical frame, feeling just a little less sturdy than it used to… quietly shifting, day by day.
          </p>
          <p>
            Every year after middle age, your body quietly surrenders 1% of its bone density and systemic mineral matrix. Without a complete amino acid framework to lock calcium into place… your internal structure accelerates its breakdown. As you feel how important your frame really is… ask yourself: How strong and upright do you want to feel a decade from now?”
          </p>
        </div>
      </details>
    </section>
  );
}
