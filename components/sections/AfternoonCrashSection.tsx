'use client';

import React, { useState, useEffect } from 'react';

const MEALS = [
  { id: 'rice', label: 'Rice + roti' },
  { id: 'tea', label: 'Tea + biscuit' },
  { id: 'goproteen', label: 'With GoProteen' },
];

export default function AfternoonCrashSection() {
  const [activeMealId, setActiveMealId] = useState<string>('goproteen');

  // Ensure global 3D bar canvas and ambient orb are completely hidden in this section
  useEffect(() => {
    const hideGlobal3D = () => {
      const cv = document.getElementById('c');
      if (cv) {
        cv.style.opacity = '0';
        cv.style.visibility = 'hidden';
        cv.style.pointerEvents = 'none';
      }
      const orb = document.getElementById('orb');
      if (orb) {
        orb.style.opacity = '0';
      }
    };

    hideGlobal3D();

    const crashSec = document.getElementById('crash');
    if (!crashSec) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.body.classList.add('in-crash-section');
            hideGlobal3D();
          } else {
            document.body.classList.remove('in-crash-section');
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(crashSec);

    return () => {
      observer.disconnect();
      document.body.classList.remove('in-crash-section');
    };
  }, []);

  return (
    <section
      id="crash"
      className="relative w-full min-h-[85vh] flex items-center justify-center px-6 sm:px-12 lg:px-20 py-12 lg:py-16 overflow-hidden"
      style={{
        backgroundColor: '#FDFBF7',
        position: 'relative',
        zIndex: 20,
      }}
      data-bar="0 0 0 0 0 0 0 0"
      data-orb="0 0 0 0 0"
    >
      <div className="relative z-20 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        {/* Left Column: Heading, description, and interactive meal pill buttons */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <h2
            className="text-[2.8rem] sm:text-[3.8rem] md:text-[4.4rem] lg:text-[4.8rem] font-light tracking-tight leading-[1.04] text-[#14091F] mb-6 select-none"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '-0.025em',
            }}
          >
            <span>The afternoon</span>
            <br />
            <span>crash.</span>
          </h2>

          <p className="text-[#5D5066] text-base sm:text-[17px] leading-[1.58] max-w-[440px] mb-8 font-normal">
            Carb-heavy lunches can mean a quick spike, then a slump. Pick a meal and watch the energy curve.
          </p>

          {/* Meal Selection Pill Buttons in a single horizontal row */}
          <div className="flex flex-nowrap items-center gap-3 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
            {MEALS.map((meal) => {
              const isActive = meal.id === activeMealId;
              return (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => setActiveMealId(meal.id)}
                  className={`whitespace-nowrap px-5 sm:px-6 py-2.5 rounded-full text-sm sm:text-[15px] transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#230E2E] text-white shadow-md shadow-[#230E2E]/15 font-medium'
                      : 'bg-white text-[#2B1B36] border border-[#E2DCD5] hover:border-[#B5A89E] font-normal shadow-sm'
                  }`}
                  style={{
                    letterSpacing: '-0.01em',
                  }}
                >
                  {meal.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sleeping man with floating low battery locked directly above head */}
        <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[580px] select-none mx-auto lg:ml-auto">
            {/* Crisp Floating Battery Icon in exact original position directly hovering above hair */}
            <div
              className="absolute z-20 flex items-center select-none pointer-events-none"
              style={{
                top: '26.4%',
                left: '40.2%',
              }}
            >
              {/* Battery Body Capsule */}
              <div
                className="relative w-[114px] h-[52px] rounded-[16px] border-[3.5px] border-[#230E2E] bg-white/95 p-[3px] flex items-center shadow-md shadow-[#230E2E]/10"
              >
                {/* Red Depleted Charge Level */}
                <div
                  className="h-full rounded-[10px] bg-gradient-to-r from-[#FF3B30] to-[#FF5E57] transition-all duration-500"
                  style={{
                    width: '22%',
                    boxShadow: '0 0 10px rgba(255, 59, 48, 0.45)',
                  }}
                />
              </div>
              {/* Battery Terminal Knob */}
              <div
                className="w-[8px] h-[20px] bg-[#230E2E] rounded-r-[4px] ml-[-1px]"
              />
            </div>

            {/* Man sleeping at desk (clean transparent background) */}
            <img
              src="/images/afternoon_crash_man_pure.png"
              alt="The afternoon crash: exhausted at desk"
              className="w-full h-auto object-contain block pointer-events-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
