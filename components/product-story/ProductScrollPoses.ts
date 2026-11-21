// 11 distinct waypoints for the persistent GoProteen 3D product model
export interface ProductPose {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
}

export const PRODUCT_POSES: Record<string, ProductPose> = {
  // Section 01 — Hero: Large, horizontal, centre of the viewport, slow subtle rotation
  hero: {
    x: 0.0,
    y: -0.12,
    z: 0.6,
    rotX: 0.08,
    rotY: 0.12,
    rotZ: -0.04,
    scale: 1.25,
  },

  // Section 02 — Problem: Travel smoothly towards right, slightly up, rotate diagonally, reduce scale
  problem: {
    x: 1.05,
    y: 0.08,
    z: 0.25,
    rotX: -0.22,
    rotY: 0.36,
    rotZ: -0.2,
    scale: 1.08,
  },

  // Section 03 — Breakthrough: Travel from right to left, rotate towards vertical orientation, increase scale
  breakthrough: {
    x: -1.05,
    y: 0.06,
    z: 0.45,
    rotX: 0.22,
    rotY: -0.28,
    rotZ: 0.58, // tilted towards vertical orientation
    scale: 1.3,
  },

  // Section 04 — Protein Advantage: Travel towards centre/right, rotate to reveal front wrapper, zoom towards camera
  proteinAdvantage: {
    x: 0.95,
    y: 0.05,
    z: 0.72, // zoomed towards camera
    rotX: -0.12,
    rotY: 0.2,
    rotZ: -0.14,
    scale: 1.35,
  },

  // Section 05 — Light on the Stomach: Move towards lower-right, tilt gently, return towards central position
  stomachComfort: {
    x: 0.0,
    y: -0.18,
    z: 0.5,
    rotX: 0.05,
    rotY: 0.02,
    rotZ: 0.01,
    scale: 1.26,
  },

  // Section 06 — Benefit 01: Move to the right
  benefit1: {
    x: 1.08,
    y: 0.0,
    z: 0.35,
    rotX: 0.14,
    rotY: 0.3,
    rotZ: -0.1,
    scale: 1.16,
  },

  // Section 06 — Benefit 02: Move to the left
  benefit2: {
    x: -1.08,
    y: 0.04,
    z: 0.35,
    rotX: -0.16,
    rotY: -0.25,
    rotZ: 0.12,
    scale: 1.18,
  },

  // Section 06 — Benefit 03: Move upwards / centre-right
  benefit3: {
    x: 0.88,
    y: 0.32,
    z: 0.4,
    rotX: 0.2,
    rotY: 0.28,
    rotZ: -0.16,
    scale: 1.2,
  },

  // Section 06 — Benefit 04: Move downwards / centre-left
  benefit4: {
    x: -0.88,
    y: -0.28,
    z: 0.4,
    rotX: -0.14,
    rotY: 0.22,
    rotZ: 0.1,
    scale: 1.2,
  },

  // Section 06 — Benefit 05: Return towards the centre
  benefit5: {
    x: 0.0,
    y: -0.14,
    z: 0.65,
    rotX: 0.05,
    rotY: 0.08,
    rotZ: 0.0,
    scale: 1.32,
  },

  // Final Section — Meet GoProteen: Exact same model at centre, front-facing, large
  finale: {
    x: 0.0,
    y: -0.08,
    z: 0.72,
    rotX: 0.02,
    rotY: 0.0,
    rotZ: 0.0,
    scale: 1.38,
  },
};

export const POSE_KEYS = [
  'hero',
  'problem',
  'breakthrough',
  'proteinAdvantage',
  'stomachComfort',
  'benefit1',
  'benefit2',
  'benefit3',
  'benefit4',
  'benefit5',
  'finale',
];

// Helper to smoothly interpolate between two poses
export function interpolatePoses(p1: ProductPose, p2: ProductPose, t: number): ProductPose {
  // Smoothstep easing for silky acceleration and deceleration
  const ease = t * t * (3 - 2 * t);
  return {
    x: p1.x + (p2.x - p1.x) * ease,
    y: p1.y + (p2.y - p1.y) * ease,
    z: p1.z + (p2.z - p1.z) * ease,
    rotX: p1.rotX + (p2.rotX - p1.rotX) * ease,
    rotY: p1.rotY + (p2.rotY - p1.rotY) * ease,
    rotZ: p1.rotZ + (p2.rotZ - p1.rotZ) * ease,
    scale: p1.scale + (p2.scale - p1.scale) * ease,
  };
}
