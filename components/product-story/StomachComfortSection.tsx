'use client';

import React from 'react';
import GoProteenProduct from './GoProteenProduct';

export default function StomachComfortSection() {
  return (
    <section className="relative w-full min-h-[85vh] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 bg-[#FDFBF7] flex flex-col justify-center items-center overflow-hidden border-b border-[#EBE5DE]/80 text-center">
      {/* Soft Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-25 blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(244,63,94,0.18) 50%, rgba(253,251,247,0) 80%)',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-6">
          05 — Weightless Nutrition
        </span>

        {/* Minimal Editorial Split Text */}
        <h2
          className="text-[2.4rem] sm:text-[3.6rem] lg:text-[4.4rem] font-light tracking-tight leading-[1.12] text-[#14091F] mb-6"
          style={{ letterSpacing: '-0.03em' }}
        >
          To flip your{' '}
          <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48]">
            muscle-building engine
          </span>{' '}
          back on...
        </h2>

        {/* 3D Product Horizontally Across Centre */}
        <div className="w-full max-w-3xl h-[280px] sm:h-[360px] lg:h-[400px] relative flex items-center justify-center my-4">
          <GoProteenProduct
            className="w-full h-full"
            position={[0, 0, 0.45]}
            rotation={[0.06, 0.05, 0.0]}
            scale={1.25}
            autoRotateSpeed={0.003}
            interactive={true}
            enableFloat={true}
          />
        </div>

        <p
          className="text-[2.0rem] sm:text-[2.8rem] lg:text-[3.2rem] font-light tracking-tight leading-[1.18] text-[#5D5066] max-w-2xl mt-4"
          style={{ letterSpacing: '-0.025em' }}
        >
          sitting completely{' '}
          <span className="text-[#14091F] font-normal">weightless on your stomach.</span>
        </p>

        <p className="text-sm font-mono text-[#8A7993] tracking-widest uppercase mt-8">
          Pure Fermentation · Instant Assimilation · Zero Heavy After-Bloat
        </p>
      </div>
    </section>
  );
}
