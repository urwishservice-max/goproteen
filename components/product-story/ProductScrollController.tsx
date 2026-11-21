'use client';

import React, { useEffect, useRef } from 'react';
import { PersistentCanvasHandle } from './GoProteenPersistentCanvas';
import { PRODUCT_POSES, POSE_KEYS, interpolatePoses } from './ProductScrollPoses';

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
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!canvasHandleRef.current || !container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Section total height minus one viewport
      const totalScrollableDistance = rect.height - viewportHeight;
      if (totalScrollableDistance <= 0) return;

      // Current distance scrolled inside the product-story container
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollableDistance));

      // Map progress [0, 1] across the 11 poses
      const totalPoses = POSE_KEYS.length;
      const rawIndex = progress * (totalPoses - 1);
      const baseIndex = Math.min(Math.floor(rawIndex), totalPoses - 2);
      const fraction = rawIndex - baseIndex;

      const p1Key = POSE_KEYS[baseIndex];
      const p2Key = POSE_KEYS[baseIndex + 1];

      const p1 = PRODUCT_POSES[p1Key];
      const p2 = PRODUCT_POSES[p2Key];

      const nextTargetPose = interpolatePoses(p1, p2, fraction);
      canvasHandleRef.current.setTargetPose(nextTargetPose);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [containerRef, canvasHandleRef]);

  return <>{children}</>;
}
