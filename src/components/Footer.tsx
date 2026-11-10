import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-800 text-neutral-400 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="text-base font-extrabold tracking-tight text-white font-mono">
              AUDIOFIX<span className="text-amber-500">.PRO</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Precision audio diagnostics, Web Audio frequency synthesis, and certified transducer restoration laboratory.
            </p>
            <div className="text-[11px] font-mono text-neutral-500">
              San Francisco Bench · Global Web Tools
            </div>
          </div>

          {/* Diagnostic Tools */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono uppercase text-white font-semibold block">Diagnostic Tools</span>
            <ul className="text-xs space-y-2">
              <li><a href="#troubleshooter" className="hover:text-amber-400 transition-colors">3-Step Fix Wizard</a></li>
              <li><a href="#sound-lab" className="hover:text-amber-400 transition-colors">Tone Generator (20Hz-20kHz)</a></li>
              <li><a href="#sound-lab" className="hover:text-amber-400 transition-colors">Stereo L/R Balancer</a></li>
              <li><a href="#sound-lab" className="hover:text-amber-400 transition-colors">Pink &amp; White Noise</a></li>
            </ul>
          </div>

          {/* Laboratory Services */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono uppercase text-white font-semibold block">Lab Services</span>
            <ul className="text-xs space-y-2">
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Voice Coil Reconing</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Crossover Network Repair</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Bluetooth Calibration</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Acoustic Room Tuning</a></li>
            </ul>
          </div>

          {/* External Authority Resources */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono uppercase text-white font-semibold block">Authority Citations</span>
            <ul className="text-xs space-y-2">
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Loudspeaker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  Wikipedia: Loudspeaker <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Audio_frequency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  Wikipedia: Audio Spectrum <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.bbc.co.uk/rd/work-areas/audio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  BBC R&amp;D Audio Research <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li><a href="#project-brief" className="hover:text-amber-400 transition-colors">Website Architecture Brief</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} AudioFix Pro Laboratory. All rights reserved. Built with precision Web Audio standards.
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>ISO 9001 Bench</span>
            <span>·</span>
            <span>AES Member #84019</span>
            <span>·</span>
            <span>High-Contrast Dark UI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
