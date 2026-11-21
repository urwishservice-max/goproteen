'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

/**
 * BoneSubstrate
 * Exact match to reference image media_1795256513892_8322cd90.jpg:
 * - Volumetric anatomical bone block with rounded beveled corners
 * - Left concave resorption pit excavated where osteoclast sits
 * - Right vibrant pink collagenous osteoid bed where 4 osteoblasts sit
 * - Clean staggered rows of smooth circular/oval trabecular marrow pores
 *   carved into the front cutaway face with warm shadowed marrow cavities
 */
export default function BoneSubstrate({
  resorptionDepth = 0.58,
  formationHeight = 0.38,
  activeMode = 'balanced',
}) {
  const { topSurfaceGeom, osteoidGeom, pores } = useMemo(() => {
    // 1. Top cortical surface with excavated left pit and right formation bed
    const width = 9.4;
    const depth = 2.96;
    const segW = 90;
    const segD = 40;

    const topGeom = new THREE.PlaneGeometry(width, depth, segW, segD);
    topGeom.rotateX(-Math.PI / 2);

    const pos = topGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      let y = 0.74; // Baseline top surface

      // Left Concave Resorption Pit (centered around x = -2.35, z = 0.05)
      const dxResorb = x - (-2.35);
      const dzResorb = z - 0.05;
      const distResorb = Math.sqrt(dxResorb * dxResorb + dzResorb * dzResorb);
      if (distResorb < 1.48) {
        const factor = Math.cos((distResorb / 1.48) * (Math.PI / 2));
        y -= factor * factor * (resorptionDepth * 0.98);
      }

      // Right Formation Crest (x = 1.45, z = 0.05)
      const dxForm = x - 1.45;
      const dzForm = z - 0.05;
      const distForm = Math.sqrt(dxForm * dxForm + dzForm * dzForm);
      if (distForm < 1.85) {
        const factor = Math.cos((distForm / 1.85) * (Math.PI / 2));
        y += factor * factor * (formationHeight * 0.18);
      }

      // Very subtle organic surface micro-texture
      y += (Math.sin(x * 5.0) * Math.cos(z * 5.0)) * 0.008;

      pos.setY(i, y);
    }
    topGeom.computeVertexNormals();

    // 2. Vibrant pink osteoid bed surface covering the right top area
    const ostW = 3.3;
    const ostD = 2.1;
    const ostGeom = new THREE.PlaneGeometry(ostW, ostD, 32, 20);
    ostGeom.rotateX(-Math.PI / 2);
    const ostPos = ostGeom.attributes.position;
    for (let i = 0; i < ostPos.count; i++) {
      const ox = ostPos.getX(i);
      const oz = ostPos.getZ(i);
      const falloff =
        Math.cos((ox / (ostW / 2)) * (Math.PI / 2)) *
        Math.cos((oz / (ostD / 2)) * (Math.PI / 2));
      const oy = 0.745 + Math.max(0, falloff) * 0.04;
      ostPos.setY(i, oy);
    }
    ostGeom.computeVertexNormals();

    // 3. Staggered organic trabecular pores across the front cutaway wall
    // 2 neat horizontal rows matching media_1795256513892_8322cd90.jpg
    const poreList = [];
    const cols = 8;
    for (let c = 0; c < cols; c++) {
      const u = c / (cols - 1);

      // Top row of pores
      const x1 = -3.8 + u * 7.6 + (c % 2 === 0 ? 0.05 : -0.05);
      const y1 = 0.22 + ((c * 2) % 3) * 0.03;
      const r1 = 0.22 + ((c * 3) % 4) * 0.035;

      poreList.push({
        id: `pore-row1-${c}`,
        pos: [x1, y1, 1.49],
        scale: [r1 * 1.1, r1 * 0.95, 0.22],
        rotZ: (c % 2 === 0 ? 1 : -1) * 0.1,
      });

      // Bottom staggered row of pores
      if (c < cols - 1) {
        const x2 = -3.3 + u * 7.6;
        const y2 = -0.32 + ((c * 3) % 3) * 0.03;
        const r2 = 0.24 + ((c * 2) % 3) * 0.03;

        poreList.push({
          id: `pore-row2-${c}`,
          pos: [x2, y2, 1.49],
          scale: [r2 * 1.05, r2 * 0.95, 0.22],
          rotZ: (c % 2 === 0 ? -1 : 1) * 0.1,
        });
      }
    }

    return { topSurfaceGeom: topGeom, osteoidGeom: ostGeom, pores: poreList };
  }, [resorptionDepth, formationHeight]);

  // Warm ivory cortical bone materials matching reference photo
  const boneSurfaceMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FAF5EE'), // Smooth warm ivory cortical surface
      roughness: 0.35,
      metalness: 0.02,
    });
  }, []);

  const boneWallMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F6ECE1'), // Warm cream bone block body
      roughness: 0.40,
      metalness: 0.02,
    });
  }, []);

  const osteoidBedMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FF7B95'), // Vibrant pink glazed osteoid
      emissive: new THREE.Color('#BE185D'),
      emissiveIntensity: activeMode === 'formation' ? 0.45 : 0.22,
      roughness: 0.35,
      metalness: 0.02,
      transparent: true,
      opacity: 0.88,
    });
  }, [activeMode]);

  // Deep warm shadowed cavity material for pore interiors
  const poreInteriorMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#B48B69'), // Warm shadowed marrow interior
      roughness: 0.72,
      metalness: 0.02,
    });
  }, []);

  // Subtle natural pore rim material
  const poreRimMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#EFE4D6'), // Smooth beveled bone pore rim
      roughness: 0.38,
      metalness: 0.02,
    });
  }, []);

  const cavityGeom = useMemo(() => new THREE.SphereGeometry(1, 16, 12), []);
  const rimGeom = useMemo(() => new THREE.TorusGeometry(1, 0.12, 12, 24), []);

  return (
    <group name="AnatomicalBoneSegment" position={[0, -0.25, 0]}>
      {/* 1. Volumetric Bone Block with Rounded Beveled Corners */}
      <RoundedBox
        args={[9.4, 1.48, 2.95]}
        radius={0.16}
        smoothness={6}
        position={[0, -0.05, 0]}
        receiveShadow
        castShadow
      >
        <primitive object={boneWallMat} attach="material" />
      </RoundedBox>

      {/* 2. Top Cortical Bone Surface with Excavated Resorption Pit */}
      <mesh geometry={topSurfaceGeom} material={boneSurfaceMat} receiveShadow castShadow />

      {/* 3. Pink Collagenous Osteoid Bed on Right */}
      <mesh
        geometry={osteoidGeom}
        material={osteoidBedMat}
        position={[1.45, 0.01, 0.05]}
        receiveShadow
      />

      {/* 4. Smooth Organic Trabecular Marrow Pores on Front Wall */}
      <group name="FrontTrabecularPores">
        {pores.map((p) => (
          <group key={p.id} position={p.pos} rotation={[0, 0, p.rotZ]}>
            {/* Deep inner cavity shadow */}
            <mesh position={[0, 0, -0.08]} scale={p.scale}>
              <primitive object={cavityGeom} attach="geometry" />
              <primitive object={poreInteriorMat} attach="material" />
            </mesh>
            {/* Smooth beveled organic rim */}
            <mesh scale={p.scale}>
              <primitive object={rimGeom} attach="geometry" />
              <primitive object={poreRimMat} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Calcium Mineral Fragments in Resorption Pit */}
      <group position={[-2.35, 0.32, 0.05]}>
        {[
          { pos: [-0.28, 0, -0.15], s: 0.065 },
          { pos: [0.12, 0.02, 0.22], s: 0.08 },
          { pos: [-0.06, -0.01, 0.30], s: 0.06 },
          { pos: [0.30, 0.02, -0.06], s: 0.075 },
          { pos: [-0.22, 0.01, 0.19], s: 0.065 },
        ].map((c, idx) => (
          <mesh key={idx} position={c.pos} scale={[c.s, c.s * 0.8, c.s]}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#FFFBEB" roughness={0.25} metalness={0.08} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
