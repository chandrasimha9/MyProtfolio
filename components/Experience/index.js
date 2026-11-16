'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { personalData } from '@/data/portfolio';
import Card3D from '@/components/Card3D';
import TextScramble from '@/components/TextScramble';

export default function Experience() {
  const { experience } = personalData;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  // Scroll-linked silver light traveling along the 3D timeline
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  const timelineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const lightPosition = useTransform(scrollYProgress, [0, 1], ['0%', '98%']);

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-label="Internship Career Timeline"
      className="relative py-28 md:py-36 bg-[#07080b] dark:bg-[#07080b] light:bg-[#f8fafc] text-slate-100 dark:text-slate-100 light:text-slate-900 overflow-hidden select-none transition-colors duration-500"
    >
      {/* Studio Background Ambient Glow */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/4 w-[650px] h-[650px] rounded-full bg-sky-950/20 dark:bg-sky-950/20 light:bg-sky-100/50 blur-[150px] -z-0"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="w-8 h-[1px] bg-sky-400/80" />
            <span className="text-xs font-mono tracking-[0.28em] text-sky-400 dark:text-sky-400 light:text-sky-600 uppercase font-semibold">
              3D CINEMATIC CAREER TIMELINE
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-[0.95] mb-4 text-white dark:text-white light:text-black">
            <TextScramble text="MY PROFESSIONAL JOURNEY." />
          </h2>
          <p className="text-sm font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-600 max-w-xl">
            Practical industry internships building web automation engines, full-stack microservices, and predictive machine learning models.
          </p>
        </div>

        {/* 3D Glowing Timeline Container */}
        <div className="relative ml-4 md:ml-10 pl-8 md:pl-16 space-y-20">
          {/* Base Inactive Track */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full" />

          {/* Active 3D Glowing Timeline Track (Luminescent Gradient) */}
          <motion.div
            style={{ height: timelineHeight }}
            className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-sky-400 via-indigo-400 to-sky-300 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.8)]"
          />

          {/* Traveling Cyan Starlight Orb */}
          <motion.div
            style={{ top: lightPosition }}
            className="absolute -left-[5px] w-3 h-3 rounded-full bg-sky-300 shadow-[0_0_15px_#38bdf8,0_0_25px_#818cf8] z-20 pointer-events-none"
          />

          {/* Milestone Items */}
          {experience.items.map((exp, idx) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -30, rotateX: 10 }}
              whileInView={{ opacity: 1, x: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: idx * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative group"
            >
              {/* Timeline Physical Beacon Node */}
              <div className="absolute -left-[41px] md:-left-[73px] top-6 w-5 h-5 rounded-full bg-black border-2 border-sky-400 group-hover:scale-125 group-hover:bg-sky-400 transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.8)] z-10 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-300 group-hover:bg-black transition-colors" />
              </div>

              {/* Connecting Laser Line to Card */}
              <div className="absolute -left-[30px] md:-left-[52px] top-8 w-[30px] md:w-[52px] h-[1px] bg-gradient-to-r from-sky-400/60 to-transparent group-hover:from-sky-300 transition-all pointer-events-none" />

              {/* 3D Milestone Floating Card with Dynamic Luminous Glow */}
              <Card3D glowColor={idx === 0 ? 'cyan' : 'indigo'} className="p-8 md:p-10 rounded-3xl bg-zinc-950/90 dark:bg-zinc-950/90 light:bg-zinc-50 border border-white/15 dark:border-white/15 light:border-black/10 border-b-4 border-r-2 hover:border-sky-500/40 dark:hover:border-sky-500/40 light:hover:border-sky-500/40 transition-all duration-300 shadow-2xl">
                {/* Milestone Period & Status Tag */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 dark:text-zinc-300 light:text-zinc-700">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>{exp.period}</span>
                  </div>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/25 uppercase font-semibold">
                    {exp.status}
                  </span>
                </div>

                {/* Role & Company */}
                <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-black uppercase tracking-tight mb-1">
                  {exp.role}
                </h3>
                <h4 className="text-sm font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mb-6 flex items-center gap-2 font-semibold">
                  <Briefcase className="w-4 h-4 text-sky-400" />
                  <span>{exp.company}</span>
                </h4>

                {/* Technologies Verified Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-md text-[11px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20 backdrop-blur-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Responsibilities List */}
                <div className="space-y-3">
                  {exp.description.map((desc, dIdx) => (
                    <div
                      key={dIdx}
                      className="flex items-start gap-3 text-xs md:text-sm text-zinc-300 dark:text-zinc-300 light:text-zinc-700 leading-relaxed font-light"
                    >
                      <ChevronRight className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                      <span>{desc}</span>
                    </div>
                  ))}
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
