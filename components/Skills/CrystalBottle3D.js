'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TECH_SVG_LOGOS } from './TechLogos';

/**
 * CrystalBottle3D
 *
 * Photorealistic 3D Crystal Relic Vessel with 4-Segment Glass Separation Opening:
 * - 4 distinct architectural bottle archetypes (Hexagonal Obelisk, Fluted Flask, Octagonal Decanter, Conical Amphora)
 * - 4-segment quadrant vessel shell blooming outward smoothly on springs when open
 * - Stopper / crown cap lifting upward along +Y
 * - Authentic vector SVG technology logo floating up from the core with illuminated glow
 * - Dynamic procedural PMREM studio lighting adapted for Dark & Light modes
 * - Visibility-based throttling, mobile clamping, and complete resource cleanup
 */
export default function CrystalBottle3D({
  tech,
  theme = 'dark',
  isOpen = true,
  onToggleOpen,
}) {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [webGLFailed, setWebGLFailed] = useState(false);

  const themeRef = useRef(theme);
  const isOpenRef = useRef(isOpen);
  const techRef = useRef(tech);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    techRef.current = tech;
  }, [tech]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 520;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLFailed(true);
        return;
      }
    } catch (e) {
      setWebGLFailed(true);
      return;
    }

    const isLightMode = themeRef.current === 'light';

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 6.2);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); // Mobile-optimized clamp
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLightMode ? 1.25 : 1.4;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.pointerEvents = 'none'; // Never intercept clicks
    container.appendChild(renderer.domElement);

    // 3. Procedural Studio PMREM Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext('2d');

    const generateEnvTexture = (light) => {
      const grad = envCtx.createLinearGradient(0, 0, 0, 512);
      if (light) {
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, '#e2e8f0');
        grad.addColorStop(1, '#cbd5e1');
      } else {
        grad.addColorStop(0, '#09090b');
        grad.addColorStop(0.5, '#18181b');
        grad.addColorStop(1, '#050507');
      }
      envCtx.fillStyle = grad;
      envCtx.fillRect(0, 0, 1024, 512);

      // Studio key softbox fixtures
      const soft1 = envCtx.createRadialGradient(280, 110, 10, 280, 110, 220);
      soft1.addColorStop(0, '#ffffff');
      soft1.addColorStop(0.6, light ? '#cbd5e1' : '#71717a');
      soft1.addColorStop(1, 'rgba(0,0,0,0)');
      envCtx.fillStyle = soft1;
      envCtx.fillRect(0, 0, 1024, 512);

      const soft2 = envCtx.createRadialGradient(760, 140, 10, 760, 140, 240);
      soft2.addColorStop(0, '#ffffff');
      soft2.addColorStop(0.7, light ? '#94a3b8' : '#52525b');
      soft2.addColorStop(1, 'rgba(0,0,0,0)');
      envCtx.fillStyle = soft2;
      envCtx.fillRect(0, 0, 1024, 512);

      const envTex = new THREE.CanvasTexture(envCanvas);
      const pmrem = pmremGenerator.fromEquirectangular(envTex);
      envTex.dispose();
      return pmrem;
    };

    let currentEnv = generateEnvTexture(isLightMode);
    scene.environment = currentEnv.texture;

    // 4. Lighting Fixtures
    const ambientLight = new THREE.AmbientLight(
      isLightMode ? 0xf8fafc : 0xffffff,
      isLightMode ? 0.9 : 0.6
    );
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xffffff, isLightMode ? 4.5 : 5.8);
    keySpot.position.set(0, 6, 4);
    keySpot.angle = Math.PI / 4.5;
    keySpot.penumbra = 0.55;
    keySpot.castShadow = true;
    scene.add(keySpot);

    const leftRimSpot = new THREE.SpotLight(0xffffff, isLightMode ? 2.5 : 4.2);
    leftRimSpot.position.set(-4, 2.5, -2);
    leftRimSpot.angle = Math.PI / 4;
    scene.add(leftRimSpot);

    const rightRimSpot = new THREE.SpotLight(0xffffff, isLightMode ? 2.5 : 4.2);
    rightRimSpot.position.set(4, 2.5, -2);
    rightRimSpot.angle = Math.PI / 4;
    scene.add(rightRimSpot);

    // 5. Materials Setup
    // Physical Crystal Glass Material (Segmented Shell)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: isLightMode ? 0xf8fafc : 0x1c1c22,
      metalness: isLightMode ? 0.1 : 0.85,
      roughness: isLightMode ? 0.03 : 0.05,
      transmission: isLightMode ? 0.92 : 0.45,
      ior: 1.52,
      thickness: isLightMode ? 1.8 : 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 2.2,
    });

    // Brushed Chrome / Titanium Ring Material
    const chromeMat = new THREE.MeshStandardMaterial({
      color: isLightMode ? 0xe2e8f0 : 0xffffff,
      metalness: 0.96,
      roughness: 0.12,
      envMapIntensity: 2.5,
    });

    // Obsidian Pedestal Material
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: isLightMode ? 0xd1d5db : 0x121215,
      metalness: 0.85,
      roughness: 0.15,
      envMapIntensity: 1.5,
    });

    // 6. Master Crystal Bottle Hierarchy
    const bottleMasterGroup = new THREE.Group();
    scene.add(bottleMasterGroup);

    // Root Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.16, 32);
    const baseMesh = new THREE.Mesh(baseGeo, pedestalMat);
    baseMesh.position.y = -1.18;
    bottleMasterGroup.add(baseMesh);

    const baseRingGeo = new THREE.TorusGeometry(0.86, 0.02, 16, 48);
    const baseRingMesh = new THREE.Mesh(baseRingGeo, chromeMat);
    baseRingMesh.rotation.x = Math.PI / 2;
    baseRingMesh.position.y = -1.1;
    bottleMasterGroup.add(baseRingMesh);

    // Determine bottle archetype geometry parameters
    const archetype = tech.archetype || 'Hexagonal Obelisk Vial';
    let radTop = 0.55;
    let radBottom = 0.58;
    let vesselHeight = 2.0;
    let radialFacets = 6;

    if (archetype.includes('Fluted')) {
      radTop = 0.65;
      radBottom = 0.65;
      vesselHeight = 1.9;
      radialFacets = 12;
    } else if (archetype.includes('Decanter')) {
      radTop = 0.72;
      radBottom = 0.72;
      vesselHeight = 2.0;
      radialFacets = 8;
    } else if (archetype.includes('Amphora')) {
      radTop = 0.72;
      radBottom = 0.42;
      vesselHeight = 2.1;
      radialFacets = 8;
    }

    // 7. Four-Segment Quadrant Crystal Vessel Shell
    // Instead of one rigid cylinder, 4 separate quadrant segments bloom outward!
    const shellSegments = [];
    const segmentAngle = Math.PI / 2;
    const gapAngle = 0.05; // Bevel clearance gap

    for (let i = 0; i < 4; i++) {
      const segGroup = new THREE.Group();
      const thetaStart = i * segmentAngle + gapAngle / 2;
      const thetaLength = segmentAngle - gapAngle;

      const segGeo = new THREE.CylinderGeometry(
        radTop,
        radBottom,
        vesselHeight,
        radialFacets / 2,
        1,
        false,
        thetaStart,
        thetaLength
      );

      const segMesh = new THREE.Mesh(segGeo, glassMat);
      segMesh.castShadow = true;
      segMesh.receiveShadow = true;
      segGroup.add(segMesh);

      // Chrome rim trim on top edge of segment
      const rimGeo = new THREE.CylinderGeometry(
        radTop * 1.02,
        radTop * 1.02,
        0.04,
        radialFacets / 2,
        1,
        true,
        thetaStart,
        thetaLength
      );
      const rimMesh = new THREE.Mesh(rimGeo, chromeMat);
      rimMesh.position.y = vesselHeight / 2;
      segGroup.add(rimMesh);

      // Angle for outward bloom separation
      const midAngle = thetaStart + thetaLength / 2;
      segGroup.userData = {
        outDirX: Math.cos(midAngle),
        outDirZ: Math.sin(midAngle),
        origX: 0,
        origZ: 0,
      };

      bottleMasterGroup.add(segGroup);
      shellSegments.push(segGroup);
    }

    // 8. Stopper / Crown Cap Group
    const stopperGroup = new THREE.Group();
    stopperGroup.position.y = vesselHeight / 2 + 0.08;

    // Stopper Neck Collar Ring
    const collarGeo = new THREE.TorusGeometry(radTop * 0.95, 0.035, 16, 32);
    const collarMesh = new THREE.Mesh(collarGeo, chromeMat);
    collarMesh.rotation.x = Math.PI / 2;
    stopperGroup.add(collarMesh);

    // Faceted Stopper Gem / Finial depending on archetype
    let capFinialGeo;
    if (archetype.includes('Fluted')) {
      capFinialGeo = new THREE.SphereGeometry(radTop * 0.48, 16, 16);
    } else if (archetype.includes('Decanter')) {
      capFinialGeo = new THREE.OctahedronGeometry(radTop * 0.55, 0);
    } else if (archetype.includes('Amphora')) {
      capFinialGeo = new THREE.CylinderGeometry(radTop * 0.6, radTop * 0.35, 0.45, 8);
    } else {
      // Hexagonal pyramid stopper
      capFinialGeo = new THREE.ConeGeometry(radTop * 0.52, 0.65, 6);
    }
    const capFinialMesh = new THREE.Mesh(capFinialGeo, glassMat);
    capFinialMesh.position.y = 0.32;
    stopperGroup.add(capFinialMesh);

    bottleMasterGroup.add(stopperGroup);

    // 9. Authentic 2D Vector CanvasTexture for Inner Core
    let logoTex = null;
    let logoMesh = null;
    const logoGroup = new THREE.Group();
    bottleMasterGroup.add(logoGroup);

    const updateLogoTexture = (currentTechKey, light) => {
      const logoDef = TECH_SVG_LOGOS[currentTechKey];
      if (!logoDef) return null;

      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, 512, 512);

      // Core luminous ambient bloom behind vector path
      const radial = ctx.createRadialGradient(256, 256, 20, 256, 256, 200);
      radial.addColorStop(0, light ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.28)');
      radial.addColorStop(0.5, light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)');
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(256, 256, 200, 0, Math.PI * 2);
      ctx.fill();

      // Render crisp authentic SVG vector path
      ctx.save();
      const targetSize = 260;
      const scale = targetSize / 24;
      ctx.translate((512 - targetSize) / 2, (512 - targetSize) / 2);
      ctx.scale(scale, scale);

      ctx.fillStyle = light ? '#09090b' : '#ffffff';
      ctx.shadowColor = light ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.95)';
      ctx.shadowBlur = 14;

      try {
        const path = new Path2D(logoDef.path);
        ctx.fill(path);
      } catch (err) {
        // Fallback text if path parsing fails
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(currentTechKey.toUpperCase(), 0, 16);
      }
      ctx.restore();

      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    };

    logoTex = updateLogoTexture(tech.key, isLightMode);
    if (logoTex) {
      const logoPlaneGeo = new THREE.PlaneGeometry(0.85, 0.85);
      const logoMat = new THREE.MeshStandardMaterial({
        map: logoTex,
        transparent: true,
        alphaTest: 0.05,
        depthWrite: false,
        side: THREE.DoubleSide,
        emissive: isLightMode ? 0x000000 : 0xffffff,
        emissiveIntensity: isLightMode ? 0.0 : 0.65,
        roughness: 0.2,
      });
      logoMesh = new THREE.Mesh(logoPlaneGeo, logoMat);
      logoGroup.add(logoMesh);
    }

    // 10. Ascending Core Spark Particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVels = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 0.9;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
      particleVels[i] = 0.008 + Math.random() * 0.014;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: isLightMode ? 0x475569 : 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: isLightMode ? 0.35 : 0.65,
      blending: isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    bottleMasterGroup.add(particles);

    // 11. Mouse Movement Parallax
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      targetRotY = x * 0.6;
      targetRotX = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 12. Dynamic Theme Listener
    const updateThemeInScene = (light) => {
      renderer.toneMappingExposure = light ? 1.25 : 1.4;
      ambientLight.color.set(light ? 0xf8fafc : 0xffffff);
      ambientLight.intensity = light ? 0.9 : 0.6;

      keySpot.intensity = light ? 4.5 : 5.8;
      leftRimSpot.intensity = light ? 2.5 : 4.2;
      rightRimSpot.intensity = light ? 2.5 : 4.2;

      glassMat.color.set(light ? 0xf8fafc : 0x1c1c22);
      glassMat.metalness = light ? 0.1 : 0.85;
      glassMat.transmission = light ? 0.92 : 0.45;

      chromeMat.color.set(light ? 0xe2e8f0 : 0xffffff);
      pedestalMat.color.set(light ? 0xd1d5db : 0x121215);

      if (currentEnv) currentEnv.texture.dispose();
      currentEnv = generateEnvTexture(light);
      scene.environment = currentEnv.texture;

      if (logoMesh && techRef.current) {
        if (logoTex) logoTex.dispose();
        logoTex = updateLogoTexture(techRef.current.key, light);
        logoMesh.material.map = logoTex;
        logoMesh.material.emissive.set(light ? 0x000000 : 0xffffff);
        logoMesh.material.emissiveIntensity = light ? 0.0 : 0.65;
        logoMesh.material.needsUpdate = true;
      }
    };

    const themeObserver = new MutationObserver(() => {
      const isNowLight = document.documentElement.classList.contains('light');
      updateThemeInScene(isNowLight);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // 13. Visibility & Resize Observers
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

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 400;
      height = container.clientHeight || 520;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    setIsLoaded(true);

    // 14. Animation Loop with Spring-Based Glass Separation
    let animationFrameId;
    const clock = new THREE.Clock();

    // Opening animation state values
    let currentSeparation = isOpenRef.current ? 0.85 : 0;
    let currentCapY = isOpenRef.current ? 1.6 : 0;
    let currentLogoY = isOpenRef.current ? 0.65 : 0;
    let currentLogoScale = isOpenRef.current ? 1.25 : 1.0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();
      const open = isOpenRef.current;

      // Spring targets for glass opening
      const targetSep = open ? 0.82 : 0;
      const targetCap = open ? 1.55 : 0;
      const targetLgY = open ? 0.62 : 0;
      const targetLgScale = open ? 1.25 : 1.0;

      // Damped spring interpolation (smooth mechanical opening)
      currentSeparation += (targetSep - currentSeparation) * 0.075;
      currentCapY += (targetCap - currentCapY) * 0.08;
      currentLogoY += (targetLgY - currentLogoY) * 0.08;
      currentLogoScale += (targetLgScale - currentLogoScale) * 0.08;

      // 1. Animate the 4 quadrant crystal shell segments blooming outward
      shellSegments.forEach((seg, idx) => {
        const sepDist = currentSeparation;
        seg.position.x = seg.userData.outDirX * sepDist;
        seg.position.z = seg.userData.outDirZ * sepDist;

        // Subtle petal tilt when opening outward
        const tiltMagnitude = (currentSeparation / 0.82) * 0.14;
        seg.rotation.z = -seg.userData.outDirX * tiltMagnitude;
        seg.rotation.x = seg.userData.outDirZ * tiltMagnitude;
      });

      // 2. Animate the Stopper lifting along +Y with gentle pitch
      stopperGroup.position.y = vesselHeight / 2 + 0.08 + currentCapY;
      stopperGroup.rotation.y = (currentCapY / 1.55) * 0.4;
      stopperGroup.rotation.x = Math.sin(elapsedTime * 1.5) * 0.03;

      // 3. Animate the authentic SVG logo emerging from chamber
      if (logoMesh) {
        logoMesh.position.y = currentLogoY;
        logoMesh.scale.set(currentLogoScale, currentLogoScale, currentLogoScale);
        logoMesh.rotation.y = elapsedTime * 0.45; // Gentle continuous rotation
      }

      // 4. Gentle idle breathing float of the entire bottle
      bottleMasterGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.05;

      // 5. Parallax rotation
      bottleMasterGroup.rotation.y += (targetRotY - bottleMasterGroup.rotation.y) * 0.05;
      bottleMasterGroup.rotation.x += (targetRotX - bottleMasterGroup.rotation.x) * 0.05;

      // 6. Upward drifting particles inside the vault chamber
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += particleVels[i];
        if (pos[i * 3 + 1] > 1.8) {
          pos[i * 3 + 1] = -0.9;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 15. Complete Resource Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);

      pmremGenerator.dispose();
      if (currentEnv) currentEnv.texture.dispose();
      if (logoTex) logoTex.dispose();

      baseGeo.dispose();
      baseRingGeo.dispose();
      collarGeo.dispose();
      capFinialGeo.dispose();
      particleGeo.dispose();

      glassMat.dispose();
      chromeMat.dispose();
      pedestalMat.dispose();
      particleMat.dispose();

      shellSegments.forEach((seg) => {
        seg.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
        });
      });

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [tech.key]);

  if (webGLFailed) {
    return (
      <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-center p-6 text-center rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
          Hardware WebGL Fallback
        </span>
        <h4 className="text-lg font-bold text-white mb-2">{tech.label}</h4>
        <p className="text-xs text-zinc-400 max-w-xs">{tech.advantage}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[440px] sm:min-h-[500px] flex items-center justify-center select-none">
      {/* Loading Shimmer State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-3xl z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <span className="text-[11px] font-mono text-zinc-400 tracking-widest uppercase">
              Crystalizing Relic...
            </span>
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full pointer-events-none" />

      {/* Atmosphere Vignette & Floor Reflection */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent dark:from-black/80 light:from-white/80 opacity-80" />
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-white/[0.05] dark:bg-white/[0.05] light:bg-black/[0.03] blur-3xl rounded-full" />
    </div>
  );
}
