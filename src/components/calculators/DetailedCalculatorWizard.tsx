'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { calculateDetailedEstimate } from '@/lib/pricing/engine';
import { QualityLevel, ClimateOption, PoolOption, DetailedEstimateInput } from '@/lib/pricing/types';
import {
  Building2,
  Layers,
  FileUp,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

const MALLORCA_MUNICIPALITIES = [
  'Palma',
  'Calvià',
  'Andratx',
  'Santanyí',
  'Sóller',
  'Pollença',
  'Alcúdia',
  'Santa Maria del Camí',
  'Deià',
  'Valldemossa',
  'Llucmajor',
  'Campos',
  'Felanitx',
  'Artà',
  'Capdepera',
  'Son Servera',
  'Manacor',
  'Inca',
  'Marratxí',
  'Alaró',
  'Esporles',
  'Ses Salines',
  'Other / Otra zona de Mallorca',
];

export default function DetailedCalculatorWizard() {
  const { dict, language } = useTranslation();
  const searchParams = useSearchParams();

  // Prepopulate from query params if passed from Quick Calculator
  const initialM2 = Number(searchParams.get('m2')) || 200;
  const initialQuality = (searchParams.get('quality') as QualityLevel) || 'Media';
  const initialPool = (searchParams.get('pool') as PoolOption) || 'Mediana';

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reference: string;
    lowEstimate: number;
    highEstimate: number;
  } | null>(null);

  // Form State
  const [location, setLocation] = useState<string>('Santanyí');
  const [plotOwned, setPlotOwned] = useState<string>('yes');
  const [builtAreaM2, setBuiltAreaM2] = useState<number>(initialM2);
  const [floors, setFloors] = useState<number>(1);

  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [quality, setQuality] = useState<QualityLevel>(initialQuality);
  const [climateSystem, setClimateSystem] = useState<ClimateOption>('Aerotermia + suelo radiante');
  const [domotics, setDomotics] = useState<boolean>(false);
  const [pool, setPool] = useState<PoolOption>(initialPool);
  const [exteriorParkingSpaces, setExteriorParkingSpaces] = useState<number>(1);
  const [exteriorGardenM2, setExteriorGardenM2] = useState<number>(100);

  const [projectLicences, setProjectLicences] = useState<boolean>(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [nationality, setNationality] = useState<string>('German');
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(false);

  // Live calculation preview
  const liveEstimate = useMemo(() => {
    const input: DetailedEstimateInput = {
      builtAreaM2,
      floors,
      bedrooms,
      bathrooms,
      quality,
      climateSystem,
      domotics,
      pool,
      exteriorParkingSpaces,
      exteriorGardenM2,
      projectLicences,
    };
    return calculateDetailedEstimate(input);
  }, [
    builtAreaM2,
    floors,
    bedrooms,
    bathrooms,
    quality,
    climateSystem,
    domotics,
    pool,
    exteriorParkingSpaces,
    exteriorGardenM2,
    projectLicences,
  ]);

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) {
        alert('File size exceeds 15MB limit.');
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyConsent) {
      setErrorMessage(
        language === 'es'
          ? 'Por favor, acepte la política de privacidad para continuar.'
          : language === 'de'
          ? 'Bitte akzeptieren Sie die Datenschutzerklärung, um fortzufahren.'
          : 'Please accept the privacy policy to continue.'
      );
      return;
    }

    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage(
        language === 'es'
          ? 'Por favor, complete todos los campos de contacto obligatorios.'
          : language === 'de'
          ? 'Bitte füllen Sie alle erforderlichen Kontaktfelder aus.'
          : 'Please fill in all mandatory contact fields.'
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('nationality', nationality);
      formData.append('language', language);
      formData.append('location', location);
      formData.append('plotOwned', plotOwned);

      formData.append('builtAreaM2', builtAreaM2.toString());
      formData.append('floors', floors.toString());
      formData.append('bedrooms', bedrooms.toString());
      formData.append('bathrooms', bathrooms.toString());
      formData.append('quality', quality);
      formData.append('climateSystem', climateSystem);
      formData.append('domotics', domotics ? 'true' : 'false');
      formData.append('pool', pool);
      formData.append('exteriorParkingSpaces', exteriorParkingSpaces.toString());
      formData.append('exteriorGardenM2', exteriorGardenM2.toString());
      formData.append('projectLicences', projectLicences ? 'true' : 'false');

      if (uploadedFile) {
        formData.append('plans', uploadedFile);
      }

      const res = await fetch('/api/estimate/detailed', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit estimate');
      }

      setSuccessData({
        reference: data.reference,
        lowEstimate: data.estimate.lowEstimate,
        highEstimate: data.estimate.highEstimate,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (successData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-med-border shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-med-olive/10 text-med-olive flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-med-olive">
              {dict.detailed.successTitle}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-med-dark font-normal">
              {dict.detailed.successSubtitle} #{successData.reference}
            </h2>
          </div>

          {/* Indicative Range Display */}
          <div className="p-6 rounded-2xl bg-med-sand border border-med-border/80 max-w-md mx-auto">
            <span className="text-xs uppercase tracking-wider text-med-muted font-semibold">
              {dict.quickCalc.resultTitle}
            </span>
            <div className="font-serif text-3xl font-medium text-med-dark mt-1">
              {formatEuro(successData.lowEstimate)} – {formatEuro(successData.highEstimate)}
            </div>
            <p className="text-[11px] text-med-muted mt-2">
              (±5% indicative uncertainty range)
            </p>
          </div>

          <p className="text-sm text-med-muted max-w-xl mx-auto leading-relaxed">
            {dict.detailed.successMessage}
          </p>

          <div className="p-4 rounded-xl bg-med-stone/40 border border-med-border text-xs text-med-dark/80 max-w-lg mx-auto leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-med-olive inline-block mr-1.5 -mt-0.5" />
            <span>{dict.detailed.successNote}</span>
          </div>

          <div className="pt-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-xs font-semibold uppercase tracking-wider"
            >
              <span>Back to Homepage</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-med-muted mb-3">
          <span className={step >= 1 ? 'text-med-olive' : ''}>1. {dict.detailed.step1Title}</span>
          <span className={step >= 2 ? 'text-med-olive' : ''}>2. {dict.detailed.step2Title}</span>
          <span className={step >= 3 ? 'text-med-olive' : ''}>3. {dict.detailed.step3Title}</span>
          <span className={step >= 4 ? 'text-med-olive' : ''}>4. {dict.detailed.step4Title}</span>
        </div>
        <div className="w-full bg-med-stone/60 h-2 rounded-full overflow-hidden">
          <div
            className="bg-med-olive h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Step Form (Left) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-med-border shadow-lg">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: PROJECT & LOCATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-med-olive text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Step 1 of 4</span>
              </div>
              <h3 className="font-serif text-2xl text-med-dark font-normal">
                {dict.detailed.step1Title}
              </h3>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-2">
                  {dict.detailed.locationLabel}
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-med-border bg-med-sand/40 text-med-dark text-sm focus:outline-none focus:ring-1 focus:ring-med-olive"
                >
                  {MALLORCA_MUNICIPALITIES.map((mun) => (
                    <option key={mun} value={mun}>
                      {mun}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plot Ownership */}
              <div>
                <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-2">
                  {dict.detailed.plotLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPlotOwned('yes')}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      plotOwned === 'yes'
                        ? 'border-med-olive bg-med-olive/10 text-med-olive-dark'
                        : 'border-med-border text-med-dark bg-med-sand/30'
                    }`}
                  >
                    {dict.detailed.plotYes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlotOwned('negotiating')}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      plotOwned === 'negotiating'
                        ? 'border-med-olive bg-med-olive/10 text-med-olive-dark'
                        : 'border-med-border text-med-dark bg-med-sand/30'
                    }`}
                  >
                    {dict.detailed.plotNegotiating}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlotOwned('no')}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      plotOwned === 'no'
                        ? 'border-med-olive bg-med-olive/10 text-med-olive-dark'
                        : 'border-med-border text-med-dark bg-med-sand/30'
                    }`}
                  >
                    {dict.detailed.plotNo}
                  </button>
                </div>
              </div>

              {/* Built-up area */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-med-dark uppercase tracking-wider">
                    {dict.detailed.builtAreaLabel}
                  </label>
                  <span className="font-serif text-xl font-medium text-med-dark">
                    {builtAreaM2} m²
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="700"
                  step="10"
                  value={builtAreaM2}
                  onChange={(e) => setBuiltAreaM2(Number(e.target.value))}
                  className="w-full h-2 bg-med-stone rounded-lg appearance-none cursor-pointer accent-med-olive"
                />
              </div>

              {/* Number of Floors */}
              <div>
                <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-2">
                  {dict.detailed.floorsLabel}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFloors(f)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        floors === f
                          ? 'border-med-olive bg-med-olive text-white'
                          : 'border-med-border text-med-dark bg-med-sand/30'
                      }`}
                    >
                      {f} {f === 1 ? 'Floor' : 'Floors'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-xs font-semibold uppercase tracking-wider"
                >
                  <span>{dict.detailed.nextButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PROPERTY SPECIFICATIONS */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-med-olive text-xs font-semibold uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Step 2 of 4</span>
              </div>
              <h3 className="font-serif text-2xl text-med-dark font-normal">
                {dict.detailed.step2Title}
              </h3>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-2">
                    {dict.detailed.bedroomsLabel}
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-med-dark text-sm focus:ring-1 focus:ring-med-olive"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Bedroom' : 'Bedrooms'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-2">
                    {dict.detailed.bathroomsLabel}
                  </label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-med-dark text-sm focus:ring-1 focus:ring-med-olive"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Bathroom' : 'Bathrooms'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quality Level */}
              <div>
                <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-2">
                  {dict.detailed.qualityLabel}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Básica', 'Media', 'Alta'] as QualityLevel[]).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuality(q)}
                      className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                        quality === q
                          ? 'border-med-olive bg-med-olive text-white'
                          : 'border-med-border text-med-dark bg-med-sand/30'
                      }`}
                    >
                      {q === 'Básica'
                        ? dict.quickCalc.qualityBasic
                        : q === 'Media'
                        ? dict.quickCalc.qualityMedium
                        : dict.quickCalc.qualityHigh}
                    </button>
                  ))}
                </div>
              </div>

              {/* Climate System */}
              <div>
                <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-2">
                  {dict.detailed.climateLabel}
                </label>
                <div className="space-y-2">
                  {[
                    { val: 'Convencional', label: dict.detailed.climateConv },
                    { val: 'Aerotermia', label: dict.detailed.climateAero },
                    { val: 'Aerotermia + suelo radiante', label: dict.detailed.climateRadiant },
                  ].map((c) => (
                    <button
                      key={c.val}
                      type="button"
                      onClick={() => setClimateSystem(c.val as ClimateOption)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                        climateSystem === c.val
                          ? 'border-med-olive bg-med-olive/10 text-med-olive-dark'
                          : 'border-med-border text-med-dark bg-med-sand/30'
                      }`}
                    >
                      <span>{c.label}</span>
                      {climateSystem === c.val && <CheckCircle2 className="w-4 h-4 text-med-olive" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Domotics & Pool */}
              <div className="space-y-4 pt-2 border-t border-med-border/60">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-med-dark uppercase tracking-wider">
                      {dict.detailed.domoticsLabel}
                    </div>
                    <div className="text-[11px] text-med-muted">
                      Integrated smart lighting, climate, security & blinds control
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDomotics(!domotics)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      domotics ? 'bg-med-olive' : 'bg-med-stone'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                        domotics ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-2">
                    {dict.detailed.poolLabel}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Sin piscina', 'Pequeña', 'Mediana', 'Grande'] as PoolOption[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPool(p)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                          pool === p
                            ? 'border-med-olive bg-med-olive text-white'
                            : 'border-med-border text-med-dark bg-med-sand/30'
                        }`}
                      >
                        {p === 'Sin piscina'
                          ? dict.quickCalc.poolNo
                          : p === 'Pequeña'
                          ? 'Small'
                          : p === 'Mediana'
                          ? 'Medium'
                          : 'Large'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Garden & Parking */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-med-dark uppercase tracking-wider mb-1">
                      {dict.detailed.parkingLabel}
                    </label>
                    <select
                      value={exteriorParkingSpaces}
                      onChange={(e) => setExteriorParkingSpaces(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-med-border bg-med-sand/40 text-xs"
                    >
                      {[0, 1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Space' : 'Spaces'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-med-dark uppercase tracking-wider mb-1">
                      {dict.detailed.gardenLabel}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="25"
                      value={exteriorGardenM2}
                      onChange={(e) => setExteriorGardenM2(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-med-border bg-med-sand/40 text-xs"
                      placeholder="0 m²"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-med-border text-med-dark hover:bg-med-sand text-xs font-semibold uppercase tracking-wider"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{dict.detailed.prevButton}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-xs font-semibold uppercase tracking-wider"
                >
                  <span>{dict.detailed.nextButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PERMITS & PLANS UPLOAD */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-med-olive text-xs font-semibold uppercase tracking-wider">
                <FileUp className="w-4 h-4" />
                <span>Step 3 of 4</span>
              </div>
              <h3 className="font-serif text-2xl text-med-dark font-normal">
                {dict.detailed.step3Title}
              </h3>

              {/* Licences / Architecture Toggle */}
              <div className="p-5 rounded-2xl bg-med-sand/40 border border-med-border space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-med-dark">
                      {dict.detailed.licencesLabel}
                    </h4>
                    <p className="text-xs text-med-muted mt-1 leading-relaxed">
                      {dict.detailed.licencesHint}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={projectLicences}
                    onChange={(e) => setProjectLicences(e.target.checked)}
                    className="w-5 h-5 rounded border-med-border text-med-olive accent-med-olive mt-1"
                  />
                </div>
              </div>

              {/* Optional Plans Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider">
                  {dict.detailed.plansLabel}
                </label>
                <p className="text-xs text-med-muted leading-relaxed">
                  {dict.detailed.plansHint}
                </p>

                <div className="mt-3 border-2 border-dashed border-med-border rounded-2xl p-6 text-center hover:border-med-olive/60 transition-colors bg-med-sand/20">
                  <input
                    type="file"
                    id="plan-upload"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="plan-upload" className="cursor-pointer block space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-med-stone/60 text-med-olive flex items-center justify-center mx-auto">
                      {uploadedFile ? <FileCheck className="w-6 h-6" /> : <FileUp className="w-6 h-6" />}
                    </div>
                    {uploadedFile ? (
                      <div className="text-xs font-semibold text-med-olive">
                        {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ) : (
                      <>
                        <div className="text-xs font-semibold text-med-dark">
                          Click to select a file or drag and drop
                        </div>
                        <div className="text-[11px] text-med-muted">
                          PDF, JPG or PNG up to 15MB
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-med-border text-med-dark hover:bg-med-sand text-xs font-semibold uppercase tracking-wider"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{dict.detailed.prevButton}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-xs font-semibold uppercase tracking-wider"
                >
                  <span>{dict.detailed.nextButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONTACT & REVIEW */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-2 text-med-olive text-xs font-semibold uppercase tracking-wider">
                <UserCheck className="w-4 h-4" />
                <span>Step 4 of 4</span>
              </div>
              <h3 className="font-serif text-2xl text-med-dark font-normal">
                {dict.detailed.step4Title}
              </h3>
              <p className="text-xs text-med-muted">
                {dict.detailed.contactTitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
                    {dict.detailed.firstName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-xs focus:ring-1 focus:ring-med-olive"
                    placeholder="e.g. John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
                    {dict.detailed.lastName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-xs focus:ring-1 focus:ring-med-olive"
                    placeholder="e.g. Smith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
                    {dict.detailed.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-xs focus:ring-1 focus:ring-med-olive"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
                    {dict.detailed.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-xs focus:ring-1 focus:ring-med-olive"
                    placeholder="+49 170 1234567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
                  {dict.detailed.nationality}
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-xs focus:ring-1 focus:ring-med-olive"
                  placeholder="e.g. German, British, Spanish, Swiss"
                />
              </div>

              {/* Privacy Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="w-4 h-4 rounded border-med-border text-med-olive accent-med-olive mt-0.5"
                  />
                  <span className="text-[11px] text-med-muted leading-relaxed">
                    {dict.detailed.privacyConsent}
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-med-border text-med-dark hover:bg-med-sand text-xs font-semibold uppercase tracking-wider"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{dict.detailed.prevButton}</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-xs font-semibold uppercase tracking-wider shadow-lg disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{submitting ? dict.detailed.submitting : dict.detailed.submitButton}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Live Project Summary Card (Right) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-med-border shadow-sm space-y-6 sticky top-28">
          <div>
            <span className="text-[11px] uppercase font-semibold tracking-wider text-med-olive">
              Live Indicative Summary
            </span>
            <div className="font-serif text-2xl sm:text-3xl text-med-dark mt-2 font-normal">
              {formatEuro(liveEstimate.lowEstimate)} – {formatEuro(liveEstimate.highEstimate)}
            </div>
            <div className="text-xs text-med-muted mt-1">
              Approx. {formatEuro(liveEstimate.pricePerM2)} / m²
            </div>
          </div>

          <div className="pt-4 border-t border-med-border space-y-2.5 text-xs text-med-dark/90">
            <div className="flex justify-between">
              <span className="text-med-muted">Location:</span>
              <span className="font-medium">{location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-med-muted">Built Area:</span>
              <span className="font-medium">{builtAreaM2} m² ({floors} {floors === 1 ? 'floor' : 'floors'})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-med-muted">Rooms:</span>
              <span className="font-medium">{bedrooms} bed / {bathrooms} bath</span>
            </div>
            <div className="flex justify-between">
              <span className="text-med-muted">Quality:</span>
              <span className="font-medium">{quality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-med-muted">Pool:</span>
              <span className="font-medium">{pool}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-med-muted">Architecture & Licences:</span>
              <span className="font-medium">{projectLicences ? 'Included (+10%)' : 'Excluded'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-med-sand border border-med-border/70 text-[11px] text-med-muted leading-relaxed">
            <ShieldCheck className="w-3.5 h-3.5 text-med-olive inline-block mr-1 -mt-0.5" />
            <span>Indicative estimation. A full 21-trade breakdown dossier will be compiled.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
