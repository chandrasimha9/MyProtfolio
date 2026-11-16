'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar, Trophy } from 'lucide-react';
import { personalData } from '@/data/portfolio';
import Card3D from '@/components/Card3D';
import TextScramble from '@/components/TextScramble';

export default function Education() {
  const { education } = personalData;

  return (
    <section
      id="education"
      aria-label="Education"
      className="relative py-28 md:py-36 bg-[#07080b] dark:bg-[#07080b] light:bg-[#f8fafc] text-slate-100 dark:text-slate-100 light:text-slate-900 overflow-hidden transition-colors duration-500"
    >
      {/* Studio Background Ambient Glow */}
      <div
        className="pointer-events-none absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-sky-950/20 dark:bg-sky-950/20 light:bg-sky-100/50 blur-[150px] -z-0"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 md:mb-24">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-sky-400/80" />
            <span className="text-xs font-mono tracking-[0.25em] text-sky-400 dark:text-sky-400 light:text-sky-600 uppercase font-semibold">
              ACADEMIC BACKGROUND
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-[0.95] mb-4">
            <TextScramble text="MY EDUCATION." />
          </h2>
          <p className="text-sm font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-600 max-w-xl">
            {education.subheading}
          </p>
        </div>

        {/* Education Cards Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {education.items.map((edu, idx) => (
            <Card3D
              key={edu.degree}
              glowColor={idx === 0 ? 'sky' : idx === 1 ? 'indigo' : 'emerald'}
              className="p-8 rounded-3xl bg-zinc-950/90 dark:bg-zinc-950/90 light:bg-zinc-50 border border-sky-500/20 hover:border-sky-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.35)]">
                    {edu.score}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{edu.period}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white dark:text-white light:text-black uppercase tracking-tight mb-1">
                  {edu.degree}
                </h3>
                <h4 className="text-sm font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mb-4 font-semibold">
                  {edu.field}
                </h4>

                <p className="text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-zinc-700 mb-3">
                  {edu.institution}
                </p>

                <p className="text-[11px] font-mono text-zinc-400 mb-6 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-white dark:text-white light:text-black" />
                  <span>{edu.highlight}</span>
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10 text-[11px] font-mono text-zinc-500 leading-relaxed">
                <span className="font-semibold text-zinc-400 block mb-1">
                  Core Syllabus:
                </span>
                {edu.courses}
              </div>
            </Card3D>
          ))}
        </div>

        {/* Pathway to LeetCode Milestones */}
        <div className="mt-14 flex justify-center">
          <a
            href="#achievements"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:scale-105"
          >
            <Trophy className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>View 100+ LeetCode &amp; Algorithm Milestones</span>
            <span className="text-amber-400 group-hover:translate-y-0.5 transition-transform">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
