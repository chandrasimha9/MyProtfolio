'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    // Warm up video & poster cache in the browser
    try {
      const v = document.createElement('video');
      v.src = '/videos/chandra-hero.mp4';
      v.preload = 'auto';
      v.load();

      const img = new Image();
      img.src = '/images/chandra-hero-poster.jpeg';
    } catch {}

    const duration = 1600; // ms
    const startTime = performance.now();

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        exitPreloader();
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);

    const exitPreloader = () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            if (onComplete) onComplete();
          },
        });

        tl.to([titleRef.current, subtitleRef.current, barRef.current], {
          y: -25,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.in',
        })
          .to(
            containerRef.current,
            {
              yPercent: -100,
              duration: 0.8,
              ease: 'power4.inOut',
            },
            '-=0.1'
          );
      }, containerRef);

      return () => ctx.revert();
    };

    return () => cancelAnimationFrame(animFrame);
  }, [onComplete]);

  return (
    <aside
      ref={containerRef}
      aria-label="Loading Chandra Simha Portfolio"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07080b] text-slate-100 select-none"
    >
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Animated Brand Title */}
        <h1
          ref={titleRef}
          className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[0.25em] uppercase text-white mb-4"
        >
          CHANDRA <span className="text-zinc-500">SIMHA.</span>
        </h1>

        {/* Animated Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xs md:text-sm tracking-[0.25em] text-zinc-400 uppercase font-mono mb-10"
        >
          FULL-STACK DEVELOPER <span className="text-sky-500">|</span> AI DEVELOPER
        </p>

        {/* Progress Bar Container with Luminous Gradient */}
        <div ref={barRef} className="w-56 md:w-72 flex flex-col items-center gap-3">
          <div className="w-full h-[2px] bg-slate-900 rounded-full overflow-hidden relative border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-75 ease-out rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between w-full text-[11px] font-mono text-zinc-500">
            <span className="tracking-widest">INITIALIZING</span>
            <span className="text-sky-300 font-semibold">{progress}%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
