'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, RotateCcw, ShieldCheck, Activity, TrendingDown } from 'lucide-react';

export default function BoneRemodeling({ onRestart }) {
  const mountRef = useRef(null);
  const [remodelingState, setRemodelingState] = useState('balanced'); // 'formation' | 'resorption' | 'balanced'

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const surfaceMeshRef = useRef(null);
  const stateRef = useRef(remodelingState);

  useEffect(() => {
    stateRef.current = remodelingState;
  }, [remodelingState]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 350;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 3.8, 6.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xfff6f0, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 2.0);
    dirLight.position.set(4, 7, 5);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xc084fc, 1.2);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    // Deformable Bone Surface Grid
    const gridX = 32;
    const gridY = 32;
    const planeGeom = new THREE.PlaneGeometry(6.0, 6.0, gridX - 1, gridY - 1);
    planeGeom.rotateX(-Math.PI / 2);

    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: 0xF2E4D8,
      roughness: 0.5,
      metalness: 0.05,
      flatShading: true,
    });
    const surfaceMesh = new THREE.Mesh(planeGeom, surfaceMaterial);
    scene.add(surfaceMesh);
    surfaceMeshRef.current = surfaceMesh;

    // Osteoblasts (Bone Builders)
    const cellsGroup = new THREE.Group();
    scene.add(cellsGroup);
    const blastGeom = new THREE.SphereGeometry(0.24, 16, 16);
    const blastMat = new THREE.MeshStandardMaterial({ color: 0xFB7185, emissive: 0x881337, roughness: 0.3 });
    const osteoblasts = [];
    for (let b = 0; b < 4; b++) {
      const blast = new THREE.Mesh(blastGeom, blastMat);
      blast.position.set((b - 1.5) * 1.3, 0.7, 0.8 + (Math.random() - 0.5) * 0.5);
      cellsGroup.add(blast);
      osteoblasts.push(blast);
    }

    // Osteoclasts (Bone Resorbers)
    const clastGeom = new THREE.DodecahedronGeometry(0.36, 1);
    const clastMat = new THREE.MeshStandardMaterial({ color: 0xD97706, emissive: 0x78350F, roughness: 0.4 });
    const osteoclasts = [];
    for (let c = 0; c < 3; c++) {
      const clast = new THREE.Mesh(clastGeom, clastMat);
      clast.position.set((c - 1) * 1.6, 0.75, -1.0 + (Math.random() - 0.5) * 0.5);
      cellsGroup.add(clast);
      osteoclasts.push(clast);
    }

    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const currentState = stateRef.current;

      const posAttr = planeGeom.attributes.position;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        const vx = posAttr.getX(i);
        const vz = posAttr.getZ(i);

        let targetY = 0;
        if (currentState === 'formation') {
          targetY = Math.sin(vx * 1.2 + t * 2) * 0.15 + Math.cos(vz * 1.2 + t * 2) * 0.15 + 0.22;
        } else if (currentState === 'resorption') {
          targetY = Math.sin(vx * 1.5) * Math.cos(vz * 1.5) * 0.4 - 0.28;
        } else {
          targetY = Math.sin(vx * 0.8 + t) * 0.08 + Math.cos(vz * 0.8 + t) * 0.08;
        }

        const curY = posAttr.getY(i);
        posAttr.setY(i, curY + (targetY - curY) * 0.08);
      }
      posAttr.needsUpdate = true;
      planeGeom.computeVertexNormals();

      osteoblasts.forEach((b, idx) => {
        b.position.y = 0.55 + Math.sin(t * 3 + idx) * 0.08;
        b.scale.setScalar(currentState === 'formation' ? 1.25 : currentState === 'resorption' ? 0.75 : 1.0);
      });

      osteoclasts.forEach((c, idx) => {
        c.position.y = 0.6 + Math.sin(t * 2 + idx) * 0.1;
        c.scale.setScalar(currentState === 'resorption' ? 1.35 : currentState === 'formation' ? 0.7 : 1.0);
      });

      if (surfaceMaterial) {
        if (currentState === 'formation') surfaceMaterial.color.setHex(0xFCE7D6);
        else if (currentState === 'resorption') surfaceMaterial.color.setHex(0xD4C4B5);
        else surfaceMaterial.color.setHex(0xF2E4D8);
      }

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

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* 3D Canvas Stage */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center relative p-3 rounded-3xl bg-white/50 backdrop-blur-xs border border-stone-200/60 shadow-xs">
        <div className="w-full flex items-center justify-between px-3 pt-1 mb-2 z-10">
          <div className="inline-flex rounded-full bg-stone-100 p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setRemodelingState('balanced')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                remodelingState === 'balanced' ? 'bg-white shadow-xs font-bold text-[#14091F]' : 'text-stone-500'
              }`}
            >
              1. Balanced Remodeling
            </button>
            <button
              type="button"
              onClick={() => setRemodelingState('formation')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                remodelingState === 'formation' ? 'bg-rose-500 text-white font-bold shadow-xs' : 'text-stone-500'
              }`}
            >
              2. Formation
            </button>
            <button
              type="button"
              onClick={() => setRemodelingState('resorption')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                remodelingState === 'resorption' ? 'bg-amber-600 text-white font-bold shadow-xs' : 'text-stone-500'
              }`}
            >
              3. Resorption
            </button>
          </div>
        </div>

        <div
          ref={mountRef}
          className="w-full h-[320px] sm:h-[350px] flex items-center justify-center relative select-none"
        />

        <div className="w-full px-4 pb-1 flex items-center justify-between z-10 text-[11px] font-mono text-stone-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>Osteoblasts (Build)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
              <span>Osteoclasts (Resorb)</span>
            </span>
          </div>
          <span>3D Bone Substrate</span>
        </div>
      </div>

      {/* Closing Emotional Question & Chapter Transition */}
      <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
        <div className="p-5 rounded-3xl bg-white/70 backdrop-blur-xs border border-stone-200/70 shadow-xs space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#8A2855] font-bold block">
            {remodelingState === 'balanced' && 'State: 100% Balanced Renewal'}
            {remodelingState === 'formation' && 'State: Matrix Synthesis Active'}
            {remodelingState === 'resorption' && 'State: Accelerated Matrix Loss'}
          </span>
          <h4 className="text-xl font-light text-[#14091F] tracking-tight">
            {remodelingState === 'balanced' && 'Healthy Bone Turnover'}
            {remodelingState === 'formation' && 'Osteoblasts Depositing Osteoid'}
            {remodelingState === 'resorption' && 'Internal Structure Breakdown'}
          </h4>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            {remodelingState === 'balanced' &&
              'In healthy youth, resorption and formation work at an identical pace, continuously healing microscopic stress fractures before weakness can take hold.'}
            {remodelingState === 'formation' &&
              'With complete amino acid availability, osteoblasts synthesize fresh collagen matrix and crystallize minerals, reinforcing density and upright structural strength.'}
            {remodelingState === 'resorption' &&
              'Without raw protein building blocks, osteoblasts stall while osteoclasts continue carving resorption pits, rapidly surrendering bone density.'}
          </p>
        </div>

        {/* The Final Emotional Statement */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-indigo-50 border border-rose-200/70 space-y-3">
          <p className="text-sm font-light text-[#14091F] italic leading-relaxed">
            “As you feel how important your frame really is… ask yourself: <strong>How strong and upright do you want to feel a decade from now?</strong>”
          </p>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart from Step 1</span>
            </button>

            <a href="#crash" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14091F] hover:bg-[#251535] text-white text-xs font-bold tracking-wider transition-all shadow-md hover:scale-102 cursor-pointer"
              >
                <span>Chapter 04: Afternoon Crash</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
