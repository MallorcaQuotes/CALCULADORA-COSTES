'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { calculateQuickEstimate } from '@/lib/pricing/engine';
import { QualityLevel, PoolOption } from '@/lib/pricing/types';
import { Sparkles, ArrowRight, ShieldCheck, Check, Layers, Waves, Maximize2 } from 'lucide-react';

export default function QuickCalculator() {
  const { dict } = useTranslation();

  const [builtAreaM2, setBuiltAreaM2] = useState<number>(200);
  const [quality, setQuality] = useState<QualityLevel>('Media');
  const [pool, setPool] = useState<PoolOption>('Mediana');

  const estimate = useMemo(() => {
    return calculateQuickEstimate({
      builtAreaM2,
      quality,
      pool,
    });
  }, [builtAreaM2, quality, pool]);

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section id="quick-calculator" className="py-20 bg-med-sand relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-med-stone/60 border border-med-border text-med-olive text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Indicative Tool</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-med-dark font-normal tracking-tight">
            {dict.quickCalc.title}
          </h2>
          <p className="mt-3 text-med-muted text-sm sm:text-base">
            {dict.quickCalc.subtitle}
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-med-stone/40 border border-med-border/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls (Left Column) */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Built-up area */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-med-dark flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-med-olive" />
                    <span>{dict.quickCalc.areaLabel}</span>
                  </label>
                  <span className="font-serif text-2xl font-medium text-med-dark">
                    {builtAreaM2} <span className="text-sm font-sans text-med-muted font-normal">m²</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="650"
                  step="10"
                  value={builtAreaM2}
                  onChange={(e) => setBuiltAreaM2(Number(e.target.value))}
                  className="w-full h-2.5 bg-med-stone rounded-lg appearance-none cursor-pointer accent-med-olive"
                />
                <div className="flex justify-between text-[11px] text-med-muted mt-1.5 font-sans">
                  <span>Compact (60 m²)</span>
                  <span>Villa (300 m²)</span>
                  <span>Estate (650+ m²)</span>
                </div>
              </div>

              {/* 2. Quality Level */}
              <div>
                <label className="text-sm font-semibold text-med-dark flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-med-olive" />
                  <span>{dict.quickCalc.qualityLabel}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Básica */}
                  <button
                    type="button"
                    onClick={() => setQuality('Básica')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      quality === 'Básica'
                        ? 'border-med-olive bg-med-olive/5 ring-1 ring-med-olive'
                        : 'border-med-border hover:border-med-limestone bg-med-sand/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-med-dark">
                        {dict.quickCalc.qualityBasic}
                      </span>
                      {quality === 'Básica' && <Check className="w-4 h-4 text-med-olive" />}
                    </div>
                    <p className="text-[11px] text-med-muted mt-1 leading-snug">
                      {dict.quickCalc.qualityBasicDesc}
                    </p>
                  </button>

                  {/* Media */}
                  <button
                    type="button"
                    onClick={() => setQuality('Media')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      quality === 'Media'
                        ? 'border-med-olive bg-med-olive/5 ring-1 ring-med-olive'
                        : 'border-med-border hover:border-med-limestone bg-med-sand/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-med-dark">
                        {dict.quickCalc.qualityMedium}
                      </span>
                      {quality === 'Media' && <Check className="w-4 h-4 text-med-olive" />}
                    </div>
                    <p className="text-[11px] text-med-muted mt-1 leading-snug">
                      {dict.quickCalc.qualityMediumDesc}
                    </p>
                  </button>

                  {/* Alta */}
                  <button
                    type="button"
                    onClick={() => setQuality('Alta')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      quality === 'Alta'
                        ? 'border-med-olive bg-med-olive/5 ring-1 ring-med-olive'
                        : 'border-med-border hover:border-med-limestone bg-med-sand/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-med-dark">
                        {dict.quickCalc.qualityHigh}
                      </span>
                      {quality === 'Alta' && <Check className="w-4 h-4 text-med-olive" />}
                    </div>
                    <p className="text-[11px] text-med-muted mt-1 leading-snug">
                      {dict.quickCalc.qualityHighDesc}
                    </p>
                  </button>
                </div>
              </div>

              {/* 3. Swimming Pool */}
              <div>
                <label className="text-sm font-semibold text-med-dark flex items-center gap-2 mb-3">
                  <Waves className="w-4 h-4 text-med-olive" />
                  <span>{dict.quickCalc.poolLabel}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Sin piscina', 'Pequeña', 'Mediana', 'Grande'] as PoolOption[]).map((p) => {
                    const label =
                      p === 'Sin piscina'
                        ? dict.quickCalc.poolNo
                        : p === 'Pequeña'
                        ? dict.quickCalc.poolSmall
                        : p === 'Mediana'
                        ? dict.quickCalc.poolMedium
                        : dict.quickCalc.poolLarge;

                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPool(p)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                          pool === p
                            ? 'border-med-olive bg-med-olive text-white shadow-sm'
                            : 'border-med-border text-med-dark bg-med-sand/30 hover:border-med-limestone'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Result & CTA (Right Column) */}
            <div className="lg:col-span-5 bg-med-sand/60 rounded-2xl p-6 sm:p-8 border border-med-border flex flex-col justify-between h-full">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-med-muted">
                  {dict.quickCalc.resultTitle}
                </span>

                {/* Range Display */}
                <div className="mt-3">
                  <div className="font-serif text-3xl sm:text-4xl font-normal text-med-dark tracking-tight">
                    {formatEuro(estimate.lowEstimate)} – {formatEuro(estimate.highEstimate)}
                  </div>
                  <div className="mt-1 text-xs text-med-muted">
                    Approx. {formatEuro(estimate.pricePerM2)} / m² constructed
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-med-border/70 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-med-muted leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-med-olive shrink-0 mt-0.5" />
                    <span>{dict.quickCalc.resultDisclaimer}</span>
                  </div>
                </div>
              </div>

              {/* Next Step CTA */}
              <div className="mt-8 pt-6 border-t border-med-border">
                <h4 className="text-sm font-semibold text-med-dark">
                  {dict.quickCalc.ctaTitle}
                </h4>
                <p className="text-xs text-med-muted mt-1 leading-relaxed">
                  {dict.quickCalc.ctaSubtitle}
                </p>
                <Link
                  href={`/detailed-estimate?m2=${builtAreaM2}&quality=${encodeURIComponent(quality)}&pool=${encodeURIComponent(pool)}`}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-sm font-medium shadow-md shadow-med-dark/10"
                >
                  <span>{dict.quickCalc.ctaButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
