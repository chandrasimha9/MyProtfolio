'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Video,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Zap,
  Award,
  X,
  FileText,
} from 'lucide-react';
import { TECH_SVG_LOGOS } from './TechLogos';

/**
 * Apple Liquid Glass HUD
 * Features:
 * - Minimal frosted-glass top status pill with dynamic fill percentage progress bar
 * - Compact bottom dock: Open & Fill, Cine Cam: On/Off, Sound: On/Off, Reset
 * - Apple Glass left/right navigation arrows
 * - 5 pagination indicator dots
 * - Expandable specification card
 */
export default function AppleGlassHUD({
  skills = [],
  activeIndex = 2,
  state = 'closed', // 'closed' | 'opening' | 'filling' | 'filled'
  fillLevel = 0,
  cineCam = true,
  isMuted = false,
  onPrev,
  onNext,
  onSelectIndex,
  onToggleOpen,
  onToggleCineCam,
  onToggleSound,
  onReset,
}) {
  const [showSpecCard, setShowSpecCard] = useState(false);
  const currentSkill = skills[activeIndex] || skills[2];
  const logo = TECH_SVG_LOGOS[currentSkill?.key];
  const fillPercent = Math.round(fillLevel * 100);

  // Automatically reveal specification card when water reaches full capacity
  useEffect(() => {
    if (state === 'filled') {
      setShowSpecCard(true);
    } else if (state === 'closed' || state === 'closing') {
      setShowSpecCard(false);
    }
  }, [state]);

  // When changing skills, reset specification card
  useEffect(() => {
    setShowSpecCard(false);
  }, [activeIndex]);

  // Status badge label and accent color
  let stateLabel = 'SEALED & READY';
  let stateColor = 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
  if (state === 'opening') {
    stateLabel = 'UNSCREWING CAP...';
    stateColor = 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400 animate-pulse';
  } else if (state === 'filling') {
    stateLabel = 'POURING COLOURED WATER...';
    stateColor = 'text-sky-600 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-400 animate-pulse';
  } else if (state === 'filled') {
    stateLabel = 'FULL CAPACITY REVEALED';
    stateColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400';
  }

  return (
    <>
      {/* =========================================================================
          1. TOP MINIMAL APPLE LIQUID GLASS STATUS PILL & FILL PROGRESS BAR
      ========================================================================= */}
      <div className="absolute top-4 inset-x-4 flex justify-center pointer-events-none z-30">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-full
            bg-white/80 dark:bg-slate-900/80
            backdrop-blur-[26px] backdrop-saturate-[190%]
            border border-slate-200/90 dark:border-white/15
            shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
            transition-all duration-300 min-w-[280px] sm:min-w-[340px]"
        >
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-ping"
                style={{ backgroundColor: currentSkill?.liquidColor || '#0284c7' }}
              />
              <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {currentSkill?.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                {currentSkill?.domainPill}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border border-current/20 ${stateColor}`}>
                {stateLabel}
              </span>
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 min-w-[32px] text-right">
                {fillPercent}%
              </span>
            </div>
          </div>

          {/* Fill Percentage Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
            <motion.div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${fillPercent}%`,
                backgroundColor: currentSkill?.liquidColor || '#0284c7',
                boxShadow: `0 0 10px ${currentSkill?.liquidColor || '#0284c7'}88`,
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* =========================================================================
          2. APPLE GLASS CAROUSEL ARROW BUTTONS (LEFT & RIGHT)
      ========================================================================= */}
      <button
        type="button"
        onClick={onPrev}
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
          bg-white/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900
          backdrop-blur-[26px] backdrop-saturate-[190%]
          border border-slate-200/90 dark:border-white/15
          text-slate-800 hover:text-black dark:text-slate-200 dark:hover:text-white
          shadow-[0_6px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.6)]
          transition-all cursor-pointer hover:scale-105 active:scale-95"
        aria-label="Previous skill"
        title="Previous skill"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={onNext}
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
          bg-white/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900
          backdrop-blur-[26px] backdrop-saturate-[190%]
          border border-slate-200/90 dark:border-white/15
          text-slate-800 hover:text-black dark:text-slate-200 dark:hover:text-white
          shadow-[0_6px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.6)]
          transition-all cursor-pointer hover:scale-105 active:scale-95"
        aria-label="Next skill"
        title="Next skill"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* =========================================================================
          3. COMPACT APPLE LIQUID GLASS BOTTOM DOCK
      ========================================================================= */}
      <div className="absolute bottom-4 inset-x-4 flex flex-col items-center gap-3 pointer-events-none z-30">
        {/* 14 Carousel Pagination Dots */}
        <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-sm max-w-[92vw] overflow-x-auto">
          {skills.map((s, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => onSelectIndex && onSelectIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'w-6 h-2 bg-sky-600 dark:bg-sky-400 shadow-[0_0_10px_rgba(2,132,199,0.7)]'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-500'
                }`}
                aria-label={`Select ${s.name}`}
                title={s.name}
              />
            );
          })}
        </div>

        {/* Compact Dock Controls */}
        <div className="pointer-events-auto flex items-center flex-wrap justify-center gap-2 p-1.5 rounded-2xl
          bg-white/80 dark:bg-slate-900/80
          backdrop-blur-[26px] backdrop-saturate-[190%]
          border border-slate-200/90 dark:border-white/15
          shadow-[0_10px_35px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
        >
          {/* 1. Open & Fill Button */}
          <button
            type="button"
            onClick={onToggleOpen}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              state === 'filling' || state === 'filled'
                ? 'bg-sky-600 text-white shadow-[0_0_16px_rgba(2,132,199,0.6)] hover:bg-sky-700'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white'
            }`}
            title="Unscrew cap and pour dark colored water"
          >
            <Droplets className={`w-3.5 h-3.5 ${state === 'filling' ? 'animate-bounce' : ''}`} />
            <span>
              {state === 'closed'
                ? 'Open & Fill'
                : state === 'opening'
                ? 'Opening...'
                : state === 'filling'
                ? 'Filling...'
                : 'Close & Drain'}
            </span>
          </button>

          {/* 2. Cine Cam Toggle */}
          <button
            type="button"
            onClick={onToggleCineCam}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              cineCam
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title={cineCam ? 'Cinematic Camera: Enabled' : 'Cinematic Camera: Disabled'}
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cine Cam:</span>
            <span>{cineCam ? 'On' : 'Off'}</span>
          </button>

          {/* 3. Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              !isMuted
                ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
            }`}
            title={!isMuted ? 'Mute Procedural Web Audio' : 'Unmute Procedural Web Audio'}
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Sound:</span>
            <span>{!isMuted ? 'On' : 'Off'}</span>
          </button>

          {/* 4. Specifications Card Toggle */}
          <button
            type="button"
            onClick={() => setShowSpecCard((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/15"
            title="Inspect Skill Architecture Specifications"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Specs</span>
          </button>

          {/* 5. Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15 hover:text-slate-900"
            title="Reset carousel to default React center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          4. EXPANDABLE APPLE GLASS SPECIFICATION CARD
      ========================================================================= */}
      <AnimatePresence>
        {showSpecCard && currentSkill && (
          <motion.div
            data-lenis-prevent="true"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            onWheel={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="absolute top-16 right-4 sm:right-8 z-40 w-[90vw] sm:w-[380px] p-5 rounded-2xl pointer-events-auto
              bg-white/95 dark:bg-slate-950/95
              backdrop-blur-[26px] backdrop-saturate-[190%]
              border border-slate-300/80 dark:border-white/15
              shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)]
              max-h-[calc(100%-85px)] overflow-y-auto overscroll-contain select-text"
            style={{
              touchAction: 'pan-y',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(2, 132, 199, 0.6) rgba(0,0,0,0.06)',
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                {logo && (
                  <div
                    className="w-10 h-10 rounded-xl p-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(241, 245, 249, 0.9)',
                      border: '1px solid rgba(203, 213, 225, 0.8)',
                    }}
                  >
                    <svg viewBox={logo.viewBox} className="w-full h-full object-contain">
                      <path fill={logo.brandColor || '#0284c7'} d={logo.path} />
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">
                    {currentSkill.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    {currentSkill.domainPill}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpecCard(false);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-all cursor-pointer pointer-events-auto shadow-sm"
                aria-label="Close specifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {currentSkill.description}
            </p>

            {/* Proficiency Metric */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-3">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                  <Award className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>PROFICIENCY</span>
                </span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                  {currentSkill.proficiency}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${currentSkill.proficiency}%`,
                    backgroundColor: currentSkill.liquidColor,
                  }}
                />
              </div>
            </div>

            {/* Advantages of Learning */}
            {currentSkill.learningAdvantages?.length > 0 && (
              <div className="p-2.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-300/40 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1 mb-1.5">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>ADVANTAGES OF LEARNING</span>
                </span>
                <ul className="space-y-1">
                  {currentSkill.learningAdvantages.map((adv, aIdx) => (
                    <li key={aIdx} className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What Capabilities I Have */}
            {currentSkill.myCapabilities?.length > 0 && (
              <div className="p-2.5 rounded-xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-300/40 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-700 dark:text-sky-400 font-bold flex items-center gap-1 mb-1.5">
                  <Zap className="w-3 h-3 text-sky-600" />
                  <span>WHAT CAPABILITIES I HAVE</span>
                </span>
                <ul className="space-y-1">
                  {currentSkill.myCapabilities.map((cap, cIdx) => (
                    <li key={cIdx} className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Stack */}
            {currentSkill.related?.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block mb-1.5">
                  RELATED STACK
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentSkill.related.map((relKey) => {
                    const relSkill = skills.find((s) => s.key === relKey) || { name: relKey, liquidColor: '#0284c7' };
                    return (
                      <button
                        key={relKey}
                        type="button"
                        onClick={() => {
                          const rIdx = skills.findIndex((s) => s.key === relKey);
                          if (rIdx !== -1 && onSelectIndex) {
                            onSelectIndex(rIdx);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer border border-slate-200/60 dark:border-white/10"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: relSkill.liquidColor || '#0284c7' }}
                        />
                        <span>{relSkill.name}</span>
                        <span className="text-slate-400 text-[10px]">&rsaquo;</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
