'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type NavigationContextValue = {
  start: (href?: string) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigationStart() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigationStart must be used within NavigationProvider');
  return ctx.start;
}

export function NavigationProvider(props: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pending, setPending] = useState(false);
  const [targetPathname, setTargetPathname] = useState<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const clearTimeoutRef = useRef<number | null>(null);
  const navTokenRef = useRef(0);

  const start = useCallback((href?: string) => {
    navTokenRef.current += 1;
    const token = navTokenRef.current;

    if (clearTimeoutRef.current) window.clearTimeout(clearTimeoutRef.current);
    startedAtRef.current = Date.now();
    if (typeof href === 'string' && href.length) {
      try {
        const url = new URL(href, window.location.href);
        setTargetPathname(url.pathname);
      } catch {
        setTargetPathname(window.location.pathname);
      }
    } else {
      setTargetPathname(window.location.pathname);
    }
    setPending(true);

    clearTimeoutRef.current = window.setTimeout(() => {
      if (navTokenRef.current === token) setPending(false);
    }, 3000);
  }, []);

  const ctxValue = useMemo<NavigationContextValue>(() => ({ start }), [start]);

  const locationKey = `${pathname}?${searchParams?.toString() ?? ''}`;

  useEffect(() => {
    if (!pending) return;
    if (clearTimeoutRef.current) window.clearTimeout(clearTimeoutRef.current);

    const startedAt = startedAtRef.current ?? Date.now();
    const elapsed = Date.now() - startedAt;
    const minDuration = 250;
    const wait = Math.max(0, minDuration - elapsed);

    const token = navTokenRef.current;
    clearTimeoutRef.current = window.setTimeout(() => {
      if (navTokenRef.current === token) setPending(false);
    }, wait);
  }, [locationKey, pending]);

  useEffect(() => {
    if (!pending) setTargetPathname(null);
  }, [pending]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const el = e.target instanceof Element ? e.target : null;
      const anchor = el?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === '_blank') return;
      if (anchor.hasAttribute('download')) return;

      const rawHref = anchor.getAttribute('href') ?? '';
      if (!rawHref) return;
      if (rawHref.startsWith('#')) return;
      if (rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) return;

      const href = anchor.href;
      if (!href) return;
      if (!href.startsWith(window.location.origin)) return;

      start(href);
    };

    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [start]);

  const isDirectoryTarget =
    targetPathname === '/countries' ||
    targetPathname === '/states' ||
    targetPathname === '/cities' ||
    targetPathname === '/regions' ||
    targetPathname === '/subregions';

  return (
    <NavigationContext.Provider value={ctxValue}>
      {pending && isDirectoryTarget ? (
        <div className='fixed bottom-0 left-0 right-0 top-0 z-20 overflow-auto bg-(--bg) lg:left-72'>
          <div className='w-full px-4 py-6 sm:px-6 lg:px-8'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <div className='skeleton h-7 w-44 rounded-md' />
                <div className='mt-2'>
                  <div className='skeleton h-4 w-96 max-w-full rounded-md' />
                </div>
              </div>
              <div className='w-full sm:max-w-md'>
                <div className='skeleton h-10 w-full rounded-md' />
              </div>
            </div>

            <div className='mt-6 grid gap-6 lg:grid-cols-12'>
              <div className='lg:col-span-8'>
                <div className='overflow-hidden rounded-2xl border bg-(--surface) shadow-(--shadow)'>
                  <div className='flex flex-col gap-3 border-b bg-(--surface-2) px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <div className='skeleton h-4 w-28 rounded-md' />
                      <div className='mt-2'>
                        <div className='skeleton h-3 w-56 rounded-md' />
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='skeleton h-9 w-20 rounded-md' />
                      <div className='skeleton h-9 w-16 rounded-md' />
                      <div className='skeleton h-9 w-16 rounded-md' />
                      <div className='skeleton h-9 w-16 rounded-md' />
                      <div className='skeleton h-9 w-24 rounded-md' />
                    </div>
                  </div>

                  <div className='max-h-[calc(100vh-260px)] overflow-auto'>
                    <table className='w-full text-left text-[15px]'>
                      <thead className='bg-(--surface-2)'>
                        <tr>
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <th key={idx} className='px-5 py-4'>
                              <div className='skeleton h-3 w-20 rounded-full' />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 12 }).map((_, rIdx) => (
                          <tr key={rIdx} className='border-t'>
                            {Array.from({ length: 5 }).map((_, cIdx) => (
                              <td key={cIdx} className='px-5 py-4'>
                                {cIdx === 0 ? (
                                  <div className='flex items-center gap-3'>
                                    <div className='skeleton h-8 w-8 flex-none rounded-full' />
                                    <div className='min-w-0'>
                                      <div className='skeleton h-4 w-44 max-w-full rounded-full' />
                                      <div className='mt-2'>
                                        <div className='skeleton h-3 w-32 max-w-full rounded-full' />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className='skeleton h-4 w-32 max-w-full rounded-full' />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className='px-5 pb-5 pt-3'>
                    <div className='skeleton h-4 w-80 max-w-full rounded-md' />
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-6 lg:col-span-4'>
                <div className='overflow-hidden rounded-2xl border bg-(--surface) shadow-(--shadow)'>
                  <div className='flex flex-col gap-2 border-b bg-(--surface-2) px-5 py-4'>
                    <div className='skeleton h-4 w-40 rounded-md' />
                    <div className='skeleton h-3 w-48 rounded-md' />
                  </div>
                  <div className='p-4'>
                    <div className='skeleton h-90 w-full rounded-xl' />
                  </div>
                </div>

                <div className='overflow-hidden rounded-2xl border bg-(--surface) shadow-(--shadow)'>
                  <div className='flex flex-col gap-2 border-b bg-(--surface-2) px-5 py-4'>
                    <div className='skeleton h-4 w-24 rounded-md' />
                    <div className='skeleton h-3 w-44 rounded-md' />
                  </div>
                  <div className='space-y-3 p-5'>
                    <div className='skeleton h-4 w-full rounded-md' />
                    <div className='skeleton h-4 w-5/6 rounded-md' />
                    <div className='skeleton h-4 w-2/3 rounded-md' />
                    <div className='skeleton h-9 w-40 rounded-md' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {pending ? (
        <div className='pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-(--surface-2)'>
          <div className='h-full w-1/2 animate-pulse bg-(--primary)' />
        </div>
      ) : null}
      {props.children}
    </NavigationContext.Provider>
  );
}
