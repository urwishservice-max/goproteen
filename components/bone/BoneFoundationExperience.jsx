'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import BoneStructureExplorer from './BoneStructureExplorer';
import CollagenExplorer from './CollagenExplorer';
import BoneRemodeling from './BoneRemodeling';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

const InteractiveSkeleton = dynamic(() => import('./InteractiveSkeleton'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center bg-transparent">
      <div className="w-9 h-9 rounded-full border-2 border-[#8A2855] border-t-transparent animate-spin mb-3 shadow-xs" />
      <span className="text-[11px] font-mono tracking-widest text-[#8A2855] uppercase font-medium">
        Loading 3D Anatomy Skeleton...
      </span>
      <span className="text-[10px] text-stone-500 font-sans mt-0.5">
        Z-Anatomy • Complete Skeletal System
      </span>
    </div>
  ),
});

const STEPS = [
  { id: 0, label: 'Feel the Change' },
  { id: 1, label: 'Bone Structure' },
  { id: 2, label: 'Mineral Matrix' },
  { id: 3, label: 'Bone Remodeling' },
];

const JOINTS_DATA = {
  knee: {
    id: 'knee',
    name: 'Knee',
    title: 'Knee Joint',
    icon: '/images/clean_icon_knee.png',
    desc: 'When bone strength and joint support begin to reduce, movements can feel stiffer, especially in the morning.',
    nodePos: { top: '61%', left: '49%' }, // Position on man_bed_knee image
    curveY: 320,
  },
  hip: {
    id: 'hip',
    name: 'Hip',
    title: 'Pelvis & Hip Joint',
    icon: '/images/clean_icon_hip.png',
    desc: 'The weight-bearing femoral head experiences micro-architectural thinning, causing hesitation and joint rigidity upon the first step out of bed.',
    nodePos: { top: '46%', left: '46%' },
    curveY: 260,
  },
  spine: {
    id: 'spine',
    name: 'Spine',
    title: 'Spinal Column',
    icon: '/images/clean_icon_spine.png',
    desc: 'Vertebral bone density decreases, causing intervertebral compression and morning spinal stiffness or posture slumping.',
    nodePos: { top: '30%', left: '45%' },
    curveY: 200,
  },
};

export default function BoneFoundationExperience({ initialStep = 0 }) {
  const [activeStep, setActiveStep] = useState(initialStep);

  // Support ?step=2 query param for direct navigation/previewing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get('step');
      if (stepParam !== null) {
        const s = parseInt(stepParam, 10);
        if (!isNaN(s) && s >= 0 && s < STEPS.length) {
          setActiveStep(s);
          setTimeout(() => {
            const sec = document.getElementById('bone-experience-section');
            if (sec) {
              sec.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
          }, 100);
        }
      }
    }
  }, []);
  // Default to null: starting state has NO selected parts
  const [selectedJoint, setSelectedJoint] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // 20-second auto-unselect timer
  const autoUnselectTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const [secondsRemaining, setSecondsRemaining] = useState(null);

  const handleSelectJoint = (jointId) => {
    // Clear any existing active timer
    if (autoUnselectTimerRef.current) {
      clearTimeout(autoUnselectTimerRef.current);
      autoUnselectTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (!jointId || jointId === selectedJoint) {
      // Toggle off / deselect back to starting state
      setSelectedJoint(null);
      setSecondsRemaining(null);
      return;
    }

    setSelectedJoint(jointId);
    setSecondsRemaining(20);

    let timeLeft = 20;
    countdownIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      } else {
        setSecondsRemaining(timeLeft);
      }
    }, 1000);

    // Automatically unselect after 20 seconds and smoothly return to starting state
    autoUnselectTimerRef.current = setTimeout(() => {
      setSelectedJoint(null);
      setSecondsRemaining(null);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }, 20000);
  };

  // Clean up timer on unmount or step change
  useEffect(() => {
    return () => {
      if (autoUnselectTimerRef.current) clearTimeout(autoUnselectTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [activeStep]);

  // Directly switch to target step without scroll-jacking
  const goToStep = (targetStep) => {
    setActiveStep(targetStep);
  };

  // Audio Narration
  const toggleNarration = () => {
    if (typeof window === 'undefined') return;
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        let text = '';
        if (activeStep === 0) {
          text =
            'Picture this... You step out of bed in the quiet of the morning... and feel that unfamiliar stiffness whispering through your joints. You look back at a recent photograph... and notice your posture, gently slumping.';
        } else if (activeStep === 1) {
          text =
            'Your physical frame, feeling just a little less sturdy than it used to... quietly shifting, day by day. Every year after middle age, your body quietly surrenders one percent of its bone density and systemic mineral matrix.';
        } else if (activeStep === 2) {
          text =
            'Without a complete amino acid framework to lock calcium into place... your internal structure accelerates its breakdown.';
        } else {
          text =
            'As you feel how important your frame really is... ask yourself: How strong and upright do you want to feel a decade from now?';
        }
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.92;
        utt.pitch = 0.98;
        utt.onend = () => setIsPlayingAudio(false);
        utt.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utt);
        setIsPlayingAudio(true);
      }
    }
  };

  const joint = selectedJoint ? JOINTS_DATA[selectedJoint] : null;

  return (
    <div
      id="bone-experience-section"
      className="relative w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between pt-6 sm:pt-10 lg:pt-12 pb-4 px-4 sm:px-8 lg:px-12 select-none overflow-visible lg:overflow-hidden bg-transparent z-10"
    >
      {/* Main Experience Stage */}
      <div className="w-full max-w-[1400px] mx-auto my-auto flex-1 flex flex-col justify-center z-10 py-1 overflow-visible">
        {/* Step 1: Feel the Change (Exact Mockup Layout: Left Headline + Center Hero + Joint Pills + Right Card) */}
        {activeStep === 0 && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
            {/* Left Column: Title, Story Narration Quote */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-3">
              <div>
                <h2
                  className="text-2xl sm:text-4xl lg:text-[42px] font-light text-[#2A0E3D] tracking-tight leading-[1.05]"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  The Fading<br />
                  <span className="font-normal text-[#371B48]">Foundation</span>
                </h2>

                <p className="text-sm sm:text-base text-[#371B48] font-light mt-1">
                  (1% Annual Mineral Loss)
                </p>
              </div>

              {/* Story Quote Block */}
              <div className="pt-1">
                <span className="text-xs sm:text-sm font-semibold text-[#14091F] italic block mb-1">
                  Picture this...
                </span>
                <div className="border-l-2 border-[#CF4842] pl-3 py-0.5 space-y-1.5">
                  <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed font-light">
                    You step out of bed in the quiet of the morning... and feel that{' '}
                    <strong className="text-[#8A2855] font-semibold">unfamiliar stiffness</strong>{' '}
                    whispering through your joints.
                  </p>
                  <p className="text-xs sm:text-[13px] text-stone-500 leading-relaxed font-light italic">
                    You look back at a recent photograph... and notice your posture, gently slumping.
                  </p>
                </div>
              </div>

              {/* Spoken Narration Toggle */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={toggleNarration}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-mono font-semibold text-[#14091F] border border-stone-200 shadow-2xs cursor-pointer transition-all active:scale-95"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      <span>PAUSE NARRATION</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-stone-600" />
                      <span>HEAR THE STORY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Center Column: Interactive 3D Z-Anatomy Skeleton (Fitted Cleanly without Off-Screen Clipping) */}
            <div className="lg:col-span-4 flex items-center justify-center relative w-full h-[280px] sm:h-[380px] lg:h-[540px] xl:h-[580px] max-h-[72vh] overflow-visible my-2 lg:my-0">
              <div className="w-full h-full relative">
                <InteractiveSkeleton
                  selectedJoint={selectedJoint}
                  onSelectJoint={handleSelectJoint}
                />
              </div>
            </div>

            {/* Middle Joint Pills & Right Side Editorial Panel */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
              {/* Responsive Stack of 3 Joint Selector Pills (No icons, clean minimal pills) */}
              <div className="flex flex-row flex-wrap sm:flex-col gap-2 shrink-0 z-20">
                {/* Spine Pill */}
                <button
                  type="button"
                  onClick={() => handleSelectJoint('spine')}
                  aria-label="Explore Spine"
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                    selectedJoint === 'spine'
                      ? 'bg-[#14091F] text-white shadow-sm'
                      : 'bg-white/80 hover:bg-white text-[#14091F] border border-[#E5DFD7]'
                  }`}
                >
                  Spine
                </button>

                {/* Hip Pill */}
                <button
                  type="button"
                  onClick={() => handleSelectJoint('hip')}
                  aria-label="Explore Hip"
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                    selectedJoint === 'hip'
                      ? 'bg-[#14091F] text-white shadow-sm'
                      : 'bg-white/80 hover:bg-white text-[#14091F] border border-[#E5DFD7]'
                  }`}
                >
                  Hip
                </button>

                {/* Knee Pill */}
                <button
                  type="button"
                  onClick={() => handleSelectJoint('knee')}
                  aria-label="Explore Knee"
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                    selectedJoint === 'knee'
                      ? 'bg-[#14091F] text-white shadow-sm'
                      : 'bg-white/80 hover:bg-white text-[#14091F] border border-[#E5DFD7]'
                  }`}
                >
                  Knee
                </button>
              </div>

              {/* Editorial Info (Clean, open layout without background boxes) */}
              {joint ? (
                <div className="space-y-1.5 flex-1 transition-all duration-300">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base sm:text-lg font-light text-[#14091F] tracking-tight">
                      {joint.title}
                    </h4>
                    {secondsRemaining !== null && (
                      <span className="text-[9px] font-mono text-[#8A7993]">
                        auto-resets {secondsRemaining}s
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5D5066] leading-relaxed font-light">
                    {joint.desc}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectJoint(null)}
                    className="text-[10px] font-mono uppercase tracking-wider text-[#9333EA] hover:underline cursor-pointer block pt-1"
                  >
                    ← Return to overview
                  </button>
                </div>
              ) : (
                /* Starting State: Clean text without cards or boxes */
                <div className="space-y-1.5 flex-1 transition-all duration-300">
                  <span className="font-mono text-[10px] tracking-widest text-[#8A7993] uppercase block">
                    Interactive Anatomy
                  </span>
                  <h4 className="text-base sm:text-lg font-light text-[#14091F] tracking-tight">
                    Key Joint Vulnerabilities
                  </h4>
                  <p className="text-xs text-[#5D5066] leading-relaxed font-light">
                    Select Spine, Hip, or Knee to inspect the primary areas where bone density decline causes morning stiffness.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Bone Structure (Cutaway Femur Architecture & Density Comparison) */}
        {activeStep === 1 && (
          <BoneStructureExplorer
            isEmbedded={true}
            onPrev={() => goToStep(0)}
            onNext={() => goToStep(2)}
            onSelectTab={(tab) => {
              if (tab === 'layers') goToStep(1);
              else if (tab === 'mineral' || tab === 'collagen') goToStep(2);
              else if (tab === 'renewal') goToStep(3);
            }}
          />
        )}

        {/* Step 3: Mineral Matrix (Collagen & Calcium Phosphate) */}
        {activeStep === 2 && (
          <CollagenExplorer
            onNext={() => goToStep(3)}
            onPrev={() => goToStep(1)}
            isPlayingAudio={isPlayingAudio}
            onToggleAudio={toggleNarration}
          />
        )}

        {/* Step 4: Bone Remodeling (Living Cellular Dynamics & Horizon) */}
        {activeStep === 3 && (
          <BoneRemodeling
            onRestart={() => goToStep(0)}
            onPrev={() => goToStep(2)}
          />
        )}
      </div>

      {/* Bottom Timeline Stepper Bar */}
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between pt-3 pb-2 border-t border-stone-200/50 z-20 select-none gap-2">
        {/* Left: Back button */}
        <div className="flex items-center">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => goToStep(Math.max(0, activeStep - 1))}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer shrink-0"
            title="Previous step"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Center: 4-Step Interactive Timeline Stepper */}
        <div className="relative flex items-center gap-3 sm:gap-8 md:gap-14 flex-1 justify-center max-w-[500px]">
          {/* Base inactive gray track line */}
          <div className="absolute top-[9px] left-3 right-3 h-[2px] bg-stone-200/90 -z-0" />

          {/* Active colored progress line connecting completed steps */}
          <div
            className="absolute top-[9px] left-3 h-[2px] bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#F472B6] transition-all duration-300 -z-0"
            style={{
              width: `calc(${(activeStep / (STEPS.length - 1)) * 100}% - ${activeStep === 0 ? 0 : 20}px)`,
            }}
          />

          {STEPS.map((st, idx) => {
            const isActive = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => goToStep(idx)}
                className="relative flex flex-col items-center gap-1.5 z-10 cursor-pointer group focus:outline-none"
              >
                {/* Step Node Dot */}
                <div className="w-5 h-5 flex items-center justify-center">
                  {isActive ? (
                    <div className="w-5 h-5 rounded-full bg-[#231535] ring-4 ring-[#EADCF8] shadow-sm flex items-center justify-center scale-110 transition-transform duration-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  ) : isCompleted ? (
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-[#A855F7] group-hover:border-[#9333EA] transition-colors flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-stone-300 group-hover:border-stone-500 transition-colors" />
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`text-[9px] sm:text-xs font-mono tracking-wider transition-colors duration-200 text-center max-w-[65px] sm:max-w-none truncate sm:whitespace-normal ${
                    isActive
                      ? 'font-bold text-[#14091F]'
                      : 'text-[#5D5066] group-hover:text-[#14091F]'
                  }`}
                >
                  {st.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Next button */}
        <div className="flex items-center">
          {activeStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => goToStep(activeStep + 1)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Next step"
              aria-label="Next step"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <a href="#crash" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#14091F] shadow-sm flex items-center justify-center text-white hover:bg-[#251535] transition-all active:scale-95 cursor-pointer shrink-0"
                title="Next section: The Afternoon Crash"
                aria-label="Next section"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
