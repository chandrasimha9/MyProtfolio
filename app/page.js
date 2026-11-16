'use client';

import { useState } from 'react';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Achievements from '@/components/Achievements';
import HorizontalScroll from '@/components/HorizontalScroll';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ThreeCanvas from '@/components/ThreeCanvas';
import CustomCursor from '@/components/CustomCursor';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Initialize Lenis smooth scroll synchronized with GSAP ScrollTrigger
  useSmoothScroll();

  return (
    <>
      {/* SECTION 01: CINEMATIC PRELOADER */}
      {!loadingComplete && (
        <Preloader onComplete={() => setLoadingComplete(true)} />
      )}

      {/* Interactive 3D WebGL / Canvas Geometric Particle Background */}
      <ThreeCanvas />

      {/* Hardware-Accelerated Minimal Monochrome Cursor */}
      <CustomCursor />

      {/* Main Portfolio Container (Cinematic Quiet Luxury Theme) */}
      <div className="relative min-h-screen bg-[#07080b] dark:bg-[#07080b] light:bg-[#f8fafc] text-slate-100 dark:text-slate-100 light:text-slate-900 transition-colors duration-500">
        {/* SECTION 02: NAVIGATION */}
        <Navbar />

        {/* SECTION 03: HERO WITH UPLOADED VIDEO */}
        <Hero />

        {/* SECTION 04: ABOUT ME + EDITORIAL PORTRAIT IMAGE CARD */}
        <About />

        {/* SECTION 05: TECHNICAL SKILLS */}
        <Skills />

        {/* SECTION 06: PROJECTS + LIVE RAG & FRAUD DETECTOR SIMULATORS */}
        <Projects />

        {/* SECTION 07: INTERNSHIP EXPERIENCE */}
        <Experience />

        {/* SECTION 08: EDUCATION */}
        <Education />

        {/* SECTION 09: ACHIEVEMENTS + LIVE DSA ALGORITHM VISUALIZER */}
        <Achievements />

        {/* SECTION 10: CINEMATIC HORIZONTAL SCROLL */}
        <HorizontalScroll />

        {/* SECTION 11: CONTACT */}
        <Contact />

        {/* SECTION 12: FOOTER */}
        <Footer />
      </div>
    </>
  );
}
