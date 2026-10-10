import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import DetailedCalculatorWizard from '@/components/calculators/DetailedCalculatorWizard';

export const metadata: Metadata = {
  title: 'Detailed Construction Cost Estimate — Mallorca Villa',
  description:
    'Comprehensive multi-step cost calculator for building a new home in Mallorca. Receive an itemized trade-by-trade architectural estimate dossier.',
};

export default function DetailedEstimatePage() {
  return (
    <div className="bg-med-sand min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <h1 className="font-serif text-3xl sm:text-4xl text-med-dark font-normal">
          Detailed Construction Estimate
        </h1>
        <p className="text-med-muted text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Complete the guided questionnaire to configure your Mallorca building project and receive a personalized cost dossier.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-20 text-med-muted text-sm">Loading questionnaire...</div>}>
        <DetailedCalculatorWizard />
      </Suspense>
    </div>
  );
}
