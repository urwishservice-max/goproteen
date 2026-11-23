'use client';

import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const FEMUR_MODEL_PATH = '/models/femur_cutaway.glb';

// Only load when mounted in viewport
// (Preload removed to prevent mobile bandwidth saturation on initial load)

function FemurMesh({ age = 30 }) {
  const { scene } = useGLTF(FEMUR_MODEL_PATH);
  const trabecularRef = useRef(null);

  // High-Quality Realistic Ivory Bone PBR Materials (Calibrated against Overexposure)
  const corticalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#EAE1D2'), // Natural organic ivory bone tone
      roughness: 0.52,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
  }, []);

  const trabecularMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C9A87C'), // Natural warm spongy honeycomb cancellous bone tone
      roughness: 0.60,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
  }, []);

  // Compute target morph target weights based on continuous age (30 to 60)
  const targetWeights = useMemo(() => {
    const clampedAge = Math.max(30, Math.min(60, age));
    let w40 = 0;
    let w50 = 0;
    let w60 = 0;

    if (clampedAge <= 40) {
      const t = (clampedAge - 30) / 10.0;
      w40 = t;
      w50 = 0;
      w60 = 0;
    } else if (clampedAge <= 50) {
      const t = (clampedAge - 40) / 10.0;
      w40 = 1.0 - t;
      w50 = t;
      w60 = 0;
    } else {
      const t = (clampedAge - 50) / 10.0;
      w40 = 0;
      w50 = 1.0 - t;
      w60 = t;
    }
    return [w40, w50, w60];
  }, [age]);

  // Clone scene for safe material and morph target assignment
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        if (child.name.includes('Trabecular')) {
          child.material = trabecularMaterial;
          trabecularRef.current = child;
          if (child.morphTargetInfluences) {
            child.morphTargetInfluences[0] = targetWeights[0];
            child.morphTargetInfluences[1] = targetWeights[1];
            child.morphTargetInfluences[2] = targetWeights[2];
          }
        } else {
          child.material = corticalMaterial;
        }
      }
    });
    return clone;
  }, [scene, corticalMaterial, trabecularMaterial]);

  // Ensure morph target influences are initialized immediately when cloned or on age change
  useEffect(() => {
    const trabMesh = trabecularRef.current;
    if (trabMesh && trabMesh.morphTargetInfluences) {
      if (!trabMesh.__initialized) {
        trabMesh.morphTargetInfluences[0] = targetWeights[0];
        trabMesh.morphTargetInfluences[1] = targetWeights[1];
        trabMesh.morphTargetInfluences[2] = targetWeights[2];
        trabMesh.__initialized = true;
      }
    }
  }, [targetWeights]);

  // Smooth real-time interpolation of 3D trabecular morph targets
  useFrame((_, delta) => {
    const trabMesh = trabecularRef.current;
    if (trabMesh && trabMesh.morphTargetInfluences) {
      const lerpSpeed = Math.min(1.0, delta * 14.0);
      trabMesh.morphTargetInfluences[0] = THREE.MathUtils.lerp(
        trabMesh.morphTargetInfluences[0] ?? 0,
        targetWeights[0],
        lerpSpeed
      );
      trabMesh.morphTargetInfluences[1] = THREE.MathUtils.lerp(
        trabMesh.morphTargetInfluences[1] ?? 0,
        targetWeights[1],
        lerpSpeed
      );
      trabMesh.morphTargetInfluences[2] = THREE.MathUtils.lerp(
        trabMesh.morphTargetInfluences[2] ?? 0,
        targetWeights[2],
        lerpSpeed
      );
    }
  });

  // Large prominent bone with natural anatomical diagonal orientation
  return (
    <group position={[0.0, 0.0, 0.0]} rotation={[0.04, -0.10, 0.12]} scale={1.0}>
      <primitive object={clonedScene} />
    </group>
  );
}

function Loader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent pointer-events-none z-20">
      <div className="w-8 h-8 rounded-full border-2 border-[#8A2855] border-t-transparent animate-spin mb-2" />
      <span className="text-[10px] font-mono tracking-widest text-[#8A2855] uppercase font-medium">
        Loading 3D Cutaway Femur...
      </span>
    </div>
  );
}

export default function InteractiveFemur({ age = 30 }) {
  const controlsRef = useRef(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible">
      <Suspense fallback={<Loader />}>
        <Canvas
          dpr={[1, typeof window !== 'undefined' && window.innerWidth <= 800 ? 1.0 : 1.5]}
          camera={{
            position: [0.0, 0.02, 0.74],
            fov: 38,
            near: 0.05,
            far: 10,
          }}
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ background: 'transparent' }}
        >
          {/* Calibrated Natural Studio Lighting (Shadow Depth without Overexposure) */}
          <ambientLight intensity={0.42} color="#FFFFFF" />
          <directionalLight
            position={[3.0, 4.0, 3.2]}
            intensity={0.78}
            color="#FFFFFF"
          />
          <directionalLight
            position={[-3.2, 1.2, 1.8]}
            intensity={0.24}
            color="#F4EFF8"
          />
          <directionalLight
            position={[0.0, 2.5, -3.2]}
            intensity={0.32}
            color="#E6EDF2"
          />
          {/* Soft natural cavity fill */}
          <pointLight
            position={[0.005, 0.12, 0.08]}
            intensity={0.12}
            color="#FFF6E8"
            distance={0.5}
          />

          {/* 3D Femur with dynamic age deformation */}
          <FemurMesh age={age} />

          {/* Orbit controls with damped rotation and page-safe scroll (zoom disabled) */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={(5 * Math.PI) / 6}
            enableDamping={true}
            dampingFactor={0.06}
            target={[0.0, 0.01, 0.0]}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
