import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Play, 
  Square, 
  RotateCw, 
  Activity, 
  Sliders, 
  Radio, 
  Sparkles, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { AudioVisualizer } from './AudioVisualizer';

export const AudioDiagnosticLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tone' | 'stereo' | 'sweep' | 'noise'>('tone');
  const [frequency, setFrequency] = useState<number>(440);
  const [volume, setVolume] = useState<number>(30); // default 30% safe listening
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [pan, setPan] = useState<number>(0); // -1 = Left, 0 = Center, +1 = Right
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Stereo channel state
  const [stereoActiveChannel, setStereoActiveChannel] = useState<'left' | 'right' | 'idle'>('idle');

  // Sweep state
  const [sweepProgressFreq, setSweepProgressFreq] = useState<number>(20);
  const [isSweeping, setIsSweeping] = useState<boolean>(false);

  // Noise state
  const [noiseType, setNoiseType] = useState<'white' | 'pink'>('pink');
  const [isNoisePlaying, setIsNoisePlaying] = useState<boolean>(false);

  // Stop sound on unmount or tab change
  useEffect(() => {
    return () => {
      audioEngine.stopAll();
    };
  }, []);

  const handleTabChange = (tab: 'tone' | 'stereo' | 'sweep' | 'noise') => {
    audioEngine.stopAll();
    setIsPlaying(false);
    setIsSweeping(false);
    setIsNoisePlaying(false);
    setStereoActiveChannel('idle');
    setActiveTab(tab);
  };

  // Continuous Tone Toggle
  const togglePlayTone = () => {
    if (isPlaying) {
      audioEngine.stopAll();
      setIsPlaying(false);
    } else {
      audioEngine.playTone(frequency, pan, volume / 100, waveType);
      setIsPlaying(true);
    }
  };

  // Frequency change handler
  const handleFrequencyChange = (newFreq: number) => {
    setFrequency(newFreq);
    if (isPlaying) {
      audioEngine.updateFrequency(newFreq);
    }
  };

  // Volume change handler
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isPlaying) {
      audioEngine.updateVolume(newVol / 100);
    }
  };

  // Pan change handler
  const handlePanChange = (newPan: number) => {
    setPan(newPan);
    if (isPlaying) {
      audioEngine.updatePan(newPan);
    }
  };

  // Stereo Burst Test
  const handleStartStereoCheck = () => {
    audioEngine.stopAll();
    setIsPlaying(false);
    audioEngine.playStereoCheck((channel) => {
      setStereoActiveChannel(channel);
    });
  };

  // Sweep Test
  const handleStartSweep = () => {
    audioEngine.stopAll();
    setIsPlaying(false);
    setIsSweeping(true);
    setSweepProgressFreq(20);

    audioEngine.playSweep(6, (currentFreq) => {
      setSweepProgressFreq(currentFreq);
      if (currentFreq >= 20000) {
        setIsSweeping(false);
      }
    });
  };

  // Noise Toggle
  const togglePlayNoise = () => {
    if (isNoisePlaying) {
      audioEngine.stopAll();
      setIsNoisePlaying(false);
    } else {
      audioEngine.playNoise(noiseType, volume / 100);
      setIsNoisePlaying(true);
    }
  };

  const frequencyPresets = [
    { label: '50 Hz', value: 50, note: 'Sub-Bass' },
    { label: '100 Hz', value: 100, note: 'Mid-Bass' },
    { label: '250 Hz', value: 250, note: 'Warmth' },
    { label: '440 Hz', value: 440, note: 'A4 Pitch' },
    { label: '1 kHz', value: 1000, note: 'Mid Vocal' },
    { label: '4 kHz', value: 4000, note: 'Presence' },
    { label: '10 kHz', value: 10000, note: 'Tweeter' },
    { label: '15 kHz', value: 15000, note: 'Air / Top' },
  ];

  return (
    <div id="sound-lab" className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-10 text-left">
        <div className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-2">
          Diagnostic Suite · Web Audio API
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Audio Diagnostic & Frequency Lab
        </h2>
        <p className="text-base text-neutral-400 max-w-2xl">
          Direct hardware acoustic tests. Isolate left and right speaker channels, test individual
          frequency crossovers (20Hz–20kHz), and analyze physical speaker response in real time.
        </p>
      </div>

      {/* Real-time Oscilloscope / Visualizer */}
      <div className="mb-8">
        <AudioVisualizer isPlaying={isPlaying || isSweeping || isNoisePlaying || stereoActiveChannel !== 'idle'} />
      </div>

      {/* Tool Mode Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl">
        {[
          { key: 'tone', label: 'Tone Generator' },
          { key: 'stereo', label: 'L / R Stereo Balancer' },
          { key: 'sweep', label: '20Hz–20kHz Sweep' },
          { key: 'noise', label: 'Pink & White Noise' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key as 'tone' | 'stereo' | 'sweep' | 'noise')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Control Console */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-xl">
        {/* TONE GENERATOR */}
        {activeTab === 'tone' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Precision Tone & Pitch Generator</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Continuously sweep frequencies to detect buzz, distortion, or dead speaker drivers.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayTone}
                  className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    isPlaying
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                      : 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" /> Stop Generator
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Play Continuous Tone
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Frequency readout and slider */}
            <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-neutral-400">Target Frequency</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-bold text-amber-400 tabular-nums">
                    {frequency}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">Hz</span>
                </div>
              </div>

              <input
                type="range"
                min="20"
                max="20000"
                step="1"
                value={frequency}
                onChange={(e) => handleFrequencyChange(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />

              {/* Quick Presets */}
              <div className="pt-2">
                <span className="text-xs text-neutral-400 block mb-2 font-mono">Standard Acoustic Bands:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {frequencyPresets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handleFrequencyChange(preset.value)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        frequency === preset.value
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{preset.label}</span>
                      <span className="text-[10px] text-neutral-500 block truncate">{preset.note}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Waveform & Pan & Volume Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Waveform Selector */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-mono uppercase text-neutral-400 block mb-2">Waveform Profile</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['sine', 'triangle', 'square', 'sawtooth'] as OscillatorType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setWaveType(type);
                        if (isPlaying) {
                          audioEngine.playTone(frequency, pan, volume / 100, type);
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                        waveType === type
                          ? 'bg-amber-500 text-neutral-950 font-semibold'
                          : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stereo Panning */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-neutral-400">Balance (Pan)</span>
                  <span className="text-xs font-mono text-amber-400">
                    {pan === 0 ? 'Center' : pan < 0 ? `L ${Math.abs(Math.round(pan * 100))}%` : `R ${Math.round(pan * 100)}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.05"
                  value={pan}
                  onChange={(e) => handlePanChange(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-2">
                  <span>Left</span>
                  <button onClick={() => handlePanChange(0)} className="hover:text-amber-400">Center</button>
                  <span>Right</span>
                </div>
              </div>

              {/* Safe Volume */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-neutral-400">Output Gain</span>
                  <span className="text-xs font-mono text-amber-400 tabular-nums">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] text-neutral-500 block mt-2">
                  Safety limiter capped for ear protection.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEREO CHANNEL TESTER */}
        {activeTab === 'stereo' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-800">
              <h3 className="text-xl font-bold text-white">Left / Right Channel Balance & Isolation</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Verify that your left and right audio channels are wired correctly and firing independently without crosstalk.
              </p>
            </div>

            {/* Visual Speaker Enclosure Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* Left Channel Card */}
              <div
                className={`p-6 rounded-2xl border text-center transition-all ${
                  stereoActiveChannel === 'left'
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-neutral-800 bg-neutral-950'
                }`}
              >
                <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">
                  Channel 01
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">LEFT SPEAKER</h4>
                <div className="text-xs font-mono text-neutral-400 mb-6">440 Hz Reference Pitch</div>

                <div className="w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 border-neutral-800 bg-neutral-900 mb-4">
                  <div
                    className={`w-14 h-14 rounded-full transition-all duration-300 ${
                      stereoActiveChannel === 'left'
                        ? 'bg-amber-400 scale-110 shadow-md shadow-amber-400/50 animate-pulse'
                        : 'bg-neutral-800'
                    }`}
                  />
                </div>

                <button
                  onClick={() => audioEngine.playTone(440, -1, volume / 100, 'sine')}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
                >
                  Test Left Only
                </button>
              </div>

              {/* Right Channel Card */}
              <div
                className={`p-6 rounded-2xl border text-center transition-all ${
                  stereoActiveChannel === 'right'
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-neutral-800 bg-neutral-950'
                }`}
              >
                <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">
                  Channel 02
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">RIGHT SPEAKER</h4>
                <div className="text-xs font-mono text-neutral-400 mb-6">880 Hz High Pitch</div>

                <div className="w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 border-neutral-800 bg-neutral-900 mb-4">
                  <div
                    className={`w-14 h-14 rounded-full transition-all duration-300 ${
                      stereoActiveChannel === 'right'
                        ? 'bg-amber-400 scale-110 shadow-md shadow-amber-400/50 animate-pulse'
                        : 'bg-neutral-800'
                    }`}
                  />
                </div>

                <button
                  onClick={() => audioEngine.playTone(880, 1, volume / 100, 'sine')}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
                >
                  Test Right Only
                </button>
              </div>
            </div>

            {/* Sequence Runner */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-sm font-semibold text-white block">Automated Stereo Alternation Test</span>
                <span className="text-xs text-neutral-400">Plays Left Channel, pauses, then plays Right Channel.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartStereoCheck}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
                >
                  Run L / R Sequence Check
                </button>
                <button
                  onClick={() => {
                    audioEngine.stopAll();
                    setStereoActiveChannel('idle');
                  }}
                  className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300 transition-colors"
                >
                  Stop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 20HZ - 20KHZ SWEEP */}
        {activeTab === 'sweep' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-800">
              <h3 className="text-xl font-bold text-white">Full-Spectrum 20Hz–20,000Hz Frequency Sweep</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Logarithmically climbs through the entire human audible spectrum over 6 seconds. Listen closely for mechanical buzzes, cabinet rattles, or dead frequencies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-4">
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Active Frequency During Sweep
              </div>
              <div className="text-5xl font-mono font-bold text-amber-400 tabular-nums">
                {sweepProgressFreq} <span className="text-xl text-neutral-500">Hz</span>
              </div>

              {/* Acoustic Region Label */}
              <div className="text-xs text-neutral-300 font-medium">
                Current Range:{' '}
                {sweepProgressFreq < 60 && 'Sub-Bass (Physical cone movement)'}
                {sweepProgressFreq >= 60 && sweepProgressFreq < 250 && 'Bass / Woofer Range'}
                {sweepProgressFreq >= 250 && sweepProgressFreq < 2000 && 'Midrange Driver Range'}
                {sweepProgressFreq >= 2000 && sweepProgressFreq < 6000 && 'Upper Midrange / Crossover'}
                {sweepProgressFreq >= 6000 && sweepProgressFreq < 12000 && 'Tweeter / High Frequency'}
                {sweepProgressFreq >= 12000 && 'Super Tweeter / Ultra-High Air'}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-100"
                  style={{
                    width: `${Math.min(
                      100,
                      (Math.log(sweepProgressFreq / 20) / Math.log(20000 / 20)) * 100
                    )}%`,
                  }}
                />
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleStartSweep}
                  disabled={isSweeping}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    isSweeping
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <Activity className="w-4 h-4" /> {isSweeping ? 'Sweeping Audio Spectrum...' : 'Execute 6s Full Sweep'}
                </button>
                {isSweeping && (
                  <button
                    onClick={() => {
                      audioEngine.stopAll();
                      setIsSweeping(false);
                    }}
                    className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200"
                  >
                    Abort Sweep
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* NOISE GENERATOR */}
        {activeTab === 'noise' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-800">
              <h3 className="text-xl font-bold text-white">Pink & White Noise Conditioning</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Used by acoustic laboratories to check driver linearity, break in new speaker surrounds, and verify room sound reflections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setNoiseType('pink');
                  if (isNoisePlaying) audioEngine.playNoise('pink', volume / 100);
                }}
                className={`p-5 rounded-xl border text-left transition-all ${
                  noiseType === 'pink'
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-amber-400">1/f Spectrum</span>
                  <span className="text-xs text-neutral-500">Industry Standard</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Pink Noise</h4>
                <p className="text-xs text-neutral-400">
                  Equal energy per octave. Sounds warmer and matches human ear frequency perception. Safest for driver stress testing.
                </p>
              </button>

              <button
                onClick={() => {
                  setNoiseType('white');
                  if (isNoisePlaying) audioEngine.playNoise('white', volume / 100);
                }}
                className={`p-5 rounded-xl border text-left transition-all ${
                  noiseType === 'white'
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-amber-400">Flat Spectrum</span>
                  <span className="text-xs text-neutral-500">Uniform Energy</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">White Noise</h4>
                <p className="text-xs text-neutral-400">
                  Equal energy across all raw frequencies. Hissing profile. Best for testing high-frequency tweeters and phase cancellation.
                </p>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white block">
                  Active Profile: {noiseType === 'pink' ? 'Pink Noise (Acoustic Benchmark)' : 'White Noise (Full Spectrum)'}
                </span>
                <span className="text-xs text-neutral-400">Safe level playback at {volume}% gain.</span>
              </div>

              <button
                onClick={togglePlayNoise}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  isNoisePlaying
                    ? 'bg-rose-500 text-white'
                    : 'bg-amber-500 text-neutral-950 hover:bg-amber-400'
                }`}
              >
                {isNoisePlaying ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" /> Stop Noise
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Start {noiseType === 'pink' ? 'Pink' : 'White'} Noise
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
