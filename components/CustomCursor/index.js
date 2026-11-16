'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch || window.innerWidth < 1024) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovering = false;
    let isMouseDown = false;
    let isVisible = false;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(0.8)`;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseOver = (e) => {
      const target = e.target;
      const isInteractive =
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[role="button"]') ||
        target.dataset.cursor === 'hover';

      if (isInteractive) {
        isHovering = true;
        ring.style.width = '48px';
        ring.style.height = '48px';
        ring.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        ring.style.borderColor = 'rgba(255, 255, 255, 0.6)';
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0)`;
      } else {
        isHovering = false;
        ring.style.width = '30px';
        ring.style.height = '30px';
        ring.style.backgroundColor = 'transparent';
        ring.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // Direct 60-120fps hardware rendering loop without React re-render
    const render = () => {
      // Ring lerp
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      const scale = isMouseDown ? 0.8 : isHovering ? 1.2 : 1;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`;

      if (!isHovering) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${isMouseDown ? 0.7 : 1})`;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Smooth hardware-accelerated outer ring */}
      <div
        ref={cursorRingRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-white/40 opacity-0 mix-blend-difference hidden lg:block -mt-[15px] -ml-[15px] will-change-transform"
        style={{
          width: '30px',
          height: '30px',
          transition: 'width 0.2s ease, height 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
        }}
      />
      {/* Sharp center white dot */}
      <div
        ref={cursorDotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-white opacity-0 mix-blend-difference hidden lg:block -mt-[3px] -ml-[3px] will-change-transform"
        style={{
          width: '6px',
          height: '6px',
          transition: 'transform 0.1s ease',
        }}
      />
    </>
  );
}
