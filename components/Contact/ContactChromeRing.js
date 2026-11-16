'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ContactChromeRing({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 4. Procedural Studio Monochrome Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext('2d');

    // Studio gradient
    const grad = envCtx.createLinearGradient(0, 0, 0, envCanvas.height);
    grad.addColorStop(0, '#0a0a0a');
    grad.addColorStop(0.5, '#181818');
    grad.addColorStop(1, '#050505');
    envCtx.fillStyle = grad;
    envCtx.fillRect(0, 0, envCanvas.width, envCanvas.height);

    // Studio softbox overhead
    const soft1 = envCtx.createRadialGradient(512, 100, 10, 512, 100, 200);
    soft1.addColorStop(0, '#ffffff');
    soft1.addColorStop(0.5, '#999999');
    soft1.addColorStop(1, 'rgba(0,0,0,0)');
    envCtx.fillStyle = soft1;
    envCtx.fillRect(0, 0, envCanvas.width, 280);

    // Lateral studio highlights
    const soft2 = envCtx.createLinearGradient(60, 0, 200, 0);
    soft2.addColorStop(0, 'rgba(0,0,0,0)');
    soft2.addColorStop(0.5, '#ffffff');
    soft2.addColorStop(1, 'rgba(0,0,0,0)');
    envCtx.fillStyle = soft2;
    envCtx.fillRect(60, 100, 140, 300);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    scene.environment = envMap;

    // 5. Metallic Chrome 3D Torus Knot / Gyroscope Sculpture
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e0e0e0'),
      metalness: 0.98,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      envMapIntensity: 1.5,
    });

    // Primary Torus Knot
    const knotGeo = new THREE.TorusKnotGeometry(1.35, 0.32, 128, 32, 2, 3);
    const knot = new THREE.Mesh(knotGeo, chromeMaterial);
    scene.add(knot);

    // Secondary Outer Orbiting Ring
    const outerRingGeo = new THREE.TorusGeometry(2.35, 0.02, 16, 100);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.1,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI * 0.4;
    scene.add(outerRing);

    // 6. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x222222, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xcccccc, 2.0);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const centerPoint = new THREE.PointLight(0xffffff, 1.6, 12);
    centerPoint.position.set(0, 2, 3);
    scene.add(centerPoint);

    // 7. Ambient Floating Dust Particles
    const particleCount = 50;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 6;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      particleSpeeds.push({
        y: Math.random() * 0.003 + 0.001,
        amp: Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xdddddd,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Mouse Parallax and Animation
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
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Slow organic rotation
      knot.rotation.y = elapsedTime * 0.18 + mouse.x * 0.35;
      knot.rotation.x = elapsedTime * 0.12 - mouse.y * 0.35;
      knot.rotation.z = Math.sin(elapsedTime * 0.1) * 0.15;

      outerRing.rotation.z = -elapsedTime * 0.09;
      outerRing.rotation.y = Math.sin(elapsedTime * 0.15) * 0.2 + mouse.x * 0.2;

      // Floating sinewave
      const floatY = Math.sin(elapsedTime * 0.8) * 0.1;
      knot.position.y = floatY;
      outerRing.position.y = floatY;

      // Particle drift
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i].y;
        positions[i * 3] += Math.sin(elapsedTime + particleSpeeds[i].phase) * particleSpeeds[i].amp;
        if (positions[i * 3 + 1] > 3) {
          positions[i * 3 + 1] = -3;
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
      const newW = container.clientWidth || 360;
      const newH = container.clientHeight || 360;
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
      knotGeo.dispose();
      outerRingGeo.dispose();
      chromeMaterial.dispose();
      outerRingMat.dispose();
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
