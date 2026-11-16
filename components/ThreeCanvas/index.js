'use client';

import { useEffect, useRef } from 'react';

export default function ThreeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates in normalized 3D space (-1 to 1)
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / width - 0.5) * 2;
      mouse.targetY = (e.clientY / height - 0.5) * 2;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Generate 3D particle cloud with celestial cyber-jewel tones
    const count = 90;
    const particles = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      const colorType = rand < 0.32 ? 'cyan' : rand < 0.46 ? 'amber' : 'white';
      particles.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1600,
        z: Math.random() * 1200 + 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.25,
        colorType,
      });
    }

    // 3D wireframe cube vertices in object space
    const cubeVertices = [
      [-100, -100, -100], [100, -100, -100], [100, 100, -100], [-100, 100, -100],
      [-100, -100, 100], [100, -100, 100], [100, 100, 100], [-100, 100, 100]
    ];
    const cubeEdges = [
      [0,1], [1,2], [2,3], [3,0],
      [4,5], [5,6], [6,7], [7,4],
      [0,4], [1,5], [2,6], [3,7]
    ];
    let cubeRotX = 0;
    let cubeRotY = 0;
    let cubeRotZ = 0;

    // Focal length for 3D perspective projection
    const fov = 600;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const isDark = document.documentElement.classList.contains('dark');

      const projected = [];

      // Update & project 3D particles
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around bounds
        if (p.x < -800) p.x = 800;
        if (p.x > 800) p.x = -800;
        if (p.y < -800) p.y = 800;
        if (p.y > 800) p.y = -800;
        if (p.z < 50) p.z = 1200;
        if (p.z > 1200) p.z = 50;

        // Camera perspective rotation
        const camX = p.x - mouse.x * 200;
        const camY = p.y - mouse.y * 200;
        const camZ = p.z;

        const scale = fov / (fov + camZ);
        const px = width / 2 + camX * scale;
        const py = height / 2 + camY * scale;

        projected.push({ x: px, y: py, scale, alpha: p.alpha });

        // Dynamic cyber-jewel particle coloring
        let pColor = isDark ? '248, 250, 252' : '71, 85, 105';
        if (p.colorType === 'cyan') {
          pColor = isDark ? '56, 189, 248' : '2, 132, 199';
        } else if (p.colorType === 'amber') {
          pColor = isDark ? '251, 191, 36' : '217, 119, 6';
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pColor}, ${p.alpha * scale * (isDark ? 0.8 : 0.45)})`;
        ctx.fill();
      }

      // Draw constellation filaments between close neighbors
      ctx.lineWidth = 0.5;
      const filamentColor = isDark ? '56, 189, 248' : '100, 116, 139';
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * (isDark ? 0.16 : 0.08);
            ctx.strokeStyle = `rgba(${filamentColor}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw orbiting 3D wireframe cube
      cubeRotX += 0.006;
      cubeRotY += 0.009;
      cubeRotZ += 0.004;

      const cubeZ = 700;
      const cubeCenterX = (mouse.x * 120);
      const cubeCenterY = (mouse.y * 120);

      const rotCube = cubeVertices.map(([vx, vy, vz]) => {
        // Rotate X
        let y1 = vy * Math.cos(cubeRotX) - vz * Math.sin(cubeRotX);
        let z1 = vy * Math.sin(cubeRotX) + vz * Math.cos(cubeRotX);
        // Rotate Y
        let x2 = vx * Math.cos(cubeRotY) + z1 * Math.sin(cubeRotY);
        let z2 = -vx * Math.sin(cubeRotY) + z1 * Math.cos(cubeRotY);
        // Rotate Z
        let x3 = x2 * Math.cos(cubeRotZ) - y1 * Math.sin(cubeRotZ);
        let y3 = x2 * Math.sin(cubeRotZ) + y1 * Math.cos(cubeRotZ);

        const worldZ = z2 + cubeZ;
        const scale = fov / (fov + worldZ);
        return {
          x: width / 2 + (x3 + cubeCenterX) * scale,
          y: height / 2 + (y3 + cubeCenterY) * scale,
        };
      });

      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.15)';
      ctx.lineWidth = 1;
      for (const [v1, v2] of cubeEdges) {
        ctx.beginPath();
        ctx.moveTo(rotCube[v1].x, rotCube[v1].y);
        ctx.lineTo(rotCube[v2].x, rotCube[v2].y);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
