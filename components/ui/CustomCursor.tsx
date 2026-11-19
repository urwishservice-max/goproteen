'use client';

import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isFine = window.matchMedia('(pointer:fine)').matches;
    setIsFinePointer(isFine);

    if (!isFine) return;

    const handlePointerMove = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('button, a, input, [role="button"], .interactive-hover, .card');
      setIsHovered(!!interactive);
    };

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('mouseover', handlePointerOver);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseover', handlePointerOver);
    };
  }, []);

  if (!isFinePointer) return null;

  return (
    <div
      className={`fixed pointer-events-none rounded-full border border-white mix-blend-difference z-[9999] transition-[width,height,background-color] duration-300 ease-out ${
        isHovered
          ? 'w-[76px] h-[76px] -ml-[38px] -mt-[38px] bg-white/30 backdrop-blur-[2px]'
          : 'w-[44px] h-[44px] -ml-[22px] -mt-[22px] bg-transparent'
      }`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate3d(0, 0, 0)',
      }}
    />
  );
}
