'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createGoProteenProductModel, ProductModelHandle } from './GoProteenProductModel';
import { ProductPose, PRODUCT_POSES } from './ProductScrollPoses';

export interface PersistentCanvasHandle {
  setTargetPose: (pose: ProductPose) => void;
  triggerCrunch: () => void;
}

interface GoProteenPersistentCanvasProps {
  className?: string;
  onLoaded?: () => void;
}

const GoProteenPersistentCanvas = forwardRef<PersistentCanvasHandle, GoProteenPersistentCanvasProps>(
  ({ className = '', onLoaded }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInViewRef = useRef(true);

    // Target and current transform for the ONE persistent model
    const stateRef = useRef({
      targetPose: { ...PRODUCT_POSES.hero },
      currentPose: { ...PRODUCT_POSES.hero },
      isDragging: false,
      prevX: 0,
      prevY: 0,
      velX: 0,
      velY: 0,
      dragRotX: 0,
      dragRotY: 0,
    });

    useImperativeHandle(ref, () => ({
      setTargetPose: (newPose: ProductPose) => {
        stateRef.current.targetPose = { ...newPose };
      },
      triggerCrunch: () => {
        // Particle burst
      },
    }));

    const startLoopRef = useRef<(() => void) | null>(null);
    const isLoopingRef = useRef(false);

    // Pause WebGL rendering loop when this section is offscreen to save mobile GPU & battery
    useEffect(() => {
      const container = containerRef.current;
      if (!container || typeof IntersectionObserver === 'undefined') return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isInViewRef.current = entry.isIntersecting;
            if (entry.isIntersecting && !isLoopingRef.current && startLoopRef.current) {
              startLoopRef.current();
            }
          });
        },
        { rootMargin: '100px 0px', threshold: 0.001 }
      );

      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    // Initialize the single persistent Three.js Canvas and product instance (mounts ONCE)
    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const getWidth = () => container.clientWidth || window.innerWidth || 1280;
      const getHeight = () => container.clientHeight || window.innerHeight || 800;

      const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 800 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? 'default' : 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5));
      renderer.setSize(getWidth(), getHeight(), false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const camera = new THREE.PerspectiveCamera(
        32,
        getWidth() / getHeight(),
        0.1,
        50
      );
      camera.position.set(0, 0, 5.0);

      // Studio Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 1.4));
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

      // Create the single product instance in this scene
      const modelHandle: ProductModelHandle = createGoProteenProductModel(scene, onLoaded);

      // Resize listener
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = getWidth();
        const h = getHeight();
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener('resize', handleResize);
      handleResize();

      // Main render loop with complete offscreen sleep
      let animId = 0;
      const clock = new THREE.Clock();

      const animate = () => {
        if (!isInViewRef.current) {
          isLoopingRef.current = false;
          return; // Stop RAF loop completely when offscreen
        }

        isLoopingRef.current = true;
        animId = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();
        const s = stateRef.current;

        // Dampened continuous lerp towards targetPose
        const lerpFactor = 0.085;
        s.currentPose.x += (s.targetPose.x - s.currentPose.x) * lerpFactor;
        s.currentPose.y += (s.targetPose.y - s.currentPose.y) * lerpFactor;
        s.currentPose.z += (s.targetPose.z - s.currentPose.z) * lerpFactor;
        s.currentPose.rotX += (s.targetPose.rotX - s.currentPose.rotX) * lerpFactor;
        s.currentPose.rotY += (s.targetPose.rotY - s.currentPose.rotY) * lerpFactor;
        s.currentPose.rotZ += (s.targetPose.rotZ - s.currentPose.rotZ) * lerpFactor;
        s.currentPose.scale += (s.targetPose.scale - s.currentPose.scale) * lerpFactor;

        // User drag inertia decay
        if (!s.isDragging) {
          s.dragRotY += s.velX;
          s.dragRotX += s.velY;
          s.velX *= 0.92;
          s.velY *= 0.92;
        }

        // Slow organic breathing oscillation
        const idleRot = Math.sin(elapsed * 0.7) * 0.05;
        const idleFloat = Math.sin(elapsed * 1.4) * 0.04;

        const w = getWidth();
        const xFactor = Math.min(1.0, Math.max(0.7, w / 1280));
        const finalX = s.currentPose.x * xFactor;

        const root = modelHandle.rootGroup;
        root.position.set(
          finalX,
          s.currentPose.y + idleFloat,
          s.currentPose.z
        );
        root.rotation.x = s.currentPose.rotX + s.dragRotX;
        root.rotation.y = s.currentPose.rotY + s.dragRotY + idleRot;
        root.rotation.z = s.currentPose.rotZ;
        root.scale.setScalar(s.currentPose.scale);

        renderer.render(scene, camera);
      };

      startLoopRef.current = () => {
        if (!isLoopingRef.current) {
          isLoopingRef.current = true;
          animId = requestAnimationFrame(animate);
        }
      };

      animate();

      return () => {
        startLoopRef.current = null;
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        modelHandle.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    }, []); // Run ONCE on mount, clean up on unmount

    return (
      <div
        ref={containerRef}
        className={`w-full h-full relative overflow-hidden pointer-events-none select-none ${className}`}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    );
  }
);

GoProteenPersistentCanvas.displayName = 'GoProteenPersistentCanvas';

export default GoProteenPersistentCanvas;
