import './globals.css';
import type { Metadata, Viewport } from 'next';
import { StoreProvider } from '@/lib/store';
import DemoGuide from '@/components/DemoGuide';

const SITE = 'https://ilovetests.hatemsoliman.dev';
const description = 'iLoveTests: AI-assisted exam marking and learning-gap detection for Grades 1–5. The teacher confirms every step. CSEN 909 HCI prototype.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'iLoveTests – exam marking and learning gaps for Grades 1–5',
  description,
  applicationName: 'iLoveTests',
  alternates: { canonical: '/', languages: { en: '/', 'x-default': '/' } },
  manifest: '/manifest.webmanifest',
  icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/icon-192.png', sizes: '192x192' }], apple: '/icon-192.png' },
  openGraph: { type: 'website', url: SITE, siteName: 'iLoveTests', title: 'iLoveTests – Find the gaps. Close the gaps.', description, images: [{ url: SITE + '/og.png', width: 1280, height: 640, alt: 'iLoveTests' }] },
  twitter: { card: 'summary_large_image', title: 'iLoveTests – Find the gaps. Close the gaps.', description, images: [SITE + '/og.png'] },
};
export const viewport: Viewport = { themeColor: '#102C41' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'iLoveTests',
  url: SITE,
  description,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any (web browser)',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Photo hand-in with blur check', 'Teacher checks the text the AI read', 'AI-suggested marks per mark-scheme step', 'Teacher confirms or overrides every grade', 'Red flags and class-wide mistakes', 'Kind per-question feedback and practice', 'Parent weekly digest', 'Audit trail'],
  license: 'https://github.com/CodeNKoffee/csen909-ilovetests/blob/main/LICENSE',
  codeRepository: 'https://github.com/CodeNKoffee/csen909-ilovetests',
  author: { '@type': 'Person', name: 'Hatem Soliman', url: 'https://hatemsoliman.dev' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <noscript>
          <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
            iLoveTests is an interactive prototype of AI-assisted exam marking for Grades 1–5, where the teacher confirms every step. Please turn on JavaScript to try it. Source code: <a href="https://github.com/CodeNKoffee/csen909-ilovetests">https://github.com/CodeNKoffee/csen909-ilovetests</a>
          </div>
        </noscript>
        <StoreProvider>
          {children}
          <DemoGuide />
        </StoreProvider>
      </body>
    </html>
  );
}
