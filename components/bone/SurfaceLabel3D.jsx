'use client';

import React from 'react';
import { Html } from '@react-three/drei';

/**
 * SurfaceLabel3D
 * Floating 3D label sitting directly on the front rim of the bone cutaway.
 * Matches reference image media_1795256513892_8322cd90.jpg.
 */
export default function SurfaceLabel3D({
  position = [0, 0, 0],
  title = 'Resorption',
  subtitle = '(old bone removed)',
  onClick = () => {},
}) {
  return (
    <group position={position}>
      <Html center distanceFactor={8.2} zIndexRange={[100, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex flex-col items-center text-center select-none cursor-pointer transition-transform duration-200 hover:scale-105 whitespace-nowrap"
        >
          <span className="text-xs sm:text-[13px] font-bold text-[#14091F] tracking-tight block leading-tight">
            {title}
          </span>
          <span className="text-[10px] sm:text-[11px] text-stone-500 italic font-light block leading-tight pt-0.5">
            {subtitle}
          </span>
        </div>
      </Html>
    </group>
  );
}
