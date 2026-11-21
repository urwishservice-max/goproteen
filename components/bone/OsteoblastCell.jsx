'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';

/**
 * SingleOsteoblast
 * A single plump cuboidal bone-forming cell with rounded edges,
 * vivid translucent bubblegum pink cytoplasm, and a prominent dark purple nucleus.
 * Exact match to reference image media_1795256513892_8322cd90.jpg.
 */
function SingleOsteoblast({
  position = [0, 0, 0],
  activeMode = 'balanced',
  index = 0,
}) {
  const meshRef = useRef(null);

  const isFormation = activeMode === 'formation';
  const isResorption = activeMode === 'resorption';
  const emissiveFactor = isFormation ? 0.65 : isResorption ? 0.12 : 0.28;

  // Glossy translucent bubblegum pink material
  const cellMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FF6584'), // Bubblegum rose pink
      emissive: new THREE.Color('#BE185D'), // Magenta glow
      emissiveIntensity: emissiveFactor,
      roughness: 0.16,
      metalness: 0.02,
      transmission: 0.35,
      thickness: 0.5,
      clearcoat: 0.92,
      clearcoatRoughness: 0.08,
    });
  }, [emissiveFactor]);

  // Deep purple/magenta nucleus
  const nucleusMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#701A75'), // Deep plum core
      emissive: new THREE.Color('#4A044E'),
      emissiveIntensity: 0.45,
      roughness: 0.22,
      metalness: 0.05,
    });
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      const t = Date.now() * 0.002 + index * 0.8;
      meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.012;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Plump Cuboidal Rounded Body */}
      <RoundedBox
        args={[0.58, 0.54, 0.54]}
        radius={0.15}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <primitive object={cellMaterial} attach="material" />
      </RoundedBox>

      {/* Embedded Front-Facing Spherical Nucleus */}
      <mesh position={[0, 0.06, 0.21]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <primitive object={nucleusMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * OsteoblastCell
 * Renders the tidy row of 4 cuboidal osteoblasts along the right osteoid crest.
 */
export default function OsteoblastCell({
  activeMode = 'balanced',
  onClick = () => {},
}) {
  // Exactly 4 cells side-by-side in a row matching the reference image
  const cellPositions = useMemo(() => [
    [0.42, 0.52, 0.05],
    [1.08, 0.52, 0.05],
    [1.74, 0.52, 0.05], // Cell 3 (pointer pin targets this cell)
    [2.40, 0.52, 0.05],
  ], []);

  return (
    <group
      name="OsteoblastsLine"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {cellPositions.map((pos, idx) => (
        <SingleOsteoblast
          key={idx}
          position={pos}
          activeMode={activeMode}
          index={idx}
        />
      ))}
    </group>
  );
}
