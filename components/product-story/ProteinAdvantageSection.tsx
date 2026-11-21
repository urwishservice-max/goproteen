'use client';

import React from 'react';
import GoProteenProduct from './GoProteenProduct';

export default function ProteinAdvantageSection() {
  return (
    <section className="relative w-full min-h-[85vh] py-20 sm:py-28 px-6 sm:px-12 lg:px-20 bg-[#FDFBF7] flex items-center overflow-hidden border-b border-[#EBE5DE]/80">
      {/* Background Glow */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none opacity-30 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(236,72,153,0.18) 0%, rgba(147,51,234,0.15) 50%, rgba(253,251,247,0) 75%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Typographic Feature Statements (NO CARDS) */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-4">
            04 — The Protein Advantage
          </span>

          <h2
            className="text-[2.6rem] sm:text-[3.8rem] lg:text-[4.6rem] font-light tracking-tight leading-[1.08] text-[#14091F] mb-10"
            style={{ letterSpacing: '-0.03em' }}
          >
            The dual engine of{' '}
            <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48]">
              cellular renewal.
            </span>
          </h2>

          {/* Statement 01 (Clean typography, no card) */}
          <div className="mb-8 max-w-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#9333EA] to-[#E11D48]" />
              <h3 className="text-xl sm:text-2xl font-light text-[#14091F] tracking-tight">
                Complete Essential Amino Acids
              </h3>
            </div>
            <p className="text-[#5D5066] text-base leading-relaxed pl-5 font-normal">
              Supplying the full spectrum of nine essential amino acids necessary for maintaining muscle structure, cellular recovery, and everyday physiological vigor.
            </p>
          </div>

          {/* Statement 02 (Clean typography, no card) */}
          <div className="mb-8 max-w-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#E11D48] to-[#F59E0B]" />
              <h3 className="text-xl sm:text-2xl font-light text-[#14091F] tracking-tight">
                High Leucine Density
              </h3>
            </div>
            <p className="text-[#5D5066] text-base leading-relaxed pl-5 font-normal">
              Concentrated leucine threshold specifically tuned to overcome age-related anabolic resistance, signaling muscle cells to initiate active protein synthesis.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-2">
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white border border-[#E5DFD7] text-[#14091F] shadow-sm">
              Complete Spectrum
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white border border-[#E5DFD7] text-[#14091F] shadow-sm">
              Anabolic Signaling
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white border border-[#E5DFD7] text-[#14091F] shadow-sm">
              10g Active Yeast Protein
            </span>
          </div>
        </div>

        {/* Right Column: 3D Product rotating slowly */}
        <div className="lg:col-span-6 w-full h-[380px] sm:h-[480px] lg:h-[540px] relative flex items-center justify-center">
          <GoProteenProduct
            className="w-full h-full"
            position={[0.25, 0.15, 0.35]}
            rotation={[-0.25, 0.38, -0.18]}
            scale={1.22}
            autoRotateSpeed={0.0035}
            interactive={true}
            enableFloat={true}
          />
        </div>
      </div>
    </section>
  );
}
