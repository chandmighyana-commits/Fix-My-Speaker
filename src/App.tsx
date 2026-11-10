import React, { useState } from 'react';
import { 
  Play, 
  Volume2, 
  Activity, 
  Wrench, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Headphones, 
  Sliders, 
  Radio, 
  Zap,
  Sparkles,
  ExternalLink
} from 'lucide-react';

import { TopBar } from './components/TopBar';
import { SpeakerTroubleshooter } from './components/SpeakerTroubleshooter';
import { AudioDiagnosticLab } from './components/AudioDiagnosticLab';
import { ServicesPricing } from './components/ServicesPricing';
import { ProjectBriefGenerator } from './components/ProjectBriefGenerator';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { audioEngine } from './utils/audioEngine';

export default function App() {
  const [activeView, setActiveView] = useState<string>('troubleshooter');
  const [quickTestPlaying, setQuickTestPlaying] = useState<boolean>(false);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('');

  const handleRunQuickTest = () => {
    if (quickTestPlaying) {
      audioEngine.stopAll();
      setQuickTestPlaying(false);
    } else {
      setQuickTestPlaying(true);
      audioEngine.playTone(440, 0, 0.25, 'sine');
      setTimeout(() => {
        audioEngine.stopAll();
        setQuickTestPlaying(false);
      }, 3000);
    }
  };

  const scrollToTroubleshooter = () => {
    setActiveView('troubleshooter');
    const el = document.getElementById('troubleshooter');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSoundLab = () => {
    setActiveView('sound-lab');
    const el = document.getElementById('sound-lab');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = (serviceName?: string) => {
    if (serviceName) {
      setSelectedServiceForContact(serviceName);
    }
    setActiveView('contact');
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Bar with 3-Zone Contract */}
      <TopBar 
        onRunTest={scrollToTroubleshooter} 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />

      {/* Main Body Content */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-neutral-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Headline, Value Proposition, Action Block */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-500">
                  <span className="font-semibold tracking-wider uppercase">Audio Hardware Diagnostics</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-neutral-400">20Hz – 20kHz Precision</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
                  Restore Your Sound in Minutes
                </h1>

                <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl">
                  Silent or quiet speakers? Execute our laboratory-proven 3-step isolation protocol,
                  generate real-time test frequencies, and isolate hardware defects without leaving your browser.
                </p>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={scrollToTroubleshooter}
                    className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                  >
                    Start Diagnostic Protocol <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleRunQuickTest}
                    className={`px-5 py-3.5 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                      quickTestPlaying
                        ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                        : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200'
                    }`}
                  >
                    <Volume2 className="w-4 h-4 text-amber-500" />
                    {quickTestPlaying ? 'Playing 3s Test Tone...' : 'Quick 3-Second Sound Check'}
                  </button>
                </div>

                {/* Trust kicker */}
                <div className="pt-2 flex items-center gap-4 text-xs text-neutral-400 font-mono">
                  <span>No downloads required</span>
                  <span>·</span>
                  <span>Pure Web Audio API</span>
                  <span>·</span>
                  <span>Mobile &amp; Desktop Compatible</span>
                </div>
              </div>

              {/* Right Column: High-Impact Visual Carrier */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
                  <img
                    src="/src/assets/images/hero_audio_speaker_1794295032891.jpg"
                    alt="High-end acoustic loudspeaker driver cone with titanium ring"
                    className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent"></div>

                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-neutral-950/80 backdrop-blur border border-neutral-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-white font-bold block">Transducer Frequency Test</span>
                      <span className="text-neutral-400 text-[11px]">Ready for frequency response analysis</span>
                    </div>
                    <button
                      onClick={scrollToSoundLab}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                    >
                      Open Lab
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Column KPI strip below hero */}
            <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur">
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums">4,200+</div>
                <div className="text-xs text-neutral-400 mt-1">Speakers Diagnosed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">94.8%</div>
                <div className="text-xs text-neutral-400 mt-1">First-Session Resolution</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums">&lt; 6 Min</div>
                <div className="text-xs text-neutral-400 mt-1">Average Diagnostic Time</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">20Hz–20kHz</div>
                <div className="text-xs text-neutral-400 mt-1">Web Audio Accuracy</div>
              </div>
            </div>
          </div>
        </section>

        {/* PART 1: SPEAKER TROUBLESHOOTING GUIDE & WIZARD */}
        <section className="border-b border-neutral-800 bg-neutral-950">
          <SpeakerTroubleshooter onNavigateToContact={() => scrollToContact('Hardware Diagnostic Intake')} />
        </section>

        {/* INTERACTIVE WEB AUDIO DIAGNOSTIC LAB */}
        <section className="border-b border-neutral-800 bg-neutral-900/30">
          <AudioDiagnosticLab />
        </section>

        {/* PART 2: CORE SERVICES & PRICING */}
        <section className="border-b border-neutral-800 bg-neutral-950">
          <ServicesPricing onSelectService={(svc) => scrollToContact(svc)} />
        </section>

        {/* PART 2: WEBSITE PROJECT BRIEF GENERATOR & ARCHITECTURE */}
        <section className="border-b border-neutral-800 bg-neutral-900/30">
          <ProjectBriefGenerator />
        </section>

        {/* ABOUT SECTION & SCIENTIFIC CITATIONS */}
        <section className="border-b border-neutral-800 bg-neutral-950">
          <AboutSection />
        </section>

        {/* TESTIMONIALS & SOCIAL PROOF */}
        <section className="border-b border-neutral-800 bg-neutral-900/30">
          <TestimonialsSection />
        </section>

        {/* CONTACT PAGE & BENCH BOOKING FORM */}
        <section className="bg-neutral-950">
          <ContactSection initialService={selectedServiceForContact} />
        </section>
      </main>

      {/* Deep Dark Footer */}
      <Footer />
    </div>
  );
}
