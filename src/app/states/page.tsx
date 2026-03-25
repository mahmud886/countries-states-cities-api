import Link from 'next/link';
import { SearchForm } from '@/components/SearchForm';
import { Pagination } from '@/components/Pagination';
import { internalApiUrl } from '@/lib/server/internalApi';

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
      type: string | null;
      country_id: number;
    }>;
    meta: { page: number; limit: number; total: number };
  };
}

export default async function StatesPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string' && v.length) qs.set(k, v);
  }

  const json = await fetchJson(await internalApiUrl('/api/states', qs.toString()));

  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>States</h1>
          <p className='mt-1 text-sm text-gray-700'>{json.meta.total} total · Filter by country_id</p>
        </div>
        <div className='w-full sm:max-w-md'>
          <SearchForm placeholder='Search states (e.g. California)' />
        </div>
      </div>

      <div className='mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-gray-50 text-gray-700'>
              <tr>
                <th className='px-4 py-3'>State</th>
                <th className='px-4 py-3'>Code</th>
                <th className='px-4 py-3'>Type</th>
                <th className='px-4 py-3'>Country</th>
              </tr>
            </thead>
            <tbody>
              {json.data.length ? (
                json.data.map((s) => (
                  <tr key={s.id} className='border-t border-gray-100 hover:bg-gray-50'>
                    <td className='px-4 py-3'>
                      <Link className='font-medium hover:underline' href={`/states/${s.id}`}>
                        {s.name}
                      </Link>
                    </td>
                    <td className='px-4 py-3 font-mono text-xs text-gray-700'>{s.iso2 ?? '-'}</td>
                    <td className='px-4 py-3 text-gray-700'>{s.type ?? '-'}</td>
                    <td className='px-4 py-3 text-gray-700'>
                      <Link className='underline' href={`/countries/${s.country_id}`}>
                        {s.country_id}
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className='border-t border-gray-100'>
                  <td className='px-4 py-10 text-center text-sm text-gray-600' colSpan={4}>
                    No states found.
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
        pathname='/states'
        searchParams={searchParams}
      />
    </main>
  );
}
