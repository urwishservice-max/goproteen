'use client';

import React, { useState } from 'react';

const CLEAN_LABEL_EXCLUSIONS = [
  'NO Added Sugar',
  'NO Soy or Whey',
  'NO Milk or Dairy',
  'NO Refined Oils',
  'NO Fake Sweeteners',
  'NO Trans Fats',
  'NO Artificial Colors/Flavors',
  'NO Gluten',
  'NO Pesticides, Antibiotics, or Hormones',
];

const MATRIX_SPECS = [
  {
    metric: '10 Grams',
    label: 'Clinically Studied Fermented Yeast Protein',
    detail: 'Complete amino acid profile with exceptional leucine density for immediate cellular delivery.',
  },
  {
    metric: '102 Calories',
    label: 'Steady Cellular Fuel',
    detail: 'Balanced, sustained metabolic energy without blood sugar spikes or afternoon slumps.',
  },
  {
    metric: '0% Added Sugar',
    label: 'Natural Date Paste',
    detail: 'Sweetened purely with whole fruit date fiber. Zero artificial syrups, zero fake alcohols.',
  },
  {
    metric: '100% Pure',
    label: 'Vegan Formula',
    detail: 'Completely plant and micro-culture based. Ethically clean and ecologically conscious.',
  },
  {
    metric: 'Zero Dairy',
    label: 'Digestive Ease',
    detail: 'Free of whey, lactose, and milk isolates. Sits weightless on your stomach after every bar.',
  },
  {
    metric: 'Whole Foods',
    label: 'Crunchy Almonds & Cashews',
    detail: 'Real, nutrient-dense whole nuts providing clean monounsaturated fats and satisfying crunch.',
  },
];

export default function CleanLabelGuaranteeSection() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleListen = () => {
    if (typeof window === 'undefined') return;
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text =
          "Scene 8: Reading The Fine Print. The Clean-Label Guarantee. When you pick up a commercial health or protein bar, turn it over in your hand, and discover a long list of artificial sugars, palm oils, synthetic fillers, and dairy isolates hidden behind flashy marketing claims. You can feel complete peace of mind knowing we believe in total purity. No added sugar. No soy or whey. No milk or dairy. No refined oils. No fake sweeteners. No trans fats. No artificial colors or flavors. No gluten. No pesticides, antibiotics, or hormones. 10 grams of clinically studied fermented yeast protein. 102 steady calories. Zero percent added sugar. One hundred percent pure vegan formula.";
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.92;
        utt.pitch = 0.98;
        utt.onend = () => setIsPlayingAudio(false);
        utt.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utt);
      }
      setIsPlayingAudio(true);
    }
  };

  return (
    <section
      id="clean-label-guarantee"
      data-bar="0.56 -0.09 1.12 0 0.12 1 1 0"
      data-orb="0.52 -0.08 1.25 320 0.55"
      className="relative z-10 w-full pt-28 pb-24 sm:pt-36 sm:pb-32 px-6 sm:px-12 lg:px-20 bg-transparent text-[#14091F] overflow-hidden"
    >
      {/* Background Soft Glows */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[600px] rounded-full pointer-events-none opacity-20 blur-[150px]"
        style={{
          background:
            'radial-gradient(circle, rgba(236,72,153,0.18) 0%, rgba(168,85,247,0.15) 50%, rgba(253,251,247,0) 80%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <span className="mono text-xs font-mono tracking-widest uppercase text-[#8A7993]">
              SCENE 8: READING THE FINE PRINT
            </span>
            <span className="text-[#D8CFDC]">/</span>
            <span className="text-xs font-mono font-medium text-[#14091F]">
              Total Ingredient Purity
            </span>
          </div>

          <button
            type="button"
            onClick={toggleListen}
            className="group flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#E5DFD7] bg-white/80 hover:bg-white hover:border-[#14091F] transition-all duration-300 text-xs font-mono uppercase tracking-wider text-[#14091F] shadow-sm backdrop-blur-sm cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isPlayingAudio ? 'bg-rose-500 animate-pulse' : 'bg-[#14091F]'
              }`}
            />
            <span>{isPlayingAudio ? 'Pause Narration' : 'Listen'}</span>
          </button>
        </div>

        {/* Section Headline */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-4 block">
            The Clean-Label Guarantee
          </span>

          <h2
            className="text-[3.0rem] sm:text-[4.4rem] lg:text-[5.4rem] font-light tracking-tight leading-[1.02] text-[#14091F] mb-6"
            style={{ letterSpacing: '-0.035em' }}
          >
            The fine print{' '}
            <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48]">
              you can trust.
            </span>
          </h2>
        </div>

        {/* Editorial Narrative Split: The Reality vs. 3D Model Center Stage vs. The Purity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center pt-4 pb-20 border-b border-[#EBE5DE]/80">
          <div className="lg:col-span-4 text-left flex flex-col justify-center">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A7993] mb-3 block">
              The Commercial Reality
            </span>
            <p className="text-base sm:text-lg text-[#5D5066] font-light leading-relaxed">
              “When you pick up a commercial ‘health’ or ‘protein’ bar... turn it over in your hand... and discover a long list of artificial sugars, palm oils, synthetic fillers, and dairy isolates hidden behind flashy marketing claims.”
            </p>
          </div>

          {/* Center Stage: Dedicated empty space for the persistent 3D product model */}
          <div className="lg:col-span-4 min-h-[300px] sm:min-h-[360px] flex items-center justify-center pointer-events-none relative">
            {/* Subtle soft aura glow accentuating the 3D bar */}
            <div
              className="w-56 h-56 rounded-full pointer-events-none opacity-40 blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(147,51,234,0.22) 0%, rgba(225,29,72,0.15) 50%, transparent 75%)',
              }}
            />
          </div>

          <div className="lg:col-span-4 text-left lg:pl-4 flex flex-col justify-center">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A7993] mb-3 block">
              The GoProteen Promise
            </span>
            <p className="text-xl sm:text-2xl text-[#14091F] font-normal leading-relaxed">
              You can feel complete peace of mind knowing we believe in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48] font-medium">
                total purity.
              </span>
            </p>
            <span className="text-xs font-mono tracking-widest uppercase text-[#8A7993] mt-3">
              Transparent Formulations · Zero Compromises
            </span>
          </div>
        </div>

        {/* THE 9 "NO"s: Clean-Label Exclusion Strip */}
        <div className="py-12 sm:py-16 border-b border-[#EBE5DE]/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#8A7993]">
              Clean-Label Commitments
            </span>
            <span className="text-xs font-mono text-[#8A7993]">
              9 Strict Exclusions Guaranteed
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {CLEAN_LABEL_EXCLUSIONS.map((item, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-white/90 border border-[#E5DFD7] shadow-sm hover:border-[#14091F] transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 group-hover:scale-125 transition-transform" />
                <span className="text-xs sm:text-[13px] font-mono tracking-wider uppercase text-[#14091F] font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MAX-BIOAVAILABLE PROTEIN MATRIX */}
        <div
          data-bar="1.3 0.6 0.42 0.3 0 0.25 1 0"
          data-orb="1 0 .8 300 .45"
          className="pt-14 sm:pt-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] block mb-2">
                Nutritional Architecture
              </span>
              <h3
                className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#14091F] tracking-tight"
                style={{ letterSpacing: '-0.025em' }}
              >
                Max-Bioavailable Protein Matrix
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8A7993]">
              Per Serving (40g Bar)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {MATRIX_SPECS.map((spec, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-white/70 border border-[#E5DFD7] shadow-sm hover:shadow-md hover:border-[#9333EA]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl sm:text-4xl font-light text-[#14091F] tracking-tight mb-2">
                    {spec.metric}
                  </div>
                  <div className="text-sm font-medium font-mono uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48] mb-3">
                    {spec.label}
                  </div>
                </div>
                <p className="text-[#5D5066] text-xs sm:text-sm leading-relaxed font-normal">
                  {spec.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
