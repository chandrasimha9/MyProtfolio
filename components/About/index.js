'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Code2, Layers, Cpu } from 'lucide-react';
import { personalData } from '@/data/portfolio';
import Card3D from '@/components/Card3D';
import ChromeSphereCanvas from './ChromeSphereCanvas';

// Cinematic word-by-word blur-to-sharp reveal component
function CinematicHeading({ text, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 24,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.h2
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`font-black tracking-tight uppercase leading-[0.92] ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block mr-[0.28em] will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Mouse Parallax for Floating 3D Portrait Frame
  const portraitCardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [reflection, setReflection] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    const card = portraitCardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle natural tilt (max 8 degrees for luxury realism)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setRotation({ x: rotateX, y: rotateY });
    setReflection({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.2,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setReflection((prev) => ({ ...prev, opacity: 0 }));
  };

  const paragraphs = [
    "Hello, I'm Chandra Simha, a Full-Stack Web Developer and AI Developer passionate about building meaningful digital experiences.",
    "I enjoy developing modern web applications, working with Python and backend technologies, managing databases, and exploring artificial intelligence and machine learning.",
    "I believe great technology is not just about writing code — it's about solving real problems, creating useful experiences, and continuously learning.",
  ];

  const infoMetrics = [
    {
      value: '100+',
      label: 'LeetCode Problems Solved',
      icon: Code2,
      sublabel: 'Algorithmic Problem Solving',
      color: 'amber',
    },
    {
      value: 'FULL STACK',
      label: 'Web Development',
      icon: Layers,
      sublabel: 'React • FastAPI • MySQL',
      color: 'cyan',
    },
    {
      value: 'AI & ML',
      label: 'Intelligent Applications',
      icon: Cpu,
      sublabel: 'RAG • Scikit-Learn • NLP',
      color: 'indigo',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Chandra Simha"
      className="relative py-28 md:py-36 bg-[#07080b] dark:bg-[#07080b] light:bg-[#f8fafc] text-slate-100 dark:text-slate-100 light:text-slate-900 overflow-hidden select-none transition-colors duration-500"
    >
      {/* Studio Ambient Aurora Glow in Background */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 w-[650px] h-[650px] rounded-full bg-indigo-950/25 dark:bg-indigo-950/25 light:bg-indigo-100/50 blur-[150px] -z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-sky-950/20 dark:bg-sky-950/20 light:bg-sky-100/50 blur-[140px] -z-0"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="w-8 h-[1px] bg-white/60 dark:bg-white/60 light:bg-black/60" />
          <span className="text-xs font-mono tracking-[0.3em] text-zinc-400 dark:text-zinc-400 light:text-zinc-600 uppercase">
            ABOUT ME
          </span>
        </motion.div>

        {/* Two-Column Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ========================================================= */}
          {/* LEFT SIDE: FLOATING 3D PORTRAIT & REALISTIC CHROME SPHERE */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* 3D Perspective Wrapper */}
            <div
              style={{ perspective: 1200 }}
              className="w-full max-w-[420px] relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Floating Animation Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.92, y: 30 }
                }
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="animate-float-slow"
              >
                {/* 3D Tilting Photographic Frame */}
                <div
                  ref={portraitCardRef}
                  style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(0px)`,
                    transition: 'transform 0.18s ease-out',
                    transformStyle: 'preserve-3d',
                  }}
                  className="relative rounded-3xl p-3 bg-gradient-to-b from-white/20 via-white/5 to-white/10 dark:from-white/15 dark:via-zinc-900/60 dark:to-white/5 light:from-black/10 light:via-white light:to-black/5 border border-white/20 dark:border-white/20 light:border-black/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md group"
                >
                  {/* Subtle Studio Glass Reflection Overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-3xl z-30 transition-opacity duration-300"
                    style={{
                      opacity: reflection.opacity,
                      background: `radial-gradient(circle 350px at ${reflection.x}% ${reflection.y}%, rgba(255, 255, 255, 0.28), transparent 70%)`,
                    }}
                  />

                  {/* Inner Photo Frame with Soft White Rim Lighting */}
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-white/15 dark:border-white/15 light:border-black/10 shadow-inner">
                    <Image
                      src={personalData.heroPoster}
                      alt="G Raja Chandra Simha Yadav — Full-Stack Web Developer & AI Developer"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="object-cover object-[50%_20%] contrast-[1.05] brightness-[0.98] group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Studio Subtle Gradient Vignette over photo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 pointer-events-none" />

                    {/* Studio Frame Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/90">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 uppercase flex items-center gap-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        PORTRAIT STUDIO
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 uppercase">
                        CHANDRA SIMHA
                      </span>
                    </div>

                    {/* Bottom Frame Meta */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white pointer-events-none">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-0.5">
                          CREATIVE ARCHITECT
                        </span>
                        <h4 className="text-base font-bold tracking-tight">
                          G Raja Chandra Simha
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded bg-black/60 border border-white/10">
                        2026
                      </span>
                    </div>
                  </div>

                  {/* Beveled Thickness Edge Simulation */}
                  <div className="mt-3 px-2 flex items-center justify-between text-[11px] font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                    <span className="tracking-widest uppercase">
                      FULL-STACK &amp; AI
                    </span>
                    <span className="flex items-center gap-1 text-white dark:text-white light:text-black font-semibold">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* ========================================================= */}
              {/* SECOND FEATURE: REALISTIC POLISHED CHROME SPHERE (Three.js) */}
              {/* ========================================================= */}
              <div
                className="absolute -bottom-8 -right-6 sm:-bottom-10 sm:-right-8 w-44 h-44 sm:w-52 sm:h-52 z-30 pointer-events-none"
                style={{
                  filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.8))',
                }}
              >
                <ChromeSphereCanvas className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: CINEMATIC EDITORIAL TYPOGRAPHY & DETAILS */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Main Heading with Word-by-Word Blur-to-Sharp Transition */}
              <CinematicHeading
                text="BEHIND THE CODE."
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white dark:text-white light:text-black mb-4"
              />

              {/* Supporting Heading & Professional Identity */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }
                }
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase text-zinc-300 dark:text-zinc-300 light:text-zinc-700 mb-1">
                  I&apos;M CHANDRA SIMHA.
                </h3>
                <p className="text-xs sm:text-sm font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-400 light:text-zinc-600 uppercase font-semibold">
                  FULL-STACK WEB DEVELOPER &amp; AI DEVELOPER
                </p>
              </motion.div>

              {/* Line-by-Line Personal Introduction (Exact Master Prompt Content) */}
              <div className="space-y-4 mb-12 max-w-2xl">
                {paragraphs.map((line, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{
                      duration: 0.7,
                      delay: 0.45 + idx * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-sm sm:text-base md:text-lg text-zinc-300 dark:text-zinc-300 light:text-zinc-700 leading-relaxed font-light"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* ========================================================= */}
            {/* THREE PREMIUM INFORMATION ELEMENTS (Muted Rich Cyber-Jewel Theme) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 dark:border-white/10 light:border-black/10">
              {infoMetrics.map((item, idx) => {
                const Icon = item.icon;
                const isAmber = item.color === 'amber';
                const isCyan = item.color === 'cyan';
                const isIndigo = item.color === 'indigo';

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{
                      duration: 0.6,
                      delay: 0.8 + idx * 0.12,
                    }}
                    className="w-full h-full"
                  >
                    <Card3D
                      glowColor={item.color}
                      className={`p-5 rounded-2xl bg-slate-950/70 dark:bg-slate-950/70 light:bg-white border backdrop-blur-md transition-all duration-300 group shadow-lg flex flex-col justify-between h-full ${
                        isCyan
                          ? 'border-sky-500/20 hover:border-sky-500/40 hover:shadow-[0_8px_25px_rgba(56,189,248,0.15)]'
                          : isIndigo
                          ? 'border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-[0_8px_25px_rgba(99,102,241,0.15)]'
                          : 'border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_8px_25px_rgba(245,158,11,0.15)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-110 ${
                              isCyan
                                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                                : isIndigo
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">
                            0{idx + 1}
                          </span>
                        </div>

                        <div className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 tracking-tight font-mono mb-1">
                          {item.value}
                        </div>

                        <div className="text-xs font-mono font-bold tracking-wider text-zinc-300 dark:text-zinc-300 light:text-zinc-700 uppercase mb-1">
                          {item.label}
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-500 pt-2 border-t border-white/5">
                        {item.sublabel}
                      </div>
                    </Card3D>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
