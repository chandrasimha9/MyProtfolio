'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Unlock, Lock, ChevronRight, Sparkles, Zap, Award } from 'lucide-react';
import { TECH_SVG_LOGOS } from './TechLogos';
import { TECH_BY_KEY } from './CrystalVaultData';

/**
 * CrystalVaultHUD - Floating Specifications Plaque
 * Displays:
 * 1. Brand Logo + Name + Domain Pill
 * 2. Overview Description
 * 3. Proficiency Metric (%) + Glowing Progress Bar
 * 4. Advantages of Learning
 * 5. What Capabilities I Have
 * 6. Related Technology Stack
 */
export default function CrystalVaultHUD({
  tech,
  isOpen = true,
  onClose,
  onSelectRelated,
  onToggleOpen,
}) {
  const cardRef = useRef(null);

  // Ensure internal scroll works seamlessly with smooth scroll libraries (Lenis)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // Allow native vertical scroll inside the card
      const canScroll = el.scrollHeight > el.clientHeight;
      if (canScroll) {
        e.stopPropagation();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [tech?.key]);

  if (!tech) return null;

  const logo = TECH_SVG_LOGOS[tech.key];
  const relatedTechs = (tech.related || [])
    .map((key) => TECH_BY_KEY[key])
    .filter(Boolean);

  const proficiency = tech.proficiency || 85;
  const domainPill = tech.domainPill || tech.category || 'Engineering';

  // Advantages of Learning (falls back gracefully to advantages if not present)
  const learningAdvantages =
    tech.learningAdvantages || tech.advantages?.slice(0, 2) || [];

  // What Capabilities I Have (falls back gracefully to purpose/advantages)
  const myCapabilities =
    tech.myCapabilities ||
    (tech.purpose ? [tech.purpose] : tech.advantages?.slice(2, 4)) || [];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={cardRef}
        key={tech.key}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="w-full sm:w-[380px] md:w-[410px] rounded-2xl p-5 sm:p-6 transition-all duration-300
          bg-white/95 dark:bg-slate-950/90
          backdrop-blur-2xl
          border border-slate-300/80 dark:border-sky-400/30
          shadow-[0_20px_50px_rgba(20,25,35,0.14),0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(14,165,233,0.22)]
          text-zinc-950 dark:text-white
          relative z-40 select-text
          max-h-[75vh] sm:max-h-[500px] md:max-h-[540px]
          overflow-y-auto overflow-x-hidden
          overscroll-contain vault-hud-scroll"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(56, 189, 248, 0.4) transparent',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Sleek Custom Scrollbar for HUD popup */}
        <style>{`
          .vault-hud-scroll::-webkit-scrollbar {
            width: 5px;
          }
          .vault-hud-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .vault-hud-scroll::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.35);
            border-radius: 9999px;
          }
          .vault-hud-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(56, 189, 248, 0.75);
          }
        `}</style>
        {/* Specular Top Edge Light Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/80 to-transparent pointer-events-none" />

        {/* Top Header Row: Brand Icon, Name, Domain Pill & Close Button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Authentic Brand Icon */}
            {logo && (
              <div
                className="w-12 h-12 rounded-xl p-2.5 flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.18)',
                }}
              >
                <svg
                  viewBox={logo.viewBox}
                  className="w-full h-full object-contain"
                  style={{
                    filter: `drop-shadow(0 2px 8px ${logo.brandColor || '#38BDF8'}88)`,
                  }}
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id={`hud-grad-${tech.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={logo.brandColor || '#38BDF8'} />
                      <stop offset="100%" stopColor={logo.brandSecondary || logo.brandColor || '#0284C7'} />
                    </linearGradient>
                  </defs>
                  <path fill={`url(#hud-grad-${tech.key})`} d={logo.path} />
                </svg>
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-white truncate">
                  {tech.name}
                </h3>
                {/* Domain Pill */}
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border
                  bg-sky-100 text-sky-700 border-sky-300
                  dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-400/40"
                >
                  {domainPill}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate mt-0.5 font-medium">
                {tech.role}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {onToggleOpen && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleOpen();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-all cursor-pointer bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 border border-zinc-300 dark:border-white/20 hover:scale-105 active:scale-95"
                title={isOpen ? 'Reseal Bottle Cap' : 'Unseal Bottle Cap & Pour Water'}
              >
                {isOpen ? <Unlock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> : <Lock className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Reliable Working Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-all cursor-pointer bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/25 border border-zinc-300 dark:border-white/20 shadow-sm hover:scale-105 active:scale-95"
              aria-label="Close specifications"
              title="Close specifications"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Technology Description */}
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
          {tech.description}
        </p>

        {/* 1. PROFICIENCY METRIC WITH GLOWING PROGRESS BAR */}
        <div className="mb-4 p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-zinc-600 dark:text-zinc-400 font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>PROFICIENCY</span>
            </span>
            <span className="text-sky-600 dark:text-sky-400 font-mono font-bold text-sm">
              {proficiency}%
            </span>
          </div>

          {/* Glowing Gradient Progress Bar */}
          <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${proficiency}%` }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-600 shadow-[0_0_12px_rgba(56,189,248,0.85)]"
            />
          </div>
        </div>

        {/* 2. ADVANTAGES OF LEARNING */}
        {learningAdvantages.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-300/40 dark:border-amber-400/20">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>ADVANTAGES OF LEARNING</span>
            </span>
            <ul className="space-y-1.5">
              {learningAdvantages.map((adv, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-zinc-800 dark:text-zinc-200 leading-snug"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. WHAT CAPABILITIES I HAVE */}
        {myCapabilities.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-sky-500/10 dark:bg-sky-500/5 border border-sky-300/40 dark:border-sky-400/20">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-700 dark:text-sky-400 mb-2 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>WHAT CAPABILITIES I HAVE</span>
            </span>
            <ul className="space-y-1.5">
              {myCapabilities.map((cap, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-zinc-800 dark:text-zinc-200 leading-snug"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400 mt-1.5 flex-shrink-0" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 4. RELATED TECHNOLOGY STACK */}
        {relatedTechs.length > 0 && (
          <div className="pt-3 border-t border-zinc-200 dark:border-white/10">
            <span className="text-[10px] font-mono tracking-widest text-zinc-600 dark:text-zinc-400 uppercase block mb-1.5 font-bold">
              Related Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {relatedTechs.slice(0, 3).map((rel) => {
                const relLogo = TECH_SVG_LOGOS[rel.key];
                return (
                  <button
                    key={rel.key}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectRelated) onSelectRelated(rel.key);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold transition-all cursor-pointer
                      bg-zinc-100 hover:bg-zinc-200 text-zinc-800 hover:text-black border border-zinc-300
                      dark:bg-white/5 dark:hover:bg-white/15 dark:text-zinc-300 dark:hover:text-white dark:border-white/10"
                  >
                    {relLogo && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: relLogo.brandColor || '#38BDF8' }}
                      />
                    )}
                    <span>{rel.name}</span>
                    <ChevronRight className="w-2.5 h-2.5 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
