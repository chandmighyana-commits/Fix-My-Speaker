import React from 'react';
import { Shield, Award, CheckCircle, ExternalLink, Cpu, Sliders } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div id="about" className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6">
      {/* Editorial Lead */}
      <div className="mb-12">
        <div className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-2">
          Laboratory Credentials · About AudioFix
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
          Acoustic Engineering Rooted in Precision Measurement
        </h2>
        <p className="text-base text-neutral-400 max-w-2xl leading-relaxed">
          Founded by certified audio electronics engineers, AudioFix bridges physical speaker
          mechanics and browser-accessible diagnostic technology. We believe no working audio driver
          should end up in a landfill due to an undiagnosed cable fault or software routing glitch.
        </p>
      </div>

      {/* 2-Column Split: Image & Laboratory Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
        {/* Lab Photo Frame */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 group">
          <img
            src="/src/assets/images/audio_technician_lab_1794295050715.jpg"
            alt="AudioFix engineer inspecting internal speaker crossover circuitry in laboratory"
            className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-neutral-300 font-mono">
            <span>Audio Electronics Diagnostic Station 04</span>
            <span className="text-amber-400">ISO 9001 Bench Standard</span>
          </div>
        </div>

        {/* Credentials & Metrics */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> AES Member Certified
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Our acoustic technicians adhere strictly to Audio Engineering Society (AES) measurement guidelines, maintaining calibrated anechoic chamber test procedures.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-500" /> Hardware Component Sourcing
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We maintain an inventory of over 12,000 OEM voice coils, spider suspensions, high-voltage film capacitors, and precision op-amps for vintage and modern monitors.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" /> Digital & Web Audio Tooling
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Our browser diagnostic suite uses the native Web Audio API to bypass operating system compressor stages, delivering bit-accurate reference frequency tones.
            </p>
          </div>
        </div>
      </div>

      {/* External Authority Links as requested in Part 2 */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">Authoritative References & Scientific Resources</h4>
            <p className="text-xs text-neutral-400">
              Peer-reviewed technical literature and acoustic engineering standards.
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 uppercase">Verified Citations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <a
            href="https://en.wikipedia.org/wiki/Loudspeaker"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl border border-neutral-800/80 bg-neutral-900/40 hover:border-amber-500/50 hover:bg-neutral-900 transition-all flex items-start justify-between group"
          >
            <div>
              <span className="font-semibold text-white group-hover:text-amber-400 transition-colors block mb-1">
                Loudspeaker Electrodynamics
              </span>
              <p className="text-neutral-400 text-[11px]">
                Wikipedia documentation on voice coils, driver suspension, and magnet assemblies.
              </p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 shrink-0 ml-2" />
          </a>

          <a
            href="https://en.wikipedia.org/wiki/Audio_frequency"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl border border-neutral-800/80 bg-neutral-900/40 hover:border-amber-500/50 hover:bg-neutral-900 transition-all flex items-start justify-between group"
          >
            <div>
              <span className="font-semibold text-white group-hover:text-amber-400 transition-colors block mb-1">
                Audio Frequency Bands
              </span>
              <p className="text-neutral-400 text-[11px]">
                Scientific reference on human audible spectrum limits (20Hz to 20kHz).
              </p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 shrink-0 ml-2" />
          </a>

          <a
            href="https://www.bbc.co.uk/rd/work-areas/audio"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl border border-neutral-800/80 bg-neutral-900/40 hover:border-amber-500/50 hover:bg-neutral-900 transition-all flex items-start justify-between group"
          >
            <div>
              <span className="font-semibold text-white group-hover:text-amber-400 transition-colors block mb-1">
                BBC R&D Audio Research
              </span>
              <p className="text-neutral-400 text-[11px]">
                British Broadcasting Corporation acoustic research on spatial sound and speaker monitoring.
              </p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 shrink-0 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};
