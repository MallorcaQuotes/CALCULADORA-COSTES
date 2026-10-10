'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/i18n';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs tracking-wider uppercase font-medium rounded-full bg-med-stone/60 hover:bg-med-stone text-med-dark transition-colors duration-200 border border-med-border"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-med-olive" />
        <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
        <ChevronDown className="w-3 h-3 text-med-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-gray-100 z-50 overflow-hidden">
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                  language === l.code
                    ? 'bg-med-sand font-semibold text-med-dark'
                    : 'text-med-muted hover:bg-med-sand/50 hover:text-med-dark'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </span>
                {language === l.code && (
                  <span className="w-1.5 h-1.5 rounded-full bg-med-olive" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
