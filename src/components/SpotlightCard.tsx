'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icons';
import { osmEmbedSrc, osmHref } from '@/lib/maps/osm';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Spotlight = {
  id: number;
  name: string;
  emoji: string | null;
  capital: string | null;
  population: number | null;
  latitude: number | null;
  longitude: number | null;
  region: { id: number; name: string } | null;
  subregion: { id: number; name: string; region_id: number } | null;
};

function formatNumber(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

export function SpotlightCard(props: { initial: Spotlight | null }) {
  const [item, setItem] = useState<Spotlight | null>(props.initial);
  const [loading, setLoading] = useState(false);

  const map = useMemo(() => {
    if (!item || item.latitude == null || item.longitude == null) return null;
    return {
      src: osmEmbedSrc(item.latitude, item.longitude, 5),
      href: osmHref(item.latitude, item.longitude, 5),
    };
  }, [item]);

  return (
    <Card>
      <CardHeader
        title={
          <span className='flex items-center gap-2'>
            <Icon name='sparkle' className='h-4 w-4 text-(--primary)' />
            Spotlight
          </span>
        }
        description='Random country with map + quick actions'
        right={
          <Button
            variant='outline'
            size='sm'
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                const res = await fetch('/api/dashboard/spotlight', { cache: 'no-store' });
                const json = (await res.json()) as { success: boolean; data: Spotlight | null };
                setItem(json.data ?? null);
              } finally {
                setLoading(false);
              }
            }}
          >
            <span className='flex items-center gap-2'>
              <Icon name='focus' className='h-4 w-4' />
              Shuffle
            </span>
          </Button>
        }
      />

      <CardBody className='space-y-4'>
        {item ? (
          <>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0'>
                <div className='flex items-center gap-3'>
                  <div className='text-5xl leading-none'>{item.emoji ?? '🌍'}</div>
                  <div className='min-w-0'>
                    <div className='truncate text-lg font-semibold text-(--text)'>{item.name}</div>
                    <div className='mt-1 text-sm text-(--text-muted)'>
                      {item.capital ? `Capital: ${item.capital}` : 'Capital: —'}
                      {typeof item.population === 'number' ? ` · Pop: ${formatNumber(item.population)}` : ''}
                    </div>
                  </div>
                </div>
                <div className='mt-3 flex flex-wrap gap-2 text-sm text-(--text-muted)'>
                  <span className='rounded-md border bg-(--surface-2) px-2 py-1'>
                    Region: {item.region?.name ?? '—'}
                  </span>
                  <span className='rounded-md border bg-(--surface-2) px-2 py-1'>
                    Subregion: {item.subregion?.name ?? '—'}
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <Link
                  className='inline-flex items-center justify-between gap-2 rounded-xl border bg-(--surface) px-3 py-2 text-sm text-(--text) shadow-sm hover:bg-(--surface-2)'
                  href={`/countries/${item.id}`}
                >
                  <span className='flex items-center gap-2'>
                    <Icon name='countries' className='h-4 w-4' />
                    Open
                  </span>
                  <Icon name='chevron-right' className='h-4 w-4' />
                </Link>
                <Link
                  className='inline-flex items-center justify-between gap-2 rounded-xl border bg-(--surface) px-3 py-2 text-sm text-(--text) shadow-sm hover:bg-(--surface-2)'
                  href={`/countries?focus=${item.id}`}
                >
                  <span className='flex items-center gap-2'>
                    <Icon name='focus' className='h-4 w-4' />
                    Focus
                  </span>
                  <Icon name='chevron-right' className='h-4 w-4' />
                </Link>
              </div>
            </div>

            {map ? (
              <div className='overflow-hidden rounded-2xl border bg-(--surface) shadow-sm'>
                <div className='flex items-center justify-between border-b bg-(--surface-2) px-4 py-3'>
                  <div className='text-sm font-semibold text-(--text)'>Map preview</div>
                  <a
                    className='inline-flex items-center gap-2 text-sm underline'
                    href={map.href}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Icon name='map' className='h-4 w-4' />
                    Open map
                  </a>
                </div>
                <div className='h-64'>
                  <iframe
                    title='Spotlight map'
                    src={map.src}
                    className='h-full w-full'
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                  />
                </div>
              </div>
            ) : (
              <div className='rounded-2xl border bg-(--surface-2) p-4 text-sm text-(--text-muted)'>
                No coordinates available for this spotlight.
              </div>
            )}
          </>
        ) : (
          <div className='rounded-2xl border bg-(--surface-2) p-4 text-sm text-(--text-muted)'>
            No spotlight available.
          </div>
        )}
      </CardBody>
    </Card>
  );
}
