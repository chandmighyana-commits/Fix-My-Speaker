import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  Pause, 
  Radio, 
  Cable, 
  Smartphone, 
  Laptop, 
  Sliders, 
  FileText, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface StepVerification {
  id: number;
  completed: boolean;
  resolved: boolean | null; // true = fixed issue, false = issue persists, null = unverified
  notes: string;
}

export const SpeakerTroubleshooter: React.FC<{ onNavigateToContact?: () => void }> = ({ onNavigateToContact }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [connectionType, setConnectionType] = useState<'wired' | 'bluetooth'>('bluetooth');

  // Step 1 interactive slider state
  const [testVolume, setTestVolume] = useState<number>(75);
  const [isTestSoundPlaying, setIsTestSoundPlaying] = useState<boolean>(false);

  // Timers for each step (Step 1: 60s, Step 2: 120s, Step 3: 180s)
  const [timers, setTimers] = useState<Record<number, number>>({
    1: 60,
    2: 120,
    3: 180,
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Verification results
  const [verifications, setVerifications] = useState<Record<number, StepVerification>>({
    1: { id: 1, completed: false, resolved: null, notes: '' },
    2: { id: 2, completed: false, resolved: null, notes: '' },
    3: { id: 3, completed: false, resolved: null, notes: '' },
  });

  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Active step timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timers[activeStep] > 0) {
      interval = setInterval(() => {
        setTimers((prev) => ({
          ...prev,
          [activeStep]: Math.max(0, prev[activeStep] - 1),
        }));
      }, 1000);
    } else if (timers[activeStep] === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, activeStep, timers]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = (stepId: number) => {
    setIsTimerRunning(false);
    const defaults: Record<number, number> = { 1: 60, 2: 120, 3: 180 };
    setTimers((prev) => ({ ...prev, [stepId]: defaults[stepId] }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Play test audio for Step 1
  const handlePlayTestSound = () => {
    if (isTestSoundPlaying) {
      audioEngine.stopAll();
      setIsTestSoundPlaying(false);
    } else {
      setIsTestSoundPlaying(true);
      // Play 440Hz warm reference tone
      audioEngine.playTone(440, 0, testVolume / 100, 'sine');
    }
  };

  // Update volume live
  const handleVolumeChange = (newVol: number) => {
    setTestVolume(newVol);
    if (isTestSoundPlaying) {
      audioEngine.updateVolume(newVol / 100);
    }
  };

  // Play connection chime for Step 2
  const handlePlayChime = () => {
    audioEngine.playConnectionChime();
  };

  const updateVerification = (stepId: number, resolved: boolean) => {
    setVerifications((prev) => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        completed: true,
        resolved: resolved,
      },
    }));
  };

  // Generate diagnostic conclusion
  const getDiagnosticVerdict = () => {
    const step1 = verifications[1];
    const step2 = verifications[2];
    const step3 = verifications[3];

    if (step1.resolved === true) {
      return {
        status: 'RESOLVED',
        badgeColor: 'text-emerald-400 border-emerald-800 bg-emerald-950/30',
        title: 'Software Audio Routing or Mute Resolved',
        desc: 'Your speaker hardware is operational. The silence was caused by system volume attenuation, an inactive audio endpoint, or an operating system mute flag.',
        recommendedAction: 'Keep audio levels above 20% and pin your primary sound card in system preferences.',
      };
    }
    if (step2.resolved === true) {
      return {
        status: 'RESOLVED',
        badgeColor: 'text-emerald-400 border-emerald-800 bg-emerald-950/30',
        title: 'Connection Handshake Re-established',
        desc: 'Unplugging the physical lead or cycling Bluetooth pairing cleared the driver handshake lock. Signals are transferring cleanly to the speaker amplifier.',
        recommendedAction: 'Check cable strain relief or delete obsolete Bluetooth device profiles to prevent drops.',
      };
    }
    if (step3.resolved === true) {
      return {
        status: 'HOST_FAULT',
        badgeColor: 'text-amber-400 border-amber-800 bg-amber-950/30',
        title: 'Host Device Port or OS Driver Defect',
        desc: 'The speaker works properly with your secondary device. This confirms your primary computer/phone audio jack, USB driver, or internal sound card has a software/hardware conflict.',
        recommendedAction: 'Update host audio drivers, reinstall realtek/USB sound chipset, or use an external USB-C DAC dongle.',
      };
    }
    if (step3.resolved === false) {
      return {
        status: 'HARDWARE_FAULT',
        badgeColor: 'text-rose-400 border-rose-800 bg-rose-950/30',
        title: 'Speaker Internal Hardware or Power Defect',
        desc: 'Speaker failed across all volume levels, re-seating protocols, and secondary test hardware. Probable cause: blown voice coil, damaged internal amplifier, dead lithium battery, or fractured input connector.',
        recommendedAction: 'Hardware repair or bench diagnosis required. Our laboratory provides component-level transducer rebuilds.',
      };
    }

    return {
      status: 'IN_PROGRESS',
      badgeColor: 'text-neutral-400 border-neutral-800 bg-neutral-900',
      title: 'Diagnostic Protocol Incomplete',
      desc: 'Complete all 3 verification steps to receive an authoritative hardware vs software verdict.',
      recommendedAction: 'Select verification states for Steps 1 through 3 above.',
    };
  };

  const verdict = getDiagnosticVerdict();

  const handleCopyReport = () => {
    const reportText = `[AUDIOFIX PRO SPEAKER DIAGNOSTIC REPORT]
Date: ${new Date().toLocaleDateString()}
Protocol: 3-Step Hardware Isolation
Connection Type: ${connectionType.toUpperCase()}

STEP 1: Volume & Mute Check (1 Min)
- Slider Tested: ${testVolume}%
- Status: ${verifications[1].resolved === null ? 'Not verified' : verifications[1].resolved ? 'Resolved Sound' : 'Still No Sound'}

STEP 2: Inspect & Reseat Connections (2 Min)
- Type: ${connectionType === 'wired' ? 'Wired (AUX/USB/RCA)' : 'Wireless (Bluetooth Re-pair)'}
- Status: ${verifications[2].resolved === null ? 'Not verified' : verifications[2].resolved ? 'Resolved Sound' : 'Still No Sound'}

STEP 3: Secondary Device & Cable Isolation (3 Min)
- Status: ${verifications[3].resolved === null ? 'Not verified' : verifications[3].resolved ? 'Sound Played on Secondary Device' : 'Failed on Secondary Device'}

DIAGNOSTIC VERDICT: ${verdict.title}
Analysis: ${verdict.desc}
Recommendation: ${verdict.recommendedAction}
`;
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div id="troubleshooter" className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      {/* Section Header */}
      <div className="mb-10 text-left">
        <div className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-2">
          Diagnostic Protocol · Part 1 Guide
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          How to Fix Your Speaker
        </h2>
        <p className="text-base text-neutral-400 max-w-2xl">
          If your speaker is not producing sound or is extremely quiet, execute these three
          timed isolation steps to eliminate software bugs and identify physical hardware faults.
        </p>
      </div>

      {/* Step Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {[
          { id: 1, title: '1. Volume & Mute Settings', time: '1 min', icon: Sliders },
          { id: 2, title: '2. Reseat Audio Connections', time: '2 min', icon: Cable },
          { id: 3, title: '3. Alternate Device Test', time: '3 min', icon: Smartphone },
        ].map((step) => {
          const Icon = step.icon;
          const isCurrent = activeStep === step.id;
          const v = verifications[step.id];

          return (
            <button
              key={step.id}
              onClick={() => {
                setActiveStep(step.id);
                setIsTimerRunning(false);
              }}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                isCurrent
                  ? 'bg-neutral-900 border-amber-500/80 shadow-md shadow-amber-500/10'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-neutral-400">{step.time}</span>
                {v.resolved === true && (
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Fixed
                  </span>
                )}
                {v.resolved === false && (
                  <span className="text-xs font-medium text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Failed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg ${
                    isCurrent ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white">{step.title}</h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step Execution Panel */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur mb-10 shadow-xl">
        {/* Step 1 Content */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div>
                <span className="text-xs font-mono text-amber-500 tracking-wider">STEP 01 OF 03</span>
                <h3 className="text-2xl font-bold text-white mt-1">Check Volume Levels and Mute Settings</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  Check both your device volume (phone, laptop, PC) and the physical knob on the speaker itself.
                </p>
              </div>

              {/* Countdown Timer Widget */}
              <div className="flex items-center gap-3 bg-neutral-950 px-4 py-2.5 rounded-xl border border-neutral-800 self-start sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Target Time</span>
                  <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                    {formatTime(timers[1])}
                  </span>
                </div>
                <button
                  onClick={toggleTimer}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                  title={isTimerRunning ? 'Pause Timer' : 'Start 1 Min Timer'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => resetTimer(1)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Verification criteria callout */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-sm">
              <span className="font-semibold text-amber-400">Verification Requirement: </span>
              <span className="text-neutral-300">
                Audio slider moves up freely and is not set to mute or zero. Ensure physical potentiometer or volume dial is rotated past the 50% mark.
              </span>
            </div>

            {/* Interactive Volume & Frequency Test Bench */}
            <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-300 font-medium flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-500" /> Web Audio Tone & Output Verification Slider
                </span>
                <span className="font-mono text-amber-400 tabular-nums">{testVolume}%</span>
              </div>

              <div className="flex items-center gap-4">
                <VolumeX className="w-4 h-4 text-neutral-500 shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={testVolume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <Volume2 className="w-4 h-4 text-amber-500 shrink-0" />
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handlePlayTestSound}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    isTestSoundPlaying
                      ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/20'
                      : 'bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {isTestSoundPlaying ? (
                    <>
                      <Pause className="w-4 h-4" /> Stop Reference Tone (440Hz)
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Play Audio Output Test Tone
                    </>
                  )}
                </button>

                <div className="text-xs text-neutral-400">
                  Plays reference A4 440Hz standard pitch. If heard clearly, your audio output driver is functional.
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/50">
                <span className="font-medium text-white block mb-1">Device System Audio</span>
                <p className="text-xs text-neutral-400">
                  Open Windows Sound Settings / Mac Control Center. Verify output device is not redirected to a virtual driver or monitor HDMI.
                </p>
              </div>
              <div className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/50">
                <span className="font-medium text-white block mb-1">Physical Speaker Knobs</span>
                <p className="text-xs text-neutral-400">
                  Turn the physical master gain knob clockwise. If powered by external AC or USB, check the power LED indicator.
                </p>
              </div>
            </div>

            {/* User Result Recording */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm font-medium text-neutral-300">
                Did adjusting volume/mute restore your audio?
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateVerification(1, true)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    verifications[1].resolved === true
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 hover:bg-emerald-950 hover:text-emerald-400 text-neutral-300'
                  }`}
                >
                  Yes, Audio Restored
                </button>
                <button
                  onClick={() => {
                    updateVerification(1, false);
                    setActiveStep(2);
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                    verifications[1].resolved === false
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-neutral-800 hover:bg-rose-950 hover:text-rose-400 text-neutral-300'
                  }`}
                >
                  Still Silent (Next Step) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 Content */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div>
                <span className="text-xs font-mono text-amber-500 tracking-wider">STEP 02 OF 03</span>
                <h3 className="text-2xl font-bold text-white mt-1">Inspect and Reseat Audio Connections</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  Disconnect and reconnect cables firmly, or power cycle and re-pair Bluetooth.
                </p>
              </div>

              {/* Countdown Timer Widget */}
              <div className="flex items-center gap-3 bg-neutral-950 px-4 py-2.5 rounded-xl border border-neutral-800 self-start sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Target Time</span>
                  <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                    {formatTime(timers[2])}
                  </span>
                </div>
                <button
                  onClick={toggleTimer}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                  title={isTimerRunning ? 'Pause Timer' : 'Start 2 Min Timer'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => resetTimer(2)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Connection mode selector */}
            <div className="flex items-center gap-2 p-1.5 bg-neutral-950 rounded-xl border border-neutral-800 w-fit">
              <button
                onClick={() => setConnectionType('bluetooth')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  connectionType === 'bluetooth'
                    ? 'bg-neutral-800 text-amber-400 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" /> Bluetooth Wireless
              </button>
              <button
                onClick={() => setConnectionType('wired')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  connectionType === 'wired'
                    ? 'bg-neutral-800 text-amber-400 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Cable className="w-3.5 h-3.5" /> Wired (AUX / USB / RCA)
              </button>
            </div>

            {/* Protocol description */}
            {connectionType === 'bluetooth' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-sm">
                  <span className="font-semibold text-amber-400">Bluetooth Verification: </span>
                  <span className="text-neutral-300">
                    Disconnect speaker in OS Bluetooth settings. Turn speaker off, wait 5 seconds, turn back on. Put into pairing mode and re-pair. Look for "Connected Audio" status.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-amber-400 font-mono block mb-1">01. FORGET DEVICE</span>
                    <p className="text-neutral-400">Remove speaker from Bluetooth list to clear corrupted cache.</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-amber-400 font-mono block mb-1">02. REBOOT STACK</span>
                    <p className="text-neutral-400">Toggle phone/PC Bluetooth adapter toggle off and on.</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-amber-400 font-mono block mb-1">03. RE-PAIR & CHIME</span>
                    <p className="text-neutral-400">Wait for chime tone indicating connection handshake.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-sm">
                  <span className="font-semibold text-amber-400">Wired Verification: </span>
                  <span className="text-neutral-300">
                    Unplug 3.5mm AUX, USB cable, or RCA jacks completely. Inspect gold/silver plating for oxidation or lint. Re-seat firmly with an audible click into the green/headphone output port.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-amber-400 font-mono block mb-1">01. PORT VERIFICATION</span>
                    <p className="text-neutral-400">Ensure 3.5mm plug is in Audio Out (Green), NOT Mic In (Pink).</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-amber-400 font-mono block mb-1">02. MECHANICAL SEAT</span>
                    <p className="text-neutral-400">Ensure jack is pushed completely into socket with no exposed barrel.</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-amber-400 font-mono block mb-1">03. CABLE FLEX TEST</span>
                    <p className="text-neutral-400">Gently wiggle strain relief near ends to detect broken internal copper.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Test Chime Trigger */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white block">Connection Handshake Chime Test</span>
                <span className="text-xs text-neutral-400">Play standard 4-note ascending chime sequence</span>
              </div>
              <button
                onClick={handlePlayChime}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Play Chime
              </button>
            </div>

            {/* Step 2 Result */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm font-medium text-neutral-300">
                Did re-seating or re-pairing restore audio?
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateVerification(2, true)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    verifications[2].resolved === true
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 hover:bg-emerald-950 hover:text-emerald-400 text-neutral-300'
                  }`}
                >
                  Yes, Connection Restored
                </button>
                <button
                  onClick={() => {
                    updateVerification(2, false);
                    setActiveStep(3);
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                    verifications[2].resolved === false
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-neutral-800 hover:bg-rose-950 hover:text-rose-400 text-neutral-300'
                  }`}
                >
                  Still Silent (Next Step) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 Content */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div>
                <span className="text-xs font-mono text-amber-500 tracking-wider">STEP 03 OF 03</span>
                <h3 className="text-2xl font-bold text-white mt-1">Test with a Different Device or Cable</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  Connect speaker to a secondary phone or laptop, or swap the audio cable to isolate the culprit.
                </p>
              </div>

              {/* Countdown Timer Widget */}
              <div className="flex items-center gap-3 bg-neutral-950 px-4 py-2.5 rounded-xl border border-neutral-800 self-start sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Target Time</span>
                  <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                    {formatTime(timers[3])}
                  </span>
                </div>
                <button
                  onClick={toggleTimer}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                  title={isTimerRunning ? 'Pause Timer' : 'Start 3 Min Timer'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => resetTimer(3)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Verification requirement */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-sm">
              <span className="font-semibold text-amber-400">Verification Requirement: </span>
              <span className="text-neutral-300">
                Sound plays successfully when connected to a secondary device. This immediately separates host machine operating system issues from internal speaker driver failure.
              </span>
            </div>

            {/* Isolation Matrix Grid */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <h4 className="text-xs font-mono uppercase text-neutral-400 mb-3">
                Hardware Isolation Logic Table
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/60">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                    <Laptop className="w-4 h-4" /> Scenario A: Works on Phone/Laptop #2
                  </div>
                  <p className="text-neutral-300">
                    <strong>Verdict: Speaker hardware is healthy.</strong> The issue lies in your primary computer&apos;s audio drivers, DAC, or 3.5mm physical port.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/60">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold mb-1">
                    <AlertTriangle className="w-4 h-4" /> Scenario B: Fails on Phone/Laptop #2
                  </div>
                  <p className="text-neutral-300">
                    <strong>Verdict: Speaker hardware failure.</strong> Internal amplifier blown, voice coil burnt, battery drained, or speaker cone torn.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 Result */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm font-medium text-neutral-300">
                Did the speaker play sound on your secondary device?
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateVerification(3, true)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    verifications[3].resolved === true
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 hover:bg-emerald-950 hover:text-emerald-400 text-neutral-300'
                  }`}
                >
                  Yes, Played on 2nd Device
                </button>
                <button
                  onClick={() => updateVerification(3, false)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    verifications[3].resolved === false
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-neutral-800 hover:bg-rose-950 hover:text-rose-400 text-neutral-300'
                  }`}
                >
                  No, Silent on Both Devices
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Authoritative Diagnostic Summary Card */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-1 text-xs font-mono font-semibold rounded border ${verdict.badgeColor}`}>
                {verdict.status}
              </span>
              <span className="text-xs text-neutral-400">Lab Diagnostic Assessment</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{verdict.title}</h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              {copiedReport ? 'Report Copied!' : 'Copy Diagnostic Log'}
            </button>
            {onNavigateToContact && (
              <button
                onClick={onNavigateToContact}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-bold text-neutral-950 transition-colors whitespace-nowrap"
              >
                Book Repair Diagnosis
              </button>
            )}
          </div>
        </div>

        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
              Root Cause Analysis
            </h4>
            <p className="text-neutral-300 leading-relaxed">{verdict.desc}</p>
          </div>
          <div>
            <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
              Engineering Recommendation
            </h4>
            <p className="text-neutral-300 leading-relaxed">{verdict.recommendedAction}</p>
          </div>
        </div>

        {/* Verification Checkpoints Strip */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-wrap items-center gap-4 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${verifications[1].completed ? 'bg-emerald-500' : 'bg-neutral-600'}`}></span>
            <span>Step 1: Vol & Mute</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${verifications[2].completed ? 'bg-emerald-500' : 'bg-neutral-600'}`}></span>
            <span>Step 2: Reseat Cable/BT</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${verifications[3].completed ? 'bg-emerald-500' : 'bg-neutral-600'}`}></span>
            <span>Step 3: Device Isolation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
