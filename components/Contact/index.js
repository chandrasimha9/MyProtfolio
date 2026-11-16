'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, Copy, Check, Send, MapPin, Sparkles, ArrowUpRight, User, MessageSquare, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { personalData } from '@/data/portfolio';
import Card3D from '@/components/Card3D';
import ContactChromeRing from './ContactChromeRing';

// Word-by-word blur-to-sharp heading reveal with rich gradient accent
function ContactHeading({ className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.h2
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`font-black tracking-tight uppercase leading-[0.95] ${className}`}
    >
      <span className="block text-white dark:text-white light:text-slate-900">
        LET&apos;S CREATE
      </span>
      <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.45)]">
        SOMETHING EXTRAORDINARY.
      </span>
    </motion.h2>
  );
}

export default function Contact() {
  const { contact } = personalData;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);

    try {
      // Cyber-Jewel luxury confetti
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#38BDF8', '#818CF8', '#34D399', '#FBBF24', '#FFFFFF'],
      });
    } catch {}

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent(
      `Portfolio Inquiry from ${formData.name}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoUrl;
    setFormSent(true);
    setTimeout(() => setFormSent(false), 5000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact Section"
      className="relative py-28 md:py-36 bg-[#07080b] dark:bg-[#07080b] light:bg-[#f8fafc] text-slate-100 dark:text-slate-100 light:text-slate-900 overflow-hidden select-none transition-colors duration-500"
    >
      {/* ========================================================= */}
      {/* 1. STUDIO MULTI-LAYERED AMBIENT AURORA GLOWS */}
      {/* ========================================================= */}
      <div
        className="pointer-events-none absolute -top-32 right-1/4 w-[750px] h-[750px] rounded-full bg-sky-500/15 dark:bg-sky-500/15 light:bg-sky-200/40 blur-[180px] -z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-10 left-1/4 w-[650px] h-[650px] rounded-full bg-indigo-500/15 dark:bg-indigo-500/15 light:bg-indigo-200/40 blur-[170px] -z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 right-10 w-[500px] h-[500px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-200/30 blur-[160px] -z-0"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Top Header Composition: Heading + 3D Metallic Sculpture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16 md:mb-24">
          <div className="lg:col-span-8 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full shadow-[0_0_8px_#38bdf8]" />
              <span className="text-xs font-mono tracking-[0.28em] text-sky-400 dark:text-sky-400 light:text-sky-600 uppercase font-bold">
                GET IN TOUCH • LET&apos;S CONNECT
              </span>
            </div>

            <ContactHeading className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-6" />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-zinc-300 dark:text-zinc-300 light:text-zinc-700 max-w-2xl font-light leading-relaxed"
            >
              Every meaningful software product starts with a conversation. Let&apos;s build intelligent web applications, AI pipelines, and impactful user experiences together.
            </motion.p>
          </div>

          {/* 3D Metallic Chrome Ring Sculpture with Gentle Floating */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1, rotate: 0 }
                  : { opacity: 0, scale: 0.8, rotate: -20 }
              }
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="w-64 h-64 sm:w-72 sm:h-72 relative animate-float-slow"
              style={{
                filter: 'drop-shadow(0 25px 45px rgba(56, 189, 248, 0.25)) drop-shadow(0 25px 50px rgba(0, 0, 0, 0.9))',
              }}
            >
              <ContactChromeRing className="w-full h-full" />
            </motion.div>
          </div>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================= */}
          {/* LEFT: DIRECT CHANNELS CARD (CYAN CHROMATIC HALO) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card3D glowColor="cyan" className="p-8 md:p-10 rounded-3xl bg-zinc-950/90 dark:bg-zinc-950/90 light:bg-white border border-sky-500/25 dark:border-sky-500/25 light:border-slate-200 shadow-2xl flex flex-col justify-between">
              <div>
                {/* Live Availability Radar Beacon */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-400/40 text-[11px] font-mono text-emerald-300 font-bold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Available for 2026 Roles</span>
                </div>

                <span className="text-xs font-mono text-sky-400 tracking-widest uppercase block mb-1 font-bold">
                  DIRECT CHANNELS
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 mb-6 uppercase tracking-tight">
                  Connect Directly
                </h3>

                {/* Email Block */}
                <div className="p-4 rounded-2xl bg-black/60 dark:bg-black/60 light:bg-slate-50 border border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 mb-4 group shadow-sm">
                  <div className="flex items-center justify-between text-[10px] font-mono text-sky-400 uppercase tracking-wider mb-1 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span>EMAIL INBOX</span>
                    </span>
                    <span className="text-zinc-500 group-hover:text-sky-300 transition-colors">Direct Response</span>
                  </div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm sm:text-base font-bold font-mono text-white dark:text-white light:text-slate-900 hover:text-sky-300 transition-colors break-all flex items-center justify-between"
                  >
                    <span>{contact.email}</span>
                    <ArrowUpRight className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                  </a>
                </div>

                {/* Phone Block */}
                <div className="p-4 rounded-2xl bg-black/60 dark:bg-black/60 light:bg-slate-50 border border-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300 mb-4 group shadow-sm">
                  <div className="flex items-center justify-between text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-1 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>DIRECT PHONE &amp; WHATSAPP</span>
                    </span>
                    <span className="text-zinc-500 group-hover:text-indigo-300 transition-colors">+91 IST</span>
                  </div>
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className="text-sm sm:text-base font-bold font-mono text-white dark:text-white light:text-slate-900 hover:text-indigo-300 transition-colors flex items-center justify-between"
                  >
                    <span>{contact.phone}</span>
                    <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

                {/* Location Badge */}
                <div className="p-4 rounded-2xl bg-black/40 dark:bg-black/40 light:bg-slate-50 border border-white/10 mb-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">CURRENT BASE</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-800">
                      {contact.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fast Copy Email Action with Neon Shimmer */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full py-4 px-4 rounded-2xl border border-sky-400/40 hover:border-sky-400 bg-sky-500/10 hover:bg-sky-500/20 text-xs font-mono font-bold tracking-widest uppercase text-sky-200 hover:text-white transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:scale-[1.02] active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                    <span className="text-emerald-300">COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                    <span>COPY EMAIL ADDRESS</span>
                  </>
                )}
              </button>
            </Card3D>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: DIRECT MESSAGE TRANSMISSION FORM (INDIGO HALO) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7">
            <Card3D glowColor="indigo" className="p-8 md:p-10 rounded-3xl bg-zinc-950/90 dark:bg-zinc-950/90 light:bg-white border border-indigo-500/25 dark:border-indigo-500/25 light:border-slate-200 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-indigo-400 tracking-widest uppercase font-bold">
                  SEND A DIRECT MESSAGE
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-indigo-500/10 border border-indigo-400/30 text-indigo-300">
                  Instant Dispatch
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 mb-6 uppercase tracking-tight">
                Start a Conversation
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-700 uppercase tracking-wider mb-2 font-semibold"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Your Name</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-4 py-3.5 rounded-xl bg-black/60 dark:bg-black/60 light:bg-slate-50 border border-white/15 dark:border-white/15 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-zinc-500 text-sm font-mono focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 focus:bg-indigo-950/10 transition-all"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-700 uppercase tracking-wider mb-2 font-semibold"
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span>Your Email</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-black/60 dark:bg-black/60 light:bg-slate-50 border border-white/15 dark:border-white/15 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-zinc-500 text-sm font-mono focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 focus:bg-sky-950/10 transition-all"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-700 uppercase tracking-wider mb-2 font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Message &amp; Project Scope</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, idea, or role opportunity..."
                    className="w-full px-4 py-3.5 rounded-xl bg-black/60 dark:bg-black/60 light:bg-slate-50 border border-white/15 dark:border-white/15 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-zinc-500 text-sm font-mono focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:bg-emerald-950/10 transition-all resize-none"
                  />
                </div>

                {/* Submit Action Button with Cyber Beam */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 text-slate-950 font-mono font-black text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2.5 group shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-[1.01] active:scale-[0.98]"
                >
                  <Send className="w-4 h-4 fill-slate-950 group-hover:translate-x-1.5 transition-transform" />
                  <span>TRANSMIT MESSAGE NOW</span>
                </button>

                {formSent && (
                  <p className="text-xs font-mono text-emerald-300 text-center animate-pulse pt-2 font-semibold">
                    ✓ Opening your email client to dispatch message...
                  </p>
                )}
              </form>
            </Card3D>
          </div>
        </div>
      </div>
    </section>
  );
}