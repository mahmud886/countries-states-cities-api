import { MapEmbed } from '@/components/MapEmbed';
import { Pagination } from '@/components/Pagination';
import { SearchForm } from '@/components/SearchForm';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icons';
import { osmHref } from '@/lib/maps/osm';
import { internalApiUrl } from '@/lib/server/internalApi';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'States',
  description: 'Browse states/provinces with search, country filters, pagination, map previews, and state details.',
};

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

  const allMode = searchParams.all === '1';
  const hasPage = typeof searchParams.page === 'string' && searchParams.page.length > 0;
  const hasLimit = typeof searchParams.limit === 'string' && searchParams.limit.length > 0;

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string' && v.length) qs.set(k, v);
  }

  if (!allMode && !hasPage && !hasLimit) {
    const next = new URLSearchParams(qs.toString());
    next.set('page', '1');
    next.set('limit', '20');
    redirect(`/states?${next.toString()}`);
  }

  const apiQs = new URLSearchParams(qs.toString());
  apiQs.delete('all');
  if (allMode) {
    apiQs.delete('page');
    apiQs.delete('limit');
  }

  const json = await fetchJson(await internalApiUrl('/api/states', apiQs.toString()));
  const focusedFromList: StateListItem | null = focusId ? (json.data.find((s) => s.id === focusId) ?? null) : null;

  const fetchState = async (id: number): Promise<StateDetail | null> => {
    const res = await fetch(await internalApiUrl(`/api/states/${id}`), { cache: 'no-store' });
    if (!res.ok) return null;
    const j = (await res.json()) as { data?: any };
    return j.data as StateDetail;
  };

  const focused: StateListItem | StateDetail | null = focusedFromList ?? (focusId ? await fetchState(focusId) : null);

  const toAllHref = () => {
    const next = new URLSearchParams(qs.toString());
    next.delete('page');
    next.delete('limit');
    next.set('all', '1');
    return `/states?${next.toString()}`;
  };

  const toPaginateHref = (limit = 20) => {
    const next = new URLSearchParams(qs.toString());
    next.delete('all');
    next.set('page', '1');
    next.set('limit', String(limit));
    return `/states?${next.toString()}`;
  };

  const focusHref = (id: number) => {
    const next = new URLSearchParams(qs.toString());
    next.set('focus', String(id));
    return `/states?${next.toString()}`;
  };

  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-(--text)'>States</h1>
          <p className='mt-1 text-sm text-(--text-muted)'>{json.meta.total} total · Filter by country_id</p>
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
              description={
                allMode ? `All results · ${json.meta.total} total` : `Page ${json.meta.page} · Limit ${json.meta.limit}`
              }
              right={
                <>
                  {allMode ? (
                    <ButtonLink href={toPaginateHref(20)} variant='outline' size='sm'>
                      <span className='flex items-center gap-2'>
                        <Icon name='list' className='h-4 w-4' />
                        Paginate
                      </span>
                    </ButtonLink>
                  ) : (
                    <ButtonLink href={toAllHref()} variant='outline' size='sm'>
                      <span className='flex items-center gap-2'>
                        <Icon name='sparkle' className='h-4 w-4' />
                        All
                      </span>
                    </ButtonLink>
                  )}
                  <ButtonLink href={toPaginateHref(20)} variant='ghost' size='sm'>
                    20
                  </ButtonLink>
                  <ButtonLink href={toPaginateHref(50)} variant='ghost' size='sm'>
                    50
                  </ButtonLink>
                  <ButtonLink href={toPaginateHref(100)} variant='ghost' size='sm'>
                    100
                  </ButtonLink>
                  <ButtonLink href='/countries' variant='outline' size='sm'>
                    <span className='flex items-center gap-2'>
                      <Icon name='countries' className='h-4 w-4' />
                      Countries
                      <Icon name='chevron-right' className='h-4 w-4' />
                    </span>
                  </ButtonLink>
                </>
              }
            />
            <div className='max-h-[calc(100vh-260px)] overflow-auto'>
              <table className='w-full text-left text-[15px]'>
                <thead className='bg-(--surface-2) text-(--text-muted)'>
                  <tr>
                    <th className='px-5 py-4'>State</th>
                    <th className='px-5 py-4'>Code</th>
                    <th className='px-5 py-4'>Type</th>
                    <th className='px-5 py-4'>Preview</th>
                    <th className='px-5 py-4'>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {json.data.length ? (
                    json.data.map((s) => {
                      const active = focused?.id === s.id;
                      return (
                        <tr
                          key={s.id}
                          className={`border-t hover:bg-(--surface-2) ${active ? 'bg-(--surface-2)' : ''}`}
                        >
                          <td className='px-5 py-4'>
                            <div className='flex items-center justify-between gap-4'>
                              <Link className='font-medium text-(--text) hover:underline' href={`/states/${s.id}`}>
                                {s.name}
                              </Link>
                              <Link className='text-xs underline text-(--text)' href={focusHref(s.id)}>
                                <span className='inline-flex items-center gap-1.5'>
                                  <Icon name='focus' className='h-4 w-4' />
                                  Focus
                                </span>
                              </Link>
                            </div>
                          </td>
                          <td className='px-5 py-4 font-mono text-xs text-(--text-muted)'>{s.iso2 ?? '-'}</td>
                          <td className='px-5 py-4 text-(--text-muted)'>{s.type ?? '-'}</td>
                          <td className='px-5 py-4 text-(--text-muted)'>
                            {s.latitude != null && s.longitude != null ? (
                              <a
                                className='underline text-(--text)'
                                href={osmHref(s.latitude, s.longitude, 6)}
                                target='_blank'
                                rel='noreferrer'
                              >
                                <span className='inline-flex items-center gap-1.5'>
                                  <Icon name='map' className='h-4 w-4' />
                                  Map
                                </span>
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className='px-5 py-4 text-(--text-muted)'>
                            <Link className='underline text-(--text)' href={`/countries/${s.country_id}`}>
                              {s.country_id}
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className='border-t'>
                      <td className='px-5 py-12 text-center text-sm text-(--text-muted)' colSpan={5}>
                        No states found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {!allMode ? (
              <CardBody className='pt-3'>
                <Pagination
                  page={json.meta.page}
                  limit={json.meta.limit}
                  total={json.meta.total}
                  pathname='/states'
                  searchParams={searchParams}
                />
              </CardBody>
            ) : (
              <CardBody className='pt-3 text-sm text-(--text-muted)'>
                All mode can be slow on large datasets. Use the limit buttons to paginate.
              </CardBody>
            )}
          </Card>
        </div>

        <div className='flex flex-col gap-6 lg:col-span-4'>
          {focused && focused.latitude != null && focused.longitude != null ? (
            <MapEmbed title={`Preview: ${focused.name}`} lat={focused.latitude} lng={focused.longitude} zoom={6} />
          ) : (
            <Card>
              <CardHeader title='Map preview' description='Select a row using Focus' />
              <CardBody>
                <div className='text-sm text-(--text-muted)'>
                  Pick any state and click <span className='font-semibold text-(--text)'>Focus</span> to show a map
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
                  <span className='text-(--text-muted)'>Name</span>
                  <span className='text-(--text)'>{focused.name}</span>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-(--text-muted)'>Code</span>
                  <span className='text-(--text)'>{focused.iso2 ?? '—'}</span>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-(--text-muted)'>Country</span>
                  <span className='text-(--text)'>
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
