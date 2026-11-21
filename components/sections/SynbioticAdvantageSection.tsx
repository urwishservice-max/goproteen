'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const BENEFITS_ROW_1 = [
  {
    num: '01',
    title: 'Smooth Digestion',
    description: 'Every bite digests smoothly.',
    tag: 'Digestive Ease',
  },
  {
    num: '02',
    title: 'Gut Comfort',
    description: 'Feel light, comfortable and free from bloating.',
    tag: 'Anti-Bloat',
  },
  {
    num: '03',
    title: 'Blood Sugar Harmony',
    description: 'Support steady blood sugar after meals.',
    tag: 'Metabolic Balance',
  },
];

const BENEFITS_ROW_2 = [
  {
    num: '04',
    title: 'Sharp, Steady Focus',
    description: 'Maintain mental focus throughout the afternoon.',
    tag: 'Gut-Brain Axis',
  },
  {
    num: '05',
    title: 'Natural Fullness',
    description: "Support your body's natural fullness hormones, GLP-1 and PYY.",
    tag: 'Satiety Signaling',
  },
  {
    num: '06',
    title: 'Fewer Food Cravings',
    description: 'Help manage random, uncontrollable junk-food urges.',
    tag: 'Appetite Control',
  },
];

export default function SynbioticAdvantageSection() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeBubble, setActiveBubble] = useState<'fiber' | 'probiotics' | null>(null);

  const toggleListen = () => {
    if (typeof window === 'undefined') return;
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text =
          "The Synbiotic Advantage. Prebiotic Fiber and Probiotics. Effortless Gut and Blood Sugar Harmony. Imagine finishing a meal and taking a deep, easy, satisfying breath. Powered by clinically studied prebiotic fiber and probiotics. Two complementary ingredients, one synbiotic advantage.";
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
      id="synbiotic-advantage"
      className="relative z-20 w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 bg-[#FDFBF7] text-[#14091F] overflow-hidden border-t border-b border-[#EBE5DE]/80"
    >
      {/* Background Ambient Glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none opacity-30 blur-[150px]"
        style={{
          background:
            'radial-gradient(circle, rgba(236,72,153,0.22) 0%, rgba(168,85,247,0.18) 45%, rgba(253,251,247,0) 75%)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(249,115,22,0.2) 0%, rgba(236,72,153,0.15) 50%, rgba(253,251,247,0) 80%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest uppercase text-[#8A7993]">
              THE SYNBIOTIC ADVANTAGE
            </span>
            <span className="text-[#D8CFDC]">/</span>
            <span className="text-xs font-mono font-medium text-[#14091F]">
              Gut & Metabolic Health
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

        {/* Section Editorial Headlines */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] mb-4 block">
            The Synbiotic Advantage
          </span>

          <h2
            className="text-[3.0rem] sm:text-[4.4rem] lg:text-[5.4rem] font-light tracking-tight leading-[1.02] text-[#14091F] mb-4"
            style={{ letterSpacing: '-0.035em' }}
          >
            Prebiotic Fiber &{' '}
            <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] via-[#E11D48] to-[#F97316]">
              Probiotics
            </span>
          </h2>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-[#5D5066] tracking-tight mb-6">
            Effortless Gut & Blood Sugar Harmony
          </h3>

          <p className="text-[#5D5066] text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-normal">
            Imagine finishing a meal and taking a deep, easy, satisfying breath.
            Powered by clinically studied prebiotic fiber and probiotics.
          </p>
        </div>

        {/* Central Anatomical Gut Illustration Showcase */}
        <div className="relative w-full max-w-4xl flex items-center justify-center my-6 sm:my-10">
          <div className="relative w-[340px] sm:w-[520px] lg:w-[680px] aspect-[4/3] flex items-center justify-center">
            {/* Soft Radial Backlight */}
            <div
              className="absolute inset-0 rounded-full blur-[70px] opacity-45 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(236,72,153,0.3) 20%, rgba(168,85,247,0.25) 50%, transparent 75%)',
              }}
            />

            {/* Uploaded High-Res 3D Gut Asset */}
            <div className="relative w-full h-full transform hover:scale-[1.02] transition-transform duration-700 ease-out">
              <Image
                src="/images/synbiotic_gut.png"
                alt="Synbiotic Advantage - Prebiotic Fiber and Probiotics with Digestive Harmony"
                fill
                priority
                className="object-contain drop-shadow-[0_20px_45px_rgba(168,85,247,0.18)]"
              />
            </div>
          </div>
        </div>

        {/* Interactive Highlight Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-3xl mx-auto my-8">
          <div className="p-6 rounded-2xl bg-white/70 border border-[#E5DFD7] backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-base font-medium font-mono uppercase tracking-wider text-[#14091F]">
                Prebiotic Fiber
              </h4>
            </div>
            <p className="text-[#5D5066] text-sm leading-relaxed pl-5 font-normal">
              Specialized plant oligosaccharides that selectively feed beneficial gut microflora, producing short-chain fatty acids for long-term barrier integrity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/70 border border-[#E5DFD7] backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#9333EA] to-[#E11D48]" />
              <h4 className="text-base font-medium font-mono uppercase tracking-wider text-[#14091F]">
                Active Probiotics
              </h4>
            </div>
            <p className="text-[#5D5066] text-sm leading-relaxed pl-5 font-normal">
              Clinically documented live micro-organisms that restore microbial biodiversity, optimize nutrient absorption, and maintain daily intestinal balance.
            </p>
          </div>
        </div>

        {/* RUNNING TEXT TICKER / MARQUEE: "EXPERIENCE THE DIFFERENCE" */}
        <div className="w-full mt-12 sm:mt-16">
          <div className="text-center mb-8">
            <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.25em] uppercase text-[#8A7993] block mb-2">
              Clinical Benefits
            </span>
            <h4
              className="text-2xl sm:text-3xl font-light text-[#14091F] tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Experience the difference
            </h4>
          </div>

          {/* Running Text Track 1 (Right to Left) */}
          <div className="relative w-screen -ml-[calc((100vw-100%)/2)] overflow-hidden py-3">
            <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
              {/* Duplicate array for seamless infinite loop */}
              {[...BENEFITS_ROW_1, ...BENEFITS_ROW_1, ...BENEFITS_ROW_1].map((b, idx) => (
                <div
                  key={`row1-${idx}`}
                  className="mx-3 flex items-center gap-4 px-6 py-4 rounded-full bg-white/90 border border-[#E5DFD7] shadow-sm hover:border-[#9333EA] hover:shadow-md transition-all duration-300 whitespace-nowrap"
                >
                  <span className="px-2.5 py-1 rounded-full bg-[#230E2E] text-white text-[11px] font-mono">
                    {b.num}
                  </span>
                  <span className="text-base font-medium text-[#14091F]">
                    {b.title}
                  </span>
                  <span className="text-[#D8CFDC]">·</span>
                  <span className="text-sm text-[#5D5066] font-normal">
                    {b.description}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase tracking-wider">
                    {b.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Running Text Track 2 (Left to Right) */}
          <div className="relative w-screen -ml-[calc((100vw-100%)/2)] overflow-hidden py-3 mt-2">
            <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
              {/* Duplicate array for seamless infinite loop */}
              {[...BENEFITS_ROW_2, ...BENEFITS_ROW_2, ...BENEFITS_ROW_2].map((b, idx) => (
                <div
                  key={`row2-${idx}`}
                  className="mx-3 flex items-center gap-4 px-6 py-4 rounded-full bg-white/90 border border-[#E5DFD7] shadow-sm hover:border-[#E11D48] hover:shadow-md transition-all duration-300 whitespace-nowrap"
                >
                  <span className="px-2.5 py-1 rounded-full bg-[#230E2E] text-white text-[11px] font-mono">
                    {b.num}
                  </span>
                  <span className="text-base font-medium text-[#14091F]">
                    {b.title}
                  </span>
                  <span className="text-[#D8CFDC]">·</span>
                  <span className="text-sm text-[#5D5066] font-normal">
                    {b.description}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-mono uppercase tracking-wider">
                    {b.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Banner: Two complementary ingredients. One synbiotic advantage. */}
        <div className="mt-16 sm:mt-20 text-center max-w-xl mx-auto py-8 px-6 rounded-2xl bg-gradient-to-r from-purple-50/60 via-pink-50/40 to-amber-50/60 border border-[#EBE5DE] backdrop-blur-sm">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8A7993] block mb-2">
            Prebiotic Fiber + Probiotics
          </span>
          <p className="text-xl sm:text-2xl font-light text-[#14091F] tracking-tight">
            Two complementary ingredients.{' '}
            <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48]">
              One synbiotic advantage.
            </span>
          </p>
        </div>
      </div>

      {/* Marquee Animation Keyframes */}
      <style jsx>{`
        @keyframes marqueeLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @keyframes marqueeRight {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee-left {
          animation: marqueeLeft 32s linear infinite;
        }
        .animate-marquee-right {
          animation: marqueeRight 34s linear infinite;
        }
      `}</style>
    </section>
  );
}
