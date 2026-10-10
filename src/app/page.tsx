'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/context';
import QuickCalculator from '@/components/calculators/QuickCalculator';
import {
  ArrowRight,
  Shield,
  Compass,
  FileText,
  Building,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { dict } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    { q: dict.faq.q1, a: dict.faq.a1 },
    { q: dict.faq.q2, a: dict.faq.a2 },
    { q: dict.faq.q3, a: dict.faq.a3 },
    { q: dict.faq.q4, a: dict.faq.a4 },
    { q: dict.faq.q5, a: dict.faq.a5 },
  ];

  return (
    <div className="space-y-0">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-med-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-med-stone/60 border border-med-border text-med-olive text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{dict.hero.badge}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-med-dark font-normal tracking-tight leading-[1.12]">
                {dict.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-med-muted max-w-xl font-sans leading-relaxed">
                {dict.hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#quick-calculator"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-sm font-semibold uppercase tracking-wider shadow-lg shadow-med-dark/10"
                >
                  <span>{dict.hero.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/detailed-estimate"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white border border-med-border hover:bg-med-stone/40 text-med-dark transition-colors text-sm font-semibold uppercase tracking-wider shadow-sm"
                >
                  <span>{dict.hero.secondaryCta}</span>
                </Link>
              </div>

              {/* Trust highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-med-border/80">
                <div>
                  <div className="font-serif text-2xl font-medium text-med-dark">21</div>
                  <div className="text-xs text-med-muted">Construction Trades</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-medium text-med-dark">100%</div>
                  <div className="text-xs text-med-muted">Independent</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-medium text-med-dark">EN / ES / DE</div>
                  <div className="text-xs text-med-muted">International Support</div>
                </div>
              </div>
            </div>

            {/* Right Architectural Inspiration Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-med-border aspect-[4/5] bg-med-stone/40">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Contemporary Mediterranean Villa in Mallorca (Architectural Reference)"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-med-dark/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 text-xs text-med-dark space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-med-olive">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Architectural Reference Benchmark</span>
                  </div>
                  <p className="text-med-muted text-[11px] leading-snug">
                    Natural marés stone, modern minimalist glazing & sustainable aerothermal climate design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CALCULATOR SECTION */}
      <QuickCalculator />

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white border-t border-b border-med-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-semibold tracking-wider text-med-olive">
              Step-by-Step Clarity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-med-dark mt-2 font-normal">
              {dict.howItWorks.title}
            </h2>
            <p className="mt-3 text-med-muted text-sm sm:text-base">
              {dict.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-med-sand/50 border border-med-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-med-stone flex items-center justify-center text-med-dark font-serif font-bold text-lg mb-4">
                01
              </div>
              <h3 className="font-semibold text-med-dark text-base">
                {dict.howItWorks.step1Title}
              </h3>
              <p className="text-xs sm:text-sm text-med-muted mt-2 leading-relaxed">
                {dict.howItWorks.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-med-sand/50 border border-med-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-med-stone flex items-center justify-center text-med-dark font-serif font-bold text-lg mb-4">
                02
              </div>
              <h3 className="font-semibold text-med-dark text-base">
                {dict.howItWorks.step2Title}
              </h3>
              <p className="text-xs sm:text-sm text-med-muted mt-2 leading-relaxed">
                {dict.howItWorks.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-med-sand/50 border border-med-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-med-stone flex items-center justify-center text-med-dark font-serif font-bold text-lg mb-4">
                03
              </div>
              <h3 className="font-semibold text-med-dark text-base">
                {dict.howItWorks.step3Title}
              </h3>
              <p className="text-xs sm:text-sm text-med-muted mt-2 leading-relaxed">
                {dict.howItWorks.step3Desc}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-med-sand/50 border border-med-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-med-stone flex items-center justify-center text-med-dark font-serif font-bold text-lg mb-4">
                04
              </div>
              <h3 className="font-semibold text-med-dark text-base">
                {dict.howItWorks.step4Title}
              </h3>
              <p className="text-xs sm:text-sm text-med-muted mt-2 leading-relaxed">
                {dict.howItWorks.step4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY MALLORCAQUOTES */}
      <section className="py-24 bg-med-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase font-semibold tracking-wider text-med-olive">
                Our Difference
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-med-dark font-normal">
                {dict.whyUs.title}
              </h2>
              <div className="space-y-6 pt-2">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-med-stone/80 flex items-center justify-center text-med-olive shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-med-dark">{dict.whyUs.point1Title}</h4>
                    <p className="text-xs sm:text-sm text-med-muted mt-1 leading-relaxed">{dict.whyUs.point1Desc}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-med-stone/80 flex items-center justify-center text-med-olive shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-med-dark">{dict.whyUs.point2Title}</h4>
                    <p className="text-xs sm:text-sm text-med-muted mt-1 leading-relaxed">{dict.whyUs.point2Desc}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-med-stone/80 flex items-center justify-center text-med-olive shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-med-dark">{dict.whyUs.point3Title}</h4>
                    <p className="text-xs sm:text-sm text-med-muted mt-1 leading-relaxed">{dict.whyUs.point3Desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teaser card */}
            <div className="lg:col-span-7 bg-med-dark text-med-sand rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-6 max-w-lg">
                <span className="text-xs uppercase tracking-widest text-med-olive font-semibold">
                  Qualified Project Flow
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-snug">
                  Plan your build with real Balearic figures.
                </h3>
                <p className="text-xs sm:text-sm text-med-limestone/80 leading-relaxed">
                  Moving from an initial idea to architectural design requires reliable cost parameters. Our detailed questionnaire maps out excavation, MEP, structural envelopes and premium finishes.
                </p>
                <Link
                  href="/detailed-estimate"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-med-dark hover:bg-med-stone transition-colors text-xs font-semibold uppercase tracking-wider"
                >
                  <span>{dict.nav.detailedEstimate}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-white border-t border-med-border/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-semibold tracking-wider text-med-olive">
              Answers & Transparency
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-med-dark mt-2 font-normal">
              {dict.faq.title}
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-med-border bg-med-sand/30 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                >
                  <span className="font-medium text-sm sm:text-base text-med-dark pr-4">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-med-muted shrink-0 transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180 text-med-olive' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-med-muted leading-relaxed border-t border-med-border/40 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST DISCLAIMER BANNER */}
      <section className="py-12 bg-med-stone/40 border-t border-med-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-med-olive">
            <CheckCircle2 className="w-4 h-4" />
            <span>{dict.disclaimer.title}</span>
          </div>
          <p className="text-xs text-med-muted max-w-3xl mx-auto leading-relaxed">
            {dict.disclaimer.text}
          </p>
        </div>
      </section>
    </div>
  );
}
