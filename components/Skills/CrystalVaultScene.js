'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VAULT_TECHNOLOGIES, TECH_BY_KEY } from './CrystalVaultData';
import { TECH_SVG_LOGOS } from './TechLogos';

/**
 * Standard Canvas helper to draw rounded rectangle safely across all environments
 */
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Creates high-resolution canvas texture containing the authentic SVG brand vector logo
 * Rendered in its EXACT AUTHENTIC OFFICIAL BRAND COLORS with high-contrast drop shadow and glow!
 */
function createBottleInteriorTexture(logoData, tech, isLightMode) {
  const canvasSize = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');

  if (!ctx || !logoData || !logoData.path) return null;

  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // 1. Draw SVG Brand Vector Logo
  const parts = (logoData.viewBox || '0 0 24 24').split(' ').map(Number);
  const minX = parts[0] || 0;
  const minY = parts[1] || 0;
  const vbW = parts[2] || 24;
  const vbH = parts[3] || 24;

  const targetIconSize = canvasSize * 0.60;
  const scale = Math.min(targetIconSize / vbW, targetIconSize / vbH);
  const offsetX = (canvasSize - vbW * scale) / 2 - minX * scale;
  const offsetY = (canvasSize - vbH * scale) / 2 - minY * scale - 12;

  const brandColor = logoData.brandColor || '#38BDF8';
  const brandSecondary = logoData.brandSecondary || brandColor;

  ctx.save();
  // Deep drop shadow so the logo is crisp and punchy
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // Gradient fill in exact official brand colors
  const grad = ctx.createLinearGradient(0, 0, vbW, vbH);
  grad.addColorStop(0, brandColor);
  grad.addColorStop(1, brandSecondary);
  ctx.fillStyle = grad;

  try {
    const path2D = new Path2D(logoData.path);
    ctx.fill(path2D);

    // Second stroke pass for crisp definition
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 0.65;
    ctx.stroke(path2D);
    ctx.fill(path2D);
  } catch (err) {}
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates REALISTIC EMBOSSED PHYSICAL PLAQUE LABEL
 * Features:
 * - Brushed metal titanium/silver base plate with fine horizontal grain
 * - 3D beveled outer rim with specular highlight on top/left and cast shadow on bottom/right
 * - 4 real metallic corner rivets with screw slots
 * - Double hairline frame with corner brackets
 * - Embossed 3D chiseled relief typography with realistic cast shadow and specular highlight stroke
 * - Technical micro-headers and active specification indicators
 * 100% UNMIRRORED, normal reading order!
 */
function createBottleBodyLabelTexture(tech, isLightMode) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, 1024, 420);

  const x = 32, y = 32, w = 960, h = 356, r = 28;

  // 1. Brushed Metallic Base Plate Gradient
  const plateGrad = ctx.createLinearGradient(x, y, x, y + h);
  if (isLightMode) {
    plateGrad.addColorStop(0, '#ffffff');
    plateGrad.addColorStop(0.2, '#f8fafc');
    plateGrad.addColorStop(0.5, '#e2e8f0');
    plateGrad.addColorStop(0.8, '#cbd5e1');
    plateGrad.addColorStop(1, '#94a3b8');
  } else {
    plateGrad.addColorStop(0, '#1e293b');
    plateGrad.addColorStop(0.2, '#0f172a');
    plateGrad.addColorStop(0.5, '#090d16');
    plateGrad.addColorStop(0.8, '#05070c');
    plateGrad.addColorStop(1, '#020408');
  }

  // Draw Main Base Plate
  ctx.save();
  ctx.fillStyle = plateGrad;
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.fill();

  // Subtle Brushed Metal Texture Grain
  ctx.save();
  ctx.strokeStyle = isLightMode ? 'rgba(255, 255, 255, 0.40)' : 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let ly = y + 10; ly < y + h - 10; ly += 4) {
    ctx.beginPath();
    ctx.moveTo(x + 16, ly);
    ctx.lineTo(x + w - 16, ly);
    ctx.stroke();
  }
  ctx.restore();

  // 2. Beveled 3D Outer Rim (Specular highlight top/left, cast shadow bottom/right)
  ctx.save();
  ctx.lineWidth = 4;
  ctx.strokeStyle = isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.45)';
  drawRoundedRect(ctx, x + 2, y + 2, w - 4, h - 4, r - 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = isLightMode ? 'rgba(15, 23, 42, 0.40)' : 'rgba(0, 0, 0, 0.85)';
  drawRoundedRect(ctx, x, y, w, h, r);
  ctx.stroke();
  ctx.restore();

  // 3. Inner Decorative Hairline Frame with Corner Brackets
  const ix = x + 18, iy = y + 18, iw = w - 36, ih = h - 36, ir = 14;
  ctx.save();
  ctx.strokeStyle = isLightMode ? 'rgba(15, 23, 42, 0.25)' : 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, ix, iy, iw, ih, ir);
  ctx.stroke();
  ctx.restore();

  // 4. Four Physical Metallic Rivets / Screws at the Corners
  const rivetOffset = 34;
  const rivetPositions = [
    [x + rivetOffset, y + rivetOffset],
    [x + w - rivetOffset, y + rivetOffset],
    [x + rivetOffset, y + h - rivetOffset],
    [x + w - rivetOffset, y + h - rivetOffset],
  ];

  rivetPositions.forEach(([rx, ry]) => {
    ctx.save();
    // Rivet outer shadow
    ctx.fillStyle = isLightMode ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(rx, ry + 1.5, 9, 0, Math.PI * 2);
    ctx.fill();

    // Rivet metallic bevel dome
    const rGrad = ctx.createRadialGradient(rx - 2, ry - 2, 1, rx, ry, 8);
    rGrad.addColorStop(0, '#ffffff');
    rGrad.addColorStop(0.5, isLightMode ? '#cbd5e1' : '#64748b');
    rGrad.addColorStop(1, isLightMode ? '#64748b' : '#1e293b');
    ctx.fillStyle = rGrad;
    ctx.beginPath();
    ctx.arc(rx, ry, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Slot line in screw
    ctx.strokeStyle = isLightMode ? '#334155' : '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rx - 4.5, ry - 2);
    ctx.lineTo(rx + 4.5, ry + 2);
    ctx.stroke();
    ctx.restore();
  });

  // 5. Top Micro-Header: ◈ TECHNICAL SPECIFICATION ◈
  ctx.save();
  ctx.font = '700 22px "SF Mono", "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isLightMode ? '#475569' : '#94a3b8';
  ctx.fillText('◈  TECHNICAL SPECIFICATION  ◈', 512, y + 54);
  ctx.restore();

  // Hairline Accent Divider
  ctx.save();
  ctx.strokeStyle = isLightMode ? 'rgba(15, 23, 42, 0.20)' : 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(180, y + 84);
  ctx.lineTo(844, y + 84);
  ctx.stroke();
  ctx.restore();

  // 6. MAIN SKILL NAME - SUPER REALISTIC 3D EMBOSSED METALLIC TYPOGRAPHY!
  const displayName = tech.name.toUpperCase();
  ctx.save();
  ctx.font = '900 68px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Base cast shadow for deep 3D engraved relief
  ctx.shadowColor = isLightMode ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;

  // Dual-tone chiseled fill
  const textGrad = ctx.createLinearGradient(0, y + 140, 0, y + 225);
  if (isLightMode) {
    textGrad.addColorStop(0, '#09090b');
    textGrad.addColorStop(0.5, '#18181b');
    textGrad.addColorStop(1, '#3f3f46');
  } else {
    textGrad.addColorStop(0, '#ffffff');
    textGrad.addColorStop(0.4, '#f1f5f9');
    textGrad.addColorStop(0.8, '#cbd5e1');
    textGrad.addColorStop(1, '#94a3b8');
  }
  ctx.fillStyle = textGrad;
  ctx.fillText(displayName, 512, y + 185);

  // Top specular embossed rim highlight
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = isLightMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 1;
  ctx.strokeText(displayName, 512, y + 185);
  ctx.restore();

  // 7. Bottom Micro Badge / Technical Role
  ctx.save();
  const subText = (tech.domainPill || tech.category || 'FRAMEWORK').toUpperCase();
  ctx.font = '700 20px "SF Mono", "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = isLightMode ? '#2563eb' : '#38bdf8';
  ctx.fillText(`—  ${subText}  —`, 512, y + 278);

  // Proficiency Indicator Pill in bottom plaque
  ctx.font = '600 17px "SF Mono", monospace';
  ctx.fillStyle = isLightMode ? '#64748b' : '#94a3b8';
  ctx.fillText(`PROFICIENCY: ${tech.proficiency || 85}% • ACTIVE ARCHITECTURE`, 512, y + 312);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generates Radial Halo Texture for back-light caustics inside the liquid
 */
function createHaloTexture(colorHex, isLightMode) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 5, 128, 128, 126);

  grad.addColorStop(0, colorHex || '#38bdf8');
  grad.addColorStop(0.4, colorHex ? `${colorHex}88` : 'rgba(56, 189, 248, 0.45)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates Procedural Studio PMREM Environment Map
 */
function createStudioEnvMap(renderer, pmremGenerator, isLightMode) {
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 1024;
  envCanvas.height = 512;
  const envCtx = envCanvas.getContext('2d');

  const grad = envCtx.createLinearGradient(0, 0, 0, 512);
  if (isLightMode) {
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#f1f5f9');
    grad.addColorStop(1, '#e2e8f0');
  } else {
    grad.addColorStop(0, '#0a0a14');
    grad.addColorStop(0.5, '#121220');
    grad.addColorStop(1, '#05050a');
  }
  envCtx.fillStyle = grad;
  envCtx.fillRect(0, 0, 1024, 512);

  const drawSoftbox = (x, y, rx, ry) => {
    const s = envCtx.createRadialGradient(x, y, 10, x, y, Math.max(rx, ry));
    s.addColorStop(0, '#ffffff');
    s.addColorStop(0.5, isLightMode ? '#cbd5e1' : '#64748b');
    s.addColorStop(1, 'rgba(0,0,0,0)');
    envCtx.fillStyle = s;
    envCtx.fillRect(x - rx, y - ry, rx * 2, ry * 2);
  };

  drawSoftbox(250, 120, 260, 180);
  drawSoftbox(770, 120, 260, 180);
  drawSoftbox(512, 380, 320, 140);

  const envTex = new THREE.CanvasTexture(envCanvas);
  const pmrem = pmremGenerator.fromEquirectangular(envTex);
  envTex.dispose();
  return pmrem.texture;
}

/**
 * Concentric Floor Glow Texture (Soft Ambient Disc)
 */
function createFloorRadialTexture(isLightMode) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 254);

  if (isLightMode) {
    grad.addColorStop(0, 'rgba(0, 163, 255, 0.25)');
    grad.addColorStop(0.4, 'rgba(20, 25, 35, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  } else {
    grad.addColorStop(0, 'rgba(0, 163, 255, 0.50)');
    grad.addColorStop(0.4, 'rgba(14, 165, 233, 0.20)');
    grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.04)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * LUXURY PHARMACEUTICAL/WHISKEY CRYSTAL BOTTLE PROFILE
 * Heavy crystal base, broad body chamber, curved shoulder, cylindrical threaded neck
 */
function createLuxuryBottleProfile() {
  const points = [];
  const bodyR = 0.31;
  const neckR = 0.13;
  const lipR = 0.145;
  const baseH = 0.08; // Heavy thick transparent crystal base
  const bodyH = 0.68; // Main body chamber
  const shoulderH = 0.16;
  const neckH = 0.16;

  // 1. Solid Crystal Base
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(bodyR * 0.95, 0));
  points.push(new THREE.Vector2(bodyR * 1.02, 0.02));
  points.push(new THREE.Vector2(bodyR, baseH));

  // 2. Broad Cylindrical Body Wall
  const bodySteps = 16;
  for (let i = 1; i <= bodySteps; i++) {
    const t = i / bodySteps;
    const y = baseH + t * bodyH;
    points.push(new THREE.Vector2(bodyR, y));
  }

  // 3. Curved Tapered Shoulder (Cosine easing)
  const shoulderSteps = 18;
  const yShoulderStart = baseH + bodyH;
  for (let i = 1; i <= shoulderSteps; i++) {
    const t = i / shoulderSteps;
    const y = yShoulderStart + t * shoulderH;
    const ease = 0.5 * (1 - Math.cos(t * Math.PI));
    const r = bodyR + ease * (neckR - bodyR);
    points.push(new THREE.Vector2(r, y));
  }

  // 4. Cylindrical Neck & Thread Ridge
  const yNeckStart = yShoulderStart + shoulderH;
  points.push(new THREE.Vector2(neckR, yNeckStart + neckH * 0.35));
  points.push(new THREE.Vector2(neckR * 1.05, yNeckStart + neckH * 0.65));
  points.push(new THREE.Vector2(neckR, yNeckStart + neckH));

  // 5. Polished Crown Lip Rim
  points.push(new THREE.Vector2(lipR, yNeckStart + neckH + 0.015));
  points.push(new THREE.Vector2(lipR * 0.94, yNeckStart + neckH + 0.03));
  points.push(new THREE.Vector2(neckR * 0.88, yNeckStart + neckH + 0.03));

  const geo = new THREE.LatheGeometry(points, 48);
  geo.computeVertexNormals();

  return {
    geometry: geo,
    baseH,
    bodyH,
    shoulderH,
    neckH,
    yNeckStart,
    neckLipY: yNeckStart + neckH * 0.45,
    neckTopY: yNeckStart + neckH + 0.03,
    bodyRadius: bodyR,
    neckRadius: neckR,
    totalHeight: yNeckStart + neckH + 0.03,
  };
}

export default function CrystalVaultScene({
  activeIndex = 3, // Default 3 is Pandas
  isUnsealed = false, // Bottle cap is CLOSED FIRST until clicked!
  onSelectIndex = null,
  onOpenDetails = null,
  onToggleUnseal = null,
  onWaterFilled = null,
  theme = 'dark',
  className = '',
}) {
  const mountRef = useRef(null);
  const activeIndexRef = useRef(activeIndex);
  const isUnsealedRef = useRef(isUnsealed);
  const onSelectIndexRef = useRef(onSelectIndex);
  const onOpenDetailsRef = useRef(onOpenDetails);
  const onToggleUnsealRef = useRef(onToggleUnseal);
  const onWaterFilledRef = useRef(onWaterFilled);
  const themeRef = useRef(theme);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    isUnsealedRef.current = isUnsealed;
  }, [isUnsealed]);

  useEffect(() => {
    onSelectIndexRef.current = onSelectIndex;
  }, [onSelectIndex]);

  useEffect(() => {
    onOpenDetailsRef.current = onOpenDetails;
  }, [onOpenDetails]);

  useEffect(() => {
    onToggleUnsealRef.current = onToggleUnseal;
  }, [onToggleUnseal]);

  useEffect(() => {
    onWaterFilledRef.current = onWaterFilled;
  }, [onWaterFilled]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const threeRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    pmremGenerator: null,
    materials: {},
    bottleList: [],
    platformGroup: null,
    spiralSwirlGroup: null,
    focusedSpotlight: null,
    ambientLight: null,
    keyLight: null,
    reqId: null,
    isVisible: true,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 1050;
    let height = container.clientHeight || 620;
    const isLightMode = themeRef.current === 'light';
    let isMobile = width < 768;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(
      isLightMode ? 0xf8fafc : 0x050508,
      0.018
    );

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.62, isMobile ? 7.6 : 6.8);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLightMode ? 1.25 : 1.45;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Studio PMREM Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const studioEnvMap = createStudioEnvMap(renderer, pmremGenerator, isLightMode);
    scene.environment = studioEnvMap;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      isLightMode ? 1.05 : 0.85
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isLightMode ? 2.8 : 3.8);
    keyLight.position.set(2, 9, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const leftRimLight = new THREE.PointLight(0x38bdf8, isLightMode ? 1.6 : 2.5, 25);
    leftRimLight.position.set(-6, 3, 2);
    scene.add(leftRimLight);

    const rightRimLight = new THREE.PointLight(0x0284c7, isLightMode ? 1.6 : 2.5, 25);
    rightRimLight.position.set(6, 3, 2);
    scene.add(rightRimLight);

    // Focused Spotlight directly above center hero bottle
    const focusedSpotlight = new THREE.SpotLight(0xffffff, isLightMode ? 4.2 : 5.8);
    focusedSpotlight.position.set(0, 8.0, 3.0);
    focusedSpotlight.angle = Math.PI / 4.5;
    focusedSpotlight.penumbra = 0.60;
    focusedSpotlight.decay = 1.3;
    focusedSpotlight.distance = 22;
    focusedSpotlight.castShadow = true;
    scene.add(focusedSpotlight);

    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(0, 0.45, 0.85);
    scene.add(spotTarget);
    focusedSpotlight.target = spotTarget;

    // =========================================================================
    // 5. MATERIALS: ULTRA-TRANSPARENT OPTICAL CRYSTAL GLASS & ACCENT RIMS
    // (NO dark inverted hull! 100% crystal-clear see-through vessel!)
    // =========================================================================
    const materials = {
      // 100% ULTRA-TRANSPARENT OPTICAL CRYSTAL GLASS
      glass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff, // Pure crystal white
        transparent: true,
        opacity: isLightMode ? 0.16 : 0.22, // Completely see-through!
        roughness: 0.02, // Mirror-smooth polish
        metalness: 0.05,
        ior: 1.52,
        reflectivity: 1.0,
        specularIntensity: 1.0,
        specularColor: new THREE.Color(0xffffff),
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        envMapIntensity: 3.5, // Crisp specular studio rim reflections
        depthWrite: false,
      }),

      // Metallic Accent Foot Rim Ring at Base
      darkRim: new THREE.MeshStandardMaterial({
        color: isLightMode ? 0xcbd5e1 : 0xe2e8f0,
        metalness: 0.94,
        roughness: 0.18,
        envMapIntensity: 2.6,
      }),

      // Knurled Chrome Cap Materials (Gleaming luxury silver chrome in both dark and light mode!)
      capChrome: new THREE.MeshStandardMaterial({
        color: isLightMode ? 0xf8fafc : 0xf1f5f9,
        metalness: 0.96,
        roughness: 0.12,
        envMapIntensity: 2.8,
      }),
      capKnurl: new THREE.MeshStandardMaterial({
        color: isLightMode ? 0xe2e8f0 : 0xe2e8f0,
        metalness: 0.92,
        roughness: 0.22,
        envMapIntensity: 2.4,
      }),

      // Top-to-Bottom Pouring Stream
      stream: new THREE.MeshBasicMaterial({
        color: 0x00d8ff,
        transparent: true,
        opacity: 0.90,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    };

    // =========================================================================
    // 6. ILLUMINATED DOUBLE-TIERED PLATFORM DISC (BENEATh CENTER HERO BOTTLE)
    // =========================================================================
    const platformGroup = new THREE.Group();
    platformGroup.position.set(0, -0.01, 0.85);
    scene.add(platformGroup);

    // Floor Glow Radial Texture Disc
    const floorGlowGeo = new THREE.PlaneGeometry(4.2, 4.2);
    const floorGlowMat = new THREE.MeshBasicMaterial({
      map: createFloorRadialTexture(isLightMode),
      transparent: true,
      depthWrite: false,
      blending: isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending,
      opacity: isLightMode ? 0.35 : 0.60,
    });
    const floorGlowMesh = new THREE.Mesh(floorGlowGeo, floorGlowMat);
    floorGlowMesh.rotation.x = -Math.PI / 2;
    platformGroup.add(floorGlowMesh);

    // Tier 2 (Lower Base Disc - Radius ~1.40, Height ~0.05)
    const tier2Radius = 1.40;
    const tier2Height = 0.05;
    const tier2Geo = new THREE.CylinderGeometry(tier2Radius, tier2Radius * 1.02, tier2Height, 64);
    const tier2Mat = new THREE.MeshStandardMaterial({
      color: isLightMode ? 0xe2e8f0 : 0x0a0f1d,
      metalness: 0.85,
      roughness: 0.25,
      envMapIntensity: 2.0,
    });
    const tier2Mesh = new THREE.Mesh(tier2Geo, tier2Mat);
    tier2Mesh.position.y = tier2Height / 2;
    tier2Mesh.receiveShadow = true;
    platformGroup.add(tier2Mesh);

    // Tier 2 Illuminated Cyan Neon Perimeter Ring
    const tier2RingMat = new THREE.MeshBasicMaterial({
      color: 0x00d8ff,
      transparent: true,
      opacity: isLightMode ? 0.65 : 0.95,
    });
    const tier2Ring = new THREE.Mesh(
      new THREE.TorusGeometry(tier2Radius, 0.014, 16, 64),
      tier2RingMat
    );
    tier2Ring.rotation.x = Math.PI / 2;
    tier2Ring.position.y = tier2Height;
    platformGroup.add(tier2Ring);

    // Tier 1 (Upper Raised Disc - Radius ~0.82, Height ~0.06)
    const tier1Radius = 0.82;
    const tier1Height = 0.06;
    const tier1Geo = new THREE.CylinderGeometry(tier1Radius, tier1Radius * 1.01, tier1Height, 64);
    const tier1Mat = new THREE.MeshStandardMaterial({
      color: isLightMode ? 0xf8fafc : 0x111827,
      metalness: 0.92,
      roughness: 0.15,
      envMapIntensity: 2.5,
    });
    const tier1Mesh = new THREE.Mesh(tier1Geo, tier1Mat);
    tier1Mesh.position.y = tier2Height + tier1Height / 2;
    tier1Mesh.receiveShadow = true;
    platformGroup.add(tier1Mesh);

    // Tier 1 Illuminated Cyan Neon Perimeter Ring
    const tier1RingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: isLightMode ? 0.75 : 1.0,
    });
    const tier1Ring = new THREE.Mesh(
      new THREE.TorusGeometry(tier1Radius, 0.016, 16, 64),
      tier1RingMat
    );
    tier1Ring.rotation.x = Math.PI / 2;
    tier1Ring.position.y = tier2Height + tier1Height;
    platformGroup.add(tier1Ring);

    // Outer Concentric Floor Rings
    const floorRingMat = new THREE.MeshBasicMaterial({
      color: isLightMode ? 0x0284c7 : 0x00a3ff,
      transparent: true,
      opacity: isLightMode ? 0.35 : 0.60,
    });
    const ringOuter1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.009, 12, 64),
      floorRingMat
    );
    ringOuter1.rotation.x = Math.PI / 2;
    ringOuter1.position.y = 0.005;
    platformGroup.add(ringOuter1);

    const ringOuter2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.35, 0.007, 12, 64),
      floorRingMat
    );
    ringOuter2.rotation.x = Math.PI / 2;
    ringOuter2.position.y = 0.005;
    platformGroup.add(ringOuter2);

    // =========================================================================
    // 7. SWIRLING WATER / LIGHT ENERGY ARCS AROUND CENTER BOTTLE
    // =========================================================================
    const spiralSwirlGroup = new THREE.Group();
    spiralSwirlGroup.position.set(0, 0, 0.85);
    scene.add(spiralSwirlGroup);

    // Helical Ribbon Curve
    const spiralPoints = [];
    const spiralTurns = 1.8;
    const spiralSteps = 80;
    for (let s = 0; s <= spiralSteps; s++) {
      const t = s / spiralSteps;
      const angle = t * Math.PI * 2 * spiralTurns;
      const rad = 0.75 - t * 0.30;
      const y = 0.15 + t * 0.95;
      spiralPoints.push(new THREE.Vector3(Math.cos(angle) * rad, y, Math.sin(angle) * rad));
    }
    const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
    const spiralTubeGeo = new THREE.TubeGeometry(spiralCurve, 64, 0.022, 12, false);
    const spiralTubeMat = new THREE.MeshPhysicalMaterial({
      color: 0x00d8ff,
      transparent: true,
      opacity: isLightMode ? 0.55 : 0.75,
      roughness: 0.05,
      metalness: 0.1,
      ior: 1.33,
      clearcoat: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const spiralMesh = new THREE.Mesh(spiralTubeGeo, spiralTubeMat);
    spiralSwirlGroup.add(spiralMesh);

    // Second complementary energy swirl arc
    const spiralPoints2 = [];
    for (let s = 0; s <= spiralSteps; s++) {
      const t = s / spiralSteps;
      const angle = Math.PI + t * Math.PI * 2 * spiralTurns;
      const rad = 0.68 - t * 0.26;
      const y = 0.20 + t * 0.85;
      spiralPoints2.push(new THREE.Vector3(Math.cos(angle) * rad, y, Math.sin(angle) * rad));
    }
    const spiralCurve2 = new THREE.CatmullRomCurve3(spiralPoints2);
    const spiralTubeGeo2 = new THREE.TubeGeometry(spiralCurve2, 64, 0.016, 12, false);
    const spiralMesh2 = new THREE.Mesh(spiralTubeGeo2, spiralTubeMat);
    spiralSwirlGroup.add(spiralMesh2);

    // Sparkling Water Droplet Particles
    const dropCount = 45;
    const dropGeo = new THREE.BufferGeometry();
    const dropPositions = new Float32Array(dropCount * 3);
    const dropData = [];

    for (let d = 0; d < dropCount; d++) {
      const t = Math.random();
      const pt = spiralCurve.getPoint(t);
      const jitter = (Math.random() - 0.5) * 0.12;
      dropPositions[d * 3] = pt.x + jitter;
      dropPositions[d * 3 + 1] = pt.y + jitter;
      dropPositions[d * 3 + 2] = pt.z + jitter;
      dropData.push({ t, speed: 0.08 + Math.random() * 0.12, jitter });
    }
    dropGeo.setAttribute('position', new THREE.BufferAttribute(dropPositions, 3));
    const dropMat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.038,
      transparent: true,
      opacity: 0.90,
      blending: THREE.AdditiveBlending,
    });
    const dropPointsMesh = new THREE.Points(dropGeo, dropMat);
    spiralSwirlGroup.add(dropPointsMesh);

    // =========================================================================
    // 8. BUILD ALL 20 REALISTIC CRYSTAL BOTTLES
    // BOTTLES START EMPTY WITH LABEL AND LOGO!
    // COLORED WATER FILLS UP DYNAMICALLY ONLY ON CLICK!
    // =========================================================================
    const bottleList = [];
    const logoTextures = {};
    const labelTextures = {};
    const haloTextures = {};
    const bottleGeometryData = createLuxuryBottleProfile();

    VAULT_TECHNOLOGIES.forEach((tech, idx) => {
      const bottleMasterGroup = new THREE.Group();
      scene.add(bottleMasterGroup);

      const {
        geometry: latheGeo,
        baseH,
        bodyH,
        neckLipY,
        neckTopY,
        bodyRadius,
        neckRadius,
      } = bottleGeometryData;

      // =========================================================================
      // A. VIBRANT JEWEL-COLORED RADIANT LIQUID COLUMN & MENISCUS
      // (STARTS EMPTY AND HIDDEN! Fills up smoothly when clicked!)
      // =========================================================================
      const liquidRadius = bodyRadius * 0.94;
      const maxLiquidH = bodyH * 0.94;
      const techLiquidColor = tech.liquidColorHex || 0x00d8ff;

      const liquidMat = new THREE.MeshPhysicalMaterial({
        color: techLiquidColor,
        transparent: true,
        opacity: isLightMode ? 0.85 : 0.90,
        roughness: 0.03,
        metalness: 0.06,
        ior: 1.333,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        envMapIntensity: 2.2,
        emissive: techLiquidColor,
        emissiveIntensity: isLightMode ? 0.72 : 0.85, // HIGH RADIANT EMISSIVE GLOW!
        depthWrite: false,
      });

      // Liquid Cylinder Mesh (Initially hidden / 0 height: BOTTLE STARTS EMPTY!)
      const liquidGeo = new THREE.CylinderGeometry(liquidRadius, liquidRadius, 1.0, 32);
      const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
      liquidMesh.scale.set(1, 0.001, 1);
      liquidMesh.position.y = baseH;
      liquidMesh.visible = false;
      liquidMesh.renderOrder = 1;
      bottleMasterGroup.add(liquidMesh);

      // Meniscus Top Surface Disc (Initially hidden)
      const meniscusMat = new THREE.MeshBasicMaterial({
        color: techLiquidColor,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const meniscusGeo = new THREE.CircleGeometry(liquidRadius, 32);
      const meniscusMesh = new THREE.Mesh(meniscusGeo, meniscusMat);
      meniscusMesh.rotation.x = -Math.PI / 2;
      meniscusMesh.position.y = baseH;
      meniscusMesh.visible = false;
      meniscusMesh.renderOrder = 1;
      bottleMasterGroup.add(meniscusMesh);

      // Top-to-Bottom Pouring Stream (activates during click unseal animation)
      const streamGeo = new THREE.CylinderGeometry(neckRadius * 0.30, neckRadius * 0.22, 1.0, 16);
      const streamMesh = new THREE.Mesh(streamGeo, materials.stream);
      streamMesh.visible = false;
      streamMesh.renderOrder = 2;
      bottleMasterGroup.add(streamMesh);

      // Effervescent Rising Bubbles inside the Jewel Liquid (Initially hidden)
      const bubbleCount = 20;
      const bubbleGeo = new THREE.BufferGeometry();
      const bubblePositions = new Float32Array(bubbleCount * 3);
      const bubbleData = [];

      for (let bIdx = 0; bIdx < bubbleCount; bIdx++) {
        const bRad = Math.random() * liquidRadius * 0.80;
        const bAngle = Math.random() * Math.PI * 2;
        const bSpeed = 0.35 + Math.random() * 0.55;
        const bY = Math.random() * maxLiquidH;
        bubblePositions[bIdx * 3] = Math.cos(bAngle) * bRad;
        bubblePositions[bIdx * 3 + 1] = baseH + bY;
        bubblePositions[bIdx * 3 + 2] = Math.sin(bAngle) * bRad;
        bubbleData.push({ rad: bRad, angle: bAngle, speed: bSpeed, y: bY });
      }

      bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));
      const bubbleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.024,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
      bubbles.visible = false;
      bubbles.renderOrder = 2;
      bottleMasterGroup.add(bubbles);

      // =========================================================================
      // B. AUTHENTIC VECTOR BRAND LOGO CENTERED INSIDE THE BOTTLE
      // (Rendered in center of bottle chamber, ALWAYS VISIBLE in empty & filled state!)
      // =========================================================================
      const logoData = TECH_SVG_LOGOS[tech.key];
      const logoTexture = createBottleInteriorTexture(logoData, tech, isLightMode);
      if (logoTexture) {
        logoTextures[tech.key] = logoTexture;
      }

      const haloTexture = createHaloTexture(logoData?.brandColor || tech.liquidColor || '#38bdf8', isLightMode);
      haloTextures[tech.key] = haloTexture;

      const logoGroup = new THREE.Group();
      // Positioned in the center of the bottle chamber
      logoGroup.position.set(0, baseH + bodyH * 0.52, 0.02);
      logoGroup.scale.set(0.52, 0.52, 0.52);

      const logoMat = new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        opacity: 0.98,
      });
      const logoPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.05, 1.05),
        logoMat
      );
      logoPlane.renderOrder = 3;
      logoGroup.add(logoPlane);

      // Glowing Halo Caustics Disc
      const haloMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.20, 1.20),
        new THREE.MeshBasicMaterial({
          map: haloTexture,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: isLightMode ? 0.35 : 0.30,
          side: THREE.DoubleSide,
        })
      );
      haloMesh.position.z = -0.01;
      haloMesh.renderOrder = 2;
      logoGroup.add(haloMesh);

      bottleMasterGroup.add(logoGroup);

      // Internal Point Light casting colored caustics
      const innerLight = new THREE.PointLight(
        techLiquidColor,
        isLightMode ? 0.4 : 0.3, // Subtle when empty, intensifies when filled!
        3.5
      );
      innerLight.position.set(0, baseH + bodyH * 0.52, 0);
      bottleMasterGroup.add(innerLight);

      // =========================================================================
      // C. ULTRA-TRANSPARENT OPTICAL CRYSTAL GLASS BODY (renderOrder: 4)
      // =========================================================================
      const bottleMesh = new THREE.Mesh(latheGeo, materials.glass);
      bottleMesh.renderOrder = 4;
      bottleMesh.castShadow = true;
      bottleMesh.receiveShadow = true;
      bottleMasterGroup.add(bottleMesh);

      // Metallic Accent Foot Rim Ring at Base
      const footRing = new THREE.Mesh(
        new THREE.TorusGeometry(bodyRadius * 0.98, 0.009, 16, 48),
        materials.darkRim
      );
      footRing.rotation.x = Math.PI / 2;
      footRing.position.y = 0.035;
      footRing.renderOrder = 5;
      bottleMasterGroup.add(footRing);

      // Accent Shoulder Transition Ring
      const shoulderRing = new THREE.Mesh(
        new THREE.TorusGeometry(bodyRadius * 0.99, 0.006, 12, 48),
        materials.darkRim
      );
      shoulderRing.rotation.x = Math.PI / 2;
      shoulderRing.position.y = baseH + bodyH;
      shoulderRing.renderOrder = 5;
      bottleMasterGroup.add(shoulderRing);

      // Accent Neck Lip Rim
      const lipRing = new THREE.Mesh(
        new THREE.TorusGeometry(neckRadius * 1.02, 0.006, 12, 36),
        materials.darkRim
      );
      lipRing.rotation.x = Math.PI / 2;
      lipRing.position.y = neckLipY;
      lipRing.renderOrder = 5;
      bottleMasterGroup.add(lipRing);

      // =========================================================================
      // D. REALISTIC EMBOSSED PHYSICAL PLAQUE LABEL (renderOrder: 6)
      // (Contains skill name & micro-details, 100% unmirrored!)
      // =========================================================================
      const bodyLabelTexture = createBottleBodyLabelTexture(tech, isLightMode);
      if (bodyLabelTexture) labelTextures[tech.key] = bodyLabelTexture;

      const plaqueW = 0.44;
      const plaqueH = 0.18;
      const plaqueGeo = new THREE.PlaneGeometry(plaqueW, plaqueH, 16, 1);
      // Curve along Z to hug the cylindrical glass contour
      const posAttr = plaqueGeo.attributes.position;
      for (let v = 0; v < posAttr.count; v++) {
        const vx = posAttr.getX(v);
        posAttr.setZ(v, -0.42 * (vx * vx) / bodyRadius);
      }
      plaqueGeo.computeVertexNormals();

      // MeshStandardMaterial gives it realistic metallic sheen from scene lighting!
      const labelMat = new THREE.MeshStandardMaterial({
        map: bodyLabelTexture,
        transparent: true,
        roughness: 0.28,
        metalness: 0.70,
        envMapIntensity: 2.2,
        side: THREE.FrontSide,
        depthWrite: false,
      });
      const labelMesh = new THREE.Mesh(plaqueGeo, labelMat);
      labelMesh.position.set(0, baseH + 0.18, bodyRadius + 0.009);
      labelMesh.renderOrder = 6;
      bottleMasterGroup.add(labelMesh);

      // =========================================================================
      // E. METALLIC SILVER KNURLED SCREW CAP (SEPARATE GROUP FOR HELICAL MOTION)
      // =========================================================================
      const capGroup = new THREE.Group();
      capGroup.position.y = neckLipY;

      const capRadius = neckRadius * 1.14;
      const capHeight = 0.13;
      const ridgeCount = 36;

      // Cap Fluted Body with 36 Knurled Vertical Ridges
      const capBase = new THREE.Mesh(
        new THREE.CylinderGeometry(capRadius, capRadius, capHeight, ridgeCount),
        materials.capChrome
      );
      capBase.position.y = capHeight / 2;
      capBase.castShadow = true;
      capGroup.add(capBase);

      // Knurled Grip Ring
      const knurlRing = new THREE.Mesh(
        new THREE.CylinderGeometry(capRadius * 1.035, capRadius * 1.035, capHeight * 0.70, ridgeCount),
        materials.capKnurl
      );
      knurlRing.position.y = capHeight * 0.48;
      capGroup.add(knurlRing);

      // Polished Top Chrome Bevel Disc
      const capTop = new THREE.Mesh(
        new THREE.CylinderGeometry(capRadius * 0.94, capRadius, 0.016, 36),
        materials.capChrome
      );
      capTop.position.y = capHeight + 0.008;
      capGroup.add(capTop);

      bottleMasterGroup.add(capGroup);

      // Raycasting Hit Boundary (Click/Touch Target)
      const hitBox = new THREE.Mesh(
        new THREE.CylinderGeometry(bodyRadius * 1.5, bodyRadius * 1.5, 1.5, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.y = 0.70;
      hitBox.userData = { index: idx, techKey: tech.key };
      bottleMasterGroup.add(hitBox);

      bottleList.push({
        index: idx,
        tech,
        group: bottleMasterGroup,
        capGroup,
        logoGroup,
        logoMat,
        haloMesh,
        liquidMesh,
        liquidMat,
        meniscusMesh,
        streamMesh,
        bubbles,
        bubbleData,
        innerLight,
        labelMesh,
        hitBox,
        baseH,
        bodyH,
        maxLiquidH,
        neckLipY,
        neckTopY,
        openProgress: 0,
        waterLevel: 0,
        hasPoppedCard: false,
      });
    });

    threeRefs.current = {
      scene,
      camera,
      renderer,
      pmremGenerator,
      materials,
      bottleList,
      platformGroup,
      spiralSwirlGroup,
      focusedSpotlight,
      ambientLight,
      keyLight,
      reqId: null,
      isVisible: true,
    };

    // =========================================================================
    // 9. INTERACTIVE RAYCASTING & CLICK NAVIGATION
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isPointerDown = false;
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      keyLight.position.x = 2 + mouse.x * 1.5;
      keyLight.position.y = 9 + mouse.y * 1.2;

      raycaster.setFromCamera(mouse, camera);
      const hitMeshes = bottleList.map((b) => b.hitBox);
      const intersects = raycaster.intersectObjects(hitMeshes, false);

      if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
    };

    const onPointerDown = (e) => {
      isPointerDown = true;
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;

      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      if (dx > 8 || dy > 8) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hitMeshes = bottleList.map((b) => b.hitBox);
      const intersects = raycaster.intersectObjects(hitMeshes, false);

      if (intersects.length > 0) {
        const clickedIndex = intersects[0].object.userData.index;
        const currentActive = activeIndexRef.current;

        if (clickedIndex === currentActive) {
          // Center hero bottle clicked: toggle cap unscrew, water filling & HUD reveal!
          if (onToggleUnsealRef.current) {
            onToggleUnsealRef.current();
          }
        } else {
          // Surrounding bottle clicked: smoothly glide it to center!
          if (onSelectIndexRef.current) {
            onSelectIndexRef.current(clickedIndex);
          }
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointermove', onPointerMove, { passive: true });
    domEl.addEventListener('pointerdown', onPointerDown, { passive: true });
    domEl.addEventListener('pointerup', onPointerUp, { passive: true });

    // 10. Resize Handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth || 1050;
      const nh = container.clientHeight || 620;
      const isMob = nw < 768;
      camera.aspect = nw / nh;
      camera.position.set(0, 0.62, isMob ? 7.6 : 6.8);
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    };

    window.addEventListener('resize', handleResize);

    // 11. Visibility Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          threeRefs.current.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // =========================================================================
    // 12. MASTER 60 FPS RENDER LOOP
    // 7-Bottle 3D Lineup, Swirling Water Arcs, Platform Neon Pulse & Empty->Filled Dynamics
    // =========================================================================
    let lastTime = performance.now();

    const animate = (time) => {
      threeRefs.current.reqId = requestAnimationFrame(animate);

      if (!threeRefs.current.isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      const elapsed = time * 0.001;

      const activeIdx = activeIndexRef.current;
      const unsealedState = isUnsealedRef.current;
      const totalCount = bottleList.length;
      const isMob = window.innerWidth < 768;

      // Animate Swirling Water Ribbon & Sparkling Particles around Center Bottle
      spiralSwirlGroup.rotation.y = elapsed * 0.85;
      const dropPosArr = dropPointsMesh.geometry.attributes.position.array;
      for (let d = 0; d < dropData.length; d++) {
        dropData[d].t = (dropData[d].t + dropData[d].speed * dt) % 1.0;
        const pt = spiralCurve.getPoint(dropData[d].t);
        dropPosArr[d * 3] = pt.x + Math.sin(elapsed * 2.0 + d) * 0.04;
        dropPosArr[d * 3 + 1] = pt.y;
        dropPosArr[d * 3 + 2] = pt.z + Math.cos(elapsed * 2.0 + d) * 0.04;
      }
      dropPointsMesh.geometry.attributes.position.needsUpdate = true;

      // Platform disc perimeter neon pulses
      const neonPulse = Math.sin(elapsed * 2.5);
      tier1RingMat.opacity = (isLightMode ? 0.70 : 0.95) + neonPulse * 0.12;
      tier2RingMat.opacity = (isLightMode ? 0.60 : 0.85) + Math.sin(elapsed * 2.5 + 0.8) * 0.12;
      floorRingMat.opacity = (isLightMode ? 0.30 : 0.55) + Math.sin(elapsed * 2.5 + 1.6) * 0.10;
      floorGlowMesh.material.opacity = (isLightMode ? 0.32 : 0.55) + neonPulse * 0.10;

      // =========================================================================
      // EXACT 7-BOTTLE 3D CAROUSEL ARC
      // [-3] [-2] [-1] [0: Center Hero] [+1] [+2] [+3]
      // =========================================================================
      bottleList.forEach((b, i) => {
        let delta = ((i - activeIdx) % totalCount + totalCount) % totalCount;
        if (delta > totalCount / 2) delta -= totalCount;

        let tx = 0;
        let ty = 0;
        let tz = 0;
        let tScale = 1.0;
        let tRotY = 0;
        let isVis = true;

        if (delta === 0) {
          // 0: CENTER HERO (Rests on elevated platform disc)
          tx = 0;
          ty = 0.12;
          tz = isMob ? 0.95 : 0.85;
          tScale = isMob ? 1.20 : 1.30;
          tRotY = 0;
        } else if (delta === -1) {
          // -1: NEAR LEFT
          tx = isMob ? -1.35 : -1.60;
          ty = 0.04;
          tz = isMob ? 0.15 : 0.10;
          tScale = isMob ? 0.80 : 0.94;
          tRotY = 0.16;
        } else if (delta === 1) {
          // +1: NEAR RIGHT
          tx = isMob ? 1.35 : 1.60;
          ty = 0.04;
          tz = isMob ? 0.15 : 0.10;
          tScale = isMob ? 0.80 : 0.94;
          tRotY = -0.16;
        } else if (delta === -2) {
          // -2: MID LEFT
          tx = isMob ? -2.60 : -3.05;
          ty = -0.04;
          tz = isMob ? -0.70 : -0.70;
          tScale = isMob ? 0.60 : 0.78;
          tRotY = 0.28;
        } else if (delta === 2) {
          // +2: MID RIGHT
          tx = isMob ? 2.60 : 3.05;
          ty = -0.04;
          tz = isMob ? -0.70 : -0.70;
          tScale = isMob ? 0.60 : 0.78;
          tRotY = -0.28;
        } else if (delta === -3) {
          // -3: FAR LEFT
          tx = isMob ? -3.75 : -4.40;
          ty = -0.10;
          tz = isMob ? -1.50 : -1.55;
          tScale = isMob ? 0.46 : 0.65;
          tRotY = 0.40;
        } else if (delta === 3) {
          // +3: FAR RIGHT
          tx = isMob ? 3.75 : 4.40;
          ty = -0.10;
          tz = isMob ? -1.50 : -1.55;
          tScale = isMob ? 0.46 : 0.65;
          tRotY = -0.40;
        } else {
          // Beyond the 7 visible bottles: hidden in queue
          tx = delta < 0 ? -8 : 8;
          ty = -0.3;
          tz = -5.0;
          tScale = 0.15;
          isVis = false;
        }

        b.group.visible = isVis;

        // Smooth physics-based carousel interpolation
        b.group.position.x = THREE.MathUtils.lerp(b.group.position.x, tx, dt * 6.5);
        b.group.position.y = THREE.MathUtils.lerp(b.group.position.y, ty, dt * 6.5);
        b.group.position.z = THREE.MathUtils.lerp(b.group.position.z, tz, dt * 6.5);
        b.group.rotation.y = THREE.MathUtils.lerp(b.group.rotation.y, tRotY, dt * 6.5);

        const curScale = b.group.scale.x;
        const nScale = THREE.MathUtils.lerp(curScale, tScale, dt * 6.5);
        b.group.scale.set(nScale, nScale, nScale);

        // =========================================================================
        // SEQUENTIAL INTERACTION:
        // BOTTLE IS EMPTY INITIALLY (contains label & logo) ->
        // ON CLICK: HELICAL CAP UNSCREWS -> COLORED WATER FILLS -> SPECIFICATION CARD POPS UP!
        // =========================================================================
        const isCenterTarget = delta === 0 && unsealedState;
        const targetOpen = isCenterTarget ? 1.0 : 0.0;

        // 1. Helical Cap Unscrew & Elevation (Opens ONLY when user clicks!)
        b.openProgress += (targetOpen - b.openProgress) * Math.min(1.0, dt * 2.0);
        const op = b.openProgress;
        const capRestY = b.neckLipY;

        if (op <= 0.45) {
          // Helical Unscrew along thread pitch (3 full revolutions)
          const twistProgress = op / 0.45;
          const twistAngle = twistProgress * Math.PI * 6;
          const threadElevation = twistProgress * 0.10;

          b.capGroup.position.y = capRestY + threadElevation;
          b.capGroup.rotation.y = -twistAngle;
          b.capGroup.rotation.x = 0;
          b.capGroup.rotation.z = 0;
        } else {
          // Release and hover high above the mouth with gentle float
          const liftProgress = (op - 0.45) / 0.55;
          const liftEase = Math.sin(liftProgress * Math.PI * 0.5);
          const liftElevation = 0.10 + liftEase * 0.70;
          const hoverFloat = Math.sin(elapsed * 2.8) * 0.018;

          b.capGroup.position.y = capRestY + liftElevation + hoverFloat;
          b.capGroup.rotation.y = -Math.PI * 6 - liftProgress * (Math.PI * 0.6);
          b.capGroup.rotation.x = liftProgress * 0.12;
          b.capGroup.rotation.z = -liftProgress * 0.08;
        }

        // =========================================================================
        // 2. COLORED WATER FILLING DYNAMICS
        // Bottle is EMPTY initially (waterLevel = 0)!
        // When unsealed/clicked: colored water fills from bottom to top!
        // =========================================================================
        const targetWater = isCenterTarget && op > 0.20 ? 1.0 : 0.0;
        b.waterLevel += (targetWater - b.waterLevel) * Math.min(1.0, dt * 2.2);
        const wl = b.waterLevel;
        const curLiquidH = b.maxLiquidH * wl;
        const waterSurfaceY = b.baseH + curLiquidH;

        if (wl > 0.015) {
          // Water is filling / active!
          b.liquidMesh.visible = true;
          b.liquidMesh.scale.set(1, Math.max(0.001, curLiquidH), 1);
          b.liquidMesh.position.y = b.baseH + curLiquidH / 2;

          // Meniscus surface disc rises with the liquid
          b.meniscusMesh.visible = wl < 0.99;
          b.meniscusMesh.position.y = waterSurfaceY;
          b.meniscusMesh.rotation.z = Math.sin(elapsed * 3.5) * 0.02;

          // Cascading Water Pouring Stream (from open mouth down into the bottle)
          if (wl < 0.96 && op > 0.28) {
            const streamSpan = b.neckTopY - waterSurfaceY;
            if (streamSpan > 0.02) {
              b.streamMesh.visible = true;
              b.streamMesh.scale.set(
                1 + Math.sin(elapsed * 16.0) * 0.15,
                streamSpan,
                1 + Math.cos(elapsed * 16.0) * 0.15
              );
              b.streamMesh.position.y = waterSurfaceY + streamSpan / 2;
            } else {
              b.streamMesh.visible = false;
            }
          } else {
            b.streamMesh.visible = false;
          }

          // Effervescent Rising Bubbles inside the colored water
          b.bubbles.visible = true;
          const posArr = b.bubbles.geometry.attributes.position.array;
          for (let p = 0; p < b.bubbleData.length; p++) {
            b.bubbleData[p].y += b.bubbleData[p].speed * dt;
            if (b.bubbleData[p].y > curLiquidH) {
              b.bubbleData[p].y = 0;
            }
            posArr[p * 3 + 1] = b.baseH + b.bubbleData[p].y;
            posArr[p * 3] = Math.cos(b.bubbleData[p].angle + elapsed * 1.5) * b.bubbleData[p].rad;
            posArr[p * 3 + 2] = Math.sin(b.bubbleData[p].angle + elapsed * 1.5) * b.bubbleData[p].rad;
          }
          b.bubbles.geometry.attributes.position.needsUpdate = true;
        } else {
          // BOTTLE IS EMPTY!
          b.liquidMesh.visible = false;
          b.meniscusMesh.visible = false;
          b.streamMesh.visible = false;
          b.bubbles.visible = false;
        }

        // =========================================================================
        // 3. LOGO & LIGHT DYNAMICS
        // Logo is ALWAYS visible in the empty bottle.
        // When colored water fills, caustics and inner light intensify!
        // =========================================================================
        if (delta === 0) {
          const floatOffset = Math.sin(elapsed * 2.4) * 0.02;
          b.logoGroup.position.y = b.baseH + b.bodyH * 0.52 + floatOffset;
          b.logoGroup.position.x = Math.sin(elapsed * 1.5) * 0.01;
          b.logoGroup.rotation.z = Math.sin(elapsed * 1.6) * 0.02;
          b.logoGroup.rotation.y = Math.cos(elapsed * 1.2) * 0.03;

          const revealVal = Math.min(1.0, wl * 1.2);
          b.haloMesh.material.opacity = (isLightMode ? 0.35 : 0.30) + revealVal * 0.45;
          // Inner light: subtle when empty, blazing jewel radiance when filled with colored water!
          b.innerLight.intensity = THREE.MathUtils.lerp(
            isLightMode ? 0.35 : 0.25,
            isLightMode ? 1.6 : 2.2,
            revealVal
          );

          // 4. Trigger Specifications Card Pop-Up once water fill completes!
          if (wl >= 0.88 && !b.hasPoppedCard) {
            b.hasPoppedCard = true;
            if (onWaterFilledRef.current) {
              onWaterFilledRef.current(b.tech);
            }
          } else if (wl < 0.15) {
            b.hasPoppedCard = false;
          }
        } else {
          // Resting non-center bottles (Empty, logo visible)
          b.logoGroup.position.set(0, b.baseH + b.bodyH * 0.52, 0.02);
          b.logoGroup.rotation.set(0, 0, 0);
          b.innerLight.intensity = isLightMode ? 0.35 : 0.25;
          b.hasPoppedCard = false;
        }
      });

      renderer.render(scene, camera);
    };

    threeRefs.current.reqId = requestAnimationFrame(animate);

    return () => {
      if (threeRefs.current.reqId) {
        cancelAnimationFrame(threeRefs.current.reqId);
      }
      domEl.removeEventListener('pointermove', onPointerMove);
      domEl.removeEventListener('pointerdown', onPointerDown);
      domEl.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      renderer.dispose();
      pmremGenerator.dispose();
      studioEnvMap.dispose();
      Object.values(materials).forEach((mat) => mat.dispose());
      Object.values(logoTextures).forEach((tex) => tex.dispose());
      Object.values(labelTextures).forEach((tex) => tex.dispose());
      Object.values(haloTextures).forEach((tex) => tex.dispose());
    };
  }, []);

  // Theme Synchronizer
  useEffect(() => {
    const refs = threeRefs.current;
    if (!refs.scene || !refs.renderer || !refs.pmremGenerator) return;

    const isLightMode = theme === 'light';
    const newEnvMap = createStudioEnvMap(refs.renderer, refs.pmremGenerator, isLightMode);
    refs.scene.environment = newEnvMap;

    if (refs.scene.fog) {
      refs.scene.fog.color.setHex(isLightMode ? 0xf8fafc : 0x050508);
    }

    if (refs.ambientLight) {
      refs.ambientLight.intensity = isLightMode ? 1.05 : 0.85;
    }

    if (refs.keyLight) {
      refs.keyLight.intensity = isLightMode ? 2.8 : 3.8;
    }

    if (refs.materials.glass) {
      refs.materials.glass.color.setHex(0xffffff);
      refs.materials.glass.opacity = isLightMode ? 0.16 : 0.22;
    }

    if (refs.materials.darkRim) {
      refs.materials.darkRim.color.setHex(isLightMode ? 0x475569 : 0xe2e8f0);
    }

    if (refs.materials.capChrome) {
      refs.materials.capChrome.color.setHex(isLightMode ? 0x475569 : 0xf1f5f9);
    }

    if (refs.materials.capKnurl) {
      refs.materials.capKnurl.color.setHex(isLightMode ? 0x334155 : 0xe2e8f0);
    }

    // Refresh logo and body label textures for updated theme
    refs.bottleList.forEach((item) => {
      const logoData = TECH_SVG_LOGOS[item.tech.key];
      const newLogoTex = createBottleInteriorTexture(logoData, item.tech, isLightMode);
      if (newLogoTex) {
        item.logoGroup.children[0].material.map = newLogoTex;
        item.logoGroup.children[0].material.needsUpdate = true;
      }

      const newLabelTex = createBottleBodyLabelTexture(item.tech, isLightMode);
      if (newLabelTex) {
        item.labelMesh.material.map = newLabelTex;
        item.labelMesh.material.needsUpdate = true;
      }
    });
  }, [theme]);

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[500px] sm:min-h-[560px] md:min-h-[620px] overflow-hidden cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
