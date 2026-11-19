'use client';

import React from 'react';

interface FooterProps {
  isLiteMode: boolean;
  onToggleLiteMode: (lite: boolean) => void;
}

export default function Footer({ isLiteMode, onToggleLiteMode }: FooterProps) {
  return (
    <footer className="px-[8vw] py-16 border-t border-line/40 text-xs text-mut flex flex-col gap-6 relative z-20">
      <div className="max-w-2xl text-[11px] leading-relaxed opacity-75">
        *These statements and illustrations are for educational and illustrative purposes. Clinical studies reference yeast protein DIAAS scores, prebiotic chicory inulin fermentation kinetics, and Bacillus coagulans spore survival rates. Dietary supplements and functional foods support nutritional health and are not intended to diagnose, treat, cure, or prevent any medical condition.
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-line/20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggleLiteMode(!isLiteMode)}
            className="mono text-[10px] uppercase border border-line px-3 py-1.5 rounded-full hover:border-fg/60 transition-colors"
          >
            {isLiteMode ? 'Enable Full 3D Mode' : 'Switch to Lite Mode'}
          </button>
          <span className="mono text-[10px]">GoProteen · Original Bar</span>
        </div>

        <div className="mono text-[10px] text-mut/60">
          © {new Date().getFullYear()} GoProteen Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
