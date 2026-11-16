'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { APOTHECARY_CAROUSEL_SKILLS } from './CrystalVaultData';
import { TECH_SVG_LOGOS } from './TechLogos';
import { soundManager } from './WebAudioSFX';

/**
 * Procedural Studio Environment Map
 * Light Theme: Soft white studio softboxes with subtle cool slate rim for crystal-clear optical glass.
 * Dark Theme: Dark slate backdrop with crisp white vertical softboxes for dark-field edge reflections.
 */
function createStudioEnvMap(renderer, pmremGenerator, isDark = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (isDark) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1024, 512);

    const flagLeft = ctx.createLinearGradient(0, 0, 160, 0);
    flagLeft.addColorStop(0, '#090d16');
    flagLeft.addColorStop(0.7, '#090d16');
    flagLeft.addColorStop(1, 'rgba(9, 13, 22, 0)');
    ctx.fillStyle = flagLeft;
    ctx.fillRect(0, 0, 160, 512);

    const flagRight = ctx.createLinearGradient(1024, 0, 864, 0);
    flagRight.addColorStop(0, '#090d16');
    flagRight.addColorStop(0.7, '#090d16');
    flagRight.addColorStop(1, 'rgba(9, 13, 22, 0)');
    ctx.fillStyle = flagRight;
    ctx.fillRect(864, 0, 160, 512);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, '#f8fafc');
    bgGrad.addColorStop(0.5, '#ffffff');
    bgGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    const flagLeft = ctx.createLinearGradient(0, 0, 140, 0);
    flagLeft.addColorStop(0, 'rgba(148, 163, 184, 0.40)');
    flagLeft.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = flagLeft;
    ctx.fillRect(0, 0, 140, 512);

    const flagRight = ctx.createLinearGradient(1024, 0, 884, 0);
    flagRight.addColorStop(0, 'rgba(148, 163, 184, 0.40)');
    flagRight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = flagRight;
    ctx.fillRect(884, 0, 140, 512);
  }

  const drawSoftbox = (x, y, w, h, intensity = 1.0) => {
    const grad = ctx.createRadialGradient(x, y, 10, x, y, Math.max(w, h) * 0.75);
    grad.addColorStop(0, `rgba(255, 255, 255, ${0.98 * intensity})`);
    grad.addColorStop(0.45, `rgba(248, 250, 252, ${0.85 * intensity})`);
    grad.addColorStop(0.85, `rgba(255, 255, 255, ${0.15 * intensity})`);
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
  };

  drawSoftbox(280, 240, 260, 420, 1.0);
  drawSoftbox(744, 240, 260, 420, 1.0);
  drawSoftbox(512, 80, 440, 150, 0.9);

  const texture = new THREE.CanvasTexture(canvas);
  const pmrem = pmremGenerator.fromEquirectangular(texture);
  texture.dispose();
  return pmrem.texture;
}

/**
 * Shared Double-Walled Squat Apothecary Glass Bottle Lathe Profile
 */
function getBottleRadiusAtY(y) {
  if (y < 0.12) {
    const t = y / 0.12;
    return 0.80 + (0.92 - 0.80) * Math.sin(t * Math.PI * 0.5);
  }
  if (y <= 1.28) return 0.92;
  if (y <= 1.72) {
    const t = (y - 1.28) / (1.72 - 1.28);
    const smooth = t * t * (3 - 2 * t);
    return 0.92 + (0.52 - 0.92) * smooth;
  }
  if (y <= 2.02) return 0.52;
  return 0.56;
}

function createApothecaryBottleGeometry() {
  const wallT = 0.055;
  const glassPts = [];
  glassPts.push(new THREE.Vector2(0.0, 0.08));
  glassPts.push(new THREE.Vector2(0.55, 0.02));
  glassPts.push(new THREE.Vector2(0.78, 0.0));
  glassPts.push(new THREE.Vector2(0.88, 0.05));
  glassPts.push(new THREE.Vector2(0.92, 0.14));
  glassPts.push(new THREE.Vector2(0.92, 1.28));
  for (let i = 1; i <= 14; i++) {
    const y = 1.28 + (1.72 - 1.28) * (i / 14);
    glassPts.push(new THREE.Vector2(getBottleRadiusAtY(y), y));
  }
  glassPts.push(new THREE.Vector2(0.52, 1.98));
  glassPts.push(new THREE.Vector2(0.57, 2.02));
  glassPts.push(new THREE.Vector2(0.57, 2.11));
  glassPts.push(new THREE.Vector2(0.51, 2.13));
  glassPts.push(new THREE.Vector2(0.46, 2.13));
  glassPts.push(new THREE.Vector2(0.46, 1.72));
  for (let i = 13; i >= 0; i--) {
    const y = 1.28 + (1.72 - 1.28) * (i / 14);
    glassPts.push(new THREE.Vector2(getBottleRadiusAtY(y) - wallT, y));
  }
  glassPts.push(new THREE.Vector2(0.92 - wallT, 0.22));
  glassPts.push(new THREE.Vector2(0.72, 0.17));
  glassPts.push(new THREE.Vector2(0.0, 0.20));

  const latheGeo = new THREE.LatheGeometry(glassPts, 64);
  latheGeo.computeVertexNormals();

  return {
    geometry: latheGeo,
    outerR: 0.92,
    innerR: 0.92 - wallT,
    neckR: 0.52,
    lipY: 2.16,
    minLiquidY: 0.20,
    maxLiquidY: 1.48,
    wallT,
  };
}

/**
 * Custom Fresnel Rim Shader with dynamic Light & Dark theme uniforms
 */
function createFresnelRimMaterial(isDark = false) {
  return new THREE.ShaderMaterial({
    uniforms: {
      rimColor: {
        value: new THREE.Color(isDark ? 0x93c5fd : 0x64748b),
      },
      specColor: {
        value: new THREE.Color(0xffffff),
      },
      rimPower: { value: 3.4 },
      rimIntensity: { value: isDark ? 0.75 : 0.35 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 rimColor;
      uniform vec3 specColor;
      uniform float rimPower;
      uniform float rimIntensity;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float ndotv = clamp(dot(normal, viewDir), 0.0, 1.0);
        float fresnel = pow(1.0 - ndotv, rimPower);
        vec3 finalColor = mix(rimColor, specColor, pow(fresnel, 1.8));
        gl_FragColor = vec4(finalColor, fresnel * rimIntensity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
  });
}

/**
 * Smooth Circular Radial-Gradient CanvasTexture for Caustic Pool
 */
function createCircularCausticTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 256, 256);

  const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 114);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.72)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.20)');
  grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.0)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 128, 114, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * High-DPI CanvasTexture for Buoyant Tech Logo
 */
function createHighDpiLogoTexture(tech) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const logo = TECH_SVG_LOGOS[tech.key];
  const brandColor = logo?.brandColor || tech.liquidColor || '#0284c7';

  // Crisp circular glow disc
  const bgGrad = ctx.createRadialGradient(256, 256, 20, 256, 256, 220);
  bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
  bgGrad.addColorStop(0.70, 'rgba(248, 250, 252, 0.92)');
  bgGrad.addColorStop(1, 'rgba(226, 232, 240, 0.0)');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(256, 256, 210, 0, Math.PI * 2);
  ctx.fill();

  // Bold contrast outline ring
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(256, 256, 196, 0, Math.PI * 2);
  ctx.stroke();

  // Inner brand ring
  ctx.strokeStyle = brandColor;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(256, 256, 184, 0, Math.PI * 2);
  ctx.stroke();

  // Draw authentic brand SVG logo in center
  if (logo && logo.path) {
    ctx.save();
    ctx.translate(256, 256);
    ctx.scale(13.2, 13.2);
    ctx.translate(-12, -12); // standard 24x24 SVG viewBox

    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    const pathObj = new Path2D(logo.path);
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 1.0;
    ctx.stroke(pathObj);

    ctx.fillStyle = brandColor;
    ctx.fill(pathObj);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Realistic Apothecary Plaque Label affixed to the Front of the Glass Bottle Body
 */
function createBottleLabelTexture(tech) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');

  const r = 24;
  const w = 492;
  const h = 172;
  const x = 10;
  const y = 10;

  ctx.clearRect(0, 0, 512, 192);

  // Plaque dark gradient
  const plaqueGrad = ctx.createLinearGradient(0, y, 0, y + h);
  plaqueGrad.addColorStop(0, '#090d16');
  plaqueGrad.addColorStop(0.5, '#0f172a');
  plaqueGrad.addColorStop(1, '#050811');

  // Draw rounded rect
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();

  ctx.fillStyle = plaqueGrad;
  ctx.fill();

  // Outer border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Inner illuminated hairline border with brand color
  const brandCol = tech.liquidColor || '#0284c7';
  ctx.beginPath();
  const ir = 18;
  const ix = x + 6;
  const iy = y + 6;
  const iw = w - 12;
  const ih = h - 12;
  ctx.moveTo(ix + ir, iy);
  ctx.lineTo(ix + iw - ir, iy);
  ctx.arcTo(ix + iw, iy, ix + iw, iy + ir, ir);
  ctx.lineTo(ix + iw, iy + ih - ir);
  ctx.arcTo(ix + iw, iy + ih, ix + iw - ir, iy + ih, ir);
  ctx.lineTo(ix + ir, iy + ih);
  ctx.arcTo(ix, iy + ih, ix, iy + ih - ir, ir);
  ctx.lineTo(ix, iy + ir);
  ctx.arcTo(ix, iy, ix + ir, iy, ir);
  ctx.closePath();
  ctx.strokeStyle = brandCol;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Category Tag Pill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  const pw = 180;
  const ph = 24;
  const px = 256 - pw / 2;
  const py = 26;
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, 12);
  ctx.fill();

  ctx.font = '700 13px "JetBrains Mono", Menlo, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText((tech.domainPill || tech.category || 'CORE TECH').toUpperCase(), 256, 38);

  // Big, Bold Skill Name
  ctx.font = '900 48px Inter, system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(tech.name, 256, 98);

  // Bottom accent indicator dot
  ctx.shadowBlur = 0;
  ctx.fillStyle = brandCol;
  ctx.beginPath();
  ctx.arc(256, 142, 4.5, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Fluted Metallic Crown Cap (24 alternating chrome & dark-slate flutes)
 */
function createFlutedCrownCap() {
  const capGroup = new THREE.Group();
  const capR = 0.59;
  const capH = 0.22;
  const ridgeCount = 24;

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.88,
    roughness: 0.16,
    envMapIntensity: 2.8,
  });

  const darkSlateMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.82,
    roughness: 0.35,
    envMapIntensity: 2.2,
  });

  const domeGeo = new THREE.CylinderGeometry(capR * 0.94, capR, capH, ridgeCount);
  const domeMesh = new THREE.Mesh(domeGeo, chromeMat);
  domeMesh.position.y = capH / 2;
  domeMesh.castShadow = true;
  capGroup.add(domeMesh);

  const topBevelGeo = new THREE.CylinderGeometry(capR * 0.82, capR * 0.94, 0.04, 36);
  const topMesh = new THREE.Mesh(topBevelGeo, chromeMat);
  topMesh.position.y = capH + 0.02;
  topMesh.castShadow = true;
  capGroup.add(topMesh);

  const fluteGeo = new THREE.CylinderGeometry(0.022, 0.022, capH * 0.85, 8);
  for (let i = 0; i < ridgeCount; i++) {
    const angle = (i / ridgeCount) * Math.PI * 2;
    const isChrome = i % 2 === 0;
    const rib = new THREE.Mesh(fluteGeo, isChrome ? chromeMat : darkSlateMat);
    rib.position.x = Math.cos(angle) * (capR + 0.008);
    rib.position.z = Math.sin(angle) * (capR + 0.008);
    rib.position.y = capH * 0.46;
    rib.castShadow = true;
    capGroup.add(rib);
  }

  return capGroup;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Dynamically rebuilds water LatheGeometry conforming to the apothecary profile
 */
function updateBottleWater(b, level) {
  if (level <= 0.005) {
    b.waterMesh.visible = false;
    b.waterSurface.visible = false;
    b.causticMat.opacity = 0;
    return;
  }
  b.waterMesh.visible = true;
  b.waterSurface.visible = true;
  b.causticMat.opacity = 0.42 * level;

  const minY = 0.20;
  const maxY = 1.48;
  const topY = minY + (maxY - minY) * level;

  const pts = [new THREE.Vector2(0.0, minY)];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const y = minY + (topY - minY) * (i / steps);
    const r = Math.max(0.15, getBottleRadiusAtY(y) - 0.055 - 0.008);
    pts.push(new THREE.Vector2(r, y));
  }
  const newGeo = new THREE.LatheGeometry(pts, 48);
  if (b.waterMesh.geometry) b.waterMesh.geometry.dispose();
  b.waterMesh.geometry = newGeo;

  const topRadius = Math.max(0.15, getBottleRadiusAtY(topY) - 0.055 - 0.008);
  b.waterSurface.position.y = topY;
  b.waterSurface.scale.set(topRadius / 0.85, 1, topRadius / 0.85);
}

export default function ApothecaryScene3D({
  skills = APOTHECARY_CAROUSEL_SKILLS,
  activeIndex = 3, // 3: Pandas center hero by default
  state = 'closed',
  fillLevel = 0,
  cineCam = true,
  onSelectIndex,
  onBottleClick,
  onAnimationStateChange,
}) {
  const mountRef = useRef(null);
  const bottleItemsRef = useRef([]);

  // Store active dynamic props in refs so main scene setup NEVER tears down on prop changes
  const stateRef = useRef({
    activeIndex,
    state,
    fillLevel,
    cineCam,
  });

  const callbacksRef = useRef({
    onSelectIndex,
    onBottleClick,
    onAnimationStateChange,
  });

  useEffect(() => {
    stateRef.current.activeIndex = activeIndex;
    stateRef.current.state = state;
    stateRef.current.fillLevel = fillLevel;
    stateRef.current.cineCam = cineCam;
  }, [activeIndex, state, fillLevel, cineCam]);

  useEffect(() => {
    callbacksRef.current = {
      onSelectIndex,
      onBottleClick,
      onAnimationStateChange,
    };
  }, [onSelectIndex, onBottleClick, onAnimationStateChange]);

  // Synchronize external prop state triggers (e.g. from Open & Fill button)
  useEffect(() => {
    const b = bottleItemsRef.current[activeIndex];
    if (!b) return;

    if (state === 'opening' && b.animState === 'closed') {
      b.animState = 'opening';
      b.stateTime = 0;
      soundManager.playCapPop();
    } else if (state === 'closing' && b.animState !== 'closed' && b.animState !== 'closing') {
      b.animState = 'closing';
      b.stateTime = 0;
      soundManager.stopWaterPour();
    } else if (state === 'closed' && b.animState !== 'closed') {
      b.animState = 'closed';
      b.fillLevel = 0;
      updateBottleWater(b, 0);
    }
  }, [state, activeIndex]);

  // When switching activeIndex, drain and close non-active bottles
  useEffect(() => {
    bottleItemsRef.current.forEach((b, idx) => {
      if (idx !== activeIndex && b.animState !== 'closed') {
        b.animState = 'closing';
        b.stateTime = 0;
      }
    });
  }, [activeIndex]);

  // Master Three.js Scene Setup — runs ONCE on mount and persists cleanly
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 980;
    let height = container.clientHeight || 640;

    let isDarkTheme = document.documentElement.classList.contains('dark');

    // 1. Scene & Camera Setup (100% transparent canvas)
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, width / Math.max(1, height), 0.1, 100);
    const camDefaultPos = new THREE.Vector3(0, 1.65, 9.6);
    const camDefaultTarget = new THREE.Vector3(0, 1.08, 0);
    const camCurrentPos = camDefaultPos.clone();
    const camCurrentTarget = camDefaultTarget.clone();
    camera.position.copy(camCurrentPos);
    camera.lookAt(camCurrentTarget);

    // 2. High-Performance ACES Filmic WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Studio Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    let studioEnvMap = createStudioEnvMap(renderer, pmremGenerator, isDarkTheme);
    scene.environment = studioEnvMap;

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkTheme ? 1.05 : 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4.5, 8.2, 5.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.camera.near = 1.0;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -7.0;
    keyLight.shadow.camera.right = 7.0;
    keyLight.shadow.camera.top = 5.0;
    keyLight.shadow.camera.bottom = -3.0;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.9);
    fillLight.position.set(-5.5, 3.8, 3.8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(0, 4.8, -6.0);
    scene.add(rimLight);

    // 5. Center Pedestal (As shown in Reference Image 1)
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, 0, 0);
    scene.add(pedestalGroup);

    const pedBaseMat = new THREE.MeshStandardMaterial({
      color: isDarkTheme ? 0x0f172a : 0xf1f5f9,
      metalness: 0.85,
      roughness: 0.22,
      envMapIntensity: 1.8,
    });
    const pedBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.65, 1.72, 0.08, 48),
      pedBaseMat
    );
    pedBase.position.y = 0.04;
    pedBase.receiveShadow = true;
    pedBase.castShadow = true;
    pedestalGroup.add(pedBase);

    const pedTopMat = new THREE.MeshStandardMaterial({
      color: isDarkTheme ? 0x1e293b : 0xffffff,
      metalness: 0.90,
      roughness: 0.12,
      envMapIntensity: 2.2,
    });
    const pedTop = new THREE.Mesh(
      new THREE.CylinderGeometry(1.42, 1.46, 0.05, 48),
      pedTopMat
    );
    pedTop.position.y = 0.09;
    pedTop.receiveShadow = true;
    pedTop.castShadow = true;
    pedestalGroup.add(pedTop);

    const pedRingMat = new THREE.MeshBasicMaterial({
      color: 0x00d8ff,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const pedRing = new THREE.Mesh(new THREE.RingGeometry(1.48, 1.54, 64), pedRingMat);
    pedRing.rotation.x = -Math.PI / 2;
    pedRing.position.y = 0.082;
    pedestalGroup.add(pedRing);

    // 6. Floor & Concentric Ripple Rings
    const shadowFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(32, 20),
      new THREE.ShadowMaterial({ opacity: isDarkTheme ? 0.32 : 0.16 })
    );
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.01;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    const floorRings = [];
    for (let i = 0; i < 3; i++) {
      const rInner = 1.85 + i * 0.45;
      const ringGeo = new THREE.RingGeometry(rInner, rInner + 0.024, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: isDarkTheme ? 0.35 - i * 0.07 : 0.20 - i * 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.003;
      scene.add(ring);
      floorRings.push({ mesh: ring, mat: ringMat, baseOpacity: ringMat.opacity });
    }

    // 7. Swirling Luminous Water Vortex Particles (Orbiting Center Hero Bottle)
    const vortexParticleCount = 80;
    const vortexGeo = new THREE.BufferGeometry();
    const vortexPositions = new Float32Array(vortexParticleCount * 3);
    const vortexColors = new Float32Array(vortexParticleCount * 3);

    const vColor1 = new THREE.Color(0x00d8ff);
    const vColor2 = new THREE.Color(0x3b82f6);

    for (let i = 0; i < vortexParticleCount; i++) {
      const t = i / vortexParticleCount;
      const angle = t * Math.PI * 4;
      const r = 1.15 + Math.sin(t * Math.PI) * 0.25;
      vortexPositions[i * 3] = Math.cos(angle) * r;
      vortexPositions[i * 3 + 1] = 0.25 + t * 1.6;
      vortexPositions[i * 3 + 2] = Math.sin(angle) * r;

      const c = vColor1.clone().lerp(vColor2, t);
      vortexColors[i * 3] = c.r;
      vortexColors[i * 3 + 1] = c.g;
      vortexColors[i * 3 + 2] = c.b;
    }
    vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPositions, 3));
    vortexGeo.setAttribute('color', new THREE.BufferAttribute(vortexColors, 3));

    const vortexMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const vortexMesh = new THREE.Points(vortexGeo, vortexMat);
    vortexMesh.position.set(0, 0, 0);
    scene.add(vortexMesh);

    // 8. Build All Carousel Bottles
    const bottleGeomData = createApothecaryBottleGeometry();
    const fresnelMat = createFresnelRimMaterial(isDarkTheme);

    // Crystal Clear Transparent Glass Material (explicit transparent: true, frontSide for optical clarity)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
      roughness: 0.015,
      metalness: 0.03,
      ior: 1.52,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      depthWrite: false,
      renderOrder: 4,
      envMapIntensity: isDarkTheme ? 2.0 : 1.2,
      side: THREE.FrontSide,
    });

    const tamperRingMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.88,
      roughness: 0.18,
    });

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 128, 12, 128, 128, 122);
    sGrad.addColorStop(0, 'rgba(15, 23, 42, 0.38)');
    sGrad.addColorStop(0.55, 'rgba(15, 23, 42, 0.09)');
    sGrad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);
    const contactShadowTex = new THREE.CanvasTexture(shadowCanvas);

    const circularCausticTex = createCircularCausticTexture();
    const bottleItems = [];

    skills.forEach((tech, idx) => {
      const bottleMaster = new THREE.Group();
      bottleMaster.userData.index = idx;
      scene.add(bottleMaster);

      // Contact shadow disc
      const contactShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.5, 2.5),
        new THREE.MeshBasicMaterial({
          map: contactShadowTex,
          transparent: true,
          opacity: isDarkTheme ? 0.70 : 0.45,
          depthWrite: false,
        })
      );
      contactShadow.rotation.x = -Math.PI / 2;
      contactShadow.position.y = 0.002;
      bottleMaster.add(contactShadow);

      // Smooth circular caustic glow plane
      const col = new THREE.Color(tech.liquidColorHex || 0x0284c7);
      const causticMat = new THREE.MeshBasicMaterial({
        map: circularCausticTex,
        color: col,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const causticPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), causticMat);
      causticPlane.rotation.x = -Math.PI / 2;
      causticPlane.position.set(0.15, 0.004, 0.12);
      bottleMaster.add(causticPlane);

      // Double-walled crystal-clear glass bottle
      const bottleMesh = new THREE.Mesh(bottleGeomData.geometry, glassMat);
      bottleMesh.castShadow = true;
      bottleMesh.renderOrder = 4;
      bottleMesh.userData.index = idx;
      bottleMaster.add(bottleMesh);

      // Fresnel rim shader
      const fresnelMesh = new THREE.Mesh(bottleGeomData.geometry, fresnelMat);
      fresnelMesh.scale.set(1.001, 1.001, 1.001);
      fresnelMesh.renderOrder = 5;
      bottleMaster.add(fresnelMesh);

      // Tamper-evident metallic neck ring
      const tamperRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.525, 0.016, 14, 48),
        tamperRingMat
      );
      tamperRing.rotation.x = Math.PI / 2;
      tamperRing.position.y = 1.92;
      tamperRing.castShadow = true;
      bottleMaster.add(tamperRing);

      // Front body apothecary plaque label
      const labelTex = createBottleLabelTexture(tech);
      const labelMat = new THREE.MeshBasicMaterial({
        map: labelTex,
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
      });
      const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.24, 0.46), labelMat);
      labelMesh.position.set(0, 0.46, bottleGeomData.outerR + 0.012);
      labelMesh.renderOrder = 6;
      labelMesh.userData.index = idx;
      bottleMaster.add(labelMesh);

      // Fluted metallic crown cap
      const capGroup = createFlutedCrownCap();
      const capClosedPos = new THREE.Vector3(0, 2.16, 0);
      capGroup.position.copy(capClosedPos);
      capGroup.userData.index = idx;
      bottleMaster.add(capGroup);

      // Rich saturated liquid material
      const waterMat = new THREE.MeshPhysicalMaterial({
        color: col.clone().multiplyScalar(0.72),
        emissive: col,
        emissiveIntensity: 0.22,
        roughness: 0.12,
        metalness: 0.02,
        transparent: true,
        opacity: 0.96,
        clearcoat: 0.90,
        clearcoatRoughness: 0.04,
        envMapIntensity: 0.45,
        depthWrite: false,
      });

      const waterSurfaceMat = new THREE.MeshPhysicalMaterial({
        color: col.clone().multiplyScalar(0.92),
        emissive: col,
        emissiveIntensity: 0.20,
        roughness: 0.06,
        metalness: 0.04,
        transparent: true,
        opacity: 0.97,
        clearcoat: 0.95,
        envMapIntensity: 0.55,
        side: THREE.DoubleSide,
      });

      // Liquid lathe mesh (dynamically rebuilt via updateBottleWater)
      const waterMesh = new THREE.Mesh(new THREE.BufferGeometry(), waterMat);
      waterMesh.castShadow = true;
      waterMesh.renderOrder = 1;
      waterMesh.visible = false;
      bottleMaster.add(waterMesh);

      // Meniscus top surface disc
      const surfaceGeo = new THREE.CircleGeometry(0.85, 48);
      surfaceGeo.rotateX(-Math.PI / 2);
      const waterSurface = new THREE.Mesh(surfaceGeo, waterSurfaceMat);
      waterSurface.renderOrder = 2;
      waterSurface.visible = false;
      bottleMaster.add(waterSurface);

      // Expanding surface ripples
      const surfaceRipples = [];
      for (let r = 0; r < 2; r++) {
        const rMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.0,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const rMesh = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.18, 36), rMat);
        rMesh.rotation.x = -Math.PI / 2;
        rMesh.visible = false;
        rMesh.renderOrder = 3;
        bottleMaster.add(rMesh);
        surfaceRipples.push({ mesh: rMesh, mat: rMat, phase: r * 0.5 });
      }

      // Bold, Vivid Pouring Stream (Entering from above lip Y=3.6 down to water surface)
      const streamMat = new THREE.MeshPhysicalMaterial({
        color: col.clone().multiplyScalar(0.95),
        emissive: col,
        emissiveIntensity: 0.35,
        roughness: 0.06,
        transparent: true,
        opacity: 0.96,
        clearcoat: 1.0,
        envMapIntensity: 0.6,
      });
      const streamMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.15, 1.0, 24),
        streamMat
      );
      streamMesh.visible = false;
      streamMesh.position.set(0, 2.5, 0.08);
      streamMesh.renderOrder = 3;
      bottleMaster.add(streamMesh);

      // Stream Flowing Glow Core
      const streamCoreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const streamCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.065, 1.0, 16),
        streamCoreMat
      );
      streamCore.visible = false;
      streamCore.position.set(0, 2.5, 0.08);
      streamCore.renderOrder = 3;
      bottleMaster.add(streamCore);

      // Splash droplets
      const splashDrops = [];
      for (let i = 0; i < 12; i++) {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.030, 8, 8), streamMat);
        drop.visible = false;
        drop.renderOrder = 3;
        bottleMaster.add(drop);
        splashDrops.push({ mesh: drop, angle: (i / 12) * Math.PI * 2, phase: i * 0.3 });
      }

      // Rising bubbles
      const bubbleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.02,
        transparent: true,
        opacity: 0.75,
        clearcoat: 1.0,
      });
      const bubbles = [];
      for (let i = 0; i < 16; i++) {
        const bb = new THREE.Mesh(
          new THREE.SphereGeometry(0.020 + (i % 3) * 0.009, 10, 10),
          bubbleMat
        );
        bb.visible = false;
        bb.renderOrder = 2;
        bottleMaster.add(bb);
        bubbles.push({
          mesh: bb,
          angle: i * 1.6,
          dist: 0.15 + (i % 5) * 0.12,
          speed: 0.60 + (i % 3) * 0.25,
          offset: i / 16,
        });
      }

      // Buoyant 3D logo
      const logoTexture = createHighDpiLogoTexture(tech);
      const logoGroup = new THREE.Group();
      logoGroup.position.set(0, 0.88, 0.55);
      logoGroup.userData.index = idx;

      const sliceCount = 3;
      const sliceSpacing = 0.016;
      const logoPlaneGeo = new THREE.PlaneGeometry(0.92, 0.92);

      for (let s = 0; s < sliceCount; s++) {
        const sliceMat = new THREE.MeshBasicMaterial({
          map: logoTexture,
          transparent: true,
          opacity: s === sliceCount - 1 ? 0.98 : 0.88,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const sliceMesh = new THREE.Mesh(logoPlaneGeo, sliceMat);
        sliceMesh.position.z = (s - Math.floor(sliceCount / 2)) * sliceSpacing;
        sliceMesh.renderOrder = 2;
        sliceMesh.userData.index = idx;
        logoGroup.add(sliceMesh);
      }
      bottleMaster.add(logoGroup);

      // Hitbox for Click Raycasting
      const hitBox = new THREE.Mesh(
        new THREE.CylinderGeometry(
          bottleGeomData.outerR * 1.25,
          bottleGeomData.outerR * 1.25,
          2.6,
          16
        ),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.y = 1.1;
      hitBox.userData.index = idx;
      bottleMaster.add(hitBox);

      bottleItems.push({
        index: idx,
        tech,
        group: bottleMaster,
        capGroup,
        capClosedPos,
        waterMesh,
        waterSurface,
        surfaceRipples,
        streamMesh,
        streamCore,
        splashDrops,
        bubbles,
        causticMat,
        contactShadow,
        logoGroup,
        hitBox,
        animState: 'closed',
        stateTime: 0,
        fillLevel: 0,
        curPos: new THREE.Vector3(),
        curScale: 1,
        sloshX: 0,
        sloshZ: 0,
        sloshVX: 0,
        sloshVZ: 0,
        iconY: 0.88,
        iconVY: 0,
      });
    });

    bottleItemsRef.current = bottleItems;

    // 9. Dynamic Theme MutationObserver
    const updateThemeStyles = () => {
      const isDark = document.documentElement.classList.contains('dark');
      isDarkTheme = isDark;

      studioEnvMap = createStudioEnvMap(renderer, pmremGenerator, isDark);
      scene.environment = studioEnvMap;

      if (fresnelMat) {
        if (isDark) {
          fresnelMat.uniforms.rimColor.value.set(0x93c5fd);
          fresnelMat.uniforms.specColor.value.set(0xffffff);
          fresnelMat.uniforms.rimIntensity.value = 0.75;
        } else {
          fresnelMat.uniforms.rimColor.value.set(0x64748b);
          fresnelMat.uniforms.specColor.value.set(0xffffff);
          fresnelMat.uniforms.rimIntensity.value = 0.35;
        }
      }

      ambientLight.intensity = isDark ? 1.05 : 0.95;
      shadowFloor.material.opacity = isDark ? 0.32 : 0.16;

      pedBaseMat.color.set(isDark ? 0x0f172a : 0xf1f5f9);
      pedTopMat.color.set(isDark ? 0x1e293b : 0xffffff);

      bottleItems.forEach((b) => {
        b.contactShadow.material.opacity = isDark ? 0.70 : 0.45;
      });
    };

    const themeObserver = new MutationObserver(() => {
      updateThemeStyles();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // 10. Pointer Drag to Orbit + Raycasting Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let downPos = { x: 0, y: 0 };
    let targetRotY = -0.06;
    let targetRotX = 0.04;
    let currentRotY = -0.06;
    let currentRotX = 0.04;

    const clickTargets = bottleItems.map((b) => b.hitBox);

    const triggerActiveBottle = (idx) => {
      const b = bottleItems[idx !== undefined ? idx : stateRef.current.activeIndex];
      if (!b) return;
      if (b.animState === 'closed') {
        b.animState = 'opening';
        b.stateTime = 0;
        soundManager.playCapPop();
        callbacksRef.current.onAnimationStateChange?.('opening', 0);
      } else if (b.animState === 'filled') {
        b.animState = 'closing';
        b.stateTime = 0;
        soundManager.stopWaterPour();
        callbacksRef.current.onAnimationStateChange?.('closing', b.fillLevel);
      }
    };

    const selectBottle = (hitIdx) => {
      const prevIdx = stateRef.current.activeIndex;
      if (prevIdx !== hitIdx) {
        soundManager.playGlassTink();
        soundManager.stopWaterPour();
        const prevB = bottleItems[prevIdx];
        if (prevB && prevB.animState !== 'closed' && prevB.animState !== 'closing') {
          prevB.animState = 'closing';
          prevB.stateTime = 0;
        }
        callbacksRef.current.onSelectIndex?.(hitIdx);
      }
    };

    const onPointerDown = (e) => {
      isDragging = true;
      downPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - downPos.x;
        const dy = e.clientY - downPos.y;
        if (Math.hypot(dx, dy) > 4) {
          const mx = (e.movementX || 0) * 0.007;
          const my = (e.movementY || 0) * 0.005;
          targetRotY += mx;
          targetRotX = Math.max(-0.25, Math.min(0.35, targetRotX + my));

          const activeB = bottleItems[stateRef.current.activeIndex];
          if (activeB && activeB.fillLevel > 0.1) {
            activeB.sloshVZ += mx * 3.5;
            activeB.sloshVX += my * 3.5;
          }
        }
      } else {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(clickTargets, true);
        renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
      }
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      isDragging = false;

      if (dist < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(clickTargets, true);
        if (hits.length > 0) {
          const hitIdx = hits[0].object.userData.index;
          const curIdx = stateRef.current.activeIndex;
          if (hitIdx === curIdx) {
            triggerActiveBottle(hitIdx);
          } else {
            selectBottle(hitIdx);
          }
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    domEl.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);

    // 11. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth || 980;
      const nh = container.clientHeight || 640;
      camera.aspect = nw / Math.max(1, nh);
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    };
    window.addEventListener('resize', handleResize);

    // 12. Master Continuous Carousel Turntable Orbit & Physics Loop
    let reqId = null;
    let lastTime = performance.now();
    let waveTime = 0;
    const desiredCamPos = new THREE.Vector3();
    const desiredCamTarget = new THREE.Vector3();

    // Continuous Carousel Turntable Angle initialized exactly to activeIndex
    const totalBottles = bottleItems.length;
    let carouselAngle = (stateRef.current.activeIndex * (Math.PI * 2)) / totalBottles;

    const animate = (now) => {
      reqId = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      waveTime += dt;

      const { activeIndex: activeIdx, cineCam: isCine } = stateRef.current;
      const activeBottle = bottleItems[activeIdx] || bottleItems[0];

      currentRotY += (targetRotY - currentRotY) * 0.1;
      currentRotX += (targetRotX - currentRotX) * 0.1;

      // Cinematic Camera
      if (isCine) {
        if (activeBottle.animState === 'opening') {
          desiredCamPos.set(0.35, 2.35, 6.2);
          desiredCamTarget.set(0.08, 1.9, 0);
        } else if (activeBottle.animState === 'filling') {
          desiredCamPos.set(-0.25, 1.65, 7.6);
          desiredCamTarget.set(0, 1.1, 0);
        } else {
          desiredCamPos.copy(camDefaultPos);
          desiredCamTarget.copy(camDefaultTarget);
        }
      } else {
        desiredCamPos.copy(camDefaultPos);
        desiredCamTarget.copy(camDefaultTarget);
      }
      camCurrentPos.lerp(desiredCamPos, 0.06);
      camCurrentTarget.lerp(desiredCamTarget, 0.06);
      camera.position.copy(camCurrentPos);
      camera.lookAt(camCurrentTarget);

      // Floor ripple pulse
      floorRings.forEach((r, idx) => {
        const pulse = 1 + Math.sin(waveTime * 2.2 - idx * 0.8) * 0.025;
        r.mesh.scale.set(pulse, pulse, 1);
        r.mat.opacity =
          r.baseOpacity +
          (activeBottle.animState === 'filling' || activeBottle.animState === 'filled' ? 0.14 : 0.0);
      });

      // Swirling Water Ribbon rotation & glow
      if (vortexMesh) {
        vortexMesh.rotation.y += dt * 1.8;
        const isPouringOrFilled =
          activeBottle.animState === 'filling' || activeBottle.animState === 'filled';
        const targetVortexOpacity = isPouringOrFilled ? (isDarkTheme ? 0.85 : 0.65) : 0.0;
        vortexMat.opacity += (targetVortexOpacity - vortexMat.opacity) * 0.1;
      }

      // =========================================================================
      // CONTINUOUS CAROUSEL TURNTABLE: PREVENTS BOTTLE CROSSING / MIXING
      // All bottles sit at fixed angular steps around an ellipse (Rx = 5.2, Rz = 2.4).
      // Active bottle is guaranteed at center hero position (X=0, Z=0).
      // =========================================================================
      const targetAngle = (activeIdx * (Math.PI * 2)) / totalBottles;
      let angleDiff = targetAngle - carouselAngle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      carouselAngle += angleDiff * 0.088;

      const Rx = 5.2;
      const Rz = 2.4;

      bottleItems.forEach((b, idx) => {
        let relAngle = (idx * (Math.PI * 2)) / totalBottles - carouselAngle;
        while (relAngle > Math.PI) relAngle -= Math.PI * 2;
        while (relAngle < -Math.PI) relAngle += Math.PI * 2;

        const absAngle = Math.abs(relAngle);
        const targetX = Math.sin(relAngle) * Rx;
        const targetZ = (Math.cos(relAngle) - 1) * Rz;

        const targetScale = Math.max(
          0.38,
          1.08 - Math.pow(absAngle / Math.PI, 0.72) * 0.62
        );

        b.curPos.x += (targetX - b.curPos.x) * 0.12;
        b.curPos.z += (targetZ - b.curPos.z) * 0.12;
        b.curScale += (targetScale - b.curScale) * 0.12;

        b.group.position.set(b.curPos.x, 0, b.curPos.z);
        b.group.scale.set(b.curScale, b.curScale, b.curScale);

        if (absAngle < 0.15) {
          b.group.rotation.y = currentRotY;
          b.group.rotation.x = currentRotX;
        } else {
          b.group.rotation.y += (-relAngle * 0.32 - b.group.rotation.y) * 0.1;
          b.group.rotation.x += (0.04 - b.group.rotation.x) * 0.1;
        }

        const isFarRear = absAngle > Math.PI * 0.65;
        b.group.visible = !isFarRear;

        // Damped spring slosh physics
        const springK = 28.0;
        const damping = 3.2;
        b.sloshVX += (-springK * b.sloshX - damping * b.sloshVX) * dt;
        b.sloshVZ += (-springK * b.sloshZ - damping * b.sloshVZ) * dt;
        b.sloshX = Math.max(-0.22, Math.min(0.22, b.sloshX + b.sloshVX * dt));
        b.sloshZ = Math.max(-0.22, Math.min(0.22, b.sloshZ + b.sloshVZ * dt));

        // Buoyant 3D logo physics
        const waterTopNow = 0.20 + (1.48 - 0.20) * b.fillLevel;
        const isSubmerged = waterTopNow > 0.44 && b.fillLevel > 0.02;
        const restY = 0.88;
        const targetIconY = isSubmerged
          ? Math.max(restY, Math.min(1.42, waterTopNow + 0.02 + Math.sin(waveTime * 1.45 + idx) * 0.018))
          : restY;
        const buoyK = isSubmerged ? 9.5 : 16.0;
        const buoyDamp = isSubmerged ? 4.4 : 6.0;
        b.iconVY += (-buoyK * (b.iconY - targetIconY) - buoyDamp * b.iconVY) * dt;
        b.iconY += b.iconVY * dt;
        b.logoGroup.position.y = b.iconY;

        const targetTiltX = isSubmerged
          ? b.waterSurface.rotation.x * 0.65 + Math.sin(waveTime * 1.2 + idx) * 0.025
          : 0;
        const targetTiltZ = isSubmerged
          ? b.waterSurface.rotation.z * 0.65 + Math.cos(waveTime * 1.05 + idx) * 0.04
          : 0;
        b.logoGroup.rotation.x += (targetTiltX - b.logoGroup.rotation.x) * 0.08;
        b.logoGroup.rotation.z += (targetTiltZ - b.logoGroup.rotation.z) * 0.08;

        // Cap & Water State Machine
        if (b.animState === 'opening') {
          b.stateTime += dt;
          const dur = 1.05;
          const t = Math.min(1, b.stateTime / dur);
          if (t < 0.42) {
            const u = t / 0.42;
            b.capGroup.position.set(0, 2.16 + u * 0.24, 0);
            b.capGroup.rotation.set(0, u * Math.PI * 2.2, 0);
          } else {
            const u = easeOutCubic((t - 0.42) / 0.58);
            b.capGroup.position.set(u * 1.15, 2.40 + Math.sin(u * Math.PI) * 0.28 + u * 0.1, 0);
            b.capGroup.rotation.set(0, Math.PI * 2.2, -u * 0.52);
          }
          if (t >= 1) {
            b.animState = 'filling';
            b.stateTime = 0;
            soundManager.startWaterPour();
            if (idx === activeIdx) {
              callbacksRef.current.onAnimationStateChange?.('filling', 0);
            }
          }
        } else if (b.animState === 'filling') {
          b.stateTime += dt;
          const dur = 2.2;
          const t = Math.min(1, b.stateTime / dur);
          b.fillLevel = easeInOutQuad(t);
          updateBottleWater(b, b.fillLevel);
          soundManager.updateWaterPour(b.fillLevel);

          if (idx === activeIdx) {
            callbacksRef.current.onAnimationStateChange?.('filling', b.fillLevel);
          }

          const waterTopY = 0.20 + (1.48 - 0.20) * b.fillLevel;
          b.waterSurface.rotation.x = Math.sin(waveTime * 9.5) * 0.045 + b.sloshX;
          b.waterSurface.rotation.z = Math.cos(waveTime * 7.2) * 0.045 + b.sloshZ;

          // Vivid Pouring Stream: cascades from above bottle mouth (Y=3.6) down to rising waterTopY
          const streamTop = 3.6;
          const streamH = Math.max(0.12, streamTop - waterTopY);
          b.streamMesh.visible = t < 0.95;
          b.streamCore.visible = t < 0.95;

          const wobble = 1 + Math.sin(waveTime * 18) * 0.07;
          b.streamMesh.scale.set(wobble, streamH, wobble);
          b.streamMesh.position.y = waterTopY + streamH / 2;

          b.streamCore.scale.set(wobble, streamH, wobble);
          b.streamCore.position.y = waterTopY + streamH / 2;

          // Expanding surface ripples
          b.surfaceRipples.forEach((rp) => {
            rp.mesh.visible = t < 0.95;
            const prog = (waveTime * 1.8 + rp.phase) % 1;
            const sc = 0.6 + prog * 4.0;
            rp.mesh.position.y = waterTopY + 0.008;
            rp.mesh.scale.set(sc, sc, 1);
            rp.mat.opacity = (1 - prog) * 0.55;
          });

          // Splash droplets at water surface contact point
          b.splashDrops.forEach((d) => {
            d.mesh.visible = t < 0.93;
            const prog = (waveTime * 2.8 + d.phase) % 1;
            const radius = 0.08 + prog * 0.32;
            const arcY = waterTopY + Math.sin(prog * Math.PI) * 0.18;
            d.mesh.position.set(Math.cos(d.angle) * radius, arcY, Math.sin(d.angle) * radius + 0.08);
            const sc = 1 - prog * 0.55;
            d.mesh.scale.set(sc, sc, sc);
          });

          // Rising bubbles through the liquid
          b.bubbles.forEach((bb) => {
            bb.mesh.visible = b.fillLevel > 0.08;
            const prog = (waveTime * bb.speed + bb.offset) % 1;
            const by = 0.22 + prog * Math.max(0.05, waterTopY - 0.26);
            bb.mesh.position.set(
              Math.cos(bb.angle + waveTime) * bb.dist,
              by,
              Math.sin(bb.angle + waveTime) * bb.dist
            );
          });

          if (t >= 1) {
            b.streamMesh.visible = false;
            b.streamCore.visible = false;
            b.splashDrops.forEach((d) => {
              d.mesh.visible = false;
            });
            b.surfaceRipples.forEach((rp) => {
              rp.mesh.visible = false;
            });
            soundManager.stopWaterPour();
            b.animState = 'filled';
            b.stateTime = 0;
            if (idx === activeIdx) {
              callbacksRef.current.onAnimationStateChange?.('filled', 1.0);
            }
          }
        } else if (b.animState === 'filled') {
          b.stateTime += dt;
          const settle = Math.max(0, 1 - b.stateTime / 1.6);
          b.waterSurface.rotation.x = Math.sin(waveTime * 6) * 0.03 * settle + b.sloshX;
          b.waterSurface.rotation.z = Math.cos(waveTime * 5) * 0.03 * settle + b.sloshZ;
          b.bubbles.forEach((bb) => {
            bb.mesh.visible = false;
          });
          b.capGroup.position.y = 2.50 + Math.sin(waveTime * 2.2) * 0.025;
        } else if (b.animState === 'closing') {
          b.stateTime += dt;
          const dur = 0.65;
          const t = Math.min(1, b.stateTime / dur);
          const u = easeOutCubic(t);

          b.streamMesh.visible = false;
          b.streamCore.visible = false;
          b.splashDrops.forEach((d) => {
            d.mesh.visible = false;
          });
          b.surfaceRipples.forEach((rp) => {
            rp.mesh.visible = false;
          });
          b.bubbles.forEach((bb) => {
            bb.mesh.visible = false;
          });

          b.fillLevel = Math.max(0, b.fillLevel * (1 - u * 1.15));
          updateBottleWater(b, b.fillLevel);

          if (idx === activeIdx) {
            callbacksRef.current.onAnimationStateChange?.('closing', b.fillLevel);
          }

          b.capGroup.position.lerpVectors(new THREE.Vector3(1.15, 2.50, 0), b.capClosedPos, u);
          b.capGroup.rotation.z = -0.52 * (1 - u);
          b.capGroup.rotation.y = (1 - u) * Math.PI * 2;

          if (t >= 1) {
            b.fillLevel = 0;
            updateBottleWater(b, 0);
            b.capGroup.position.copy(b.capClosedPos);
            b.capGroup.rotation.set(0, 0, 0);
            b.animState = 'closed';
            if (idx === activeIdx) {
              callbacksRef.current.onAnimationStateChange?.('closed', 0);
            }
          }
        }
      });

      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      if (reqId) cancelAnimationFrame(reqId);
      themeObserver.disconnect();
      domEl.removeEventListener('pointerdown', onPointerDown);
      domEl.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      pmremGenerator.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Only run once on mount!

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: 'none' }}
    />
  );
}
