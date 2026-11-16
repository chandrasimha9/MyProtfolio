'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Code, Zap, Layers } from 'lucide-react';
import ApothecaryScene3D from './ApothecaryScene3D';
import AppleGlassHUD from './AppleGlassHUD';
import { APOTHECARY_CAROUSEL_SKILLS, VAULT_ZONES } from './CrystalVaultData';
import { soundManager } from './WebAudioSFX';

export default function Skills() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.08 });

  // 14 Confirmed Resume Skills Lineup (Pandas center hero by default, exactly as Reference Image 1)
  const skills = APOTHECARY_CAROUSEL_SKILLS;
  const [activeIndex, setActiveIndex] = useState(3); // 3: Pandas (Center Hero in Image 1)
  const [activeZone, setActiveZone] = useState('all');
  const [state, setState] = useState('closed'); // 'closed' | 'opening' | 'filling' | 'filled' | 'closing'
  const [fillLevel, setFillLevel] = useState(0); // 0.0 to 1.0
  const [cineCam, setCineCam] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Stable callbacks using functional state updates or refs to prevent re-instantiating 3D canvas
  const handleSelectIndex = useCallback((newIdx) => {
    soundManager.stopWaterPour();
    soundManager.playGlassTink();
    setState('closed');
    setFillLevel(0);
    setActiveIndex(newIdx);

    const s = skills[newIdx];
    if (s && s.zoneId) {
      setActiveZone(s.zoneId);
    }
  }, [skills]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => {
      const nextIdx = (prev - 1 + skills.length) % skills.length;
      handleSelectIndex(nextIdx);
      return nextIdx;
    });
  }, [skills.length, handleSelectIndex]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => {
      const nextIdx = (prev + 1) % skills.length;
      handleSelectIndex(nextIdx);
      return nextIdx;
    });
  }, [skills.length, handleSelectIndex]);

  const handleSelectZone = useCallback((zoneId) => {
    setActiveZone(zoneId);
    if (zoneId === 'all') {
      handleSelectIndex(3); // Pandas
    } else {
      const foundIdx = skills.findIndex((s) => s.zoneId === zoneId || s.category?.toLowerCase() === zoneId);
      if (foundIdx !== -1) {
        handleSelectIndex(foundIdx);
      }
    }
  }, [skills, handleSelectIndex]);

  // Click-to-Open & Liquid Fill Trigger (uses functional state update to remain strictly reference-stable)
  const handleToggleOpen = useCallback(() => {
    setState((curr) => {
      if (curr === 'closed') return 'opening';
      if (curr === 'filled') return 'closing';
      return curr;
    });
  }, []);

  const handleAnimationStateChange = useCallback((animState, fl) => {
    setState(animState);
    setFillLevel(fl);
  }, []);

  // Toggle Cinematic Camera
  const handleToggleCineCam = useCallback(() => {
    setCineCam((prev) => !prev);
  }, []);

  // Toggle Procedural Sound
  const handleToggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundManager.setMuted(next);
      return next;
    });
  }, []);

  // Reset to default Pandas center hero
  const handleReset = useCallback(() => {
    soundManager.stopWaterPour();
    soundManager.playGlassTink();
    setState('closed');
    setFillLevel(0);
    setActiveIndex(3); // Pandas
    setActiveZone('all');
  }, []);

  // Keyboard Navigation: ArrowLeft, ArrowRight, Space
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        handleToggleOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, handleToggleOpen]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-label="Technical Toolkit"
      className="relative py-14 sm:py-18 md:py-22 bg-transparent text-slate-900 dark:text-white overflow-hidden select-none transition-colors duration-500"
    >
      {/* Studio Ambient Caustic Glow Background */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] md:w-[1200px] h-[550px] bg-gradient-to-b from-sky-400/15 via-blue-400/5 to-transparent dark:from-sky-500/10 dark:via-blue-600/5 dark:to-transparent blur-[140px] -z-0"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-20">
        {/* =========================================================================
            1. SECTION HERO HEADER & STAT CARDS (Exact Match to Reference Image 1)
        ========================================================================= */}
        <div className="relative mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Top Left Stat Card (15+ Technologies • 4 Core Domains) */}
            <div className="hidden md:flex flex-col gap-2.5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2.5 p-3.5 rounded-2xl border
                  bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/10
                  backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold tracking-tight text-slate-950 dark:text-white font-mono">
                      11+
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Technologies
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-200/60 dark:bg-white/5" />

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold tracking-tight text-slate-950 dark:text-white font-mono">
                      4
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Core Domains
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Center Section Title & Subtitle */}
            <div className="md:col-span-2 flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-white/5 backdrop-blur-md mb-2.5 shadow-sm"
              >
                <span className="text-[10px] text-sky-600 dark:text-sky-400">◇</span>
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-slate-800 dark:text-slate-200 font-bold uppercase">
                  TECHNICAL TOOLKIT
                </span>
                <span className="text-[10px] text-sky-600 dark:text-sky-400">◇</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white mb-2 leading-tight"
              >
                <span>Everything I Build, Starts with the </span>
                <span className="text-[#0284c7] dark:text-[#38bdf8] drop-shadow-[0_2px_12px_rgba(2,132,199,0.25)]">
                  Right Tools.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed"
              >
                A curated collection of technologies, tools and core concepts that power my development journey.
              </motion.p>
            </div>

            {/* Top Right Stat Card (Hands-on Experience • Project Ready) */}
            <div className="hidden md:flex flex-col gap-2.5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2.5 p-3.5 rounded-2xl border
                  bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/10
                  backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-tight text-slate-950 dark:text-white">
                      Hands-on Experience
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Academic & Real-World Projects
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-200/60 dark:bg-white/5" />

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-tight text-slate-950 dark:text-white">
                      Project Ready
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Production-Oriented Skills
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. THE 3D INTERACTIVE APOTHECARY CAROUSEL STAGE
            (Transparent Canvas, Center Pedestal, Continuous Orbital Carousel)
        ========================================================================= */}
        <div className="relative w-full h-[560px] sm:h-[620px] md:h-[680px] rounded-3xl overflow-hidden border border-slate-200/60 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] bg-white/30 dark:bg-black/20 backdrop-blur-md">
          {/* Three.js 3D Canvas */}
          <ApothecaryScene3D
            skills={skills}
            activeIndex={activeIndex}
            state={state}
            fillLevel={fillLevel}
            cineCam={cineCam}
            onSelectIndex={handleSelectIndex}
            onBottleClick={handleToggleOpen}
            onAnimationStateChange={handleAnimationStateChange}
          />

          {/* Apple Liquid Glass Overlay Controls & Top Status Pill */}
          <AppleGlassHUD
            skills={skills}
            activeIndex={activeIndex}
            state={state}
            fillLevel={fillLevel}
            cineCam={cineCam}
            isMuted={isMuted}
            onPrev={handlePrev}
            onNext={handleNext}
            onSelectIndex={handleSelectIndex}
            onToggleOpen={handleToggleOpen}
            onToggleCineCam={handleToggleCineCam}
            onToggleSound={handleToggleSound}
            onReset={handleReset}
          />
        </div>

        {/* =========================================================================
            3. DOMAIN CATEGORY FILTER TABS (Exact Match to Reference Image 1)
            [All] [</> Programming] [Frontend] [Backend] [Database] [AI / ML] [Core Concepts]
        ========================================================================= */}
        <div className="flex items-center justify-center flex-wrap gap-2 mt-4 px-2">
          {VAULT_ZONES.map((zone) => {
            const isActive = activeZone === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => handleSelectZone(zone.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-[0_0_16px_rgba(2,132,199,0.5)] scale-105'
                    : 'bg-white/70 hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-900 border border-slate-200/70 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white'
                }`}
              >
                {zone.id === 'programming' && <span className="font-mono text-[10px]">&lt;/&gt;</span>}
                {zone.id === 'frontend' && <span className="text-[11px]">💻</span>}
                {zone.id === 'backend' && <span className="text-[11px]">⚙️</span>}
                {zone.id === 'database' && <span className="text-[11px]">🗄️</span>}
                {zone.id === 'ai-ml' && <span className="text-[11px]">🧠</span>}
                {zone.id === 'core-concepts' && <span className="text-[11px]">📚</span>}
                <span>{zone.title}</span>
              </button>
            );
          })}
        </div>

        {/* Interaction Tip */}
        <div className="text-center mt-3">
          <p className="text-[11px] font-mono tracking-wide text-slate-500 uppercase">
            <span>Tip: Drag center bottle to test slosh physics • Click bottle or Open &amp; Fill to unscrew cap and pour coloured water</span>
          </p>
        </div>
      </div>
    </section>
  );
}
