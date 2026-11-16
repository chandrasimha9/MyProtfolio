'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, CheckCircle2, Play, RotateCcw, Sparkles } from 'lucide-react';
import Card3D from '@/components/Card3D';
import TextScramble from '@/components/TextScramble';

// Initial array matching reference image: 17 bars
const INITIAL_ARRAY = [10, 9, 5, 6, 3, 10, 9, 8, 13, 10, 13, 14, 10, 13, 12, 11, 12];

// 32 weeks x 6 weekdays (Mon - Sat) matching reference heatmap
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate deterministic activity matrix (0 = dark, 1 = rust, 2 = orange, 3 = fiery, 4 = yellow)
function generateHeatmapData() {
  const weeks = 32;
  const rows = 6;
  const grid = [];

  // Seeded pattern to match reference image (dense activity in Jul - Dec)
  const patternSeed = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 4, 3, 4, 3, 2, 4, 3, 4, 3, 2, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 3, 3, 4, 4, 4, 3, 3, 4, 3, 4, 3, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 4, 3, 4, 3, 3, 4, 3, 4, 3, 4, 4, 3, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 4, 3, 4, 3, 3, 4, 3, 4, 3, 3, 4, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 3, 2, 4, 3, 4, 3, 2, 4, 3, 4, 4, 3, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 3, 2, 4, 3, 4, 3, 2, 4, 3, 3, 2, 1, 0,
  ];

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < weeks; c++) {
      const idx = r * weeks + c;
      const level = patternSeed[idx] || 0;
      const count = level === 0 ? 0 : level === 1 ? 1 : level === 2 ? 3 : level === 3 ? 4 : 5;
      row.push({
        col: c,
        row: r,
        level,
        count,
        date: getDateLabel(c, r),
      });
    }
    grid.push(row);
  }
  return grid;
}

function getDateLabel(col, row) {
  const monthIdx = Math.min(11, Math.floor((col / 32) * 12));
  const month = MONTHS[monthIdx];
  const day = (col * 3 + row * 2 + 1) % 28 + 1;
  return `${month} ${day}`;
}

export default function Achievements() {
  const [array, setArray] = useState(INITIAL_ARRAY);
  const [comparingIdx, setComparingIdx] = useState([-1, -1]);
  const [swappingIdx, setSwappingIdx] = useState([-1, -1]);
  const [sortedIndices, setSortedIndices] = useState(new Set());
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const isSortingRef = useRef(false);

  // Heatmap state with default hover at Oct 14 as in reference image
  const [heatmapGrid] = useState(() => generateHeatmapData());
  const [hoveredCell, setHoveredCell] = useState({
    col: 22,
    row: 2,
    count: 5,
    date: 'Oct 14',
  });

  // Interactive Algorithm Visualizer (Bubble Sort with live White SWAP arcs)
  const runSortingVisualizer = useCallback(async () => {
    if (isSortingRef.current) return;
    isSortingRef.current = true;
    setIsSorting(true);
    setIsSorted(false);
    setSortedIndices(new Set());

    let arr = [...INITIAL_ARRAY];
    const n = arr.length;
    const settled = new Set();

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isSortingRef.current) return;

        // Step 1: Compare (Cyan highlight)
        setComparingIdx([j, j + 1]);
        setSwappingIdx([-1, -1]);
        await new Promise((r) => setTimeout(r, 180));

        if (arr[j] > arr[j + 1]) {
          if (!isSortingRef.current) return;

          // Step 2: Swap (White highlight + SWAP arched arrows)
          setSwappingIdx([j, j + 1]);
          await new Promise((r) => setTimeout(r, 220));

          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);

          await new Promise((r) => setTimeout(r, 180));
        }
      }

      // Mark the end element settled (Emerald green)
      settled.add(n - i - 1);
      setSortedIndices(new Set(settled));
    }

    // Mark remaining elements settled
    for (let k = 0; k < n; k++) settled.add(k);
    setSortedIndices(new Set(settled));
    setComparingIdx([-1, -1]);
    setSwappingIdx([-1, -1]);
    setIsSorting(false);
    setIsSorted(true);
    isSortingRef.current = false;
  }, []);

  const resetVisualizer = useCallback(() => {
    isSortingRef.current = false;
    setIsSorting(false);
    setIsSorted(false);
    setComparingIdx([-1, -1]);
    setSwappingIdx([-1, -1]);
    setSortedIndices(new Set());
    setArray(INITIAL_ARRAY);
  }, []);

  // Cell color mapping
  const getCellColor = (level) => {
    switch (level) {
      case 0:
        return 'bg-[#12121e] border-white/[0.04]';
      case 1:
        return 'bg-[#b45309] border-amber-600/50 shadow-[0_0_6px_rgba(180,83,9,0.5)]';
      case 2:
        return 'bg-[#ea580c] border-orange-500/60 shadow-[0_0_8px_rgba(234,88,12,0.6)]';
      case 3:
        return 'bg-[#f97316] border-orange-400/80 shadow-[0_0_10px_rgba(249,115,22,0.7)]';
      case 4:
        return 'bg-[#fbbf24] border-yellow-300 shadow-[0_0_12px_rgba(251,191,36,0.85)]';
      default:
        return 'bg-[#12121e] border-white/[0.04]';
    }
  };

  return (
    <section
      id="achievements"
      aria-label="Achievements & LeetCode Problem Solving"
      className="relative py-28 md:py-36 bg-[#07080b] dark:bg-[#07080b] light:bg-[#f8fafc] text-slate-100 dark:text-slate-100 light:text-slate-900 overflow-hidden transition-colors duration-500"
    >
      {/* Muted Rich Ambient Glows */}
      <div
        className="pointer-events-none absolute top-1/4 right-1/4 w-[750px] h-[750px] rounded-full bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-100/50 blur-[170px] -z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 left-1/4 w-[650px] h-[650px] rounded-full bg-sky-950/20 dark:bg-sky-950/20 light:bg-sky-100/50 blur-[160px] -z-0"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-amber-400/80" />
            <span className="text-xs font-mono tracking-[0.28em] text-amber-400 dark:text-amber-400 light:text-amber-600 uppercase font-semibold">
              MILESTONES &amp; DEDICATION
            </span>
            <span className="w-8 h-[1px] bg-amber-400/80" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-[0.95] mb-4">
            <TextScramble text="CONSISTENCY BUILDS EXCELLENCE." />
          </h2>
          <p className="text-sm font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-600 max-w-xl">
            Daily dedication to algorithmic problem solving, structured data patterns, and analytical engineering.
          </p>
        </div>

        {/* Master Glassmorphic Dashboard Container (Pin-to-Pin Reference Card) */}
        <Card3D glowColor="amber" className="p-6 sm:p-8 md:p-12 rounded-3xl bg-[#0c1017]/95 dark:bg-[#0c1017]/95 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden backdrop-blur-2xl">
          {/* ========================================================= */}
          {/* 1. TOP HEADER: GLOWING SWIRL TROPHY & BADGES */}
          {/* ========================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10 dark:border-white/10 light:border-slate-200">
            <div className="flex items-center gap-5">
              {/* Golden Trophy with Orbital Swirl Aura */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
                {/* Swirling Amber/Gold Halo */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/40 via-yellow-400/30 to-orange-500/40 blur-md animate-pulse-slow" />
                <svg
                  className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] pointer-events-none"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="url(#trophySwirlGrad)"
                    strokeWidth="2.5"
                    strokeDasharray="160 40"
                    className="animate-spin-slow origin-center opacity-80"
                  />
                  <defs>
                    <linearGradient id="trophySwirlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Trophy Core Container */}
                <div className="relative z-10 w-full h-full rounded-2xl bg-gradient-to-b from-[#2a1e0b] to-[#120d05] border border-amber-400/50 flex flex-col items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(245,158,11,0.35)]">
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                  <span className="text-[11px] sm:text-xs font-black font-mono text-amber-200 tracking-tight -mt-0.5">
                    100+
                  </span>
                </div>
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white dark:text-white light:text-slate-900 tracking-tight uppercase leading-tight">
                  100+ LEETCODE PROBLEMS SOLVED
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono uppercase bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 font-semibold tracking-wider">
                    ALGORITHMIC PROBLEM SOLVER
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Problem Solver Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/40 dark:bg-emerald-950/40 light:bg-emerald-50 border border-emerald-500/40 dark:border-emerald-500/40 light:border-emerald-300 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 text-xs font-mono font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Problem Solver</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. "DAILY ACTIVITY & STREAK" + 12 WEEK SUBMISSION HEATMAP */}
          {/* ========================================================= */}
          <div className="mb-10 p-5 sm:p-7 rounded-2xl bg-[#090d14]/90 dark:bg-[#090d14]/90 light:bg-slate-50/80 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 shadow-inner relative">
            {/* Heatmap Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-white dark:text-white light:text-slate-900 font-mono">
                  DAILY ACTIVITY &amp; STREAK
                </h4>
                <div className="text-[11px] font-mono text-zinc-400 tracking-wider">
                  12 WEEK SUBMISSION CALENDAR
                </div>
              </div>

              {/* Current Streak & Active Days */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-950/40 border border-orange-500/30 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.25)]">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20 animate-pulse" />
                  <span className="font-bold tracking-wider">
                    CURRENT STREAK: <span className="text-white">42 DAYS</span>
                  </span>
                </div>
                <div className="hidden sm:inline-flex items-center text-zinc-400 font-semibold tracking-wider">
                  TOTAL ACTIVE DAYS: <span className="text-white ml-1.5 font-bold">180+</span>
                </div>
              </div>
            </div>

            {/* Months Header Labels */}
            <div className="relative pl-10 pr-2 mb-2 hidden sm:flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              {MONTHS.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>

            {/* Heatmap Matrix with Overlay Spline Curve */}
            <div className="relative overflow-x-auto pb-2">
              <div className="min-w-[620px] flex">
                {/* Day Labels on Left */}
                <div className="flex flex-col justify-between pr-3 text-[10px] font-mono text-zinc-500 leading-none py-1 select-none">
                  {DAYS.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>

                {/* Heatmap Grid & Overlay Curve */}
                <div className="relative flex-1">
                  {/* Grid of Cells */}
                  <div
                    className="grid gap-1 sm:gap-1.5"
                    style={{ gridTemplateColumns: 'repeat(32, minmax(0, 1fr))' }}
                  >
                    {heatmapGrid.map((row, rIdx) =>
                      row.map((cell) => {
                        const isHovered =
                          hoveredCell &&
                          hoveredCell.col === cell.col &&
                          hoveredCell.row === cell.row;

                        return (
                          <div
                            key={`${cell.col}-${cell.row}`}
                            onMouseEnter={() => setHoveredCell(cell)}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] border cursor-pointer transition-all duration-150 ${getCellColor(
                              cell.level
                            )} ${
                              isHovered
                                ? 'scale-125 z-20 border-2 border-sky-400 shadow-[0_0_12px_#38bdf8]'
                                : 'hover:scale-110'
                            }`}
                          />
                        );
                      })
                    )}
                  </div>

                  {/* Dynamic Glowing Orange Spline Wave */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                    viewBox="0 0 620 110"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <filter id="neonOrangeGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f97316" />
                        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ea580c" />
                      </filter>
                    </defs>
                    <path
                      d="M 10 95 C 100 95, 140 92, 180 85 C 220 78, 250 88, 290 75 C 330 60, 360 40, 400 32 C 440 25, 470 55, 510 38 C 550 25, 580 45, 615 35"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      filter="url(#neonOrangeGlow)"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating Tooltip Pill (Default Oct 14 as in Reference Image) */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs font-mono">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-sky-400 text-sky-300 font-bold shadow-[0_0_15px_rgba(56,189,248,0.35)]">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                <span>
                  {hoveredCell.count} Problems Solved • {hoveredCell.date}
                </span>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#12121e] border border-white/10" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#b45309]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#ea580c]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#fbbf24]" />
                <span>180+ More</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. "THE ALGORITHM VISUALIZER" (Electric Cyan Glowing Box) */}
          {/* ========================================================= */}
          <div className="mb-10 p-5 sm:p-7 rounded-2xl bg-[#090d14]/95 border-2 border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.3),inset_0_0_20px_rgba(56,189,248,0.08)] relative overflow-hidden">
            {/* Visualizer Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black font-mono tracking-wider uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                  THE ALGORITHM VISUALIZER
                </span>
                <span className="text-xs font-mono text-sky-400">
                  (interactive playground)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={runSortingVisualizer}
                  disabled={isSorting}
                  className="px-4 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-400 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_18px_rgba(16,185,129,0.35)] disabled:opacity-50 hover:scale-105 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                  <span>{isSorting ? 'SORTING...' : 'RUN VISUALIZER'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetVisualizer}
                  disabled={isSorting}
                  aria-label="Reset Array"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Array Bars Container with Arched SWAP Indicator */}
            <div className="relative pt-8 pb-3 px-2 sm:px-6 rounded-xl bg-[#06080d] border border-white/[0.08] flex items-end justify-between gap-1.5 sm:gap-2.5 h-44 overflow-hidden">
              {array.map((val, idx) => {
                const isSwapping = swappingIdx.includes(idx);
                const isComparing = comparingIdx.includes(idx);
                const isSettled = sortedIndices.has(idx);

                // Heights normalized (val ranges 3 to 17 -> 20% to 92%)
                const heightPct = Math.round((val / 18) * 85 + 10);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                    {/* SWAP Arched Arrow Indicator on Active Swapping Bar */}
                    {isSwapping && swappingIdx[0] === idx && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30">
                        <span className="text-[10px] font-mono font-black text-white bg-slate-900/90 px-1.5 py-0.5 rounded border border-white/30 shadow-[0_0_10px_#fff]">
                          SWAP
                        </span>
                        <svg className="w-6 h-3 text-white overflow-visible" viewBox="0 0 24 12">
                          <path
                            d="M 2 10 Q 12 -2, 22 10"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Numeric Height Value Label */}
                    <span
                      className={`text-[10px] font-mono font-bold mb-1 transition-colors ${
                        isSwapping
                          ? 'text-white drop-shadow-[0_0_6px_#fff]'
                          : isComparing
                          ? 'text-sky-300'
                          : isSettled
                          ? 'text-emerald-300'
                          : 'text-zinc-500'
                      }`}
                    >
                      {val}
                    </span>

                    {/* Dynamic Bar with Color States */}
                    <motion.div
                      layout
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-200 ${
                        isSwapping
                          ? 'bg-white shadow-[0_0_20px_#ffffff]'
                          : isComparing
                          ? 'bg-[#00f0ff] shadow-[0_0_15px_#00f0ff]'
                          : isSettled
                          ? 'bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.6)]'
                          : 'bg-[#10b981]/90 hover:bg-[#10b981]'
                      }`}
                    />
                  </div>
                );
              })}

              {/* Time Complexity Badge on Right */}
              <div className="absolute right-4 top-4 hidden md:flex items-center justify-center px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-400 text-purple-300 font-mono font-black text-xs shadow-[0_0_15px_rgba(168,85,247,0.35)]">
                O(N)
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. FOUR RICH GLASSMORPHIC METRIC CARDS WITH MINI-SPLINES */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: 100+ Problems Solved */}
            <Card3D glowColor="amber" className="p-5 rounded-2xl bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-50/50 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.15)] group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-black font-mono text-white dark:text-white light:text-slate-900">
                  100+
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
              </div>
              <div className="text-[11px] font-mono font-bold tracking-wider text-amber-300 uppercase mb-3">
                PROBLEMS SOLVED
              </div>
              {/* Golden Mini Spline */}
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 35">
                <path
                  d="M 5 28 Q 25 15, 45 22 T 75 12 T 95 24"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="75" cy="12" r="3.5" fill="#fbbf24" className="shadow-[0_0_8px_#fbbf24]" />
              </svg>
            </Card3D>

            {/* Card 2: Python Primary Language */}
            <Card3D glowColor="cyan" className="p-5 rounded-2xl bg-sky-950/20 dark:bg-sky-950/20 light:bg-sky-50/50 border border-sky-500/30 hover:border-sky-400/60 transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(56,189,248,0.15)] group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-black font-mono text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                  Python <span className="text-base">🐍</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
              </div>
              <div className="text-[11px] font-mono font-bold tracking-wider text-sky-300 uppercase mb-3">
                PRIMARY LANGUAGE
              </div>
              {/* Cyan / Amber Dual-Tone Mini Spline */}
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 35">
                <path
                  d="M 5 25 Q 30 5, 50 25 T 80 16 T 95 22"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="25" r="3.5" fill="#f59e0b" className="shadow-[0_0_8px_#f59e0b]" />
              </svg>
            </Card3D>

            {/* Card 3: DSA & Problem Solving */}
            <Card3D glowColor="indigo" className="p-5 rounded-2xl bg-indigo-950/20 dark:bg-indigo-950/20 light:bg-indigo-50/50 border border-indigo-500/30 hover:border-indigo-400/60 transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(99,102,241,0.15)] group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-black font-mono text-white dark:text-white light:text-slate-900">
                  DSA &amp;
                </span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
              </div>
              <div className="text-[11px] font-mono font-bold tracking-wider text-indigo-300 uppercase mb-3">
                PROBLEM SOLVING
              </div>
              {/* Electric Blue Mini Spline */}
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 35">
                <path
                  d="M 5 28 Q 20 28, 40 22 T 75 14 T 95 18"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="75" cy="14" r="3.5" fill="#818cf8" className="shadow-[0_0_8px_#818cf8]" />
              </svg>
            </Card3D>

            {/* Card 4: Continuous Growth */}
            <Card3D glowColor="purple" className="p-5 rounded-2xl bg-purple-950/20 dark:bg-purple-950/20 light:bg-purple-50/50 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(168,85,247,0.15)] group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl sm:text-2xl font-black font-mono text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                  Growth <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400/30" />
                </span>
                <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
              </div>
              <div className="text-[11px] font-mono font-bold tracking-wider text-purple-300 uppercase mb-3">
                CONTINUOUS GROWTH
              </div>
              {/* Luminous Purple Mini Spline */}
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 35">
                <path
                  d="M 5 30 Q 30 26, 50 20 T 80 12 T 95 10"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="80" cy="12" r="3.5" fill="#c084fc" className="shadow-[0_0_8px_#c084fc]" />
              </svg>
            </Card3D>
          </div>
        </Card3D>
      </div>
    </section>
  );
}
