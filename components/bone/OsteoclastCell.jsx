'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * OsteoclastCell
 * Exact match to reference image media_1795256513892_8322cd90.jpg:
 * - Vibrant warm orange/amber dome sitting directly inside the excavated resorption pit
 * - 5 prominent bulging spherical purple/lavender nuclei across the upper-front face facing the viewer
 * - Radiating ruffled border tentacles clinging to the bone surface
 */
export default function OsteoclastCell({
  position = [-2.35, 0.14, 0.05],
  scale = 1.0,
  activeMode = 'balanced',
  onClick = () => {},
}) {
  const groupRef = useRef(null);

  // Generate organic orange dome and ruffled perimeter tentacles
  const { domeGeom, tentacles, nuclei } = useMemo(() => {
    // 1. Smooth organic dome with flattening at the base
    const geom = new THREE.SphereGeometry(0.82, 36, 28);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      if (v.y < 0) v.y *= 0.3; // Flat bottom to sit snugly in pit
      const noise = Math.sin(v.x * 5) * 0.03 + Math.cos(v.z * 5) * 0.03;
      v.multiplyScalar(1.0 + noise);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();

    // 2. Perimeter ruffled fringe tentacles extending outward onto bone
    const tentacleList = [];
    const tCount = 24;
    for (let t = 0; t < tCount; t++) {
      const angle = (t / tCount) * Math.PI * 2;
      const r = 0.82;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const len = 0.24 + (t % 3) * 0.07;
      const rotY = -angle;

      tentacleList.push({
        id: `ruffle-${t}`,
        pos: [x, -0.08, z],
        rot: [0.36, rotY, 0],
        scale: [0.06, len, 0.06],
      });
    }

    // 3. Exactly 5 prominent purple spherical nuclei clustered on the front-facing upper dome
    // Direct match to media_1795256513892_8322cd90.jpg
    const nucList = [
      { id: 'nuc-top', pos: [0.0, 0.64, 0.36], r: 0.18 },
      { id: 'nuc-mid-left', pos: [-0.28, 0.48, 0.44], r: 0.17 },
      { id: 'nuc-mid-right', pos: [0.26, 0.50, 0.42], r: 0.17 },
      { id: 'nuc-front-center', pos: [0.02, 0.35, 0.62], r: 0.16 },
      { id: 'nuc-front-left', pos: [-0.26, 0.28, 0.56], r: 0.15 },
    ];

    return { domeGeom: geom, tentacles: tentacleList, nuclei: nucList };
  }, []);

  const isResorption = activeMode === 'resorption';
  const isFormation = activeMode === 'formation';
  const emissiveFactor = isResorption ? 0.72 : isFormation ? 0.12 : 0.30;

  // Vibrant warm orange/amber material with glossy clearcoat
  const cytoplasmMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FF7A00'), // Rich warm orange
      emissive: new THREE.Color('#EA580C'),
      emissiveIntensity: emissiveFactor,
      roughness: 0.20,
      metalness: 0.02,
      clearcoat: 0.92,
      clearcoatRoughness: 0.10,
    });
  }, [emissiveFactor]);

  // Vivid purple spherical nuclei material
  const nucleusMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#8B5CF6'), // Vivid purple/lavender
      emissive: new THREE.Color('#6D28D9'),
      emissiveIntensity: 0.38,
      roughness: 0.22,
      metalness: 0.04,
      clearcoat: 0.85,
    });
  }, []);

  const ruffledMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F97316'),
      roughness: 0.32,
    });
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      const t = Date.now() * 0.0018;
      // Gentle biological respiration
      groupRef.current.position.y = position[1] + Math.sin(t * 1.4) * 0.012;
    }
  });

  return (
    <group
      ref={groupRef}
      name="OsteoclastCell"
      position={position}
      scale={[scale, scale, scale]}
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
      {/* 1. Main Vibrant Orange Dome */}
      <mesh geometry={domeGeom} material={cytoplasmMaterial} castShadow receiveShadow />

      {/* 2. Bulging Purple Spherical Nuclei on Front/Top */}
      {nuclei.map((n) => (
        <mesh key={n.id} position={n.pos} castShadow>
          <sphereGeometry args={[n.r, 20, 20]} />
          <primitive object={nucleusMaterial} attach="material" />
        </mesh>
      ))}

      {/* 3. Radiating Ruffled Perimeter Skirt Tentacles */}
      {tentacles.map((t) => (
        <mesh key={t.id} position={t.pos} rotation={t.rot} scale={t.scale}>
          <cylinderGeometry args={[0.7, 1.25, 1, 8]} />
          <primitive object={ruffledMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}
