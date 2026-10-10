'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { ShieldCheck, MapPin } from 'lucide-react';

export default function Footer() {
  const { dict } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-med-dark text-med-sand pt-16 pb-12 border-t border-med-dark/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-med-olive flex items-center justify-center text-med-sand font-serif font-bold text-lg">
                MQ
              </div>
              <span className="font-serif tracking-tight text-xl font-medium text-white">
                Mallorca<span className="font-sans font-light text-med-limestone">Quotes</span>
              </span>
            </div>
            <p className="text-med-limestone/80 text-sm max-w-md font-sans leading-relaxed">
              {dict.footer.tagline}
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md text-xs text-med-limestone/70 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-med-sage shrink-0 mt-0.5" />
              <span>{dict.footer.platformNotice}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-med-limestone">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-med-limestone/70">
              <li>
                <Link href="/#quick-calculator" className="hover:text-white transition-colors">
                  {dict.nav.quickCalculator}
                </Link>
              </li>
              <li>
                <Link href="/detailed-estimate" className="hover:text-white transition-colors">
                  {dict.nav.detailedEstimate}
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  {dict.nav.howItWorks}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  {dict.nav.blog}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-med-limestone">
              Balearic Coverage
            </h4>
            <div className="flex items-center gap-2 text-xs text-med-limestone/80">
              <MapPin className="w-3.5 h-3.5 text-med-olive shrink-0" />
              <span>Palma, Calvià, Andratx, Santanyí, Sóller, Pollença & all Balearic municipalities</span>
            </div>

            <div className="pt-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-med-limestone">
                Legal
              </h4>
              <ul className="space-y-1.5 text-xs text-med-limestone/70">
                <li>
                  <Link href="/legal/privacy" className="hover:text-white transition-colors">
                    {dict.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="hover:text-white transition-colors">
                    {dict.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookies" className="hover:text-white transition-colors">
                    {dict.footer.cookies}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-med-limestone/50 gap-4">
          <p>© {currentYear} MallorcaQuotes.com. {dict.footer.rights}</p>
          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="hover:text-med-limestone transition-colors text-[11px]">
              Acceso Propietario (Admin)
            </Link>
            <span>v1.0 Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
