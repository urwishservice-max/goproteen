'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import BoneSubstrate from './BoneSubstrate';
import OsteoclastCell from './OsteoclastCell';
import OsteoblastCell from './OsteoblastCell';
import TransitionArrows3D from './TransitionArrows3D';
import AnatomicalPin3D from './AnatomicalPin3D';
import SurfaceLabel3D from './SurfaceLabel3D';

/**
 * CameraController
 * Smoothly shifts camera framing based on activeMode (Balanced, Formation, Resorption)
 */
function CameraController({ activeMode }) {
  const controlsRef = useRef(null);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    let targetX = 0;
    let targetY = -0.05;
    let targetZ = 0;
    let camX = 0;
    let camY = 1.35;
    let camZ = 9.4;

    if (activeMode === 'resorption') {
      targetX = -1.4;
      targetY = 0.05;
      camX = -1.35;
      camY = 1.25;
      camZ = 8.2;
    } else if (activeMode === 'formation') {
      targetX = 1.35;
      targetY = 0.05;
      camX = 1.3;
      camY = 1.25;
      camZ = 8.2;
    }

    const dampSpeed = 3.5;
    controlsRef.current.target.x = THREE.MathUtils.damp(
      controlsRef.current.target.x,
      targetX,
      dampSpeed,
      delta
    );
    controlsRef.current.target.y = THREE.MathUtils.damp(
      controlsRef.current.target.y,
      targetY,
      dampSpeed,
      delta
    );
    controlsRef.current.target.z = THREE.MathUtils.damp(
      controlsRef.current.target.z,
      targetZ,
      dampSpeed,
      delta
    );

    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      camX,
      dampSpeed,
      delta
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      camY,
      dampSpeed,
      delta
    );
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      camZ,
      dampSpeed,
      delta
    );

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      minPolarAngle={Math.PI / 3.6}
      maxPolarAngle={Math.PI / 2.05}
      enableDamping={true}
      dampingFactor={0.08}
      target={[0, -0.05, 0]}
    />
  );
}

/**
 * SceneAssembly - Three.js scene tree
 */
function SceneAssembly({ activeMode, onSelectCell }) {
  // Biological deformation parameters
  const resorptionDepth =
    activeMode === 'resorption' ? 0.78 : activeMode === 'formation' ? 0.42 : 0.58;
  const formationHeight =
    activeMode === 'formation' ? 0.62 : activeMode === 'resorption' ? 0.22 : 0.38;

  return (
    <>
      {/* High-Key Medical Studio Lighting matching reference image */}
      <ambientLight intensity={2.6} color="#FFFBF7" />
      <directionalLight position={[6, 8, 7]} intensity={3.2} color="#FFFFFF" castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={2.2} color="#FCE7F3" />
      <directionalLight position={[0, -3, 6]} intensity={1.8} color="#FEF3C7" />
      <pointLight position={[1.8, 1.8, 2.2]} intensity={2.4} color="#FB7185" distance={14} />
      <pointLight position={[-2.35, 1.6, 2.0]} intensity={2.4} color="#F97316" distance={14} />

      {/* Main Living Bone Microenvironment Group */}
      <group position={[0, -0.05, 0]}>
        {/* 1. Volumetric Bone Substrate (Cortical Surface + Front Trabecular Cutaway) */}
        <BoneSubstrate
          resorptionDepth={resorptionDepth}
          formationHeight={formationHeight}
          activeMode={activeMode}
        />

        {/* 2. Osteoclast Bone Resorption Cell (Sitting deep inside Pit on Left) */}
        <OsteoclastCell
          position={[-2.35, 0.14, 0.05]}
          scale={1.0}
          activeMode={activeMode}
          onClick={() => onSelectCell('osteoclast')}
        />

        {/* 3. Tidy Row of 4 Plump Osteoblasts (Right Osteoid Bed) */}
        <OsteoblastCell
          activeMode={activeMode}
          onClick={() => onSelectCell('osteoblast')}
        />

        {/* 4. Transitional Surface Flow Arrows & Mid Fragment */}
        <TransitionArrows3D />

        {/* 5. 3D Anchored Pins */}
        {/* Pin 1: Osteoclast */}
        <AnatomicalPin3D
          anchorPos={[-2.35, 0.88, 0.05]}
          labelPos={[-2.35, 1.88, 0.05]}
          dotColor="#FF7A00"
          title="Osteoclast"
          subtitle="(Removes old bone)"
          isActive={activeMode === 'resorption'}
          onClick={() => onSelectCell('osteoclast')}
        />

        {/* Pin 2: Osteoblast */}
        <AnatomicalPin3D
          anchorPos={[2.05, 0.82, 0.05]}
          labelPos={[2.05, 1.88, 0.05]}
          dotColor="#E02B78"
          title="Osteoblast"
          subtitle="(Builds new bone)"
          isActive={activeMode === 'formation'}
          onClick={() => onSelectCell('osteoblast')}
        />

        {/* 6. Surface Labels on Front Bone Rim */}
        <SurfaceLabel3D
          position={[-2.35, -0.06, 1.55]}
          title="Resorption"
          subtitle="(old bone removed)"
          onClick={() => onSelectCell('resorption')}
        />

        <SurfaceLabel3D
          position={[1.55, -0.06, 1.55]}
          title="Formation"
          subtitle="(new bone built)"
          onClick={() => onSelectCell('formation')}
        />
      </group>

      {/* Smooth Camera Controller */}
      <CameraController activeMode={activeMode} />
    </>
  );
}

export default function BoneRemodelingScene({
  activeMode = 'balanced',
  onSelectCell = () => {},
}) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none min-h-[460px]">
      <Canvas
        dpr={[1, typeof window !== 'undefined' && window.innerWidth <= 800 ? 1.0 : 1.5]}
        camera={{ position: [0, 1.35, 9.4], fov: 34 }}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <SceneAssembly activeMode={activeMode} onSelectCell={onSelectCell} />
      </Canvas>
    </div>
  );
}
