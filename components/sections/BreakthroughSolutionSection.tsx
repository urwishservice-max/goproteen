'use client';

import React from 'react';

export default function BreakthroughSolutionSection() {
  return (
    <section
      id="sol"
      className="min-h-screen px-[8vw] py-[20vh] flex flex-col justify-center relative"
      data-bar="1.25 0.7 0.45 0.4 0 0.3 0 0"
      data-orb="-1 0 0.8 250 0.55"
    >
      <span className="mono mb-2">The breakthrough solution</span>

      <h2 className="text-[clamp(2.4rem,6.5vw,5.5rem)] font-extralight tracking-tight leading-[0.95] max-w-[13ch] my-4 text-fg">
        Weightless on your stomach.
      </h2>

      <p className="max-w-[48ch] text-mut mb-6">
        Traditional whey or raw plant powders often trigger heavy gastric bloat, gas and uncomfortable stomach distress. Compare below:
      </p>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[640px] my-6">
        {/* Traditional Whey / Raw Plant */}
        <div className="p-6 rounded-2xl border border-line bg-black/40 text-white/90 backdrop-blur-md">
          <span className="mono text-[10px] text-white/50 block mb-2">Ordinary powders</span>
          <h3 className="text-xl font-light mb-3 text-white">Heavy Gastric Bloat</h3>
          <ul className="text-sm space-y-2 text-white/70 font-light">
            <li>✕ Heavy dairy lactose & whey curdling</li>
            <li>✕ Raw anti-nutritional factors & phytates</li>
            <li>✕ Harsh artificial sweeteners & sugar alcohols</li>
            <li>✕ Sluggish, prolonged gut transit time</li>
          </ul>
        </div>

        {/* GoProteen Fermented Yeast */}
        <div className="p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-purple-600/10 backdrop-blur-md">
          <span className="mono text-[10px] text-amber-500 block mb-2">GoProteen Fermented</span>
          <h3 className="text-xl font-light mb-3 text-fg">Effortless Lightness</h3>
          <ul className="text-sm space-y-2 text-mut font-light">
            <li>✓ Fermented yeast pre-digested proteins</li>
            <li>✓ Complete DIAAS score: superior bioavailability</li>
            <li>✓ Zero added sugar, 100% dairy & soy free</li>
            <li>✓ Clinically studied prebiotic fibre & probiotics</li>
          </ul>
        </div>
      </div>

      {/* Story disclosure */}
      <details className="story">
        <summary>Read the full story · The breakthrough: Fermented yeast protein</summary>
        <div>
          <p>
            “If you have ever tried to drink protein shakes… or eat traditional protein bars… you know that familiar heavy ache. The uncomfortable bloating that sits like a brick in your lower abdomen… making your pants feel tight and your stomach uncomfortable.
          </p>
          <p>
            Why does that happen? Because traditional dairy whey and raw pea isolates are foreign, dense substrates for the mature human digestive system. They ferment in the wrong part of the digestive tract… generating excess gas and inflammation.
          </p>
          <p>
            GoProteen changes this completely through natural yeast fermentation. Microorganisms break down proteins into pre-digested, easily assimilable peptides before they ever touch your lips. It digests cleanly, quickly, and weightlessly—leaving you energized without a trace of heaviness.”
          </p>
        </div>
      </details>
    </section>
  );
}
