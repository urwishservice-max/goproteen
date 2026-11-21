'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * TrabecularBone
 * Porous internal honeycomb architecture visible on the cutaway face,
 * showing irregular interconnected trabecular struts and marrow cavities.
 */
export default function TrabecularBone({ activeMode = 'balanced' }) {
  // Generate porous honeycomb struts and cavities along the front cross-section
  const { struts, cavities } = useMemo(() => {
    const strutList = [];
    const cavityList = [];

    // Lattice of interconnected spongy bone struts
    const cols = 14;
    const rows = 5;
    const startX = -3.8;
    const endX = 3.8;
    const startY = -0.15;
    const endY = -1.6;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const u = c / (cols - 1);
        const v = r / (rows - 1);

        const x = startX + u * (endX - startX) + (Math.random() - 0.5) * 0.22;
        const y = startY + v * (endY - startY) + (Math.random() - 0.5) * 0.15;
        const z = 2.45 + (Math.random() - 0.5) * 0.2;

        // Porous marrow cavity rings
        const radius = 0.18 + ((c + r * 3) % 4) * 0.06;
        cavityList.push({
          id: `cavity-${c}-${r}`,
          position: [x, y, z - 0.05],
          radius,
        });

        // Horizontal and diagonal interconnecting struts
        if (c < cols - 1) {
          const nextX = startX + ((c + 1) / (cols - 1)) * (endX - startX);
          const nextY = y + (Math.random() - 0.5) * 0.15;
          const dist = Math.sqrt((nextX - x) ** 2 + (nextY - y) ** 2);
          const midX = (x + nextX) / 2;
          const midY = (y + nextY) / 2;
          const angle = Math.atan2(nextY - y, nextX - x);

          strutList.push({
            id: `strut-h-${c}-${r}`,
            position: [midX, midY, z],
            length: dist,
            rotation: [0, 0, angle],
            thickness: 0.045 + (r % 2 === 0 ? 0.02 : 0),
          });
        }

        if (r < rows - 1) {
          const nextY = startY + ((r + 1) / (rows - 1)) * (endY - startY);
          const nextX = x + (Math.random() - 0.5) * 0.2;
          const dist = Math.abs(nextY - y);
          const midX = (x + nextX) / 2;
          const midY = (y + nextY) / 2;

          strutList.push({
            id: `strut-v-${c}-${r}`,
            position: [midX, midY, z],
            length: dist,
            rotation: [0, 0, Math.PI / 2],
            thickness: 0.05,
          });
        }
      }
    }

    return { struts: strutList, cavities: cavityList };
  }, []);

  // Natural warm marrow tone materials
  const strutMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E8D8C8'),
      roughness: 0.55,
      metalness: 0.05,
    });
  }, []);

  const marrowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C9A291'), // Soft warm marrow pink/tan
      roughness: 0.65,
      metalness: 0.02,
    });
  }, []);

  const strutCylinderGeom = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 10), []);
  const cavityGeom = useMemo(() => new THREE.TorusGeometry(1, 0.28, 10, 18), []);

  return (
    <group name="TrabecularBoneSpongyLattice">
      {/* Deep Front Wall Backdrop representing the Marrow Cavity interior */}
      <mesh position={[0, -0.9, 2.3]}>
        <boxGeometry args={[7.8, 1.7, 0.35]} />
        <meshStandardMaterial color="#E2D2C2" roughness={0.7} />
      </mesh>

      {/* Honeycomb Porous Cavities */}
      {cavities.map((cav) => (
        <mesh
          key={cav.id}
          geometry={cavityGeom}
          material={marrowMaterial}
          position={cav.position}
          scale={[cav.radius, cav.radius, cav.radius]}
          rotation={[0, 0, Math.random() * Math.PI]}
        />
      ))}

      {/* Interconnecting Trabecular Struts */}
      {struts.map((st) => (
        <mesh
          key={st.id}
          geometry={strutCylinderGeom}
          material={strutMaterial}
          position={st.position}
          rotation={st.rotation}
          scale={[st.thickness, st.length, st.thickness]}
        />
      ))}
    </group>
  );
}
