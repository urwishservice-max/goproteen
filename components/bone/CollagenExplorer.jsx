'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Sparkles, ChevronRight, Info } from 'lucide-react';

export default function CollagenExplorer({ onNext }) {
  const mountRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState('collagen'); // 'amino' | 'collagen' | 'calcium'
  const [isDeposited, setIsDeposited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const helixGroupRef = useRef(null);
  const mineralsGroupRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xfff5ee, 1.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffeedd, 2.2);
    dirLight1.position.set(4, 6, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd8b4fe, 1.4);
    dirLight2.position.set(-4, -5, -3);
    scene.add(dirLight2);

    // Collagen Triple Helix
    const helixGroup = new THREE.Group();
    scene.add(helixGroup);
    helixGroupRef.current = helixGroup;

    const strandMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xF472B6, roughness: 0.35, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0xFB7185, roughness: 0.35, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0xC084FC, roughness: 0.35, metalness: 0.1 }),
    ];

    const turns = 2.5;
    const heightSpan = 5.0;
    const pointsPerStrand = 90;
    const helixRadius = 0.55;

    for (let s = 0; s < 3; s++) {
      const phaseOffset = (s * Math.PI * 2) / 3;
      const curvePoints = [];

      for (let i = 0; i <= pointsPerStrand; i++) {
        const t = i / pointsPerStrand;
        const y = (t - 0.5) * heightSpan;
        const angle = t * Math.PI * 2 * turns + phaseOffset;
        const x = Math.cos(angle) * helixRadius;
        const z = Math.sin(angle) * helixRadius;
        curvePoints.push(new THREE.Vector3(x, y, z));
      }

      const spline = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeom = new THREE.TubeGeometry(spline, 70, 0.08, 12, false);
      const tubeMesh = new THREE.Mesh(tubeGeom, strandMaterials[s]);
      helixGroup.add(tubeMesh);

      const aminoGeom = new THREE.SphereGeometry(0.12, 12, 12);
      const aminoMat = new THREE.MeshStandardMaterial({
        color: 0xFFD166,
        emissive: 0x553311,
        roughness: 0.25,
      });

      for (let j = 4; j < pointsPerStrand; j += 12) {
        const pt = curvePoints[j];
        const aminoMesh = new THREE.Mesh(aminoGeom, aminoMat.clone());
        aminoMesh.position.copy(pt);
        helixGroup.add(aminoMesh);
      }
    }

    // Calcium-Phosphate Mineral Crystals
    const mineralsGroup = new THREE.Group();
    scene.add(mineralsGroup);
    mineralsGroupRef.current = mineralsGroup;

    const crystalGeom = new THREE.OctahedronGeometry(0.13, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x93C5FD,
      emissive: 0x1E3A8A,
      roughness: 0.15,
      metalness: 0.6,
    });

    const mineralCount = 40;
    const initialPos = [];
    const targetPos = [];

    for (let m = 0; m < mineralCount; m++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.6 + Math.random() * 1.5;
      const x = Math.cos(angle) * dist;
      const y = (Math.random() - 0.5) * 4.8;
      const z = Math.sin(angle) * dist;
      initialPos.push(new THREE.Vector3(x, y, z));

      const targetAngle = angle + (Math.random() - 0.5) * 0.4;
      const targetR = helixRadius + 0.12;
      const tx = Math.cos(targetAngle) * targetR;
      const tz = Math.sin(targetAngle) * targetR;
      targetPos.push(new THREE.Vector3(tx, y * 0.9, tz));

      const crystal = new THREE.Mesh(crystalGeom, crystalMat.clone());
      crystal.position.set(x, y, z);
      crystal.userData = { initialPos: initialPos[m], targetPos: targetPos[m] };
      mineralsGroup.add(crystal);
    }

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (helixGroupRef.current) helixGroupRef.current.rotation.y += 0.005;
      if (mineralsGroupRef.current) mineralsGroupRef.current.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const handleDepositAnimation = () => {
    if (!mineralsGroupRef.current || isAnimating) return;
    setIsAnimating(true);
    const crystals = mineralsGroupRef.current.children;

    crystals.forEach((crystal, idx) => {
      const target = isDeposited ? crystal.userData.initialPos : crystal.userData.targetPos;
      gsap.to(crystal.position, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 1.3,
        delay: idx * 0.02,
        ease: 'power3.out',
        onComplete: () => {
          if (idx === crystals.length - 1) {
            setIsDeposited(!isDeposited);
            setIsAnimating(false);
          }
        },
      });
      if (!isDeposited && crystal.material) {
        gsap.to(crystal.material.color, { r: 0.95, g: 0.85, b: 0.5, duration: 1.2 });
      } else if (crystal.material) {
        gsap.to(crystal.material.color, { r: 0.58, g: 0.77, b: 0.99, duration: 1.2 });
      }
    });
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* 3D Canvas Stage */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center relative p-3 rounded-3xl bg-white/50 backdrop-blur-xs border border-stone-200/60 shadow-xs">
        <div className="w-full flex items-center justify-between px-3 pt-1 mb-2 z-10">
          <div className="inline-flex rounded-full bg-stone-100 p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setSelectedElement('amino')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedElement === 'amino' ? 'bg-[#FFD166] text-[#371B48] font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              1. Amino Acids
            </button>
            <button
              type="button"
              onClick={() => setSelectedElement('collagen')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedElement === 'collagen' ? 'bg-[#FB7185] text-white font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              2. Collagen Helix
            </button>
            <button
              type="button"
              onClick={() => setSelectedElement('calcium')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedElement === 'calcium' ? 'bg-[#93C5FD] text-[#1E3A8A] font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              3. Calcium Phosphate
            </button>
          </div>
        </div>

        <div
          ref={mountRef}
          className="w-full h-[320px] sm:h-[350px] flex items-center justify-center relative select-none"
        />

        <div className="w-full px-4 pb-1 flex items-center justify-between z-10">
          <button
            type="button"
            disabled={isAnimating}
            onClick={handleDepositAnimation}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#371B48] hover:bg-[#4E2466] text-white text-xs font-semibold tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isDeposited ? 'Disperse Minerals' : 'Animate Mineral Deposition'}</span>
          </button>
          <span className="text-[11px] font-mono text-stone-500">
            {isDeposited ? 'Minerals Locked in Scaffold ✓' : 'Dispersed / Unanchored'}
          </span>
        </div>
      </div>

      {/* Explanations & Biological Accuracy */}
      <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
        <div className="p-5 rounded-3xl bg-white/70 backdrop-blur-xs border border-stone-200/70 shadow-xs space-y-2.5">
          <span className="font-mono text-xs uppercase tracking-wider text-[#8A2855] font-bold block">
            {selectedElement === 'amino' && 'Target: Essential Amino Acid Building Blocks'}
            {selectedElement === 'collagen' && 'Target: Collagen Fibril Matrix'}
            {selectedElement === 'calcium' && 'Target: Calcium-Phosphate (Hydroxyapatite)'}
          </span>
          <h4 className="text-xl font-light text-[#14091F] tracking-tight">
            {selectedElement === 'amino' && 'The Protein Synthesis Engine'}
            {selectedElement === 'collagen' && 'The Flexible Tensile Scaffold'}
            {selectedElement === 'calcium' && 'The Compressive Mineral Armor'}
          </h4>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            {selectedElement === 'amino' &&
              'Amino acids (glycine, proline, lysine) are synthesized by osteoblasts into structural collagen chains. They provide the physical triple-helix framework required for mineralization.'}
            {selectedElement === 'collagen' &&
              'Collagen accounts for 90% of the organic matrix. It confers tensile flexibility, preventing bone from shattering like dry chalk under rotational force.'}
            {selectedElement === 'calcium' &&
              'Calcium and phosphate crystallize into hydroxyapatite plates that anchor into the gaps of the collagen scaffold, creating concrete-like hardness.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-stone-200/70 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-700">
            <Info className="w-3.5 h-3.5 text-[#8A2855]" />
            <span>BIOLOGICAL RELATIONSHIP MECHANICS</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-light">
            Calcium cannot lock into place without a complete amino acid framework. Just as concrete needs steel rebar, bone requires complete protein to hold calcium inside the frame.
          </p>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#14091F] hover:bg-[#251535] text-white text-xs font-semibold tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <span>Next: Bone Remodeling</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
