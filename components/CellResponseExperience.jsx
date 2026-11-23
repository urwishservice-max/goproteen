'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * CellResponseExperience Component
 * 
 * Interactive Anabolic Resistance & Protein Absorption Simulation:
 * - High-res transparent 3D muscle fascicle with exposed glowing myofibrils.
 * - Three floating Leucine protein cells with organic ambient drift.
 * - Drag-and-drop or click to absorb into the muscle fascicles.
 * - Age-Dependent Anabolic Resistance Probability:
 *   - Age 30: ~100% acceptance — young muscle eagerly listens and absorbs protein.
 *   - Age 40: ~65% acceptance — occasional rejection.
 *   - Age 50: ~35% acceptance — frequent rejection (65% rejected!).
 *   - Age 60: ~20% acceptance — highly resistant (80% rejected! accepts only sometimes, many times rejected!).
 * - When rejected:
 *   - Receptor flashes resistant barrier.
 *   - Protein cell deflects, shakes, and springs smoothly back to its original floating place.
 * - When accepted:
 *   - Cell is absorbed into the muscle fiber with a particle burst.
 *   - A new protein cell immediately respawns in the floating pool.
 *   - Bioluminescent scan wave sweeps across the muscle fibers with age-modulated intensity.
 */

const INITIAL_PROTEINS = [
  { id: 1, name: 'Leucine α', basePos: { x: 0.08, y: 0.28 }, floatAnim: 'floatCell1' },
  { id: 2, name: 'Leucine β', basePos: { x: 0.14, y: 0.52 }, floatAnim: 'floatCell2' },
  { id: 3, name: 'Leucine γ', basePos: { x: 0.08, y: 0.74 }, floatAnim: 'floatCell3' },
];

// Target receptor zone on the muscle fascicle core
const RECEPTOR_TARGET = { x: 0.38, y: 0.60 };

export default function CellResponseExperience({
  userAge = 30,
  onAbsorb,
}) {
  const containerRef = useRef(null);

  // Protein cell states:
  // status: 'idle' | 'dragging' | 'absorbing' | 'rejected' | 'returning' | 'spawning'
  const [proteins, setProteins] = useState(() =>
    INITIAL_PROTEINS.map((p) => ({
      ...p,
      pos: { ...p.basePos },
      status: 'idle',
      absorbCount: 0,
    }))
  );

  const [activeDragId, setActiveDragId] = useState(null);
  const dragInfoRef = useRef({ id: null, startX: 0, startY: 0, startPx: 0, startPy: 0 });

  // Scan wave animation state
  const [isScanning, setIsScanning] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const [receptorResisting, setReceptorResisting] = useState(false);
  const [totalAbsorbed, setTotalAbsorbed] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('👆 Drag protein to muscle fibers');
  const [feedbackType, setFeedbackType] = useState('normal'); // 'normal' | 'success' | 'warn'

  // Acceptance probability based on age:
  // Age 30: 98% (~100% acceptance)
  // Age 40: 65% (accepted ~2/3 times)
  // Age 50: 35% (accepted ~1/3 times, 65% rejected!)
  // Age 60: 20% (accepted only ~1/5 times, 80% rejected! Many times rejected!)
  const getAcceptanceRate = (age) => {
    if (age <= 30) return 0.98;
    if (age <= 40) return 0.65 - ((age - 30) / 10) * 0.15;
    if (age <= 50) return 0.50 - ((age - 40) / 10) * 0.15;
    return Math.max(0.15, 0.35 - ((age - 50) / 10) * 0.15);
  };

  // Response intensity factor for the scan wave:
  // 30 -> 1.0 (100%), 40 -> 0.75, 50 -> 0.50, 60 -> 0.30
  const responseFactor =
    userAge <= 30
      ? 1.0
      : userAge <= 40
      ? 1.0 - ((userAge - 30) / 10) * 0.25
      : userAge <= 50
      ? 0.75 - ((userAge - 40) / 10) * 0.25
      : Math.max(0.2, 0.50 - ((userAge - 50) / 10) * 0.20);

  // Drag start handler
  const handlePointerDown = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!containerRef.current) return;

    const cell = proteins.find((p) => p.id === id);
    if (!cell || cell.status === 'absorbing' || cell.status === 'spawning') return;

    const rect = containerRef.current.getBoundingClientRect();
    setActiveDragId(id);

    dragInfoRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      startPx: cell.pos.x * rect.width,
      startPy: cell.pos.y * rect.height,
    };

    setProteins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'dragging' } : p))
    );
  };

  // Drag move handler
  const handlePointerMove = useCallback(
    (e) => {
      if (!activeDragId || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = e.clientX - dragInfoRef.current.startX;
      const dy = e.clientY - dragInfoRef.current.startY;

      const newPx = Math.max(15, Math.min(rect.width - 15, dragInfoRef.current.startPx + dx));
      const newPy = Math.max(15, Math.min(rect.height - 15, dragInfoRef.current.startPy + dy));

      const normX = newPx / rect.width;
      const normY = newPy / rect.height;

      setProteins((prev) =>
        prev.map((p) => (p.id === activeDragId ? { ...p, pos: { x: normX, y: normY } } : p))
      );
    },
    [activeDragId]
  );

  // Trigger successful absorption and respawn new protein
  const executeAbsorption = (id, normX, normY) => {
    // 1. Set status to absorbing
    setProteins((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'absorbing',
              pos: { x: normX, y: normY },
            }
          : p
      )
    );

    // 2. Trigger Scan Effect along the muscle fibers
    setIsScanning(true);
    setScanKey((k) => k + 1);
    setTotalAbsorbed((c) => c + 1);

    const pct = Math.round(responseFactor * 100);
    setFeedbackType('success');
    if (userAge <= 35) {
      setFeedbackMessage(`✓ Absorbed (+${pct}% synthesis)`);
    } else {
      setFeedbackMessage(`✓ Absorbed (+${pct}% response)`);
    }

    if (onAbsorb) {
      onAbsorb(userAge, responseFactor);
    }

    // 3. Respawn the protein cell at its original base position after 550ms
    setTimeout(() => {
      setProteins((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                pos: { ...p.basePos },
                status: 'spawning',
                absorbCount: p.absorbCount + 1,
              }
            : p
        )
      );

      // Transition smoothly from spawning to idle
      setTimeout(() => {
        setProteins((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: 'idle' } : p))
        );
      }, 350);
    }, 550);

    // Turn off scanning after wave finishes
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  // Rejection handler: cell deflects, flashes resistant barrier, and returns to original place
  const executeRejection = (id, fromX, fromY) => {
    setTotalRejected((r) => r + 1);
    setReceptorResisting(true);

    // 1. Mark as rejected (shakes & flashes coral shield)
    setProteins((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'rejected',
              pos: { x: fromX, y: fromY },
            }
          : p
      )
    );

    const rejectPct = Math.round((1 - getAcceptanceRate(userAge)) * 100);
    setFeedbackType('warn');
    if (userAge >= 60) {
      setFeedbackMessage(`❌ Resisted (~${rejectPct}% at age 60) · Try again`);
    } else if (userAge >= 50) {
      setFeedbackMessage(`❌ Resisted (~${rejectPct}% at age 50) · Try again`);
    } else {
      setFeedbackMessage(`❌ Resisted (~${rejectPct}%) · Try again`);
    }

    // 2. After 350ms of resistance shake, smoothly spring back to base position
    setTimeout(() => {
      setReceptorResisting(false);
      setProteins((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: 'returning',
                pos: { ...p.basePos },
              }
            : p
        )
      );

      // 3. Return to idle once back in original place
      setTimeout(() => {
        setProteins((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: 'idle' } : p))
        );
      }, 500);
    }, 350);
  };

  // Return protein when dropped completely outside muscle
  const executeMissedReturn = (id) => {
    setProteins((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'returning',
              pos: { ...p.basePos },
            }
          : p
      )
    );
    setFeedbackType('normal');
    setFeedbackMessage('Cell missed — drop directly onto the muscle fascicle to test absorption');

    setTimeout(() => {
      setProteins((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'idle' } : p))
      );
    }, 500);
  };

  // Drag release handler with probabilistic age-dependent acceptance check
  const handlePointerUp = useCallback(() => {
    if (!activeDragId || !containerRef.current) return;
    const currentId = activeDragId;
    setActiveDragId(null);

    const cell = proteins.find((p) => p.id === currentId);
    if (!cell) return;

    const px = cell.pos.x;
    const py = cell.pos.y;

    // Check if dropped within the muscle zone (x: 0.25..0.90, y: 0.18..0.85)
    const isOverMuscle = px >= 0.24 && px <= 0.90 && py >= 0.18 && py <= 0.85;

    if (!isOverMuscle) {
      executeMissedReturn(currentId);
      return;
    }

    // Distance to core receptor target
    const distToReceptor = Math.hypot(px - RECEPTOR_TARGET.x, py - RECEPTOR_TARGET.y);

    // Tolerance radius:
    // If dropped very far from receptor (e.g. at the distant edge of the muscle), it misses.
    if (distToReceptor > 0.40) {
      executeMissedReturn(currentId);
      return;
    }

    // AGE-BASED PROBABILITY (Anabolic Resistance):
    // Age 30: ~100% acceptance
    // Age 40: ~65% acceptance
    // Age 50: ~35% acceptance (many times rejected!)
    // Age 60: ~20% acceptance (accepts sometimes only, many times rejected!)
    const acceptChance = getAcceptanceRate(userAge);
    const roll = Math.random();

    if (roll < acceptChance) {
      // Accepted! Absorb and trigger Scan Effect
      executeAbsorption(currentId, px, py);
    } else {
      // Rejected! Resists and bounces back to original place
      executeRejection(currentId, px, py);
    }
  }, [activeDragId, proteins, userAge]);

  useEffect(() => {
    if (activeDragId) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeDragId, handlePointerMove, handlePointerUp]);

  // Click/tap handler with the EXACT same age-based probability check
  const handleCellClick = (id) => {
    const cell = proteins.find((p) => p.id === id);
    if (!cell || cell.status !== 'idle') return;

    const acceptChance = getAcceptanceRate(userAge);
    const roll = Math.random();

    if (roll < acceptChance) {
      executeAbsorption(id, RECEPTOR_TARGET.x, RECEPTOR_TARGET.y);
    } else {
      executeRejection(id, cell.pos.x, cell.pos.y);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[340px] max-h-[440px] flex items-center justify-center select-none overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      {/* 1. Muscle Image (Pristine transparent 1024x512 from user) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-end pr-2 md:pr-6">
        <img
          src="/images/cell_response_muscle_clean.png"
          alt="Muscle fascicle cross-section showing myofibrils and glowing fiber cores"
          className="h-full w-auto max-w-[85%] object-contain object-right"
          style={{
            filter: 'drop-shadow(0 14px 28px rgba(20, 9, 31, 0.06))',
          }}
          draggable={false}
        />
      </div>

      {/* 2. Target Receptor Zone on Muscle Fascicle */}
      <div
        onClick={() => {
          const idleCell = proteins.find((p) => p.status === 'idle');
          if (idleCell) handleCellClick(idleCell.id);
        }}
        className={`absolute cursor-pointer z-10 transition-transform duration-300 ${
          activeDragId ? 'scale-125' : 'hover:scale-110'
        }`}
        style={{
          left: `${RECEPTOR_TARGET.x * 100}%`,
          top: `${RECEPTOR_TARGET.y * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
        title="Receptor target: Drop protein cell here to absorb"
      >
        {/* Pulsing Concentric Rings / Resistant Barrier Rings */}
        <div
          className={`absolute inset-[-14px] rounded-full border pointer-events-none transition-colors duration-300 ${
            receptorResisting
              ? 'border-rose-500/80 bg-rose-500/15'
              : 'border-amber-400/50'
          }`}
          style={{
            animation: receptorResisting
              ? 'barrierResistPulse 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite'
              : activeDragId
              ? 'receptorPulseFast 1s cubic-bezier(0.2, 0.8, 0.2, 1) infinite'
              : 'receptorPulse 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite',
          }}
        />
        <div
          className={`absolute inset-[-7px] rounded-full border pointer-events-none transition-colors duration-300 ${
            receptorResisting
              ? 'border-rose-600/90'
              : 'border-amber-500/70'
          }`}
          style={{
            animation: receptorResisting
              ? 'barrierResistPulse 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 0.15s'
              : activeDragId
              ? 'receptorPulseFast 1s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 0.3s'
              : 'receptorPulse 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 0.6s',
          }}
        />
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-md flex items-center justify-center font-bold text-xs sm:text-sm transition-colors duration-300 ${
            receptorResisting
              ? 'bg-rose-500 text-white shadow-[0_0_16px_rgba(244,63,94,0.8)]'
              : 'bg-white/90 backdrop-blur-xs text-stone-800'
          }`}
        >
          {receptorResisting ? '✕' : '+'}
        </div>
      </div>

      {/* 3. The SCAN EFFECT (Luminous wave sweeping across the muscle fibers when accepted) */}
      {isScanning && (
        <div
          key={scanKey}
          className="absolute inset-0 pointer-events-none overflow-hidden z-20"
        >
          {/* Sweeping Laser / Bioluminescent Light Bar */}
          <div
            className="absolute top-0 bottom-0 w-32"
            style={{
              opacity: responseFactor * 0.95,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255, 220, 100, 0.15) 35%, rgba(255, 250, 210, 0.95) 50%, rgba(245, 158, 11, 0.85) 60%, transparent 100%)',
              filter: 'blur(6px)',
              mixBlendMode: 'screen',
              animation: 'scanSweep 1.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
            }}
          />

          {/* Golden Flare Pulse across the myofibril bundle cores */}
          <div
            className="absolute"
            style={{
              left: '32%',
              top: '28%',
              width: '56%',
              height: '52%',
              opacity: responseFactor,
              background:
                'radial-gradient(ellipse at 40% 50%, rgba(255, 240, 150, 0.85) 0%, rgba(251, 191, 36, 0.5) 45%, transparent 75%)',
              filter: 'blur(16px)',
              mixBlendMode: 'screen',
              animation: 'scanGlowFlare 1.3s ease-out forwards',
            }}
          />

          {/* Traveling golden spark stream along fiber length */}
          <div
            className="absolute h-2 rounded-full"
            style={{
              left: '35%',
              top: '48%',
              width: '45%',
              background:
                'linear-gradient(90deg, rgba(255,255,255,1), rgba(251,191,36,0.9), transparent)',
              filter: 'blur(1.5px)',
              transform: 'rotate(11deg)',
              opacity: responseFactor,
              animation: 'sparkRush 1.1s cubic-bezier(0.2, 0, 0.2, 1) forwards',
            }}
          />
        </div>
      )}

      {/* 4. Three Floating Leucine Protein Cells */}
      {proteins.map((cell) => {
        const isDragging = activeDragId === cell.id;
        const isAbsorbing = cell.status === 'absorbing';
        const isRejected = cell.status === 'rejected';
        const isReturning = cell.status === 'returning';
        const isSpawning = cell.status === 'spawning';

        return (
          <div
            key={cell.id}
            onPointerDown={(e) => handlePointerDown(cell.id, e)}
            onClick={() => handleCellClick(cell.id)}
            className={`absolute z-30 flex flex-col items-center select-none cursor-grab active:cursor-grabbing ${
              isDragging
                ? 'scale-115 z-40'
                : isReturning
                ? 'transition-all duration-500 ease-out'
                : isAbsorbing
                ? 'transition-all duration-400 ease-in'
                : isSpawning
                ? 'transition-all duration-350 ease-out'
                : ''
            }`}
            style={{
              left: `${cell.pos.x * 100}%`,
              top: `${cell.pos.y * 100}%`,
              transform: `translate(-50%, -50%) ${
                isAbsorbing
                  ? 'scale(0) rotate(180deg)'
                  : isSpawning
                  ? 'scale(0.2)'
                  : isDragging
                  ? 'scale(1.15)'
                  : 'scale(1)'
              }`,
              opacity: isAbsorbing ? 0 : isSpawning ? 0.3 : 1,
              touchAction: 'none',
              animation: isRejected
                ? 'rejectDeflect 0.35s ease-in-out'
                : !isDragging && !isAbsorbing && !isReturning && !isSpawning
                ? `${cell.floatAnim} 5s ease-in-out infinite alternate`
                : 'none',
            }}
            title="Draggable Leucine Protein: Drag to muscle or click to test absorption"
          >
            {/* Halo Ring & Leucine 3D Molecule */}
            <div
              className={`relative p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
                isRejected
                  ? 'ring-3 sm:ring-4 ring-rose-500 bg-rose-500/25 shadow-[0_0_20px_rgba(244,63,94,0.85)] scale-110'
                  : isDragging
                  ? 'ring-3 sm:ring-4 ring-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.8)] bg-white/70'
                  : 'ring-1.5 sm:ring-2 ring-white/80 shadow-[0_4px_14px_rgba(157,38,130,0.2)] bg-white/45 backdrop-blur-xs hover:ring-amber-400/60 hover:scale-105'
              }`}
            >
              <img
                src="/images/leucine_molecule.png"
                alt={cell.name}
                className="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 object-contain pointer-events-none"
                style={{
                  filter: isRejected
                    ? 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.9))'
                    : isDragging
                    ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))'
                    : 'drop-shadow(0 3px 6px rgba(20, 9, 31, 0.15))',
                }}
                draggable={false}
              />

              {/* Hand hint for the first idle cell */}
              {cell.id === 1 && !isDragging && cell.absorCount === 0 && (
                <div
                  className="absolute -right-1.5 -bottom-1.5 text-xs sm:text-base pointer-events-none"
                  style={{ animation: 'bounceSubtle 1.8s infinite' }}
                >
                  👆
                </div>
              )}
            </div>

            {/* Protein Label Pill */}
            <div
              className={`mt-0.5 px-1.5 py-0.5 rounded-full text-center shadow-xs backdrop-blur-xs pointer-events-none transition-colors duration-300 ${
                isRejected
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-white/90 text-stone-800'
              }`}
            >
              <span className="block text-[8px] sm:text-[10px] font-semibold tracking-tight leading-tight">
                {isRejected ? 'Resisted!' : cell.name}
              </span>
              <span className={`block text-[7px] sm:text-[8px] font-mono leading-none ${isRejected ? 'text-white/80' : 'text-stone-500'}`}>
                {isRejected ? 'Deflected' : 'Protein'}
              </span>
            </div>
          </div>
        );
      })}

      {/* 5. Top Dynamic Status Pill with Live Stats */}
      <div
        className={`absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium transition-all duration-300 shadow-xs z-40 flex items-center justify-center gap-1.5 max-w-[92vw] whitespace-nowrap overflow-hidden text-ellipsis text-center ${
          feedbackType === 'success'
            ? 'bg-amber-500 text-white shadow-[0_2px_12px_rgba(245,158,11,0.4)]'
            : feedbackType === 'warn'
            ? 'bg-rose-500 text-white shadow-[0_2px_12px_rgba(244,63,94,0.35)]'
            : 'bg-white/90 text-stone-800 backdrop-blur-xs'
        }`}
      >
        <span className="truncate">{feedbackMessage}</span>
        {(totalAbsorbed > 0 || totalRejected > 0) && (
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] font-mono shrink-0">
            ✓{totalAbsorbed} ✕{totalRejected}
          </span>
        )}
      </div>

      {/* CSS Keyframe Animations for Natural Organic Flow, Rejections & Scan Effects */}
      <style jsx>{`
        @keyframes floatCell1 {
          0% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) translateY(-10px) rotate(5deg);
          }
        }
        @keyframes floatCell2 {
          0% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) translateY(8px) rotate(-6deg);
          }
        }
        @keyframes floatCell3 {
          0% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) translateY(-8px) rotate(4deg);
          }
        }
        @keyframes receptorPulse {
          0% {
            transform: scale(0.7);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        @keyframes receptorPulseFast {
          0% {
            transform: scale(0.6);
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        @keyframes barrierResistPulse {
          0% {
            transform: scale(0.85);
            opacity: 1;
          }
          50% {
            transform: scale(1.8);
            opacity: 0.9;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        @keyframes rejectDeflect {
          0% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          25% {
            transform: translate(-50%, -50%) scale(1.25) translate(-18px, -8px);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15) translate(12px, 6px);
          }
          75% {
            transform: translate(-50%, -50%) scale(1.05) translate(-6px, -3px);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes scanSweep {
          0% {
            left: 20%;
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          85% {
            opacity: 0.9;
          }
          100% {
            left: 88%;
            opacity: 0;
          }
        }
        @keyframes scanGlowFlare {
          0% {
            transform: scale(0.85);
            opacity: 0.3;
          }
          40% {
            transform: scale(1.08);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        @keyframes sparkRush {
          0% {
            transform: rotate(11deg) translateX(-40px);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: rotate(11deg) translateX(120px);
            opacity: 0;
          }
        }
        @keyframes bounceSubtle {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(2px, 3px);
          }
        }
      `}</style>
    </div>
  );
}
