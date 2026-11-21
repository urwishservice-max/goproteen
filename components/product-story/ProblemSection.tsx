'use client';

import React from 'react';
import GoProteenProduct from './GoProteenProduct';

export default function ProblemSection() {
  return (
    <section className="relative w-full min-h-[85vh] py-20 sm:py-28 px-6 sm:px-12 lg:px-20 bg-[#FDFBF7] flex items-center overflow-hidden border-b border-[#EBE5DE]/80">
      {/* Subtle Warm Background Glow */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none opacity-30 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(244,63,94,0.18) 0%, rgba(192,132,252,0.15) 50%, rgba(253,251,247,0) 75%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Editorial Typography */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-4">
            02 — The Problem With Traditional Protein
          </span>

          <h2
            className="text-[2.6rem] sm:text-[3.8rem] lg:text-[4.6rem] font-light tracking-tight leading-[1.08] text-[#14091F] mb-6"
            style={{ letterSpacing: '-0.03em' }}
          >
            Heavy gastric{' '}
            <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48]">
              bloat.
            </span>{' '}
            Gas. Slump.
          </h2>

          <div className="space-y-4 mb-6 text-[#5D5066] text-base sm:text-lg leading-[1.65] font-normal max-w-lg">
            <p>
              Traditional whey or raw plant powders often trigger{' '}
              <strong className="text-[#14091F] font-medium">heavy gastric bloat</strong>...
            </p>
            <p>
              <strong className="text-[#14091F] font-medium">gas</strong>... and{' '}
              <strong className="text-[#14091F] font-medium">uncomfortable stomach distress</strong>.
            </p>
            <p className="text-[#8A7993]">
              Leaving your physical frame sluggish instead of restored.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E5DFD7] bg-white/70 text-xs font-mono text-[#8A7993]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Common digestive roadblock in older adults</span>
          </div>
        </div>

        {/* Right Column: 3D Product tilted and positioned */}
        <div className="lg:col-span-6 w-full h-[360px] sm:h-[460px] lg:h-[520px] relative flex items-center justify-center">
          <GoProteenProduct
            className="w-full h-full"
            position={[0.3, -0.15, 0.2]}
            rotation={[-0.22, 0.35, -0.15]}
            scale={1.12}
            autoRotateSpeed={0.0025}
            interactive={true}
            enableFloat={true}
          />
        </div>
      </div>
    </section>
  );
}
