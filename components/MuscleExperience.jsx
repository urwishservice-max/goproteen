'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * MuscleExperience
 * 
 * GoProteen Automatic Age-Based Muscle Transformation
 * - Large, prominent, thick muscular anatomical arm at Age 30 baseline
 * - Real-time continuous 3D morph target deformation driven by userAge (30 -> 60)
 * - Obvious visual transformation: muscle bellies thin out, revealing tendons and bones
 * - Hand, fingers, wrist, humerus, radius, ulna strictly fixed with 0 deformation
 * - Borderless, organic canvas floating on website background
 * - 3D orbit controls with smooth damping and automatic subtle drift
 */
export default function MuscleExperience({
  userAge = 30,
  className = '',
  onModelLoaded = null,
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const armGroupRef = useRef(null);
  const deformableMeshesRef = useRef([]);
  const animFrameIdRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Smooth lerp targets
  const targetLossRef = useRef(0);
  const currentLossRef = useRef(0);

  // Calculate target morph target influence from userAge (30 to 60)
  useEffect(() => {
    if (userAge <= 30) {
      targetLossRef.current = 0.0; // Full, thick muscular baseline
    } else if (userAge >= 60) {
      targetLossRef.current = 1.0; // Significant sarcopenic loss
    } else {
      const t = (userAge - 30) / 30.0; // 0 to 1 between age 30 and 60
      // Continuous non-linear curve: subtle at 35, noticeable at 40, prominent at 50, dramatic at 60
      targetLossRef.current = Math.min(1.0, Math.max(0.0, 0.25 * t + 0.75 * Math.pow(t, 1.6)));
    }
  }, [userAge]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const rect = mount.getBoundingClientRect();
    let width = rect.width || mount.clientWidth || 700;
    let height = rect.height || mount.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup (Optimized for large, prominent arm with zero boundary clipping)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.05, 15);
    camera.position.set(0.01, 0.01, 1.08);
    cameraRef.current = camera;

    // 3. Renderer with Alpha
    const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 800 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? 'default' : 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.shadowMap.enabled = !isMobile;
    if (!isMobile) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls (Interactive 3D rotation without changing model size on scroll)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = false; // Strictly disable zoom so model size NEVER changes while scrolling
    controls.minPolarAngle = Math.PI * 0.22;
    controls.maxPolarAngle = Math.PI * 0.78;
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7f0, 1.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(1.4, 2.2, 1.8);
    keyLight.castShadow = true;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe5f0fa, 1.4);
    fillLight.position.set(-2.0, 0.4, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    rimLight.position.set(0.0, -1.8, -1.5);
    scene.add(rimLight);

    const underLight = new THREE.DirectionalLight(0xfff6ee, 0.8);
    underLight.position.set(0.0, -1.2, 0.8);
    scene.add(underLight);

    // 6. Arm Group (Prominent, large muscular arm, realistic anatomical 3/4 horizontal pose, zero boundary clipping)
    // Uniform scale in all 3 axes guarantees ZERO horizontal or vertical stretching
    const armGroup = new THREE.Group();
    armGroup.rotation.set(-0.12, 0.32, 1.45);
    armGroup.scale.set(1.22, 1.22, 1.22);
    armGroup.position.set(0.02, -0.01, 0.0);
    scene.add(armGroup);
    armGroupRef.current = armGroup;

    // 7. Load GLTF Anatomical Arm
    const loader = new GLTFLoader();
    deformableMeshesRef.current = [];

    loader.load(
      '/models/anatomical_arm.glb',
      (gltf) => {
        const root = gltf.scene;

        root.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;

            const name = node.name.toLowerCase();
            const isMuscle =
              name.includes('biceps') ||
              name.includes('triceps') ||
              name.includes('brachial') ||
              name.includes('pronator') ||
              name.includes('flexor') ||
              name.includes('extensor') ||
              name.includes('supinator') ||
              name.includes('abductor');

            if (node.material) {
              const mat = node.material;
              mat.roughness = isMuscle ? 0.36 : 0.28;
              mat.metalness = 0.02;

              if (isMuscle) {
                // Rich, healthy vascular deep red tone
                mat.color.setHex(0xb8332c);
              } else {
                // Ivory bone tone
                mat.color.setHex(0xe8ded0);
              }
            }

            // Register morph target for age-based muscle volume transformation
            if (node.morphTargetDictionary && node.morphTargetInfluences) {
              const lossIdx = node.morphTargetDictionary['MuscleLoss'];
              if (lossIdx !== undefined) {
                deformableMeshesRef.current.push({
                  mesh: node,
                  lossIdx: lossIdx,
                });
              }
            }
          }
        });

        armGroup.add(root);
        setLoading(false);
        if (onModelLoaded) onModelLoaded(gltf);
      },
      undefined,
      (err) => {
        console.error('Error loading anatomical_arm.glb:', err);
        setLoadError(err.message || 'Failed to load 3D anatomical model');
        setLoading(false);
      }
    );

    // 8. Animation & Render Loop with Offscreen Pause
    let isVisible = true;
    let isLooping = false;

    const animate = () => {
      if (!isVisible) {
        isLooping = false;
        return;
      }
      isLooping = true;
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Smooth interpolation for muscle volume transformation (8% per frame)
      currentLossRef.current += (targetLossRef.current - currentLossRef.current) * 0.085;

      const meshes = deformableMeshesRef.current;
      for (let i = 0; i < meshes.length; i++) {
        const item = meshes[i];
        item.mesh.morphTargetInfluences[item.lossIdx] = currentLossRef.current;
      }

      // Gentle subtle breathing rotation when not actively dragged
      if (controls && !controls.state == -1) {
        armGroup.rotation.y += 0.0004;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    const startAnimation = () => {
      if (!isLooping) {
        isLooping = true;
        animFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    startAnimation();

    // IntersectionObserver to pause loop when scrolled away
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
    visibilityObserver.observe(mount);

    // 9. Resize Observer ensuring strictly preserved aspect ratio
    const handleResize = () => {
      if (!mount || !renderer || !camera) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      if (nw > 0 && nh > 0) {
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // Safe Cleanup
    return () => {
      visibilityObserver.disconnect();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 1. Isolated Canvas Mount Container (Zero React Children Inside) */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* 2. Dynamic Age Muscle State Badge (Borderless, Organic) */}
      {!loading && !loadError && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md shadow-xs pointer-events-none transition-all">
          <span
            className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: userAge <= 30 ? '#1B4329' : userAge <= 45 ? '#8B6A2B' : '#B85D36',
            }}
          />
          <span className="text-[12px] font-medium tracking-tight text-[#14091F]">
            {userAge <= 30
              ? 'Age 30: Full Baseline Muscle'
              : userAge <= 40
              ? `Age ${userAge}: Early Subtle Volume Shift`
              : userAge <= 50
              ? `Age ${userAge}: Noticeable Sarcopenic Loss`
              : `Age ${userAge}: Significant Muscle Loss`}
          </span>
        </div>
      )}

      {/* 3. Floating 3D Interaction Hint (Borderless) */}
      {!loading && !loadError && (
        <div className="absolute bottom-3 left-4 z-10 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md text-[10px] font-mono text-[#6B726C] tracking-wide shadow-xs">
          <svg className="w-3 h-3 text-[#1B4329]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
          </svg>
          <span>DRAG TO ROTATE 3D ARM</span>
        </div>
      )}

      {/* 4. Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 backdrop-blur-xs z-10 transition-opacity pointer-events-none">
          <div className="w-8 h-8 rounded-full border-2 border-[#1B4329] border-t-transparent animate-spin mb-3" />
          <span className="text-[11px] font-mono tracking-widest text-[#1B4329] uppercase">
            Loading Anatomical Model...
          </span>
        </div>
      )}

      {/* 5. Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs text-red-700 bg-red-50/80 rounded-2xl z-10 pointer-events-none">
          <p>Unable to load 3D anatomical model: {loadError}</p>
        </div>
      )}
    </div>
  );
}
