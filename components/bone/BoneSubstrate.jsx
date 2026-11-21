'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * BoneSubstrate
 * Volumetric anatomical living bone cutaway matching the reference mockup:
 * - Top surface: Natural undulating cortical surface with an excavated resorption bowl on the left
 *   and an osteoid-coated bone formation crest on the right.
 * - Front face: Rich fine-textured spongy trabecular bone lattice with numerous rounded marrow cavities.
 */
export default function BoneSubstrate({
  resorptionDepth = 0.65,
  formationHeight = 0.42,
  activeMode = 'balanced',
}) {
  const { topGeom, frontGeom, pores } = useMemo(() => {
    const width = 11.0;
    const depth = 4.2;
    const segW = 90;
    const segD = 42;

    const getElevation = (x, z) => {
      let y = Math.sin(x * 0.4) * 0.22 + Math.cos(z * 0.6) * 0.12;

      // Concave Resorption Pit on the left (x = -2.1, z = 0.2)
      const dxResorb = x - (-2.1);
      const dzResorb = z - 0.2;
      const distResorb = Math.sqrt(dxResorb * dxResorb + dzResorb * dzResorb);
      if (distResorb < 1.85) {
        const factor = Math.cos((distResorb / 1.85) * (Math.PI / 2));
        y -= factor * factor * (resorptionDepth * 1.55);
      }

      // Convex Formation Crest on the right (x = 1.9, z = 0.2)
      const dxForm = x - 1.9;
      const dzForm = z - 0.2;
      const distForm = Math.sqrt(dxForm * dxForm + dzForm * dzForm);
      if (distForm < 2.5) {
        const factor = Math.cos((distForm / 2.5) * (Math.PI / 2));
        y += factor * factor * (formationHeight * 1.3);
      }

      y += (Math.sin(x * 6.0) * Math.cos(z * 6.0)) * 0.035;
      return y;
    };

    // 1. Top Cortical Bone Surface
    const top = new THREE.PlaneGeometry(width, depth, segW, segD);
    top.rotateX(-Math.PI / 2);
    const topPos = top.attributes.position;
    for (let i = 0; i < topPos.count; i++) {
      const x = topPos.getX(i);
      const z = topPos.getZ(i);
      topPos.setY(i, getElevation(x, z));
    }
    top.computeVertexNormals();

    // 2. Organic Front Cutaway Face
    const frontSegY = 32;
    const front = new THREE.PlaneGeometry(width, 1.8, segW, frontSegY);
    const frontPos = front.attributes.position;
    for (let i = 0; i < frontPos.count; i++) {
      const x = frontPos.getX(i);
      const origY = frontPos.getY(i);
      const v = (origY + 0.9) / 1.8; // 0 at bottom, 1 at top

      const topY = getElevation(x, 1.95);
      const bottomY = -1.35;

      const y = bottomY + v * (topY - bottomY);
      const z = 1.95 + Math.sin(v * Math.PI) * 0.12 + (Math.sin(x * 4.0) * 0.04);

      frontPos.setY(i, y);
      frontPos.setZ(i, z);
    }
    front.computeVertexNormals();

    // 3. Dense, fine-scale spongy trabecular honeycomb pores matching reference
    const poreList = [];
    const cols = 28;
    const rows = 5;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const u = c / (cols - 1);
        const v = r / (rows - 1);

        const px = -4.8 + u * 9.6 + Math.sin(r * 4.2 + c * 2.1) * 0.12;
        const topYAtX = getElevation(px, 1.95);
        const py = topYAtX - 0.32 - v * 0.85 + Math.cos(c * 3.7 + r) * 0.06;
        const pz = 2.02 + Math.sin((1 - v) * Math.PI) * 0.08;

        // Tighter, fine-scale pore radii
        const radius = 0.085 + ((c * 4 + r * 9) % 6) * 0.025;

        poreList.push({
          id: `pore-${c}-${r}`,
          pos: [px, py, pz],
          scale: [radius, radius * 0.92, radius * 0.28],
          rotZ: Math.sin(c + r * 2) * 0.7,
        });
      }
    }

    return { topGeom: top, frontGeom: front, pores: poreList };
  }, [resorptionDepth, formationHeight]);

  // Warm ivory & porous marrow materials
  const boneMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FAF3EB'),
      roughness: 0.35,
      metalness: 0.03,
      flatShading: false,
    });
  }, []);

  const frontCutawayMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#EFE1D2'),
      roughness: 0.48,
      metalness: 0.02,
      flatShading: false,
    });
  }, []);

  const poreRimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E2CCA8'), // Golden-cream cavity rim
      roughness: 0.4,
      metalness: 0.04,
    });
  }, []);

  const poreVoidMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#A87B65'), // Warm marrow cavity depth
      roughness: 0.75,
    });
  }, []);

  const torusGeom = useMemo(() => new THREE.TorusGeometry(1, 0.24, 12, 20), []);
  const sphereGeom = useMemo(() => new THREE.SphereGeometry(1, 14, 10), []);

  return (
    <group name="LivingBoneMicroenvironmentSubstrate">
      {/* 1. Undulating Cortical Bone Surface */}
      <mesh geometry={topGeom} material={boneMaterial} receiveShadow castShadow />

      {/* 2. Organic Undulating Front Cutaway Wall */}
      <mesh geometry={frontGeom} material={frontCutawayMaterial} receiveShadow />

      {/* 3. Spongy Trabecular Cavities */}
      <group name="TrabecularMarrowCavities">
        {pores.map((p) => (
          <group key={p.id} position={p.pos} rotation={[0, 0, p.rotZ]}>
            {/* Deep inner cavity shadow */}
            <mesh position={[0, 0, -0.05]} scale={p.scale}>
              <primitive object={sphereGeom} attach="geometry" />
              <primitive object={poreVoidMaterial} attach="material" />
            </mesh>
            {/* Rounded organic pore rim */}
            <mesh scale={p.scale}>
              <primitive object={torusGeom} attach="geometry" />
              <primitive object={poreRimMaterial} attach="material" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
