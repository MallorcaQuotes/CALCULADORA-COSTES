import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — GDPR Compliance',
  description: 'Privacy Policy and data processing terms for MallorcaQuotes.com under EU GDPR.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-med-sand min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-med-border shadow-sm space-y-6 text-xs text-med-dark/90 leading-relaxed font-sans">
        <h1 className="font-serif text-3xl text-med-dark font-normal">
          Privacy Policy (Política de Privacidad)
        </h1>
        <p className="text-med-muted">Last updated: September 2026</p>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm text-med-dark uppercase tracking-wider">1. Data Controller</h2>
          <p>
            The data controller responsible for the processing of personal data collected via MallorcaQuotes.com is MallorcaQuotes (hereinafter &quot;MallorcaQuotes&quot;, &quot;we&quot;, or &quot;us&quot;), operating in accordance with Regulation (EU) 2016/679 (General Data Protection Regulation - GDPR) and the Spanish Ley Orgánica 3/2018 (LOPDGDD).
          </p>
          <p>Contact for privacy matters: <a href="mailto:info@mallorcaquotes.com" className="text-blue-600 underline">info@mallorcaquotes.com</a>.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm text-med-dark uppercase tracking-wider">2. Data We Collect</h2>
          <p>
            We collect personal data only when voluntarily submitted through our Detailed Construction Estimate questionnaire or contact forms. This may include:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-med-muted">
            <li>Identification and contact data: Name, email address, telephone number, nationality.</li>
            <li>Project data: Intended property location in Mallorca, built-up area, architectural quality tier, specifications, and optional plan uploads.</li>
            <li>Technical data: IP address, preferred interface language, and anonymized analytics.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm text-med-dark uppercase tracking-wider">3. Purpose of Processing</h2>
          <p>We process your data strictly to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-med-muted">
            <li>Compute and generate your customized indicative construction cost estimate dossier.</li>
            <li>Deliver your PDF calculation dossier via email.</li>
            <li>Respond to direct contact inquiries and technical questions.</li>
            <li>Maintain internal operational quality, review, and verification.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm text-med-dark uppercase tracking-wider">4. Legal Basis</h2>
          <p>
            The legal basis for processing your data is your explicit consent (GDPR Art. 6.1.a) given when submitting the questionnaire and requesting your estimate dossier, as well as our legitimate interest in delivering a secure and functional service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm text-med-dark uppercase tracking-wider">5. Storage and Security</h2>
          <p>
            All submitted project information and uploaded architectural plans are stored securely in protected storage environments. Uploaded files are not made accessible through public URLs. We do not sell, rent, or trade your personal information to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-sm text-med-dark uppercase tracking-wider">6. Your Rights</h2>
          <p>
            Under the GDPR, you have the right to access, rectify, or erase your personal data, restrict or object to its processing, and request data portability. To exercise any of these rights, please email <a href="mailto:info@mallorcaquotes.com" className="text-blue-600 underline">info@mallorcaquotes.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
