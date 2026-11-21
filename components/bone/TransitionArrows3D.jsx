'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * TransitionArrows3D
 * Renders the two curved transitional flow arrows and mid-plateau mineral fragment
 * on the bone surface between Resorption and Formation.
 * Matches reference image media_1795256513892_8322cd90.jpg.
 */
export default function TransitionArrows3D() {
  // Arrow 1: Resorption to mid-plateau
  const arrow1Geom = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.35, 0.65, 0.28),
      new THREE.Vector3(-0.95, 1.05, 0.35),
      new THREE.Vector3(-0.55, 0.78, 0.28)
    );
    return new THREE.TubeGeometry(curve, 24, 0.024, 8, false);
  }, []);

  // Arrow 2: Mid-plateau to Formation osteoblasts
  const arrow2Geom = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.15, 0.78, 0.28),
      new THREE.Vector3(0.18, 1.05, 0.35),
      new THREE.Vector3(0.48, 0.78, 0.28)
    );
    return new THREE.TubeGeometry(curve, 24, 0.024, 8, false);
  }, []);

  const arrowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#1F102A'), // Dark plum/violet
    });
  }, []);

  return (
    <group name="TransitionArrows">
      {/* First curved arrow (Resorption -> Mid) */}
      <mesh geometry={arrow1Geom} material={arrowMaterial} />
      {/* Arrowhead 1 */}
      <mesh
        position={[-0.52, 0.76, 0.28]}
        rotation={[0, 0, -Math.PI / 3.0]}
      >
        <coneGeometry args={[0.07, 0.16, 12]} />
        <meshBasicMaterial color="#1F102A" />
      </mesh>

      {/* Second curved arrow (Mid -> Formation) */}
      <mesh geometry={arrow2Geom} material={arrowMaterial} />
      {/* Arrowhead 2 */}
      <mesh
        position={[0.51, 0.76, 0.28]}
        rotation={[0, 0, -Math.PI / 3.0]}
      >
        <coneGeometry args={[0.07, 0.16, 12]} />
        <meshBasicMaterial color="#1F102A" />
      </mesh>

      {/* Small Bone / Calcium Mineral Fragment on Middle Plateau */}
      <mesh position={[-0.35, 0.76, 0.30]} rotation={[0.4, 0.6, 0.2]}>
        <dodecahedronGeometry args={[0.11, 0]} />
        <meshStandardMaterial color="#FAF5EE" roughness={0.35} metalness={0.05} />
      </mesh>
    </group>
  );
}
