'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TECH_SVG_LOGOS, TECH_CATEGORIES_DATA } from './TechLogos';

// Mapping of tech keys to category IDs for spatial filtering
const TECH_TO_CATEGORY_MAP = {};
TECH_CATEGORIES_DATA.forEach((cat) => {
  cat.logos.forEach((logoKey) => {
    TECH_TO_CATEGORY_MAP[logoKey] = cat.id;
  });
});

// Composed spatial 3D layout coordinates for each tech medallion
// Distributed in realistic depth (Z: -2.2 to +1.2) across widescreen view
const TECH_SPATIAL_POSITIONS = {
  // Programming (Left-Center upper cluster)
  python: { x: -3.2, y: 1.4, z: 0.6, scale: 1.15 },
  javascript: { x: -1.6, y: 1.8, z: -0.4, scale: 1.05 },
  java: { x: -4.5, y: 0.2, z: -0.8, scale: 1.0 },

  // Frontend (Center-Right upper/mid cluster)
  react: { x: 1.8, y: 1.5, z: 0.8, scale: 1.2 },
  html5: { x: 3.6, y: 1.8, z: -0.5, scale: 1.0 },
  css3: { x: 4.8, y: 0.6, z: -1.2, scale: 0.95 },
  bootstrap: { x: 3.2, y: 0.2, z: 0.2, scale: 0.95 },

  // Backend (Center & Lower-Left cluster)
  fastapi: { x: -0.2, y: 0.8, z: 1.0, scale: 1.25 },
  nodejs: { x: -2.2, y: -0.8, z: 0.4, scale: 1.1 },
  express: { x: -0.8, y: -1.4, z: -0.6, scale: 1.0 },

  // Database, AI & Tools (Lower & Perimeter cluster)
  mysql: { x: 1.2, y: -0.8, z: 0.5, scale: 1.1 },
  sqlite: { x: 2.8, y: -1.2, z: -0.5, scale: 0.95 },
  scikitlearn: { x: 4.2, y: -1.6, z: -1.5, scale: 1.0 },
  numpy: { x: -3.8, y: -1.8, z: -1.2, scale: 0.95 },
  pandas: { x: -5.0, y: -1.0, z: -2.0, scale: 0.9 },
  git: { x: 0.0, y: -2.2, z: 0.2, scale: 1.0 },
  github: { x: 1.6, y: -2.2, z: -0.8, scale: 1.0 },
  vscode: { x: 3.5, y: -2.4, z: -1.8, scale: 0.9 },
  postman: { x: -2.0, y: -2.3, z: -1.5, scale: 0.9 },
};

export default function ToolkitUniverse3D({
  activeCategory = 'all',
  onSelectTech = null,
  className = '',
}) {
  const mountRef = useRef(null);
  const activeCategoryRef = useRef(activeCategory);
  const [hoveredTech, setHoveredTech] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 550;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup with cinematic FOV
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Procedural Studio Monochrome Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext('2d');

    const bgGrad = envCtx.createLinearGradient(0, 0, 0, 256);
    bgGrad.addColorStop(0, '#0c0c0e');
    bgGrad.addColorStop(0.5, '#18181b');
    bgGrad.addColorStop(1, '#050507');
    envCtx.fillStyle = bgGrad;
    envCtx.fillRect(0, 0, 512, 256);

    // Overhead Key Softbox
    const overhead = envCtx.createRadialGradient(256, 50, 10, 256, 50, 160);
    overhead.addColorStop(0, '#ffffff');
    overhead.addColorStop(0.5, '#888888');
    overhead.addColorStop(1, 'rgba(0,0,0,0)');
    envCtx.fillStyle = overhead;
    envCtx.fillRect(0, 0, 512, 180);

    // Left Rim Strip
    const leftRim = envCtx.createLinearGradient(30, 0, 120, 0);
    leftRim.addColorStop(0, 'rgba(0,0,0,0)');
    leftRim.addColorStop(0.5, '#e0e0e0');
    leftRim.addColorStop(1, 'rgba(0,0,0,0)');
    envCtx.fillStyle = leftRim;
    envCtx.fillRect(30, 40, 90, 180);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    scene.environment = envMap;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xcccccc, 1.2);
    rimLight.position.set(-5, -4, -2);
    scene.add(rimLight);

    // 6. Ambient 3D Metallic Particles
    const particleCount = 280;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      particleSpeeds[i] = 0.002 + Math.random() * 0.005;
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd4d4d8,
      size: 0.045,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 7. Technology Medallions Group
    const techGroup = new THREE.Group();
    scene.add(techGroup);

    const techMeshes = [];
    const texturesToDispose = [];
    const materialsToDispose = [];
    const geometriesToDispose = [];

    // Helper: Generate crisp 512x512 CanvasTexture with authentic SVG logo
    const createTechTexture = (techKey, techData) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Metallic disc surface gradient
      const discGrad = ctx.createRadialGradient(256, 256, 40, 256, 256, 245);
      discGrad.addColorStop(0, '#1c1c20');
      discGrad.addColorStop(0.6, '#0f0f12');
      discGrad.addColorStop(1, '#050507');
      ctx.fillStyle = discGrad;
      ctx.beginPath();
      ctx.arc(256, 256, 240, 0, Math.PI * 2);
      ctx.fill();

      // Chrome rim
      ctx.lineWidth = 14;
      const rimGrad = ctx.createLinearGradient(60, 60, 452, 452);
      rimGrad.addColorStop(0, '#ffffff');
      rimGrad.addColorStop(0.3, '#71717a');
      rimGrad.addColorStop(0.7, '#ffffff');
      rimGrad.addColorStop(1, '#3f3f46');
      ctx.strokeStyle = rimGrad;
      ctx.stroke();

      // Subtle inner ring
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(256, 256, 224, 0, Math.PI * 2);
      ctx.stroke();

      // Authentic SVG Logo Vector Path
      ctx.save();
      ctx.translate(256, 242);
      const scale = 220 / 24;
      ctx.scale(scale, scale);
      ctx.translate(-12, -12); // Center 24x24 viewBox

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.35)';
      ctx.shadowBlur = 12;

      try {
        const path = new Path2D(techData.path);
        ctx.fill(path);
      } catch (e) {
        // Fallback if Path2D parsing is unavailable
        ctx.fillRect(4, 4, 16, 16);
      }
      ctx.restore();

      // Technology Name Typography Label
      ctx.fillStyle = '#e4e4e7';
      ctx.font = 'bold 30px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 6;
      ctx.fillText(techData.name.toUpperCase(), 256, 440);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texturesToDispose.push(texture);
      return texture;
    };

    // Shared Disc Geometry for all medallions
    // Cylinder geometry with beveled appearance
    const discGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.065, 48);
    geometriesToDispose.push(discGeo);

    // Chrome Edge Material
    const edgeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#d4d4d8'),
      metalness: 0.98,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
    });
    materialsToDispose.push(edgeMaterial);

    // Build 3D mesh for each authentic tech logo
    Object.keys(TECH_SVG_LOGOS).forEach((techKey) => {
      const techData = TECH_SVG_LOGOS[techKey];
      const posConfig = TECH_SPATIAL_POSITIONS[techKey] || {
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 2,
        scale: 1.0,
      };

      const texture = createTechTexture(techKey, techData);

      // Face Material with dynamic metallic properties
      const faceMaterial = new THREE.MeshPhysicalMaterial({
        map: texture,
        metalness: 0.85,
        roughness: 0.18,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.96,
      });
      materialsToDispose.push(faceMaterial);

      // Materials array: [sides, top (face), bottom]
      const meshMaterials = [edgeMaterial, faceMaterial, edgeMaterial];

      const mesh = new THREE.Mesh(discGeo, meshMaterials);
      mesh.rotation.x = Math.PI / 2; // Face towards camera by default

      mesh.position.set(posConfig.x, posConfig.y, posConfig.z);
      const baseScale = posConfig.scale || 1.0;
      mesh.scale.set(baseScale, baseScale, baseScale);

      // Attach custom animation & metadata parameters
      mesh.userData = {
        key: techKey,
        name: techData.name,
        category: TECH_TO_CATEGORY_MAP[techKey] || 'tools',
        basePos: new THREE.Vector3(posConfig.x, posConfig.y, posConfig.z),
        targetPos: new THREE.Vector3(posConfig.x, posConfig.y, posConfig.z),
        baseScale: baseScale,
        targetScale: baseScale,
        floatSpeed: 0.8 + Math.random() * 0.7,
        floatAmp: 0.08 + Math.random() * 0.07,
        phase: Math.random() * Math.PI * 2,
        rotSpeedY: (Math.random() - 0.5) * 0.18,
        rotSpeedX: (Math.random() - 0.5) * 0.14,
        faceMaterial: faceMaterial,
      };

      techGroup.add(mesh);
      techMeshes.push(mesh);
    });

    // 8. Mouse & Cursor Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2(-999, -999);

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseX = (x / width) * 2 - 1;
      mouseY = -(y / height) * 2 + 1;

      targetCameraX = mouseX * 1.4;
      targetCameraY = mouseY * 0.9;

      mouseVector.x = mouseX;
      mouseVector.y = mouseY;
    };

    const handleMouseLeave = () => {
      targetCameraX = 0;
      targetCameraY = 0;
      mouseVector.x = -999;
      mouseVector.y = -999;
      setHoveredTech(null);
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(techMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && onSelectTech) {
          onSelectTech(hit.userData.key, hit.userData);
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    // 9. Resize Observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 550;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Visibility Observer (Pause when scrolled out of view)
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    // 11. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Camera parallax interpolation
      camera.position.x += (targetCameraX - camera.position.x) * 0.045;
      camera.position.y += (targetCameraY - camera.position.y) * 0.045;
      camera.lookAt(0, 0, 0);

      // Particle subtle ambient drift
      const positions = particleGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 5) {
          positions[i * 3 + 1] = -5;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;
      particleSystem.rotation.y = elapsedTime * 0.015;

      // Active category filtering check
      const currentCategory = activeCategoryRef.current;

      // Raycasting for interactive hover
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(techMeshes);
      const hoveredMesh = intersects.length > 0 ? intersects[0].object : null;

      if (hoveredMesh && hoveredMesh.userData) {
        setHoveredTech(hoveredMesh.userData.name);
        container.style.cursor = 'pointer';
      } else {
        setHoveredTech(null);
        container.style.cursor = 'default';
      }

      // Update each tech medallion
      for (let i = 0; i < techMeshes.length; i++) {
        const mesh = techMeshes[i];
        const ud = mesh.userData;

        const isHovered = hoveredMesh === mesh;
        const matchesCategory =
          currentCategory === 'all' || ud.category === currentCategory;

        // Dynamic targets based on category state
        if (matchesCategory) {
          // Highlighted or default active state
          if (currentCategory !== 'all') {
            ud.targetPos.z = ud.basePos.z + 1.2;
            ud.targetScale = ud.baseScale * 1.25;
            ud.faceMaterial.opacity = 1.0;
            ud.faceMaterial.emissive = new THREE.Color(0x222222);
          } else {
            ud.targetPos.z = ud.basePos.z;
            ud.targetScale = ud.baseScale;
            ud.faceMaterial.opacity = 0.96;
            ud.faceMaterial.emissive = new THREE.Color(0x000000);
          }
        } else {
          // Dimmed non-matching category
          ud.targetPos.z = ud.basePos.z - 1.5;
          ud.targetScale = ud.baseScale * 0.8;
          ud.faceMaterial.opacity = 0.28;
          ud.faceMaterial.emissive = new THREE.Color(0x000000);
        }

        // Hover elevation boost
        if (isHovered) {
          ud.targetPos.z += 0.8;
          ud.targetScale *= 1.22;
          ud.faceMaterial.emissive = new THREE.Color(0x444444);
        }

        // Smooth position interpolation
        mesh.position.x += (ud.targetPos.x - mesh.position.x) * 0.06;
        mesh.position.z += (ud.targetPos.z - mesh.position.z) * 0.06;

        // Floating sine wave motion
        const floatY =
          ud.targetPos.y +
          Math.sin(elapsedTime * ud.floatSpeed + ud.phase) * ud.floatAmp;
        mesh.position.y += (floatY - mesh.position.y) * 0.08;

        // Smooth scale interpolation
        const currentScale = mesh.scale.x;
        const nextScale = currentScale + (ud.targetScale - currentScale) * 0.08;
        mesh.scale.set(nextScale, nextScale, nextScale);

        // Gentle 3D wobble / tilt
        const targetRotX =
          Math.PI / 2 +
          Math.sin(elapsedTime * 0.8 + ud.phase) * 0.12 -
          mouseY * 0.2;
        const targetRotZ =
          Math.cos(elapsedTime * 0.6 + ud.phase) * 0.14 + mouseX * 0.25;

        mesh.rotation.x += (targetRotX - mesh.rotation.x) * 0.05;
        mesh.rotation.z += (targetRotZ - mesh.rotation.z) * 0.05;

        // Slow spin on hover
        if (isHovered) {
          mesh.rotation.y += 0.04;
        } else {
          mesh.rotation.y += (0 - mesh.rotation.y) * 0.06;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);

      pmremGenerator.dispose();
      envTexture.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();

      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      texturesToDispose.forEach((t) => t.dispose());

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-[460px] sm:h-[520px] md:h-[600px] cursor-grab active:cursor-grabbing"
      />

      {/* Floating 3D HUD Indicator */}
      <div className="pointer-events-none absolute top-4 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-white/15 backdrop-blur-md text-[10px] font-mono text-zinc-400">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="tracking-widest uppercase">
          THREE.JS 3D TECHNOLOGY UNIVERSE
        </span>
      </div>

      {/* Floating Cursor Target Badge */}
      {hoveredTech && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-white text-black font-mono font-bold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(255,255,255,0.45)] border border-white flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <span className="w-2 h-2 rounded-full bg-black animate-ping" />
          <span>{hoveredTech}</span>
        </div>
      )}

      {/* Atmospheric Vignette & Depth Mask */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
    </div>
  );
}
