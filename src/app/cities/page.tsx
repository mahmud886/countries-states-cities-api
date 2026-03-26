import { MapEmbed } from '@/components/MapEmbed';
import { Pagination } from '@/components/Pagination';
import { SearchForm } from '@/components/SearchForm';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { osmHref } from '@/lib/maps/osm';
import { internalApiUrl } from '@/lib/server/internalApi';
import Link from 'next/link';

type SearchParams = Record<string, string | string[] | undefined>;

type CityListItem = {
  id: number;
  name: string;
  state_id: number;
  country_id: number;
  type: string | null;
  latitude: number | null;
  longitude: number | null;
};

type CityDetail = CityListItem & {
  state: { id: number; name: string } | null;
  country: { id: number; name: string } | null;
};

function isCityDetail(v: CityListItem | CityDetail): v is CityDetail {
  return 'state' in v || 'country' in v;
}

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as {
    success: boolean;
    data: CityListItem[];
    meta: { page: number; limit: number; total: number };
  };
}

export default async function CitiesPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const focus = typeof searchParams.focus === 'string' ? searchParams.focus : undefined;
  const focusId = focus && /^\d+$/.test(focus) ? Number.parseInt(focus, 10) : null;

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string' && v.length) qs.set(k, v);
  }

  const json = await fetchJson(await internalApiUrl('/api/cities', qs.toString()));
  const focusedFromList: CityListItem | null = focusId ? (json.data.find((c) => c.id === focusId) ?? null) : null;

  const fetchCity = async (id: number): Promise<CityDetail | null> => {
    const res = await fetch(await internalApiUrl(`/api/cities/${id}`), { cache: 'no-store' });
    if (!res.ok) return null;
    const j = (await res.json()) as { data?: any };
    return j.data as CityDetail;
  };

  const focused: CityListItem | CityDetail | null = focusedFromList ?? (focusId ? await fetchCity(focusId) : null);

  const focusHref = (id: number) => {
    const next = new URLSearchParams(qs.toString());
    next.set('focus', String(id));
    return `/cities?${next.toString()}`;
  };

  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-[var(--text)]'>Cities</h1>
          <p className='mt-1 text-sm text-[var(--text-muted)]'>
            {json.meta.total} total · Filter by state_id / country_id
          </p>
        </div>
        <div className='w-full sm:max-w-md'>
          <SearchForm placeholder='Search cities (e.g. Dhaka)' />
        </div>
      </div>
      <div className='mt-6 grid gap-6 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <Card>
            <CardHeader
              title='Cities'
              description={`Page ${json.meta.page} · Limit ${json.meta.limit}`}
              right={
                <ButtonLink href='/states' variant='outline' size='sm'>
                  States →
                </ButtonLink>
              }
            />
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead className='bg-[var(--surface-2)] text-[var(--text-muted)]'>
                  <tr>
                    <th className='px-5 py-3'>City</th>
                    <th className='px-5 py-3'>Type</th>
                    <th className='px-5 py-3'>Preview</th>
                    <th className='px-5 py-3'>State</th>
                    <th className='px-5 py-3'>Country</th>
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
                              <Link className='font-medium text-[var(--text)] hover:underline' href={`/cities/${c.id}`}>
                                {c.name}
                              </Link>
                              <Link className='text-xs underline text-[var(--text)]' href={focusHref(c.id)}>
                                Focus
                              </Link>
                            </div>
                          </td>
                          <td className='px-5 py-3 text-[var(--text-muted)]'>{c.type ?? '-'}</td>
                          <td className='px-5 py-3 text-[var(--text-muted)]'>
                            {c.latitude != null && c.longitude != null ? (
                              <a
                                className='underline text-[var(--text)]'
                                href={osmHref(c.latitude, c.longitude, 11)}
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
                            <Link className='underline text-[var(--text)]' href={`/states/${c.state_id}`}>
                              {c.state_id}
                            </Link>
                          </td>
                          <td className='px-5 py-3 text-[var(--text-muted)]'>
                            <Link className='underline text-[var(--text)]' href={`/countries/${c.country_id}`}>
                              {c.country_id}
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className='border-t'>
                      <td className='px-5 py-10 text-center text-sm text-[var(--text-muted)]' colSpan={5}>
                        No cities found.
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
                pathname='/cities'
                searchParams={searchParams}
              />
            </CardBody>
          </Card>
        </div>

        <div className='flex flex-col gap-6 lg:col-span-4'>
          {focused && focused.latitude != null && focused.longitude != null ? (
            <MapEmbed title={`Preview: ${focused.name}`} lat={focused.latitude} lng={focused.longitude} zoom={10} />
          ) : (
            <Card>
              <CardHeader title='Map preview' description='Select a row using Focus' />
              <CardBody>
                <div className='text-sm text-[var(--text-muted)]'>
                  Pick any city and click <span className='font-semibold text-[var(--text)]'>Focus</span> to show a map
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
                  <span className='text-[var(--text-muted)]'>State</span>
                  <span className='text-[var(--text)]'>
                    {isCityDetail(focused) && focused.state ? focused.state.name : focused.state_id}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-[var(--text-muted)]'>Country</span>
                  <span className='text-[var(--text)]'>
                    {isCityDetail(focused) && focused.country ? focused.country.name : focused.country_id}
                  </span>
                </div>
                <div className='pt-2'>
                  <ButtonLink href={`/cities/${focused.id}`} variant='primary' size='sm'>
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
