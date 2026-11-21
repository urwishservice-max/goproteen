'use client';

import React, { useRef } from 'react';
import GoProteenPersistentCanvas, { PersistentCanvasHandle } from './GoProteenPersistentCanvas';
import ProductScrollController from './ProductScrollController';
import ProductStorySections from './ProductStorySections';

export default function ProductStoryFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHandleRef = useRef<PersistentCanvasHandle>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#FDFBF7] text-[#14091F] font-sans selection:bg-[#9333EA]/20"
      style={{ minHeight: '800vh' }}
    >
      {/* Background Ambient Radial Gradient Aura */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none opacity-25 blur-[160px] z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(168,85,247,0.18) 45%, rgba(253,251,247,0) 75%)',
        }}
      />

      {/* ONE Persistent 3D Canvas Layer — Sticky inside the storytelling container */}
      <div className="sticky top-0 left-0 w-full h-screen pointer-events-none z-10 overflow-hidden">
        <GoProteenPersistentCanvas ref={canvasHandleRef} />
      </div>

      {/* Normal Long-Page HTML Sections — Continuous scroll updates the same single 3D model */}
      <ProductScrollController
        containerRef={containerRef}
        canvasHandleRef={canvasHandleRef}
      >
        <div className="relative z-20 -mt-[100vh]">
          <ProductStorySections />
        </div>
      </ProductScrollController>
    </div>
  );
}
