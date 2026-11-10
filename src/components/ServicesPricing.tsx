import React, { useState } from 'react';
import { 
  Wrench, 
  Cpu, 
  Sparkles, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  features: string[];
  turnaround: string;
  startingPrice: string;
}

export const ServicesPricing: React.FC<{ onSelectService: (serviceName: string) => void }> = ({ onSelectService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const services: ServiceItem[] = [
    {
      id: 'transducer',
      number: '01',
      title: 'Precision Transducer & Voice Coil Repair',
      category: 'hardware',
      summary: 'Component-level restoration of blown voice coils, fractured spiders, deteriorated foam surrounds, and damaged diaphragms.',
      features: [
        'Voice coil unwinding and precision rewinding to factory impedance',
        'Butyl rubber and high-density foam surround replacement',
        'Magnet realignment and ferrofluid replenishment',
        'Audio Precision APx515 acoustic frequency response verification'
      ],
      turnaround: '2–4 Business Days',
      startingPrice: '$89',
    },
    {
      id: 'crossover',
      number: '02',
      title: 'Analog Crossover & Circuit Re-engineering',
      category: 'hardware',
      summary: 'Diagnostic bench testing and restoration of passive and active crossover networks, capacitors, inductors, and terminal blocks.',
      features: [
        'Audiophile-grade metallized polypropylene capacitor upgrades',
        'Cold solder joint reflow and trace repair under microscope',
        'Thermal protection fuse and relay replacement',
        'Bi-amp terminal plate rewiring and oxidation clearing'
      ],
      turnaround: '1–3 Business Days',
      startingPrice: '$65',
    },
    {
      id: 'bluetooth',
      number: '03',
      title: 'Bluetooth & Wireless Signal Calibration',
      category: 'digital',
      summary: 'Firmware reflashing, antenna trace repair, and Bluetooth codec calibration (LDAC, aptX HD, AAC) for wireless monitors.',
      features: [
        'RF transceiver antenna replacement and impedance matching',
        'Corrupted DSP flash memory reflashing and parity check',
        'Lithium-ion power management system (BMS) battery swap',
        'Zero-dropout wireless stability bench soak test (48 hours)'
      ],
      turnaround: '1–2 Business Days',
      startingPrice: '$49',
    },
    {
      id: 'acoustic',
      number: '04',
      title: 'Studio Acoustic Alignment & Room Tuning',
      category: 'studio',
      summary: 'On-site or virtual acoustic analysis, monitor decoupling, room mode identification, and parametric EQ calibration.',
      features: [
        'Waterfall plot decay time (RT60) measurements',
        'First reflection point absorption and bass trap calculation',
        'Subwoofer phase alignment and crossover frequency tuning',
        'Reference listening position calibration report'
      ],
      turnaround: 'Scheduled Appointment',
      startingPrice: '$180',
    },
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  return (
    <div id="services" className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-neutral-800 gap-6">
        <div>
          <div className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-2">
            Professional Engineering Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Hardware Restoration & Laboratory Tuning
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl">
            From consumer Bluetooth speakers to commercial studio reference monitors, our laboratory
            provides certified component repairs with strict bench testing protocols.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl self-start md:self-auto">
          {[
            { id: 'all', label: 'All Offerings' },
            { id: 'hardware', label: 'Hardware Repair' },
            { id: 'digital', label: 'Wireless & DSP' },
            { id: 'studio', label: 'Studio Tuning' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 flex flex-col justify-between hover:border-neutral-700 transition-all hover:bg-neutral-900/90 group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-neutral-400 font-bold">
                  {service.number}. {service.category.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {service.turnaround}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                {service.summary}
              </p>

              <div className="space-y-2 mb-6">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Starting at</span>
                <span className="text-lg font-mono font-bold text-white">{service.startingPrice}</span>
              </div>

              <button
                onClick={() => onSelectService(service.title)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-xs font-semibold text-neutral-200 transition-all flex items-center gap-1.5"
              >
                Inquire Service <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust banner */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">90-Day Unconditional Acoustic Warranty</h4>
            <p className="text-xs text-neutral-400">
              All rebuilt drivers and replaced electronic components include a full 90-day parts and labor guarantee.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectService('Warranty Inquiry')}
          className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          View Warranty Terms
        </button>
      </div>
    </div>
  );
};
