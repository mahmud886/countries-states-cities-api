import { AppShell } from '@/components/AppShell';
import { NavigationProvider } from '@/components/NavigationProvider';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import './globals.css';

const metadataBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    default: 'Location Manager',
    template: '%s · Location Manager',
  },
  description:
    'Explorer UI for countries, states, cities, regions, and subregions with map previews, search, and pagination.',
  keywords: [
    'countries',
    'states',
    'cities',
    'regions',
    'subregions',
    'geodata',
    'location manager',
    'openstreetmap',
    'supabase',
    'rest api',
    'openapi',
    'swagger',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Location Manager',
    images: [
      { url: '/og-dark.png', width: 1200, height: 630, alt: 'Location Manager' },
      { url: '/og-light.png', width: 1200, height: 630, alt: 'Location Manager' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-dark.png', '/og-light.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <Script id='theme-init' strategy='beforeInteractive'>
          {`(() => {
  try {
    const stored = localStorage.getItem('theme');
    const theme =
      stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    root.style.colorScheme = theme;
  } catch {}
})();`}
        </Script>
      </head>
      <body className='min-h-screen'>
        <Suspense fallback={null}>
          <NavigationProvider>
            <AppShell>{children}</AppShell>
          </NavigationProvider>
        </Suspense>
      </body>
    </html>
  );
}
