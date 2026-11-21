'use client';

import React from 'react';
import ProductHeroSection from './ProductHeroSection';
import ProblemSection from './ProblemSection';
import BreakthroughSection from './BreakthroughSection';
import ProteinAdvantageSection from './ProteinAdvantageSection';
import StomachComfortSection from './StomachComfortSection';
import BenefitSection from './BenefitSection';
import ProductFinaleSection from './ProductFinaleSection';

export {
  ProductHeroSection,
  ProblemSection,
  BreakthroughSection,
  ProteinAdvantageSection,
  StomachComfortSection,
  BenefitSection,
  ProductFinaleSection,
};

export default function ProductStoryFlow() {
  return (
    <div className="relative w-full bg-[#FDFBF7] text-[#14091F] font-sans">
      {/* 01: Hero */}
      <ProductHeroSection />

      {/* 02: The Problem */}
      <ProblemSection />

      {/* 03: The Breakthrough */}
      <BreakthroughSection />

      {/* 04: The Protein Advantage */}
      <ProteinAdvantageSection />

      {/* 05: Light on the Stomach */}
      <StomachComfortSection />

      {/* 06: Everyday Benefits (5 distinct vertical moments) */}
      <BenefitSection />

      {/* 07: Product Finale */}
      <ProductFinaleSection />
    </div>
  );
}
