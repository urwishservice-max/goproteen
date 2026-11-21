'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * ResorptionLacuna
 * Scalloped concave erosion cavity (Howship's lacuna) excavated into the bone
 * beneath the active osteoclast. Shows etched mineral excavation margins.
 */
export default function ResorptionLacuna({
  activeMode = 'balanced',
  depth = 0.45,
}) {
  const geom = useMemo(() => {
    // Scalloped bowl shape
    const bowlGeom = new THREE.SphereGeometry(1.2, 24, 16, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55);
    bowlGeom.rotateX(Math.PI);
    return bowlGeom;
  }, []);

  const isResorption = activeMode === 'resorption';

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D6C4B4'), // Etched eroded bone cavity
      roughness: 0.65,
      metalness: 0.08,
    });
  }, []);

  return (
    <mesh
      geometry={geom}
      material={material}
      position={[-2.2, -0.05, 0.0]}
      scale={[1.1, depth * 1.5, 0.95]}
      name="HowshipsResorptionLacuna"
    />
  );
}
