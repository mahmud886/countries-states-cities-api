import { internalApiUrl } from '@/lib/server/internalApi';
import Link from 'next/link';

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as { success: boolean; data: any };
}

export default async function CityDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const cityRes = await fetchJson(await internalApiUrl(`/api/cities/${id}`));
  const city = cityRes.data as {
    id: number;
    name: string;
    type: string | null;
    latitude: number | null;
    longitude: number | null;
    state_id: number;
    country_id: number;
    state: { id: number; name: string } | null;
    country: { id: number; name: string } | null;
  };

  return (
    <main>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>{city.name}</h1>
          <div className='mt-3 flex flex-wrap gap-2 text-sm text-gray-700'>
            <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>ID: {city.id}</span>
            {city.type ? (
              <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>Type: {city.type}</span>
            ) : null}
            <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>
              State:{' '}
              <Link className='underline' href={`/states/${city.state_id}`}>
                {city.state?.name ?? city.state_id}
              </Link>
            </span>
            <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>
              Country:{' '}
              <Link className='underline' href={`/countries/${city.country_id}`}>
                {city.country?.name ?? city.country_id}
              </Link>
            </span>
            {city.latitude != null && city.longitude != null ? (
              <span className='rounded-md border border-gray-200 bg-white px-2 py-1'>
                {city.latitude}, {city.longitude}
              </span>
            ) : null}
          </div>
        </div>
        <Link className='text-sm underline' href='/cities'>
          Back
        </Link>
      </div>
    </main>
  );
}
