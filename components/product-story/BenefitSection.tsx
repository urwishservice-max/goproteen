'use client';

import React from 'react';
import GoProteenProduct from './GoProteenProduct';

const BENEFITS = [
  {
    num: '01',
    headline: 'Finish your workday feeling vibrant, active, and fully alive.',
    tagline: 'Sustained Cellular Vitality',
    subtext: 'No 3 PM sluggishness or mental fog. Consistent, clean cellular fuel that lasts straight through your evening.',
    align: 'left', // text left, product right
    productPos: [0.35, -0.05, 0.3] as [number, number, number],
    productRot: [0.12, 0.28, -0.08] as [number, number, number],
    scale: 1.18,
  },
  {
    num: '02',
    headline: 'Make lifting, walking, and climbing stairs smooth and easy again.',
    tagline: 'Effortless Daily Movement',
    subtext: 'Rebuilding lean connective tissue so every stair step, grocery lift, and morning walk feels naturally light.',
    align: 'right', // text right, product left
    productPos: [-0.3, 0.08, 0.35] as [number, number, number],
    productRot: [-0.18, -0.25, 0.12] as [number, number, number],
    scale: 1.22,
  },
  {
    num: '03',
    headline: 'Wake up aging muscle cells and see real, firm definition return.',
    tagline: 'Firm Muscle Tone',
    subtext: 'Overcoming anabolic resistance with high leucine density to stimulate true muscle protein synthesis day after day.',
    align: 'left', // text left, product centre-right
    productPos: [0.22, 0.0, 0.4] as [number, number, number],
    productRot: [0.22, 0.32, -0.15] as [number, number, number],
    scale: 1.2,
  },
  {
    num: '04',
    headline: 'Keep your energy laser-stable all afternoon long without the crash.',
    tagline: 'Laser-Stable Metabolic Curve',
    subtext: 'Zero sugar spikes, zero rebound slumps. Clean fermented protein maintains steady metabolic flow when you need it most.',
    align: 'right', // text right, product centre-left
    productPos: [-0.22, -0.05, 0.38] as [number, number, number],
    productRot: [-0.14, 0.22, 0.08] as [number, number, number],
    scale: 1.2,
  },
  {
    num: '05',
    headline: 'Stand tall, steady, and sturdy as you gracefully age.',
    tagline: 'Structural Upright Frame',
    subtext: 'The foundational architectural support that keeps your posture erect, confident, and steady through every decade.',
    align: 'center', // text center, product centre prominent
    productPos: [0, 0, 0.5] as [number, number, number],
    productRot: [0.06, 0.08, 0.0] as [number, number, number],
    scale: 1.35,
  },
];

export default function BenefitSection() {
  return (
    <section className="relative w-full bg-[#FDFBF7] overflow-hidden">
      {/* Section Header */}
      <div className="w-full max-w-7xl mx-auto pt-24 pb-12 px-6 sm:px-12 lg:px-20 text-center border-b border-[#EBE5DE]/60">
        <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-3 block">
          06 — Clinical Body Outcomes
        </span>
        <h2
          className="text-[2.6rem] sm:text-[3.8rem] lg:text-[4.6rem] font-light tracking-tight text-[#14091F]"
          style={{ letterSpacing: '-0.03em' }}
        >
          Everyday{' '}
          <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48]">
            benefits.
          </span>
        </h2>
        <p className="text-[#5D5066] text-base sm:text-lg max-w-xl mx-auto mt-4 font-normal">
          Five distinct transformations that compound over time as your body receives complete, fermented repair nutrition.
        </p>
      </div>

      {/* 5 Distinct Natural-Scrolling Benefit Moments */}
      <div className="w-full">
        {BENEFITS.map((b, idx) => {
          const isCenter = b.align === 'center';
          const isTextLeft = b.align === 'left';

          return (
            <div
              key={b.num}
              className={`relative w-full min-h-[75vh] sm:min-h-[82vh] py-20 px-6 sm:px-12 lg:px-20 flex items-center border-b border-[#EBE5DE]/80 ${
                idx % 2 === 1 ? 'bg-[#FAF8F3]' : 'bg-[#FDFBF7]'
              }`}
            >
              {/* Subtle ambient accent glow */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px] ${
                  isTextLeft ? 'right-1/6' : isCenter ? 'left-1/2 -translate-x-1/2' : 'left-1/6'
                }`}
                style={{
                  background:
                    idx % 2 === 0
                      ? 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(168,85,247,0.15) 60%, rgba(253,251,247,0) 80%)'
                      : 'radial-gradient(circle, rgba(147,51,234,0.2) 0%, rgba(245,158,11,0.15) 60%, rgba(253,251,247,0) 80%)',
                }}
              />

              <div className="relative z-10 w-full max-w-7xl mx-auto">
                {isCenter ? (
                  /* Center Layout for Benefit 05 */
                  <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                    <span className="text-xs font-mono tracking-widest uppercase text-emerald-600 font-semibold mb-3">
                      Benefit {b.num} · {b.tagline}
                    </span>

                    <h3
                      className="text-[2.6rem] sm:text-[3.6rem] lg:text-[4.4rem] font-light tracking-tight leading-[1.08] text-[#14091F] mb-6"
                      style={{ letterSpacing: '-0.03em' }}
                    >
                      {b.headline}
                    </h3>

                    <p className="text-[#5D5066] text-base sm:text-lg leading-relaxed max-w-xl mb-6 font-normal">
                      {b.subtext}
                    </p>

                    <div className="w-full max-w-2xl h-[340px] sm:h-[420px] lg:h-[460px] relative flex items-center justify-center my-2">
                      <GoProteenProduct
                        className="w-full h-full"
                        position={b.productPos}
                        rotation={b.productRot}
                        scale={b.scale}
                        autoRotateSpeed={0.003}
                        interactive={true}
                        enableFloat={true}
                      />
                    </div>
                  </div>
                ) : (
                  /* Two-Column Alternating Layout for Benefits 01-04 */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Text Column */}
                    <div
                      className={`lg:col-span-6 flex flex-col items-start text-left ${
                        isTextLeft ? 'order-1' : 'order-1 lg:order-2 lg:pl-8'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#230E2E] text-white text-[11px] font-mono">
                          {b.num}
                        </span>
                        <span className="text-[11px] sm:text-xs font-mono tracking-widest uppercase text-[#8A7993]">
                          {b.tagline}
                        </span>
                      </div>

                      <h3
                        className="text-[2.4rem] sm:text-[3.4rem] lg:text-[4.0rem] font-light tracking-tight leading-[1.08] text-[#14091F] mb-6"
                        style={{ letterSpacing: '-0.03em' }}
                      >
                        {b.headline}
                      </h3>

                      <p className="text-[#5D5066] text-base sm:text-lg leading-relaxed max-w-lg font-normal mb-6">
                        {b.subtext}
                      </p>

                      <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A7993]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Verified Daily Outcome
                      </span>
                    </div>

                    {/* 3D Product Column */}
                    <div
                      className={`lg:col-span-6 w-full h-[360px] sm:h-[460px] lg:h-[500px] relative flex items-center justify-center ${
                        isTextLeft ? 'order-2' : 'order-2 lg:order-1'
                      }`}
                    >
                      <GoProteenProduct
                        className="w-full h-full"
                        position={b.productPos}
                        rotation={b.productRot}
                        scale={b.scale}
                        autoRotateSpeed={0.003}
                        interactive={true}
                        enableFloat={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
