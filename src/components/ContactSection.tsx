import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface ContactSectionProps {
  initialService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deviceModel: '',
    serviceRequested: initialService || 'Speaker Diagnostic & Bench Testing',
    issueDescription: '',
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.issueDescription.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, and Issue Description).');
      return;
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <div id="contact" className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6">
      {/* Section Header */}
      <div className="mb-12">
        <div className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-2">
          Direct Laboratory Contact · Booking & Inquiries
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Get Your Audio Gear Diagnosed
        </h2>
        <p className="text-sm text-neutral-400 max-w-xl">
          Drop off equipment at our San Francisco bench, arrange courier intake, or schedule a virtual acoustic diagnostic review with an engineer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Information & Lab Location */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
            <h3 className="text-lg font-bold text-white pb-3 border-b border-neutral-800">
              Laboratory Headquarters
            </h3>

            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">AudioFix Engineering Lab</span>
                <span className="text-neutral-400 block text-xs mt-0.5">
                  742 Townsend Street, Suite 300<br />
                  San Francisco, CA 94103
                </span>
                <span className="text-[11px] font-mono text-neutral-500 block mt-1">
                  Bench Intake: Mon–Fri 9:00 AM – 6:00 PM PST
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Direct Phone</span>
                <a
                  href="tel:+14158902834"
                  className="text-neutral-300 hover:text-amber-400 text-xs font-mono transition-colors block mt-0.5"
                >
                  +1 (415) 890-AUDIO (2834)
                </a>
                <span className="text-[11px] text-neutral-500 block">Immediate diagnostic triage support</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Engineering Email</span>
                <a
                  href="mailto:lab@audiofixpro.com"
                  className="text-neutral-300 hover:text-amber-400 text-xs font-mono transition-colors block mt-0.5"
                >
                  lab@audiofixpro.com
                </a>
                <span className="text-[11px] text-neutral-500 block">Response guaranteed within 2 hours</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400">
              <div className="flex items-center gap-2 text-white font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Express 24-Hour Turnaround
              </div>
              Emergency studio monitor repair services available for broadcast studios and live concert venues upon inquiry.
            </div>
          </div>
        </div>

        {/* Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 backdrop-blur">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Diagnostic Inquiry Received</h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. An audio engineer has been assigned to your ticket for your <span className="text-amber-400">{formData.deviceModel || 'speaker equipment'}</span>. We will email instructions and shipping labels to <span className="text-white">{formData.email}</span> within 2 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        deviceModel: '',
                        serviceRequested: 'Speaker Diagnostic & Bench Testing',
                        issueDescription: '',
                      });
                    }}
                    className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Request Bench Repair or Consultation</h3>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Full Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Email Address <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Speaker Brand &amp; Model
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Yamaha HS8, JBL Flip 6, Audioengine A2+"
                      value={formData.deviceModel}
                      onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Requested Service Tier
                  </label>
                  <select
                    value={formData.serviceRequested}
                    onChange={(e) => setFormData({ ...formData, serviceRequested: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="Speaker Diagnostic & Bench Testing">Speaker Diagnostic & Bench Testing</option>
                    <option value="Precision Transducer & Voice Coil Repair">01. Precision Transducer & Voice Coil Repair ($89)</option>
                    <option value="Analog Crossover & Circuit Re-engineering">02. Analog Crossover & Circuit Re-engineering ($65)</option>
                    <option value="Bluetooth & Wireless Signal Calibration">03. Bluetooth & Wireless Signal Calibration ($49)</option>
                    <option value="Studio Acoustic Alignment & Room Tuning">04. Studio Acoustic Alignment & Room Tuning ($180)</option>
                    <option value="Custom Website / Audio Software Development">Custom Audio Website / Diagnostic Platform Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Describe Symptoms / Sound Issue <span className="text-amber-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. Complete silence on wired AUX, or crackling noise during low bass frequencies, or Bluetooth disconnects after 30 seconds..."
                    value={formData.issueDescription}
                    onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Diagnostic Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
