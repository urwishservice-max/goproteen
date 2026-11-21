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
      {/* 1. TOP BAR: Left Header, Right Quote */}
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

        {/* Top Right: Editorial Quote Block */}
        <div className="border-l-[3px] border-[#831843] pl-3.5 py-1 max-w-sm lg:max-w-xs self-start lg:pt-2">
          <p className="text-xs sm:text-[13px] text-stone-700 italic font-light leading-relaxed">
            “As you feel how important your frame really is… ask yourself: How strong and upright do you want to feel a decade from now?”
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. RIGHT PANEL: Bone Remodeling Info */}
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
