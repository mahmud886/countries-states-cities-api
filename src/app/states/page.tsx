import { MapEmbed } from '@/components/MapEmbed';
import { Pagination } from '@/components/Pagination';
import { SearchForm } from '@/components/SearchForm';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { osmHref } from '@/lib/maps/osm';
import { internalApiUrl } from '@/lib/server/internalApi';
import Link from 'next/link';

type SearchParams = Record<string, string | string[] | undefined>;

type StateListItem = {
  id: number;
  name: string;
  iso2: string | null;
  type: string | null;
  latitude: number | null;
  longitude: number | null;
  country_id: number;
};

type StateDetail = StateListItem & {
  country: { id: number; name: string } | null;
};

function isStateDetail(v: StateListItem | StateDetail): v is StateDetail {
  return 'country' in v;
}

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as {
    success: boolean;
    data: StateListItem[];
    meta: { page: number; limit: number; total: number };
  };
}

export default async function StatesPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const focus = typeof searchParams.focus === 'string' ? searchParams.focus : undefined;
  const focusId = focus && /^\d+$/.test(focus) ? Number.parseInt(focus, 10) : null;

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string' && v.length) qs.set(k, v);
  }

  const json = await fetchJson(await internalApiUrl('/api/states', qs.toString()));
  const focusedFromList: StateListItem | null = focusId ? (json.data.find((s) => s.id === focusId) ?? null) : null;

  const fetchState = async (id: number): Promise<StateDetail | null> => {
    const res = await fetch(await internalApiUrl(`/api/states/${id}`), { cache: 'no-store' });
    if (!res.ok) return null;
    const j = (await res.json()) as { data?: any };
    return j.data as StateDetail;
  };

  const focused: StateListItem | StateDetail | null = focusedFromList ?? (focusId ? await fetchState(focusId) : null);

  const focusHref = (id: number) => {
    const next = new URLSearchParams(qs.toString());
    next.set('focus', String(id));
    return `/states?${next.toString()}`;
  };

  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-[var(--text)]'>States</h1>
          <p className='mt-1 text-sm text-[var(--text-muted)]'>{json.meta.total} total · Filter by country_id</p>
        </div>
        <div className='w-full sm:max-w-md'>
          <SearchForm placeholder='Search states (e.g. California)' />
        </div>
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <Card>
            <CardHeader
              title='States'
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
                    <th className='px-5 py-3'>State</th>
                    <th className='px-5 py-3'>Code</th>
                    <th className='px-5 py-3'>Type</th>
                    <th className='px-5 py-3'>Preview</th>
                    <th className='px-5 py-3'>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {json.data.length ? (
                    json.data.map((s) => {
                      const active = focused?.id === s.id;
                      return (
                        <tr
                          key={s.id}
                          className={`border-t hover:bg-[var(--surface-2)] ${active ? 'bg-[var(--surface-2)]' : ''}`}
                        >
                          <td className='px-5 py-3'>
                            <div className='flex items-center justify-between gap-4'>
                              <Link className='font-medium text-[var(--text)] hover:underline' href={`/states/${s.id}`}>
                                {s.name}
                              </Link>
                              <Link className='text-xs underline text-[var(--text)]' href={focusHref(s.id)}>
                                Focus
                              </Link>
                            </div>
                          </td>
                          <td className='px-5 py-3 font-mono text-xs text-[var(--text-muted)]'>{s.iso2 ?? '-'}</td>
                          <td className='px-5 py-3 text-[var(--text-muted)]'>{s.type ?? '-'}</td>
                          <td className='px-5 py-3 text-[var(--text-muted)]'>
                            {s.latitude != null && s.longitude != null ? (
                              <a
                                className='underline text-[var(--text)]'
                                href={osmHref(s.latitude, s.longitude, 6)}
                                target='_blank'
                                rel='noreferrer'
                              >
                                Map →
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className='px-5 py-3 text-[var(--text-muted)]'>
                            <Link className='underline text-[var(--text)]' href={`/countries/${s.country_id}`}>
                              {s.country_id}
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className='border-t'>
                      <td className='px-5 py-10 text-center text-sm text-[var(--text-muted)]' colSpan={5}>
                        No states found.
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
                pathname='/states'
                searchParams={searchParams}
              />
            </CardBody>
          </Card>
        </div>

        <div className='flex flex-col gap-6 lg:col-span-4'>
          {focused && focused.latitude != null && focused.longitude != null ? (
            <MapEmbed title={`Preview: ${focused.name}`} lat={focused.latitude} lng={focused.longitude} zoom={6} />
          ) : (
            <Card>
              <CardHeader title='Map preview' description='Select a row using Focus' />
              <CardBody>
                <div className='text-sm text-[var(--text-muted)]'>
                  Pick any state and click <span className='font-semibold text-[var(--text)]'>Focus</span> to show a map
                  preview here.
                </div>
              </CardBody>
            </Card>
          )}

          {focused ? (
            <Card>
              <CardHeader title='Details' description='Quick info' />
              <CardBody className='space-y-2 text-sm'>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-[var(--text-muted)]'>Name</span>
                  <span className='text-[var(--text)]'>{focused.name}</span>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-[var(--text-muted)]'>Code</span>
                  <span className='text-[var(--text)]'>{focused.iso2 ?? '—'}</span>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-[var(--text-muted)]'>Country</span>
                  <span className='text-[var(--text)]'>
                    {isStateDetail(focused) && focused.country ? focused.country.name : focused.country_id}
                  </span>
                </div>
                <div className='pt-2'>
                  <ButtonLink href={`/states/${focused.id}`} variant='primary' size='sm'>
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
