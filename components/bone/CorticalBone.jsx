'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * CorticalBone
 * Dense outer compact bone surface with natural organic undulation,
 * layered mineral texture, and concave resorption / convex formation deformation.
 */
export function createCorticalGeometry(resorptionDepth = 0.45, formationHeight = 0.35) {
  const width = 8.0;
  const length = 5.0;
  const segW = 64;
  const segL = 40;

  const geom = new THREE.PlaneGeometry(width, length, segW, segL);
  geom.rotateX(-Math.PI / 2);

  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);

    // Natural undulating base terrain
    let y =
      Math.sin(x * 0.7) * 0.18 +
      Math.cos(z * 0.9) * 0.12 +
      Math.sin(x * 1.8 + z * 1.5) * 0.05;

    // Resorption pit on the left (x approx -2.2, z approx 0.0)
    const dxResorb = x - (-2.2);
    const dzResorb = z - 0.1;
    const distResorb = Math.sqrt(dxResorb * dxResorb + dzResorb * dzResorb);
    if (distResorb < 1.4) {
      const pitFactor = Math.cos((distResorb / 1.4) * (Math.PI / 2));
      y -= pitFactor * pitFactor * resorptionDepth;
    }

    // Formation ridge on the right (x approx 1.6, z approx 0.1)
    const dxForm = x - 1.6;
    const dzForm = z - 0.1;
    const distForm = Math.sqrt(dxForm * dxForm + dzForm * dzForm);
    if (distForm < 2.0) {
      const formFactor = Math.cos((distForm / 2.0) * (Math.PI / 2));
      y += formFactor * formFactor * formationHeight;
    }

    pos.setY(i, y);
  }

  geom.computeVertexNormals();
  return geom;
}

export default function CorticalBone({
  resorptionDepth = 0.45,
  formationHeight = 0.35,
  activeMode = 'balanced',
}) {
  const geom = useMemo(
    () => createCorticalGeometry(resorptionDepth, formationHeight),
    [resorptionDepth, formationHeight]
  );

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F7EFE6'), // Warm ivory
      roughness: 0.42,
      metalness: 0.04,
      flatShading: false,
    });
  }, []);

  return (
    <mesh geometry={geom} material={material} receiveShadow castShadow name="CorticalBoneSurface" />
  );
}
