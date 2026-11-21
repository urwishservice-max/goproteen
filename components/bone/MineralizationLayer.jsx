'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * MineralizationLayer
 * Crystalline hydroxyapatite mineral deposition fronts integrating into the
 * newly formed osteoid matrix, with small sparkling crystal facets.
 */
export default function MineralizationLayer({
  activeMode = 'balanced',
}) {
  const crystals = useMemo(() => {
    const list = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const u = i / count;
      const x = 0.5 + u * 3.2;
      const y = 0.15 + (Math.sin(u * Math.PI) * 0.12) + (Math.random() - 0.5) * 0.08;
      const z = 0.05 + (Math.random() - 0.5) * 0.25;
      list.push({
        id: `mineral-front-${i}`,
        pos: [x, y, z],
        scale: 0.045 + Math.random() * 0.035,
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      });
    }
    return list;
  }, []);

  const crystalGeom = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const crystalMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E0F2FE'), // Translucent ice/ivory mineral
      emissive: new THREE.Color('#38BDF8'),
      emissiveIntensity: 0.35,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.65,
    });
  }, []);

  return (
    <group name="MineralizationFront">
      {crystals.map((c) => (
        <mesh
          key={c.id}
          geometry={crystalGeom}
          material={crystalMat}
          position={c.pos}
          rotation={c.rot}
          scale={c.scale}
        />
      ))}
    </group>
  );
}
