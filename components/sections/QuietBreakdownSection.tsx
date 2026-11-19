'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function QuietBreakdownSection() {
  const [age, setAge] = useState(30);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Muscle loss calculation
  const loss = age <= 50 ? age - 30 : Math.min(40, 20 + (age - 50) * 2);
  const activeBarsCount = Math.round(28 * (1 - loss / 100));

  const startHolding = () => {
    setIsHolding(true);
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 2500; // 2.5s hold

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(1, elapsed / duration);
      setHoldProgress(p);

      if (p >= 1) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setIsHolding(false);
      }
    }, 16);
  };

  const stopHolding = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHolding(false);
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  return (
    <section
      id="s2"
      className="min-h-screen px-[8vw] py-[20vh] flex flex-col justify-center relative"
      data-bar="1.25 0.8 0.4 0.5 0 0.3 0 0"
      data-orb="-1 0 0.7 200 0.55"
    >
      <span className="mono mb-2">The quiet breakdown</span>

      {/* Age Display */}
      <div className="text-[clamp(5rem,14vw,11rem)] font-extrabold tracking-[-0.05em] leading-[0.85] text-fg select-none my-2">
        {age}
      </div>

      <h2 className="text-[clamp(2.4rem,6.5vw,5.5rem)] font-extralight tracking-tight leading-[0.95] max-w-[13ch] my-4 text-fg">
        Drag your age.
      </h2>

      {/* Age Range Input */}
      <input
        type="range"
        min="30"
        max="70"
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value, 10))}
        className="w-full max-w-md h-2 bg-fg/15 rounded-lg appearance-none cursor-pointer accent-amber-500 my-6"
        aria-label="Age slider"
      />

      {/* Muscle Fiber Bars */}
      <div className="flex gap-[3px] items-end h-[50px] max-w-[480px] my-4">
        {Array.from({ length: 28 }).map((_, i) => {
          const isActive = i < activeBarsCount;
          // Pseudorandom organic heights
          const barHeight = 55 + ((i * 17) % 45);
          return (
            <i
              key={i}
              className={`flex-1 rounded-sm transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-t from-amber-500 to-rose-500 opacity-90'
                  : 'bg-fg/10 opacity-30 scale-y-50'
              }`}
              style={{ height: `${barHeight}%` }}
            />
          );
        })}
      </div>

      <p className="max-w-[48ch] text-mut my-3">
        {loss > 0
          ? `Illustrative: up to ~${loss}% less muscle by this age if nothing changes.*`
          : 'From around 30 we can lose roughly 1% of muscle a year, and the pace often doubles after 50. Illustrative only.*'}
      </p>

      {/* Hold to Lift Groceries Interactive Test */}
      <div className="flex items-center gap-5 mt-6 mb-2">
        <button
          className="btn s select-none"
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={startHolding}
          onTouchEnd={stopHolding}
        >
          {holdProgress >= 1 ? 'Lifted! Steady grip.' : 'Hold to lift the groceries'}
        </button>

        {/* Circular Progress Ring */}
        <div className="relative w-11 h-11 rounded-full border border-fg/20 flex items-center justify-center">
          <svg className="w-11 h-11 -rotate-90">
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="var(--amb)"
              strokeWidth="3"
              strokeDasharray={113}
              strokeDashoffset={113 * (1 - holdProgress)}
              className="transition-all duration-75"
            />
          </svg>
          <div
            className={`w-2.5 h-2.5 rounded-full transition-transform ${
              isHolding ? 'scale-125 bg-amber-500' : 'bg-fg/30'
            }`}
          />
        </div>
      </div>
      <p className="mono text-[10px]">
        {holdProgress >= 1
          ? 'Done! Notice how strong grip feels.'
          : 'Hold to lift the groceries. Then change your age.'}
      </p>

      {/* Sarcopenia Story Disclosure */}
      <details className="story">
        <summary>Read the full story · The silent loss of independence (sarcopenia)</summary>
        <div>
          <p>
            “As you sit here right now… listen closely. Think back to a moment recently… You pick up a few simple bags of groceries… or carry a light bucket up a flight of stairs. Tasks that used to feel completely effortless… now leave your arms shaking… your knees unsteady… and your breath short.
          </p>
          <p>
            It doesn’t happen all at once… It starts small… A subtle weakness… A quiet loss of balance… Getting tired just a little too quickly. Why? Because beneath your skin… sarcopenia is silently at work. Quietly draining your physical power… and stealing your future independence… before you even realize what you are losing.
          </p>
          <p>
            Starting at age 30, your body quietly discards 1% of its muscle every single year… By age 50, that drain doubles to 2% each year… draining away up to 40% of your total strength, grip, and physical freedom. And as you realize this truth, you might begin to wonder… What will your daily life look like in 10 or 20 years… if you don’t take action today?
          </p>
          <p>
            In just a moment, I will reveal the hidden cellular switch that stops this loss in its tracks… but first, look deeper at what is really happening inside your body…”
          </p>
        </div>
      </details>
    </section>
  );
}
