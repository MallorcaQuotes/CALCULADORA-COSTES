import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { checkAdminAuth } from '@/lib/auth/admin';
import { db } from '@/lib/db';
import LeadActionsCard from '@/components/admin/LeadActionsCard';
import {
  ArrowLeft,
  User,
  Building,
  FileText,
  FileDown,
  Layers,
  MapPin,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!checkAdminAuth()) {
    redirect('/admin/login');
  }

  const lead = await db.lead.findUnique({
    where: { id: params.id },
    include: {
      project: true,
      estimate: {
        include: {
          lineItems: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      },
      approval: true,
      delivery: true,
    },
  });

  if (!lead) {
    notFound();
  }

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2.5 rounded-xl border border-med-border bg-white hover:bg-med-sand text-med-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-med-dark font-normal">
                Presupuesto #{lead.reference}
              </h1>
              <span className="text-xs uppercase font-semibold px-2.5 py-0.5 rounded-full bg-med-stone text-med-dark">
                Idioma: {lead.language.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-med-muted mt-0.5">
              Recibido el {new Date(lead.createdAt).toLocaleString('es-ES', {
                timeZone: 'Europe/Madrid',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })} (Hora de Mallorca)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Project Specs & Breakdown Table */}
        <div className="lg:col-span-8 space-y-8">
          {/* Customer & Project Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="bg-white rounded-3xl p-6 border border-med-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-med-olive">
                <User className="w-4 h-4" />
                <span>Datos del Cliente</span>
              </div>
              <div className="space-y-2 text-xs text-med-dark">
                <div>
                  <span className="text-med-muted block">Nombre Completo:</span>
                  <span className="font-semibold text-sm">{lead.firstName} {lead.lastName}</span>
                </div>
                <div>
                  <span className="text-med-muted block">Email de Contacto:</span>
                  <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline font-medium">
                    {lead.email}
                  </a>
                </div>
                <div>
                  <span className="text-med-muted block">Teléfono:</span>
                  <a href={`tel:${lead.phone}`} className="font-medium">
                    {lead.phone}
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-med-muted block">Nacionalidad:</span>
                    <span className="font-medium">{lead.nationality}</span>
                  </div>
                  <div>
                    <span className="text-med-muted block">Idioma Solicitado:</span>
                    <span className="font-medium uppercase">{lead.language} (PDF en este idioma)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Specs */}
            <div className="bg-white rounded-3xl p-6 border border-med-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-med-olive">
                <Building className="w-4 h-4" />
                <span>Parámetros de la Vivienda</span>
              </div>
              <div className="space-y-1.5 text-xs text-med-dark">
                <div className="flex justify-between">
                  <span className="text-med-muted">Municipio:</span>
                  <span className="font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-med-olive" />
                    {lead.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-med-muted">Solar en propiedad:</span>
                  <span className="font-medium capitalize">{lead.plotOwned === 'yes' ? 'Sí' : lead.plotOwned === 'negotiating' ? 'En negociación' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-med-muted">Superficie construida:</span>
                  <span className="font-medium">{lead.project?.builtAreaM2} m² ({lead.project?.floors} plantas)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-med-muted">Distribución:</span>
                  <span className="font-medium">{lead.project?.bedrooms} hab. / {lead.project?.bathrooms} baños</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-med-muted">Calidad constructiva:</span>
                  <span className="font-semibold">{lead.project?.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-med-muted">Climatización:</span>
                  <span className="font-medium">{lead.project?.climateSystem}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-med-muted">Domótica:</span>
                  <span className="font-medium">{lead.project?.domotics ? 'Sí (+ Smart Home)' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-med-muted">Piscina:</span>
                  <span className="font-medium">{lead.project?.pool}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-med-muted">Proyecto / Licencias:</span>
                  <span className="font-semibold text-med-olive">
                    {lead.project?.projectLicences ? 'Incluido (+10%)' : 'No incluido'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Architectural Plans */}
          {lead.plansFileUrl && (
            <div className="bg-white rounded-3xl p-6 border border-med-border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-med-dark">
                    Plano de Arquitectura Adjuntado por el Cliente
                  </h4>
                  <p className="text-xs text-med-muted mt-0.5">
                    {lead.plansFileName || 'Documento de proyecto'}
                  </p>
                </div>
              </div>
              <a
                href={`/api/admin/download/${lead.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-med-stone/60 hover:bg-med-stone text-med-dark text-xs font-semibold transition-colors border border-med-border"
              >
                <FileDown className="w-4 h-4" />
                <span>Descargar Plano</span>
              </a>
            </div>
          )}

          {/* Itemized 21-Trade Table */}
          <div className="bg-white rounded-3xl border border-med-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-med-border flex items-center justify-between bg-med-sand/40">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-med-olive" />
                <h3 className="font-serif text-lg text-med-dark font-medium">
                  Desglose de Partidas del Presupuesto (21 Oficios)
                </h3>
              </div>
              <span className="text-xs text-med-muted">
                Versión Tarifas: {lead.estimate?.pricingVersion}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-med-sand/60 border-b border-med-border text-med-muted uppercase tracking-wider font-semibold text-[10px]">
                    <th className="p-3.5 pl-6">Partida de Obra</th>
                    <th className="p-3.5 text-right">Cantidad</th>
                    <th className="p-3.5 text-center">Unidad</th>
                    <th className="p-3.5 text-right">Precio Unitario</th>
                    <th className="p-3.5 pr-6 text-right">Total Partida (€)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-med-border/60">
                  {lead.estimate?.lineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-med-sand/30">
                      <td className="p-3.5 pl-6 font-medium text-med-dark">
                        {item.name}
                      </td>
                      <td className="p-3.5 text-right text-med-muted">
                        {item.quantity}
                      </td>
                      <td className="p-3.5 text-center text-med-muted">
                        {item.unit}
                      </td>
                      <td className="p-3.5 text-right text-med-muted">
                        {formatEuro(item.unitPrice)}
                      </td>
                      <td className="p-3.5 pr-6 text-right font-semibold text-med-dark">
                        {formatEuro(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-med-stone/40 border-t border-med-border font-bold text-xs">
                    <td colSpan={4} className="p-4 pl-6 text-med-dark uppercase tracking-wider">
                      Total Central Presupuestado
                    </td>
                    <td className="p-4 pr-6 text-right font-serif text-base text-med-dark">
                      {formatEuro(lead.estimate?.centralTotal || 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Financial Overview */}
        <div className="lg:col-span-4 space-y-6">
          {/* Actions Component */}
          <LeadActionsCard
            leadId={lead.id}
            reference={lead.reference}
            currentStatus={lead.status}
            scheduledFor={lead.delivery?.scheduledFor}
            sentAt={lead.delivery?.sentAt}
          />

          {/* Indicative Range Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-med-border shadow-sm space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-med-muted">
              Resumen Económico
            </span>

            <div>
              <div className="text-xs text-med-muted">Rango Orientativo al Cliente (±5%):</div>
              <div className="font-serif text-2xl sm:text-3xl text-med-dark mt-1 font-medium">
                {formatEuro(lead.estimate?.lowEstimate || 0)} – {formatEuro(lead.estimate?.highEstimate || 0)}
              </div>
            </div>

            <div className="pt-3 border-t border-med-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-med-muted">Total Central Calculado:</span>
                <span className="font-semibold">{formatEuro(lead.estimate?.centralTotal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-med-muted">Precio por m² construido:</span>
                <span className="font-semibold">
                  {formatEuro(Math.round((lead.estimate?.centralTotal || 0) / (lead.project?.builtAreaM2 || 1)))} / m²
                </span>
              </div>
              {lead.project?.projectLicences && (
                <div className="flex justify-between text-med-olive">
                  <span>Partida Arquitecto y Licencias (10%):</span>
                  <span className="font-semibold">{formatEuro(lead.estimate?.projectLicencesAmount || 0)}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <a
                href={`/api/admin/leads/${lead.id}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-med-border bg-med-sand hover:bg-med-stone/60 transition-colors text-xs font-semibold uppercase tracking-wider text-med-dark"
              >
                <FileDown className="w-4 h-4" />
                <span>Descargar PDF en {lead.language.toUpperCase()}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
