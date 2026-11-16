'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * InteractiveSkillCard
 *
 * Clickable technology card with:
 * - Dual pointerup + click handler with debounce guard (impervious to 3D tilt cancellations)
 * - All child elements have pointer-events-none for 100% reliable click capture
 * - Glowing metallic border when selected (theme-aware)
 * - Brighter logo illumination with drop-shadow glow
 * - In-card smooth advantage description reveal
 * - Gentle independent floating logo motion
 * - Single click toggles / collapses selection
 */
export default function InteractiveSkillCard({
  tech,
  logo,
  isSelected,
  onSelect,
  size = 'default',
  floatIndex = 0,
}) {
  const lastTriggerRef = useRef(0);

  if (!logo) return null;

  const isCompact = size === 'compact';
  const floatDuration = 3.2 + (floatIndex % 4) * 0.5;

  const triggerSelect = (e) => {
    const now = Date.now();
    // Guard against duplicate invocation when both pointerup and click fire from the same gesture (typically < 10ms)
    if (now - lastTriggerRef.current < 40) return;
    lastTriggerRef.current = now;

    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    if (onSelect) {
      onSelect(tech.key);
    }
  };

  const handlePointerUp = (e) => {
    // Only fire for primary mouse button or touch tap
    if (e && e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
    triggerSelect(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      triggerSelect(e);
    }
  };

  return (
    <button
      type="button"
      onClick={triggerSelect}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      aria-label={`${tech.label}: Click to spotlight engineering advantage`}
      className={`group relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden text-left w-full pointer-events-auto select-none focus:outline-none ${
        isCompact ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
      } ${
        isSelected
          ? 'scale-[1.03] bg-white/[0.14] dark:bg-white/[0.14] light:bg-zinc-900/[0.1] border-2 border-white dark:border-white light:border-zinc-900 ring-2 ring-white/50 dark:ring-white/50 light:ring-zinc-700/40 shadow-[0_0_28px_rgba(255,255,255,0.45),inset_0_0_16px_rgba(255,255,255,0.1)] dark:shadow-[0_0_28px_rgba(255,255,255,0.45),inset_0_0_16px_rgba(255,255,255,0.1)] light:shadow-[0_0_22px_rgba(0,0,0,0.2),inset_0_0_12px_rgba(0,0,0,0.04)] backdrop-blur-2xl z-30'
          : 'hover:scale-[1.03] active:scale-[0.98] bg-white/[0.04] dark:bg-white/[0.04] light:bg-zinc-900/[0.04] hover:bg-white/[0.09] dark:hover:bg-white/[0.09] light:hover:bg-zinc-900/[0.08] border border-white/10 dark:border-white/10 light:border-zinc-300/80 hover:border-white/40 dark:hover:border-white/40 light:hover:border-zinc-400 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25),0_0_16px_rgba(255,255,255,0.08)] backdrop-blur-xl'
      }`}
    >
      {/* Specular Top-Edge Light Accent */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[1.5px] transition-opacity duration-300 ${
          isSelected
            ? 'bg-gradient-to-r from-transparent via-white dark:via-white light:via-zinc-800 to-transparent opacity-100'
            : 'bg-gradient-to-r from-transparent via-white/30 dark:via-white/30 light:via-zinc-400/30 to-transparent opacity-40 group-hover:opacity-90'
        }`}
      />

      {/* Floating Logo Container with Glow Illumination */}
      <motion.div
        animate={
          isSelected
            ? { y: 0 }
            : { y: [0, -3.5, 0] }
        }
        transition={
          isSelected
            ? { duration: 0.2 }
            : { repeat: Infinity, duration: floatDuration, ease: 'easeInOut' }
        }
        className={`pointer-events-none flex items-center justify-center transition-all duration-300 ${
          isCompact
            ? 'w-6 h-6 sm:w-7 sm:h-7 mb-1.5'
            : 'w-8 h-8 sm:w-9 sm:h-9 mb-2.5'
        }`}
      >
        <svg
          viewBox={logo.viewBox}
          className={`pointer-events-none w-full h-full object-contain transition-all duration-300 ${
            isSelected
              ? 'fill-white dark:fill-white light:fill-zinc-950 scale-110'
              : 'fill-zinc-300 dark:fill-zinc-300 light:fill-zinc-700 group-hover:fill-white group-hover:dark:fill-white group-hover:light:fill-zinc-950 group-hover:scale-105'
          }`}
          style={{
            filter: isSelected
              ? 'drop-shadow(0 0 10px rgba(255,255,255,0.95))'
              : 'drop-shadow(0 0 2px rgba(255,255,255,0.15))',
          }}
          aria-hidden="true"
        >
          <path d={logo.path} className="pointer-events-none" />
        </svg>
      </motion.div>

      {/* Technology Label & Active Spotlight Pulse */}
      <div className="pointer-events-none flex items-center justify-center gap-1 w-full text-center">
        <span
          className={`pointer-events-none font-mono transition-colors duration-200 tracking-wider truncate max-w-full ${
            isCompact
              ? 'text-[10px] sm:text-[11px] font-medium'
              : 'text-[11px] sm:text-xs font-semibold'
          } ${
            isSelected
              ? 'text-white dark:text-white light:text-zinc-950 font-bold'
              : 'text-zinc-300 dark:text-zinc-300 light:text-zinc-800 group-hover:text-white group-hover:dark:text-white group-hover:light:text-zinc-950'
          }`}
        >
          {tech.label}
        </span>
        {isSelected && (
          <span className="pointer-events-none w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-400 light:bg-emerald-600 animate-pulse flex-shrink-0" />
        )}
      </div>

      {/* In-Card Advantage Reveal (Smooth Fade & Slide) */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="advantage-reveal"
            initial={{ opacity: 0, height: 0, y: 5 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 5 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 24,
            }}
            className="pointer-events-none w-full mt-2.5 pt-2 border-t border-white/20 dark:border-white/20 light:border-zinc-300/80 overflow-hidden"
          >
            <div className="pointer-events-none flex items-center justify-between gap-1 mb-1">
              <span className="pointer-events-none text-[9px] font-mono font-bold tracking-widest text-zinc-400 dark:text-zinc-400 light:text-zinc-500 uppercase">
                Advantage
              </span>
              <span className="pointer-events-none text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/10 dark:bg-white/10 light:bg-zinc-900/10 text-zinc-300 dark:text-zinc-300 light:text-zinc-700">
                {tech.badge}
              </span>
            </div>
            <p
              className={`pointer-events-none font-sans leading-relaxed text-zinc-200 dark:text-zinc-200 light:text-zinc-800 font-normal ${
                isCompact
                  ? 'text-[10px] leading-snug'
                  : 'text-[11px] sm:text-xs'
              }`}
            >
              {tech.advantage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
