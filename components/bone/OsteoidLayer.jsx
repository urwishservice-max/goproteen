'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * OsteoidLayer
 * Collagen-rich unmineralized organic matrix layer deposited along the bone surface
 * beneath the osteoblast population. Shows soft pink/peach fibrous coloration.
 */
export default function OsteoidLayer({
  activeMode = 'balanced',
  thickness = 0.4,
}) {
  const geom = useMemo(() => {
    // Sculpted organic blanket draped over the right crest (x from 0.2 to 4.2)
    const planeGeom = new THREE.PlaneGeometry(3.8, 1.8, 32, 20);
    planeGeom.rotateX(-Math.PI / 2);

    const pos = planeGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Follow the bone crest contour with soft height thickness
      const edgeFalloff = Math.cos((x / 1.9) * (Math.PI / 2)) * Math.cos((z / 0.9) * (Math.PI / 2));
      const y = Math.max(0, edgeFalloff) * thickness * 0.45 + (Math.sin(x * 8) * Math.cos(z * 8)) * 0.02;

      pos.setY(i, y);
    }
    planeGeom.computeVertexNormals();
    return planeGeom;
  }, [thickness]);

  const isFormation = activeMode === 'formation';

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FDA4AF'), // Soft collagenous rose/pink
      emissive: new THREE.Color('#BE123C'),
      emissiveIntensity: isFormation ? 0.35 : 0.18,
      roughness: 0.42,
      metalness: 0.04,
      transparent: true,
      opacity: isFormation ? 0.96 : 0.82,
    });
  }, [isFormation]);

  return (
    <mesh
      geometry={geom}
      material={material}
      position={[2.0, 0.25, 0.15]}
      name="CollagenRichOsteoidLayer"
    />
  );
}
