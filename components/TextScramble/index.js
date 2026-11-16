'use client';

import { useState, useEffect, useRef } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________ABCDEF0123456789';

export default function TextScramble({ text, className = '', triggerOnView = true }) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const elementRef = useRef(null);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = text.length * 3;

    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 3) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      iteration += 1;
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 28);
  };

  useEffect(() => {
    if (!triggerOnView) return;

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scramble();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [text, triggerOnView]);

  return (
    <span
      ref={elementRef}
      onMouseEnter={scramble}
      className={`font-mono transition-colors cursor-default ${className}`}
    >
      {displayText}
    </span>
  );
}
