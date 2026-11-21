'use client';

import React from 'react';
import GoProteenProduct from './GoProteenProduct';

export default function BreakthroughSection() {
  return (
    <section className="relative w-full min-h-[85vh] py-20 sm:py-28 px-6 sm:px-12 lg:px-20 bg-[#FDFBF7] flex items-center overflow-hidden border-b border-[#EBE5DE]/80">
      {/* Background Soft Glow on left */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none opacity-30 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(236,72,153,0.15) 50%, rgba(253,251,247,0) 75%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: 3D Product (Larger scale, distinct viewing angle) */}
        <div className="lg:col-span-6 order-2 lg:order-1 w-full h-[380px] sm:h-[480px] lg:h-[540px] relative flex items-center justify-center">
          <GoProteenProduct
            className="w-full h-full"
            position={[-0.2, 0.1, 0.45]}
            rotation={[0.26, -0.32, 0.18]}
            scale={1.28}
            autoRotateSpeed={0.003}
            interactive={true}
            enableFloat={true}
          />
        </div>

        {/* Right Column: Editorial Typography */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-start text-left lg:pl-6">
          <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-4">
            03 — The Cellular Shift
          </span>

          <h2
            className="text-[2.6rem] sm:text-[3.8rem] lg:text-[4.6rem] font-light tracking-tight leading-[1.08] text-[#14091F] mb-6"
            style={{ letterSpacing: '-0.03em' }}
          >
            Imagine a solution where fermented yeast protein{' '}
            <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48]">
              changes everything.
            </span>
          </h2>

          <p className="text-[#5D5066] text-base sm:text-lg leading-[1.65] font-normal max-w-lg mb-4">
            Meet <strong className="text-[#14091F] font-medium">GoProteen...</strong>
          </p>

          <p className="text-[#5D5066] text-base sm:text-lg leading-[1.65] font-normal max-w-lg mb-8">
            Powered by clinically studied{' '}
            <span className="text-[#14091F] font-medium">Fermented Yeast Protein</span>. Unlocking instantaneous cellular bioavailability with zero lactose and zero gastric distress.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white border border-[#E5DFD7] text-[#14091F] shadow-sm">
              Clinical Fermentation
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white border border-[#E5DFD7] text-[#14091F] shadow-sm">
              Zero Lactose
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white border border-[#E5DFD7] text-[#14091F] shadow-sm">
              Micro-Filtered Purity
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
