'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * SingleOsteoblast
 * Individual plump, rounded/cuboidal bone builder cell with glowing central nucleus,
 * translucent pink/rose membrane, and active matrix synthesis.
 */
export function SingleOsteoblast({
  position = [0, 0, 0],
  scale = 0.45,
  activeMode = 'balanced',
  seed = 0,
}) {
  const meshRef = useRef(null);

  // Plump rounded dome shape with organic micro-vesicles
  const { cellGeom, vesicles } = useMemo(() => {
    const geom = new THREE.SphereGeometry(1.0, 36, 36);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      // Dome flattening at base
      if (v.y < 0) v.y *= 0.65;
      const noise = Math.sin(v.x * 6.0 + seed) * 0.05 + Math.cos(v.z * 6.0 + seed) * 0.05;
      v.multiplyScalar(1.0 + noise);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();

    // 4-6 Small secretory vesicles on top of the cell membrane
    const vList = [];
    for (let j = 0; j < 5; j++) {
      const ang = (j / 5) * Math.PI * 2;
      const r = 0.55 + (j % 2) * 0.2;
      vList.push({
        pos: [Math.cos(ang) * r, 0.45 + (j % 3) * 0.12, Math.sin(ang) * r],
        radius: 0.12 + (j % 3) * 0.04,
      });
    }

    return { cellGeom: geom, vesicles: vList };
  }, [seed]);

  const isFormation = activeMode === 'formation';
  const isResorption = activeMode === 'resorption';

  const emissiveFactor = isFormation ? 0.75 : isResorption ? 0.12 : 0.32;

  // Translucent vivid glossy rose/magenta cytoplasm membrane
  const cellMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FB7185'), // Vibrant rose pink
      emissive: new THREE.Color('#BE185D'), // Deep magenta glow
      emissiveIntensity: emissiveFactor,
      roughness: 0.18,
      metalness: 0.04,
      transmission: 0.4,
      thickness: 0.55,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
    });
  }, [emissiveFactor]);

  const vesicleMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F43F5E'),
      emissive: new THREE.Color('#9F1239'),
      emissiveIntensity: 0.4,
      roughness: 0.2,
      clearcoat: 0.8,
    });
  }, []);

  const nucleusMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#831843'), // Chromatin core
      emissive: new THREE.Color('#500724'),
      emissiveIntensity: 0.45,
      roughness: 0.2,
    });
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      const t = Date.now() * 0.002 + seed * 1.5;
      meshRef.current.position.y = position[1] + Math.sin(t * 1.6) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={[scale, scale, scale]}>
      {/* Plump Translucent Cell Body */}
      <mesh geometry={cellGeom} material={cellMaterial} castShadow receiveShadow />

      {/* Prominent Central Nucleus */}
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.34, 16, 16]} />
        <primitive object={nucleusMaterial} attach="material" />
      </mesh>

      {/* Secretory Vesicles */}
      {vesicles.map((v, idx) => (
        <mesh key={idx} position={v.pos}>
          <sphereGeometry args={[v.radius, 12, 12]} />
          <primitive object={vesicleMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

export default function OsteoblastCell({
  activeMode = 'balanced',
  onClick = () => {},
}) {
  // Line of 5 osteoblasts resting on the right crest matching the mockup
  const blasts = useMemo(() => {
    return [
      { id: 'ob-1', pos: [0.65, 0.42, 0.15], scale: 0.46, seed: 1 },
      { id: 'ob-2', pos: [1.35, 0.50, 0.10], scale: 0.52, seed: 2 }, // Hero central osteoblast
      { id: 'ob-3', pos: [2.05, 0.44, 0.20], scale: 0.44, seed: 3 },
      { id: 'ob-4', pos: [2.75, 0.36, 0.25], scale: 0.38, seed: 4 },
      { id: 'ob-5', pos: [3.35, 0.28, 0.15], scale: 0.34, seed: 5 },
    ];
  }, []);

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
      {blasts.map((b) => (
        <SingleOsteoblast
          key={b.id}
          position={b.pos}
          scale={b.scale}
          activeMode={activeMode}
          seed={b.seed}
        />
      ))}
    </group>
  );
}
