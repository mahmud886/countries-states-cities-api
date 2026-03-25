'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  root.style.colorScheme = theme;
  localStorage.setItem('theme', theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const initial = stored === 'light' || stored === 'dark' ? (stored as Theme) : getSystemTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  return (
    <button
      type='button'
      className='rounded-md border bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] shadow-sm hover:bg-[var(--surface-2)]'
      onClick={() => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        applyTheme(next);
      }}
      aria-label='Toggle theme'
    >
      {theme === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}
