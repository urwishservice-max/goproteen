'use client';

import React, { useEffect } from 'react';
import { PersistentCanvasHandle } from './GoProteenPersistentCanvas';
import { PRODUCT_POSES, interpolatePoses } from './ProductScrollPoses';

const SECTION_WAYPOINTS = [
  { id: 'story-hero', poseKey: 'hero' },
  { id: 'story-problem', poseKey: 'problem' },
  { id: 'story-breakthrough', poseKey: 'breakthrough' },
  { id: 'story-protein-advantage', poseKey: 'proteinAdvantage' },
  { id: 'story-stomach', poseKey: 'stomachComfort' },
  { id: 'story-benefit-1', poseKey: 'benefit1' },
  { id: 'story-benefit-2', poseKey: 'benefit2' },
  { id: 'story-benefit-3', poseKey: 'benefit3' },
  { id: 'story-benefit-4', poseKey: 'benefit4' },
  { id: 'story-benefit-5', poseKey: 'benefit5' },
  { id: 'story-finale', poseKey: 'finale' },
];

interface ProductScrollControllerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  canvasHandleRef: React.RefObject<PersistentCanvasHandle>;
  children: React.ReactNode;
}

export default function ProductScrollController({
  containerRef,
  canvasHandleRef,
  children,
}: ProductScrollControllerProps) {
  useEffect(() => {
    const handleScroll = () => {
      if (!canvasHandleRef.current) return;

      const vCenter = window.innerHeight * 0.5;

      // Collect current vertical center for all waypoints
      const centers: { poseKey: string; center: number }[] = [];
      for (let i = 0; i < SECTION_WAYPOINTS.length; i++) {
        const el = document.getElementById(SECTION_WAYPOINTS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          centers.push({
            poseKey: SECTION_WAYPOINTS[i].poseKey,
            center: rect.top + rect.height * 0.5,
          });
        }
      }

      if (centers.length === 0) return;

      // If above the first section's center
      if (vCenter <= centers[0].center) {
        canvasHandleRef.current.setTargetPose(PRODUCT_POSES[centers[0].poseKey]);
        return;
      }

      // If below the last section's center
      const last = centers[centers.length - 1];
      if (vCenter >= last.center) {
        canvasHandleRef.current.setTargetPose(PRODUCT_POSES[last.poseKey]);
        return;
      }

      // Find the two sections that bracket the viewport center
      for (let i = 0; i < centers.length - 1; i++) {
        const c1 = centers[i].center;
        const c2 = centers[i + 1].center;

        if (vCenter >= c1 && vCenter <= c2) {
          const distance = c2 - c1;
          const fraction = distance > 0 ? (vCenter - c1) / distance : 0;
          const p1 = PRODUCT_POSES[centers[i].poseKey];
          const p2 = PRODUCT_POSES[centers[i + 1].poseKey];

          const targetPose = interpolatePoses(p1, p2, Math.max(0, Math.min(1, fraction)));
          canvasHandleRef.current.setTargetPose(targetPose);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [canvasHandleRef]);

  return <>{children}</>;
}
