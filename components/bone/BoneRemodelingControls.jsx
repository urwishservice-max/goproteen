'use client';

import React from 'react';

/**
 * BoneRemodelingControls
 * Editorial HUD, leader lines, 3-mode selector, right-panel narrative,
 * and infinity cycle diagram strictly matching the reference mockup.
 */
export default function BoneRemodelingControls({
  activeMode = 'balanced',
  onSelectMode = () => {},
  onSelectCell = () => {},
}) {
  const modeData = {
    balanced: {
      title: 'Healthy Bone Turnover',
      desc: 'In healthy youth, resorption and formation work at an identical pace, continuously renewing and strengthening the bone.',
    },
    formation: {
      title: 'Bone Formation',
      desc: 'Osteoblasts build new bone matrix, depositing a collagen-rich osteoid scaffold that progressively mineralizes into dense, durable bone.',
    },
    resorption: {
      title: 'Bone Resorption',
      desc: 'Osteoclasts attach to older bone tissue and release enzymes, breaking down mineral matrix to make room for renewal.',
    },
  };

  const currentInfo = modeData[activeMode] || modeData.balanced;

  return (
    <>
      {/* ========================================================= */}
      {/* TOP BAR: Header (Left) and Spoken Quote (Right) */}
      {/* ========================================================= */}
      <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-4 z-20 pointer-events-auto">
        {/* Top Left: Logo, 04 / 07, Title */}
        <div className="space-y-1">
          {/* Brand header */}
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
        <div className="border-l-[3px] border-[#831843] pl-3.5 py-1 max-w-md pt-2">
          <p className="text-xs sm:text-[13px] text-stone-700 italic font-light leading-relaxed">
            “As you feel how important your frame really is… ask yourself: How strong and upright do you want to feel a decade from now?”
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3D OVERLAYS: LEADER LINES TO CELLS */}
      {/* ========================================================= */}
      {/* Osteoclast Leader Callout (Left) */}
      <div
        onClick={() => {
          onSelectMode('resorption');
          onSelectCell('osteoclast');
        }}
        className="absolute top-[28%] left-[20%] sm:left-[24%] z-30 pointer-events-auto cursor-pointer group flex flex-col items-start transition-transform hover:scale-105"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] shadow-2xs" />
          <span className="text-xs font-bold text-[#14091F]">Osteoclasts</span>
          <span className="text-[11px] text-stone-500 italic">Resorb old bone</span>
        </div>
        {/* Fine leader line pointing diagonally down to the osteoclast */}
        <svg className="w-16 h-12 mt-1 overflow-visible" viewBox="0 0 64 48">
          <path
            d="M 12 0 L 22 18 L 30 42"
            fill="none"
            stroke="#14091F"
            strokeWidth="1.1"
            opacity="0.65"
          />
          <circle cx="30" cy="42" r="2.5" fill="#EA580C" />
        </svg>
      </div>

      {/* Osteoblast Leader Callout (Right) */}
      <div
        onClick={() => {
          onSelectMode('formation');
          onSelectCell('osteoblast');
        }}
        className="absolute top-[25%] left-[54%] sm:left-[56%] z-30 pointer-events-auto cursor-pointer group flex flex-col items-start transition-transform hover:scale-105"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E02B78] shadow-2xs" />
          <span className="text-xs font-bold text-[#14091F]">Osteoblasts</span>
          <span className="text-[11px] text-stone-500 italic">Build new bone</span>
        </div>
        {/* Fine leader line pointing diagonally down to the osteoblasts */}
        <svg className="w-16 h-12 mt-1 overflow-visible" viewBox="0 0 64 48">
          <path
            d="M 14 0 L 22 18 L 28 40"
            fill="none"
            stroke="#14091F"
            strokeWidth="1.1"
            opacity="0.65"
          />
          <circle cx="28" cy="40" r="2.5" fill="#E02B78" />
        </svg>
      </div>

      {/* ========================================================= */}
      {/* 3-MODE HORIZONTAL SELECTOR (Underneath Central 3D Model) */}
      {/* ========================================================= */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-6 sm:gap-10">
        {/* Base connecting line */}
        <div className="absolute top-[9px] left-3 right-3 h-[2px] bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 -z-0" />

        {[
          { id: 'balanced', label: '1. Balanced Remodeling' },
          { id: 'formation', label: '2. Formation' },
          { id: 'resorption', label: '3. Resorption' },
        ].map((m) => {
          const isActive = activeMode === m.id;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMode(m.id)}
              className="relative flex flex-col items-center gap-1.5 z-10 cursor-pointer group focus:outline-none"
            >
              {/* Node Dot */}
              <div className="w-5 h-5 flex items-center justify-center">
                {isActive ? (
                  <div className="w-5 h-5 rounded-full bg-[#231535] ring-4 ring-[#EADCF8] shadow-sm flex items-center justify-center scale-110">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-stone-300 group-hover:border-stone-500 transition-colors" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] sm:text-xs font-mono tracking-wider transition-colors duration-200 whitespace-nowrap ${
                  isActive ? 'font-bold text-[#14091F]' : 'text-stone-500 group-hover:text-[#14091F]'
                }`}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE PANEL: Title, Description & Infinity Cycle */}
      {/* ========================================================= */}
      <div className="absolute top-28 right-4 sm:right-8 lg:right-12 z-20 pointer-events-auto max-w-[280px] sm:max-w-[320px] space-y-4">
        {/* Heading with Deep Plum Bar */}
        <div className="space-y-1.5">
          <h3 className="text-lg sm:text-xl font-bold text-[#14091F] tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#831843] rounded-full inline-block" />
            <span>{currentInfo.title}</span>
          </h3>
          <p className="text-xs text-stone-600 font-light leading-relaxed pl-3.5">
            {currentInfo.desc}
          </p>
        </div>

        {/* Dynamic Infinity / Figure-8 Cycle Diagram strictly matching mockup */}
        <div className="pt-2 pl-2">
          <div className="relative w-[260px] h-[90px] flex items-center justify-center">
            {/* SVG Infinity Loop Track with Directional Arrows */}
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 260 90"
              fill="none"
            >
              <defs>
                <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EA580C" />
                  <stop offset="50%" stopColor="#FB7185" />
                  <stop offset="100%" stopColor="#E02B78" />
                </linearGradient>
              </defs>

              {/* Elegant Smooth Infinity Curve */}
              <path
                d="M 65 45 C 65 15, 10 15, 10 45 C 10 75, 65 75, 130 45 C 195 15, 250 15, 250 45 C 250 75, 195 75, 130 45 C 100 30, 80 45, 65 45 Z"
                stroke="url(#infinityGrad)"
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Directional Arrows */}
              {/* Arrow on Left Orange Loop */}
              <path
                d="M 124 25 L 132 20 L 128 32"
                stroke="#EA580C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Arrow on Right Magenta Loop */}
              <path
                d="M 136 65 L 128 70 L 132 58"
                stroke="#E02B78"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Left Loop Label: Resorption (Remove old bone) */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[11px] font-bold text-[#C2410C] block leading-tight">
                Resorption
              </span>
              <span className="text-[9.5px] text-stone-500 italic block leading-tight">
                (Remove old bone)
              </span>
            </div>

            {/* Right Loop Label: Formation (Build new bone) */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[11px] font-bold text-[#BE185D] block leading-tight">
                Formation
              </span>
              <span className="text-[9.5px] text-stone-500 italic block leading-tight">
                (Build new bone)
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
