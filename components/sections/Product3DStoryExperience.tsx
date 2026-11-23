'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface ChapterDef {
  id: string;
  num: string;
  navTitle: string;
  tagline?: string;
  heading: string;
  highlightWord?: string;
  body: string | string[];
  techTags?: string[];
  align: 'left' | 'right' | 'center';
  target3D: {
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    rz: number;
    scale: number;
  };
}

const CHAPTERS: ChapterDef[] = [
  {
    id: 'chapter-01',
    num: '01',
    navTitle: 'The Problem',
    tagline: 'The Breakthrough Solution',
    heading: 'Meet GoProteen.',
    highlightWord: 'GoProteen.',
    body: 'A revolution in daily cellular nutrition. The original fermented protein bar designed to end the silent protein deficit.',
    align: 'left',
    target3D: {
      x: 0.72,
      y: 0.0,
      z: 0.25,
      rx: 0.08,
      ry: 0.15,
      rz: -0.05,
      scale: 1.15,
    },
  },
  {
    id: 'chapter-02',
    num: '02',
    navTitle: 'Traditional Distress',
    tagline: 'The Problem With Traditional Protein',
    heading: 'Heavy gastric bloat. Gas. Slump.',
    highlightWord: 'bloat.',
    body: [
      'Traditional whey or raw plant powders often trigger heavy gastric bloat...',
      'gas... and uncomfortable stomach distress.',
      'Leaving your physical frame sluggish instead of restored.',
    ],
    align: 'left',
    target3D: {
      x: 0.78,
      y: -0.22,
      z: 0.15,
      rx: -0.22,
      ry: 0.35,
      rz: -0.15,
      scale: 1.05,
    },
  },
  {
    id: 'chapter-03',
    num: '03',
    navTitle: 'The Breakthrough',
    tagline: 'The Cellular Shift',
    heading: 'Fermented yeast protein changes everything.',
    highlightWord: 'everything.',
    body: 'Imagine a pure molecular source where micro-fermentation unlocks bio-absorption instantly. Meet GoProteen — clinically refined and exceptionally clean.',
    align: 'left',
    target3D: {
      x: 0.72,
      y: 0.28,
      z: 0.35,
      rx: 0.26,
      ry: -0.32,
      rz: 0.18,
      scale: 1.18,
    },
  },
  {
    id: 'chapter-04',
    num: '04',
    navTitle: 'Fermented Yeast Protein',
    tagline: 'Powered By Clinical Science',
    heading: '100% bio-available. Zero dairy.',
    highlightWord: 'bio-available.',
    body: 'Powered by clinically studied Fermented Yeast Protein. Zero lactose, zero stomach discomfort, and complete digestive ease from the very first bite.',
    align: 'right',
    target3D: {
      x: -0.72,
      y: 0.06,
      z: 0.65,
      rx: 0.06,
      ry: 0.22,
      rz: 0.04,
      scale: 1.25,
    },
  },
  {
    id: 'chapter-05',
    num: '05',
    navTitle: 'Complete Protein',
    tagline: 'The Protein Advantage',
    heading: 'Complete essential amino acids.',
    highlightWord: 'amino acids.',
    body: 'Delivering every essential amino acid with concentrated leucine density to trigger immediate cellular muscle protein synthesis.',
    techTags: ['COMPLETE ESSENTIAL AMINO ACIDS', 'HIGH LEUCINE DENSITY', '10G FERMENTED YEAST PROTEIN'],
    align: 'right',
    target3D: {
      x: -0.78,
      y: 0.22,
      z: 0.45,
      rx: -0.25,
      ry: 0.38,
      rz: -0.18,
      scale: 1.15,
    },
  },
  {
    id: 'chapter-06',
    num: '06',
    navTitle: 'The Experience',
    tagline: 'Weightless Nutrition',
    heading: 'Flip your muscle engine back on.',
    highlightWord: 'muscle engine',
    body: 'Sitting completely weightless on your stomach, delivering sustained cellular fuel for vibrant focus, active posture, and zero afternoon crash.',
    align: 'left',
    target3D: {
      x: 0.72,
      y: 0.02,
      z: 0.52,
      rx: 0.18,
      ry: -0.25,
      rz: 0.08,
      scale: 1.2,
    },
  },
  {
    id: 'chapter-07',
    num: '07',
    navTitle: 'Everyday Benefits',
    tagline: 'Clinical Body Outcomes',
    heading: 'Feel the transformation.',
    highlightWord: 'transformation.',
    body: 'Five everyday benefits that compound over time as your body absorbs complete fermented repair fuel.',
    align: 'center',
    target3D: {
      x: 0.0,
      y: 0.46,
      z: 0.35,
      rx: 0.12,
      ry: 0.08,
      rz: 0.02,
      scale: 1.08,
    },
  },
  {
    id: 'chapter-final',
    num: '08',
    navTitle: 'Meet GoProteen',
    tagline: 'Pure Cellular Fuel',
    heading: 'Your daily foundation for strength.',
    highlightWord: 'strength.',
    body: '10 grams of clean fermented yeast protein in a decadent, whole-nut crunch bar with zero added sugar.',
    align: 'center',
    target3D: {
      x: 0.0,
      y: -0.06,
      z: 0.65,
      rx: 0.02,
      ry: 0.0,
      rz: 0.0,
      scale: 1.35,
    },
  },
];

const BENEFITS = [
  { id: 1, title: 'Vibrant Workdays', text: 'Finish your workday feeling vibrant, active, and fully alive.*' },
  { id: 2, title: 'Effortless Movement', text: 'Make lifting, walking, and climbing stairs smooth and easy again.*' },
  { id: 3, title: 'Muscle Tone', text: 'Wake up aging muscle cells and see real, firm definition return.*' },
  { id: 4, title: 'Laser-Stable Energy', text: 'Keep your energy laser-stable all afternoon long without the crash.*' },
  { id: 5, title: 'Sturdy Upright Frame', text: 'Stand tall, steady, and sturdy as you gracefully age.*' },
];

export default function Product3DStoryExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [userInteracting, setUserInteracting] = useState(false);

  // References for Three.js state
  const stateRef = useRef({
    currentScrollProgress: 0,
    target3D: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, scale: 1 },
    current3D: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, scale: 1 },
    dragDelta: { x: 0, y: 0 },
    userExtraRot: { x: 0, y: 0 },
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    barGroup: null as THREE.Group | null,
    wrapperMesh: null as THREE.Mesh | null,
    innerBarMesh: null as THREE.Object3D | null,
    crunchTrigger: null as (() => void) | null,
  });

  // Scroll Progress Calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (containerHeight <= 0) return;

      const progress = Math.min(Math.max(-rect.top / containerHeight, 0), 1);
      stateRef.current.currentScrollProgress = progress;

      // Determine active chapter index based on progress
      const totalChapters = CHAPTERS.length;
      const rawIndex = progress * (totalChapters - 1);
      const activeIdx = Math.min(Math.round(rawIndex), totalChapters - 1);
      setActiveChapterIndex(activeIdx);

      // Interpolate target 3D transform between chapters
      const baseIdx = Math.min(Math.floor(rawIndex), totalChapters - 2);
      const frac = rawIndex - baseIdx;
      const c1 = CHAPTERS[baseIdx].target3D;
      const c2 = CHAPTERS[baseIdx + 1].target3D;

      stateRef.current.target3D = {
        x: c1.x + (c2.x - c1.x) * frac,
        y: c1.y + (c2.y - c1.y) * frac,
        z: c1.z + (c2.z - c1.z) * frac,
        rx: c1.rx + (c2.rx - c1.rx) * frac,
        ry: c1.ry + (c2.ry - c1.ry) * frac,
        rz: c1.rz + (c2.rz - c1.rz) * frac,
        scale: c1.scale + (c2.scale - c1.scale) * frac,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Three.js Scene Setup & Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Scene & Environment
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Camera
    const camera = new THREE.PerspectiveCamera(34, canvas.clientWidth / canvas.clientHeight, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    // Root Bar Group
    const bar = new THREE.Group();
    bar.rotation.order = 'YXZ';
    scene.add(bar);
    stateRef.current.barGroup = bar;

    // Lighting (Studio Product Commercial Lights)
    scene.add(new THREE.AmbientLight(0xffffff, 1.3));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x4a1d75, 1.1));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(2, 3, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfff5ea, 1.9);
    fillLight.position.set(-2.5, 1.2, 4);
    scene.add(fillLight);

    const underGlow = new THREE.PointLight(0xff8a2b, 2.2, 10);
    underGlow.position.set(0, -2, 2);
    scene.add(underGlow);

    const violetRim = new THREE.PointLight(0x8b5cf6, 2.5, 10);
    violetRim.position.set(-2.5, 1.5, -1.5);
    scene.add(violetRim);

    // Chocolate Texture for Procedural Core
    const nCanvas = document.createElement('canvas');
    nCanvas.width = nCanvas.height = 128;
    const nctx = nCanvas.getContext('2d');
    if (nctx) {
      nctx.fillStyle = '#808080';
      nctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 800; i++) {
        const v = (90 + Math.random() * 110) | 0;
        nctx.fillStyle = `rgb(${v},${v},${v})`;
        nctx.beginPath();
        nctx.arc(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 3, 0, 7);
        nctx.fill();
      }
    }
    const bumpMap = new THREE.CanvasTexture(nCanvas);
    bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
    bumpMap.repeat.set(3, 1);

    // Procedural Fallback Mesh (shown while GLB loads)
    const procGroup = new THREE.Group();
    const chocMat = new THREE.MeshStandardMaterial({
      color: 0x3b1d12,
      roughness: 0.38,
      metalness: 0.05,
      bumpMap,
      bumpScale: 1.5,
    });
    const procCore = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.28, 0.6), chocMat);
    procGroup.add(procCore);

    // Procedural Wrapper
    const wCanvas = document.createElement('canvas');
    wCanvas.width = 512;
    wCanvas.height = 186;
    const wctx = wCanvas.getContext('2d');
    if (wctx) {
      wctx.fillStyle = '#5B21B6';
      wctx.fillRect(0, 0, 512, 186);
      const gr = wctx.createLinearGradient(0, 0, 0, 186);
      gr.addColorStop(0, 'rgba(255,255,255,.22)');
      gr.addColorStop(1, 'rgba(0,0,0,.28)');
      wctx.fillStyle = gr;
      wctx.fillRect(0, 0, 512, 186);
      wctx.fillStyle = '#fff';
      wctx.font = '800 60px -apple-system, sans-serif';
      wctx.textAlign = 'center';
      wctx.textBaseline = 'middle';
      wctx.fillText('GoProteen', 256, 93);
    }
    const wrapTex = new THREE.CanvasTexture(wCanvas);
    const wrapFoilMat = new THREE.MeshStandardMaterial({
      color: 0x5b21b6,
      metalness: 0.72,
      roughness: 0.28,
    });
    const wrapFrontMat = new THREE.MeshStandardMaterial({
      map: wrapTex,
      metalness: 0.6,
      roughness: 0.3,
    });
    const procWrap = new THREE.Mesh(
      new THREE.BoxGeometry(1.95, 0.34, 0.7),
      [wrapFoilMat, wrapFoilMat, wrapFrontMat, wrapFrontMat, wrapFoilMat, wrapFoilMat]
    );
    procGroup.add(procWrap);
    bar.add(procGroup);

    // Particle Burst System for Interactive Crunch
    const PARTICLE_COUNT = 70;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(PARTICLE_COUNT * 3);
    const partVel = new Float32Array(PARTICLE_COUNT * 3);
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x8a5a3a,
      size: 0.08,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    let particleLife = 0;
    const triggerCrunch = () => {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        partPos[i * 3] = bar.position.x;
        partPos[i * 3 + 1] = bar.position.y;
        partPos[i * 3 + 2] = bar.position.z;
        partVel[i * 3] = (Math.random() - 0.5) * 0.12;
        partVel[i * 3 + 1] = Math.random() * 0.1;
        partVel[i * 3 + 2] = (Math.random() - 0.2) * 0.12;
      }
      particleLife = 1;
    };
    stateRef.current.crunchTrigger = triggerCrunch;

    // Load Photorealistic GLB Model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/GoProTeen_model.glb',
      (gltf) => {
        const model = gltf.scene;
        const scaleFactor = 17.0;

        const foundWrapper = (model.getObjectByName('GoProTeen_Main_Wrapper') as THREE.Mesh) || null;
        const foundInner = model.getObjectByName('GP_EXPLODE_CONTROLLER') || null;

        if (foundWrapper) {
          foundWrapper.scale.setScalar(scaleFactor);
          if (foundWrapper.material) {
            const mat = (foundWrapper.material as THREE.MeshStandardMaterial).clone();
            mat.roughness = 0.26;
            mat.metalness = 0.04;
            mat.envMapIntensity = 1.25;
            mat.needsUpdate = true;
            foundWrapper.material = mat;
          }
          bar.add(foundWrapper);
          stateRef.current.wrapperMesh = foundWrapper;
        }

        if (foundInner) {
          foundInner.scale.multiplyScalar(scaleFactor);
          foundInner.position.multiplyScalar(scaleFactor);
          foundInner.traverse((child: any) => {
            if (child.isMesh && child.material) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.material = (child.material as THREE.Material).clone();
            }
          });
          bar.add(foundInner);
          stateRef.current.innerBarMesh = foundInner;
        }

        // Hide procedural fallback
        procGroup.visible = false;
        setIsModelLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('Using procedural bar model fallback:', err);
        setIsModelLoaded(true);
      }
    );

    // Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Render Animation Loop
    let reqId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Lerp Current Position to Target
      const cur = stateRef.current.current3D;
      const tgt = stateRef.current.target3D;
      const lerpSpeed = 0.075;

      cur.x += (tgt.x - cur.x) * lerpSpeed;
      cur.y += (tgt.y - cur.y) * lerpSpeed;
      cur.z += (tgt.z - cur.z) * lerpSpeed;
      cur.rx += (tgt.rx - cur.rx) * lerpSpeed;
      cur.ry += (tgt.ry - cur.ry) * lerpSpeed;
      cur.rz += (tgt.rz - cur.rz) * lerpSpeed;
      cur.scale += (tgt.scale - cur.scale) * lerpSpeed;

      // User Drag Decay
      stateRef.current.userExtraRot.x *= 0.92;
      stateRef.current.userExtraRot.y *= 0.92;

      // Idle Floating Animation
      const idleFloatY = Math.sin(elapsedTime * 1.5) * 0.035;
      const idleRotY = Math.sin(elapsedTime * 0.8) * 0.04;

      // Apply to Bar Group
      bar.position.set(cur.x, cur.y + idleFloatY, cur.z);
      bar.rotation.set(
        cur.rx + stateRef.current.userExtraRot.x,
        cur.ry + idleRotY + stateRef.current.userExtraRot.y,
        cur.rz
      );
      bar.scale.setScalar(cur.scale);

      // Particle physics
      if (particleLife > 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          partVel[i * 3 + 1] -= 0.003;
          partPos[i * 3] += partVel[i * 3];
          partPos[i * 3 + 1] += partVel[i * 3 + 1];
          partPos[i * 3 + 2] += partVel[i * 3 + 2];
        }
        particleLife -= 0.016;
        partMat.opacity = Math.max(0, particleLife);
        partGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Pointer Interaction (Drag to Spin & Click to Crunch)
  const handlePointerDown = (e: React.PointerEvent) => {
    stateRef.current.isDragging = true;
    stateRef.current.lastPointerX = e.clientX;
    stateRef.current.lastPointerY = e.clientY;
    setUserInteracting(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!stateRef.current.isDragging) return;
    const dx = e.clientX - stateRef.current.lastPointerX;
    const dy = e.clientY - stateRef.current.lastPointerY;
    stateRef.current.lastPointerX = e.clientX;
    stateRef.current.lastPointerY = e.clientY;

    stateRef.current.userExtraRot.y += dx * 0.012;
    stateRef.current.userExtraRot.x += dy * 0.01;
  };

  const handlePointerUp = () => {
    stateRef.current.isDragging = false;
    setTimeout(() => setUserInteracting(false), 1500);
  };

  const handleClickBar = () => {
    if (stateRef.current.crunchTrigger) {
      stateRef.current.crunchTrigger();
    }
  };

  // Chapter Jump Helper
  const scrollToChapter = (index: number) => {
    if (!containerRef.current) return;
    const totalChapters = CHAPTERS.length;
    const targetRatio = index / (totalChapters - 1);
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerTop + targetRatio * containerHeight;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  // Text Narration Listen toggle
  const toggleListen = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const activeText = Array.isArray(CHAPTERS[activeChapterIndex].body)
        ? (CHAPTERS[activeChapterIndex].body as string[]).join(' ')
        : (CHAPTERS[activeChapterIndex].body as string);
      const utterance = new SpeechSynthesisUtterance(
        `${CHAPTERS[activeChapterIndex].heading}. ${activeText}`
      );
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        backgroundColor: '#FDFBF7',
        minHeight: '750vh', // Provides ample scroll room for smooth progressive choreographies
      }}
    >
      {/* Sticky Fullscreen 3D Stage & Active Story Overlay */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between select-none">
        {/* Soft Dreamy Studio Radial Glow behind Product */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-1000 ease-out"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(244, 114, 182, 0.16) 0%, rgba(216, 180, 254, 0.12) 40%, rgba(253, 251, 247, 0) 72%)',
            filter: 'blur(50px)',
            zIndex: 0,
          }}
        />

        {/* Top Minimal Bar: Standalone Listen Button & Chapter Counter */}
        <header className="relative z-30 w-full px-8 sm:px-14 py-8 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#8A7993] font-mono">
              GoProteen 3D
            </span>
            <span className="text-[#D8CFDC]">/</span>
            <span className="text-xs font-mono font-medium text-[#14091F]">
              {CHAPTERS[activeChapterIndex].num} — {CHAPTERS[activeChapterIndex].navTitle}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleListen}
            className="group flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#E5DFD7] bg-white/80 hover:bg-white hover:border-[#14091F] transition-all duration-300 text-xs font-mono uppercase tracking-wider text-[#14091F] shadow-sm backdrop-blur-sm cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isPlayingAudio ? 'bg-rose-500 animate-pulse' : 'bg-[#14091F]'
              }`}
            />
            <span>{isPlayingAudio ? 'Pause Narration' : 'Listen'}</span>
          </button>
        </header>

        {/* Central 3D Canvas Layer */}
        <div
          className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing flex items-center justify-center"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleClickBar}
          title="Drag to spin 3D bar · Click to crunch"
        >
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Alternating Editorial Story Layout Layer */}
        <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex items-center pointer-events-none">
          {CHAPTERS.map((chap, idx) => {
            const isActive = idx === activeChapterIndex;
            return (
              <div
                key={chap.id}
                className={`absolute inset-x-6 sm:inset-x-12 lg:inset-x-16 transition-all duration-700 ease-out flex ${
                  chap.align === 'left'
                    ? 'justify-start text-left'
                    : chap.align === 'right'
                    ? 'justify-end text-left sm:text-right'
                    : 'justify-center text-center'
                } ${
                  isActive
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-8 pointer-events-none'
                }`}
              >
                <div className="max-w-xl flex flex-col">
                  {/* Uppercase Small Technical Label */}
                  {chap.tagline && (
                    <span className="text-[11px] sm:text-[12px] font-mono tracking-widest uppercase text-[#8A7993] mb-3 select-none">
                      {chap.tagline}
                    </span>
                  )}

                  {/* Large Editorial Headline */}
                  <h2
                    className="text-[2.6rem] sm:text-[3.6rem] lg:text-[4.6rem] font-light tracking-tight leading-[1.05] text-[#14091F] mb-6 select-none"
                    style={{
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {chap.heading.split(chap.highlightWord || '').map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#E11D48]">
                            {chap.highlightWord}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </h2>

                  {/* Comfortable Editorial Body Paragraphs */}
                  {Array.isArray(chap.body) ? (
                    <div className="space-y-3 mb-6">
                      {chap.body.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[#5D5066] text-base sm:text-[17px] leading-[1.6] max-w-lg font-normal"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#5D5066] text-base sm:text-[17px] leading-[1.6] max-w-lg mb-6 font-normal">
                      {chap.body}
                    </p>
                  )}

                  {/* Technical Tags (Chapter 05) */}
                  {chap.techTags && (
                    <div className="flex flex-wrap gap-2.5 mt-2 mb-4 justify-start sm:justify-end">
                      {chap.techTags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white/90 border border-[#E5DFD7] text-[#14091F] shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Interactive Benefits Carousel (Chapter 07) */}
                  {chap.id === 'chapter-07' && (
                    <div className="w-full mt-4 flex flex-col items-center">
                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {BENEFITS.map((b, bIdx) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setActiveBenefit(bIdx)}
                            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300 cursor-pointer ${
                              activeBenefit === bIdx
                                ? 'bg-[#230E2E] text-white shadow-md'
                                : 'bg-white text-[#5D5066] border border-[#E5DFD7] hover:border-[#14091F]'
                            }`}
                          >
                            0{b.id} · {b.title}
                          </button>
                        ))}
                      </div>

                      <div className="p-6 rounded-2xl bg-white/80 border border-[#EBE5DE] backdrop-blur-sm max-w-lg shadow-sm transition-all duration-500">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-semibold block mb-1">
                          Verified Clinical Outcome
                        </span>
                        <p className="text-lg text-[#14091F] font-light leading-relaxed">
                          “{BENEFITS[activeBenefit].text}”
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Final Chapter CTA (Chapter 08) */}
                  {chap.id === 'chapter-final' && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 pointer-events-auto">
                      <a
                        href="#who"
                        className="px-8 py-3.5 rounded-full bg-[#230E2E] text-white font-medium text-sm tracking-wide shadow-lg shadow-[#230E2E]/20 hover:scale-[1.02] transition-transform duration-200"
                      >
                        Experience GoProteen
                      </a>
                      <a
                        href="#rep"
                        className="px-6 py-3.5 rounded-full bg-white text-[#2B1B36] border border-[#E5DFD7] hover:border-[#B5A89E] font-medium text-sm shadow-sm transition-all duration-200"
                      >
                        Explore Routine
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </main>

        {/* Minimal Bottom Chapter Navigation Dock */}
        <footer className="relative z-30 w-full px-6 sm:px-14 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
          {/* Chapter Links */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {CHAPTERS.slice(0, 6).map((c, idx) => {
              const isSelected = activeChapterIndex === idx;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => scrollToChapter(idx)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-mono transition-all duration-300 cursor-pointer select-none whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#230E2E] text-white font-medium shadow-sm'
                      : 'text-[#8A7993] hover:text-[#14091F] hover:bg-white/60'
                  }`}
                >
                  {c.num} — {c.navTitle}
                </button>
              );
            })}
          </div>

          {/* Interactive Hint */}
          <div className="flex items-center gap-3 text-xs font-mono text-[#8A7993]">
            <span>Scroll to choreograph</span>
            <span className="text-[#D8CFDC]">·</span>
            <span>Drag bar to inspect</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
