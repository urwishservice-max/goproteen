'use client';

import React, { useState } from 'react';

export default function ProductStorySections() {
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
          "The Breakthrough Solution. Meet GoProteen. A revolution in daily cellular nutrition. The original fermented protein bar designed to end the silent protein deficit.";
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
    <div className="relative z-20 w-full">
      {/* SECTION 01 — HERO */}
      <section
        id="story-hero"
        className="relative w-full min-h-[92vh] flex flex-col justify-between py-12 px-6 sm:px-12 lg:px-20"
      >
        {/* Top Header */}
        <div className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest uppercase text-[#8A7993]">
              GOPROTEEN 3D
            </span>
            <span className="text-[#D8CFDC]">/</span>
            <span className="text-xs font-mono font-medium text-[#14091F]">
              01 — The Breakthrough Solution
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

        {/* Hero Typography — Central open space allows persistent 3D model to sit in center */}
        <div className="relative z-20 w-full max-w-7xl mx-auto my-auto py-8 flex flex-col items-center text-center pointer-events-auto">
          <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-4">
            The Breakthrough Solution
          </span>

          <h1
            className="text-[3.2rem] sm:text-[4.8rem] lg:text-[6.2rem] font-light tracking-tight leading-[1.0] text-[#14091F] mb-6"
            style={{ letterSpacing: '-0.035em' }}
          >
            Meet{' '}
            <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48]">
              GoProteen.
            </span>
          </h1>

          <p className="text-[#5D5066] text-base sm:text-lg max-w-xl font-normal leading-relaxed mb-12">
            A revolution in daily cellular nutrition. The original fermented protein bar designed to end the silent protein deficit.
          </p>

          {/* Reserved 3D Model Center Stage Height */}
          <div className="w-full h-[240px] sm:h-[300px]" />

          <div className="flex items-center gap-3 text-xs font-mono text-[#8A7993] mt-6">
            <span>Scroll naturally to travel through the experience</span>
            <span className="text-[#D8CFDC]">↓</span>
          </div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto pt-6 border-b border-[#EBE5DE]/80" />
      </section>

      {/* SECTION 02 — THE PROBLEM */}
      <section
        id="story-problem"
        className="relative w-full min-h-[85vh] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 flex items-center border-b border-[#EBE5DE]/80"
      >
        <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pointer-events-auto">
          {/* Left Text (Constrained to avoid any overlap) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left max-w-lg lg:max-w-[480px]">
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

            <div className="space-y-4 mb-6 text-[#5D5066] text-base sm:text-lg leading-[1.65] font-normal">
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

          {/* Right Area: Reserved for persistent 3D product */}
          <div className="lg:col-span-6 h-[340px] sm:h-[460px] pointer-events-none" />
        </div>
      </section>

      {/* SECTION 03 — THE BREAKTHROUGH */}
      <section
        id="story-breakthrough"
        className="relative w-full min-h-[85vh] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 flex items-center border-b border-[#EBE5DE]/80"
      >
        <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pointer-events-auto">
          {/* Left Area: Reserved for persistent 3D product */}
          <div className="lg:col-span-6 order-2 lg:order-1 h-[340px] sm:h-[460px] pointer-events-none" />

          {/* Right Text */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-start text-left lg:pl-10 max-w-lg lg:max-w-[480px]">
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

            <p className="text-[#5D5066] text-base sm:text-lg leading-[1.65] font-normal mb-4">
              Meet <strong className="text-[#14091F] font-medium">GoProteen...</strong>
            </p>

            <p className="text-[#5D5066] text-base sm:text-lg leading-[1.65] font-normal mb-8">
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

      {/* SECTION 04 — THE PROTEIN ADVANTAGE */}
      <section
        id="story-protein-advantage"
        className="relative w-full min-h-[85vh] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 flex items-center border-b border-[#EBE5DE]/80"
      >
        <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pointer-events-auto">
          {/* Left Column: Typographic Feature Statements */}
          <div className="lg:col-span-6 flex flex-col items-start text-left max-w-lg lg:max-w-[480px]">
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

            {/* Statement 01 */}
            <div className="mb-8">
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

            {/* Statement 02 */}
            <div className="mb-8">
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
          </div>

          {/* Right Area: Reserved for persistent 3D product */}
          <div className="lg:col-span-6 h-[340px] sm:h-[460px] pointer-events-none" />
        </div>
      </section>

      {/* SECTION 05 — LIGHT ON THE STOMACH */}
      <section
        id="story-stomach"
        className="relative w-full min-h-[85vh] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 flex flex-col justify-center items-center text-center border-b border-[#EBE5DE]/80"
      >
        <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center pointer-events-auto">
          <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-6">
            05 — Weightless Nutrition
          </span>

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

          {/* Reserved central area for persistent 3D model */}
          <div className="w-full h-[220px] sm:h-[260px] pointer-events-none" />

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

      {/* SECTION 06 — EVERYDAY BENEFITS (5 Distinct Moments) */}
      <div id="story-benefits" className="relative w-full">
        {/* Benefit Header */}
        <div className="w-full max-w-7xl mx-auto pt-24 pb-12 px-6 sm:px-12 lg:px-20 text-center border-b border-[#EBE5DE]/60 pointer-events-auto">
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

        {/* Benefit 01: Product Right */}
        <div
          id="story-benefit-1"
          className="relative w-full min-h-[75vh] py-20 px-6 sm:px-12 lg:px-20 flex items-center border-b border-[#EBE5DE]/80"
        >
          <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pointer-events-auto">
            <div className="lg:col-span-6 flex flex-col items-start text-left max-w-lg lg:max-w-[480px]">
              <span className="px-2.5 py-1 rounded-full bg-[#230E2E] text-white text-[11px] font-mono mb-4">
                01 · Sustained Cellular Vitality
              </span>
              <h3 className="text-[2.4rem] sm:text-[3.4rem] lg:text-[4.0rem] font-light tracking-tight leading-[1.08] text-[#14091F] mb-6">
                Finish your workday feeling vibrant, active, and fully alive.
              </h3>
              <p className="text-[#5D5066] text-base sm:text-lg leading-relaxed font-normal mb-6">
                No 3 PM sluggishness or mental fog. Consistent, clean cellular fuel that lasts straight through your evening.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A7993]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified Daily Outcome
              </span>
            </div>
            <div className="lg:col-span-6 h-[320px] pointer-events-none" />
          </div>
        </div>

        {/* Benefit 02: Product Left */}
        <div
          id="story-benefit-2"
          className="relative w-full min-h-[75vh] py-20 px-6 sm:px-12 lg:px-20 flex items-center border-b border-[#EBE5DE]/80"
        >
          <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pointer-events-auto">
            <div className="lg:col-span-6 h-[320px] pointer-events-none" />
            <div className="lg:col-span-6 flex flex-col items-start text-left lg:pl-10 max-w-lg lg:max-w-[480px]">
              <span className="px-2.5 py-1 rounded-full bg-[#230E2E] text-white text-[11px] font-mono mb-4">
                02 · Effortless Daily Movement
              </span>
              <h3 className="text-[2.4rem] sm:text-[3.4rem] lg:text-[4.0rem] font-light tracking-tight leading-[1.08] text-[#14091F] mb-6">
                Make lifting, walking, and climbing stairs smooth and easy again.
              </h3>
              <p className="text-[#5D5066] text-base sm:text-lg leading-relaxed font-normal mb-6">
                Rebuilding lean connective tissue so every stair step, grocery lift, and morning walk feels naturally light.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A7993]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified Daily Outcome
              </span>
            </div>
          </div>
        </div>

        {/* Benefit 03: Product Up / Centre-Right */}
        <div
          id="story-benefit-3"
          className="relative w-full min-h-[75vh] py-20 px-6 sm:px-12 lg:px-20 flex items-center border-b border-[#EBE5DE]/80"
        >
          <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pointer-events-auto">
            <div className="lg:col-span-6 flex flex-col items-start text-left max-w-lg lg:max-w-[480px]">
              <span className="px-2.5 py-1 rounded-full bg-[#230E2E] text-white text-[11px] font-mono mb-4">
                03 · Firm Muscle Tone
              </span>
              <h3 className="text-[2.4rem] sm:text-[3.4rem] lg:text-[4.0rem] font-light tracking-tight leading-[1.08] text-[#14091F] mb-6">
                Wake up aging muscle cells and see real, firm definition return.
              </h3>
              <p className="text-[#5D5066] text-base sm:text-lg leading-relaxed font-normal mb-6">
                Overcoming anabolic resistance with high leucine density to stimulate true muscle protein synthesis day after day.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A7993]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified Daily Outcome
              </span>
            </div>
            <div className="lg:col-span-6 h-[320px] pointer-events-none" />
          </div>
        </div>

        {/* Benefit 04: Product Down / Centre-Left */}
        <div
          id="story-benefit-4"
          className="relative w-full min-h-[75vh] py-20 px-6 sm:px-12 lg:px-20 flex items-center border-b border-[#EBE5DE]/80"
        >
          <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pointer-events-auto">
            <div className="lg:col-span-6 h-[320px] pointer-events-none" />
            <div className="lg:col-span-6 flex flex-col items-start text-left lg:pl-10 max-w-lg lg:max-w-[480px]">
              <span className="px-2.5 py-1 rounded-full bg-[#230E2E] text-white text-[11px] font-mono mb-4">
                04 · Laser-Stable Metabolic Curve
              </span>
              <h3 className="text-[2.4rem] sm:text-[3.4rem] lg:text-[4.0rem] font-light tracking-tight leading-[1.08] text-[#14091F] mb-6">
                Keep your energy laser-stable all afternoon long without the crash.
              </h3>
              <p className="text-[#5D5066] text-base sm:text-lg leading-relaxed font-normal mb-6">
                Zero sugar spikes, zero rebound slumps. Clean fermented protein maintains steady metabolic flow when you need it most.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A7993]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified Daily Outcome
              </span>
            </div>
          </div>
        </div>

        {/* Benefit 05: Product Centre */}
        <div
          id="story-benefit-5"
          className="relative w-full min-h-[75vh] py-20 px-6 sm:px-12 lg:px-20 flex flex-col justify-center items-center text-center border-b border-[#EBE5DE]/80"
        >
          <div className="relative z-20 w-full max-w-3xl mx-auto flex flex-col items-center pointer-events-auto">
            <span className="text-xs font-mono tracking-widest uppercase text-emerald-600 font-semibold mb-3">
              Benefit 05 · Structural Upright Frame
            </span>
            <h3 className="text-[2.6rem] sm:text-[3.6rem] lg:text-[4.4rem] font-light tracking-tight leading-[1.08] text-[#14091F] mb-6">
              Stand tall, steady, and sturdy as you gracefully age.
            </h3>
            <p className="text-[#5D5066] text-base sm:text-lg leading-relaxed max-w-xl mb-6 font-normal">
              The foundational architectural support that keeps your posture erect, confident, and steady through every decade.
            </p>
            <div className="w-full h-[240px] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* FINAL SECTION — MEET GOPROTEEN */}
      <section
        id="story-finale"
        className="relative w-full min-h-[92vh] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 flex flex-col justify-between items-center text-center"
      >
        <div className="relative z-20 w-full max-w-4xl mx-auto my-auto flex flex-col items-center pointer-events-auto">
          <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-4">
            07 — The Everyday Foundation
          </span>

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

          {/* Reserved 3D model center area */}
          <div className="w-full h-[240px] sm:h-[300px] pointer-events-none" />

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

        <div className="relative z-20 pt-10 text-xs font-mono text-[#8A7993]">
          <span>GoProteen · Fermented Cellular Nutrition</span>
        </div>
      </section>
    </div>
  );
}
