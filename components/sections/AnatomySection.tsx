'use client';

import React, { useState } from 'react';

const LAYERS = [
  { id: 0, label: 'Crunchy coat', desc: 'Textured chocolate-style coating that keeps every bite satisfying.' },
  { id: 1, label: 'Whole nuts', desc: 'Whole almonds and cashews for real crunch, natural minerals, and healthy fats.' },
  { id: 2, label: 'Protein core', desc: '10 g of fermented yeast protein with complete essential amino acids, plus prebiotic fibre & probiotics.*' },
  { id: 3, label: 'Date base', desc: 'Sweetened purely with whole date paste: 0% added sugar, rich in dietary potassium.' },
];

interface AnatomySectionProps {
  explodeProgress: number;
  onSetExplode: (val: number) => void;
  selectedLayer: number;
  onSelectLayer: (layerId: number) => void;
}

export default function AnatomySection({
  explodeProgress,
  onSetExplode,
  selectedLayer,
  onSelectLayer,
}: AnatomySectionProps) {
  return (
    <section
      id="anat"
      className="min-h-screen px-[8vw] py-[20vh] flex flex-col justify-center items-center text-center relative"
      data-bar="0 0 1.25 -0.2 -0.1 1 0 0"
      data-orb="0 0 0.8 20 0.4"
    >
      <span className="mono mb-2">06 — Anatomy</span>

      <h2 className="text-[clamp(2.4rem,6.5vw,5.5rem)] font-extralight tracking-tight leading-[0.95] max-w-[13ch] my-4 text-fg">
        Pull it apart.
      </h2>

      <p className="max-w-[48ch] text-mut mb-6">
        Slide to explode the bar, or tap a layer to isolate its functional anatomy:
      </p>

      {/* Explode Range Slider */}
      <div className="w-full max-w-sm my-4 z-10">
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(explodeProgress * 100)}
          onChange={(e) => onSetExplode(parseInt(e.target.value, 10) / 100)}
          className="w-full h-2 bg-fg/15 rounded-lg appearance-none cursor-pointer accent-amber-500"
          aria-label="Explode bar layer slider"
        />
        <div className="flex justify-between mono text-[10px] mt-2">
          <span>Compact bar</span>
          <span>Fully exploded ({Math.round(explodeProgress * 100)}%)</span>
        </div>
      </div>

      {/* 4 Layer Selection Buttons */}
      <div className="flex flex-wrap justify-center gap-2.5 max-w-lg my-4 z-10">
        {LAYERS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => {
              onSelectLayer(layer.id);
              onSetExplode(1);
            }}
            className={`pill cursor-pointer transition-all duration-300 ${
              selectedLayer === layer.id
                ? 'bg-fg text-bg border-fg shadow-lg scale-105'
                : 'hover:border-fg/40'
            }`}
          >
            {layer.label}
          </button>
        ))}
      </div>

      {/* Active Layer Details Card */}
      <div className="max-w-md p-6 rounded-2xl border border-line bg-glass backdrop-blur-md my-4 min-h-[90px] flex items-center justify-center z-10">
        <p className="text-sm font-light text-fg leading-relaxed">
          {selectedLayer >= 0 && selectedLayer < LAYERS.length
            ? LAYERS[selectedLayer].desc
            : 'Slide the slider or tap any layer above to inspect its real functional food anatomy.'}
        </p>
      </div>
    </section>
  );
}
