'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData } from '@/data/portfolio';

export default function HorizontalScroll() {
  const containerRef = useRef(null);
  const textTrackRef = useRef(null);
  const { horizontalStatement } = personalData;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const textTrack = textTrackRef.current;
    if (!container || !textTrack) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const getScrollDistance = () => {
          return Math.max(window.innerWidth, textTrack.scrollWidth - window.innerWidth + 200);
        };

        gsap.to(textTrack, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, container);

      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="Cinematic Vision Statement"
      className="relative w-full h-screen bg-[#07080b] dark:bg-[#07080b] light:bg-[#f8fafc] text-slate-100 dark:text-slate-100 light:text-slate-900 overflow-hidden flex flex-col justify-center select-none transition-colors duration-500"
    >
      {/* Subtle Studio Lighting Orbs (Very Soft & Muted) */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-sky-950/20 dark:bg-sky-950/20 light:bg-sky-100/40 blur-[160px] -z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-950/20 dark:bg-indigo-950/20 light:bg-indigo-100/40 blur-[160px] -z-0"
        aria-hidden="true"
      />

      {/* Top Statement Eyebrow */}
      <div className="absolute top-10 sm:top-12 left-6 md:left-12 z-10 flex items-center gap-3">
        <span className="w-8 h-[1px] bg-slate-900 dark:bg-white light:bg-slate-900" />
        <span className="text-xs font-mono tracking-[0.25em] text-zinc-500 dark:text-zinc-400 light:text-zinc-600 uppercase font-semibold">
          {horizontalStatement.eyebrow}
        </span>
      </div>

      {/* Pinned Large Horizontal Text Track - Quiet Luxury Muted Colors */}
      <div
        ref={textTrackRef}
        className="flex items-center gap-12 sm:gap-24 whitespace-nowrap pl-6 sm:pl-16 w-max min-w-max will-change-transform z-10"
      >
        {/* Block 1: From Ideas To Intelligent Digital Solutions */}
        <div className="flex flex-col gap-1 sm:gap-2 flex-shrink-0">
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-slate-900 dark:text-white light:text-slate-950">
            {horizontalStatement.lines[0]}
          </span>
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-zinc-500 dark:text-zinc-400 light:text-zinc-600">
            {horizontalStatement.lines[1]}
          </span>
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-zinc-400 dark:text-zinc-600 light:text-zinc-400">
            {horizontalStatement.lines[2]}
          </span>
        </div>

        {/* Separator Accent Pill */}
        <div className="flex items-center gap-5 px-8 sm:px-10 py-5 sm:py-6 rounded-full bg-zinc-100 dark:bg-zinc-950 light:bg-zinc-100 border border-black/10 dark:border-white/10 light:border-black/10 shadow-xl flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
          <span className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-[0.25em] font-bold text-slate-900 dark:text-white light:text-slate-900">
            CHANDRA SIMHA
          </span>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 font-semibold uppercase">
            Full-Stack &amp; AI
          </span>
        </div>

        {/* Block 2: Extended Panoramic Statement */}
        <div className="flex flex-col gap-1 sm:gap-2 flex-shrink-0 opacity-90">
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-slate-900 dark:text-white light:text-slate-950">
            ENGINEERED WITH RIGOR
          </span>
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-zinc-500 dark:text-zinc-400 light:text-zinc-600">
            POWERED BY AI &amp; CODE
          </span>
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-zinc-400 dark:text-zinc-600 light:text-zinc-400">
            BUILT FOR IMPACT
          </span>
        </div>

        {/* Block 3: Muted Capability Badges */}
        <div className="flex items-center gap-4 flex-shrink-0 pr-16">
          <div className="px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/80 light:bg-zinc-100 border border-black/10 dark:border-white/10 font-mono flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">100+ LeetCode Solved</span>
          </div>
          <div className="px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/80 light:bg-zinc-100 border border-black/10 dark:border-white/10 font-mono flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">9.0 CGPA CSE Honors</span>
          </div>
          <div className="px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/80 light:bg-zinc-100 border border-black/10 dark:border-white/10 font-mono flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Full-Stack &amp; AI Systems</span>
          </div>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="absolute bottom-10 sm:bottom-12 left-6 md:left-12 z-10 max-w-xl">
        <p className="text-xs sm:text-sm font-mono text-zinc-500 dark:text-zinc-400 light:text-zinc-600">
          {horizontalStatement.tagline}
        </p>
      </div>
    </section>
  );
}