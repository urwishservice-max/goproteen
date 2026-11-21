'use client';

import React from 'react';
import BoneFoundationExperience from '@/components/bone/BoneFoundationExperience';

export default function RemodelingTestPage() {
  return (
    <main className="w-full min-h-screen bg-[#FDFBF7]">
      <BoneFoundationExperience initialStep={3} />
    </main>
  );
}
