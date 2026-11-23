'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Global singleton cache for GLTF model to prevent redundant network fetches
let cachedModelData: {
  wrapperMesh: THREE.Mesh | null;
  innerMesh: THREE.Object3D | null;
} | null = null;
let modelLoadingPromise: Promise<{
  wrapperMesh: THREE.Mesh | null;
  innerMesh: THREE.Object3D | null;
}> | null = null;

function loadSharedModel(): Promise<{
  wrapperMesh: THREE.Mesh | null;
  innerMesh: THREE.Object3D | null;
}> {
  if (cachedModelData) return Promise.resolve(cachedModelData);
  if (modelLoadingPromise) return modelLoadingPromise;

  modelLoadingPromise = new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/models/GoProTeen_model.glb',
      (gltf) => {
        const foundWrapper = (gltf.scene.getObjectByName('GoProTeen_Main_Wrapper') as THREE.Mesh) || null;
        const foundInner = gltf.scene.getObjectByName('GP_EXPLODE_CONTROLLER') || null;

        cachedModelData = { wrapperMesh: foundWrapper, innerMesh: foundInner };
        resolve(cachedModelData);
      },
      undefined,
      (err) => {
        console.warn('GLB load error, using procedural model fallback:', err);
        cachedModelData = { wrapperMesh: null, innerMesh: null };
        resolve(cachedModelData);
      }
    );
  });

  return modelLoadingPromise;
}

export interface GoProteenProductProps {
  className?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  autoRotateSpeed?: number;
  interactive?: boolean;
  enableFloat?: boolean;
  scrollTilt?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function GoProteenProduct({
  className = '',
  position = [0, 0, 0],
  rotation = [0.08, 0.15, -0.05],
  scale = 1.0,
  autoRotateSpeed = 0.003,
  interactive = true,
  enableFloat = true,
  scrollTilt = false,
  onClick,
  style = {},
}: GoProteenProductProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Drag interaction state
  const dragRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    velX: 0,
    velY: 0,
    extraRotX: 0,
    extraRotY: 0,
  });

  // Track viewport intersection to sleep render loop when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { rootMargin: '150px 0px', threshold: 0.02 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Three.js instance setup & active render loop
  useEffect(() => {
    if (!isInView) return; // Do not initialize or render if offscreen

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Scene & Environment
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Camera
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.0);

    // Root Product Group
    const productGroup = new THREE.Group();
    productGroup.rotation.order = 'YXZ';
    scene.add(productGroup);

    // Studio Lighting
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

    // Chocolate Texture for core
    const nCanvas = document.createElement('canvas');
    nCanvas.width = nCanvas.height = 128;
    const nctx = nCanvas.getContext('2d');
    if (nctx) {
      nctx.fillStyle = '#808080';
      nctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 500; i++) {
        const v = (90 + Math.random() * 110) | 0;
        nctx.fillStyle = `rgb(${v},${v},${v})`;
        nctx.beginPath();
        nctx.arc(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 2, 0, 7);
        nctx.fill();
      }
    }
    const bumpMap = new THREE.CanvasTexture(nCanvas);
    bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
    bumpMap.repeat.set(3, 1);

    // Procedural Fallback Mesh (while loading or if glb fails)
    const procGroup = new THREE.Group();
    const chocMat = new THREE.MeshStandardMaterial({
      color: 0x3b1d12,
      roughness: 0.38,
      metalness: 0.05,
      bumpMap,
      bumpScale: 1.2,
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
      wctx.fillText('GoProteen', 256, 110);
    }
    const wTex = new THREE.CanvasTexture(wCanvas);
    const wrapMat = new THREE.MeshStandardMaterial({
      map: wTex,
      roughness: 0.28,
      metalness: 0.05,
    });
    const procWrap = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.29, 0.62), wrapMat);
    procGroup.add(procWrap);
    productGroup.add(procGroup);

    let isDisposed = false;

    // Load shared model
    loadSharedModel().then(({ wrapperMesh, innerMesh }) => {
      if (isDisposed) return;
      if (wrapperMesh || innerMesh) {
        procGroup.visible = false;
        const scaleFactor = 17.0;

        if (wrapperMesh) {
          const wClone = wrapperMesh.clone(true);
          wClone.scale.setScalar(scaleFactor);
          if (wClone.material) {
            const mat = (wClone.material as THREE.MeshStandardMaterial).clone();
            mat.transparent = false;
            mat.opacity = 1.0;
            mat.roughness = 0.26;
            mat.metalness = 0.04;
            mat.envMapIntensity = 1.25;
            wClone.material = mat;
          }
          productGroup.add(wClone);
        }

        if (innerMesh) {
          const iClone = innerMesh.clone(true);
          iClone.visible = false;
          productGroup.add(iClone);
        }
      }
      setIsLoaded(true);
    });

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Inertia decay from drag
      if (!dragRef.current.isDragging) {
        dragRef.current.extraRotY += dragRef.current.velX;
        dragRef.current.extraRotX += dragRef.current.velY;
        dragRef.current.velX *= 0.92;
        dragRef.current.velY *= 0.92;
      }

      // Base rotation + drag offset + auto idle rotation
      const idleRotY = autoRotateSpeed ? Math.sin(elapsed * 0.8) * 0.1 : 0;
      const floatY = enableFloat ? Math.sin(elapsed * 1.5) * 0.06 : 0;

      productGroup.position.set(position[0], position[1] + floatY, position[2]);
      productGroup.rotation.x = rotation[0] + dragRef.current.extraRotX;
      productGroup.rotation.y = rotation[1] + dragRef.current.extraRotY + idleRotY;
      productGroup.rotation.z = rotation[2];
      productGroup.scale.setScalar(scale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      pmrem.dispose();
      renderer.dispose();
      bumpMap.dispose();
      wTex.dispose();
    };
  }, [isInView, position, rotation, scale, autoRotateSpeed, enableFloat]);

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    dragRef.current.isDragging = true;
    dragRef.current.prevX = e.clientX;
    dragRef.current.prevY = e.clientY;
    dragRef.current.velX = 0;
    dragRef.current.velY = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!interactive || !dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.prevX;
    const dy = e.clientY - dragRef.current.prevY;
    dragRef.current.prevX = e.clientX;
    dragRef.current.prevY = e.clientY;

    const rotScale = 0.007;
    dragRef.current.extraRotY += dx * rotScale;
    dragRef.current.extraRotX += dy * rotScale;
    dragRef.current.velX = dx * rotScale;
    dragRef.current.velY = dy * rotScale;
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${interactive ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={onClick}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
