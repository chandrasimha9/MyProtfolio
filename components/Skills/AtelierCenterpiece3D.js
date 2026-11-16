'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AtelierCenterpiece3D({ theme = 'dark', className = '' }) {
  const mountRef = useRef(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 440;
    let height = container.clientHeight || 580;

    const isLightMode = themeRef.current === 'light';

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup with cinematic perspective
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.45, 6.4);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLightMode ? 1.25 : 1.45;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // 4. Procedural High-Fidelity Studio Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext('2d');

    const updateEnvMap = (light) => {
      const grad = envCtx.createLinearGradient(0, 0, 0, 512);
      if (light) {
        grad.addColorStop(0, '#f8fafc');
        grad.addColorStop(0.5, '#e2e8f0');
        grad.addColorStop(1, '#cbd5e1');
      } else {
        grad.addColorStop(0, '#09090b');
        grad.addColorStop(0.5, '#18181b');
        grad.addColorStop(1, '#030304');
      }
      envCtx.fillStyle = grad;
      envCtx.fillRect(0, 0, 1024, 512);

      // Dual overhead studio key softboxes
      const soft1 = envCtx.createRadialGradient(320, 90, 10, 320, 90, 240);
      soft1.addColorStop(0, '#ffffff');
      soft1.addColorStop(0.6, light ? '#cbd5e1' : '#71717a');
      soft1.addColorStop(1, 'rgba(0,0,0,0)');
      envCtx.fillStyle = soft1;
      envCtx.fillRect(0, 0, 600, 320);

      const soft2 = envCtx.createRadialGradient(704, 90, 10, 704, 90, 240);
      soft2.addColorStop(0, '#ffffff');
      soft2.addColorStop(0.6, light ? '#cbd5e1' : '#71717a');
      soft2.addColorStop(1, 'rgba(0,0,0,0)');
      envCtx.fillStyle = soft2;
      envCtx.fillRect(424, 0, 600, 320);

      // Lateral rim highlight strips
      const rimLeft = envCtx.createLinearGradient(60, 0, 160, 0);
      rimLeft.addColorStop(0, 'rgba(0,0,0,0)');
      rimLeft.addColorStop(0.5, '#ffffff');
      rimLeft.addColorStop(1, 'rgba(0,0,0,0)');
      envCtx.fillStyle = rimLeft;
      envCtx.fillRect(60, 100, 100, 320);

      const rimRight = envCtx.createLinearGradient(864, 0, 964, 0);
      rimRight.addColorStop(0, 'rgba(0,0,0,0)');
      rimRight.addColorStop(0.5, '#ffffff');
      rimRight.addColorStop(1, 'rgba(0,0,0,0)');
      envCtx.fillStyle = rimRight;
      envCtx.fillRect(864, 100, 100, 320);

      const envTexture = new THREE.CanvasTexture(envCanvas);
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
      scene.environment = envMap;
      return { envTexture, envMap };
    };

    let currentEnv = updateEnvMap(isLightMode);

    // 5. Studio Lights & Controlled Rim Lighting
    const ambientLight = new THREE.AmbientLight(
      isLightMode ? 0xf8fafc : 0xffffff,
      isLightMode ? 0.85 : 0.55
    );
    scene.add(ambientLight);

    // Key Spotlights
    const spot1 = new THREE.SpotLight(0xffffff, isLightMode ? 4.8 : 6.0, 30, Math.PI / 4, 0.35, 1.2);
    spot1.position.set(-2.8, 6.0, 3.2);
    spot1.castShadow = true;
    scene.add(spot1);

    const spot2 = new THREE.SpotLight(0xffffff, isLightMode ? 4.8 : 6.0, 30, Math.PI / 4, 0.35, 1.2);
    spot2.position.set(2.8, 6.0, 3.2);
    spot2.castShadow = true;
    scene.add(spot2);

    // Pure White Lateral Rim Lights (Guarantees crystal edges pop in dark mode)
    const leftRimSpot = new THREE.SpotLight(0xffffff, isLightMode ? 2.5 : 4.5, 20, Math.PI / 3, 0.5);
    leftRimSpot.position.set(-4.5, 2.5, -2);
    scene.add(leftRimSpot);

    const rightRimSpot = new THREE.SpotLight(0xffffff, isLightMode ? 2.5 : 4.5, 20, Math.PI / 3, 0.5);
    rightRimSpot.position.set(4.5, 2.5, -2);
    scene.add(rightRimSpot);

    const backRimLight = new THREE.DirectionalLight(
      isLightMode ? 0x94a3b8 : 0xffffff,
      isLightMode ? 2.2 : 3.0
    );
    backRimLight.position.set(0, 3.5, -4.5);
    scene.add(backRimLight);

    // 6. Stepped Circular Pedestal / Dais
    const pedestalGroup = new THREE.Group();
    scene.add(pedestalGroup);

    const pedestalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isLightMode ? '#cbd5e1' : '#141417'),
      metalness: 0.95,
      roughness: isLightMode ? 0.08 : 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
    });

    const tier1 = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.5, 0.15, 64),
      pedestalMat
    );
    tier1.position.y = -1.68;
    tier1.receiveShadow = true;
    pedestalGroup.add(tier1);

    const tier2 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.9, 2.0, 0.17, 64),
      pedestalMat
    );
    tier2.position.y = -1.53;
    tier2.receiveShadow = true;
    pedestalGroup.add(tier2);

    const tier3 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.42, 1.5, 0.19, 64),
      pedestalMat
    );
    tier3.position.y = -1.36;
    tier3.receiveShadow = true;
    pedestalGroup.add(tier3);

    // Concentric Luminous Ground Light Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: isLightMode ? 0x1e293b : 0xffffff,
      transparent: true,
      opacity: isLightMode ? 0.7 : 0.9,
      side: THREE.DoubleSide,
    });
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: isLightMode ? 0x475569 : 0xe2e8f0,
      transparent: true,
      opacity: isLightMode ? 0.4 : 0.5,
      side: THREE.DoubleSide,
    });

    const groundRing1 = new THREE.Mesh(
      new THREE.RingGeometry(2.62, 2.67, 64),
      ringMat1
    );
    groundRing1.rotation.x = -Math.PI / 2;
    groundRing1.position.y = -1.75;
    scene.add(groundRing1);

    const groundRing2 = new THREE.Mesh(
      new THREE.RingGeometry(2.95, 2.99, 64),
      ringMat2
    );
    groundRing2.rotation.x = -Math.PI / 2;
    groundRing2.position.y = -1.75;
    scene.add(groundRing2);

    const platformRing = new THREE.Mesh(
      new THREE.RingGeometry(1.26, 1.3, 64),
      ringMat1
    );
    platformRing.rotation.x = -Math.PI / 2;
    platformRing.position.y = -1.258;
    scene.add(platformRing);

    // 7. Central Floating Crystal Sculpture
    const crystalGroup = new THREE.Group();
    crystalGroup.position.y = 0.35;
    crystalGroup.rotation.z = -0.15;
    crystalGroup.rotation.x = 0.22;
    scene.add(crystalGroup);

    // Polyhedral Faceted Octahedron Crystal Geometry
    const crystalGeo = new THREE.OctahedronGeometry(1.22, 0);

    // Physically Based Refractive Glass & Obsidian Specular Material
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isLightMode ? '#f8fafc' : '#1e1e24'),
      metalness: isLightMode ? 0.15 : 0.92,
      roughness: isLightMode ? 0.03 : 0.06,
      transmission: isLightMode ? 0.92 : 0.35, // True optical glass transmission in light mode
      ior: 1.52,
      thickness: isLightMode ? 1.8 : 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
      envMapIntensity: isLightMode ? 2.4 : 2.0,
      flatShading: true,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.castShadow = true;
    crystalGroup.add(crystal);

    // Polished Silver / White Beveled Facet Edges
    const wireframeGeo = new THREE.WireframeGeometry(crystalGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: isLightMode ? 0x94a3b8 : 0xffffff,
      transparent: true,
      opacity: isLightMode ? 0.45 : 0.5,
      linewidth: 1.5,
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    crystalGroup.add(wireframe);

    // 8. Illuminated Developer Emblem: </>
    const emblemCanvas = document.createElement('canvas');
    emblemCanvas.width = 512;
    emblemCanvas.height = 512;
    const emblemCtx = emblemCanvas.getContext('2d');

    const drawEmblem = (light) => {
      emblemCtx.clearRect(0, 0, 512, 512);
      emblemCtx.fillStyle = light ? '#0f172a' : '#ffffff';
      emblemCtx.font = '900 135px "JetBrains Mono", monospace';
      emblemCtx.textAlign = 'center';
      emblemCtx.textBaseline = 'middle';
      emblemCtx.shadowColor = light ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.95)';
      emblemCtx.shadowBlur = light ? 14 : 28;
      emblemCtx.fillText('</>', 256, 256);
    };
    drawEmblem(isLightMode);

    const emblemTex = new THREE.CanvasTexture(emblemCanvas);
    emblemTex.colorSpace = THREE.SRGBColorSpace;

    const emblemPlaneGeo = new THREE.PlaneGeometry(1.4, 1.4);
    const emblemMat = new THREE.MeshBasicMaterial({
      map: emblemTex,
      transparent: true,
      opacity: isLightMode ? 0.95 : 0.98,
      side: THREE.DoubleSide,
      blending: isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });

    const emblemFront = new THREE.Mesh(emblemPlaneGeo, emblemMat);
    emblemFront.position.z = 0.88;
    crystalGroup.add(emblemFront);

    const emblemBack = new THREE.Mesh(emblemPlaneGeo, emblemMat);
    emblemBack.position.z = -0.88;
    emblemBack.rotation.y = Math.PI;
    crystalGroup.add(emblemBack);

    // 9. Refined Delicate Orbital Rings (Thinner, subtle & complementary)
    const ringGroup = new THREE.Group();
    crystalGroup.add(ringGroup);

    const orbitRing1Mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isLightMode ? '#e2e8f0' : '#ffffff'),
      emissive: new THREE.Color(isLightMode ? '#222222' : '#777777'),
      metalness: 0.98,
      roughness: 0.04,
      clearcoat: 1.0,
    });
    // Delicate Ring 1: Radius 1.95, Thickness 0.012 (Thinner & refined)
    const orbitRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.95, 0.012, 16, 140),
      orbitRing1Mat
    );
    orbitRing1.rotation.x = Math.PI / 2.8;
    orbitRing1.rotation.y = Math.PI / 5;
    ringGroup.add(orbitRing1);

    const orbitRing2Mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isLightMode ? '#cbd5e1' : '#e2e8f0'),
      emissive: new THREE.Color(isLightMode ? '#1e293b' : '#555555'),
      metalness: 0.98,
      roughness: 0.06,
      clearcoat: 1.0,
    });
    // Delicate Ring 2: Radius 2.25, Thickness 0.009 (Thinner & refined)
    const orbitRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.009, 16, 140),
      orbitRing2Mat
    );
    orbitRing2.rotation.x = -Math.PI / 3.2;
    orbitRing2.rotation.z = Math.PI / 3.8;
    ringGroup.add(orbitRing2);

    // 10. Ambient Drifting Atmospheric Particles
    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVels = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5.5;
      particleVels[i] = 0.003 + Math.random() * 0.005;
    }

    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: isLightMode ? 0x64748b : 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: isLightMode ? 0.4 : 0.55,
      blending: isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 11. Mouse Movement Parallax
    let targetCameraX = 0;
    let targetCameraY = 0.45;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;

      targetCameraX = x * 1.1;
      targetCameraY = 0.45 - y * 0.7;
    };

    const handleMouseLeave = () => {
      targetCameraX = 0;
      targetCameraY = 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // 12. Dynamic Theme Listener (Live In-Session Transition)
    const updateThemeInScene = (light) => {
      renderer.toneMappingExposure = light ? 1.25 : 1.45;
      ambientLight.color.set(light ? 0xf8fafc : 0xffffff);
      ambientLight.intensity = light ? 0.85 : 0.55;

      spot1.intensity = light ? 4.8 : 6.0;
      spot2.intensity = light ? 4.8 : 6.0;

      leftRimSpot.intensity = light ? 2.5 : 4.5;
      rightRimSpot.intensity = light ? 2.5 : 4.5;

      backRimLight.color.set(light ? 0x94a3b8 : 0xffffff);
      backRimLight.intensity = light ? 2.2 : 3.0;

      pedestalMat.color.set(light ? '#cbd5e1' : '#141417');
      pedestalMat.roughness = light ? 0.08 : 0.12;

      ringMat1.color.set(light ? 0x1e293b : 0xffffff);
      ringMat1.opacity = light ? 0.7 : 0.9;
      ringMat2.color.set(light ? 0x475569 : 0xe2e8f0);
      ringMat2.opacity = light ? 0.4 : 0.5;

      crystalMat.color.set(light ? '#f8fafc' : '#1e1e24');
      crystalMat.metalness = light ? 0.15 : 0.92;
      crystalMat.roughness = light ? 0.03 : 0.06;
      crystalMat.transmission = light ? 0.92 : 0.35;
      crystalMat.thickness = light ? 1.8 : 1.2;
      crystalMat.envMapIntensity = light ? 2.4 : 2.0;

      wireframeMat.color.set(light ? 0x94a3b8 : 0xffffff);
      wireframeMat.opacity = light ? 0.45 : 0.5;

      drawEmblem(light);
      emblemTex.needsUpdate = true;
      emblemMat.opacity = light ? 0.95 : 0.98;
      emblemMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;

      orbitRing1Mat.color.set(light ? '#e2e8f0' : '#ffffff');
      orbitRing1Mat.emissive.set(light ? '#222222' : '#777777');
      orbitRing2Mat.color.set(light ? '#cbd5e1' : '#e2e8f0');
      orbitRing2Mat.emissive.set(light ? '#1e293b' : '#555555');

      particleMat.color.set(light ? 0x64748b : 0xffffff);
      particleMat.opacity = light ? 0.4 : 0.55;
      particleMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;

      if (currentEnv) {
        currentEnv.envTexture.dispose();
      }
      currentEnv = updateEnvMap(light);
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
      width = container.clientWidth || 440;
      height = container.clientHeight || 580;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 14. Animation Loop
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

      // Crystal multi-axis floating rotation
      crystal.rotation.x = elapsedTime * 0.22;
      crystal.rotation.y = elapsedTime * 0.32;
      crystal.rotation.z = Math.sin(elapsedTime * 0.4) * 0.12;

      // Crystal vertical floating breathing
      crystalGroup.position.y = 0.35 + Math.sin(elapsedTime * 1.3) * 0.07;

      // Delicate orbiting rings revolution
      orbitRing1.rotation.z += 0.007;
      orbitRing2.rotation.y += 0.005;
      orbitRing2.rotation.x += 0.003;

      // Particle vertical drift
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleVels[i];
        if (positions[i * 3 + 1] > 3.2) {
          positions[i * 3 + 1] = -2.2;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 15. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);

      pmremGenerator.dispose();
      if (currentEnv) {
        currentEnv.envTexture.dispose();
      }
      emblemTex.dispose();

      crystalGeo.dispose();
      crystalMat.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      emblemPlaneGeo.dispose();
      emblemMat.dispose();
      orbitRing1Mat.dispose();
      orbitRing2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      pedestalMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[460px] sm:min-h-[520px] md:min-h-[580px] flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full pointer-events-none" />

      {/* Atmospheric Floor Light Reflection & Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent dark:from-black/80 light:from-white/80 opacity-80" />
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-28 bg-white/[0.05] dark:bg-white/[0.05] light:bg-black/[0.03] blur-3xl rounded-full" />
    </div>
  );
}
