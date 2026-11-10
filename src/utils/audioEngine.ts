/**
 * Web Audio API Diagnostic Engine
 * Pure browser-based sound synthesis, frequency sweeping, stereo panning,
 * and noise generation for testing physical loudspeakers and headphones.
 */

class AudioDiagnosticEngine {
  private ctx: AudioContext | null = null;
  private activeOscillator: OscillatorNode | null = null;
  private activeGainNode: GainNode | null = null;
  private activePannerNode: StereoPannerNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  public analyserNode: AnalyserNode | null = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getContext(): AudioContext {
    return this.initContext();
  }

  public stopAll() {
    if (this.activeOscillator) {
      try {
        this.activeOscillator.stop();
        this.activeOscillator.disconnect();
      } catch {
        // ignore already stopped
      }
      this.activeOscillator = null;
    }

    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {
        // ignore already stopped
      }
      this.noiseNode = null;
    }
  }

  /**
   * Play continuous tone with frequency, pan (-1=left, 0=center, +1=right), and waveform
   */
  public playTone(frequency: number, pan: number = 0, volume: number = 0.2, waveType: OscillatorType = 'sine') {
    const ctx = this.initContext();
    this.stopAll();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    const analyser = ctx.createAnalyser();

    analyser.fftSize = 512;
    this.analyserNode = analyser;

    osc.type = waveType;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Fade-in to avoid speaker pop
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, Math.min(1, volume)), ctx.currentTime + 0.05);

    panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), ctx.currentTime);

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(analyser);
    analyser.connect(ctx.destination);

    osc.start();

    this.activeOscillator = osc;
    this.activeGainNode = gain;
    this.activePannerNode = panner;
  }

  /**
   * Update active tone frequency on the fly
   */
  public updateFrequency(frequency: number) {
    if (this.activeOscillator && this.ctx) {
      this.activeOscillator.frequency.cancelScheduledValues(this.ctx.currentTime);
      this.activeOscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    }
  }

  /**
   * Update active volume on the fly
   */
  public updateVolume(volume: number) {
    if (this.activeGainNode && this.ctx) {
      this.activeGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.activeGainNode.gain.setValueAtTime(Math.max(0.001, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  /**
   * Update active pan on the fly (-1=Left, 0=Center, 1=Right)
   */
  public updatePan(pan: number) {
    if (this.activePannerNode && this.ctx) {
      this.activePannerNode.pan.cancelScheduledValues(this.ctx.currentTime);
      this.activePannerNode.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), this.ctx.currentTime);
    }
  }

  /**
   * Play stereo check burst (Left channel, then pause, then Right channel)
   */
  public playStereoCheck(onChannelChange: (channel: 'left' | 'right' | 'idle') => void) {
    const ctx = this.initContext();
    this.stopAll();

    const playBurst = (panValue: number, label: 'left' | 'right', startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner();

      osc.type = 'sine';
      // Use 440Hz for Left, 880Hz for Right to give audible pitch difference as well
      osc.frequency.setValueAtTime(label === 'left' ? 440 : 880, startTime);
      panner.pan.setValueAtTime(panValue, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.05);
      gain.gain.setValueAtTime(0.25, startTime + duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime + 0.05;
    const burstDuration = 1.2;
    const gap = 0.4;

    onChannelChange('left');
    playBurst(-1, 'left', now, burstDuration);

    setTimeout(() => {
      onChannelChange('right');
    }, (burstDuration + gap) * 1000);

    playBurst(1, 'right', now + burstDuration + gap, burstDuration);

    setTimeout(() => {
      onChannelChange('idle');
    }, (burstDuration * 2 + gap + 0.1) * 1000);
  }

  /**
   * Play high-fidelity chime sound to verify Bluetooth or volume connectivity
   */
  public playConnectionChime() {
    const ctx = this.initContext();
    this.stopAll();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime + 0.05;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.45);
    });
  }

  /**
   * Play dynamic frequency sweep (20Hz to 20,000Hz over specified duration)
   */
  public playSweep(durationSeconds: number = 6, onProgress?: (freq: number) => void) {
    const ctx = this.initContext();
    this.stopAll();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const analyser = ctx.createAnalyser();
    this.analyserNode = analyser;

    osc.type = 'sine';
    const now = ctx.currentTime + 0.05;
    const end = now + durationSeconds;

    osc.frequency.setValueAtTime(20, now);
    osc.frequency.exponentialRampToValueAtTime(20000, end);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.1);
    gain.gain.setValueAtTime(0.2, end - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, end);

    osc.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    osc.start(now);
    osc.stop(end);

    this.activeOscillator = osc;
    this.activeGainNode = gain;

    if (onProgress) {
      const interval = 50;
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= durationSeconds) {
          clearInterval(timer);
          onProgress(20000);
        } else {
          // Exponential interpolation between 20Hz and 20000Hz
          const currentFreq = 20 * Math.pow(20000 / 20, elapsed / durationSeconds);
          onProgress(Math.round(currentFreq));
        }
      }, interval);
    }
  }

  /**
   * Play White or Pink noise for exercising speaker cones and crossover circuits
   */
  public playNoise(type: 'white' | 'pink', volume: number = 0.15) {
    const ctx = this.initContext();
    this.stopAll();

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else {
      // Paul Kellet's filtered pink noise algorithm
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.1);

    const analyser = ctx.createAnalyser();
    this.analyserNode = analyser;

    noise.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    noise.start();
    this.noiseNode = noise;
    this.activeGainNode = gain;
  }
}

export const audioEngine = new AudioDiagnosticEngine();
