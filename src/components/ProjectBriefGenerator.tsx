import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Layout, 
  Palette, 
  Search, 
  Globe, 
  Zap,
  Download,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const ProjectBriefGenerator: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'architecture' | 'seo'>('overview');

  const fullBriefMarkdown = `# Complete Website Project Brief & Technical Blueprint

## 1. Project Overview
- **Project Goal:** Design and deploy a responsive, high-performance website tailored to your business or brand requirements.
- **Tech Stack / Platform:** Custom HTML/CSS/JavaScript with responsive layouts, optimized cloud stack hosting, and clean asset organization.
- **Design Aesthetic:** Professional UI featuring high-contrast color palettes (such as deep dark headers and footers with custom body backgrounds), clear typography, and optimized call-to-action buttons.

## 2. Site Architecture & Page Structure
### Homepage
- **Hero Section:** Eye-catching headline, concise value proposition, and primary call-to-action (CTA) button.
- **Core Services / Features:** Grid or flexbox layout showcasing what you offer with clear icons and short descriptions.
- **About Section:** Brief introduction to build trust and authority.
- **Testimonials / Social Proof:** Customer reviews or project highlights.
- **Footer:** Contact info, quick links, social media handles, and copyright.

### Inner Pages (As Needed)
- **Services / Products Page:** Detailed breakdown of offerings with pricing or portfolio grids.
- **Contact Page:** Interactive contact form, direct email, phone number, and location details.

## 3. Content & SEO Requirements
- **Keyword Optimization:** Target specific primary keywords integrated naturally into meta titles, H1/H2 tags, and body content.
- **External Authority Links:** Inclusion of authoritative references (such as Wikipedia or BBC) where relevant to boost credibility and SEO performance.
- **Speed & Mobile Optimization:** Fully optimized CSS/JS assets, compressed images, and mobile-first responsive design ensuring fast loading times across all devices.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullBriefMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([fullBriefMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'website-project-brief.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="project-brief" className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-neutral-800 gap-6">
        <div>
          <div className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-2">
            Part 2 Blueprint · Developer Ready
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Website Project Brief & Architecture
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl">
            Complete technical specification, design system parameters, and site layout structure
            ready to hand off to developers, agencies, or deploy directly.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-amber-500 text-xs font-semibold text-neutral-200 transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            {copied ? 'Brief Copied!' : 'Copy Markdown Brief'}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-bold text-neutral-950 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download .md
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 mb-8 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl w-fit">
        {[
          { id: 'overview', label: '1. Project Overview', icon: Globe },
          { id: 'architecture', label: '2. Site Architecture', icon: Layout },
          { id: 'seo', label: '3. SEO & Speed Specs', icon: Zap },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as 'overview' | 'architecture' | 'seo')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSection === tab.id
                  ? 'bg-amber-500 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Panels */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur space-y-6">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Section 1: Project Overview & Core Parameters</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="text-xs font-mono text-amber-500 uppercase tracking-wider block">Project Goal</span>
                <h4 className="text-sm font-bold text-white">High-Performance Deployment</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Design and deploy a responsive, high-performance website tailored to your business or brand requirements with frictionless navigation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="text-xs font-mono text-amber-500 uppercase tracking-wider block">Tech Stack / Platform</span>
                <h4 className="text-sm font-bold text-white">Modern Cloud Stack</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Custom HTML5 / CSS3 / JavaScript (React + TypeScript + Tailwind CSS), optimized cloud edge hosting, and organized asset architecture.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="text-xs font-mono text-amber-500 uppercase tracking-wider block">Design Aesthetic</span>
                <h4 className="text-sm font-bold text-white">High-Contrast Dark Elegance</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Professional UI featuring deep dark headers and footers with custom body backgrounds, clear typography, and optimized CTA buttons.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-xs text-neutral-300">
              <span className="font-semibold text-amber-400">Implementation Verification: </span>
              This website is actively built using the exact specifications above: deep dark `#0a0a0a` backdrop, Tailwind CSS, Plus Jakarta Sans typography, and accessible high-contrast amber CTA elements.
            </div>
          </div>
        )}

        {activeSection === 'architecture' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Section 2: Site Architecture & Page Structure</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Homepage Wireframe Breakdown */}
              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-xs font-mono text-amber-500 uppercase font-bold">Homepage Blueprint</span>
                  <span className="text-[11px] font-mono text-neutral-400">5 Essential Zones</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/70">
                    <span className="font-bold text-white block">1. Hero Section</span>
                    <span className="text-neutral-400">Eye-catching headline, concise value proposition, and primary call-to-action (CTA) button.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/70">
                    <span className="font-bold text-white block">2. Core Services / Features</span>
                    <span className="text-neutral-400">Grid or flexbox layout showcasing what you offer with clear icons and short descriptions.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/70">
                    <span className="font-bold text-white block">3. About Section</span>
                    <span className="text-neutral-400">Brief introduction to build trust, authority, and engineering credentials.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/70">
                    <span className="font-bold text-white block">4. Testimonials / Social Proof</span>
                    <span className="text-neutral-400">Customer reviews with attributable metrics, project highlights, and trust ratings.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/70">
                    <span className="font-bold text-white block">5. Deep Dark Footer</span>
                    <span className="text-neutral-400">Contact info, quick links, social media handles, and copyright notice.</span>
                  </div>
                </div>
              </div>

              {/* Inner Pages Breakdown */}
              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-xs font-mono text-amber-500 uppercase font-bold">Inner Pages (As Needed)</span>
                  <span className="text-[11px] font-mono text-neutral-400">Dedicated Views</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800/70">
                    <span className="font-bold text-white block mb-1">Services / Products Page</span>
                    <p className="text-neutral-400 mb-2">Detailed breakdown of offerings with pricing or portfolio grids.</p>
                    <div className="text-[11px] font-mono text-amber-400">
                      Integrated: Transducer repair, Crossover rebuilds, Bluetooth calibration, Studio tuning.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800/70">
                    <span className="font-bold text-white block mb-1">Interactive Contact Page</span>
                    <p className="text-neutral-400 mb-2">Interactive contact form, direct email, phone number, and location details.</p>
                    <div className="text-[11px] font-mono text-amber-400">
                      Integrated: Form validation, device fault selector, phone, direct email, physical laboratory address.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'seo' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Section 3: Content, SEO & Speed Requirements</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs font-mono">
                  <Search className="w-3.5 h-3.5" /> KEYWORD OPTIMIZATION
                </div>
                <h4 className="text-sm font-bold text-white">Semantic Headings & Meta</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Target primary keywords naturally in meta titles, H1/H2 tags, image alt text, and body prose without keyword stuffing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs font-mono">
                  <Globe className="w-3.5 h-3.5" /> EXTERNAL AUTHORITY LINKS
                </div>
                <h4 className="text-sm font-bold text-white">Trusted References</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Inclusion of authoritative references (Wikipedia acoustics, BBC R&amp;D audio engineering) to boost search engine credibility.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs font-mono">
                  <Zap className="w-3.5 h-3.5" /> SPEED & MOBILE OPTIMIZATION
                </div>
                <h4 className="text-sm font-bold text-white">Lightweight Performance</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Zero render-blocking scripts, native Web Audio synthesis, responsive mobile-first grid, and sub-100ms interaction latency.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
