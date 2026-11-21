'use client';

import React, { useState } from 'react';
import GoProteenProduct from './GoProteenProduct';

export default function ProductHeroSection() {
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
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between py-12 px-6 sm:px-12 lg:px-20 overflow-hidden bg-[#FDFBF7]">
      {/* Ambient Radial Gradient Aura */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none opacity-40 blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(168,85,247,0.18) 45%, rgba(253,251,247,0) 75%)',
        }}
      />

      {/* Top Header Bar */}
      <div className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto">
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

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto my-auto py-10 flex flex-col items-center text-center">
        {/* Small Uppercase Technical Label */}
        <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-4">
          The Breakthrough Solution
        </span>

        {/* Large Editorial Headline */}
        <h1
          className="text-[3.2rem] sm:text-[4.8rem] lg:text-[6.2rem] font-light tracking-tight leading-[1.0] text-[#14091F] mb-6"
          style={{ letterSpacing: '-0.035em' }}
        >
          Meet{' '}
          <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48]">
            GoProteen.
          </span>
        </h1>

        <p className="text-[#5D5066] text-base sm:text-lg max-w-xl font-normal leading-relaxed mb-8">
          A revolution in daily cellular nutrition. The original fermented protein bar designed to end the silent protein deficit.
        </p>

        {/* Central 3D Product Presentation */}
        <div className="w-full max-w-4xl h-[340px] sm:h-[420px] lg:h-[460px] relative flex items-center justify-center my-2">
          <GoProteenProduct
            className="w-full h-full"
            position={[0, 0, 0.4]}
            rotation={[0.08, 0.12, -0.05]}
            scale={1.22}
            autoRotateSpeed={0.003}
            interactive={true}
            enableFloat={true}
          />
        </div>

        {/* Minimal Interactive Hint */}
        <div className="flex items-center gap-3 text-xs font-mono text-[#8A7993] mt-4">
          <span>Drag bar to inspect in 3D</span>
          <span className="text-[#D8CFDC]">·</span>
          <span>Scroll down naturally to explore</span>
        </div>
      </div>

      {/* Bottom Separator line */}
      <div className="relative z-20 w-full max-w-7xl mx-auto pt-6 border-b border-[#EBE5DE]/80" />
    </section>
  );
}
