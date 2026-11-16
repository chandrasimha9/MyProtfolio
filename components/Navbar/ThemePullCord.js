'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * Procedural Bedside Lamp Mechanical Switch Click Sound
 * Synthesizes an authentic dual-transient spring-latch switch sound via Web Audio API.
 */
function playLampSwitchSound(isTurningOn) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // Transient 1: Mechanical contact tap
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(isTurningOn ? 1900 : 1300, now);
    osc1.frequency.exponentialRampToValueAtTime(140, now + 0.035);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.04);

    // Transient 2: Mechanical latch snap
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(isTurningOn ? 2500 : 1700, now + 0.01);
    osc2.frequency.exponentialRampToValueAtTime(260, now + 0.06);
    gain2.gain.setValueAtTime(0.28, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.01);
    osc2.stop(now + 0.065);
  } catch (e) {
    // Ignore audio errors if blocked by browser policy
  }
}

/**
 * Authentic Bedside Lamp Hanging Pull-Cord Theme Toggle
 * Suspended from the top of the website.
 * Pulling down triggers tactile spring physics, a mechanical click sound, and toggles Light/Dark mode.
 */
export default function ThemePullCord({ theme = 'dark', toggleTheme, mounted = true }) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullY, setPullY] = useState(0); // 0 to 45px
  const [isHovered, setIsHovered] = useState(false);
  const startYRef = useRef(0);
  const hasTriggeredRef = useRef(false);
  const swingControls = useAnimation();

  const isDark = theme === 'dark';
  const restLength = 68; // Base length of cord in px

  // Trigger toggle with mechanical sound and swing recoil
  const executeToggle = useCallback(() => {
    playLampSwitchSound(!isDark);
    if (toggleTheme) toggleTheme();

    // Damped pendulum swinging animation on release
    swingControls.start({
      rotate: [0, 11, -9, 7, -4, 2, 0],
      transition: {
        duration: 1.2,
        ease: 'easeInOut',
      },
    });
  }, [isDark, toggleTheme, swingControls]);

  // Handle direct click / tap with simulated pull-down and spring-back
  const handleClick = (e) => {
    e.stopPropagation();
    if (isPulling) return;

    setIsPulling(true);
    setPullY(36);

    setTimeout(() => {
      executeToggle();
      setPullY(0);
      setIsPulling(false);
    }, 160);
  };

  // Touch and pointer drag physics
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsPulling(true);
    hasTriggeredRef.current = false;
    startYRef.current = e.clientY;
  };

  const handlePointerMove = (e) => {
    if (!isPulling) return;
    const dy = Math.max(0, e.clientY - startYRef.current);
    const clampedY = Math.min(52, dy * 0.75); // Spring resistance
    setPullY(clampedY);

    if (clampedY >= 32 && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      executeToggle();
    }
  };

  const handlePointerUp = () => {
    if (isPulling) {
      setIsPulling(false);
      setPullY(0);
    }
  };

  useEffect(() => {
    if (isPulling) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isPulling]);

  if (!mounted) return null;

  const currentLength = restLength + pullY;

  return (
    <div
      className="relative flex flex-col items-center select-none"
      style={{ touchAction: 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Ceiling Mounting Fixture */}
      <div
        className="w-4 h-2 rounded-b-md shadow-sm transition-colors duration-300"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #334155 0%, #1e293b 100%)'
            : 'linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%)',
          border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.15)',
        }}
      />

      {/* Hanging Cord & Pendant Swinging Group */}
      <motion.div
        animate={swingControls}
        style={{ transformOrigin: 'top center' }}
        className="flex flex-col items-center cursor-grab active:cursor-grabbing"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
      >
        {/* Dynamic Hanging Cord / Beaded Ball-Chain */}
        <svg
          width="14"
          height={currentLength}
          className="overflow-visible"
          style={{ transition: isPulling ? 'none' : 'height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {/* Main vertical braided string */}
          <line
            x1="7"
            y1="0"
            x2="7"
            y2={currentLength}
            stroke={isDark ? '#94a3b8' : '#64748b'}
            strokeWidth="1.5"
            strokeDasharray={isDark ? '2 2' : 'none'}
          />

          {/* Tiny metallic ball beads along the chain every 8px */}
          {Array.from({ length: Math.floor(currentLength / 8) }).map((_, i) => (
            <circle
              key={i}
              cx="7"
              cy={i * 8 + 4}
              r="1.6"
              fill={isDark ? '#e2e8f0' : '#475569'}
            />
          ))}
        </svg>

        {/* Bottom Bedside Lamp Pull-Bead / Acorn Drop Pendant */}
        <motion.div
          animate={{
            scale: isPulling ? 1.15 : isHovered ? 1.08 : 1.0,
            y: pullY,
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          className="relative flex flex-col items-center -mt-0.5 group"
        >
          {/* Top Brass Collar */}
          <div
            className="w-2.5 h-1.5 rounded-t-sm"
            style={{
              background: isDark
                ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)'
                : 'linear-gradient(180deg, #94a3b8 0%, #64748b 100%)',
            }}
          />

          {/* Acorn / Drop Toggle Bead */}
          <div
            className="relative w-4 h-6 rounded-b-full rounded-t-sm flex items-center justify-center transition-all duration-300"
            style={{
              background: isDark
                ? 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
                : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #94a3b8 100%)',
              boxShadow: isDark
                ? '0 0 14px rgba(251, 191, 36, 0.75), 0 2px 6px rgba(0,0,0,0.5)'
                : '0 2px 8px rgba(15, 23, 42, 0.18), inset 0 1px 1px #ffffff',
              border: isDark
                ? '1px solid rgba(255, 255, 255, 0.4)'
                : '1px solid rgba(148, 163, 184, 0.8)',
            }}
          >
            {/* Center glowing phosphor pip (emulates bedside lamp toggle bead) */}
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isDark
                  ? 'bg-amber-100 shadow-[0_0_6px_#ffffff]'
                  : 'bg-slate-600'
              }`}
            />
          </div>

          {/* Subtle Pull Instruction Tooltip (revealed on hover) */}
          <div
            className={`pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase transition-all duration-200 z-50 shadow-md ${
              isHovered || isPulling
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-1 scale-95'
            } ${
              isDark
                ? 'bg-zinc-900/90 text-amber-300 border border-amber-500/40 backdrop-blur-md'
                : 'bg-white/90 text-slate-800 border border-slate-300 shadow-sm backdrop-blur-md'
            }`}
          >
            {isDark ? 'Pull for Light' : 'Pull for Dark'}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
