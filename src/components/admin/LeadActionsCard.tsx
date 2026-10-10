'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Send, FileDown, Clock, Calendar, AlertCircle } from 'lucide-react';

interface LeadActionsCardProps {
  leadId: string;
  reference: string;
  currentStatus: string;
  scheduledFor?: Date | null;
  sentAt?: Date | null;
}

export default function LeadActionsCard({
  leadId,
  reference,
  currentStatus,
  scheduledFor,
  sentAt,
}: LeadActionsCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (!confirm(`¿Confirmas la aprobación del presupuesto #${reference}? Se calculará la fecha de envío según la ventana de Madrid (10:00 - 14:00, mín. 12h).`)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/approve`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al aprobar');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm(`¿Seguro que deseas RECHAZAR el presupuesto #${reference}? No se enviará ningún dossier al cliente.`)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/reject`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al rechazar');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNow = async () => {
    if (!confirm(`¿Deseas generar el PDF y ENVIAR el correo ahora mismo al cliente?`)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/send-now`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en el envío');
      alert('¡Presupuesto y PDF enviados correctamente por correo!');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-med-border shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-med-border pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-med-muted">
            Estado de Tramitación
          </span>
          <h3 className="font-serif text-xl text-med-dark font-medium mt-1">
            {currentStatus}
          </h3>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Status Specific Information & Buttons */}
      <div className="space-y-4">
        {currentStatus === 'En revisión' && (
          <>
            <p className="text-xs text-med-muted leading-relaxed">
              El lead ha sido generado y notificado por Telegram. Revisa las características y desglose de partidas. Al aprobar, el sistema calculará automáticamente la siguiente ventana válida de entrega local (10:00–14:00 hora de Mallorca, tras un mínimo de 12 horas).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-med-olive text-white hover:bg-med-olive-dark transition-colors text-xs font-semibold uppercase tracking-wider shadow-sm disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Aprobar Presupuesto</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleReject}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 transition-colors text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Rechazar</span>
              </button>
            </div>
          </>
        )}

        {(currentStatus === 'Aprobado' || currentStatus === 'Programado') && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-blue-800">
                <Calendar className="w-4 h-4" />
                <span>Envío Programado Automático</span>
              </div>
              <div>
                Fecha y hora de entrega:{' '}
                <strong className="text-blue-950">
                  {scheduledFor
                    ? new Date(scheduledFor).toLocaleString('es-ES', {
                        timeZone: 'Europe/Madrid',
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) + ' (Hora de Mallorca)'
                    : 'Calculando...'}
                </strong>
              </div>
              <p className="text-[11px] text-blue-700 mt-1">
                Cumple la regla de mínimo 12 horas y ventana de 10:00 a 14:00 Europa/Madrid.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={handleSendNow}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Ahora (Forzar Envío)</span>
              </button>

              <a
                href={`/api/admin/leads/${leadId}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-med-border text-med-dark hover:bg-med-sand transition-colors text-xs font-semibold uppercase tracking-wider"
              >
                <FileDown className="w-4 h-4" />
                <span>Previsualizar PDF</span>
              </a>
            </div>
          </div>
        )}

        {currentStatus === 'Enviado' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-xs space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>Dossier y Presupuesto Enviados al Cliente</span>
              </div>
              <div>
                Fecha de envío:{' '}
                <strong>
                  {sentAt
                    ? new Date(sentAt).toLocaleString('es-ES', {
                        timeZone: 'Europe/Madrid',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Confirmado'}
                </strong>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={`/api/admin/leads/${leadId}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-xs font-semibold uppercase tracking-wider"
              >
                <FileDown className="w-4 h-4" />
                <span>Descargar PDF Enviado</span>
              </a>
            </div>
          </div>
        )}

        {currentStatus === 'Rechazado' && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs">
            Este presupuesto fue rechazado por el propietario. No se enviará ningún dossier al usuario.
          </div>
        )}
      </div>
    </div>
  );
}
