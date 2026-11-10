import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Marcus Vance',
      role: 'Chief Audio Engineer',
      organization: 'Vance Mastering & Soundworks',
      metric: 'Saved $2,400 Replacement Cost',
      quote: 'Our primary pair of nearfield studio monitors started emitting an irregular low-frequency crackle at 80Hz. Using the AudioFix sweep diagnostic, we pinpointed a separated dust cap within 4 minutes. Their laboratory replaced the spider suspension in 3 days, returning the frequency curve to factory spec.',
    },
    {
      name: 'Elena Rostova',
      role: 'Lead Podcast Producer',
      organization: 'Cadence Media Network',
      quote: 'We thought our broadcast interface DAC was fried after 3 hours of silence during a live recording session. The 3-minute isolation protocol quickly isolated the issue to a corrupted USB audio routing driver on Windows 11. Saved us from canceling the broadcast and ordering redundant gear.',
      metric: 'Zero Downtime on Live Broadcast',
    },
    {
      name: 'David K. Morales',
      role: 'Commercial AV Integrator',
      organization: 'Apex Venue Solutions',
      quote: 'AudioFix is our first stop for client site troubleshooting. The Web Audio tone generator allows our field technicians to balance left/right line arrays without hauling signal generators. Invaluable diagnostic tool for professional sound engineers.',
      metric: '48% Faster Field Turnaround',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-12">
        <div className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-2">
          Verified Field Proof · Client Outcomes
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Proven in Commercial Studios & Living Rooms
        </h2>
        <p className="text-sm text-neutral-400 max-w-xl">
          Real results from recording engineers, venue managers, and daily listeners who diagnosed and restored their sound.
        </p>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Client
                </span>
              </div>

              <div className="text-xs font-mono text-amber-500 font-semibold mb-3">
                {rev.metric}
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed italic mb-6">
                &ldquo;{rev.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <div className="text-sm font-bold text-white">{rev.name}</div>
              <div className="text-xs text-neutral-400">{rev.role}</div>
              <div className="text-[11px] text-neutral-500">{rev.organization}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quantitative Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl border border-neutral-800 bg-neutral-950 text-center">
        <div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums">4,200+</div>
          <div className="text-xs text-neutral-400 mt-1">Speakers Diagnosed</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">94.8%</div>
          <div className="text-xs text-neutral-400 mt-1">First-Session Resolution</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums">&lt; 6 min</div>
          <div className="text-xs text-neutral-400 mt-1">Average Diagnostic Time</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">4.9 / 5</div>
          <div className="text-xs text-neutral-400 mt-1">Studio Engineer Rating</div>
        </div>
      </div>
    </div>
  );
};
