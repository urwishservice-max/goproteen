'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface BarCanvasProps {
  barTarget: {
    x: number;
    y: number;
    s: number;
    ry: number;
    rx: number;
    op: number;
    w: number;
    ex: number;
  };
  onCrunch: () => void;
  isLiteMode: boolean;
  onToggleLiteMode: (lite: boolean) => void;
}

export default function BarCanvas({
  barTarget,
  onCrunch,
  isLiteMode,
  onToggleLiteMode,
}: BarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const crunchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isLiteMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Check WebGL support & device memory
    const nav = navigator as any;
    const isWeak =
      (nav.deviceMemory && nav.deviceMemory < 4) ||
      (nav.hardwareConcurrency && nav.hardwareConcurrency < 4);

    if (isWeak) {
      onToggleLiteMode(true);
      return;
    }

    // 2. Renderer & Scene
    const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 800 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: isMobile ? 'default' : 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.z = 5.5;

    // 3. Procedural Chocolate Bump Canvas Texture
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = noiseCanvas.height = 128;
    const nctx = noiseCanvas.getContext('2d')!;
    const imgData = nctx.createImageData(128, 128);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = Math.random() * 255;
      imgData.data[i] = v;
      imgData.data[i + 1] = v;
      imgData.data[i + 2] = v;
      imgData.data[i + 3] = 255;
    }
    nctx.putImageData(imgData, 0, 0);
    const bumpMap = new THREE.CanvasTexture(noiseCanvas);
    bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
    bumpMap.repeat.set(3, 1);

    // 4. Bar Group
    const bar = new THREE.Group();
    bar.rotation.order = 'YXZ';
    scene.add(bar);

    // Chocolate materials
    const chocMat = new THREE.MeshStandardMaterial({
      color: 0x3b1d12,
      roughness: 0.38,
      metalness: 0.05,
      bumpMap,
      bumpScale: 0.008,
    });

    // Solid body mesh
    const bodyGroup = new THREE.Group();
    bodyGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.26, 0.6), chocMat));

    const nutMatLight = new THREE.MeshStandardMaterial({ color: 0xc99358, roughness: 0.5 });
    const nutMatDark = new THREE.MeshStandardMaterial({ color: 0x5a2f1c, roughness: 0.5 });

    // Instanced chocolate nut bumps
    for (let i = 0; i < 34; i++) {
      const nutMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), i % 3 ? nutMatDark : nutMatLight);
      nutMesh.scale.set(1.4, 0.6, 1);
      nutMesh.position.set(
        (Math.random() - 0.5) * 1.6,
        0.13,
        (Math.random() - 0.5) * 0.44
      );
      bodyGroup.add(nutMesh);
    }
    bar.add(bodyGroup);

    // 5. Exploded 4-Layer Anatomy Group
    const layerHeights = [0.08, 0.07, 0.06, 0.05];
    const layerY = [0.09, 0.015, -0.05, -0.105];
    const layerColors = [0x3b1d12, 0xb98650, 0x8a5a3a, 0xa9743f];
    const layersGroup = new THREE.Group();
    const layerMats: THREE.MeshStandardMaterial[] = [];
    const layerMeshes: THREE.Mesh[] = [];

    layerHeights.forEach((h, i) => {
      const mt = new THREE.MeshStandardMaterial({
        color: layerColors[i],
        roughness: 0.5,
        emissive: 0xff8a2b,
        emissiveIntensity: 0,
      });
      layerMats.push(mt);
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.8, h, 0.6), mt);
      m.position.y = layerY[i];
      layerMeshes.push(m);
      layersGroup.add(m);
    });

    // Nuts inside layer 1
    for (let i = 0; i < 22; i++) {
      const nut = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), nutMatLight);
      nut.scale.set(1.5, 0.7, 1);
      nut.position.set((Math.random() - 0.5) * 1.6, 0.02, (Math.random() - 0.5) * 0.45);
      layerMeshes[1].add(nut);
    }
    bar.add(layersGroup);

    // 6. Procedural Purple Foil Wrapper with "GoProteen" Wordmark
    const wrapCanvas = document.createElement('canvas');
    wrapCanvas.width = 512;
    wrapCanvas.height = 128;
    const wctx = wrapCanvas.getContext('2d')!;
    const grad = wctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, '#3A0E63');
    grad.addColorStop(0.5, '#5B21B6');
    grad.addColorStop(1, '#3A0E63');
    wctx.fillStyle = grad;
    wctx.fillRect(0, 0, 512, 128);

    wctx.fillStyle = '#FFFFFF';
    wctx.font = '800 46px Inter, sans-serif';
    wctx.textAlign = 'center';
    wctx.textBaseline = 'middle';
    wctx.fillText('GoProteen', 256, 64);

    const wrapTexture = new THREE.CanvasTexture(wrapCanvas);
    const wrapFoilMat = new THREE.MeshStandardMaterial({
      color: 0x5b21b6,
      metalness: 0.75,
      roughness: 0.28,
      transparent: true,
      opacity: 1,
    });
    const wrapFrontMat = new THREE.MeshStandardMaterial({
      map: wrapTexture,
      metalness: 0.75,
      roughness: 0.28,
      transparent: true,
      opacity: 1,
    });

    const wrapMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.98, 0.36, 0.72),
      [wrapFoilMat, wrapFoilMat, wrapFrontMat, wrapFrontMat, wrapFoilMat, wrapFoilMat]
    );

    const crimpLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.36, 0.8), wrapFoilMat);
    const crimpRight = crimpLeft.clone();
    crimpLeft.position.x = -1.03;
    crimpRight.position.x = 1.03;

    const wrapperGroup = new THREE.Group();
    wrapperGroup.add(wrapMesh, crimpLeft, crimpRight);
    bar.add(wrapperGroup);

    // 7. Lighting
    scene.add(new THREE.HemisphereLight(0xffffff, 0x5b21b6, 0.95));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const mouseLight = new THREE.PointLight(0xff8a2b, 1.4, 8);
    mouseLight.position.set(0, 0, 3);
    scene.add(mouseLight);

    // 8. Particle Crumbs Burst System
    const PARTICLE_COUNT = 80;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(PARTICLE_COUNT * 3);
    const partVel = new Float32Array(PARTICLE_COUNT * 3);
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));

    const partMat = new THREE.PointsMaterial({
      color: 0x7a4a2e,
      size: 0.08,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    scene.add(new THREE.Points(partGeo, partMat));

    let particleLife = 0;
    let punchScale = 0;

    const triggerBurst = (origin: THREE.Vector3) => {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        partPos[i * 3] = origin.x;
        partPos[i * 3 + 1] = origin.y;
        partPos[i * 3 + 2] = origin.z;
        partVel[i * 3] = (Math.random() - 0.5) * 0.1;
        partVel[i * 3 + 1] = Math.random() * 0.08;
        partVel[i * 3 + 2] = (Math.random() - 0.2) * 0.1;
      }
      particleLife = 1;
      punchScale = 1;
      onCrunch();
    };

    crunchRef.current = () => triggerBurst(bar.position);

    // 9. Interactive Tilt & Drag
    let mouseX = 0;
    let mouseY = 0;
    let isDown = false;
    let lastClientX = 0;
    let dragMoveDist = 0;
    let extraAngle = 0;
    let extraVelocity = 0;
    let scrollPos = 0;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
      mouseLight.position.set(mouseX * 8, -mouseY * 6, 3);

      if (isDown) {
        const delta = e.clientX - lastClientX;
        lastClientX = e.clientX;
        dragMoveDist += Math.abs(delta);
        extraVelocity = delta * 0.012;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, input, a, .track, .card, .cells')) return;
      isDown = true;
      lastClientX = e.clientX;
      dragMoveDist = 0;
    };

    const raycaster = new THREE.Raycaster();
    const handlePointerUp = (e: PointerEvent) => {
      if (isDown && dragMoveDist < 6 && curState.op > 0.4) {
        raycaster.setFromCamera(
          new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1
          ),
          camera
        );
        const hits = raycaster.intersectObject(bar, true);
        if (hits.length > 0) {
          triggerBurst(hits[0].point);
        }
      }
      isDown = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // 10. Resize handler
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // 11. Animation Loop with Performance Auto-Downgrade
    const curState = { ...barTarget };
    let lastTime = performance.now();
    let slowFrames = 0;
    let animId: number;

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);

      const dt = time - lastTime || 16;
      lastTime = time;

      // FPS probe
      if (dt > 45) {
        slowFrames++;
        if (slowFrames > 120) {
          onToggleLiteMode(true);
          return;
        }
      } else {
        slowFrames = Math.max(0, slowFrames - 1);
      }

      // Smooth state interpolation
      for (const k in curState) {
        (curState as any)[k] += ((barTarget as any)[k] - (curState as any)[k]) * 0.07;
      }

      scrollPos += (window.scrollY * 0.0014 - scrollPos) * 0.06;
      extraAngle += extraVelocity;
      extraVelocity *= 0.94;
      extraAngle *= 0.997;

      // Visibility toggles
      bodyGroup.visible = curState.ex < 0.03;
      layersGroup.visible = !bodyGroup.visible;

      layerMeshes.forEach((mesh, idx) => {
        mesh.position.y = layerY[idx] + (1.5 - idx) * curState.ex * 0.34;
      });

      wrapperGroup.visible = curState.w > 0.02;
      wrapperGroup.position.x = (1 - curState.w) * 3;
      wrapFoilMat.opacity = curState.w;
      wrapFrontMat.opacity = curState.w;

      // Crumb particles physics
      if (particleLife > 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          partVel[i * 3 + 1] -= 0.003; // gravity
          partPos[i * 3] += partVel[i * 3];
          partPos[i * 3 + 1] += partVel[i * 3 + 1];
          partPos[i * 3 + 2] += partVel[i * 3 + 2];
        }
        particleLife -= 0.018;
        partMat.opacity = Math.max(0, particleLife);
        partGeo.attributes.position.needsUpdate = true;
      }

      punchScale *= 0.9;
      const responsiveScale = curState.s * (window.innerWidth < 800 ? 0.62 : 1);
      const halfWidth = Math.tan((17.5 * Math.PI) / 180) * 5.5 * camera.aspect;

      bar.position.set(
        curState.x * halfWidth * 0.55,
        curState.y + Math.sin(time * 0.0012) * 0.07,
        0
      );
      bar.scale.set(
        responsiveScale * (1 + 0.16 * punchScale),
        responsiveScale * (1 - 0.16 * punchScale),
        responsiveScale * (1 + 0.16 * punchScale)
      );

      bar.rotation.set(
        1 + curState.rx * 0.5 + mouseY * 0.3,
        curState.ry + mouseX * 0.5 + scrollPos + extraAngle,
        mouseX * 0.08
      );

      if (canvas) {
        canvas.style.opacity = `${curState.op}`;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isLiteMode]);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="c"
        className={`fixed inset-0 w-full h-full pointer-events-none z-[1] transition-opacity duration-300 ${
          isLiteMode ? 'hidden' : 'block'
        }`}
      />
      {isLiteMode && (
        <div
          className="fixed left-1/2 top-1/2 w-[min(60vw,320px)] h-[min(20vw,106px)] -ml-[160px] -mt-[53px] rounded-2xl z-[1] -rotate-12 shadow-[0_40px_60px_-20px_rgba(59,29,18,0.55),inset_0_2px_6px_rgba(255,255,255,0.2)]"
          style={{
            background: 'linear-gradient(160deg, #6B3A22, #3B1D12 60%, #2a130b)',
          }}
        />
      )}
    </>
  );
}
