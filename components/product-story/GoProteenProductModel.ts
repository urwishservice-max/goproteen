import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface ProductModelHandle {
  rootGroup: THREE.Group;
  wrapperMesh: THREE.Mesh | null;
  innerMesh: THREE.Mesh | null;
  dispose: () => void;
}

let cachedGltf: any = null;
let gltfPromise: Promise<any> | null = null;

function loadSharedGLTF(): Promise<any> {
  if (cachedGltf) return Promise.resolve(cachedGltf);
  if (gltfPromise) return gltfPromise;

  gltfPromise = new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(
      '/models/GoProTeen_model.glb',
      (gltf) => {
        cachedGltf = gltf;
        resolve(gltf);
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

  // Procedural Fallback Mesh (visible until GLTF finishes)
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
  rootGroup.add(procGroup);

  let wrapperMesh: THREE.Mesh | null = null;
  let innerMesh: THREE.Mesh | null = null;
  let isDisposed = false;

  loadSharedGLTF().then((gltf) => {
    if (isDisposed) return;
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (
            child.name.includes('Wrapper') ||
            child.material?.name?.includes('Print') ||
            child.name === 'GoProTeen_Main_Wrapper'
          ) {
            wrapperMesh = child;
          } else if (
            child.name.includes('Bar') ||
            child.material?.name?.includes('Chocolate') ||
            child.name === 'GoProTeen_Inner_Chocolate_Bar'
          ) {
            innerMesh = child;
          }
        }
      });

      const scaleFactor = 17.0;

      if (wrapperMesh) {
        (wrapperMesh as THREE.Mesh).scale.setScalar(scaleFactor);
        const wMat = (wrapperMesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (wMat) {
          wMat.roughness = 0.26;
          wMat.metalness = 0.04;
          wMat.envMapIntensity = 1.3;
          wMat.needsUpdate = true;
        }
        rootGroup.add(wrapperMesh);
      }

      if (innerMesh) {
        (innerMesh as THREE.Mesh).scale.setScalar(scaleFactor);
        const bMat = (innerMesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (bMat) {
          bMat.bumpMap = bumpMap;
          bMat.bumpScale = 1.2;
          bMat.roughness = 0.38;
          bMat.envMapIntensity = 0.8;
          bMat.needsUpdate = true;
        }
        rootGroup.add(innerMesh);
      }

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
