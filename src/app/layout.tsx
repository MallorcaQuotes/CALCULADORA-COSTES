import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.mallorcaquotes.com'),
  title: {
    default: 'MallorcaQuotes — Cost of Building a House in Mallorca',
    template: '%s | MallorcaQuotes.com',
  },
  description:
    'Independent cost estimation platform for building a new home in Mallorca. Calculate indicative construction costs across all municipalities with our market pricing model.',
  keywords: [
    'cost of building a house in Mallorca',
    'construction costs Mallorca',
    'building a villa in Mallorca',
    'new build Mallorca',
    'self-build Mallorca',
    'Mallorca construction budget',
    'presupuesto construir casa Mallorca',
    'Haus bauen Mallorca Kosten',
  ],
  authors: [{ name: 'MallorcaQuotes' }],
  creator: 'MallorcaQuotes.com',
  publisher: 'MallorcaQuotes',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'de_DE'],
    url: 'https://www.mallorcaquotes.com',
    title: 'MallorcaQuotes — Know the Cost Before You Build',
    description:
      'Independent construction cost estimation and project planning platform for new homes in Mallorca.',
    siteName: 'MallorcaQuotes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MallorcaQuotes — Know the Cost Before You Build',
    description: 'Get an indicative construction cost estimate for your new home in Mallorca.',
  },
  alternates: {
    canonical: 'https://www.mallorcaquotes.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-med-sand text-med-dark selection:bg-med-olive/20 selection:text-med-olive-dark antialiased font-sans">
        <LanguageProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
