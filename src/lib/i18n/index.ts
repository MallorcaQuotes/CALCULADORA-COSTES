import en from './dictionaries/en.json';
import es from './dictionaries/es.json';
import de from './dictionaries/de.json';

export type SupportedLanguage = 'en' | 'es' | 'de';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const dictionaries = {
  en,
  es,
  de,
};

export function getDictionary(lang?: string | null): typeof en {
  if (lang === 'es') return es;
  if (lang === 'de') return de;
  return en; // Default and fallback for unsupported languages
}

export function isValidLanguage(lang: string): lang is SupportedLanguage {
  return ['en', 'es', 'de'].includes(lang);
}
