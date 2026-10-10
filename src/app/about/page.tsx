import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Compass, Scale, ArrowRight, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — Independent Construction Cost Estimation',
  description:
    'Learn about MallorcaQuotes, an independent technological platform providing transparent, market-calibrated construction cost estimates for new homes in Mallorca.',
};

export default function AboutPage() {
  return (
    <div className="bg-med-sand min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-semibold tracking-wider text-med-olive">
            Our Purpose & Vision
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-med-dark font-normal">
            Understand the cost before you build.
          </h1>
          <p className="text-med-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            MallorcaQuotes was created to bring clarity, transparency and financial predictability to homeowners and international self-builders planning to build in Mallorca.
          </p>
        </div>

        {/* Clear Identity Notice */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-med-border shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-med-olive">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="font-serif text-xl text-med-dark font-medium">
              We Are an Estimation Platform, Not a Construction Company
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-med-muted leading-relaxed">
            Building a luxury home or traditional finca in the Balearic Islands involves unique logistical factors: island shipping freight, local quarry stone, seismic regulations, insular labor availability and specific municipal urbanistic codes.
          </p>
          <p className="text-xs sm:text-sm text-med-muted leading-relaxed">
            MallorcaQuotes is not a contractor and does not execute building works. We operate with complete independence to help prospective self-promoters benchmark realistic construction costs <em>before</em> committing to plot acquisitions or signing contractor contracts.
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-med-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-med-stone/60 text-med-olive flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-med-dark">Independent Pricing Model</h3>
            <p className="text-xs text-med-muted leading-relaxed">
              We do not accept commissions from builders or markups on construction materials. Our sole focus is objective market data.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-med-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-med-stone/60 text-med-olive flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-med-dark">Island-Calibrated Data</h3>
            <p className="text-xs text-med-muted leading-relaxed">
              Our 21-trade model reflects real Balearic rates, from excavation in rocky limestone to aerothermal heat pumps and local marés stone facades.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-med-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-med-stone/60 text-med-olive flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-med-dark">International Standards</h3>
            <p className="text-xs text-med-muted leading-relaxed">
              Comprehensive multilingual documentation in English, German and Spanish to support foreign investors and self-promoters.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="p-8 sm:p-10 rounded-3xl bg-med-dark text-med-sand text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
            Ready to explore your project budget?
          </h2>
          <p className="text-xs sm:text-sm text-med-limestone/80 max-w-xl mx-auto leading-relaxed">
            Start with our instant quick calculator or submit your specific villa parameters for an itemized trade-by-trade breakdown dossier.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/#quick-calculator"
              className="px-6 py-3.5 rounded-xl bg-white text-med-dark hover:bg-med-stone transition-colors text-xs font-semibold uppercase tracking-wider shadow-sm"
            >
              Try Quick Calculator
            </Link>
            <Link
              href="/detailed-estimate"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-med-olive text-white hover:bg-med-olive-dark transition-colors text-xs font-semibold uppercase tracking-wider"
            >
              <span>Get Detailed Estimate</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
