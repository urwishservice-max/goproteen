'use client';

import React, { useState } from 'react';

const NO_ITEMS = [
  "No added sugar",
  "No soy or whey",
  "No dairy",
  "No refined oils",
  "No fake sweeteners",
  "No trans fats",
  "No artificial colours",
  "No gluten",
  "No pesticides, antibiotics or hormones",
];

export default function CleanLabelSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      className="min-h-screen py-[20vh] flex flex-col justify-center relative overflow-hidden"
      data-bar="0 0 0.4 0 0 0.12 0 0"
      data-orb="0 0 1 0 0.6"
    >
      {/* Infinite Scrolling Clean Marquee */}
      <div className="w-full overflow-hidden whitespace-nowrap border-y border-line py-4 bg-glass backdrop-blur-md mb-12">
        <div className="inline-block animate-marquee mono text-xs tracking-widest text-mut">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="mr-6">
              NO ADDED SUGAR • NO SOY OR WHEY • NO DAIRY • NO REFINED OILS • NO FAKE SWEETENERS • NO TRANS FATS • NO ARTIFICIAL COLOURS • NO GLUTEN •&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="px-[8vw]">
        <span className="mono mb-2 block">08 — The clean label standard</span>

        <h2 className="text-[clamp(2.4rem,6.5vw,5.5rem)] font-extralight tracking-tight leading-[0.95] max-w-[13ch] my-4 text-fg">
          Nothing to hide.
        </h2>

        <p className="max-w-[48ch] text-mut mb-8">
          Hover over each standard to see our commitment to purity:
        </p>

        {/* Interactive No Badges Grid */}
        <div className="flex flex-wrap gap-2.5 max-w-2xl my-6">
          {NO_ITEMS.map((item, idx) => (
            <button
              key={idx}
              onPointerEnter={() => setHoveredIndex(idx)}
              onPointerLeave={() => setHoveredIndex(null)}
              className="pill text-xs font-mono tracking-wider cursor-default transition-all duration-300 hover:border-emerald-500 hover:text-emerald-400"
            >
              {hoveredIndex === idx ? `✓ ${item.replace('No ', 'Free of ')}` : item}
            </button>
          ))}
        </div>

        {/* Clean Label Strikethrough Box */}
        <div className="max-w-md p-6 rounded-2xl border border-dashed border-line bg-glass/50 backdrop-blur-md my-6 text-sm text-mut leading-loose font-mono">
          <s className="text-rose-400">artificial sweeteners</s><br />
          <s className="text-rose-400">fractionated palm oils</s><br />
          <s className="text-rose-400">synthetic fillers & binders</s><br />
          <s className="text-rose-400">dairy isolates & whey bloat</s><br />
          <em className="not-italic text-emerald-400 font-medium">→ 100% whole foods, dates, nuts & fermented yeast protein.</em>
        </div>
      </div>
    </section>
  );
}
