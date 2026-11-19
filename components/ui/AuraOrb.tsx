'use client';

import React, { useEffect, useState } from 'react';

interface OrbProps {
  orbTarget: {
    x: number;
    y: number;
    s: number;
    hue: number;
    op: number;
  };
}

export default function AuraOrb({ orbTarget }: OrbProps) {
  const [current, setCurrent] = useState({
    x: 0,
    y: 0,
    s: 1,
    hue: 0,
    op: 0.9,
  });

  useEffect(() => {
    // Smooth lerp to target
    const timer = setTimeout(() => {
      setCurrent(orbTarget);
    }, 50);
    return () => clearTimeout(timer);
  }, [orbTarget]);

  return (
    <div
      id="orb"
      className="fixed left-1/2 top-1/2 pointer-events-none rounded-full blur-[38px] transition-all duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] animate-spin-slow z-0"
      style={{
        width: '52vmin',
        height: '52vmin',
        marginLeft: '-26vmin',
        marginTop: '-26vmin',
        transform: `translate(${current.x * 24}vw, ${current.y * 18}vh) scale(${current.s})`,
        opacity: current.op,
        filter: `blur(38px) hue-rotate(${current.hue}deg)`,
        background: `
          radial-gradient(circle at 30% 70%, var(--amb), transparent 55%),
          radial-gradient(circle at 70% 60%, var(--vio), transparent 60%),
          radial-gradient(circle at 50% 30%, var(--cor), transparent 65%)
        `,
      }}
    />
  );
}
