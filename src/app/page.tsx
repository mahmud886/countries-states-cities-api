import { MapEmbed } from '@/components/MapEmbed';
import { SpotlightCard } from '@/components/SpotlightCard';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icons';
import { StatCard } from '@/components/ui/StatCard';
import { internalApiUrl } from '@/lib/server/internalApi';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard overview with totals, geo coverage, spotlight, and top lists for countries and cities.',
};

export default async function HomePage() {
  const dashboardRes = await fetch(await internalApiUrl('/api/dashboard'), { cache: 'no-store' });
  const dashboardJson = (await dashboardRes.json()) as {
    success: boolean;
    data: {
      totals: {
        countries: number;
        states: number;
        cities: number;
        regions: number;
        subregions: number;
      };
      coverage: {
        countriesWithCoords: number;
        statesWithCoords: number;
        citiesWithCoords: number;
      };
      top: {
        countriesByPopulation: Array<{
          id: number;
          name: string;
          emoji: string | null;
          population: number | null;
          latitude: number | null;
          longitude: number | null;
        }>;
        citiesByPopulation: Array<{
          id: number;
          name: string;
          country_id: number;
          state_id: number;
          population: number | null;
          latitude: number | null;
          longitude: number | null;
        }>;
      };
    };
  };

  const spotlightRes = await fetch(await internalApiUrl('/api/dashboard/spotlight'), { cache: 'no-store' });
  const spotlightJson = (await spotlightRes.json()) as { success: boolean; data: any };
  const dashboard = dashboardJson.data;
  const totals = dashboard?.totals;
  const coverage = dashboard?.coverage;
  const top = dashboard?.top;

  const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);
  const formatNumber = (n: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);

  return (
    <main>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <h1 className='text-2xl font-semibold text-(--text)'>Dashboard Overview</h1>
              <Badge>Location Manager</Badge>
              <Badge>Light/Dark</Badge>
              <Badge>Supabase</Badge>
            </div>
            <p className='mt-2 text-sm text-(--text-muted)'>
              Explore countries, states, cities, regions, and subregions. Use built-in search, pagination, and map
              previews.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <ButtonLink href='/countries' variant='primary'>
              Open directory
            </ButtonLink>
            <ButtonLink href='/api/docs' variant='outline'>
              <span className='flex items-center gap-2'>
                <Icon name='swagger' className='h-4 w-4' />
                Swagger
              </span>
            </ButtonLink>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          <StatCard label='Countries' value={totals?.countries ?? '—'} accent='primary' />
          <StatCard label='States' value={totals?.states ?? '—'} accent='secondary' />
          <StatCard label='Cities' value={totals?.cities ?? '—'} accent='tertiary' />
          <StatCard label='Regions' value={totals?.regions ?? '—'} accent='neutral' />
          <StatCard label='Subregions' value={totals?.subregions ?? '—'} accent='neutral' />
        </div>

        <div className='grid gap-6 lg:grid-cols-12 lg:items-stretch'>
          <div className='lg:col-span-8'>
            <MapEmbed
              title='Global map'
              lat={20}
              lng={0}
              zoom={2}
              className='lg:h-[calc(100vh-438px)]'
              heightClassName='flex-1'
            />
          </div>
          <div className='flex flex-col gap-6 lg:col-span-4 lg:h-[calc(100vh-438px)] lg:justify-between'>
            <Card>
              <CardHeader title='Geo coverage' description='How many records have coordinates?' />
              <CardBody className='space-y-3 text-sm'>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-(--text-muted)'>Countries</span>
                  <span className='text-(--text)'>
                    {coverage && totals ? `${pct(coverage.countriesWithCoords, totals.countries)}%` : '—'}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-(--text-muted)'>States</span>
                  <span className='text-(--text)'>
                    {coverage && totals ? `${pct(coverage.statesWithCoords, totals.states)}%` : '—'}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-(--text-muted)'>Cities</span>
                  <span className='text-(--text)'>
                    {coverage && totals ? `${pct(coverage.citiesWithCoords, totals.cities)}%` : '—'}
                  </span>
                </div>
                <div className='pt-2'>
                  <ButtonLink href='/countries' variant='outline' size='sm'>
                    <span className='flex items-center gap-2'>
                      <Icon name='map' className='h-4 w-4' />
                      Explore maps
                    </span>
                  </ButtonLink>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title='Quick actions'
                description='Jump to key screens'
                right={
                  <Link className='text-sm underline text-(--text)' href='/docs'>
                    Docs →
                  </Link>
                }
              />
              <CardBody className='grid gap-2'>
                <Link
                  className='rounded-xl border bg-(--surface) px-4 py-3 text-sm text-(--text) shadow-sm hover:bg-(--surface-2)'
                  href='/countries'
                >
                  Countries directory →
                </Link>
                <Link
                  className='rounded-xl border bg-(--surface) px-4 py-3 text-sm text-(--text) shadow-sm hover:bg-(--surface-2)'
                  href='/regions'
                >
                  Regions & subregions →
                </Link>
                <Link
                  className='rounded-xl border bg-(--surface) px-4 py-3 text-sm text-(--text) shadow-sm hover:bg-(--surface-2)'
                  href='/api/openapi'
                >
                  OpenAPI JSON →
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-12'>
          <div className='lg:col-span-7'>
            <SpotlightCard initial={spotlightJson.data ?? null} />
          </div>
          <div className='flex flex-col gap-6 lg:col-span-5'>
            <Card>
              <CardHeader
                title='Top countries'
                description='By population (quick open)'
                right={
                  <Link className='text-sm underline text-(--text)' href='/countries?sort=population&order=desc'>
                    View →
                  </Link>
                }
              />
              <CardBody className='space-y-2 text-sm'>
                {top?.countriesByPopulation?.length ? (
                  top.countriesByPopulation.map((c) => (
                    <Link
                      key={c.id}
                      className='flex items-center justify-between gap-3 rounded-xl border bg-(--surface) px-3 py-2 shadow-sm hover:bg-(--surface-2)'
                      href={`/countries/${c.id}`}
                    >
                      <span className='flex min-w-0 items-center gap-2'>
                        <span className='text-lg leading-none'>{c.emoji ?? '🌍'}</span>
                        <span className='truncate text-(--text)'>{c.name}</span>
                      </span>
                      <span className='text-xs text-(--text-muted)'>
                        {typeof c.population === 'number' ? formatNumber(c.population) : '—'}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className='text-(--text-muted)'>No data</div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title='Top cities'
                description='By population (quick open)'
                right={
                  <Link className='text-sm underline text-(--text)' href='/cities?sort=population&order=desc'>
                    View →
                  </Link>
                }
              />
              <CardBody className='space-y-2 text-sm'>
                {top?.citiesByPopulation?.length ? (
                  top.citiesByPopulation.map((c) => (
                    <Link
                      key={c.id}
                      className='flex items-center justify-between gap-3 rounded-xl border bg-(--surface) px-3 py-2 shadow-sm hover:bg-(--surface-2)'
                      href={`/cities/${c.id}`}
                    >
                      <span className='flex min-w-0 items-center gap-2'>
                        <Icon name='cities' className='h-4 w-4 text-(--text-muted)' />
                        <span className='truncate text-(--text)'>{c.name}</span>
                      </span>
                      <span className='text-xs text-(--text-muted)'>
                        {typeof c.population === 'number' ? formatNumber(c.population) : '—'}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className='text-(--text-muted)'>No data</div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
