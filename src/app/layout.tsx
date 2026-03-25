import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { AppHeader } from '@/components/AppHeader';

export const metadata: Metadata = {
  title: 'Countries / States / Cities',
  description: 'Explorer UI for countries, states, and cities.',
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
        <AppHeader />
        <div className='mx-auto max-w-6xl px-4 py-6'>{children}</div>
      </body>
    </html>
  );
}
