'use client';

import React, { useState } from 'react';

const BODY_TARGETS = [
  { id: 'bones', label: 'Bones', hue: 45, text: 'Essential amino acids anchor calcium and collagen matrix to maintain dense structural integrity.' },
  { id: 'skin', label: 'Skin', hue: 340, text: 'Cellular rebuilding peptides provide the foundation for natural epidermal bounce and elasticity.' },
  { id: 'hair', label: 'Hair', hue: 30, text: 'Keratin protein synthesis depends directly on steady dietary supply of sulfur-bearing amino acids.' },
  { id: 'immunity', label: 'Immunity', hue: 120, text: 'Antibodies, immunoglobulins, and mucosal protective cells are built almost entirely from proteins.' },
  { id: 'muscle', label: 'Muscle', hue: 200, text: 'High leucine density wakes sluggish m-TOR pathways to stimulate active muscle protein synthesis.' },
  { id: 'energy', label: 'Energy', hue: 60, text: 'Stabilizes baseline glycemic levels and avoids the post-lunch dip through steady amino acid release.' },
];

interface RepairKitSectionProps {
  onSetOrbHue: (hue: number) => void;
}

export default function RepairKitSection({ onSetOrbHue }: RepairKitSectionProps) {
  const [selectedTarget, setSelectedTarget] = useState(BODY_TARGETS[0]);

  const handleSelect = (target: typeof BODY_TARGETS[0]) => {
    setSelectedTarget(target);
    onSetOrbHue(target.hue);
  };

  return (
    <section
      id="rep"
      className="min-h-screen px-[8vw] py-[20vh] flex flex-col justify-center relative"
      data-bar="-1.25 0.8 0.4 0.4 0 0.25 0 0"
      data-orb="1 0 0.8 60 0.55"
    >
      <span className="mono mb-2">The repair kit</span>

      <h2 className="text-[clamp(4rem,14vw,11rem)] font-extrabold tracking-[-0.05em] leading-[0.85] text-fg select-none my-3">
        REPAIR
      </h2>

      <p className="max-w-[48ch] text-mut mb-6">
        Pick a part of your body to see what 10 g of fermented protein rebuilds:
      </p>

      {/* 6 Target Body Pills */}
      <div className="flex flex-wrap gap-2.5 max-w-[560px] my-3">
        {BODY_TARGETS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t)}
            className={`pill cursor-pointer transition-all duration-300 ${
              selectedTarget.id === t.id
                ? 'bg-fg text-bg border-fg shadow-lg scale-105'
                : 'hover:border-fg/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Selected Target Description Card */}
      <div className="max-w-md p-6 rounded-2xl border border-line bg-glass backdrop-blur-md my-4 min-h-[90px] flex items-center">
        <p className="text-sm font-light text-fg leading-relaxed">
          {selectedTarget.text}
        </p>
      </div>

      {/* Story disclosure */}
      <details className="story">
        <summary>Read the full story · The vanishing repair kit</summary>
        <div>
          <p>
            “You see… protein is far more than just muscle. It is your total biological repair kit. Every organ in your body, from your beating heart, to the lining of your arteries, to the immune cells guarding your bloodstream… relies on an unbroken supply of complete amino acids.
          </p>
          <p>
            When you don’t absorb enough clean protein, your body is forced to make a ruthless triage decision: It borrows from itself. It cannibalizes muscle fibers, leaches minerals from bones, and slows cellular skin turnover just to keep essential organs alive.
          </p>
          <p>
            You see it in thinning hair… duller skin… aching joints… and recovery that takes days instead of hours. Now, what if you could put an end to that internal borrowing starting today?”
          </p>
        </div>
      </details>
    </section>
  );
}
