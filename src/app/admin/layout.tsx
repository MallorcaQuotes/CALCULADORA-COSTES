import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { checkAdminAuth } from '@/lib/auth/admin';
import { LayoutDashboard, Sliders, ExternalLink, LogOut, Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = checkAdminAuth();

  return (
    <div className="min-h-screen bg-med-sand flex flex-col font-sans">
      {/* Top Spanish Admin Bar */}
      <header className="bg-med-dark text-med-sand border-b border-med-dark/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-med-olive text-white flex items-center justify-center font-serif font-bold text-sm">
              MQ
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-tight text-base font-medium text-white">
                MallorcaQuotes <span className="text-xs font-sans text-med-limestone/70">Panel de Control</span>
              </span>
            </div>
          </div>

          {/* Navigation Links in Spanish */}
          <nav className="hidden sm:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold">
            <Link
              href="/admin"
              className="text-med-limestone hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Presupuestos y Leads</span>
            </Link>
            <Link
              href="/admin/precios"
              className="text-med-limestone hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4" />
              <span>Configuración de Precios</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-med-limestone/60 hover:text-med-limestone transition-colors flex items-center gap-1.5"
            >
              <span>Ver Web Pública</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <form action="/api/admin/login" method="POST">
              {/* Logout button */}
              <a
                href="/api/admin/logout-action"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-med-sand transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </a>
            </form>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
