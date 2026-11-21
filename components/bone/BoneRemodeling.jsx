'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import BoneRemodelingControls from './BoneRemodelingControls';

// Dynamically import Three.js scene with ssr: false for smooth client mounting
const BoneRemodelingScene = dynamic(() => import('./BoneRemodelingScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center bg-transparent">
      <div className="w-9 h-9 rounded-full border-2 border-[#E02B78] border-t-transparent animate-spin mb-3" />
      <span className="text-[11px] font-mono tracking-widest text-[#E02B78] uppercase font-medium">
        Loading 3D Bone Remodeling Microenvironment...
      </span>
    </div>
  ),
});

/**
 * BoneRemodeling - Section 04: Living Cellular Remodeling Dynamics
 * Pixel-perfect match to reference mockup with real 3D anatomical substrate,
 * cellular osteoclasts & osteoblasts, dynamic bone geometry deformation,
 * and infinity turnover cycle diagram.
 */
export default function BoneRemodeling({ onRestart, onPrev }) {
  // Mode: 'balanced' | 'formation' | 'resorption'
  const [activeMode, setActiveMode] = useState('balanced');
  const [selectedCell, setSelectedCell] = useState(null);

  return (
    <div className="relative w-full h-[580px] sm:h-[620px] lg:h-[660px] xl:h-[700px] max-h-[82vh] flex flex-col justify-between overflow-visible select-none">
      {/* 1. Editorial Controls, Headers, Overlays, and Right Panel */}
      <BoneRemodelingControls
        activeMode={activeMode}
        onSelectMode={(mode) => {
          setActiveMode(mode);
          setSelectedCell(null);
        }}
        onSelectCell={(cell) => setSelectedCell(cell)}
      />

      {/* 2. Central 3D Volumetric Living Bone Stage */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
        {/* Soft Dreamy Depth Glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0 rounded-full blur-[90px] opacity-70"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(251,113,133,0.18) 0%, rgba(254,215,170,0.16) 40%, rgba(243,232,255,0.12) 70%, transparent 80%)',
          }}
        />

        {/* 3D Scene Container */}
        <div className="w-full h-full relative z-10">
          <BoneRemodelingScene
            activeMode={activeMode}
            onSelectCell={(cell) => {
              if (cell === 'osteoclast') setActiveMode('resorption');
              if (cell === 'osteoblast') setActiveMode('formation');
              setSelectedCell(cell);
            }}
          />
        </div>
      </div>
    </div>
  );
}
