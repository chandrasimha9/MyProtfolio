'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, RotateCcw, ArrowDown, Download, Sparkles, Loader2 } from 'lucide-react';
import { personalData } from '@/data/portfolio';

export default function Hero() {
  const videoRef = useRef(null);
  const heroRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasAutoplayFailed, setHasAutoplayFailed] = useState(false);
  const [soundPrefLoaded, setSoundPrefLoaded] = useState(false);

  // Initialize sound preference from sessionStorage
  useEffect(() => {
    try {
      const storedSound = sessionStorage.getItem('cs_hero_sound');
      if (storedSound === 'on') {
        setIsMuted(false);
      } else {
        setIsMuted(true);
      }
    } catch {}
    setSoundPrefLoaded(true);
  }, []);

  // Safe playback function that preserves currentTime
  const safePlay = useCallback((requestedMuted = null) => {
    const video = videoRef.current;
    if (!video) return;

    const targetMuted = requestedMuted !== null ? requestedMuted : isMuted;
    video.muted = targetMuted;
    video.volume = 1.0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setHasAutoplayFailed(false);
          setIsBuffering(false);
        })
        .catch((err) => {
          console.log('Autoplay policy caught, attempting muted fallback:', err);
          // Fallback to muted playback if browser restricted audio
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .then(() => {
              setIsPlaying(true);
              setHasAutoplayFailed(false);
              setIsBuffering(false);
            })
            .catch(() => {
              setIsPlaying(false);
              setHasAutoplayFailed(true);
            });
        });
    }
  }, [isMuted]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    const heroSection = heroRef.current;
    if (!video || !heroSection || !soundPrefLoaded) return;

    // Determine initial muted state from preference
    let initialMuted = true;
    try {
      const stored = sessionStorage.getItem('cs_hero_sound');
      initialMuted = stored !== 'on';
    } catch {}

    video.muted = initialMuted;
    setIsMuted(initialMuted);

    const handleCanPlay = () => {
      setIsReady(true);
      setIsBuffering(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      setIsReady(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);

    // Initial play attempt
    safePlay(initialMuted);

    // Unmute on first user gesture if user hadn't explicitly muted
    const handleFirstInteraction = () => {
      try {
        const stored = sessionStorage.getItem('cs_hero_sound');
        // Only auto-unmute if user has not explicitly chosen 'off'
        if (stored !== 'off' && videoRef.current) {
          videoRef.current.muted = false;
          videoRef.current.volume = 1.0;
          setIsMuted(false);
          sessionStorage.setItem('cs_hero_sound', 'on');
        }
      } catch {}

      ['click', 'touchstart', 'scroll', 'pointerdown', 'keydown'].forEach((e) => {
        window.removeEventListener(e, handleFirstInteraction);
      });
    };

    ['click', 'touchstart', 'scroll', 'pointerdown', 'keydown'].forEach((e) => {
      window.addEventListener(e, handleFirstInteraction, { once: true, passive: true });
    });

    // IntersectionObserver: Pause when out of Hero, Resume exactly where left off without reset
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          // In hero section -> Resume video from exact current position
          if (video.paused) {
            let resumeMuted = video.muted;
            try {
              const pref = sessionStorage.getItem('cs_hero_sound');
              if (pref === 'on') {
                resumeMuted = false;
              }
            } catch {}
            video.muted = resumeMuted;
            setIsMuted(resumeMuted);
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        } else {
          // Scrolled away from hero -> PAUSE (Preserve currentTime)
          if (!video.paused) {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: [0.1, 0.2, 0.5] }
    );

    observer.observe(heroSection);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      observer.disconnect();
      ['click', 'touchstart', 'scroll', 'pointerdown', 'keydown'].forEach((e) => {
        window.removeEventListener(e, handleFirstInteraction);
      });
    };
  }, [soundPrefLoaded, safePlay]);

  // User explicit sound toggle
  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
      try {
        sessionStorage.setItem('cs_hero_sound', 'on');
      } catch {}
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      video.muted = true;
      setIsMuted(true);
      try {
        sessionStorage.setItem('cs_hero_sound', 'off');
      } catch {}
    }
  };

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    let soundTarget = isMuted;
    try {
      const pref = sessionStorage.getItem('cs_hero_sound');
      if (pref === 'on') soundTarget = false;
    } catch {}

    video.muted = soundTarget;
    video.volume = 1.0;
    setIsMuted(soundTarget);
    video
      .play()
      .then(() => {
        setIsPlaying(true);
        setHasAutoplayFailed(false);
      })
      .catch((err) => console.log('Manual play error:', err));
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      aria-label="Hero Section"
      className="relative w-full min-h-screen h-[100svh] flex items-center justify-center overflow-hidden bg-black text-white select-none"
    >
      {/* 
        MANDATORY HERO VIDEO BACKGROUND (Monochrome black & white)
        - Desktop: object-center
        - Mobile: object-[50%_20%] prioritizing face and upper body
        - Preload="auto" for rapid buffering
        - loop={true} for continuous seamless playback
        - Preserves currentTime on scroll navigation
      */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {/* High-Resolution Poster Frame Fallback in Full Natural Color */}
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-[50%_20%] md:bg-center contrast-[1.05] brightness-[0.95] transition-opacity duration-1000 ${
            isReady && isPlaying ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundImage: `url(${personalData.heroPoster})` }}
        />

        <video
          ref={videoRef}
          src={personalData.heroVideo}
          poster={personalData.heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-[50%_20%] md:object-center contrast-[1.05] brightness-[0.95] transition-opacity duration-1000"
          style={{ opacity: isReady && isPlaying ? 1 : 0 }}
        />

        {/* Cinematic Vignette */}
        <div className="cinematic-vignette absolute inset-0 pointer-events-none" />

        {/* Ambient Subtle Indigo/Cyan Backlight Aura */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_35%,rgba(30,58,138,0.22)_0%,rgba(14,165,233,0.06)_45%,transparent_75%)]" />

        {/* Multi-layered dark gradients for seamless transition to About */}
        <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Floating Sound Toggle & Buffering Status */}
      <div className="absolute top-24 right-6 md:top-28 md:right-12 z-20 flex items-center gap-3">
        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 border border-sky-500/20 text-sky-200 text-[11px] font-mono tracking-wider backdrop-blur-md">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
            <span className="hidden sm:inline">BUFFERING</span>
          </div>
        )}

        {/* Play Button Fallback if browser restricted autoplay */}
        {hasAutoplayFailed && !isPlaying && (
          <button
            type="button"
            onClick={handleManualPlay}
            aria-label="Play Hero Video"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-400/40 text-white text-xs font-mono tracking-wider hover:bg-sky-500/30 transition-all animate-pulse shadow-xl"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>PLAY VIDEO</span>
          </button>
        )}

        {/* Functional Audio Toggle with Memory */}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? 'Enable sound' : 'Mute sound'}
          className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/70 hover:bg-slate-900/80 backdrop-blur-md border border-white/15 hover:border-sky-500/40 text-white transition-all duration-300 shadow-xl"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
          ) : (
            <Volume2 className="w-4 h-4 text-sky-400 animate-bounce" />
          )}
          <span className="text-[11px] font-mono tracking-wider text-zinc-400 group-hover:text-white transition-colors hidden sm:inline">
            {isMuted ? 'SOUND OFF' : 'AUDIO ACTIVE'}
          </span>
          {!isMuted && (
            <span className="flex items-center gap-0.5 ml-1">
              <span className="w-0.5 h-3 bg-sky-400 animate-pulse" />
              <span className="w-0.5 h-2 bg-indigo-400 animate-pulse delay-75" />
              <span className="w-0.5 h-4 bg-emerald-400 animate-pulse delay-150" />
            </span>
          )}
        </button>
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-16 md:pb-20 pt-32 h-full pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
          {/* Eyebrow & Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 mb-4 md:mb-6"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-200 text-[11px] md:text-xs font-mono tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <Sparkles className="w-3 h-3 text-sky-400" />
              {personalData.eyebrow}
            </span>

            <span className="hidden sm:inline-flex items-center gap-2 text-[11px] font-mono text-zinc-300 tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              </span>
              <span className="text-emerald-300 font-medium">{personalData.heroBadge}</span>
            </span>
          </motion.div>

          {/* Main Oversized Heading (Pure Monochrome) */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] uppercase leading-[0.92] text-white drop-shadow-xl mb-4"
          >
            <span>BUILDING</span>
            <br />
            <span className="text-zinc-300">DIGITAL</span>
            <br />
            <span className="text-zinc-500 hover:text-white transition-colors duration-500">
              EXPERIENCES.
            </span>
          </motion.h1>

          {/* Professional Identity Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl font-bold tracking-[0.2em] text-zinc-200 uppercase mb-3 flex items-center gap-2"
          >
            <span>FULL-STACK WEB DEVELOPER</span>
            <span className="text-zinc-500">&amp;</span>
            <span>AI DEVELOPER</span>
          </motion.h2>

          {/* Professional Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-xl leading-relaxed mb-8 font-light"
          >
            {personalData.heroDescription}
          </motion.p>

          {/* Primary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, 'projects')}
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-slate-950 font-mono font-bold text-xs tracking-[0.2em] uppercase hover:bg-slate-100 transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] hover:scale-[1.02]"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 text-sky-600 transition-transform" />
            </a>

            <a
              href={personalData.resumePath}
              download="Chandra_Simha_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-slate-950/50 hover:bg-slate-900/70 text-slate-200 font-mono text-xs tracking-[0.2em] uppercase border border-white/20 hover:border-sky-400/50 backdrop-blur-md transition-all duration-300 shadow-lg"
            >
              <Download className="w-4 h-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
              <span>DOWNLOAD RESUME</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Indicator Pill */}
      <a
        href="#about"
        onClick={(e) => scrollToSection(e, 'about')}
        aria-label="Scroll down to About Section"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-slate-400 hover:text-sky-300 transition-colors cursor-pointer"
      >
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase">SCROLL</span>
        <div className="w-5 h-9 rounded-full border border-sky-400/30 flex items-start justify-center p-1 bg-black/50 backdrop-blur-sm shadow-[0_0_12px_rgba(56,189,248,0.2)]">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]"
          />
        </div>
      </a>
    </section>
  );
}
