'use client';

import React from 'react';

/**
 * BoneRemodelingControls
 * Exact layout match to reference image media_1795256513892_8322cd90.jpg:
 * - Top Left: GoProteen logo, 04 / 07, Living Cellular Remodeling Dynamics
 * - Top Center: Remodeling Cycle badge (circular gradient cycle arrows + Remove → Replace → Renew)
 * - Top Right: Spoken quote with vertical plum accent bar
 * - Right Panel: Bone Remodeling title, description, and interactive infinity turnover cycle diagram
 * - Bottom Center: 3-mode selector (1. Balanced Remodeling, 2. Formation, 3. Resorption)
 */
export default function BoneRemodelingControls({
  activeMode = 'balanced',
  onSelectMode = () => {},
  onSelectCell = () => {},
}) {
  const modeData = {
    balanced: {
      title: 'Bone Remodeling',
      desc: 'A continuous cycle where old bone is removed and new bone is built, keeping your bones strong and renewed.',
    },
    formation: {
      title: 'Bone Formation',
      desc: 'Osteoblasts actively synthesize new collagenous osteoid matrix, which progressively mineralizes to reinforce bone density and structural resilience.',
    },
    resorption: {
      title: 'Bone Resorption',
      desc: 'Osteoclasts seal tightly against damaged bone tissue and secrete acid and enzymes, excavating a precise pit to prepare the surface for renewal.',
    },
  };

  const currentInfo = modeData[activeMode] || modeData.balanced;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 lg:p-8 z-20">
      {/* ========================================================= */}
      {/* 1. TOP BAR: Left Header, Center Cycle Badge, Right Quote */}
      {/* ========================================================= */}
      <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pointer-events-auto">
        {/* Top Left: Logo & Section Title */}
        <div className="space-y-1">
          <div className="flex flex-col items-start mb-0.5">
            <div className="w-6 h-[3px] bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mb-1" />
            <span className="text-xs font-bold text-[#14091F] tracking-tight block">GoProteen</span>
          </div>

          <div className="space-y-1 pt-0.5">
            <span className="font-mono text-xs sm:text-[13px] text-[#5D5066] font-semibold tracking-widest block">
              04 / 07
            </span>
            <div className="w-6 h-[2px] bg-[#8B5CF6]" />
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[40px] font-light text-[#14091F] tracking-tight leading-[1.05] pt-0.5"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Living Cellular<br />
            <span
              className="font-bold tracking-tight"
              style={{
                background: 'linear-gradient(90deg, #E02B78 0%, #FF2E75 45%, #F43F5E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Remodeling Dynamics
            </span>
          </h2>
        </div>

        {/* Top Center: Remodeling Cycle Badge (Matching reference image) */}
        <div className="hidden md:flex flex-col items-center justify-center text-center px-4 self-center lg:self-start lg:pt-2">
          {/* Circular gradient cycle arrows icon */}
          <div className="relative w-10 h-10 mb-1 flex items-center justify-center">
            <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
              <defs>
                <linearGradient id="cycleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E02B78" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
                <linearGradient id="cycleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
              {/* Upper arc arrow */}
              <path
                d="M 18 5 A 13 13 0 0 1 31 18"
                stroke="url(#cycleGrad1)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M 31 14 L 31 18 L 27 18"
                stroke="url(#cycleGrad1)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Lower arc arrow */}
              <path
                d="M 18 31 A 13 13 0 0 1 5 18"
                stroke="url(#cycleGrad2)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M 5 22 L 5 18 L 9 18"
                stroke="url(#cycleGrad2)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[#14091F] tracking-tight">
            Remodeling Cycle
          </h3>
          <span className="text-[11px] text-stone-500 font-medium tracking-wide">
            Remove &rarr; Replace &rarr; Renew
          </span>
        </div>

        {/* Top Right: Editorial Quote Block */}
        <div className="border-l-[3px] border-[#831843] pl-3.5 py-1 max-w-sm lg:max-w-xs self-start lg:pt-2">
          <p className="text-xs sm:text-[13px] text-stone-700 italic font-light leading-relaxed">
            “As you feel how important your frame really is… ask yourself: How strong and upright do you want to feel a decade from now?”
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. RIGHT PANEL: Bone Remodeling Info & Infinity Cycle */}
      {/* ========================================================= */}
      <div className="absolute right-4 sm:right-6 lg:right-8 top-[36%] -translate-y-1/2 w-64 sm:w-72 space-y-3 pointer-events-auto z-20">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#E02B78] rounded-full" />
            <h3 className="text-sm sm:text-base font-bold text-[#14091F] tracking-tight">
              {currentInfo.title}
            </h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-light pl-3.5">
            {currentInfo.desc}
          </p>
        </div>

        {/* Infinity Turnover Cycle Diagram (Matching reference image) */}
        <div className="pt-2 pl-3.5">
          <div className="relative w-full max-w-[240px] h-20">
            {/* SVG Connecting Arrows */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 240 80">
              <defs>
                <marker
                  id="arrowRight"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#8B5CF6" />
                </marker>
                <marker
                  id="arrowLeft"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#F97316" />
                </marker>
              </defs>

              {/* Left Orange Loop (Resorption) */}
              <ellipse
                cx="58"
                cy="40"
                rx="52"
                ry="28"
                fill="none"
                stroke="#EA580C"
                strokeWidth="2.2"
                strokeDasharray={activeMode === 'resorption' ? 'none' : 'none'}
                opacity={activeMode === 'formation' ? 0.45 : 1}
              />

              {/* Right Pink Loop (Formation) */}
              <ellipse
                cx="182"
                cy="40"
                rx="52"
                ry="28"
                fill="none"
                stroke="#E02B78"
                strokeWidth="2.2"
                opacity={activeMode === 'resorption' ? 0.45 : 1}
              />

              {/* Top Curved Arrow (Resorption -> Formation) */}
              <path
                d="M 98 22 C 112 14, 128 14, 142 22"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2.2"
                strokeLinecap="round"
                markerEnd="url(#arrowRight)"
              />

              {/* Bottom Curved Arrow (Formation -> Resorption) */}
              <path
                d="M 142 58 C 128 66, 112 66, 98 58"
                fill="none"
                stroke="#F97316"
                strokeWidth="2.2"
                strokeLinecap="round"
                markerEnd="url(#arrowLeft)"
              />
            </svg>

            {/* Embedded Text inside Left & Right Loops */}
            <div
              onClick={() => onSelectMode('resorption')}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-24 flex flex-col items-center justify-center text-center cursor-pointer transition-transform hover:scale-105"
            >
              <span className="text-[11px] font-bold text-[#EA580C] leading-tight block">
                Resorption
              </span>
              <span className="text-[9px] text-stone-500 italic font-light leading-tight block">
                (Remove old bone)
              </span>
            </div>

            <div
              onClick={() => onSelectMode('formation')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-24 flex flex-col items-center justify-center text-center cursor-pointer transition-transform hover:scale-105"
            >
              <span className="text-[11px] font-bold text-[#E02B78] leading-tight block">
                Formation
              </span>
              <span className="text-[9px] text-stone-500 italic font-light leading-tight block">
                (Build new bone)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. BOTTOM CENTER: 3-Mode Selector Capsule */}
      {/* ========================================================= */}
      <div className="w-full flex items-center justify-center pb-2 pointer-events-auto z-30">
        <div className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/80 shadow-xs">
          {[
            { id: 'balanced', label: '1. Balanced Remodeling' },
            { id: 'formation', label: '2. Formation' },
            { id: 'resorption', label: '3. Resorption' },
          ].map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className={`text-xs sm:text-[13px] font-medium px-4 py-1.5 rounded-full transition-all duration-300 select-none ${
                  isActive
                    ? 'bg-white text-[#14091F] font-bold shadow-xs border border-stone-200/90'
                    : 'text-[#5D5066] hover:text-[#14091F] hover:bg-white/40'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
