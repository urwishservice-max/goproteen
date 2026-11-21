'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * OsteoclastCell
 * Large multinucleated bone-resorbing cell with an irregular organic lobed body,
 * multi-creased cellular membrane, ruffled border, visible nuclei,
 * and active mineral particle release.
 */
export default function OsteoclastCell({
  position = [-2.1, 0.05, 0.2],
  scale = 1.05,
  activeMode = 'balanced',
  onClick = () => {},
}) {
  const groupRef = useRef(null);

  // Generate high-subdivision organic cellular mesh with ruffled border
  const { cellGeom, ruffledGeom, nuclei, mineralParticles } = useMemo(() => {
    // 1. Organic cellular body with fine membrane folds & ruffled ripples
    const baseGeom = new THREE.SphereGeometry(0.72, 64, 64);
    const pos = baseGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));

      // Asymmetric organic lobes
      const lobeNoise =
        Math.sin(v.x * 4.0 + v.y * 3.0) * 0.12 +
        Math.cos(v.y * 5.0 + v.z * 4.0) * 0.10 +
        Math.sin(v.z * 6.0) * 0.08;

      // Fine ruffled micro-convolutions (giving the brain/cauliflower ruffled look seen in reference)
      const microRuffles =
        Math.sin(v.x * 22.0) * Math.sin(v.z * 22.0) * 0.045 +
        Math.cos(v.y * 18.0) * 0.025;

      v.multiplyScalar(1.0 + lobeNoise + microRuffles);

      // Flaring ruffled apron towards the bottom bone-contact surface
      if (v.y < -0.05) {
        const bottomFactor = Math.abs(v.y);
        v.x *= 1.0 + bottomFactor * 0.4;
        v.z *= 1.0 + bottomFactor * 0.4;
        v.y *= 0.82; // Conform to the concave lacuna
      }

      pos.setXYZ(i, v.x, v.y, v.z);
    }
    baseGeom.computeVertexNormals();

    // 2. Ruffled border contact fringe
    const ruffGeom = new THREE.TorusGeometry(0.78, 0.09, 16, 48);
    ruffGeom.rotateX(Math.PI / 2);
    const rPos = ruffGeom.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      const wave = Math.sin(rPos.getX(i) * 16.0) * 0.05;
      rPos.setY(i, rPos.getY(i) + wave);
    }
    ruffGeom.computeVertexNormals();

    // 3. Multiple visible internal chromatin nuclei
    const nucList = [
      { pos: [-0.18, 0.22, 0.16], r: 0.18 },
      { pos: [0.24, 0.18, 0.14], r: 0.16 },
      { pos: [0.04, 0.34, -0.15], r: 0.15 },
      { pos: [-0.22, 0.08, -0.22], r: 0.14 },
      { pos: [0.18, 0.1, -0.2], r: 0.15 },
    ];

    // 4. Fine mineral crystal particles released into the resorption lacuna
    const pCount = 42;
    const pPos = [];
    for (let p = 0; p < pCount; p++) {
      const angle = (p / pCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const r = 0.78 + Math.random() * 0.7;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = -0.22 + (Math.random() - 0.5) * 0.28;
      pPos.push({
        id: `mineral-particle-${p}`,
        pos: [x, y, z],
        scale: 0.035 + Math.random() * 0.04,
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      });
    }

    return {
      cellGeom: baseGeom,
      ruffledGeom: ruffGeom,
      nuclei: nucList,
      mineralParticles: pPos,
    };
  }, []);

  const isResorption = activeMode === 'resorption';
  const isFormation = activeMode === 'formation';

  const emissiveFactor = isResorption ? 0.75 : isFormation ? 0.1 : 0.32;

  // Rich warm amber/coral orange material
  const cellMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#EA580C'), // Vibrant warm amber/coral
      emissive: new THREE.Color('#9A3412'), // Rich molten glow
      emissiveIntensity: emissiveFactor,
      roughness: 0.32,
      metalness: 0.06,
      transmission: 0.2,
      thickness: 0.65,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
    });
  }, [emissiveFactor]);

  const ruffledMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C2410C'),
      emissive: new THREE.Color('#7C2D12'),
      emissiveIntensity: 0.4,
      roughness: 0.42,
    });
  }, []);

  const nucleusMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7C2D12'),
      emissive: new THREE.Color('#431407'),
      emissiveIntensity: 0.3,
      roughness: 0.25,
    });
  }, []);

  const fragmentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFBEB'), // Sparkling calcium fragment
      roughness: 0.15,
      metalness: 0.2,
    });
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      const t = Date.now() * 0.0018;
      const s = 1.0 + Math.sin(t * 1.5) * 0.012;
      groupRef.current.scale.set(scale * s, scale * (1.0 / s), scale * s);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[scale, scale, scale]}
      name="OsteoclastCell"
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
      {/* 1. Main Ruffled Multinucleated Cell Body */}
      <mesh geometry={cellGeom} material={cellMaterial} castShadow receiveShadow />

      {/* 2. Ruffled Border Contact Fringe */}
      <mesh geometry={ruffledGeom} material={ruffledMaterial} position={[0, -0.32, 0]} />

      {/* 3. Multiple Visible Nuclei */}
      {nuclei.map((nuc, idx) => (
        <mesh key={idx} position={nuc.pos}>
          <sphereGeometry args={[nuc.r, 16, 16]} />
          <primitive object={nucleusMaterial} attach="material" />
        </mesh>
      ))}

      {/* 4. Active Released Mineral Dust Fragments */}
      <group name="ReleasedMineralFragments">
        {mineralParticles.map((frag) => (
          <mesh
            key={frag.id}
            position={frag.pos}
            rotation={frag.rot}
            scale={frag.scale}
            material={fragmentMaterial}
          >
            <octahedronGeometry args={[1, 0]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
