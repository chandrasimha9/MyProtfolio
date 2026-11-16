'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function LiquidGlassCard({
  children,
  category = 'programming',
  className = '',
  isInView = true,
  delay = 0,
}) {
  const cardRef = useRef(null);
  const isMouseDownRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinate motion values (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Category-specific spring physics configurations
  const springConfigs = {
    programming: { stiffness: 320, damping: 20, maxTilt: 9, floatDelay: 0 },
    frontend: { stiffness: 280, damping: 18, maxTilt: 10, floatDelay: 1.2 },
    backend: { stiffness: 220, damping: 24, maxTilt: 8, floatDelay: 2.4 },
    'database-ai-tools': { stiffness: 260, damping: 22, maxTilt: 8.5, floatDelay: 3.6 },
  };

  const config = springConfigs[category] || springConfigs.programming;

  // Spring physics interpolation
  const springX = useSpring(x, { stiffness: config.stiffness, damping: config.damping });
  const springY = useSpring(y, { stiffness: config.stiffness, damping: config.damping });

  // 3D Tilt transforms
  const rotateX = useTransform(springY, [-0.5, 0.5], [config.maxTilt, -config.maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-config.maxTilt, config.maxTilt]);

  // Cursor-responsive liquid glass glare coordinates (%)
  const glareX = useTransform(springX, [-0.5, 0.5], ['15%', '85%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['15%', '85%']);

  const handleMouseMove = (e) => {
    // Freeze 3D tilt update during mouse press so clicks are never cancelled by geometry shifts
    if (isMouseDownRef.current) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize coordinates (-0.5 to 0.5)
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseDown = () => {
    isMouseDownRef.current = true;
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 35, scale: 0.95 }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
            }
          : { opacity: 0, y: 35, scale: 0.95 }
      }
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        perspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className={`relative rounded-3xl ${className}`}
    >
      {/* 3D Motion Container with Spring Physics */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: config.stiffness,
          damping: config.damping,
        }}
        className={`relative w-full h-full rounded-3xl p-6 sm:p-7 transition-colors duration-500
          bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-white/65
          backdrop-blur-2xl
          border border-white/25 dark:border-white/25 light:border-zinc-300/80
          hover:border-white/50 dark:hover:border-white/50 light:hover:border-zinc-400
          shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(255,255,255,0.08)]
          dark:shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(255,255,255,0.08)]
          light:shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)]
          overflow-hidden`}
      >
        {/* Dynamic Liquid Glass Glare Highlight (Tracks Cursor) */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.15), transparent 75%)`,
          }}
        />

        {/* Top Metallic Bevel Light Sweep */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 dark:via-white/60 light:via-black/20 to-transparent pointer-events-none rounded-t-3xl z-20" />

        {/* Card Content with Direct Pointer Access */}
        <div className="relative z-20 pointer-events-auto">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
