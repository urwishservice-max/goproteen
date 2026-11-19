'use client';

import React, { useEffect, useState } from 'react';

interface ScrollProgressProps {
  totalSections: number;
  activeSection: number;
  onSelectSection: (index: number) => void;
}

export default function ScrollProgress({
  totalSections,
  activeSection,
  onSelectSection,
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Progress Line */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 z-50 pointer-events-none transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Right Dots Navigation */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-40">
        {Array.from({ length: totalSections }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSection(idx)}
            aria-label={`Jump to section ${idx + 1}`}
            className={`w-[7px] h-[7px] rounded-full transition-all duration-300 ${
              activeSection === idx
                ? 'scale-150 bg-amber-500 shadow-[0_0_8px_rgba(255,138,43,0.8)]'
                : 'bg-fg/20 hover:bg-fg/60'
            }`}
          />
        ))}
      </div>
    </>
  );
}
