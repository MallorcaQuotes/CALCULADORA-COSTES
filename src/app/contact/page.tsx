'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export default function ContactPage() {
  const { dict } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Please accept the privacy policy to submit.');
      return;
    }
    // Simulation / recording
    setSubmitted(true);
  };

  return (
    <div className="bg-med-sand min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-semibold tracking-wider text-med-olive">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-med-dark font-normal">
            Contact MallorcaQuotes
          </h1>
          <p className="text-med-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have questions about our calculation model or need assistance with your project specifications? Send us a message.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Information */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-med-border shadow-sm space-y-6">
            <h3 className="font-serif text-xl text-med-dark font-medium">
              Direct Contact
            </h3>

            <div className="space-y-4 text-xs text-med-dark">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-med-stone/60 text-med-olive flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-med-muted block text-[11px] uppercase">Email</span>
                  <a href="mailto:info@mallorcaquotes.com" className="font-semibold text-sm hover:text-med-olive">
                    info@mallorcaquotes.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-med-stone/60 text-med-olive flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-med-muted block text-[11px] uppercase">Regional Focus</span>
                  <span className="font-medium text-xs leading-relaxed block">
                    Balearic Islands, Spain<br />
                    Serving projects in Palma, Calvià, Andratx, Santanyí, Sóller, Pollença & all Mallorca regions.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-med-sand border border-med-border text-xs text-med-muted space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-med-dark">
                <ShieldCheck className="w-4 h-4 text-med-olive" />
                <span>Independent Platform Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                MallorcaQuotes does not undertake building works directly and does not act as a construction contractor.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-med-border shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-med-olive/10 text-med-olive flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-med-dark">Message Received</h3>
                <p className="text-xs text-med-muted max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. A member of our technical team will review your inquiry and respond via email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-xs focus:ring-1 focus:ring-med-olive"
                    placeholder="e.g. Elena Rossi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-xs focus:ring-1 focus:ring-med-olive"
                    placeholder="elena@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-xs focus:ring-1 focus:ring-med-olive"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="w-4 h-4 rounded border-med-border text-med-olive accent-med-olive mt-0.5"
                    />
                    <span className="text-[11px] text-med-muted leading-relaxed">
                      I consent to MallorcaQuotes storing my contact details to reply to my message according to the Privacy Policy.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-xs font-semibold uppercase tracking-wider shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
