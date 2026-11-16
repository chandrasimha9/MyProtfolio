'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Card3D with Dynamic Touch & Cursor Reactive Chromatic Glow
 * - Desktop & Tablet (>= 768px): 3D perspective tilt + real-time cursor tracking glow.
 * - Mobile Phones (< 768px): Tilt disabled; click/tap triggers vibrant chromatic glow animation.
 */
export default function Card3D({
  children,
  className = '',
  maxAngle = 10,
  glowColor = 'cyan', // 'cyan' | 'indigo' | 'amber' | 'emerald' | 'rose' | 'purple' | 'sky'
}) {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileGlowing, setMobileGlowing] = useState(false);
  const mobileTimerRef = useRef(null);

  // Detect mobile viewport (< 768px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mobileTimerRef.current) clearTimeout(mobileTimerRef.current);
    };
  }, []);

  // Derive color palette from prop
  const getGlowGradients = useCallback(() => {
    switch (glowColor) {
      case 'amber':
        return {
          inner: 'rgba(251, 191, 36, 0.30)',
          mid: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(251, 191, 36, 0.50)',
        };
      case 'indigo':
        return {
          inner: 'rgba(129, 140, 248, 0.30)',
          mid: 'rgba(99, 102, 241, 0.15)',
          border: 'rgba(129, 140, 248, 0.50)',
        };
      case 'emerald':
        return {
          inner: 'rgba(52, 211, 153, 0.30)',
          mid: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(52, 211, 153, 0.50)',
        };
      case 'purple':
        return {
          inner: 'rgba(192, 132, 252, 0.32)',
          mid: 'rgba(168, 85, 247, 0.16)',
          border: 'rgba(192, 132, 252, 0.55)',
        };
      case 'sky':
        return {
          inner: 'rgba(56, 189, 248, 0.32)',
          mid: 'rgba(14, 165, 233, 0.16)',
          border: 'rgba(56, 189, 248, 0.55)',
        };
      case 'rose':
        return {
          inner: 'rgba(251, 113, 133, 0.30)',
          mid: 'rgba(244, 63, 94, 0.15)',
          border: 'rgba(251, 113, 133, 0.50)',
        };
      case 'cyan':
      default:
        return {
          inner: 'rgba(56, 189, 248, 0.32)',
          mid: 'rgba(99, 102, 241, 0.14)',
          border: 'rgba(56, 189, 248, 0.55)',
        };
    }
  }, [glowColor]);

  const updateCoordinates = (clientX, clientY) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (!isMobile) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxAngle;
      const rotateY = ((x - centerX) / centerX) * maxAngle;

      setRotate({ x: rotateX, y: rotateY });
    } else {
      setRotate({ x: 0, y: 0 });
    }

    setSpotlight({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
    setIsHovered(true);
  };

  const handleMouseMove = (e) => {
    if (!isMobile) {
      updateCoordinates(e.clientX, e.clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (!isMobile && e.touches && e.touches[0]) {
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleCardClick = () => {
    if (isMobile) {
      if (mobileTimerRef.current) clearTimeout(mobileTimerRef.current);
      setMobileGlowing(true);
      setSpotlight({ x: 50, y: 50, opacity: 1 });
      mobileTimerRef.current = setTimeout(() => {
        setMobileGlowing(false);
        setSpotlight((prev) => ({ ...prev, opacity: 0 }));
      }, 1800);
    }
  };

  const handleReset = () => {
    setRotate({ x: 0, y: 0 });
    if (!mobileGlowing) {
      setSpotlight((prev) => ({ ...prev, opacity: 0 }));
    }
    setIsHovered(false);
  };

  const colors = getGlowGradients();

  return (
    <div style={{ perspective: isMobile ? 'none' : 1200 }} className="w-full h-full">
      <div
        ref={cardRef}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleReset}
        onTouchStart={(e) => {
          if (isMobile) {
            handleCardClick();
          } else {
            handleTouchMove(e);
          }
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleReset}
        style={{
          transform: isMobile
            ? (mobileGlowing ? 'scale(1.01)' : 'none')
            : `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(0px)`,
          transition: isHovered
            ? 'transform 0.08s ease-out, box-shadow 0.3s ease'
            : 'transform 0.4s ease-out, box-shadow 0.4s ease',
          transformStyle: isMobile ? 'flat' : 'preserve-3d',
          boxShadow: isMobile && mobileGlowing
            ? `0 0 35px ${colors.inner}, 0 0 15px ${colors.border}`
            : undefined,
        }}
        className={`relative overflow-hidden transition-all duration-300 ${
          isMobile && mobileGlowing ? 'ring-1 ring-white/30' : ''
        } ${className}`}
      >
        {/* Layer 1: Ambient Colored Aurora Radial Glow tracking Cursor/Finger */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(circle 380px at ${spotlight.x}% ${spotlight.y}%, ${colors.inner} 0%, ${colors.mid} 40%, transparent 75%)`,
          }}
        />

        {/* Layer 2: White Specular Flare Core */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 mix-blend-screen"
          style={{
            opacity: spotlight.opacity * 0.6,
            background: `radial-gradient(circle 180px at ${spotlight.x}% ${spotlight.y}%, rgba(255, 255, 255, 0.35) 0%, transparent 70%)`,
          }}
        />

        {/* Layer 3: Dynamic Illuminated Border Sheen */}
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-[inherit] z-20 transition-opacity duration-300"
          style={{
            opacity: spotlight.opacity * 0.9,
            background: `radial-gradient(circle 260px at ${spotlight.x}% ${spotlight.y}%, ${colors.border} 0%, transparent 70%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1.5px',
          }}
        />

        {/* Card Children with elevated 3D depth */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
