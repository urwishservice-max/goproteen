'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import BoneSubstrate from './BoneSubstrate';
import OsteoclastCell from './OsteoclastCell';
import OsteoblastCell from './OsteoblastCell';
import OsteoidLayer from './OsteoidLayer';
import MineralizationLayer from './MineralizationLayer';

/**
 * SceneAssembly - Three.js scene tree
 */
function SceneAssembly({ activeMode, onSelectCell }) {
  // Dynamic deformation parameters
  const resorptionDepth =
    activeMode === 'resorption' ? 0.8 : activeMode === 'formation' ? 0.35 : 0.6;
  const formationHeight =
    activeMode === 'formation' ? 0.65 : activeMode === 'resorption' ? 0.2 : 0.42;

  return (
    <>
      {/* High-Key Medical Studio Lighting matching reference mockup */}
      <ambientLight intensity={2.5} color="#FFFBF7" />
      <directionalLight position={[6, 8, 7]} intensity={3.2} color="#FFFFFF" castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={2.2} color="#FCE7F3" />
      <directionalLight position={[0, -3, 6]} intensity={1.8} color="#FEF3C7" />
      <pointLight position={[1.8, 1.8, 2.2]} intensity={2.5} color="#FB7185" distance={14} />
      <pointLight position={[-2.1, 1.6, 2.0]} intensity={2.5} color="#F97316" distance={14} />

      {/* Main Living Bone Microenvironment Group */}
      <group position={[0, -0.05, 0]} rotation={[0.06, 0.0, 0]}>
        {/* 1. Volumetric Bone Substrate (Cortical Surface + Front Trabecular Cutaway) */}
        <BoneSubstrate
          resorptionDepth={resorptionDepth}
          formationHeight={formationHeight}
          activeMode={activeMode}
        />

        {/* 2. Collagen-Rich Osteoid Layer under Osteoblasts */}
        <OsteoidLayer activeMode={activeMode} thickness={formationHeight} />

        {/* 3. Mineralization Front */}
        <MineralizationLayer activeMode={activeMode} />

        {/* 4. Osteoclast Bone Resorption Cell (Sitting inside Resorption Pit on Left) */}
        <OsteoclastCell
          position={[-2.1, 0.02, 0.2]}
          scale={1.12}
          activeMode={activeMode}
          onClick={() => onSelectCell('osteoclast')}
        />

        {/* 5. Osteoblast Bone Formation Cells (Right Crest) */}
        <OsteoblastCell
          activeMode={activeMode}
          onClick={() => onSelectCell('osteoblast')}
        />
      </group>

      {/* Constrained Cinematic Camera Controls matching mockup angle */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4.2}
        maxDistance={8.5}
        minPolarAngle={Math.PI / 3.0}
        maxPolarAngle={Math.PI / 2.02}
        enableDamping={true}
        dampingFactor={0.06}
        autoRotate={false}
        target={[0, 0.05, 0]}
      />
    </>
  );
}

export default function BoneRemodelingScene({
  activeMode = 'balanced',
  onSelectCell = () => {},
}) {
  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
      style={{
        maskImage:
          'radial-gradient(ellipse 75% 65% at 50% 50%, black 50%, transparent 88%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 75% 65% at 50% 50%, black 50%, transparent 88%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.48, 5.2], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.18,
        }}
      >
        <SceneAssembly activeMode={activeMode} onSelectCell={onSelectCell} />
      </Canvas>
    </div>
  );
}
