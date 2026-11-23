'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  Layers,
  Atom,
  Waves,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';

const InteractiveFemur = dynamic(() => import('./InteractiveFemur'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center bg-transparent">
      <div className="w-8 h-8 rounded-full border-2 border-[#8A2855] border-t-transparent animate-spin mb-2" />
      <span className="text-[10px] font-mono tracking-widest text-[#8A2855] uppercase font-medium">
        Loading 3D Cutaway Femur...
      </span>
    </div>
  ),
});

export default function BoneStructureExplorer({
  onSelectTab,
  activeTab: externalActiveTab,
  onPrev,
  onNext,
  isEmbedded = false,
}) {
  // Tabs: 'layers' | 'mineral' | 'collagen' | 'renewal'
  const [internalTab, setInternalTab] = useState('layers');
  const activeTab = externalActiveTab || internalTab;

  // Age-based 3D Bone Density Transformation State (Range: 30 to 60, default 30)
  const [femurAge, setFemurAge] = useState(30);

  const handleSelectTab = (tab) => {
    setInternalTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  // Bone Layers Interactive State
  const [activeCallout, setActiveCallout] = useState('trabecular'); // 'cortical' | 'trabecular'
  const [splitPos, setSplitPos] = useState(50); // Split percentage (0-100)
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const splitContainerRef = useRef(null);

  // 1% Card Interactive Timeline Drawer
  const [showTimeline, setShowTimeline] = useState(false);
  const [simulatedAge, setSimulatedAge] = useState(50);

  // Mineral Matrix Interactive State (for 'mineral' tab)
  const [mineralElement, setMineralElement] = useState('amino'); // 'amino' | 'collagen' | 'calcium'
  const [isMineralLocked, setIsMineralLocked] = useState(false);

  // Collagen Framework Interactive State (for 'collagen' tab)
  const [tensileTension, setTensileTension] = useState(40); // 0-100% tension

  // Split Drag Handlers
  const handleSplitMove = (clientX) => {
    if (!splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(6, Math.min(94, (x / rect.width) * 100));
    setSplitPos(pct);
  };

  useEffect(() => {
    const onPointerMove = (e) => {
      if (isDraggingSplit) {
        handleSplitMove(e.clientX);
      }
    };
    const onPointerUp = () => {
      setIsDraggingSplit(false);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [isDraggingSplit]);

  // Tab Order for Bottom Navigation
  const TABS_ORDER = ['layers', 'mineral', 'collagen', 'renewal'];

  const handlePrevStep = () => {
    const currentIndex = TABS_ORDER.indexOf(activeTab);
    if (currentIndex > 0) {
      handleSelectTab(TABS_ORDER[currentIndex - 1]);
    } else if (onPrev) {
      onPrev();
    }
  };

  const handleNextStep = () => {
    const currentIndex = TABS_ORDER.indexOf(activeTab);
    if (currentIndex < TABS_ORDER.length - 1) {
      handleSelectTab(TABS_ORDER[currentIndex + 1]);
    } else if (onNext) {
      onNext();
    } else {
      const el = document.getElementById('crash');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const mainGrid = (
    <div className="w-full max-w-[1400px] mx-auto my-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center z-10 py-1 overflow-hidden">
        {/* Left Column: Headline, Subtitle, 1% Interactive Card */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-3">
          <div>
            <h2
              className="text-3xl sm:text-4xl lg:text-[44px] font-light text-[#2A0E3D] tracking-tight leading-[1.02]"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Bone
              <br />
              <span
                style={{
                  background: 'linear-gradient(180deg, #371B48 0%, #8A2855 55%, #CF4842 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                  fontWeight: 400,
                }}
              >
                Structure
              </span>
            </h2>

            <p className="text-xs text-stone-600 font-light leading-relaxed mt-2 max-w-xs">
              Your physical frame, feeling just a little less sturdy than it used to... quietly shifting, day by day.
            </p>
          </div>

          {/* Age-Based 3D Bone Density Transformation Control - Seamless transparent background ("like nothing") */}
          <div className="space-y-4 max-w-[320px]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-wider text-[#8A2855] font-bold uppercase">
                ESTIMATED BONE DENSITY CHANGE
              </span>
              <span className="text-[10px] font-mono text-stone-500 font-medium">
                Age 30–60
              </span>
            </div>

            {/* Stepper with Minus / Age / Plus Controls */}
            <div className="flex items-center justify-between py-1">
              <button
                type="button"
                onClick={() => setFemurAge((prev) => Math.max(30, prev - 1))}
                disabled={femurAge <= 30}
                aria-label="Decrease Age"
                className="w-9 h-9 rounded-lg bg-stone-100/90 border border-stone-200/90 flex items-center justify-center text-[#2A0E3D] font-bold text-lg hover:bg-stone-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all shadow-2xs"
              >
                −
              </button>

              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-[#2A0E3D] tracking-tight">
                    {femurAge}
                  </span>
                  <span className="text-xs font-medium text-stone-500">years</span>
                </div>
                <span className="text-[9px] font-mono font-semibold text-[#8A2855]">
                  {Math.round(100 - (femurAge - 30) * 1.0)}% Estimated Volume
                </span>
              </div>

              <button
                type="button"
                onClick={() => setFemurAge((prev) => Math.min(60, prev + 1))}
                disabled={femurAge >= 60}
                aria-label="Increase Age"
                className="w-9 h-9 rounded-lg bg-stone-100/90 border border-stone-200/90 flex items-center justify-center text-[#2A0E3D] font-bold text-lg hover:bg-stone-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all shadow-2xs"
              >
                +
              </button>
            </div>

            {/* Smooth Continuous Slider */}
            <div className="space-y-1.5">
              <input
                type="range"
                min="30"
                max="60"
                value={femurAge}
                onChange={(e) => setFemurAge(Number(e.target.value))}
                className="w-full accent-[#8A2855] cursor-pointer h-1.5 bg-stone-200/90 rounded-lg"
              />
              <div className="flex justify-between text-[9px] font-mono text-stone-400">
                <button
                  type="button"
                  onClick={() => setFemurAge(30)}
                  className={`cursor-pointer hover:text-[#8A2855] ${femurAge === 30 ? 'font-bold text-[#8A2855]' : ''}`}
                >
                  Age 30
                </button>
                <button
                  type="button"
                  onClick={() => setFemurAge(40)}
                  className={`cursor-pointer hover:text-[#8A2855] ${femurAge === 40 ? 'font-bold text-[#8A2855]' : ''}`}
                >
                  Age 40
                </button>
                <button
                  type="button"
                  onClick={() => setFemurAge(50)}
                  className={`cursor-pointer hover:text-[#8A2855] ${femurAge === 50 ? 'font-bold text-[#8A2855]' : ''}`}
                >
                  Age 50
                </button>
                <button
                  type="button"
                  onClick={() => setFemurAge(60)}
                  className={`cursor-pointer hover:text-[#8A2855] ${femurAge === 60 ? 'font-bold text-[#8A2855]' : ''}`}
                >
                  Age 60
                </button>
              </div>
            </div>

            {/* Visual Feedback Indicator State - Clean floating status without box container */}
            <div className="pt-2 space-y-1 border-t border-stone-200/50">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    femurAge < 36
                      ? 'bg-emerald-500'
                      : femurAge < 50
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
                <span className="text-xs font-bold text-[#2A0E3D] font-mono">
                  {femurAge < 36
                    ? 'Dense structure'
                    : femurAge < 50
                    ? 'Moderately porous structure'
                    : 'Increased porosity'}
                </span>
              </div>
              <p className="text-[10px] text-stone-600 font-light leading-relaxed">
                {femurAge < 36
                  ? 'Dense trabecular structure with thick interconnected internal supports.'
                  : femurAge < 50
                  ? 'Slightly thinner trabeculae and larger internal spaces.'
                  : femurAge >= 58
                  ? 'More pronounced porosity and reduced internal bone volume.'
                  : 'Clearly reduced internal trabecular thickness and increased porosity.'}
              </p>
            </div>

            <p className="text-[8.5px] text-stone-400 font-sans italic leading-tight pt-0.5">
              Treat these as illustrative states, not medically validated individual predictions.
            </p>
          </div>
        </div>

        {/* Center/Right Column: DYNAMIC INTERACTIVE STAGE BASED ON TAB */}
        <div className="lg:col-span-8 relative flex flex-col items-center justify-center overflow-visible">
          {/* TAB 1: BONE LAYERS (Large 3D Cutaway Femur Bone with Dynamic Age Deformation) */}
          {activeTab === 'layers' && (
            <div className="relative w-full h-[260px] sm:h-[360px] lg:h-[540px] xl:h-[580px] max-h-[72vh] flex items-center justify-center overflow-visible my-2 lg:my-0">
              {/* Interactive 3D Femur with Real-time 3D Trabecular Deformation */}
              <div className="w-full h-full relative overflow-visible">
                <InteractiveFemur age={femurAge} />
              </div>

              {/* Callout Indicator 1: Cortical Bone (Top Left) */}
              <div className="absolute top-4 left-2 pointer-events-none z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-white shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#E05275] shadow-2xs" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#14091F] tracking-tight">
                    Cortical Bone
                  </span>
                  <span className="text-[8px] text-stone-500 font-sans">
                    Dense outer compact shell
                  </span>
                </div>
              </div>

              {/* Callout Indicator 2: Trabecular Bone (Center Right) */}
              <div className="absolute bottom-12 right-2 pointer-events-none z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-white shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#8A2855] shadow-2xs" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#14091F] tracking-tight">
                    Trabecular Bone
                  </span>
                  <span className="text-[8px] text-stone-500 font-sans">
                    Spongy honeycomb lattice
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MINERAL MATRIX (Amino Acid Framework & Calcium-Phosphate Deposition) */}
          {activeTab === 'mineral' && (
            <div className="w-full max-w-[450px] rounded-2xl bg-white/85 backdrop-blur-md border border-white p-4 shadow-lg flex flex-col space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                    <Atom className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#14091F]">
                      Microscopic Mineral Matrix
                    </h4>
                    <p className="text-[10px] text-stone-500">
                      Collagen Framework &amp; Hydroxyapatite
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMineralLocked(!isMineralLocked)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold transition-all cursor-pointer shadow-xs ${
                    isMineralLocked
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-rose-500 text-white hover:opacity-95'
                  }`}
                >
                  {isMineralLocked ? '✓ Locked' : '▶ Animate Lock'}
                </button>
              </div>

              {/* 3 Interactive Microscopic Elements */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMineralElement('amino')}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                    mineralElement === 'amino'
                      ? 'bg-rose-50 border border-rose-300 shadow-2xs scale-102'
                      : 'bg-white/70 hover:bg-white border border-stone-200/60'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-[10px]">
                    AA
                  </span>
                  <span className="text-[10px] font-bold text-[#14091F]">Amino Acids</span>
                  <span className="text-[8px] text-stone-500">Building Blocks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMineralElement('collagen')}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                    mineralElement === 'collagen'
                      ? 'bg-rose-50 border border-rose-300 shadow-2xs scale-102'
                      : 'bg-white/70 hover:bg-white border border-stone-200/60'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-[10px]">
                    <Waves className="w-3 h-3" />
                  </span>
                  <span className="text-[10px] font-bold text-[#14091F]">Collagen</span>
                  <span className="text-[8px] text-stone-500">Tensile Scaffold</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMineralElement('calcium')}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                    mineralElement === 'calcium'
                      ? 'bg-rose-50 border border-rose-300 shadow-2xs scale-102'
                      : 'bg-white/70 hover:bg-white border border-stone-200/60'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-[10px]">
                    Ca²⁺
                  </span>
                  <span className="text-[10px] font-bold text-[#14091F]">Calcium Phos.</span>
                  <span className="text-[8px] text-stone-500">Rigid Minerals</span>
                </button>
              </div>

              {/* Explanatory Dynamic Card */}
              <div className="p-2.5 rounded-xl bg-white/90 border border-stone-200/70 text-[11px] text-stone-600 leading-relaxed space-y-1">
                {mineralElement === 'amino' && (
                  <p>
                    <strong className="text-[#14091F]">Complete Amino Acids:</strong> Amino acids form the structural polypeptide chains required to synthesize collagen. Without complete protein, the mineral cage cannot form.
                  </p>
                )}
                {mineralElement === 'collagen' && (
                  <p>
                    <strong className="text-[#14091F]">Collagen Triple-Helix:</strong> Accounts for 90% of bone organic matrix, acting like steel rebar inside concrete to provide tensile flexibility.
                  </p>
                )}
                {mineralElement === 'calcium' && (
                  <p>
                    <strong className="text-[#14091F]">Hydroxyapatite Crystals:</strong> Calcium-phosphate deposits along collagen strands, providing compressive hardness and load-bearing strength.
                  </p>
                )}
              </div>

              {/* Animated Matrix Simulation Graphic */}
              <div className="relative h-20 w-full rounded-xl bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 border border-stone-200/70 flex items-center justify-around px-3 overflow-hidden">
                <div className="flex flex-col items-center gap-0.5 z-10">
                  <div className="w-8 h-8 rounded-full bg-white shadow-2xs flex items-center justify-center text-rose-500 font-bold text-[10px]">
                    AA
                  </div>
                  <span className="text-[8px] font-mono text-stone-500">Amino Lock</span>
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-rose-400 to-purple-400 mx-2" />
                <div className="flex flex-col items-center gap-0.5 z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[10px] shadow-xs transition-all duration-500 ${
                      isMineralLocked
                        ? 'bg-emerald-500 text-white scale-105 ring-2 ring-emerald-200'
                        : 'bg-white text-purple-700'
                    }`}
                  >
                    {isMineralLocked ? 'Locked' : 'Scaffold'}
                  </div>
                  <span className="text-[8px] font-mono text-stone-500">Collagen Base</span>
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-400 to-amber-400 mx-2" />
                <div className="flex flex-col items-center gap-0.5 z-10">
                  <div className="w-8 h-8 rounded-full bg-white shadow-2xs flex items-center justify-center text-amber-600 font-bold text-[10px]">
                    CaP
                  </div>
                  <span className="text-[8px] font-mono text-stone-500">Minerals</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COLLAGEN FRAMEWORK (Tensile Flexibility & Stretch Simulation) */}
          {activeTab === 'collagen' && (
            <div className="w-full max-w-[450px] rounded-2xl bg-white/85 backdrop-blur-md border border-white p-4 shadow-lg flex flex-col space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
                    <Waves className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#14091F]">
                      Collagen Framework Explorer
                    </h4>
                    <p className="text-[10px] text-stone-500">
                      Triple-Helix Elastic Resilience
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-[9px] font-mono font-bold">
                  Tension: {tensileTension}%
                </span>
              </div>

              {/* Tensile Stretch Interactive Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-[#14091F]">
                  <span>Tensile Load Simulator</span>
                  <span className="text-pink-600 font-mono text-[10px]">
                    {tensileTension < 50 ? 'Flexible Elastic Zone' : 'High Tensile Resistance'}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={tensileTension}
                  onChange={(e) => setTensileTension(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
                />
                <div className="flex justify-between text-[8px] font-mono text-stone-400">
                  <span>Relaxed Fiber</span>
                  <span>Normal Load</span>
                  <span>Peak Impact Resistance</span>
                </div>
              </div>

              {/* Visual Collagen Strand Flex Graphic */}
              <div className="relative h-24 w-full rounded-xl bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 border border-stone-200/70 flex items-center justify-center px-3 overflow-hidden">
                <svg
                  className="w-full h-20 overflow-visible"
                  viewBox="0 0 400 80"
                  preserveAspectRatio="none"
                >
                  <path
                    d={`M 10 40 Q 100 ${40 - tensileTension * 0.3} 200 40 T 390 40`}
                    fill="none"
                    stroke="#F472B6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M 10 40 Q 100 ${40 + tensileTension * 0.3} 200 40 T 390 40`}
                    fill="none"
                    stroke="#C084FC"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M 10 40 Q 100 40 200 ${40 - tensileTension * 0.2} T 390 40`}
                    fill="none"
                    stroke="#FB7185"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                Collagen fibers provide tensile flexibility. While calcium makes bone hard, complete protein-derived collagen prevents it from being brittle.
              </p>
            </div>
          )}

          {/* TAB 4: RENEWAL CYCLE (Living Cellular Remodeling Dynamics) */}
          {activeTab === 'renewal' && (
            <div className="w-full max-w-[450px] rounded-2xl bg-white/85 backdrop-blur-md border border-white p-4 shadow-lg flex flex-col space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#14091F]">
                      Bone Renewal Cycle
                    </h4>
                    <p className="text-[10px] text-stone-500">
                      Osteoblasts &amp; Osteoclasts Remodeling
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold">
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>Living Cells</span>
                </div>
              </div>

              {/* 3 Remodeling Cellular Modes */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-white/90 border border-rose-200 flex flex-col items-center gap-0.5 text-center">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[9px]">
                    OB
                  </span>
                  <span className="text-[10px] font-bold text-[#14091F]">Osteoblasts</span>
                  <span className="text-[8px] text-stone-500">Formation</span>
                </div>

                <div className="p-2 rounded-xl bg-white/90 border border-amber-200 flex flex-col items-center gap-0.5 text-center">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[9px]">
                    OC
                  </span>
                  <span className="text-[10px] font-bold text-[#14091F]">Osteoclasts</span>
                  <span className="text-[8px] text-stone-500">Resorption</span>
                </div>

                <div className="p-2 rounded-xl bg-white/90 border border-purple-200 flex flex-col items-center gap-0.5 text-center">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[9px]">
                    EQ
                  </span>
                  <span className="text-[10px] font-bold text-[#14091F]">Balance</span>
                  <span className="text-[8px] text-stone-500">10-Yr Cycle</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
                Every 10 years, your skeleton is completely replaced. After middle age, resorption outpaces formation by ~1% each year without targeted protein matrix support.
              </div>
            </div>
          )}
        </div>
      </div>
  );

  if (isEmbedded) {
    return mainGrid;
  }

  return (
    <div className="relative w-full h-screen max-h-screen min-h-screen flex flex-col justify-between pt-14 pb-2 sm:pb-3 px-4 sm:px-8 lg:px-12 select-none overflow-hidden bg-transparent">
      {mainGrid}

      {/* Bottom Timeline Stepper Bar (Matching exactly with all pages of Section 03) */}
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between pt-2 pb-1.5 border-t border-stone-200/50 z-20 select-none">
        {/* Left: Indicator Bar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevStep}
            className="w-10 h-10 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-all active:scale-95 cursor-pointer"
            title="Previous (Feel the Change)"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Center: 4-Step Interactive Timeline Stepper */}
        <div className="relative flex items-center gap-8 sm:gap-14">
          {/* Subtle connecting horizontal line */}
          <div className="absolute top-[9px] left-3 right-3 h-[2px] bg-gradient-to-r from-[#A855F7] via-[#F472B6]/60 to-stone-200 -z-0" />

          {[
            { id: 'feel', label: 'Feel the Change', stepIdx: 0 },
            { id: 'layers', label: 'Bone Structure', stepIdx: 1 },
            { id: 'matrix', label: 'Mineral Matrix', stepIdx: 2 },
            { id: 'renewal', label: 'Bone Remodeling', stepIdx: 3 },
          ].map((st) => {
            const isActive = st.stepIdx === 1;

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  if (st.stepIdx === 0 && onPrev) onPrev();
                  else if (st.stepIdx === 2) handleSelectTab('mineral');
                  else if (st.stepIdx === 3) handleSelectTab('renewal');
                }}
                className="relative flex flex-col items-center gap-1.5 z-10 cursor-pointer group focus:outline-none"
              >
                {/* Step Node Dot */}
                <div className="w-5 h-5 flex items-center justify-center">
                  {isActive ? (
                    <div className="w-5 h-5 rounded-full bg-[#231535] ring-4 ring-[#EADCF8] shadow-sm flex items-center justify-center scale-110">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-stone-300 group-hover:border-stone-500 transition-colors" />
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`text-[11px] sm:text-xs font-mono tracking-wider transition-colors duration-200 ${
                    isActive ? 'font-bold text-[#14091F]' : 'text-[#5D5066] group-hover:text-[#14091F]'
                  }`}
                >
                  {st.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Stepper Buttons */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleNextStep}
            className="w-10 h-10 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-all active:scale-95 cursor-pointer"
            title="Next step"
            aria-label="Next step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
