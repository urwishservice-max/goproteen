'use client';

import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/z_anatomy_skeleton.glb';

// Only load when mounted in viewport
// (Preload removed to prevent mobile bandwidth saturation on initial load)

// Calibrated camera coordinates:
// - Default view: Full-body skeleton overview that commands the screen with healthy margins.
// - Spine / Hip / Knee: Deep, high-clarity anatomical close-up zooms so the user can clearly inspect each joint up close.
const REGION_VIEWS = {
  default: {
    target: [0, 0, 0],
    position: [0, 0, 2.50],
  },
  spine: {
    target: [0, 0.18, 0],
    position: [0, 0.18, 1.15],
  },
  hip: {
    target: [0, -0.09, 0],
    position: [0, -0.08, 1.12],
  },
  knee: {
    target: [0, -0.40, 0],
    position: [0, -0.38, 1.05],
  },
};

// Helper to identify anatomical region of each bone mesh
function getBoneRegion(mesh) {
  if (!mesh) return 'other';
  const name = (mesh.name || '').toLowerCase();
  const region = mesh.userData?.anatomy_region;

  if (region === 'spine' || /vertebra|atlas|axis|sacrum|coccyx/i.test(name)) {
    return 'spine';
  }
  if (region === 'hip' || /hip bone|ilium|ischium|pubis|pelvis/i.test(name)) {
    return 'hip';
  }
  if (region === 'knee' || /patella/i.test(name)) {
    return 'knee';
  }
  if (region === 'femur' || /femur/i.test(name)) {
    return 'femur';
  }
  if (region === 'lower_leg' || /tibia|fibula/i.test(name)) {
    return 'lower_leg';
  }
  if (region === 'foot' || /foot|talus|calcaneus|metatarsal/i.test(name)) {
    return 'foot';
  }
  if (region === 'skull' || /skull|cranium|frontal|parietal|temporal|occipital|mandible|maxilla/i.test(name)) {
    return 'skull';
  }
  if (region === 'thorax' || /rib|sternum|costal/i.test(name)) {
    return 'thorax';
  }
  if (region === 'arm' || region === 'hand' || /humerus|radius|ulna|scapula|clavicle|carpal|finger/i.test(name)) {
    return 'arm';
  }
  return 'other';
}

// 3D Skeleton Model Component
function SkeletonMesh({ selectedJoint, onSelectPart }) {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const pointerDownPos = useRef({ x: 0, y: 0 });

  // Standard Realistic Ivory Bone PBR Material
  const defaultBoneMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ECE4D8'),
      roughness: 0.42,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
  }, []);

  // Luminous Glowing Pink/Purple Material for Selected Anatomical Region
  const highlightMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F0ABFC'),
      emissive: new THREE.Color('#C026D3'),
      emissiveIntensity: 0.95,
      roughness: 0.22,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
  }, []);

  // Soft Interactive Hover Material
  const hoverMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FCE7F3'),
      emissive: new THREE.Color('#E879F9'),
      emissiveIntensity: 0.35,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
  }, []);

  // Clone scene so materials can be safely mutated
  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  // Apply materials dynamically based on selectedJoint and hoveredRegion
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        const region = getBoneRegion(child);
        const isSelected = region === selectedJoint;
        const isHovered = region === hoveredRegion && !isSelected;

        if (isSelected) {
          child.material = highlightMaterial;
        } else if (isHovered && (region === 'spine' || region === 'hip' || region === 'knee')) {
          child.material = hoverMaterial;
        } else {
          child.material = defaultBoneMaterial;
        }
      }
    });
  }, [clonedScene, selectedJoint, hoveredRegion, highlightMaterial, hoverMaterial, defaultBoneMaterial]);

  // Frame loop: gentle pulse glow on highlighted bones
  useFrame((_, delta) => {
    if (highlightMaterial) {
      const time = performance.now() * 0.003;
      const pulse = Math.sin(time) * 0.25 + 0.85;
      highlightMaterial.emissiveIntensity = pulse;
    }
  });

  // Differentiate click from orbit drag
  const handlePointerDown = (e) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    if (Math.hypot(dx, dy) > 5) return;

    const region = getBoneRegion(e.object);
    if (onSelectPart) {
      onSelectPart(region, e.object);
    }
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const region = getBoneRegion(e.object);
    if (region === 'spine' || region === 'hip' || region === 'knee') {
      setHoveredRegion(region);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHoveredRegion(null);
    document.body.style.cursor = 'auto';
  };

  // Center of skeleton: Original center is Y ~ 0.858m.
  // Shifting Y by -0.858 centers the skeleton at [0, 0, 0] so it orbits naturally around lumbar spine.
  return (
    <group ref={groupRef} position={[0, -0.858, 0]}>
      <primitive
        object={clonedScene}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </group>
  );
}

// Loading Spinner Fallback
function SkeletonLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent pointer-events-none z-20">
      <div className="w-9 h-9 rounded-full border-2 border-[#8A2855] border-t-transparent animate-spin mb-3 shadow-xs" />
      <span className="text-[11px] font-mono tracking-widest text-[#8A2855] uppercase font-medium">
        Loading 3D Anatomy Skeleton...
      </span>
      <span className="text-[10px] text-stone-500 font-sans mt-0.5">
        Z-Anatomy • Complete Skeletal System
      </span>
    </div>
  );
}

// Smooth Cinematic Sequence Camera Rig:
// Glides continuously from part to part in a smooth, cinematic ease curve (NO cut scene!).
function CameraRig({ targetView, controlsRef }) {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(...REGION_VIEWS.default.position));
  const targetLookAt = useRef(new THREE.Vector3(...REGION_VIEWS.default.target));
  const isTransitioning = useRef(false);

  // When targetView changes, update target coordinates and begin smooth camera flight
  useEffect(() => {
    const view = REGION_VIEWS[targetView] || REGION_VIEWS.default;
    targetCamPos.current.set(...view.position);
    targetLookAt.current.set(...view.target);
    isTransitioning.current = true;

    // Temporarily disable OrbitControls to avoid fighting the smooth glide
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  }, [targetView, controlsRef]);

  // Silky smooth continuous sequence transition
  useFrame((_, delta) => {
    if (!isTransitioning.current) return;

    // Responsive exponential ease factor for continuous gliding motion
    const factor = 1 - Math.exp(-delta * 4.2);
    camera.position.lerp(targetCamPos.current, factor);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, factor);
      camera.lookAt(controlsRef.current.target);
    } else {
      camera.lookAt(targetLookAt.current);
    }

    const posDist = camera.position.distanceTo(targetCamPos.current);
    const lookDist = controlsRef.current
      ? controlsRef.current.target.distanceTo(targetLookAt.current)
      : 0;

    // Transition completed smoothly: hand back full control to OrbitControls
    if (posDist < 0.002 && lookDist < 0.002) {
      camera.position.copy(targetCamPos.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();
        controlsRef.current.enabled = true;
      }
      isTransitioning.current = false;
    }
  });

  return null;
}

export default function InteractiveSkeleton({
  selectedJoint = null,
  onSelectJoint,
}) {
  const controlsRef = useRef(null);
  const [activeZoomView, setActiveZoomView] = useState(selectedJoint || 'default');

  // When selectedJoint changes, smoothly glide the camera to that joint or back to default overview
  useEffect(() => {
    if (selectedJoint && REGION_VIEWS[selectedJoint]) {
      setActiveZoomView(selectedJoint);
    } else {
      setActiveZoomView('default');
    }
  }, [selectedJoint]);

  // Handle clicking directly on 3D skeleton parts to zoom and select
  const handleSelectPart = (region) => {
    if (region === 'spine' || region === 'hip' || region === 'knee') {
      if (onSelectJoint) onSelectJoint(region);
    } else {
      if (onSelectJoint) onSelectJoint(null);
    }
  };

  // Reset to full body view on double-click or background click
  const handleResetToFullView = () => {
    if (onSelectJoint) onSelectJoint(null);
    else setActiveZoomView('default');
  };

  // If user touches/drags canvas while transitioning, enable controls immediately
  const handlePointerDownContainer = () => {
    if (controlsRef.current && !controlsRef.current.enabled) {
      controlsRef.current.enabled = true;
    }
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none overflow-visible"
      onPointerDown={handlePointerDownContainer}
      onDoubleClick={handleResetToFullView}
    >
      <Suspense fallback={<SkeletonLoader />}>
        <Canvas
          dpr={[1, typeof window !== 'undefined' && window.innerWidth <= 800 ? 1.0 : 1.5]}
          camera={{
            position: [0, 0, 2.55], // Static initial overview position — prevents cutscene snapping on re-render!
            fov: 44,
            near: 0.05,
            far: 20,
          }}
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing overflow-visible"
          style={{ background: 'transparent' }}
          onPointerMissed={handleResetToFullView}
        >
          {/* Studio Lights */}
          <ambientLight intensity={1.2} color="#FFFBF5" />
          <directionalLight
            position={[3, 5, 4]}
            intensity={1.8}
            color="#FFF8F0"
          />
          <directionalLight
            position={[-3, 2, 3]}
            intensity={0.8}
            color="#F5F3FF"
          />
          <directionalLight
            position={[0, 4, -4]}
            intensity={1.1}
            color="#E0E7FF"
          />
          <pointLight
            position={[0, 0.5, 2.5]}
            intensity={0.4}
            color="#FFFFFF"
          />

          {/* Skeletal Model (100% Complete & Solid) */}
          <SkeletonMesh
            selectedJoint={selectedJoint}
            onSelectPart={handleSelectPart}
          />

          {/* Camera Controls: 3D rotation with smooth damping and page-safe scroll (zoom disabled) */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={(5 * Math.PI) / 6}
            enableDamping={true}
            dampingFactor={0.06}
          />

          {/* High-Precision Continuous Sequence Camera Rig */}
          <CameraRig targetView={activeZoomView} controlsRef={controlsRef} />
        </Canvas>
      </Suspense>
    </div>
  );
}
