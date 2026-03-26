import { MapEmbed } from '@/components/MapEmbed';
import { Pagination } from '@/components/Pagination';
import { SearchForm } from '@/components/SearchForm';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { osmHref } from '@/lib/maps/osm';
import { internalApiUrl } from '@/lib/server/internalApi';
import Link from 'next/link';

type SearchParams = Record<string, string | string[] | undefined>;

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as {
    success: boolean;
    data: Array<{
      id: number;
      name: string;
      iso2: string | null;
      iso3: string | null;
      capital: string | null;
      emoji: string | null;
      latitude: number | null;
      longitude: number | null;
      region: { id: number; name: string } | null;
      subregion: { id: number; name: string } | null;
    }>;
    meta: { page: number; limit: number; total: number };
  };
}

export default async function CountriesPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const focus = typeof searchParams.focus === 'string' ? searchParams.focus : undefined;
  const focusId = focus && /^\d+$/.test(focus) ? Number.parseInt(focus, 10) : null;

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string' && v.length) qs.set(k, v);
  }

  const json = await fetchJson(await internalApiUrl('/api/countries', qs.toString()));
  const focusedFromList = focusId ? json.data.find((c) => c.id === focusId) : null;

  const fetchCountry = async (id: number) => {
    const res = await fetch(await internalApiUrl(`/api/countries/${id}`), { cache: 'no-store' });
    if (!res.ok) return null;
    const j = (await res.json()) as { data?: any };
    return j.data as {
      id: number;
      name: string;
      emoji: string | null;
      iso2: string | null;
      capital: string | null;
      latitude: number | null;
      longitude: number | null;
      region: { id: number; name: string } | null;
      subregion: { id: number; name: string } | null;
    };
  };

  const focused = focusedFromList ?? (focusId ? await fetchCountry(focusId) : null);

  const focusHref = (id: number) => {
    const next = new URLSearchParams(qs.toString());
    next.set('focus', String(id));
    return `/countries?${next.toString()}`;
  };

  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-[var(--text)]'>Countries Directory</h1>
          <p className='mt-1 text-sm text-[var(--text-muted)]'>
            {json.meta.total} total · Search by name · Preview on map · Open details
          </p>
        </div>
        <div className='w-full sm:max-w-md'>
          <SearchForm placeholder='Search countries (e.g. Bangladesh)' />
        </div>
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <Card>
            <CardHeader
              title='Countries'
              description={`Page ${json.meta.page} · Limit ${json.meta.limit}`}
              right={
                <ButtonLink href='/regions' variant='outline' size='sm'>
                  Regions →
                </ButtonLink>
              }
            />
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead className='bg-[var(--surface-2)] text-[var(--text-muted)]'>
                  <tr>
                    <th className='px-5 py-3'>Country</th>
                    <th className='px-5 py-3'>ISO2</th>
                    <th className='px-5 py-3'>Capital</th>
                    <th className='px-5 py-3'>Preview</th>
                    <th className='px-5 py-3 text-right'>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {json.data.length ? (
                    json.data.map((c) => {
                      const active = focused?.id === c.id;
                      return (
                        <tr
                          key={c.id}
                          className={`border-t hover:bg-[var(--surface-2)] ${active ? 'bg-[var(--surface-2)]' : ''}`}
                        >
                          <td className='px-5 py-3'>
                            <div className='flex items-center justify-between gap-4'>
                              <Link
                                className='font-medium text-[var(--text)] hover:underline'
                                href={`/countries/${c.id}`}
                              >
                                <span className='mr-2'>{c.emoji ?? '🌍'}</span>
                                {c.name}
                              </Link>
                              <Link className='text-xs underline text-[var(--text)]' href={focusHref(c.id)}>
                                Focus
                              </Link>
                            </div>
                          </td>
                          <td className='px-5 py-3 text-[var(--text-muted)]'>{c.iso2 ?? '-'}</td>
                          <td className='px-5 py-3 text-[var(--text-muted)]'>{c.capital ?? '-'}</td>
                          <td className='px-5 py-3 text-[var(--text-muted)]'>
                            {c.latitude != null && c.longitude != null ? (
                              <a
                                className='underline text-[var(--text)]'
                                href={osmHref(c.latitude, c.longitude, 5)}
                                target='_blank'
                                rel='noreferrer'
                              >
                                Map →
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className='px-5 py-3 text-right font-mono text-xs text-[var(--text-muted)]'>{c.id}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className='border-t'>
                      <td className='px-5 py-10 text-center text-sm text-[var(--text-muted)]' colSpan={5}>
                        No countries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <CardBody className='pt-3'>
              <Pagination
                page={json.meta.page}
                limit={json.meta.limit}
                total={json.meta.total}
                pathname='/countries'
                searchParams={searchParams}
              />
            </CardBody>
          </Card>
        </div>

        <div className='flex flex-col gap-6 lg:col-span-4'>
          {focused && focused.latitude != null && focused.longitude != null ? (
            <MapEmbed
              title={`Preview: ${focused.emoji ?? '🌍'} ${focused.name}`}
              lat={focused.latitude}
              lng={focused.longitude}
              zoom={5}
            />
          ) : (
            <Card>
              <CardHeader title='Map preview' description='Select a row using Focus' />
              <CardBody>
                <div className='text-sm text-[var(--text-muted)]'>
                  Pick any country and click <span className='font-semibold text-[var(--text)]'>Focus</span> to show a
                  map preview here.
                </div>
              </CardBody>
            </Card>
          )}

          {focused ? (
            <Card>
              <CardHeader title='Details' description='Quick info' />
              <CardBody className='space-y-2 text-sm'>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-[var(--text-muted)]'>Flag</span>
                  <span className='text-3xl leading-none'>{focused.emoji ?? '🌍'}</span>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-[var(--text-muted)]'>Name</span>
                  <span className='text-[var(--text)]'>{focused.name}</span>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-[var(--text-muted)]'>ISO2</span>
                  <span className='text-[var(--text)]'>{focused.iso2 ?? '—'}</span>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-[var(--text-muted)]'>Region</span>
                  <span className='text-[var(--text)]'>{focused.region?.name ?? '—'}</span>
                </div>
                <div className='pt-2'>
                  <ButtonLink href={`/countries/${focused.id}`} variant='primary' size='sm'>
                    Open details →
                  </ButtonLink>
                </div>
              </CardBody>
            </Card>
          ) : null}
        </div>
      </div>
    </main>
  );
}
