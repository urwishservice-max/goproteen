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
      className="relative w-full min-h-0 sm:min-h-[85vh] flex items-center justify-center px-4 sm:px-10 lg:px-20 py-10 sm:py-16 lg:py-20 overflow-visible"
      style={{
        backgroundColor: 'transparent',
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
            className="text-[2.2rem] sm:text-[3.2rem] md:text-[4.2rem] lg:text-[4.8rem] font-light tracking-tight leading-[1.08] sm:leading-[1.04] text-[#14091F] mb-4 sm:mb-6 select-none"
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

          <p className="text-[#5D5066] text-sm sm:text-base md:text-[17px] leading-relaxed max-w-[440px] mb-6 sm:mb-8 font-normal">
            Carb-heavy lunches can mean a quick spike, then a slump. Pick a meal and watch the energy curve.
          </p>

          {/* Meal Selection Pill Buttons in an easily responsive row */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
            {MEALS.map((meal) => {
              const isActive = meal.id === activeMealId;
              return (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => setActiveMealId(meal.id)}
                  className={`whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm md:text-[15px] transition-all duration-200 cursor-pointer select-none ${
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

        {/* Right Column: Interactive State with Desk Setup */}
        <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end mt-4 sm:mt-6 lg:mt-0">
          <div className="relative w-full max-w-[620px] aspect-[1024/682] select-none mx-auto lg:ml-auto">
            {/* Crisp Floating Battery Icon in responsive dynamic position above head */}
            <div
              className="absolute z-20 flex items-center select-none pointer-events-none transition-all duration-700 ease-out"
              style={
                activeMealId === 'goproteen'
                  ? { top: '-2%', left: '46%' }
                  : { top: '8%', left: '48%' }
              }
            >
              {/* Battery Body Capsule */}
              <div className="relative w-[84px] sm:w-[102px] md:w-[114px] h-[38px] sm:h-[46px] md:h-[52px] rounded-[12px] sm:rounded-[16px] border-[2.5px] sm:border-[3.5px] border-[#230E2E] bg-white/95 p-[2px] sm:p-[3px] flex items-center shadow-md shadow-[#230E2E]/10 backdrop-blur-sm">
                {/* Charge Level Bar */}
                <div
                  className={`h-full rounded-[8px] sm:rounded-[10px] transition-all duration-700 ${
                    activeMealId === 'goproteen'
                      ? 'bg-gradient-to-r from-[#10B981] to-[#34D399]'
                      : 'bg-gradient-to-r from-[#FF3B30] to-[#FF5E57]'
                  }`}
                  style={{
                    width: activeMealId === 'goproteen' ? '92%' : '20%',
                    boxShadow:
                      activeMealId === 'goproteen'
                        ? '0 0 12px rgba(16, 185, 129, 0.5)'
                        : '0 0 10px rgba(255, 59, 48, 0.45)',
                  }}
                />
              </div>
              {/* Battery Terminal Knob */}
              <div className="w-[6px] sm:w-[8px] h-[15px] sm:h-[20px] bg-[#230E2E] rounded-r-[3px] sm:rounded-r-[4px] ml-[-1px]" />
            </div>

            {/* State 1: Active & focused with GoProteen (First uploaded image) */}
            <img
              src="/images/afternoon_active_goproteen.png"
              alt="Active and energized with GoProteen"
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-all duration-700 ease-in-out ${
                activeMealId === 'goproteen'
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-[0.98] z-0 pointer-events-none'
              }`}
            />

            {/* State 2: Afternoon crash / exhausted (Second uploaded image) */}
            <img
              src="/images/afternoon_crash_exhausted.png"
              alt="The afternoon crash: exhausted at desk"
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-all duration-700 ease-in-out ${
                activeMealId !== 'goproteen'
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-[0.98] z-0 pointer-events-none'
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
