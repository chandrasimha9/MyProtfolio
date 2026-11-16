'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ChromeSphereCanvas({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Procedural Studio Monochrome Environment Map
    // Generates realistic black-and-white studio softbox reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext('2d');

    // Studio backdrop gradient: pure deep studio dark with overhead and lateral softboxes
    const gradient = envCtx.createLinearGradient(0, 0, 0, envCanvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(0.5, '#141414');
    gradient.addColorStop(1, '#050505');
    envCtx.fillStyle = gradient;
    envCtx.fillRect(0, 0, envCanvas.width, envCanvas.height);

    // Studio softbox 1 (Overhead soft key light)
    const softbox1 = envCtx.createRadialGradient(512, 120, 20, 512, 120, 220);
    softbox1.addColorStop(0, '#ffffff');
    softbox1.addColorStop(0.5, '#aaaaaa');
    softbox1.addColorStop(1, 'rgba(0,0,0,0)');
    envCtx.fillStyle = softbox1;
    envCtx.fillRect(0, 0, envCanvas.width, 300);

    // Studio softbox 2 (Lateral rim strip)
    const softbox2 = envCtx.createLinearGradient(80, 0, 220, 0);
    softbox2.addColorStop(0, 'rgba(0,0,0,0)');
    softbox2.addColorStop(0.5, '#ffffff');
    softbox2.addColorStop(1, 'rgba(0,0,0,0)');
    envCtx.fillStyle = softbox2;
    envCtx.fillRect(80, 100, 140, 320);

    // Studio softbox 3 (Opposite subtle fill strip)
    const softbox3 = envCtx.createLinearGradient(780, 0, 920, 0);
    softbox3.addColorStop(0, 'rgba(0,0,0,0)');
    softbox3.addColorStop(0.5, '#888888');
    softbox3.addColorStop(1, 'rgba(0,0,0,0)');
    envCtx.fillStyle = softbox3;
    envCtx.fillRect(780, 120, 140, 280);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    scene.environment = envMap;

    // 5. Polished Chrome Sphere
    const geometry = new THREE.SphereGeometry(1.4, 64, 64);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#dcdcdc'),
      metalness: 0.98,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
      envMapIntensity: 1.4,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    scene.add(sphere);

    // Subtle floating satellite ring (pure chrome minimal accent)
    const ringGeo = new THREE.TorusGeometry(1.85, 0.015, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.1,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.35;
    ring.rotation.y = Math.PI * 0.15;
    scene.add(ring);

    // 6. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x222222, 1.2);
    scene.add(ambientLight);

    // Key Light (Bright white directional)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    // Rim Light (Sharp back specular)
    const rimLight = new THREE.DirectionalLight(0xdddddd, 2.0);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    // Point highlight
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
    pointLight.position.set(0, 3, 3);
    scene.add(pointLight);

    // 7. Ambient Dust Particle Atmosphere inside the 3D Sphere viewport
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      particleSpeeds.push({
        y: Math.random() * 0.003 + 0.001,
        amp: Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xcccccc,
      size: 0.04,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Mouse Parallax and Animation Loop
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / width - 0.5) * 2;
      mouse.targetY = -(clientY / height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Ultra-slow realistic rotation
      sphere.rotation.y = elapsedTime * 0.12;
      sphere.rotation.x = Math.sin(elapsedTime * 0.08) * 0.15;

      ring.rotation.z = -elapsedTime * 0.08;
      ring.rotation.x = Math.PI * 0.35 + Math.sin(elapsedTime * 0.15) * 0.1;

      // Natural subtle floating sinewave
      sphere.position.y = Math.sin(elapsedTime * 0.8) * 0.09 + mouse.y * 0.25;
      sphere.position.x = Math.cos(elapsedTime * 0.6) * 0.05 + mouse.x * 0.25;

      ring.position.y = sphere.position.y;
      ring.position.x = sphere.position.x;

      // Animate ambient dust particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i].y;
        positions[i * 3] += Math.sin(elapsedTime + particleSpeeds[i].phase) * particleSpeeds[i].amp;
        if (positions[i * 3 + 1] > 2.5) {
          positions[i * 3 + 1] = -2.5;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 300;
      const newH = container.clientHeight || 300;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      envTexture.dispose();
      envMap.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
