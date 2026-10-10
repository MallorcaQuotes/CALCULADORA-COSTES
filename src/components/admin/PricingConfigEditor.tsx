'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { PricingItemRate } from '@/lib/pricing/types';

interface PricingConfigEditorProps {
  initialRates: Record<string, PricingItemRate>;
  initialMargin: number;
  initialContingency: number;
  initialLicences: number;
  initialMinDelay: number;
  initialStartHour: number;
  initialEndHour: number;
}

export default function PricingConfigEditor({
  initialRates,
  initialMargin,
  initialContingency,
  initialLicences,
  initialMinDelay,
  initialStartHour,
  initialEndHour,
}: PricingConfigEditorProps) {
  const router = useRouter();
  const [rates, setRates] = useState<Record<string, PricingItemRate>>(initialRates);
  const [marginRate, setMarginRate] = useState<number>(initialMargin);
  const [contingencyRate, setContingencyRate] = useState<number>(initialContingency);
  const [projectLicencesRate, setProjectLicencesRate] = useState<number>(initialLicences);
  const [deliveryMinDelayHours, setDeliveryMinDelayHours] = useState<number>(initialMinDelay);
  const [deliveryWindowStartHour, setDeliveryWindowStartHour] = useState<number>(initialStartHour);
  const [deliveryWindowEndHour, setDeliveryWindowEndHour] = useState<number>(initialEndHour);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRateChange = (key: string, tier: 'Básica' | 'Media' | 'Alta', val: number) => {
    setRates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        rates: {
          ...prev[key].rates,
          [tier]: val,
        },
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marginRate,
          contingencyRate,
          projectLicencesRate,
          deliveryMinDelayHours,
          deliveryWindowStartHour,
          deliveryWindowEndHour,
          rates,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');

      setMessage({ type: 'success', text: '¡Configuración y tarifas actualizadas con éxito!' });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error guardando datos' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Global Business & Delivery Parameters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-med-border shadow-sm space-y-6">
        <h3 className="font-serif text-xl text-med-dark font-medium border-b border-med-border pb-3">
          Parámetros Globales y Reglas de Entrega
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
              Margen Interno del Presupuesto
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={marginRate}
                onChange={(e) => setMarginRate(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-sm font-semibold"
              />
              <span className="text-sm font-semibold text-med-muted">
                ({Math.round(marginRate * 100)}%)
              </span>
            </div>
            <p className="text-[11px] text-med-muted mt-1">
              Distribuido en las partidas. Nunca se muestra al cliente.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
              Rango de Incertidumbre Orientativo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="0.25"
                value={contingencyRate}
                onChange={(e) => setContingencyRate(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-sm font-semibold"
              />
              <span className="text-sm font-semibold text-med-muted">
                (±{Math.round(contingencyRate * 100)}%)
              </span>
            </div>
            <p className="text-[11px] text-med-muted mt-1">
              Rango mínimo y máximo mostrado al usuario.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
              Porcentaje Proyecto / Licencias
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                max="0.5"
                value={projectLicencesRate}
                onChange={(e) => setProjectLicencesRate(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-sm font-semibold"
              />
              <span className="text-sm font-semibold text-med-muted">
                ({Math.round(projectLicencesRate * 100)}%)
              </span>
            </div>
            <p className="text-[11px] text-med-muted mt-1">
              Honorarios de arquitecto y tasas si se seleccionan.
            </p>
          </div>
        </div>

        {/* Delivery window settings */}
        <div className="pt-4 border-t border-med-border grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
              Retraso Mínimo Tras Recepción (Horas)
            </label>
            <input
              type="number"
              min="0"
              max="72"
              value={deliveryMinDelayHours}
              onChange={(e) => setDeliveryMinDelayHours(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-sm font-semibold"
            />
            <p className="text-[11px] text-med-muted mt-1">
              Regla por defecto: 12 horas mínimas antes de enviar el dossier.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
              Ventana de Envío (Hora Inicio)
            </label>
            <input
              type="number"
              min="0"
              max="23"
              value={deliveryWindowStartHour}
              onChange={(e) => setDeliveryWindowStartHour(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-sm font-semibold"
            />
            <p className="text-[11px] text-med-muted mt-1">
              Por defecto: 10:00 (Hora local de Mallorca / Madrid).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-med-dark uppercase tracking-wider mb-1.5">
              Ventana de Envío (Hora Fin)
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={deliveryWindowEndHour}
              onChange={(e) => setDeliveryWindowEndHour(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-med-border bg-med-sand/40 text-sm font-semibold"
            />
            <p className="text-[11px] text-med-muted mt-1">
              Por defecto: 14:00 (Hora local de Mallorca / Madrid).
            </p>
          </div>
        </div>
      </div>

      {/* 21 Trades Rates Table */}
      <div className="bg-white rounded-3xl border border-med-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-med-border flex items-center justify-between bg-med-sand/40">
          <div>
            <h3 className="font-serif text-xl text-med-dark font-medium">
              Tabla de Precios Base por Partida de Obra
            </h3>
            <p className="text-xs text-med-muted mt-0.5">
              Precios unitarios en euros extraídos de la hoja Precios de la plantilla de cálculo
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-med-sand/60 border-b border-med-border text-med-muted uppercase tracking-wider font-semibold text-[10px]">
                <th className="p-3.5 pl-6">Partida de Obra</th>
                <th className="p-3.5 text-center">Unidad</th>
                <th className="p-3.5 text-center">Calidad Básica (€)</th>
                <th className="p-3.5 text-center">Calidad Media (€)</th>
                <th className="p-3.5 text-center pr-6">Calidad Alta (€)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border/60">
              {Object.keys(rates).map((key) => {
                const item = rates[key];
                return (
                  <tr key={key} className="hover:bg-med-sand/30">
                    <td className="p-3.5 pl-6 font-semibold text-med-dark">
                      {item.name}
                    </td>
                    <td className="p-3.5 text-center text-med-muted font-medium">
                      {item.unit}
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        step="0.01"
                        value={item.rates.Básica}
                        onChange={(e) => handleRateChange(key, 'Básica', Number(e.target.value))}
                        className="w-28 p-2 text-center rounded-lg border border-med-border bg-med-sand/20 font-medium text-xs focus:ring-1 focus:ring-med-olive"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        step="0.01"
                        value={item.rates.Media}
                        onChange={(e) => handleRateChange(key, 'Media', Number(e.target.value))}
                        className="w-28 p-2 text-center rounded-lg border border-med-border bg-med-sand/20 font-medium text-xs focus:ring-1 focus:ring-med-olive"
                      />
                    </td>
                    <td className="p-2 text-center pr-6">
                      <input
                        type="number"
                        step="0.01"
                        value={item.rates.Alta}
                        onChange={(e) => handleRateChange(key, 'Alta', Number(e.target.value))}
                        className="w-28 p-2 text-center rounded-lg border border-med-border bg-med-sand/20 font-medium text-xs focus:ring-1 focus:ring-med-olive"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-xs font-semibold uppercase tracking-wider shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Guardando Cambios...' : 'Guardar Configuración de Precios'}</span>
        </button>
      </div>
    </form>
  );
}
