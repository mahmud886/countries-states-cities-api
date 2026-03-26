import { MapEmbed } from '@/components/MapEmbed';
import { Pagination } from '@/components/Pagination';
import { SearchForm } from '@/components/SearchForm';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { internalApiUrl } from '@/lib/server/internalApi';
import Link from 'next/link';

type SearchParams = Record<string, string | string[] | undefined>;

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as {
    success: boolean;
    data: Array<{ id: number; name: string; wikidata_id: string | null }>;
    meta: { page: number; limit: number; total: number };
  };
}

export default async function RegionsPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const focus = typeof searchParams.focus === 'string' ? searchParams.focus : undefined;
  const focusId = focus && /^\d+$/.test(focus) ? Number.parseInt(focus, 10) : null;

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string' && v.length) qs.set(k, v);
  }

  const json = await fetchJson(await internalApiUrl('/api/regions', qs.toString()));

  const focusedFromList = focusId ? (json.data.find((r) => r.id === focusId) ?? null) : null;

  const fetchRegion = async (id: number) => {
    const res = await fetch(await internalApiUrl(`/api/regions/${id}`), { cache: 'no-store' });
    if (!res.ok) return null;
    const j = (await res.json()) as { data?: any };
    return j.data as {
      id: number;
      name: string;
      subregions: Array<{ id: number; name: string }>;
    };
  };

  const fetchCenter = async (id: number) => {
    const res = await fetch(await internalApiUrl(`/api/regions/${id}/countries`, 'page=1&limit=50'), {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { data?: Array<{ latitude: number | null; longitude: number | null }> };
    const coords = (j.data ?? [])
      .map((c) => ({ lat: c.latitude, lng: c.longitude }))
      .filter((p): p is { lat: number; lng: number } => typeof p.lat === 'number' && typeof p.lng === 'number');
    if (!coords.length) return null;
    return {
      lat: coords.reduce((sum, p) => sum + p.lat, 0) / coords.length,
      lng: coords.reduce((sum, p) => sum + p.lng, 0) / coords.length,
    };
  };

  const focused = focusedFromList ?? (focusId ? await fetchRegion(focusId) : null);
  const center = focusId ? await fetchCenter(focusId) : null;

  const focusHref = (id: number) => {
    const next = new URLSearchParams(qs.toString());
    next.set('focus', String(id));
    return `/regions?${next.toString()}`;
  };

  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-[var(--text)]'>Regions & Subregions</h1>
          <p className='mt-1 text-sm text-[var(--text-muted)]'>{json.meta.total} total · Focus a region to preview</p>
        </div>
        <div className='w-full sm:max-w-md'>
          <SearchForm placeholder='Search regions (e.g. Asia)' />
        </div>
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <Card>
            <CardHeader
              title='Regions'
              description={`Page ${json.meta.page} · Limit ${json.meta.limit}`}
              right={
                <ButtonLink href='/countries' variant='outline' size='sm'>
                  Countries →
                </ButtonLink>
              }
            />
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead className='bg-[var(--surface-2)] text-[var(--text-muted)]'>
                  <tr>
                    <th className='px-5 py-3'>Region</th>
                    <th className='px-5 py-3'>Preview</th>
                    <th className='px-5 py-3 text-right'>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {json.data.length ? (
                    json.data.map((r) => {
                      const active = focused?.id === r.id;
                      return (
                        <tr
                          key={r.id}
                          className={`border-t hover:bg-[var(--surface-2)] ${active ? 'bg-[var(--surface-2)]' : ''}`}
                        >
                          <td className='px-5 py-3'>
                            <div className='flex items-center justify-between gap-4'>
                              <Link
                                className='font-medium text-[var(--text)] hover:underline'
                                href={`/regions/${r.id}`}
                              >
                                {r.name}
                              </Link>
                              <Link className='text-xs underline text-[var(--text)]' href={focusHref(r.id)}>
                                Focus
                              </Link>
                            </div>
                          </td>
                          <td className='px-5 py-3 text-[var(--text-muted)]'>
                            <Link className='underline text-[var(--text)]' href={`/regions/${r.id}`}>
                              Open →
                            </Link>
                          </td>
                          <td className='px-5 py-3 text-right font-mono text-xs text-[var(--text-muted)]'>{r.id}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className='border-t'>
                      <td className='px-5 py-10 text-center text-sm text-[var(--text-muted)]' colSpan={3}>
                        No regions found.
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
                pathname='/regions'
                searchParams={searchParams}
              />
            </CardBody>
          </Card>
        </div>

        <div className='flex flex-col gap-6 lg:col-span-4'>
          {focused && center ? (
            <MapEmbed title={`Preview: ${focused.name}`} lat={center.lat} lng={center.lng} zoom={3} />
          ) : (
            <Card>
              <CardHeader title='Map preview' description='Select a region using Focus' />
              <CardBody>
                <div className='text-sm text-[var(--text-muted)]'>
                  Pick any region and click <span className='font-semibold text-[var(--text)]'>Focus</span> to show a
                  map preview here.
                </div>
              </CardBody>
            </Card>
          )}

          {focused ? (
            <Card>
              <CardHeader title='Subregions' description='Quick list' />
              <CardBody className='space-y-2 text-sm'>
                {'subregions' in focused && focused.subregions?.length ? (
                  focused.subregions.slice(0, 12).map((s) => (
                    <Link key={s.id} className='block text-[var(--text)] underline' href={`/subregions/${s.id}`}>
                      {s.name}
                    </Link>
                  ))
                ) : (
                  <div className='text-[var(--text-muted)]'>Open the region details page to see subregions.</div>
                )}
                <div className='pt-2'>
                  <ButtonLink href={`/regions/${focused.id}`} variant='primary' size='sm'>
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
