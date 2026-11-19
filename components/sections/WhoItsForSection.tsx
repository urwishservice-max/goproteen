'use client';

import React, { useState } from 'react';

const PERSONAS = [
  {
    id: 'age',
    tag: '30+ · 40+',
    title: 'Adults over 30 & 40',
    desc: 'Stop the silent 1% annual muscle loss and preserve joint stability before sarcopenia takes hold.',
    hue: 200,
  },
  {
    id: 'pro',
    tag: 'Focus',
    title: 'Busy Professionals',
    desc: 'Conquer the 3 PM afternoon brain fog with sustained glycemic energy without sugar crashes.',
    hue: 60,
  },
  {
    id: 'plant',
    tag: 'Clean',
    title: 'Plant-forward & Vegans',
    desc: 'The only 100% vegan protein with the complete essential amino acid profile of dairy whey.',
    hue: 120,
  },
  {
    id: 'fit',
    tag: 'Strength',
    title: 'Active Recovery',
    desc: 'Fast cellular amino acid delivery that accelerates recovery without gastric heaviness.',
    hue: 330,
  },
];

interface WhoItsForSectionProps {
  onSetOrbHue: (hue: number) => void;
}

export default function WhoItsForSection({ onSetOrbHue }: WhoItsForSectionProps) {
  const [activePersona, setActivePersona] = useState(0);

  const handleCardClick = (idx: number) => {
    setActivePersona(idx);
    onSetOrbHue(PERSONAS[idx].hue);
  };

  return (
    <section
      id="who"
      className="min-h-screen px-[8vw] py-[20vh] flex flex-col justify-center relative"
      data-bar="0 0 0.3 0 0 0 0 0"
      data-orb="0 0 0.8 0 0.5"
    >
      <span className="mono mb-2">09 — Who it’s for</span>

      <h2 className="text-[clamp(2.4rem,6.5vw,5.5rem)] font-extralight tracking-tight leading-[0.95] max-w-[13ch] my-4 text-fg">
        Made for real life.
      </h2>

      <p className="max-w-[48ch] text-mut mb-8">
        This isn’t just another snack. It is targeted cellular nutrition engineered for your real life. Tap a persona below:
      </p>

      {/* Horizontal Persona Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl my-4">
        {PERSONAS.map((p, idx) => (
          <div
            key={p.id}
            onClick={() => handleCardClick(idx)}
            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-md flex flex-col justify-between ${
              activePersona === idx
                ? 'bg-glass border-amber-500 shadow-[0_12px_30px_rgba(255,138,43,0.18)] scale-[1.02]'
                : 'bg-glass/40 border-line hover:border-fg/40'
            }`}
          >
            <div>
              <span className="mono text-[10px] text-amber-500 block mb-2">{p.tag}</span>
              <h3 className="text-xl font-light text-fg mb-3">{p.title}</h3>
              <p className="text-xs text-mut leading-relaxed">{p.desc}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-line/40 flex justify-between items-center text-xs font-mono text-fg">
              <span>Explore benefits</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 mono text-xs text-mut">
        Selected: <span className="text-fg font-medium">{PERSONAS[activePersona].title}</span>
      </div>
    </section>
  );
}
