'use client';

import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { personalData } from '@/data/portfolio';

const FOOTER_LINKS = [
  { name: 'HOME', href: '#home' },
  { name: 'ABOUT', href: '#about' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'EDUCATION', href: '#education' },
  { name: 'CONTACT', href: '#contact' },
];

export default function Footer() {
  const { footer, contact } = personalData;
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#07080b] dark:bg-[#07080b] light:bg-[#f8fafc] text-slate-100 dark:text-slate-100 light:text-slate-900 border-t border-white/10 dark:border-white/10 light:border-black/10 pt-20 pb-12 overflow-hidden select-none transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10 dark:border-white/10 light:border-black/10 items-start">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              className="text-2xl font-black tracking-[0.2em] text-white dark:text-white light:text-black group flex items-center gap-2"
            >
              <span>CHANDRA</span>
              <span className="text-zinc-400 group-hover:text-sky-400 dark:group-hover:text-sky-400 light:group-hover:text-sky-600 transition-colors">
                SIMHA.
              </span>
            </a>
            <p className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
              {footer.role}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 leading-relaxed max-w-sm mt-2">
              Transforming innovative ideas into practical software applications through full-stack architecture, machine learning, and disciplined engineering.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase mb-2">
              QUICK NAVIGATION
            </span>
            <div className="flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-xs font-mono text-zinc-500 hover:text-white dark:hover:text-white light:hover:text-black transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Direct Channels */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase mb-2">
              CONTACT INFORMATION
            </span>
            <div className="space-y-3 text-xs font-mono text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-white dark:text-white light:text-black" />
                <a href={`mailto:${contact.email}`} className="hover:text-white dark:hover:text-white light:hover:text-black transition-colors">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-white dark:text-white light:text-black" />
                <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="hover:text-white dark:hover:text-white light:hover:text-black transition-colors">
                  {contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-white dark:text-white light:text-black" />
                <span>{contact.location}</span>
              </div>
            </div>

            {/* Back to Top Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 dark:border-white/15 light:border-black/15 text-xs font-mono tracking-wider text-white dark:text-white light:text-black transition-all group"
              >
                <span>BACK TO TOP</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Tagline & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p className="text-center sm:text-left">
            &copy; {currentYear} G Raja Chandra Simha Yadav. All rights reserved.
          </p>
          <p className="text-center sm:text-right tracking-wider text-zinc-400">
            {footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
