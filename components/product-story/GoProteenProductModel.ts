import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface ProductModelHandle {
  rootGroup: THREE.Group;
  wrapperMesh: THREE.Mesh | null;
  innerMesh: THREE.Object3D | null;
  dispose: () => void;
}

let masterScene: THREE.Group | null = null;
let gltfPromise: Promise<THREE.Group | null> | null = null;

function loadSharedScene(): Promise<THREE.Group | null> {
  if (masterScene) return Promise.resolve(masterScene);
  if (gltfPromise) return gltfPromise;

  gltfPromise = new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/models/GoProTeen_model.glb',
      (gltf) => {
        masterScene = gltf.scene;
        resolve(gltf.scene);
      },
      undefined,
      (err) => {
        console.warn('GLTF load warning, using procedural fallback:', err);
        resolve(null);
      }
    );
  });

  return gltfPromise;
}

export function createGoProteenProductModel(
  scene: THREE.Scene,
  onLoaded?: () => void
): ProductModelHandle {
  const rootGroup = new THREE.Group();
  rootGroup.rotation.order = 'YXZ';
  scene.add(rootGroup);

  // Bump texture for chocolate core
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

  // Procedural Fallback Mesh (guaranteed to render immediately so 3D model is NEVER missing)
  const procGroup = new THREE.Group();
  const chocMat = new THREE.MeshStandardMaterial({
    color: 0x3b1d12,
    roughness: 0.38,
    metalness: 0.05,
    bumpMap,
    bumpScale: 1.2,
  });
  const procCore = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 0.45), chocMat);
  procGroup.add(procCore);

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
  const procWrap = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.23, 0.47), wrapMat);
  procGroup.add(procWrap);
  rootGroup.add(procGroup);

  let wrapperMesh: THREE.Mesh | null = null;
  let innerMesh: THREE.Object3D | null = null;
  let isDisposed = false;

  loadSharedScene().then((master) => {
    if (isDisposed) return;
    if (master) {
      // CLONE the master scene so cached master nodes are NEVER reparented or stripped!
      const sceneClone = master.clone(true);

      // Scale the entire cloned model consistently
      const scaleFactor = 10.5;
      sceneClone.scale.setScalar(scaleFactor);

      // Enhance all meshes in the scene
      sceneClone.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          const mName = child.material?.name || '';
          const oName = child.name || '';

          if (oName.includes('Wrapper') || mName.includes('Print')) {
            wrapperMesh = child;
            if (child.material) {
              const mat = child.material as THREE.MeshStandardMaterial;
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.roughness = 0.26;
              mat.metalness = 0.04;
              mat.envMapIntensity = 1.3;
              mat.needsUpdate = true;
            }
          } else if (
            oName.includes('CHOCOLATE_SHELL') ||
            mName.includes('CHOCOLATE')
          ) {
            if (child.material) {
              const mat = child.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.28;
              mat.metalness = 0.02;
              mat.envMapIntensity = 1.1;
              mat.needsUpdate = true;
            }
          } else if (oName.includes('PROTEIN') || mName.includes('PROTEIN')) {
            if (child.material) {
              const mat = child.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.65;
              mat.bumpMap = bumpMap;
              mat.bumpScale = 1.0;
              mat.needsUpdate = true;
            }
          }
        }
      });

      // Locate inside bar assembly
      innerMesh =
        sceneClone.getObjectByName('GP_EXPLODE_CONTROLLER') ||
        sceneClone.getObjectByName('GP_LAYER_CORE') ||
        sceneClone.getObjectByName('GP_PROTEIN_NUT_CORE');

      // The product story flow showcases the pristine packaged product:
      // Hide inner bar assembly so it never clips, protrudes, or shows through the wrapper
      if (innerMesh) {
        innerMesh.visible = false;
      }

      // Add complete high-fidelity model to root group
      rootGroup.add(sceneClone);

      // Hide procedural fallback geometry now that GLTF has loaded
      procGroup.visible = false;
    }

    if (onLoaded) onLoaded();
  });

  return {
    rootGroup,
    wrapperMesh,
    innerMesh,
    dispose: () => {
      isDisposed = true;
      bumpMap.dispose();
      wTex.dispose();
      chocMat.dispose();
      wrapMat.dispose();
      scene.remove(rootGroup);
    },
  };
}
