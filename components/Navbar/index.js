'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import ThemePullCord from './ThemePullCord';

const NAV_LINKS = [
  { name: 'HOME', href: '#home' },
  { name: 'ABOUT', href: '#about' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'EDUCATION', href: '#education' },
  { name: 'LEETCODE', href: '#achievements' },
  { name: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-black/80 dark:bg-black/85 light:bg-white/85 backdrop-blur-md border-b border-white/10 dark:border-white/10 light:border-black/10 shadow-lg'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo - Monochrome */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="group flex items-center gap-2 text-lg md:text-xl font-black tracking-[0.2em] text-white dark:text-white light:text-black transition-colors"
          >
            <span>CHANDRA</span>
            <span className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 group-hover:text-white dark:group-hover:text-white light:group-hover:text-black transition-colors">
              SIMHA.
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-xs tracking-[0.2em] font-mono transition-all relative py-1 ${
                    isActive
                      ? 'text-sky-300 dark:text-sky-300 light:text-sky-600 font-bold'
                      : 'text-zinc-400 hover:text-sky-300 dark:hover:text-sky-300 light:hover:text-sky-600'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Bedside Lamp Hanging Pull-Cord Theme Toggle */}
            <div className="relative -mt-6">
              <ThemePullCord theme={theme} toggleTheme={toggleTheme} mounted={mounted} />
            </div>

            {/* Let's Talk CTA */}
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-semibold tracking-widest text-black dark:text-black light:text-white bg-white dark:bg-white light:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-100 light:hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <span>LET&apos;S TALK</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-4">
            <div className="relative -mt-6">
              <ThemePullCord theme={theme} toggleTheme={toggleTheme} mounted={mounted} />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="w-9 h-9 rounded-full border border-white/20 dark:border-white/20 light:border-black/20 flex items-center justify-center text-white dark:text-white light:text-black bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 dark:bg-black/95 light:bg-white/95 backdrop-blur-2xl flex flex-col justify-between px-8 py-24 lg:hidden"
          >
            <div className="flex flex-col gap-6">
              <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                INDEX NAVIGATION
              </span>
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-2xl font-bold tracking-wider text-white dark:text-white light:text-black hover:text-zinc-400 transition-colors py-1 flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <span className="text-xs font-mono text-zinc-500">0{idx + 1}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-white/10 dark:border-white/10 light:border-black/10">
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, '#contact')}
                className="w-full py-3.5 rounded-full text-center text-xs font-bold font-mono tracking-[0.2em] uppercase bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                LET&apos;S TALK
              </a>
              <p className="text-xs text-center text-zinc-500 font-mono">
                G Raja Chandra Simha Yadav • Portfolio
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
