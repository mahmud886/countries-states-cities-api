import { internalApiUrl } from '@/lib/server/internalApi';
import Link from 'next/link';

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as { success: boolean; data: any };
}

export default async function CountryDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const countryRes = await fetchJson(await internalApiUrl(`/api/countries/${id}`));
  const country = countryRes.data as {
    id: number;
    name: string;
    iso2: string | null;
    iso3: string | null;
    capital: string | null;
    currency: string | null;
    currency_name: string | null;
    emoji: string | null;
    region: { id: number; name: string } | null;
    subregion: { id: number; name: string } | null;
  };

  const statesRes = await fetchJson(await internalApiUrl(`/api/countries/${id}/states`, 'limit=20&page=1'));
  const citiesRes = await fetchJson(await internalApiUrl(`/api/countries/${id}/cities`, 'limit=20&page=1'));

  return (
    <main>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>
            {country.emoji ? `${country.emoji} ` : ''}
            {country.name}
          </h1>
          <div className='mt-3 flex flex-wrap gap-2 text-sm text-gray-700'>
            <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>ID: {country.id}</span>
            {country.iso2 ? (
              <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>ISO2: {country.iso2}</span>
            ) : null}
            {country.iso3 ? (
              <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>ISO3: {country.iso3}</span>
            ) : null}
            {country.capital ? (
              <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>Capital: {country.capital}</span>
            ) : null}
            {country.currency ? (
              <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>
                Currency: {country.currency}
                {country.currency_name ? ` (${country.currency_name})` : ''}
              </span>
            ) : null}
            {country.region?.name ? (
              <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>
                Region:{' '}
                <Link className='underline' href={`/regions/${country.region.id}`}>
                  {country.region.name}
                </Link>
              </span>
            ) : null}
            {country.subregion?.name ? (
              <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>
                Subregion:{' '}
                <Link className='underline' href={`/subregions/${country.subregion.id}`}>
                  {country.subregion.name}
                </Link>
              </span>
            ) : null}
          </div>
        </div>
        <Link className='text-sm text-gray-900 underline' href='/countries'>
          Back
        </Link>
      </div>

      <div className='mt-8 grid gap-6 lg:grid-cols-2'>
        <section className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
          <div className='border-b border-gray-100 px-4 py-3'>
            <div className='font-medium'>States (first 20)</div>
          </div>
          <ul className='divide-y divide-gray-100 text-sm'>
            {statesRes.data.map((s: any) => (
              <li key={s.id} className='px-4 py-3'>
                <Link
                  className='hover:underline'
                  href={`/states?country_id=${country.id}&search=${encodeURIComponent(s.name)}`}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className='border-t border-gray-100 px-4 py-3 text-sm'>
            <Link className='underline' href={`/states?country_id=${country.id}`}>
              View all states →
            </Link>
          </div>
        </section>

        <section className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
          <div className='border-b border-gray-100 px-4 py-3'>
            <div className='font-medium'>Cities (first 20)</div>
          </div>
          <ul className='divide-y divide-gray-100 text-sm'>
            {citiesRes.data.map((c: any) => (
              <li key={c.id} className='px-4 py-3'>
                <Link
                  className='hover:underline'
                  href={`/cities?country_id=${country.id}&search=${encodeURIComponent(c.name)}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className='border-t border-gray-100 px-4 py-3 text-sm'>
            <Link className='underline' href={`/cities?country_id=${country.id}`}>
              View all cities →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
