'use client';

import React from 'react';
import GoProteenProduct from './GoProteenProduct';

export default function ProductFinaleSection() {
  return (
    <section className="relative w-full min-h-[90vh] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 bg-[#FDFBF7] flex flex-col justify-between items-center text-center overflow-hidden">
      {/* Central Radiance Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full pointer-events-none opacity-35 blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(236,72,153,0.22) 0%, rgba(168,85,247,0.2) 45%, rgba(253,251,247,0) 75%)',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto flex flex-col items-center">
        {/* Technical Label */}
        <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-4">
          07 — The Everyday Foundation
        </span>

        {/* Headlines */}
        <h2
          className="text-[3.2rem] sm:text-[4.6rem] lg:text-[5.6rem] font-light tracking-tight leading-[1.02] text-[#14091F] mb-4"
          style={{ letterSpacing: '-0.035em' }}
        >
          Meet{' '}
          <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48]">
            GoProteen.
          </span>
        </h2>

        <p className="text-[1.8rem] sm:text-[2.2rem] lg:text-[2.6rem] font-light tracking-tight text-[#5D5066] mb-8 max-w-2xl">
          Complete nutrition. Effortless experience.
        </p>

        {/* Prominent Front-Facing 3D Model */}
        <div className="w-full max-w-4xl h-[340px] sm:h-[420px] lg:h-[460px] relative flex items-center justify-center my-4">
          <GoProteenProduct
            className="w-full h-full"
            position={[0, -0.05, 0.55]}
            rotation={[0.02, 0.0, 0.0]}
            scale={1.35}
            autoRotateSpeed={0.002}
            interactive={true}
            enableFloat={true}
          />
        </div>

        <p className="text-[#5D5066] text-base sm:text-lg leading-relaxed max-w-md font-normal mb-8">
          10 grams of clean fermented yeast protein in a decadent, whole-nut crunch bar with zero added sugar.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <a
            href="#who"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#230E2E] text-white font-medium text-sm tracking-wide shadow-lg shadow-[#230E2E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Experience GoProteen
          </a>
          <a
            href="#rep"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#2B1B36] border border-[#E5DFD7] hover:border-[#14091F] font-medium text-sm shadow-sm transition-all duration-200 cursor-pointer"
          >
            Explore Daily Routine
          </a>
        </div>
      </div>

      {/* Subtle Bottom Credit */}
      <div className="relative z-10 pt-10 text-xs font-mono text-[#8A7993]">
        <span>GoProteen · Fermented Cellular Nutrition</span>
      </div>
    </section>
  );
}
