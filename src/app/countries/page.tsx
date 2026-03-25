import { Pagination } from '@/components/Pagination';
import { SearchForm } from '@/components/SearchForm';
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
    }>;
    meta: { page: number; limit: number; total: number };
  };
}

export default async function CountriesPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string' && v.length) qs.set(k, v);
  }

  const json = await fetchJson(await internalApiUrl('/api/countries', qs.toString()));

  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-[var(--text)]'>Countries</h1>
          <p className='mt-1 text-sm text-[var(--text-muted)]'>
            {json.meta.total} total · Search by name, filter by region/subregion, sort by population.
          </p>
        </div>
        <div className='w-full sm:max-w-md'>
          <SearchForm placeholder='Search countries (e.g. Bangladesh)' />
        </div>
      </div>

      <div className='mt-6 overflow-hidden rounded-xl border bg-[var(--surface)] shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-[var(--surface-2)] text-[var(--text-muted)]'>
              <tr>
                <th className='px-4 py-3'>Country</th>
                <th className='px-4 py-3'>ISO2</th>
                <th className='px-4 py-3'>Capital</th>
                <th className='px-4 py-3'>Map</th>
                <th className='px-4 py-3 text-right'>ID</th>
              </tr>
            </thead>
            <tbody>
              {json.data.length ? (
                json.data.map((c) => (
                  <tr key={c.id} className='border-t hover:bg-[var(--surface-2)]'>
                    <td className='px-4 py-3'>
                      <Link className='font-medium text-[var(--text)] hover:underline' href={`/countries/${c.id}`}>
                        <span className='mr-2'>{c.emoji ?? '🌍'}</span>
                        {c.name}
                      </Link>
                    </td>
                    <td className='px-4 py-3 text-[var(--text-muted)]'>{c.iso2 ?? '-'}</td>
                    <td className='px-4 py-3 text-[var(--text-muted)]'>{c.capital ?? '-'}</td>
                    <td className='px-4 py-3 text-[var(--text-muted)]'>
                      {c.latitude != null && c.longitude != null ? (
                        <a
                          className='underline text-[var(--text)]'
                          href={osmHref(c.latitude, c.longitude, 5)}
                          target='_blank'
                          rel='noreferrer'
                        >
                          View →
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className='px-4 py-3 text-right font-mono text-xs text-[var(--text-muted)]'>{c.id}</td>
                  </tr>
                ))
              ) : (
                <tr className='border-t'>
                  <td className='px-4 py-10 text-center text-sm text-[var(--text-muted)]' colSpan={5}>
                    No countries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={json.meta.page}
        limit={json.meta.limit}
        total={json.meta.total}
        pathname='/countries'
        searchParams={searchParams}
      />
    </main>
  );
}
