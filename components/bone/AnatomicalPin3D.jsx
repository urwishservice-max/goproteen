'use client';

import React from 'react';
import { Html, Line } from '@react-three/drei';

/**
 * AnatomicalPin3D
 * 3D Anchored Pointer Pin that stays physically connected to its 3D object in scene coordinates.
 * Includes anchor sphere, crisp 3D leader line, and floating billboard pill label.
 * Matches reference image media_1795256513892_8322cd90.jpg.
 */
export default function AnatomicalPin3D({
  anchorPos = [0, 0, 0],
  labelPos = [0, 1.2, 0],
  dotColor = '#FF7A00',
  title = 'Cell Title',
  subtitle = 'Cell Description',
  isActive = false,
  onClick = () => {},
}) {
  return (
    <group name={`Pin3D-${title}`}>
      {/* 1. Small Anchor Dot on the Mesh Surface */}
      <mesh position={anchorPos}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={dotColor} />
      </mesh>

      {/* 2. Crisp 3D Leader Line from Anchor to Floating Label */}
      <Line
        points={[anchorPos, [labelPos[0], labelPos[1] - 0.08, labelPos[2]]]}
        color="#14091F"
        lineWidth={1.5}
        transparent
        opacity={0.85}
      />

      {/* 3. Billboard 3D Anchored Pill Label */}
      <Html
        position={labelPos}
        center
        distanceFactor={8.2}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-sm cursor-pointer transition-all duration-300 hover:scale-105 select-none whitespace-nowrap ${
            isActive ? 'ring-2 ring-purple-300 scale-105' : ''
          }`}
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: dotColor }}
          />
          <div className="flex items-center gap-1.5 text-left">
            <span className="text-xs sm:text-[13px] font-bold text-[#14091F] tracking-tight">{title}</span>
            {subtitle && (
              <span className="text-[10px] sm:text-[11px] text-stone-500 italic font-light font-sans">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}
