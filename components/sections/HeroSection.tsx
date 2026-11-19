'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <section
      className="hero min-h-screen px-[8vw] py-[20vh] flex flex-col justify-center items-center text-center relative"
      data-bar="0 0 1.05 -0.4 0 1 1 0"
      data-orb="0 0 1 0 0.9"
    >
      {/* Corner Mono Labels */}
      <span className="mono absolute top-[calc(92px+env(safe-area-inset-top,0px))] left-[6vw] z-10">
        GPT — 001
      </span>
      <span className="mono absolute top-[calc(92px+env(safe-area-inset-top,0px))] right-[6vw] z-10">
        Original bar
      </span>

      {/* Giant Typography Behind 3D Bar */}
      <h1 className="text-[clamp(4rem,17.5vw,16.5rem)] font-extrabold tracking-[-0.065em] leading-[0.85] text-fg select-none z-0">
        GOPROTEEN
      </h1>

      {/* Floating Stat Pills */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <span className="pill absolute left-[10%] top-[30%] animate-float-pill">
          10 g protein
        </span>
        <span
          className="pill absolute right-[9%] top-[36%] animate-float-pill"
          style={{ animationDelay: '-2s' }}
        >
          102 kcal
        </span>
        <span
          className="pill absolute left-[14%] bottom-[24%] animate-float-pill"
          style={{ animationDelay: '-4s' }}
        >
          0% added sugar
        </span>
        <span
          className="pill absolute right-[12%] bottom-[20%] animate-float-pill"
          style={{ animationDelay: '-1.2s' }}
        >
          100% vegan
        </span>
      </div>

      {/* Hero Subtitle */}
      <p className="text-[clamp(1.3rem,2.8vw,2.3rem)] font-extralight text-fg mt-[46vh] z-10 tracking-tight">
        Wake up your muscle.
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-3 z-10">
        <a className="btn s" href="#meet">
          Meet the bar
        </a>
        <a className="btn" href="#s2">
          Why protein
        </a>
      </div>

      {/* Bottom Corner Mono Labels */}
      <span className="mono absolute bottom-[6vh] left-[6vw] z-10">
        Drag · click the bar
      </span>
      <span className="mono absolute bottom-[6vh] right-[6vw] z-10">
        90 × 30 × 12 mm
      </span>
    </section>
  );
}
