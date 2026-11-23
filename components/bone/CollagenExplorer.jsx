'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * CollagenExplorer - Section 03: Interactive Mineral Matrix
 * Pixel-perfect match to user's uploaded reference mockup:
 * - Left: "03 / 07" with dark underline, "The Mineral Matrix" (coral-magenta gradient),
 *         "The Collagen & Calcium-Phosphate Scaffold", quotation with red border, "HEAR THE STORY"
 * - Center: Diagonal 3D Collagen Triple Helix with micro-fibril texture in coral, pink, lavender,
 *           faceted ice-blue gem crystals nestled in grooves, soft depth fade, and exact leader lines
 * - Right: Curved gradient timeline arc with 3 pure-editorial exploration nodes (Amino Acids, Collagen Helix, Calcium-Phosphate)
 */
export default function CollagenExplorer({
  onNext,
  onPrev,
  isPlayingAudio = false,
  onToggleAudio = null,
}) {
  const mountRef = useRef(null);

  // Active Exploration Mode: 'amino' | 'collagen' | 'minerals'
  const [activeMode, setActiveMode] = useState('collagen');
  const [isDeposited, setIsDeposited] = useState(true);

  // Audio state
  const [localAudioPlaying, setLocalAudioPlaying] = useState(false);

  // Three.js References
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const masterGroupRef = useRef(null);
  const helixGroupRef = useRef(null);
  const crystalsGroupRef = useRef(null);
  const aminoGroupRef = useRef(null);
  const pointLightRef = useRef(null);
  const animFrameRef = useRef(null);

  const crystalsDataRef = useRef([]);
  const materialsRef = useRef({
    strands: [],
    crystals: [],
    aminoNodes: [],
  });

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
          'Without a complete amino acid framework to lock calcium into place... your internal structure accelerates its breakdown.';
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

  // =========================================================================
  // INITIALIZE THREE.JS SCENE
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 640;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with calibrated distance so the diagonal helix gracefully spans without clipping
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.8);
    cameraRef.current = camera;

    // 3. Renderer with high-end PBR tone mapping
    const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 800 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? 'default' : 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false; // Strictly disable zoom so scrolling the mouse wheel / trackpad scrolls the page normally
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45; // very gentle subtle drift
    controlsRef.current = controls;

    // 5. High-Key Bright Lighting matching reference photo
    const ambientLight = new THREE.AmbientLight(0xfff7f2, 2.5);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    mainKeyLight.position.set(6, 9, 8);
    scene.add(mainKeyLight);

    const backRimLight = new THREE.DirectionalLight(0xf3e8ff, 2.8);
    backRimLight.position.set(-6, -3, -6);
    scene.add(backRimLight);

    const frontSpecularLight = new THREE.PointLight(0xfce7f3, 2.6, 25);
    frontSpecularLight.position.set(0.5, 1.5, 5.5);
    scene.add(frontSpecularLight);
    pointLightRef.current = frontSpecularLight;

    // 6. Master Group with Exact -42° Diagonal Orientation matching reference mockup!
    const masterGroup = new THREE.Group();
    masterGroup.rotation.z = -0.73; // -42 degrees diagonal (bottom-left to top-right)
    masterGroup.rotation.x = 0.08;
    masterGroup.rotation.y = 0.14;
    masterGroup.position.set(0, 0, 0);
    scene.add(masterGroup);
    masterGroupRef.current = masterGroup;

    // =========================================================================
    // 7. BUILD COLLAGEN TRIPLE HELIX WITH FIBRILLAR ROPE TEXTURE
    // =========================================================================
    const helixGroup = new THREE.Group();
    masterGroup.add(helixGroup);
    helixGroupRef.current = helixGroup;

    // Color palette strictly matching the reference image:
    // Strand 1: Warm Coral / Salmon Pink (#FF5376)
    // Strand 2: Radiant Magenta / Rose Pink (#E02B78)
    // Strand 3: Rich Orchid Lavender / Purple (#A855F7)
    const strandConfigs = [
      { color: 0xff5376, emissive: 0x660822 },
      { color: 0xe02b78, emissive: 0x5a0328 },
      { color: 0xa855f7, emissive: 0x3b0764 },
    ];

    materialsRef.current.strands = [];
    const strandMaterials = strandConfigs.map((cfg) => {
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.emissive,
        emissiveIntensity: 0.22,
        roughness: 0.30,
        metalness: 0.08,
      });
      materialsRef.current.strands.push(mat);
      return mat;
    });

    const heightSpan = 8.2;
    const pointsPerStrand = 180;
    const turns = 3.6;
    const helixRadius = 0.68;

    const strandsPoints = [[], [], []];

    // Generate centerlines
    for (let s = 0; s < 3; s++) {
      const phaseOffset = (s * Math.PI * 2) / 3;
      const curvePoints = [];

      for (let i = 0; i <= pointsPerStrand; i++) {
        const t = i / pointsPerStrand;
        const y = (t - 0.5) * heightSpan;
        const angle = t * Math.PI * 2 * turns + phaseOffset;

        const x = Math.cos(angle) * helixRadius;
        const z = Math.sin(angle) * helixRadius;

        const pt = new THREE.Vector3(x, y, z);
        curvePoints.push(pt);
        strandsPoints[s].push(pt);
      }

      const mainSpline = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5);

      // Core smooth strand
      const mainGeom = new THREE.TubeGeometry(mainSpline, 150, 0.125, 16, false);
      const mainMesh = new THREE.Mesh(mainGeom, strandMaterials[s]);
      helixGroup.add(mainMesh);

      // 3 Twisted micro-fibril braided sub-tubes creating the fibrous rope texture seen in the mockup
      for (let f = 0; f < 3; f++) {
        const fibrilOffsetAngle = (f * Math.PI * 2) / 3;
        const fibrilPoints = [];

        for (let i = 0; i <= pointsPerStrand; i++) {
          const t = i / pointsPerStrand;
          const y = (t - 0.5) * heightSpan;
          const angle = t * Math.PI * 2 * turns + phaseOffset;

          const subAngle = t * Math.PI * 2 * turns * 5.0 + fibrilOffsetAngle;
          const subR = 0.075;

          const nx = Math.cos(angle);
          const nz = Math.sin(angle);
          const bx = -nz;
          const bz = nx;

          const fx = Math.cos(angle) * helixRadius + nx * Math.cos(subAngle) * subR + bx * Math.sin(subAngle) * subR;
          const fz = Math.sin(angle) * helixRadius + nz * Math.cos(subAngle) * subR + bz * Math.sin(subAngle) * subR;

          fibrilPoints.push(new THREE.Vector3(fx, y, fz));
        }

        const fibrilSpline = new THREE.CatmullRomCurve3(fibrilPoints, false, 'catmullrom', 0.5);
        const fibrilGeom = new THREE.TubeGeometry(fibrilSpline, 110, 0.040, 8, false);
        const fibrilMesh = new THREE.Mesh(fibrilGeom, strandMaterials[s]);
        helixGroup.add(fibrilMesh);
      }
    }

    // =========================================================================
    // 8. INTER-STRAND CROSSLINKS (HYDROGEN BONDS)
    // =========================================================================
    const crosslinkMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0x713f12,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    });

    const crosslinkPairs = [
      [0, 1],
      [1, 2],
      [2, 0],
    ];

    for (let i = 12; i < pointsPerStrand - 12; i += 7) {
      crosslinkPairs.forEach(([s1, s2]) => {
        const p1 = strandsPoints[s1][i];
        const p2 = strandsPoints[s2][i];
        if (!p1 || !p2) return;

        const dist = p1.distanceTo(p2);
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const geom = new THREE.CylinderGeometry(0.018, 0.018, dist, 8);
        const mesh = new THREE.Mesh(geom, crosslinkMat);

        mesh.position.copy(mid);
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3().subVectors(p2, p1).normalize()
        );
        helixGroup.add(mesh);
      });
    }

    // =========================================================================
    // 9. AMINO ACID SPHERICAL NODES ALONG STRANDS
    // =========================================================================
    const aminoGroup = new THREE.Group();
    helixGroup.add(aminoGroup);
    aminoGroupRef.current = aminoGroup;

    const aminoNodeMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0x9a3412,
      emissiveIntensity: 0.22,
      roughness: 0.3,
      metalness: 0.15,
    });
    materialsRef.current.aminoNodes = [aminoNodeMat];

    const aminoNodeGeom = new THREE.SphereGeometry(0.075, 12, 12);
    for (let s = 0; s < 3; s++) {
      for (let i = 6; i < pointsPerStrand; i += 5) {
        const pt = strandsPoints[s][i];
        const node = new THREE.Mesh(aminoNodeGeom, aminoNodeMat);
        const offset = new THREE.Vector3(pt.x, 0, pt.z).normalize().multiplyScalar(0.08);
        node.position.copy(pt).add(offset);
        aminoGroup.add(node);
      }
    }

    // =========================================================================
    // 10. MULTIFACETED ICE-BLUE & LAVENDER GEMSTONE CRYSTALS
    // =========================================================================
    const crystalsGroup = new THREE.Group();
    masterGroup.add(crystalsGroup);
    crystalsGroupRef.current = crystalsGroup;

    // Translucent Ice-Blue Gem Crystal Material with sharp sparkling facets matching mockup
    const iceBlueMat = new THREE.MeshPhysicalMaterial({
      color: 0xd0f0fd,
      emissive: 0x0284c7,
      emissiveIntensity: 0.38,
      roughness: 0.04,
      metalness: 0.20,
      transmission: 0.70,
      ior: 1.55,
      thickness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      flatShading: true,
      transparent: true,
      opacity: 0.94,
    });

    const lavenderMat = new THREE.MeshPhysicalMaterial({
      color: 0xede9fe,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.38,
      roughness: 0.04,
      metalness: 0.20,
      transmission: 0.70,
      ior: 1.55,
      thickness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      flatShading: true,
      transparent: true,
      opacity: 0.94,
    });

    materialsRef.current.crystals = [iceBlueMat, lavenderMat];

    const largeGeom = new THREE.IcosahedronGeometry(0.36, 0); // Hero crystals
    const medGeom = new THREE.IcosahedronGeometry(0.24, 0);
    const smallGeom = new THREE.DodecahedronGeometry(0.15, 0);
    const octaGeom = new THREE.OctahedronGeometry(0.18, 0);

    const wireMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
    });

    const crystalsData = [];

    // Prominent crystals nestled in the helical grooves matching the mockup
    const grooveConfigs = [
      { y: 0.18, angle: 0.35, scale: 1.35, isLav: false, name: 'center-hero' },
      { y: -0.62, angle: 1.85, scale: 1.20, isLav: false, name: 'lower-center' },
      { y: 0.98, angle: 3.45, scale: 1.15, isLav: false, name: 'upper-center' },
      { y: 1.82, angle: 0.75, scale: 0.95, isLav: true, name: 'top-valley' },
      { y: -1.48, angle: 2.25, scale: 1.00, isLav: true, name: 'bottom-valley' },
      { y: -2.35, angle: 0.45, scale: 0.90, isLav: false, name: 'lowest' },
      { y: 2.65, angle: 2.95, scale: 0.85, isLav: false, name: 'highest' },
      { y: -0.15, angle: 4.15, scale: 1.05, isLav: true, name: 'mid-rear' },
    ];

    grooveConfigs.forEach((cfg, idx) => {
      const mat = cfg.isLav ? lavenderMat.clone() : iceBlueMat.clone();
      const geom = cfg.scale > 1.1 ? largeGeom : medGeom;
      const crystalMesh = new THREE.Mesh(geom, mat);

      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, wireMat);
      crystalMesh.add(line);

      const r = helixRadius + 0.12;
      const targetPos = new THREE.Vector3(
        Math.cos(cfg.angle) * r,
        cfg.y,
        Math.sin(cfg.angle) * r
      );

      crystalMesh.position.copy(targetPos);
      crystalMesh.scale.setScalar(cfg.scale);
      crystalMesh.rotation.set(0.4 * idx, 0.7 * idx, 0.2 * idx);

      crystalsGroup.add(crystalMesh);

      crystalsData.push({
        mesh: crystalMesh,
        scale: cfg.scale,
        rotSpeed: {
          x: 0.003 + (Math.random() - 0.5) * 0.003,
          y: 0.004 + (Math.random() - 0.5) * 0.003,
        },
      });
    });

    // 20 Floating Ambient Crystals with optical depth
    for (let i = 0; i < 20; i++) {
      const isLav = i % 2 === 0;
      const mat = isLav ? lavenderMat.clone() : iceBlueMat.clone();
      const geom = i % 2 === 0 ? smallGeom : octaGeom;
      const crystalMesh = new THREE.Mesh(geom, mat);

      const angle = (i / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const y = (Math.random() - 0.5) * 7.0;

      const targetR = helixRadius + 0.28 + Math.random() * 0.6;
      const targetPos = new THREE.Vector3(
        Math.cos(angle) * targetR,
        y * 0.9,
        Math.sin(angle) * targetR
      );

      crystalMesh.position.copy(targetPos);
      const s = 0.45 + Math.random() * 0.5;
      crystalMesh.scale.setScalar(s);
      crystalMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      crystalsGroup.add(crystalMesh);

      crystalsData.push({
        mesh: crystalMesh,
        scale: s,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.006,
          y: (Math.random() - 0.5) * 0.006,
        },
      });
    }

    crystalsDataRef.current = crystalsData;

    // =========================================================================
    // 11. ANIMATION TICKER WITH OFFSCREEN PAUSE
    // =========================================================================
    let isVisible = true;
    let isLooping = false;

    const animate = () => {
      if (!isVisible) {
        isLooping = false;
        return;
      }
      isLooping = true;
      animFrameRef.current = requestAnimationFrame(animate);

      controls.update();

      // Gentle longitudinal spin
      if (helixGroupRef.current) {
        helixGroupRef.current.rotation.y += 0.0022;
      }

      if (crystalsGroupRef.current) {
        crystalsGroupRef.current.rotation.y += 0.0022;
      }

      crystalsDataRef.current.forEach((c) => {
        c.mesh.rotation.x += c.rotSpeed.x;
        c.mesh.rotation.y += c.rotSpeed.y;
      });

      renderer.render(scene, camera);
    };

    const startAnimation = () => {
      if (!isLooping) {
        isLooping = true;
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    startAnimation();

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startAnimation();
          }
        });
      },
      { threshold: 0.01 }
    );
    visibilityObserver.observe(container);

    // =========================================================================
    // 12. RESIZE HANDLER
    // =========================================================================
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
      visibilityObserver.disconnect();
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Exploration Mode Highlights
  useEffect(() => {
    if (!helixGroupRef.current) return;

    if (activeMode === 'amino') {
      materialsRef.current.aminoNodes.forEach((mat) => {
        gsap.to(mat.color, { r: 1.0, g: 0.9, b: 0.3, duration: 0.5 });
        gsap.to(mat, { emissiveIntensity: 0.85, duration: 0.5 });
      });
      materialsRef.current.crystals.forEach((mat) => {
        gsap.to(mat, { opacity: 0.45, duration: 0.5 });
      });
    } else if (activeMode === 'collagen') {
      materialsRef.current.aminoNodes.forEach((mat) => {
        gsap.to(mat.color, { r: 1.0, g: 0.93, b: 0.84, duration: 0.5 });
        gsap.to(mat, { emissiveIntensity: 0.22, duration: 0.5 });
      });
      materialsRef.current.strands.forEach((mat) => {
        gsap.to(mat, { emissiveIntensity: 0.45, duration: 0.6 });
      });
      materialsRef.current.crystals.forEach((mat) => {
        gsap.to(mat, { opacity: 0.94, duration: 0.5 });
      });
    } else if (activeMode === 'minerals') {
      materialsRef.current.strands.forEach((mat) => {
        gsap.to(mat, { emissiveIntensity: 0.18, duration: 0.5 });
      });
      materialsRef.current.crystals.forEach((mat) => {
        gsap.to(mat, { emissiveIntensity: 0.9, opacity: 1.0, duration: 0.5 });
      });
    }
  }, [activeMode]);

  return (
    <div className="w-full max-w-[1440px] mx-auto my-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 items-center z-10 py-1 overflow-visible select-none">
      {/* ========================================================= */}
      {/* LEFT COLUMN: Section Heading, Narration & Hear Story Button */}
      {/* ========================================================= */}
      <div className="lg:col-span-4 flex flex-col justify-center space-y-2 sm:space-y-4 z-20 pl-2 sm:pl-4">
        {/* Top: 03 / 07 with dark underline strictly matching mockup */}
        <div className="space-y-1">
          <span className="font-mono text-xs sm:text-[13px] text-[#5D5066] font-semibold tracking-widest block">
            03 / 07
          </span>
          <div className="w-7 h-[2px] bg-[#14091F]" />
        </div>

        {/* Title: The Mineral Matrix */}
        <div>
          <h2
            className="text-3xl sm:text-5xl lg:text-[56px] font-light text-[#14091F] tracking-tight leading-[1.0] my-1"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            The<br />
            <span
              className="font-bold tracking-tight"
              style={{
                background: 'linear-gradient(90deg, #F43F5E 0%, #FB7185 45%, #E11D48 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Mineral Matrix
            </span>
          </h2>

          <p className="text-xs sm:text-base text-stone-600 font-normal mt-1 sm:mt-2">
            The Collagen &amp; Calcium-Phosphate Scaffold
          </p>
        </div>

        {/* Story Quote with Reddish Border */}
        <div className="border-l-2 border-[#E11D48] pl-3 py-0.5 space-y-1 my-1">
          <p className="text-xs sm:text-[13px] text-stone-700 italic font-light leading-relaxed">
            “Without a complete amino acid framework to lock calcium into place… your internal structure accelerates its breakdown.”
          </p>
        </div>

        {/* Listen Button (Capsule pill matching mockup) */}
        <div className="pt-0.5 sm:pt-1">
          <button
            type="button"
            onClick={handleAudio}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white hover:bg-stone-50 text-xs font-mono font-bold text-[#14091F] border border-stone-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
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
      </div>

      {/* ========================================================= */}
      {/* CENTER COLUMN: Diagonal 3D Collagen Triple Helix with Gem Crystals */}
      {/* ========================================================= */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full h-[280px] sm:h-[400px] lg:h-[640px] xl:h-[680px] max-h-[50vh] lg:max-h-[84vh] overflow-visible my-1 lg:my-0">
        {/* Soft Dreamy Pastel Depth Blur Glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0 rounded-full blur-[85px] opacity-75"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(251,113,133,0.20) 0%, rgba(244,114,182,0.16) 35%, rgba(216,180,254,0.12) 65%, transparent 75%)',
          }}
        />

        {/* 3D WebGL Canvas Container with soft feathered mask so tips dissolve seamlessly */}
        <div
          ref={mountRef}
          className="w-[125%] -ml-[12.5%] h-full relative z-10 cursor-grab active:cursor-grabbing select-none"
          style={{
            maskImage: 'radial-gradient(ellipse 65% 65% at 50% 50%, black 35%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 65% 65% at 50% 50%, black 35%, transparent 80%)',
          }}
        />

        {/* ========================================================= */}
        {/* LEADER LINE CALLOUT 1: TOP-LEFT "Collagen" (Exact mockup match) */}
        {/* ========================================================= */}
        <div className="absolute top-[16%] left-[2%] sm:left-[6%] z-20 pointer-events-none flex flex-col items-start">
          <div className="text-left">
            <span className="text-sm sm:text-base font-bold text-[#14091F] block leading-tight">
              Collagen
            </span>
            <span className="text-xs sm:text-[13px] text-stone-500 font-light italic block mt-0.5">
              Flexible protein framework
            </span>
          </div>
          {/* Fine leader line pointing diagonally down to the coral strand */}
          <svg className="w-24 h-12 mt-1 overflow-visible" viewBox="0 0 96 48">
            <path
              d="M 12 4 L 56 24 L 84 34"
              fill="none"
              stroke="#2A0E3D"
              strokeWidth="1.1"
              opacity="0.65"
            />
            <circle cx="84" cy="34" r="2.5" fill="#E11D48" />
          </svg>
        </div>

        {/* ========================================================= */}
        {/* LEADER LINE CALLOUT 2: BOTTOM-RIGHT "Calcium-Phosphate" (Exact mockup match) */}
        {/* ========================================================= */}
        <div className="absolute bottom-[16%] right-[2%] sm:right-[4%] z-20 pointer-events-none flex flex-col items-start">
          {/* Fine leader line originating from the prominent central crystal */}
          <svg className="w-24 h-12 mb-1 overflow-visible" viewBox="0 0 96 48">
            <circle cx="8" cy="8" r="2.5" fill="#0284C7" />
            <path
              d="M 8 8 L 48 24 L 84 38"
              fill="none"
              stroke="#2A0E3D"
              strokeWidth="1.1"
              opacity="0.65"
            />
          </svg>
          <div className="text-left">
            <span className="text-sm sm:text-base font-bold text-[#14091F] block leading-tight">
              Calcium-Phosphate
            </span>
            <span className="text-xs sm:text-[13px] text-stone-500 font-light italic block mt-0.5">
              Minerals that lock in strength and stability
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Curved Vertical Timeline with 3 Nodes (Hidden on mobile to fit screen) */}
      {/* ========================================================= */}
      <div className="hidden lg:flex lg:col-span-3 items-center justify-start relative z-20 py-4 pr-2 sm:pr-4">
        {/* Container for Curved Line + 3 Interactive Exploration Items */}
        <div className="relative flex items-center w-full">
          {/* Elegant SVG Curved Connecting Line */}
          <div className="absolute left-[6px] sm:left-[10px] top-6 bottom-6 w-12 pointer-events-none -z-0">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 48 300"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FB7185" />
                  <stop offset="50%" stopColor="#E11D48" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              {/* Delicate graceful outward curved line like the mockup */}
              <path
                d="M 8 10 Q 38 150 8 290"
                fill="none"
                stroke="url(#curveGradient)"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* 3 Node dots directly on the curve */}
              <circle cx="9" cy="30" r="3.5" fill="#FB7185" />
              <circle cx="30" cy="150" r="4" fill="#E11D48" />
              <circle cx="9" cy="270" r="3.5" fill="#A855F7" />
            </svg>
          </div>

          {/* 3 Clickable Exploration Items (Vertical Stack without box borders, pure typography matching mockup) */}
          <div className="flex flex-col justify-between space-y-8 pl-10 sm:pl-12 w-full z-10">
            {/* ITEM 1: Amino Acids */}
            <div
              onClick={() => setActiveMode('amino')}
              className={`group flex items-start gap-3.5 py-1.5 px-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                activeMode === 'amino'
                  ? 'scale-[1.02] opacity-100'
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              {/* Molecule 3-node icon in coral */}
              <div className="p-1 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#14091F] tracking-tight group-hover:text-[#E11D48] transition-colors leading-snug">
                  Amino Acids
                </h4>
                <p className="text-xs text-stone-500 font-light mt-0.5 leading-relaxed">
                  The building blocks of proteins.
                </p>
              </div>
            </div>

            {/* ITEM 2: Collagen Helix */}
            <div
              onClick={() => setActiveMode('collagen')}
              className={`group flex items-start gap-3.5 py-1.5 px-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                activeMode === 'collagen'
                  ? 'scale-[1.02] opacity-100'
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              {/* 3 Wavy strands icon in magenta */}
              <div className="p-1 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                  <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                  <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                </svg>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#14091F] tracking-tight group-hover:text-[#E11D48] transition-colors leading-snug">
                  Collagen Helix
                </h4>
                <p className="text-xs text-stone-500 font-light mt-0.5 leading-relaxed">
                  Provides the flexible protein framework of bone.
                </p>
              </div>
            </div>

            {/* ITEM 3: Calcium-Phosphate */}
            <div
              onClick={() => setActiveMode('minerals')}
              className={`group flex items-start gap-3.5 py-1.5 px-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                activeMode === 'minerals'
                  ? 'scale-[1.02] opacity-100'
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              {/* Gem / crystal wireframe icon in purple */}
              <div className="p-1 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12l4 6-10 12L2 9z" />
                  <path d="M11 3 L8 9 L12 21 L16 9 L13 3" />
                  <path d="M2 9h20" />
                </svg>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#14091F] tracking-tight group-hover:text-[#E11D48] transition-colors leading-snug">
                  Calcium-Phosphate
                </h4>
                <p className="text-xs text-stone-500 font-light mt-0.5 leading-relaxed">
                  Contributes to the hardness and strength of bone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
