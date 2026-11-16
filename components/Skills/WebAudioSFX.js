'use client';

/**
 * Procedural Web Audio SFX Synthesizer
 * 100% synthetic sound design using the Web Audio API (Zero external audio files required).
 * 
 * Implements:
 * 1. Crisp Cap Pop on Open: Transient impulse + resonant air cavity body pop
 * 2. Glass Tink on Carousel Switch: Twin crystal chime sine oscillators with exponential decay
 * 3. Bandpass-Filtered Water Pour: Continuous filtered noise with pitch rising smoothly with fillLevel
 */

class WebAudioSFXController {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.pourSource = null;
    this.pourGain = null;
    this.pourFilter = null;
    this.pourLfo = null;
    this.noiseBuffer = null;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Pre-generate 1.5 seconds of white/pink noise for liquid synthesis
      const bufferSize = this.ctx.sampleRate * 1.5;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Soft pink filter integration
        lastOut = lastOut * 0.92 + white * 0.08;
        data[i] = lastOut * 3.2;
      }
    } catch {
      // AudioContext unavailable
    }
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    if (this.isMuted) {
      this.stopWaterPour();
    }
  }

  /**
   * 1. Crisp Cap Pop on Open
   * Transient click impulse paired with a resonant cavity pop (1800Hz -> 380Hz)
   */
  playCapPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Transient click oscillator
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(2600, now);
      clickOsc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      clickGain.gain.setValueAtTime(0.35, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.04);

      // Cavity body pop (bandpass filtered resonance)
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(540, now);
      popOsc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      popGain.gain.setValueAtTime(0.40, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);

      popOsc.start(now);
      popOsc.stop(now + 0.10);
    } catch {
      // Ignore audio error
    }
  }

  /**
   * 2. Glass Tink on Carousel Switch
   * Crystalline high-frequency chime with clean harmonic pair (2400Hz + 3800Hz)
   */
  playGlassTink() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Primary glass chime
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2400, now);

      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.40);

      // Secondary crystal overtone
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(3800, now);

      gain2.gain.setValueAtTime(0.14, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(now);
      osc2.stop(now + 0.30);
    } catch {
      // Ignore audio error
    }
  }

  /**
   * 3. Bandpass-Filtered Water Pour
   * Pitch smoothly rises from 220Hz to 780Hz with fillLevel
   */
  startWaterPour() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.noiseBuffer || this.pourSource) return;

    try {
      const now = this.ctx.currentTime;

      this.pourSource = this.ctx.createBufferSource();
      this.pourSource.buffer = this.noiseBuffer;
      this.pourSource.loop = true;

      this.pourFilter = this.ctx.createBiquadFilter();
      this.pourFilter.type = 'bandpass';
      this.pourFilter.Q.value = 4.8;
      this.pourFilter.frequency.setValueAtTime(220, now);

      this.pourGain = this.ctx.createGain();
      this.pourGain.gain.setValueAtTime(0.001, now);
      this.pourGain.gain.linearRampToValueAtTime(0.24, now + 0.25);

      // Gentle bubbling LFO (12Hz)
      this.pourLfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.pourLfo.frequency.setValueAtTime(11, now);
      lfoGain.gain.setValueAtTime(28, now);
      this.pourLfo.connect(lfoGain);
      lfoGain.connect(this.pourFilter.frequency);
      this.pourLfo.start(now);

      this.pourSource.connect(this.pourFilter);
      this.pourFilter.connect(this.pourGain);
      this.pourGain.connect(this.ctx.destination);

      this.pourSource.start(now);
    } catch {
      // Ignore audio error
    }
  }

  updateWaterPour(fillLevel = 0) {
    if (this.isMuted || !this.ctx || !this.pourFilter) return;
    try {
      const clamped = Math.max(0, Math.min(1, fillLevel));
      // Pitch rises smoothly from 220Hz (empty) to 780Hz (full)
      const targetFreq = 220 + clamped * 560;
      this.pourFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.06);
    } catch {
      // Ignore audio error
    }
  }

  stopWaterPour() {
    if (!this.ctx || !this.pourSource) return;
    try {
      const now = this.ctx.currentTime;
      if (this.pourGain) {
        this.pourGain.gain.linearRampToValueAtTime(0.001, now + 0.20);
      }
      const s = this.pourSource;
      const l = this.pourLfo;
      this.pourSource = null;
      this.pourFilter = null;
      this.pourGain = null;
      this.pourLfo = null;
      setTimeout(() => {
        try {
          s.stop();
          s.disconnect();
          if (l) {
            l.stop();
            l.disconnect();
          }
        } catch {}
      }, 250);
    } catch {
      this.pourSource = null;
    }
  }
}

export const soundManager = new WebAudioSFXController();
