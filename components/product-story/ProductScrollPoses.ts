// 11 distinct waypoints for the persistent GoProteen 3D product model
// Calibrated to keep the model completely clear of editorial text
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
  // Section 01 — Hero: Horizontally centered, sleek scale, slow subtle rotation
  hero: {
    x: 0.0,
    y: -0.16,
    z: 0.5,
    rotX: 0.08,
    rotY: 0.12,
    rotZ: -0.04,
    scale: 0.95,
  },

  // Section 02 — Problem: Text on left (cols 1-6), model on right (cols 7-12)
  problem: {
    x: 1.45,
    y: 0.05,
    z: 0.3,
    rotX: -0.22,
    rotY: 0.35,
    rotZ: -0.18,
    scale: 0.82,
  },

  // Section 03 — Breakthrough: Model on left (cols 1-6), text on right (cols 7-12)
  breakthrough: {
    x: -1.45,
    y: 0.05,
    z: 0.35,
    rotX: 0.22,
    rotY: -0.28,
    rotZ: 0.55, // tilted towards vertical orientation
    scale: 0.85,
  },

  // Section 04 — Protein Advantage: Text on left, model on right (zoomed front wrapper)
  proteinAdvantage: {
    x: 1.45,
    y: 0.05,
    z: 0.45,
    rotX: -0.12,
    rotY: 0.2,
    rotZ: -0.14,
    scale: 0.88,
  },

  // Section 05 — Light on the Stomach: Centered between top heading and bottom subtext
  stomachComfort: {
    x: 0.0,
    y: -0.08,
    z: 0.45,
    rotX: 0.05,
    rotY: 0.02,
    rotZ: 0.01,
    scale: 0.9,
  },

  // Section 06 — Benefit 01: Text on left, model on right
  benefit1: {
    x: 1.45,
    y: 0.0,
    z: 0.35,
    rotX: 0.14,
    rotY: 0.3,
    rotZ: -0.1,
    scale: 0.82,
  },

  // Section 06 — Benefit 02: Model on left, text on right
  benefit2: {
    x: -1.45,
    y: 0.04,
    z: 0.35,
    rotX: -0.16,
    rotY: -0.25,
    rotZ: 0.12,
    scale: 0.82,
  },

  // Section 06 — Benefit 03: Text on left, model on right (higher Y position)
  benefit3: {
    x: 1.45,
    y: 0.18,
    z: 0.35,
    rotX: 0.2,
    rotY: 0.28,
    rotZ: -0.16,
    scale: 0.82,
  },

  // Section 06 — Benefit 04: Model on left (lower Y position), text on right
  benefit4: {
    x: -1.45,
    y: -0.18,
    z: 0.35,
    rotX: -0.14,
    rotY: 0.22,
    rotZ: 0.1,
    scale: 0.82,
  },

  // Section 06 — Benefit 05: Text centered above, model centered below
  benefit5: {
    x: 0.0,
    y: -0.25,
    z: 0.5,
    rotX: 0.05,
    rotY: 0.08,
    rotZ: 0.0,
    scale: 0.88,
  },

  // Final Section — Meet GoProteen: Centered, front-facing hero presentation
  finale: {
    x: 0.0,
    y: -0.12,
    z: 0.55,
    rotX: 0.02,
    rotY: 0.0,
    rotZ: 0.0,
    scale: 0.95,
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

// Helper to smoothly interpolate between two poses with smoothstep curve
export function interpolatePoses(p1: ProductPose, p2: ProductPose, t: number): ProductPose {
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
