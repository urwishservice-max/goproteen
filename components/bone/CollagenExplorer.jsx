'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import {
  Sparkles,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Dna,
  ShieldCheck,
  Layers,
  Activity,
  CheckCircle2,
  Gem,
} from 'lucide-react';

/**
 * CollagenExplorer
 * 
 * Interactive 3D Mineral Matrix for GoProteen (Section 03)
 * - Central Visual: Realistic 3D Collagen Triple Helix with Calcium-Phosphate Crystals
 * - 3 Intertwined Protein Chains (Coral, Pink, Lavender) with inter-chain hydrogen bonds
 * - Calcium-Phosphate mineral clusters (ice-blue calcium + lavender/pink phosphate crystals)
 * - 3 Exploration Modes: Amino Acids, Collagen Helix, Calcium-Phosphate
 * - Signature Interaction: "ANIMATE MINERAL DEPOSITION" with lock-in animation & glowing mineralization
 * - Warm ivory background, deep plum typography, pastel glow aura, minimal translucent panels
 */
export default function CollagenExplorer({
  onNext,
  onPrev,
  isPlayingAudio = false,
  onToggleAudio = null,
}) {
  const mountRef = useRef(null);

  // Exploration Mode: 'amino' | 'collagen' | 'minerals'
  const [activeMode, setActiveMode] = useState('collagen');

  // Deposition state: false = dispersed, true = deposited/mineralized
  const [isDeposited, setIsDeposited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);

  // Check URL params for mode and initial deposition state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const m = params.get('mode');
      if (m && ['amino', 'collagen', 'minerals'].includes(m)) {
        setActiveMode(m);
      }
      if (params.get('deposit') === '1') {
        setIsDeposited(true);
        setHasCompletedOnce(true);
      }
    }
  }, []);

  // References for Three.js objects
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const helixGroupRef = useRef(null);
  const mineralsGroupRef = useRef(null);
  const aminoGroupRef = useRef(null);
  const crosslinksGroupRef = useRef(null);
  const pointLightRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  // Crystals data reference
  const crystalsDataRef = useRef([]);
  const freeAminosDataRef = useRef([]);

  // Materials map for dynamic lighting/mode highlights
  const materialsRef = useRef({
    strand0: null,
    strand1: null,
    strand2: null,
    crosslinks: null,
    boundAminos: null,
    freeAminos: null,
    calciumCrystals: [],
    phosphateCrystals: [],
  });

  // Local speech synthesis fallback if parent toggle not provided
  const [localAudioPlaying, setLocalAudioPlaying] = useState(false);
  const handleAudio = () => {
    if (onToggleAudio) {
      onToggleAudio();
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (localAudioPlaying) {
        window.speechSynthesis.cancel();
        setLocalAudioPlaying(false);
      } else {
        const text =
          'Without a complete amino acid framework to lock calcium into place... your internal structure accelerates its breakdown. As you feel how important your frame really is... ask yourself: How strong and upright do you want to feel a decade from now?';
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.92;
        utt.onend = () => setLocalAudioPlaying(false);
        utt.onerror = () => setLocalAudioPlaying(false);
        window.speechSynthesis.speak(utt);
        setLocalAudioPlaying(true);
      }
    }
  };

  const audioActive = onToggleAudio ? isPlayingAudio : localAudioPlaying;

  // Initialize 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 7.2);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4.0;
    controls.maxDistance = 11.0;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7; // gentle drift
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f2, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff2e6, 2.6);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe9d5ff, 2.0);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const frontLight = new THREE.PointLight(0xfbcfe8, 2.2, 18);
    frontLight.position.set(0, 1.5, 4.5);
    scene.add(frontLight);
    pointLightRef.current = frontLight;

    // Master Group with a slight natural anatomical diagonal tilt (~12 degrees)
    const masterGroup = new THREE.Group();
    masterGroup.rotation.z = -0.15;
    masterGroup.rotation.x = 0.08;
    scene.add(masterGroup);

    // ==========================================
    // 6. BUILD COLLAGEN TRIPLE HELIX
    // ==========================================
    const helixGroup = new THREE.Group();
    masterGroup.add(helixGroup);
    helixGroupRef.current = helixGroup;

    // Three intertwined strands
    const strandConfigs = [
      { color: 0xfb7185, emissive: 0x4c0519, label: 'Strand Alpha 1 (Coral)' },
      { color: 0xf472b6, emissive: 0x500724, label: 'Strand Alpha 2 (Pink)' },
      { color: 0xc084fc, emissive: 0x3b0764, label: 'Strand Alpha 1 (Lavender)' },
    ];

    const strandMaterials = strandConfigs.map((cfg, idx) => {
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.emissive,
        emissiveIntensity: 0.15,
        roughness: 0.32,
        metalness: 0.12,
      });
      materialsRef.current[`strand${idx}`] = mat;
      return mat;
    });

    const heightSpan = 6.4;
    const pointsPerStrand = 160;
    const turns = 3.2; // ~3.2 complete helical cycles
    const helixRadius = 0.68;

    const strandsPoints = [[], [], []];

    // Generate spline curve points for each of the three strands
    for (let s = 0; s < 3; s++) {
      const phaseOffset = (s * Math.PI * 2) / 3;
      const curvePoints = [];

      for (let i = 0; i <= pointsPerStrand; i++) {
        const t = i / pointsPerStrand;
        const y = (t - 0.5) * heightSpan;
        const angle = t * Math.PI * 2 * turns + phaseOffset;

        // Subtle biological breathing radius modulation
        const rMod = helixRadius + Math.sin(t * Math.PI * 6) * 0.03;
        const x = Math.cos(angle) * rMod;
        const z = Math.sin(angle) * rMod;

        const pt = new THREE.Vector3(x, y, z);
        curvePoints.push(pt);
        strandsPoints[s].push(pt);
      }

      const spline = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5);
      const tubeGeom = new THREE.TubeGeometry(spline, 140, 0.11, 16, false);
      const tubeMesh = new THREE.Mesh(tubeGeom, strandMaterials[s]);
      tubeMesh.castShadow = true;
      tubeMesh.receiveShadow = true;
      helixGroup.add(tubeMesh);
    }

    // ==========================================
    // 7. INTER-STRAND STRUCTURAL CROSSLINKS (HYDROGEN BONDS)
    // ==========================================
    const crosslinksGroup = new THREE.Group();
    helixGroup.add(crosslinksGroup);
    crosslinksGroupRef.current = crosslinksGroup;

    const crosslinkMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0x713f12,
      emissiveIntensity: 0.3,
      roughness: 0.25,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    materialsRef.current.crosslinks = crosslinkMat;

    // Periodically connect strand A to B, B to C, C to A
    const crosslinkPairs = [
      [0, 1],
      [1, 2],
      [2, 0],
    ];
    for (let i = 8; i < pointsPerStrand - 8; i += 7) {
      crosslinkPairs.forEach(([s1, s2]) => {
        const p1 = strandsPoints[s1][i];
        const p2 = strandsPoints[s2][i];
        if (!p1 || !p2) return;

        const distance = p1.distanceTo(p2);
        const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        const geom = new THREE.CylinderGeometry(0.022, 0.022, distance, 8);
        const mesh = new THREE.Mesh(geom, crosslinkMat);

        mesh.position.copy(midPoint);
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3().subVectors(p2, p1).normalize()
        );

        crosslinksGroup.add(mesh);
      });
    }

    // ==========================================
    // 8. AMINO ACID MOLECULAR NODES & FREE AMINOS
    // ==========================================
    const aminoGroup = new THREE.Group();
    helixGroup.add(aminoGroup);
    aminoGroupRef.current = aminoGroup;

    // A. Bound Amino Acid Nodes along strands (Glycine, Proline, Lysine)
    const boundAminoGeom = new THREE.SphereGeometry(0.08, 12, 12);
    const boundAminoMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
      roughness: 0.3,
      metalness: 0.1,
    });
    materialsRef.current.boundAminos = boundAminoMat;

    for (let s = 0; s < 3; s++) {
      for (let i = 4; i < pointsPerStrand; i += 6) {
        const pt = strandsPoints[s][i];
        const nodeMesh = new THREE.Mesh(boundAminoGeom, boundAminoMat);
        // Slightly offset along normal
        const normal = new THREE.Vector3(pt.x, 0, pt.z).normalize().multiplyScalar(0.08);
        nodeMesh.position.copy(pt).add(normal);
        aminoGroup.add(nodeMesh);
      }
    }

    // B. Free-floating Amino Acid Molecules that migrate inward in Amino Acids mode
    const freeAminosData = [];
    const freeAminoColors = [0xfef08a, 0xfecdd3, 0xe9d5ff, 0xa7f3d0];

    for (let a = 0; a < 24; a++) {
      const angle = (a / 24) * Math.PI * 2 + Math.random() * 0.4;
      const outerR = 2.4 + Math.random() * 1.5;
      const y = (Math.random() - 0.5) * 5.4;
      const x = Math.cos(angle) * outerR;
      const z = Math.sin(angle) * outerR;

      const cluster = new THREE.Group();
      // 2-3 spheres forming an amino acid residue monomer
      const subMat = new THREE.MeshStandardMaterial({
        color: freeAminoColors[a % freeAminoColors.length],
        emissive: 0x3f2005,
        emissiveIntensity: 0.25,
        roughness: 0.25,
        metalness: 0.15,
      });

      const sphereA = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), subMat);
      const sphereB = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), subMat);
      sphereB.position.set(0.08, 0.05, 0.02);
      cluster.add(sphereA);
      cluster.add(sphereB);

      cluster.position.set(x, y, z);
      masterGroup.add(cluster);

      const targetR = helixRadius + 0.15;
      const targetX = Math.cos(angle) * targetR;
      const targetZ = Math.sin(angle) * targetR;

      freeAminosData.push({
        cluster,
        initialPos: new THREE.Vector3(x, y, z),
        targetPos: new THREE.Vector3(targetX, y * 0.85, targetZ),
        speed: 0.008 + Math.random() * 0.01,
        angleOffset: Math.random() * Math.PI * 2,
      });
    }
    freeAminosDataRef.current = freeAminosData;

    // ==========================================
    // 9. CALCIUM-PHOSPHATE MINERAL CRYSTALS
    // ==========================================
    const mineralsGroup = new THREE.Group();
    masterGroup.add(mineralsGroup);
    mineralsGroupRef.current = mineralsGroup;

    // Crystal Geometries: Faceted crystalline shapes
    const octaGeom = new THREE.OctahedronGeometry(0.14, 0);
    const dodecaGeom = new THREE.DodecahedronGeometry(0.12, 0);
    const prismGeom = new THREE.CylinderGeometry(0.07, 0.1, 0.24, 6);

    // Calcium material (translucent ice-blue)
    const calciumMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc, // Ice blue
      emissive: 0x0c4a6e,
      emissiveIntensity: 0.35,
      roughness: 0.18,
      metalness: 0.45,
      transparent: true,
      opacity: 0.92,
    });

    // Phosphate material (soft lavender & orchid pink)
    const phosphateMat = new THREE.MeshStandardMaterial({
      color: 0xd8b4fe, // Lavender
      emissive: 0x4a044e,
      emissiveIntensity: 0.35,
      roughness: 0.18,
      metalness: 0.45,
      transparent: true,
      opacity: 0.92,
    });

    materialsRef.current.calciumMat = calciumMat;
    materialsRef.current.phosphateMat = phosphateMat;

    const totalCrystals = 60;
    const crystalsData = [];

    for (let c = 0; c < totalCrystals; c++) {
      const isCalcium = c % 2 === 0;
      const geomType = c % 3 === 0 ? octaGeom : c % 3 === 1 ? dodecaGeom : prismGeom;
      const mat = (isCalcium ? calciumMat : phosphateMat).clone();

      if (isCalcium) {
        materialsRef.current.calciumCrystals.push(mat);
      } else {
        materialsRef.current.phosphateCrystals.push(mat);
      }

      const crystal = new THREE.Mesh(geomType, mat);

      // Dispersed Coordinates: Floating in outer zone around collagen
      const dispersedAngle = (c / totalCrystals) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const dispersedR = 2.1 + Math.random() * 1.8;
      const dispersedY = (Math.random() - 0.5) * 5.8;
      const initialPos = new THREE.Vector3(
        Math.cos(dispersedAngle) * dispersedR,
        dispersedY,
        Math.sin(dispersedAngle) * dispersedR
      );

      // Deposited Target Coordinates: Interlocked tightly in the helical grooves of collagen
      const strandIdx = c % 3;
      const sampleIdx = Math.floor(
        ((c + 5) / (totalCrystals + 10)) * (pointsPerStrand - 20) + 10
      );
      const backbonePt = strandsPoints[strandIdx][sampleIdx] || new THREE.Vector3();

      // Positioned in the interstitial spaces / groove of the triple helix
      const grooveAngle = dispersedAngle + 0.3;
      const grooveR = helixRadius + 0.14 + (Math.random() - 0.5) * 0.08;
      const targetPos = new THREE.Vector3(
        Math.cos(grooveAngle) * grooveR,
        backbonePt.y + (Math.random() - 0.5) * 0.25,
        Math.sin(grooveAngle) * grooveR
      );

      crystal.position.copy(initialPos);
      crystal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mineralsGroup.add(crystal);

      crystalsData.push({
        mesh: crystal,
        initialPos,
        targetPos,
        currentPos: initialPos.clone(),
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.03,
          y: (Math.random() - 0.5) * 0.03,
          z: (Math.random() - 0.5) * 0.03,
        },
        driftPhase: Math.random() * Math.PI * 2,
        isCalcium,
      });
    }
    crystalsDataRef.current = crystalsData;

    // ==========================================
    // 10. ANIMATION TICKER
    // ==========================================
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth auto-rotation
      controls.update();

      // Gentle continuous rotation of helix
      if (helixGroupRef.current) {
        helixGroupRef.current.rotation.y += 0.0035;
      }

      // Gentle continuous rotation & drift of minerals
      if (mineralsGroupRef.current) {
        mineralsGroupRef.current.rotation.y += 0.002;
      }

      // Animate individual crystals floating gently when dispersed
      crystalsDataRef.current.forEach((cData, idx) => {
        cData.mesh.rotation.x += cData.rotSpeed.x;
        cData.mesh.rotation.y += cData.rotSpeed.y;

        // Subtle floating bobbing when dispersed
        if (!isDeposited && !isAnimating) {
          const bob = Math.sin(elapsedTime * 1.2 + cData.driftPhase) * 0.002;
          cData.mesh.position.y += bob;
        }
      });

      // Free amino acids floating
      freeAminosDataRef.current.forEach((aData, idx) => {
        aData.cluster.rotation.y += 0.01;
        aData.cluster.rotation.z += 0.005;
        const drift = Math.sin(elapsedTime * 1.5 + aData.angleOffset) * 0.003;
        aData.cluster.position.y += drift;
      });

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // 11. RESIZE HANDLER
    // ==========================================
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
      cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // =========================================================================
  // DYNAMIC EXPLORATION MODE EFFECTS
  // =========================================================================
  useEffect(() => {
    if (!helixGroupRef.current) return;

    // A. AMINO ACIDS MODE
    if (activeMode === 'amino') {
      // Glow bound amino acid spheres
      if (materialsRef.current.boundAminos) {
        gsap.to(materialsRef.current.boundAminos.color, { r: 1.0, g: 0.95, b: 0.4, duration: 0.5 });
        gsap.to(materialsRef.current.boundAminos, { emissiveIntensity: 0.7, duration: 0.5 });
      }

      // Animate free-floating amino acids towards the helix
      freeAminosDataRef.current.forEach((aData, idx) => {
        gsap.to(aData.cluster.position, {
          x: aData.targetPos.x,
          y: aData.targetPos.y,
          z: aData.targetPos.z,
          duration: 1.4,
          delay: idx * 0.03,
          ease: 'power2.out',
        });
        gsap.to(aData.cluster.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.6 });
      });

      // Dim minerals slightly to focus on protein building blocks
      crystalsDataRef.current.forEach((c) => {
        gsap.to(c.mesh.material, { opacity: 0.4, duration: 0.5 });
      });
    }

    // B. COLLAGEN HELIX MODE
    else if (activeMode === 'collagen') {
      // Restore amino acids
      if (materialsRef.current.boundAminos) {
        gsap.to(materialsRef.current.boundAminos.color, { r: 0.99, g: 0.95, b: 0.78, duration: 0.5 });
        gsap.to(materialsRef.current.boundAminos, { emissiveIntensity: 0.25, duration: 0.5 });
      }

      freeAminosDataRef.current.forEach((aData, idx) => {
        gsap.to(aData.cluster.position, {
          x: aData.initialPos.x,
          y: aData.initialPos.y,
          z: aData.initialPos.z,
          duration: 1.2,
          ease: 'power2.inOut',
        });
        gsap.to(aData.cluster.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.5 });
      });

      // Highlight the 3 intertwined strands with a luxurious luminous sheen
      ['strand0', 'strand1', 'strand2'].forEach((key, idx) => {
        const mat = materialsRef.current[key];
        if (mat) {
          gsap.to(mat, { emissiveIntensity: 0.45, duration: 0.6 });
        }
      });

      // Soft crystal visibility
      crystalsDataRef.current.forEach((c) => {
        gsap.to(c.mesh.material, { opacity: 0.85, duration: 0.5 });
      });
    }

    // C. CALCIUM-PHOSPHATE MODE
    else if (activeMode === 'minerals') {
      // Restore strands to standard emissive
      ['strand0', 'strand1', 'strand2'].forEach((key) => {
        const mat = materialsRef.current[key];
        if (mat) gsap.to(mat, { emissiveIntensity: 0.15, duration: 0.5 });
      });

      // Highlight crystals in soft glowing blue and lavender
      materialsRef.current.calciumCrystals.forEach((mat) => {
        gsap.to(mat.color, { r: 0.38, g: 0.82, b: 1.0, duration: 0.5 });
        gsap.to(mat, { emissiveIntensity: 0.85, opacity: 1.0, duration: 0.5 });
      });

      materialsRef.current.phosphateCrystals.forEach((mat) => {
        gsap.to(mat.color, { r: 0.88, g: 0.65, b: 1.0, duration: 0.5 });
        gsap.to(mat, { emissiveIntensity: 0.85, opacity: 1.0, duration: 0.5 });
      });

      // Animate crystals subtly closer to emphasize mineral attraction
      if (!isDeposited) {
        crystalsDataRef.current.forEach((cData, idx) => {
          const midPos = new THREE.Vector3().lerpVectors(cData.initialPos, cData.targetPos, 0.45);
          gsap.to(cData.mesh.position, {
            x: midPos.x,
            y: midPos.y,
            z: midPos.z,
            duration: 1.2,
            delay: idx * 0.015,
            ease: 'power2.out',
          });
        });
      }
    }
  }, [activeMode, isDeposited]);

  // =========================================================================
  // SIGNATURE INTERACTION: ANIMATE MINERAL DEPOSITION
  // =========================================================================
  const handleTriggerDeposition = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const crystals = crystalsDataRef.current;
    const targetState = !isDeposited;

    crystals.forEach((cData, idx) => {
      const dest = targetState ? cData.targetPos : cData.initialPos;

      gsap.to(cData.mesh.position, {
        x: dest.x,
        y: dest.y,
        z: dest.z,
        duration: 1.5,
        delay: idx * 0.018,
        ease: targetState ? 'back.out(1.2)' : 'power3.inOut',
        onComplete: () => {
          if (idx === crystals.length - 1) {
            setIsDeposited(targetState);
            setIsAnimating(false);
            if (targetState) setHasCompletedOnce(true);
          }
        },
      });

      // When mineralized: illuminate with radiant hydroxyapatite luster
      if (targetState) {
        gsap.to(cData.mesh.material, {
          emissiveIntensity: 0.75,
          roughness: 0.12,
          metalness: 0.5,
          duration: 1.4,
          delay: idx * 0.018,
        });
      } else {
        gsap.to(cData.mesh.material, {
          emissiveIntensity: 0.35,
          roughness: 0.18,
          metalness: 0.45,
          duration: 1.0,
        });
      }
    });

    // Also illuminate the point light in the scene for a crowning glow
    if (pointLightRef.current) {
      gsap.to(pointLightRef.current, {
        intensity: targetState ? 3.6 : 2.2,
        duration: 1.5,
      });
    }
  };

  // Reset to initial state
  const handleReset = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveMode('collagen');

    const crystals = crystalsDataRef.current;
    crystals.forEach((cData, idx) => {
      gsap.to(cData.mesh.position, {
        x: cData.initialPos.x,
        y: cData.initialPos.y,
        z: cData.initialPos.z,
        duration: 1.1,
        delay: idx * 0.01,
        ease: 'power2.out',
        onComplete: () => {
          if (idx === crystals.length - 1) {
            setIsDeposited(false);
            setIsAnimating(false);
          }
        },
      });
      gsap.to(cData.mesh.material, {
        emissiveIntensity: 0.35,
        roughness: 0.18,
        metalness: 0.45,
        duration: 0.8,
      });
    });

    if (pointLightRef.current) {
      gsap.to(pointLightRef.current, { intensity: 2.2, duration: 1.0 });
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto my-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center z-10 py-1 overflow-visible">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Section Heading, Narration & Interactive Modes */}
      {/* ========================================================= */}
      <div className="lg:col-span-4 flex flex-col justify-center space-y-3.5 z-20">
        {/* Editorial Heading */}
        <div>
          <h2
            className="text-3xl sm:text-4xl lg:text-[42px] font-light text-[#2A0E3D] tracking-tight leading-[1.05]"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            The Mineral<br />
            <span
              style={{
                background: 'linear-gradient(180deg, #371B48 0%, #8A2855 55%, #CF4842 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                fontWeight: 400,
              }}
            >
              Matrix
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#371B48] font-light mt-1">
            (The Collagen &amp; Calcium-Phosphate Scaffold)
          </p>
        </div>

        {/* Story Narration Block */}
        <div className="border-l-2 border-[#CF4842] pl-3 py-1 space-y-1.5">
          <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed font-light">
            “Without a complete amino acid framework to lock calcium into place… your internal structure accelerates its breakdown.”
          </p>
          <p className="text-[11px] sm:text-xs text-stone-500 italic font-light">
            As you feel how important your frame really is… ask yourself: How strong and upright do you want to feel a decade from now?
          </p>
        </div>

        {/* Listen Control */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={handleAudio}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-mono font-semibold text-[#14091F] border border-stone-200 shadow-2xs cursor-pointer transition-all active:scale-95"
            title={audioActive ? 'Pause Narration' : 'Listen to Narration'}
          >
            {audioActive ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>PAUSE NARRATION</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-stone-600" />
                <span>HEAR THE STORY</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Interactive Exploration Modes (Selectable Controls) */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-mono tracking-widest text-stone-400 font-semibold uppercase block">
            EXPLORATION MODES
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100/80 rounded-2xl border border-stone-200/60">
            <button
              type="button"
              onClick={() => setActiveMode('amino')}
              className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activeMode === 'amino'
                  ? 'bg-white text-[#B45309] shadow-xs font-bold scale-[1.02]'
                  : 'text-stone-600 hover:text-[#14091F]'
              }`}
            >
              <Dna className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] leading-tight">Amino Acids</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('collagen')}
              className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activeMode === 'collagen'
                  ? 'bg-white text-[#BE185D] shadow-xs font-bold scale-[1.02]'
                  : 'text-stone-600 hover:text-[#14091F]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-pink-500" />
              <span className="text-[11px] leading-tight">Collagen Helix</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('minerals')}
              className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activeMode === 'minerals'
                  ? 'bg-white text-[#0369A1] shadow-xs font-bold scale-[1.02]'
                  : 'text-stone-600 hover:text-[#14091F]'
              }`}
            >
              <Gem className="w-3.5 h-3.5 text-sky-500" />
              <span className="text-[11px] leading-tight">Calcium-Phosphate</span>
            </button>
          </div>
        </div>

        {/* Dynamic Mode Explanation Card (Exactly ONE explanation panel displayed at a time) */}
        <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-stone-200/70 shadow-2xs transition-all duration-300">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-50 text-[#8A2855] shrink-0 mt-0.5">
              {activeMode === 'amino' && <Dna className="w-4 h-4 text-amber-600" />}
              {activeMode === 'collagen' && <Activity className="w-4 h-4 text-pink-600" />}
              {activeMode === 'minerals' && <Gem className="w-4 h-4 text-sky-600" />}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-stone-400 block">
                {activeMode === 'amino' && 'Mode A · Molecular Assembly'}
                {activeMode === 'collagen' && 'Mode B · Structural Tensile Framework'}
                {activeMode === 'minerals' && 'Mode C · Mineral Integration'}
              </span>
              <p className="text-xs sm:text-[13px] text-[#2A0E3D] font-medium mt-0.5 leading-snug">
                {activeMode === 'amino' && '“Amino acids are the building blocks of proteins.”'}
                {activeMode === 'collagen' && '“Collagen provides the flexible protein framework of bone.”'}
                {activeMode === 'minerals' && '“Calcium-phosphate minerals contribute to the hardness and strength of bone.”'}
              </p>
            </div>
          </div>
        </div>

        {/* Signature Interaction Controls: Animate Mineral Deposition Button & Reset */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isAnimating}
              onClick={handleTriggerDeposition}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-[13px] font-semibold tracking-wider transition-all duration-300 shadow-sm cursor-pointer ${
                isDeposited
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-105'
                  : 'bg-gradient-to-r from-[#371B48] via-[#8A2855] to-[#CF4842] text-white hover:opacity-95 hover:shadow-md active:scale-98'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>
                {isDeposited ? 'REPLAY MINERAL DEPOSITION' : 'ANIMATE MINERAL DEPOSITION'}
              </span>
            </button>

            {isDeposited && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset to dispersed state"
                aria-label="Reset mineralization"
                className="w-11 h-11 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Resulting Mineralized State Banner / Label */}
          {isDeposited && (
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/70 shadow-2xs animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-900">
                  COLLAGEN + CALCIUM-PHOSPHATE
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
                LOCKED MATRIX ✓
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* CENTER COLUMN: Large Interactive 3D Collagen Triple Helix */}
      {/* ========================================================= */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full h-[460px] sm:h-[500px] lg:h-[550px] xl:h-[590px] max-h-[74vh]">
        {/* Dreamy Pastel Glow Behind the 3D Helix */}
        <div
          className="absolute inset-0 pointer-events-none z-0 rounded-full blur-[65px] transition-all duration-700 opacity-80"
          style={{
            background: isDeposited
              ? 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.22) 0%, rgba(244,114,182,0.22) 35%, rgba(192,132,252,0.18) 60%, transparent 75%)'
              : 'radial-gradient(circle at 50% 50%, rgba(244,114,182,0.22) 0%, rgba(251,113,133,0.18) 35%, rgba(192,132,252,0.15) 60%, transparent 75%)',
          }}
        />

        {/* 3D WebGL Canvas Container */}
        <div
          ref={mountRef}
          className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing select-none"
        />

        {/* Floating Callout 1: Top Collagen Helix Label */}
        <div className="absolute top-2 left-4 z-20 pointer-events-none flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 ring-4 ring-pink-100 animate-pulse" />
          <div className="px-2.5 py-1 rounded-xl bg-white/85 backdrop-blur-md border border-pink-200/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold text-[#8A2855] block">
              Collagen Triple Helix
            </span>
            <span className="text-[9px] text-stone-500 font-sans block">
              Flexible Protein Framework (35%)
            </span>
          </div>
        </div>

        {/* Floating Callout 2: Bottom Calcium-Phosphate Label */}
        <div className="absolute bottom-3 right-4 z-20 pointer-events-none flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-xl bg-white/85 backdrop-blur-md border border-sky-200/80 shadow-2xs text-right">
            <span className="text-[10px] font-mono font-bold text-sky-800 block">
              Calcium-Phosphate Crystals
            </span>
            <span className="text-[9px] text-stone-500 font-sans block">
              Hydroxyapatite Armor (65%)
            </span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 ring-4 ring-sky-100 animate-pulse" />
        </div>

        {/* Drag to Rotate Hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span className="text-[10px] font-mono text-stone-400 bg-white/70 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-stone-200/50">
            Drag to rotate • Scroll to zoom
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Minimal Information Panel */}
      {/* ========================================================= */}
      <div className="lg:col-span-3 flex flex-col justify-center space-y-3.5 z-20">
        <div className="p-5 rounded-3xl bg-white/75 backdrop-blur-md border border-stone-200/70 shadow-xs space-y-3.5">
          {/* Header */}
          <div className="border-b border-stone-200/60 pb-3">
            <span className="text-[10px] font-mono tracking-widest text-[#8A2855] font-bold uppercase block mb-1">
              THE MINERAL MATRIX
            </span>
            <h3 className="text-base sm:text-lg font-light text-[#14091F] tracking-tight leading-snug">
              The Collagen &amp; Calcium-Phosphate Scaffold
            </h3>
          </div>

          {/* Core Scientific Principle Quote */}
          <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-stone-200/70 space-y-1">
            <p className="text-[11px] text-stone-700 leading-relaxed font-light italic">
              “Without a complete amino acid framework to lock calcium into place… your internal structure accelerates its breakdown.”
            </p>
          </div>

          {/* Structural Synergy Breakdown */}
          <div className="space-y-2 pt-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-600 font-medium">Protein Framework (Collagen)</span>
              <span className="font-mono font-bold text-pink-700">35%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full w-[35%]" />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-stone-600 font-medium">Mineral Crystals (Calcium-P)</span>
              <span className="font-mono font-bold text-sky-700">65%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full w-[65%]" />
            </div>
          </div>

          {/* Biological Mechanic Insight */}
          <div className="pt-1 text-[11px] text-stone-500 font-light leading-relaxed">
            {isDeposited ? (
              <span className="text-emerald-700 font-medium">
                ✓ Minerals locked into collagen grooves — high compressive load resistance achieved.
              </span>
            ) : (
              <span>
                Unanchored calcium washes away without structural amino acids acting as biological rebar.
              </span>
            )}
          </div>
        </div>

        {/* Step Forward Navigation */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onNext}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#14091F] hover:bg-[#251535] text-white text-xs font-semibold tracking-wider transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <span>Next: Bone Remodeling</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
