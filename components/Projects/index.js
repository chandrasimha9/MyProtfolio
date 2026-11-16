'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ChevronRight,
  X,
  Cpu,
  Layers,
  ShieldCheck,
  Database,
  FileText,
  Search,
  Activity,
  Sliders,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { projectsData } from '@/data/projects';
import Card3D from '@/components/Card3D';
import TextScramble from '@/components/TextScramble';
import InteractiveArchitectureModal from './InteractiveArchitectureModal';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Project 01: CampusGPT Interactive RAG Query State
  const [ragQuery, setRagQuery] = useState('attendance');
  const ragQueries = {
    attendance: {
      question: 'What is the minimum attendance requirement for semester exams?',
      score: '0.94 Cosine Similarity',
      chunk: 'Academic Regulation §4.2: Candidates must secure a minimum of 75% aggregate attendance to be eligible for end-semester examinations.',
      response: 'Based on institutional policy §4.2, students require at least 75% aggregate attendance to appear for semester exams.',
    },
    grading: {
      question: 'How is the SGPA calculated across elective credits?',
      score: '0.91 Cosine Similarity',
      chunk: 'Curriculum Framework §8.1: SGPA = Σ(Credit × Grade Point) / Σ(Total Credits registered in the semester).',
      response: 'SGPA is computed by weighting earned grade points by course credits divided by total registered semester credits.',
    },
    placements: {
      question: 'What are the eligibility criteria for campus placement drives?',
      score: '0.88 Cosine Similarity',
      chunk: 'Training & Placement Policy §2.0: Minimum 7.5 CGPA with no active backlogs at the start of the 7th semester.',
      response: 'Students must maintain a minimum 7.5 CGPA and have cleared all backlogs prior to the 7th semester placement cycle.',
    },
  };

  // Project 02: FraudShield AI Simulator State
  const [txAmount, setTxAmount] = useState(450);
  const [txVelocity, setTxVelocity] = useState(2);
  const [txForeign, setTxForeign] = useState(false);

  // Compute live fraud risk score (Monochrome indicators)
  const fraudScore = Math.min(
    99,
    Math.round(
      (txAmount / 5000) * 45 + (txVelocity / 10) * 35 + (txForeign ? 25 : 0)
    )
  );
  const isSuspicious = fraudScore > 50;

  // Project 03: Hospital Management Active Tab
  const [hospitalTab, setHospitalTab] = useState('appointments');

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-label="Selected Projects Exhibition"
      className="relative py-28 md:py-36 bg-[#07080b] dark:bg-[#07080b] light:bg-[#f8fafc] text-slate-100 dark:text-slate-100 light:text-slate-900 overflow-hidden select-none transition-colors duration-500"
    >
      {/* Studio Lighting Background Glow (Muted Rich Orbs) */}
      <div
        className="pointer-events-none absolute top-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-sky-950/20 dark:bg-sky-950/20 light:bg-sky-100/50 blur-[160px] -z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-950/20 dark:bg-indigo-950/20 light:bg-indigo-100/50 blur-[150px] -z-0"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col items-start mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="w-8 h-[1px] bg-white/60 dark:bg-white/60 light:bg-black/60" />
            <span className="text-xs font-mono tracking-[0.28em] text-zinc-400 dark:text-zinc-400 light:text-zinc-600 uppercase">
              CINEMATIC 3D PROJECT SHOWCASE
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-[0.95] mb-4 text-white dark:text-white light:text-black">
            <TextScramble text="SELECTED WORK." />
          </h2>
          <p className="text-sm font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-600 max-w-xl">
            A curated exhibition of engineering concepts and full-stack software applications spanning Retrieval-Augmented Generation, predictive machine learning, and healthcare management.
          </p>
        </div>

        {/* 3D Exhibition Panels List */}
        <div className="space-y-20">
          {/* ========================================================= */}
          {/* PROJECT 01: CAMPUSGPT — FLOATING DOCUMENT & RAG RETRIEVAL */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <Card3D glowColor="indigo" className="p-8 md:p-12 rounded-3xl bg-zinc-950/90 dark:bg-zinc-950/90 light:bg-zinc-50 border border-white/15 dark:border-white/15 light:border-black/10 border-b-4 border-r-2 shadow-2xl group transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Overview */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono text-indigo-400 dark:text-indigo-400 light:text-indigo-600 font-semibold tracking-widest">
                        PROJECT 01
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-indigo-500/10 border border-indigo-500/25 text-indigo-300">
                        RAG System Architecture
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-5xl font-black text-white dark:text-white light:text-black tracking-tight uppercase mb-2">
                      CAMPUSGPT
                    </h3>
                    <p className="text-sm font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mb-4">
                      College Knowledge Assistant • RAG &amp; Vector Search
                    </p>

                    <p className="text-sm text-zinc-300 dark:text-zinc-300 light:text-zinc-700 leading-relaxed mb-6 font-light">
                      A college-focused assistant concept designed to help students find grounded answers directly from academic handbooks, semester regulations, syllabus circulars, and campus FAQs without AI hallucination.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {[
                        { name: 'Python', style: 'bg-blue-500/10 text-blue-300 border-blue-500/25' },
                        { name: 'Embeddings', style: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25' },
                        { name: 'Vector Search', style: 'bg-purple-500/10 text-purple-300 border-purple-500/25' },
                        { name: 'RAG Concept', style: 'bg-sky-500/10 text-sky-300 border-sky-500/25' },
                        { name: 'LLM API', style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25' },
                      ].map((t) => (
                        <span
                          key={t.name}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono border backdrop-blur-sm ${t.style}`}
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(projectsData[0])}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/40 hover:border-indigo-400 text-indigo-300 hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 group/btn self-start"
                  >
                    <span className="text-sm">⚡</span>
                    <span>VIEW ARCHITECTURAL FLOW DIAGRAM</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Right: Floating Document Sheets & Search Node Visualizer */}
                <div className="lg:col-span-6 p-6 md:p-8 rounded-2xl bg-black border border-white/15 text-white font-mono text-xs relative overflow-hidden shadow-2xl">
                  {/* Floating Document Layers in 3D */}
                  <div className="relative mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-4">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-zinc-300" />
                        <span>KNOWLEDGE CHUNKS RETRIEVAL</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 text-[10px]">
                        COSINE SEARCH
                      </span>
                    </div>

                    {/* Query Selector Tabs */}
                    <div className="flex gap-2 mb-4">
                      {Object.keys(ragQueries).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setRagQuery(key)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] uppercase transition-all ${
                            ragQuery === key
                              ? 'bg-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                              : 'bg-white/5 text-zinc-400 hover:text-indigo-300 border border-white/10'
                          }`}
                        >
                          {key}
                        </button>
                      ))}
                    </div>

                    {/* Active Question */}
                    <div className="p-3 rounded-xl bg-zinc-900/90 border border-indigo-500/20 mb-3 flex items-start gap-2">
                      <Search className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-200 text-xs">
                        {ragQueries[ragQuery].question}
                      </span>
                    </div>

                    {/* Retrieved Chunk with Animated Connecting Flow */}
                    <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/25 relative">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1.5">
                        <span className="text-white font-semibold">RETRIEVED DOCUMENT PASSAGE:</span>
                        <span className="text-emerald-400 font-mono font-semibold">{ragQueries[ragQuery].score}</span>
                      </div>
                      <p className="text-zinc-300 text-xs italic leading-relaxed">
                        &ldquo;{ragQueries[ragQuery].chunk}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Synthesized Output */}
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/20">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-1">
                      <Sparkles className="w-3 h-3 text-white" />
                      <span className="text-white font-semibold">GROUNDED SYNTHESIS:</span>
                    </div>
                    <p className="text-zinc-200 text-xs leading-relaxed">
                      {ragQueries[ragQuery].response}
                    </p>
                  </div>
                </div>
              </div>
            </Card3D>
          </motion.div>

          {/* ========================================================= */}
          {/* PROJECT 02: FRAUDSHIELD AI — 3D TRANSACTION NETWORK */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <Card3D glowColor="rose" className="p-8 md:p-12 rounded-3xl bg-zinc-950/90 dark:bg-zinc-950/90 light:bg-zinc-50 border border-white/15 dark:border-white/15 light:border-black/10 border-b-4 border-r-2 shadow-2xl group transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Overview */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono text-rose-400 dark:text-rose-400 light:text-rose-600 font-semibold tracking-widest">
                        PROJECT 02
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-rose-500/10 border border-rose-500/25 text-rose-300">
                        Machine Learning Pipeline
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-5xl font-black text-white dark:text-white light:text-black tracking-tight uppercase mb-2">
                      FRAUDSHIELD AI
                    </h3>
                    <p className="text-sm font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mb-4">
                      Fraud Detection in Online Payments • Random Forest
                    </p>

                    <p className="text-sm text-zinc-300 dark:text-zinc-300 light:text-zinc-700 leading-relaxed mb-6 font-light">
                      A machine-learning project designed to classify digital transactions as potentially suspicious or legitimate by analyzing anomalous behavioral patterns across payment amount, transaction velocity, and geographic IP origins.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {[
                        { name: 'Python', style: 'bg-blue-500/10 text-blue-300 border-blue-500/25' },
                        { name: 'Scikit-learn', style: 'bg-amber-500/10 text-amber-300 border-amber-500/25' },
                        { name: 'Pandas', style: 'bg-sky-500/10 text-sky-300 border-sky-500/25' },
                        { name: 'Random Forest', style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25' },
                        { name: 'Data Preprocessing', style: 'bg-purple-500/10 text-purple-300 border-purple-500/25' },
                      ].map((t) => (
                        <span
                          key={t.name}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono border backdrop-blur-sm ${t.style}`}
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(projectsData[1])}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/40 hover:border-rose-400 text-rose-300 hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:scale-105 active:scale-95 group/btn self-start"
                  >
                    <span className="text-sm">⚡</span>
                    <span>VIEW ARCHITECTURAL FLOW DIAGRAM</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Right: 3D Transaction Node Simulator (Rich ML State) */}
                <div className="lg:col-span-6 p-6 md:p-8 rounded-2xl bg-black border border-white/15 text-white font-mono text-xs shadow-2xl">
                  <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/10 text-zinc-400 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-400" />
                      <span>REAL-TIME TRANSACTION SCANNER</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px]">
                      PREDICTIVE ML
                    </span>
                  </div>

                  {/* Transaction Amount Slider */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-400">Transaction Value:</span>
                      <span className="text-white font-bold">${txAmount.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="5000"
                      step="50"
                      value={txAmount}
                      onChange={(e) => setTxAmount(Number(e.target.value))}
                      className="w-full accent-rose-400 cursor-pointer bg-zinc-800 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Velocity Slider */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-400">Velocity (Tx in last hour):</span>
                      <span className="text-white font-bold">{txVelocity} tx/hr</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={txVelocity}
                      onChange={(e) => setTxVelocity(Number(e.target.value))}
                      className="w-full accent-rose-400 cursor-pointer bg-zinc-800 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Foreign Location Toggle */}
                  <label className="flex items-center gap-2 text-xs text-zinc-300 mb-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={txForeign}
                      onChange={(e) => setTxForeign(e.target.checked)}
                      className="accent-rose-400 rounded cursor-pointer"
                    />
                    <span>Flagged Unrecognized Geographic Origin</span>
                  </label>

                  {/* Classification Decision Gauge (Dynamic Color Cues) */}
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                      isSuspicious
                        ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.18)]'
                        : 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.18)]'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase block mb-1">
                        Classifier Assessment:
                      </span>
                      <span className="text-sm md:text-base font-black tracking-wider uppercase flex items-center gap-1.5">
                        {isSuspicious ? (
                          <>
                            <AlertCircle className="w-4 h-4 text-rose-400" />
                            <span className="text-rose-400 font-bold">
                              [FLAGGED: SUSPICIOUS ANOMALY]
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">
                              [VERIFIED: STANDARD TRANSACTION]
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 block">Risk Metric</span>
                      <span className={`text-xl font-black font-mono ${isSuspicious ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {fraudScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card3D>
          </motion.div>

          {/* ========================================================= */}
          {/* PROJECT 03: HOSPITAL MANAGEMENT SYSTEM — 3D DASHBOARD */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <Card3D glowColor="cyan" className="p-8 md:p-12 rounded-3xl bg-zinc-950/90 dark:bg-zinc-950/90 light:bg-zinc-50 border border-white/15 dark:border-white/15 light:border-black/10 border-b-4 border-r-2 shadow-2xl group transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Overview */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono text-sky-400 dark:text-sky-400 light:text-sky-600 font-semibold tracking-widest">
                        PROJECT 03
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-sky-500/10 border border-sky-500/25 text-sky-300">
                        Full-Stack Web Engineering
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-5xl font-black text-white dark:text-white light:text-black tracking-tight uppercase mb-2">
                      HOSPITAL MANAGEMENT
                    </h3>
                    <p className="text-sm font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mb-4">
                      Healthcare Scheduling &amp; Records • FastAPI &amp; MySQL
                    </p>

                    <p className="text-sm text-zinc-300 dark:text-zinc-300 light:text-zinc-700 leading-relaxed mb-6 font-light">
                      A full-stack hospital management application for structured patient intake registration, doctor department records, and seamless appointment booking with relational MySQL persistence and RESTful endpoints.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {[
                        { name: 'Python', style: 'bg-blue-500/10 text-blue-300 border-blue-500/25' },
                        { name: 'FastAPI', style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25' },
                        { name: 'MySQL', style: 'bg-amber-500/10 text-amber-300 border-amber-500/25' },
                        { name: 'Relational Schema', style: 'bg-sky-500/10 text-sky-300 border-sky-500/25' },
                        { name: 'CRUD API', style: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25' },
                      ].map((t) => (
                        <span
                          key={t.name}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono border backdrop-blur-sm ${t.style}`}
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(projectsData[2])}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/40 hover:border-sky-400 text-sky-300 hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-105 active:scale-95 group/btn self-start"
                  >
                    <span className="text-sm">⚡</span>
                    <span>VIEW ARCHITECTURAL FLOW DIAGRAM</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Right: Floating 3D Dashboard & Appointment Cards Visual */}
                <div className="lg:col-span-6 p-6 md:p-8 rounded-2xl bg-black border border-white/15 text-white font-mono text-xs shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/10 text-zinc-400 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-sky-400" />
                      <span>RELATIONAL CLINICAL DATABASE</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px]">
                      REST API
                    </span>
                  </div>

                  {/* Dashboard Tab Selector */}
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setHospitalTab('appointments')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] uppercase transition-all ${
                        hospitalTab === 'appointments'
                          ? 'bg-sky-600 text-white font-bold shadow-[0_0_15px_rgba(2,132,199,0.4)]'
                          : 'bg-white/5 text-zinc-400 hover:text-sky-300 border border-white/10'
                      }`}
                    >
                      Active Appointments
                    </button>
                    <button
                      type="button"
                      onClick={() => setHospitalTab('doctors')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] uppercase transition-all ${
                        hospitalTab === 'doctors'
                          ? 'bg-sky-600 text-white font-bold shadow-[0_0_15px_rgba(2,132,199,0.4)]'
                          : 'bg-white/5 text-zinc-400 hover:text-sky-300 border border-white/10'
                      }`}
                    >
                      Doctor Availability
                    </button>
                  </div>

                  {hospitalTab === 'appointments' ? (
                    <div className="space-y-2.5">
                      {/* Floating Appointment Card 1 */}
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/15 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-zinc-300" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-xs">Patient #1042 — General Medicine</div>
                            <div className="text-[10px] text-zinc-500">Dr. Sharma • Cardiology Consultation</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-white/10 text-zinc-300 text-[10px] border border-white/10">
                          10:30 AM
                        </span>
                      </div>

                      {/* Floating Appointment Card 2 */}
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/15 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-zinc-300" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-xs">Patient #1048 — Neurology Follow-up</div>
                            <div className="text-[10px] text-zinc-500">Dr. Verma • Diagnostic Review</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-white/10 text-zinc-300 text-[10px] border border-white/10">
                          02:15 PM
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/15 flex items-center justify-between">
                        <div>
                          <div className="text-white font-bold text-xs">Dr. R. Sharma — Senior Cardiologist</div>
                          <div className="text-[10px] text-zinc-500">Department of Cardiology • Room 302</div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-white text-black font-bold text-[10px]">
                          AVAILABLE
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/15 flex items-center justify-between">
                        <div>
                          <div className="text-white font-bold text-xs">Dr. A. Verma — Consultant Neurologist</div>
                          <div className="text-[10px] text-zinc-500">Department of Neurology • Room 410</div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-white/10 text-zinc-300 text-[10px] border border-white/10">
                          SCHEDULED
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Database Engine Footnote */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>FastAPI Routers + MySQL Relational Persistence</span>
                    <span className="text-white font-semibold">ACID Compliant</span>
                  </div>
                </div>
              </div>
            </Card3D>
          </motion.div>
        </div>
      </div>

      {/* Interactive Animated Architecture Flow Pipeline Modal */}
      <AnimatePresence>
        {selectedProject && (
          <InteractiveArchitectureModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
