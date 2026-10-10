import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy — MallorcaQuotes',
  description: 'Cookie policy and technical storage settings for MallorcaQuotes.com.',
};

export default function CookiesPage() {
  return (
    <div className="bg-med-sand min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-med-border shadow-sm space-y-6 text-xs text-med-dark/90 leading-relaxed font-sans">
        <h1 className="font-serif text-3xl text-med-dark font-normal">
          Cookie Policy (Política de Cookies)
        </h1>
        <p className="text-med-muted">Last updated: September 2026</p>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm text-med-dark uppercase tracking-wider">1. What are Cookies?</h2>
          <p>
            Cookies are small text files that websites store on your computer or mobile device when you browse. They are widely used to make websites work efficiently, remember user preferences, and provide analytical information to website owners.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm text-med-dark uppercase tracking-wider">2. Cookies We Use</h2>
          <p>
            MallorcaQuotes uses minimal, privacy-conscious cookies strictly necessary for the technical operation of the website:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-med-muted">
            <li>
              <strong>Language Preference (`mq_lang`):</strong> Stores your chosen interface language (English, Spanish, or German) so your preferences persist across page navigation.
            </li>
            <li>
              <strong>Admin Session (`mq_admin_session`):</strong> An encrypted authentication session token strictly limited to the private administration portal.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm text-med-dark uppercase tracking-wider">3. Managing Cookies</h2>
          <p>
            You can configure your browser to block or delete cookies at any time through your browser settings. However, disabling technical cookies may impact your ability to preserve language preferences across sessions.
          </p>
        </section>
      </div>
    </div>
  );
}
