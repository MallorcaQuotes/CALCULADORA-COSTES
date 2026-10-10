import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { checkAdminAuth } from '@/lib/auth/admin';
import { db } from '@/lib/db';
import {
  Inbox,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Send,
  Eye,
  ArrowRight,
  MapPin,
  Maximize2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  if (!checkAdminAuth()) {
    redirect('/admin/login');
  }

  const selectedStatus = searchParams?.status;

  const whereClause = selectedStatus && selectedStatus !== 'todos' ? { status: selectedStatus } : {};

  const [leads, totalCount, pendingCount, approvedCount, sentCount] = await Promise.all([
    db.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        project: true,
        estimate: true,
        delivery: true,
      },
    }),
    db.lead.count(),
    db.lead.count({ where: { status: 'En revisión' } }),
    db.lead.count({ where: { status: { in: ['Aprobado', 'Programado'] } } }),
    db.lead.count({ where: { status: 'Enviado' } }),
  ]);

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'En revisión':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>En revisión</span>
          </span>
        );
      case 'Aprobado':
      case 'Programado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>{status}</span>
          </span>
        );
      case 'Enviado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Enviado al cliente</span>
          </span>
        );
      case 'Rechazado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rechazado</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-med-dark font-normal">
            Gestión de Leads y Presupuestos
          </h1>
          <p className="text-xs text-med-muted mt-1">
            Supervisa las solicitudes de autopromotores, valida estimaciones y programa envíos.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-med-border shadow-sm">
          <div className="flex items-center justify-between text-xs text-med-muted">
            <span className="font-medium uppercase tracking-wider">Total Leads</span>
            <Inbox className="w-4 h-4 text-med-olive" />
          </div>
          <div className="font-serif text-3xl font-medium text-med-dark mt-2">
            {totalCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm bg-amber-50/30">
          <div className="flex items-center justify-between text-xs text-amber-800">
            <span className="font-medium uppercase tracking-wider">Pendientes Revisión</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-3xl font-medium text-amber-900 mt-2">
            {pendingCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm bg-blue-50/30">
          <div className="flex items-center justify-between text-xs text-blue-800">
            <span className="font-medium uppercase tracking-wider">Aprobados / Programados</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-serif text-3xl font-medium text-blue-900 mt-2">
            {approvedCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-green-200 shadow-sm bg-green-50/30">
          <div className="flex items-center justify-between text-xs text-green-800">
            <span className="font-medium uppercase tracking-wider">Dossiers Enviados</span>
            <Send className="w-4 h-4 text-green-600" />
          </div>
          <div className="font-serif text-3xl font-medium text-green-900 mt-2">
            {sentCount}
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-med-border pb-4">
        {[
          { key: 'todos', label: 'Todos los leads' },
          { key: 'En revisión', label: 'En revisión' },
          { key: 'Aprobado', label: 'Aprobados' },
          { key: 'Programado', label: 'Programados' },
          { key: 'Enviado', label: 'Enviados' },
          { key: 'Rechazado', label: 'Rechazados' },
        ].map((tab) => {
          const isActive =
            (!selectedStatus && tab.key === 'todos') || selectedStatus === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key === 'todos' ? '/admin' : `/admin?status=${encodeURIComponent(tab.key)}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? 'bg-med-dark text-med-sand shadow-sm'
                  : 'bg-white text-med-dark border border-med-border hover:bg-med-stone/50'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-med-border shadow-sm overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-med-muted text-sm">
            No se han encontrado solicitudes con el estado seleccionado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-med-sand/60 border-b border-med-border text-med-muted uppercase tracking-wider font-semibold text-[11px]">
                  <th className="p-4">Referencia / Fecha</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Proyecto</th>
                  <th className="p-4">Estimación (€)</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-med-border/60">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-med-sand/40 transition-colors">
                    {/* Referencia y Fecha */}
                    <td className="p-4">
                      <div className="font-semibold text-med-dark text-sm">
                        #{lead.reference}
                      </div>
                      <div className="text-med-muted text-[11px] mt-0.5">
                        {new Date(lead.createdAt).toLocaleString('es-ES', {
                          timeZone: 'Europe/Madrid',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="inline-block mt-1 px-1.5 py-0.5 rounded bg-med-stone/60 text-[10px] text-med-dark font-medium">
                        Web: {lead.language.toUpperCase()}
                      </div>
                    </td>

                    {/* Cliente */}
                    <td className="p-4">
                      <div className="font-medium text-med-dark text-sm">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-med-muted text-[11px]">{lead.email}</div>
                      <div className="text-med-muted text-[11px]">{lead.phone}</div>
                      <div className="text-[10px] text-med-olive font-medium mt-0.5">
                        Nac.: {lead.nationality}
                      </div>
                    </td>

                    {/* Proyecto */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-medium text-med-dark">
                        <MapPin className="w-3.5 h-3.5 text-med-olive shrink-0" />
                        <span>{lead.location}</span>
                      </div>
                      <div className="text-med-muted text-[11px] mt-0.5">
                        {lead.project?.builtAreaM2} m² • {lead.project?.floors} plantas • {lead.project?.quality}
                      </div>
                      <div className="text-[11px] text-med-muted">
                        Piscina: {lead.project?.pool}
                      </div>
                      {lead.plansFileName && (
                        <span className="inline-block mt-1 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          📎 Plano adjunto
                        </span>
                      )}
                    </td>

                    {/* Estimación */}
                    <td className="p-4">
                      {lead.estimate ? (
                        <div>
                          <div className="font-semibold text-med-dark text-xs">
                            {formatEuro(lead.estimate.lowEstimate)} – {formatEuro(lead.estimate.highEstimate)}
                          </div>
                          <div className="text-[10px] text-med-muted">
                            Central: {formatEuro(lead.estimate.centralTotal)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-med-muted">Sin cálculo</span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="p-4">{getStatusBadge(lead.status)}</td>

                    {/* Acción */}
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-xs font-semibold uppercase tracking-wider"
                      >
                        <span>Revisar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
