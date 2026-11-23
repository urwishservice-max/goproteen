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
  // Section 01 — Hero: Clean 3D commercial product angle with visible front face and depth
  hero: {
    x: 0.0,
    y: -0.14,
    z: 0.55,
    rotX: 0.08,   // subtle 4.5° forward tilt keeping front packaging typography perfectly upright and clear
    rotY: -0.12,  // subtle 3/4 angle showing elegant length and perspective depth
    rotZ: 0.0,    // balanced horizontal alignment
    scale: 1.05,
  },

  // Section 02 — Problem: Text on left (cols 1-6), model on right (cols 7-12)
  problem: {
    x: 1.45,
    y: 0.0,
    z: 0.35,
    rotX: 0.06,   // pristine, upright angle with no awkward pitch or protrusion
    rotY: 0.12,   // gentle 3/4 depth
    rotZ: 0.02,   // slight elegant tilt
    scale: 0.90,
  },

  // Section 03 — Breakthrough: Model on left (cols 1-6), text on right (cols 7-12)
  breakthrough: {
    x: -1.45,
    y: 0.0,
    z: 0.35,
    rotX: 0.06,
    rotY: -0.12,
    rotZ: -0.02,
    scale: 0.90,
  },

  // Section 04 — Protein Advantage: Text on left, model on right (zoomed front wrapper)
  proteinAdvantage: {
    x: 1.45,
    y: 0.0,
    z: 0.40,
    rotX: 0.06,
    rotY: 0.10,
    rotZ: 0.01,
    scale: 0.92,
  },

  // Section 05 — Light on the Stomach: Centered between top heading and bottom subtext
  stomachComfort: {
    x: 0.0,
    y: -0.06,
    z: 0.45,
    rotX: 0.05,
    rotY: 0.0,
    rotZ: 0.0,
    scale: 0.95,
  },

  // Section 06 — Benefit 01: Text on left, model on right
  benefit1: {
    x: 1.45,
    y: 0.0,
    z: 0.35,
    rotX: 0.06,
    rotY: 0.12,
    rotZ: 0.02,
    scale: 0.88,
  },

  // Section 06 — Benefit 02: Model on left, text on right
  benefit2: {
    x: -1.45,
    y: 0.02,
    z: 0.35,
    rotX: 0.06,
    rotY: -0.12,
    rotZ: -0.02,
    scale: 0.88,
  },

  // Section 06 — Benefit 03: Text on left, model on right (higher Y position)
  benefit3: {
    x: 1.45,
    y: 0.10,
    z: 0.35,
    rotX: 0.06,
    rotY: 0.12,
    rotZ: 0.02,
    scale: 0.88,
  },

  // Section 06 — Benefit 04: Model on left (lower Y position), text on right
  benefit4: {
    x: -1.45,
    y: -0.10,
    z: 0.35,
    rotX: 0.06,
    rotY: -0.12,
    rotZ: -0.02,
    scale: 0.88,
  },

  // Section 06 — Benefit 05: Text centered above, model centered below
  benefit5: {
    x: 0.0,
    y: -0.20,
    z: 0.45,
    rotX: 0.06,
    rotY: 0.0,
    rotZ: 0.0,
    scale: 0.94,
  },

  // Final Section — Meet GoProteen: Centered, prominent 3D hero presentation
  finale: {
    x: 0.0,
    y: -0.10,
    z: 0.52,
    rotX: 0.08,
    rotY: -0.10,
    rotZ: 0.0,
    scale: 1.05,
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
