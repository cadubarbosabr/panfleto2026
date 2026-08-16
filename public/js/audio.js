// ==========================================================================
// URNA ELETRÔNICA SOUND SYNTHESIZER (Web Audio API)
// Authentic sound effects for Keypad, Error, and the iconic "PILILILI" (FIM)
// ==========================================================================

class UrnaAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Key press beep
  playKey() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1050, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Corrige / Clear beep
  playCorrige() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.setValueAtTime(450, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Error buzz
  playError() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Iconic TSE "PILILILI" Confirma / FIM sound
  playConfirmaFim() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Stage 1: Tone 1 (approx 1500Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1400, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.setValueAtTime(0.2, now + 0.15);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Stage 2: Fast triplet vibrato ("Pililili")
      const freqs = [1850, 2100, 2400, 2800];
      let offset = 0.22;
      for (let i = 0; i < 6; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const f = (i % 2 === 0) ? 2200 : 2500;
        osc.frequency.setValueAtTime(f, now + offset);
        gain.gain.setValueAtTime(0.25, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
        offset += 0.07;
      }

      // Final long sustained high note
      const finalOsc = this.ctx.createOscillator();
      const finalGain = this.ctx.createGain();
      finalOsc.type = 'sine';
      finalOsc.frequency.setValueAtTime(2600, now + offset);
      finalGain.gain.setValueAtTime(0.3, now + offset);
      finalGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.9);
      finalOsc.connect(finalGain);
      finalGain.connect(this.ctx.destination);
      finalOsc.start(now + offset);
      finalOsc.stop(now + offset + 0.9);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }
}

export const urnaAudio = new UrnaAudio();
