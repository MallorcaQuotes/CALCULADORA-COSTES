'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Header() {
  const { dict } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-med-sand/90 border-b border-med-border/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-med-dark flex items-center justify-center text-med-sand font-serif font-bold text-lg shadow-sm group-hover:bg-med-olive transition-colors">
            MQ
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-tight text-xl font-medium text-med-dark">
              Mallorca<span className="font-sans font-light text-med-muted">Quotes</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-med-muted font-sans -mt-1">
              Independent Cost Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-med-dark/80">
          <Link
            href="/#quick-calculator"
            className="hover:text-med-olive transition-colors"
          >
            {dict.nav.quickCalculator}
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-med-olive transition-colors"
          >
            {dict.nav.howItWorks}
          </Link>
          <Link
            href="/blog"
            className="hover:text-med-olive transition-colors"
          >
            {dict.nav.blog}
          </Link>
          <Link
            href="/about"
            className="hover:text-med-olive transition-colors"
          >
            {dict.nav.about}
          </Link>
          <Link
            href="/contact"
            className="hover:text-med-olive transition-colors"
          >
            {dict.nav.contact}
          </Link>
        </nav>

        {/* CTA & Language Switcher */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/detailed-estimate"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors shadow-sm"
          >
            <span>{dict.nav.detailedEstimate}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-med-dark hover:bg-med-stone/50 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-med-border bg-med-sand px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/#quick-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-med-dark hover:text-med-olive"
          >
            {dict.nav.quickCalculator}
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-med-dark hover:text-med-olive"
          >
            {dict.nav.howItWorks}
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-med-dark hover:text-med-olive"
          >
            {dict.nav.blog}
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-med-dark hover:text-med-olive"
          >
            {dict.nav.about}
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-med-dark hover:text-med-olive"
          >
            {dict.nav.contact}
          </Link>
          <div className="pt-2">
            <Link
              href="/detailed-estimate"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-med-dark text-med-sand font-medium text-sm"
            >
              <span>{dict.nav.detailedEstimate}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
