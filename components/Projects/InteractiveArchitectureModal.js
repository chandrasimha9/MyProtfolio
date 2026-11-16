'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Cpu,
  Database,
  ArrowRight,
  Sparkles,
  Layers,
  Code2,
  GitBranch,
  ShieldCheck,
  Server,
  Terminal,
} from 'lucide-react';

export default function InteractiveArchitectureModal({ project, onClose }) {
  if (!project) return null;

  // Active view tab: 'flow' or 'specs'
  const [activeTab, setActiveTab] = useState('flow');
  const [selectedNode, setSelectedNode] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStageIdx, setActiveStageIdx] = useState(-1);
  const simulationTimerRef = useRef(null);

  // Stop simulation and unlock body scroll on unmount
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
      if (simulationTimerRef.current) clearTimeout(simulationTimerRef.current);
    };
  }, []);

  // Configure Flow Nodes per Project
  const getPipelineData = () => {
    switch (project.id) {
      case 'campusgpt':
        return {
          themeColor: 'indigo',
          accentHex: '#6366f1',
          cyanHex: '#38bdf8',
          title: 'CampusGPT: Retrieval-Augmented Generation Architecture',
          tagline: 'End-to-end vector search & zero-hallucination semantic pipeline',
          stages: [
            {
              id: 'ingestion',
              label: '01. DOCUMENT INGESTION',
              name: 'Institutional PDF Extraction',
              icon: FileText,
              badge: 'PDF / Text Loader',
              desc: 'Extracts unstructured text from academic circulars, student handbooks, and exam timetables.',
              input: 'Raw documents: handbook_v4.pdf, regulations_2026.pdf',
              output: 'Structured text stream (148,000 words)',
              tech: 'PyPDF • Unstructured • Tesseract OCR',
              code: `from langchain_community.document_loaders import PyPDFLoader\n\nloader = PyPDFLoader("academic_regulations.pdf")\npages = loader.load_and_split()\nprint(f"Loaded {len(pages)} source pages")`,
            },
            {
              id: 'chunking',
              label: '02. SEMANTIC CHUNKING',
              name: 'Context-Preserving Sliding Window',
              icon: Layers,
              badge: 'Semantic Splitter',
              desc: 'Divides large texts into overlapping chunks with contextual boundaries to preserve semantic coherence.',
              input: 'Unstructured document stream',
              output: '340 semantic chunks (500 tokens, 50 token overlap)',
              tech: 'RecursiveCharacterTextSplitter • Token Counter',
              code: `text_splitter = RecursiveCharacterTextSplitter(\n    chunk_size=500,\n    chunk_overlap=50,\n    separators=["\\n\\n", "\\n", " ", ""]\n)\nchunks = text_splitter.split_documents(pages)`,
            },
            {
              id: 'embedding',
              label: '03. VECTOR EMBEDDINGS',
              name: 'High-Dimensional Projection',
              icon: Cpu,
              badge: 'Dense Embeddings',
              desc: 'Converts chunked textual semantics into 1536-dimensional floating point dense vectors.',
              input: 'Text chunks [chunk_0 ... chunk_339]',
              output: 'Dense vector embeddings (dim: 1536, dtype: float32)',
              tech: 'OpenAI text-embedding-3 / BGE-Small',
              code: `from openai import OpenAI\nclient = OpenAI()\n\nresponse = client.embeddings.create(\n    input=chunk.page_content,\n    model="text-embedding-3-small"\n)\nvector = response.data[0].embedding`,
            },
            {
              id: 'indexing',
              label: '04. VECTOR STORE & INDEX',
              name: 'Cosine Similarity Index',
              icon: Database,
              badge: 'FAISS / ChromaDB',
              desc: 'Stores vector representations and performs sub-millisecond approximate nearest neighbor (ANN) search.',
              input: 'Query vector from student query',
              output: 'Top-3 relevant context chunks (similarity > 0.88)',
              tech: 'FAISS HNSW • Cosine Similarity • L2 Distance',
              code: `import faiss\n\nindex = faiss.IndexFlatIP(1536)\nindex.add(vectors_matrix)\n# Query nearest neighbors\nD, I = index.search(query_vector, k=3)`,
            },
            {
              id: 'synthesis',
              label: '05. GROUNDED SYNTHESIS',
              name: 'Zero-Hallucination LLM Answer',
              icon: Sparkles,
              badge: 'Context Augmented LLM',
              desc: 'Feeds retrieved ground-truth text chunks directly into LLM system prompt to prevent AI hallucination.',
              input: 'Prompt = [System: Answer using context only] + Context + Query',
              output: 'Accurate, source-cited answer with regulation §4.2 citations',
              tech: 'LLM API • Prompt Engineering • Citation Guardrails',
              code: `messages = [\n    {"role": "system", "content": f"Answer strictly using:\\n{retrieved_context}"},\n    {"role": "user", "content": student_query}\n]\ncompletion = client.chat.completions.create(model="gpt-4o", messages=messages)`,
            },
          ],
        };

      case 'fraudshield-ai':
        return {
          themeColor: 'rose',
          accentHex: '#f43f5e',
          cyanHex: '#38bdf8',
          title: 'FraudShield AI: Machine Learning Predictive Pipeline',
          tagline: 'Real-time transaction classification & behavioral anomaly detection',
          stages: [
            {
              id: 'ingestion',
              label: '01. TRANSACTION INGESTION',
              name: 'Payment Event Stream',
              icon: Terminal,
              badge: 'Real-Time Stream',
              desc: 'Ingests real-time payment transactions across amount, timestamp, merchant category, and device ID.',
              input: 'Payment payload { amount: $450, time: "14:22:05", card_id: 8829 }',
              output: 'Standardized transaction record queue',
              tech: 'FastAPI Webhook • JSON Schema • Pandas',
              code: `from pydantic import BaseModel\n\nclass TransactionEvent(BaseModel):\n    user_id: str\n    amount: float\n    merchant_category: str\n    device_hash: str`,
            },
            {
              id: 'feature',
              label: '02. FEATURE ENGINEERING',
              name: 'Behavioral Anomaly Signals',
              icon: Layers,
              badge: 'Feature Pipeline',
              desc: 'Extracts velocity frequency (tx in last hour), amount deviation z-scores, and foreign IP geolocation distance.',
              input: 'Raw transaction attributes',
              output: 'Engineered feature vector: [amount_scaled, velocity_hr, is_foreign_ip, delta_time]',
              tech: 'Scikit-learn StandardScaler • GeoIP • NumPy',
              code: `df['velocity_1hr'] = compute_hourly_frequency(user_id)\ndf['amount_zscore'] = (df['amount'] - user_mean) / user_std\nX = scaler.transform(df[feature_columns])`,
            },
            {
              id: 'ensemble',
              label: '03. RANDOM FOREST ENSEMBLE',
              name: 'Multi-Tree Voting Forest',
              icon: GitBranch,
              badge: 'Random Forest (100 Trees)',
              desc: '100 decision trees evaluate non-linear fraud signals with weighted bagging for resilient classification.',
              input: 'Standardized 12-dimensional feature vector',
              output: 'Ensemble voting consensus across 100 decision trees',
              tech: 'RandomForestClassifier • Balanced Class Weight • Entropy',
              code: `from sklearn.ensemble import RandomForestClassifier\n\nclf = RandomForestClassifier(n_estimators=100, class_weight='balanced', max_depth=12)\nclf.fit(X_train, y_train)`,
            },
            {
              id: 'scoring',
              label: '04. PROBABILITY RISK SCORING',
              name: 'Precision-Optimized Threshold',
              icon: Cpu,
              badge: 'Calibrated Probability',
              desc: 'Computes continuous fraud probability P(Fraud | X) and optimizes threshold to minimize false positives.',
              input: 'Ensemble leaf probabilities',
              output: 'Calibrated risk score: 14% (Normal) or 88% (Suspicious)',
              tech: 'Predict_proba • ROC-AUC 0.96 • Precision-Recall Optimization',
              code: `prob_fraud = clf.predict_proba(X_test)[:, 1]\nis_suspicious = (prob_fraud >= 0.50).astype(int)\nprint(f"Risk Score: {prob_fraud[0] * 100:.1f}%")`,
            },
            {
              id: 'shield',
              label: '05. AUTONOMOUS SHIELD ACTION',
              name: 'Real-Time Policy Dispatcher',
              icon: ShieldCheck,
              badge: 'Decision Gateway',
              desc: 'Routes safe transactions to instant settlement while routing anomalies to step-up MFA challenge or auto-freeze.',
              input: 'Risk Score & Confidence Band',
              output: 'Action: [ALLOW: Settlement < 30ms] or [CHALLENGE: Step-Up OTP]',
              tech: 'Policy Dispatcher • Webhook Callback • Audit Log',
              code: `if risk_score > 0.75:\n    trigger_mfa_challenge(user_id, tx_id)\n    dispatch_security_alert(level="CRITICAL")\nelse:\n    approve_and_settle(tx_id)`,
            },
          ],
        };

      case 'hospital-management':
      default:
        return {
          themeColor: 'sky',
          accentHex: '#0284c7',
          cyanHex: '#38bdf8',
          title: 'Hospital Management: Full-Stack Microservice Architecture',
          tagline: 'Asynchronous FastAPI gateway with ACID relational MySQL persistence',
          stages: [
            {
              id: 'client',
              label: '01. CLIENT FRONT-END & PORTAL',
              name: 'Role-Based Web Client',
              icon: Terminal,
              badge: 'Modern UI Portal',
              desc: 'Role-based portals for patient self-scheduling, doctor department schedules, and staff admissions.',
              input: 'User action: Book appointment { patient_id: 104, doctor_id: 12, slot: "10:30 AM" }',
              output: 'Asynchronous RESTful JSON HTTP request',
              tech: 'React • Fetch API • Role-Based Access Control',
              code: `const response = await fetch('/api/v1/appointments', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(bookingPayload)\n});`,
            },
            {
              id: 'gateway',
              label: '02. FASTAPI ASYNC GATEWAY',
              name: 'High-Throughput ASGI Router',
              icon: Server,
              badge: 'FastAPI + Uvicorn',
              desc: 'Asynchronous Python router handling non-blocking HTTP requests with automatic Swagger documentation.',
              input: 'Incoming HTTP POST /api/v1/appointments',
              output: 'Routed asynchronous coroutine execution',
              tech: 'FastAPI • Uvicorn ASGI • CORS Middleware',
              code: `from fastapi import FastAPI, APIRouter, Depends\n\nrouter = APIRouter(prefix="/api/v1/appointments")\n\n@router.post("/")\nasync def create_appointment(payload: AppointmentCreate, db = Depends(get_db)):`,
            },
            {
              id: 'pydantic',
              label: '03. SCHEMA & VALIDATION LAYER',
              name: 'Strict Type Contract Enforcement',
              icon: Code2,
              badge: 'Pydantic v2 BaseModels',
              desc: 'Validates request payload types, sanitizes input parameters, and guards against malformed payloads.',
              input: 'Raw JSON request body',
              output: 'Validated, type-safe Python data models',
              tech: 'Pydantic v2 • Strict Type Checking • Field Constraints',
              code: `from pydantic import BaseModel, Field\n\nclass AppointmentCreate(BaseModel):\n    patient_id: int = Field(gt=0)\n    doctor_id: int = Field(gt=0)\n    slot_datetime: str\n    department: str`,
            },
            {
              id: 'orm',
              label: '04. SQLALCHEMY ORM ENGINE',
              name: 'Async Relational Session Manager',
              icon: Layers,
              badge: 'SQLAlchemy AsyncSession',
              desc: 'Translates high-level Python object models into optimized SQL queries with connection pooling.',
              input: 'Validated Appointment Model instance',
              output: 'Optimized parameterized SQL INSERT transaction',
              tech: 'SQLAlchemy 2.0 • AsyncSession • Connection Pool',
              code: `new_appt = Appointment(**payload.model_dump())\ndb.add(new_appt)\nawait db.commit()\nawait db.refresh(new_appt)`,
            },
            {
              id: 'mysql',
              label: '05. RELATIONAL MYSQL DATABASE',
              name: 'ACID Storage & Foreign Key Integrity',
              icon: Database,
              badge: 'MySQL 8.0 InnoDB',
              desc: 'Stores patient and doctor entities in normalized relational tables with foreign-key constraints and indexes.',
              input: 'INSERT INTO appointments (patient_id, doctor_id, slot) VALUES (...)',
              output: 'Committed relational record with auto-increment Primary Key',
              tech: 'MySQL 8.0 • InnoDB Engine • Foreign Key Constraints',
              code: `CREATE TABLE appointments (\n    id INT AUTO-INCREMENT PRIMARY KEY,\n    patient_id INT NOT NULL,\n    doctor_id INT NOT NULL,\n    FOREIGN KEY (patient_id) REFERENCES patients(id),\n    FOREIGN KEY (doctor_id) REFERENCES doctors(id)\n);`,
            },
          ],
        };
    }
  };

  const pipeline = getPipelineData();
  const stages = pipeline.stages;

  // Run interactive animated simulation tracing data flow
  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStageIdx(0);
    setSelectedNode(0);

    let current = 0;
    const interval = 1200; // 1.2s per node

    const step = () => {
      current++;
      if (current < stages.length) {
        setActiveStageIdx(current);
        setSelectedNode(current);
        simulationTimerRef.current = setTimeout(step, interval);
      } else {
        setActiveStageIdx(stages.length);
        setTimeout(() => {
          setIsSimulating(false);
          setActiveStageIdx(-1);
        }, 1500);
      }
    };

    simulationTimerRef.current = setTimeout(step, interval);
  };

  const resetSimulation = () => {
    if (simulationTimerRef.current) clearTimeout(simulationTimerRef.current);
    setIsSimulating(false);
    setActiveStageIdx(-1);
    setSelectedNode(0);
  };

  const activeStage = stages[selectedNode] || stages[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl select-text overflow-hidden"
    >
      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.94, y: 25 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 25 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        data-lenis-prevent="true"
        className="relative w-full max-w-5xl my-auto rounded-3xl bg-[#0b0e14] border border-white/15 text-white shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Glow Accent Bar */}
        <div
          className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 shadow-[0_0_20px_rgba(56,189,248,0.8)]"
        />

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 relative">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono font-bold tracking-widest text-sky-400">
                PROJECT {project.number}
              </span>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-zinc-300">
                {project.category}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-1">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-xl">
              {pipeline.tagline}
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Architecture Modal"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs & Simulation Trigger */}
        <div className="px-6 sm:px-8 py-3 bg-[#080b10] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('flow')}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeTab === 'flow'
                  ? 'bg-sky-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                  : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              ⚡ Interactive Flow Pipeline
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeTab === 'specs'
                  ? 'bg-sky-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                  : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              📋 Code &amp; Specifications
            </button>
          </div>

          {/* Simulation Trigger Button */}
          {activeTab === 'flow' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={runSimulation}
                disabled={isSimulating}
                className="px-4 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-400 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                <span>{isSimulating ? 'SIMULATING DATA PACKET...' : 'SIMULATE PIPELINE FLOW ▶'}</span>
              </button>

              <button
                type="button"
                onClick={resetSimulation}
                disabled={isSimulating}
                aria-label="Reset Simulation"
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Body with Isolated Native Scrolling */}
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="p-6 sm:p-8 flex-1 overflow-y-auto overscroll-contain select-text"
          style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
        >
          {activeTab === 'flow' ? (
            <div>
              {/* ========================================================= */}
              {/* 1. ANIMATED HORIZONTAL / RESPONSIVE NODE FLOW PIPELINE */}
              {/* ========================================================= */}
              <div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="mb-8 p-5 rounded-2xl bg-[#06080d] border border-sky-500/20 shadow-[0_0_25px_rgba(56,189,248,0.08)] relative overflow-x-auto"
              >
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                  <span>LIVE ARCHITECTURE PIPELINE (CLICK ANY NODE TO INSPECT)</span>
                  <span className="text-sky-400 font-semibold hidden sm:inline">
                    5 Staged Micro-Modules
                  </span>
                </div>

                {/* Nodes Horizontal Pipeline Container */}
                <div className="min-w-[700px] flex items-center justify-between relative py-6 px-4">
                  {/* Connecting Background Laser Wire */}
                  <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 z-0" />

                  {/* Animated Active Glowing Laser Wire */}
                  <div
                    className="absolute left-8 top-1/2 -translate-y-1/2 h-[2.5px] bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 shadow-[0_0_12px_#38bdf8] transition-all duration-500 z-0"
                    style={{
                      width:
                        activeStageIdx >= 0
                          ? `${(activeStageIdx / (stages.length - 1)) * 100}%`
                          : `${(selectedNode / (stages.length - 1)) * 100}%`,
                    }}
                  />

                  {stages.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isSelected = selectedNode === idx;
                    const isActiveInSim = activeStageIdx === idx;
                    const isPassed = activeStageIdx > idx;

                    return (
                      <div
                        key={stage.id}
                        onClick={() => setSelectedNode(idx)}
                        className="relative z-10 flex flex-col items-center cursor-pointer group"
                      >
                        {/* Simulation Data Packet Beacon */}
                        {isActiveInSim && (
                          <motion.div
                            layoutId="dataPacket"
                            className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-mono font-bold text-[9px] uppercase shadow-[0_0_15px_#34d399] flex items-center gap-1 z-30"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                            <span>DATA PACKET</span>
                          </motion.div>
                        )}

                        {/* Node Circle Box */}
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                            isActiveInSim
                              ? 'bg-white border-white text-slate-950 shadow-[0_0_25px_#ffffff] scale-110'
                              : isSelected
                              ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.5)] scale-105'
                              : isPassed
                              ? 'bg-emerald-950/40 border-emerald-400 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                              : 'bg-slate-950/90 border-white/15 text-zinc-400 group-hover:border-sky-400/50 group-hover:text-white'
                          }`}
                        >
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>

                        {/* Stage Number & Badge */}
                        <span
                          className={`mt-2 text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-colors ${
                            isSelected ? 'text-sky-300' : 'text-zinc-500 group-hover:text-zinc-300'
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 text-center max-w-[90px] truncate">
                          {stage.name.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ========================================================= */}
              {/* 2. SELECTED NODE DEEP-DIVE INSPECTOR PANEL */}
              {/* ========================================================= */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 rounded-2xl bg-[#090d14] border border-sky-500/25 shadow-xl relative"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                        <activeStage.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider block">
                          {activeStage.label}
                        </span>
                        <h4 className="text-lg font-bold text-white">
                          {activeStage.name}
                        </h4>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white/5 border border-white/10 text-emerald-400 font-semibold">
                      {activeStage.badge}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-light">
                    {activeStage.desc}
                  </p>

                  {/* Input / Output Visual Flow */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">
                        STAGE INPUT PAYLOAD:
                      </span>
                      <p className="text-zinc-200 text-xs break-words">
                        {activeStage.input}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">
                        STAGE OUTPUT RESULT:
                      </span>
                      <p className="text-emerald-300 text-xs break-words">
                        {activeStage.output}
                      </p>
                    </div>
                  </div>

                  {/* Code Implementation Preview */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>CORE IMPLEMENTATION SNIPPET</span>
                      </span>
                      <span className="text-zinc-500">{activeStage.tech}</span>
                    </div>
                    <pre className="p-4 rounded-xl bg-black/90 border border-white/10 font-mono text-xs text-sky-200 overflow-x-auto leading-relaxed">
                      <code>{activeStage.code}</code>
                    </pre>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Tab 2: Full System Specifications */
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#090d14] border border-white/10">
                <h4 className="text-sm font-mono tracking-widest text-sky-400 uppercase mb-3 font-semibold">
                  EXECUTIVE SUMMARY
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed font-light mb-6">
                  {project.summary}
                </p>

                <h4 className="text-sm font-mono tracking-widest text-sky-400 uppercase mb-3 font-semibold">
                  KEY ENGINEERING FEATURES
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-200">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Utilized */}
              <div className="p-6 rounded-2xl bg-[#090d14] border border-white/10">
                <h4 className="text-sm font-mono tracking-widest text-sky-400 uppercase mb-3 font-semibold">
                  TECHNOLOGY STACK
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-sky-500/10 border border-sky-500/25 text-sky-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
