import { MapEmbed } from '@/components/MapEmbed';
import { internalApiUrl } from '@/lib/server/internalApi';
import Link from 'next/link';
import type { Metadata } from 'next';

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as { success: boolean; data: any };
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  try {
    const countryRes = await fetchJson(await internalApiUrl(`/api/countries/${id}`));
    const name = (countryRes.data?.name as string | undefined) ?? `Country ${id}`;
    return {
      title: name,
      description: `Country details for ${name}, including states and cities.`,
    };
  } catch {
    return { title: `Country ${id}` };
  }
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
    latitude: number | null;
    longitude: number | null;
    region: { id: number; name: string } | null;
    subregion: { id: number; name: string } | null;
  };

  const statesRes = await fetchJson(await internalApiUrl(`/api/countries/${id}/states`, 'limit=20&page=1'));
  const citiesRes = await fetchJson(await internalApiUrl(`/api/countries/${id}/cities`, 'limit=20&page=1'));

  return (
    <main>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-(--text)'>
            {country.emoji ? `${country.emoji} ` : ''}
            {country.name}
          </h1>
          <div className='mt-3 flex flex-wrap gap-2 text-sm text-(--text-muted)'>
            <span className='rounded-md border bg-(--surface) px-2 py-1'>ID: {country.id}</span>
            {country.iso2 ? (
              <span className='rounded-md border bg-(--surface) px-2 py-1'>ISO2: {country.iso2}</span>
            ) : null}
            {country.iso3 ? (
              <span className='rounded-md border bg-(--surface) px-2 py-1'>ISO3: {country.iso3}</span>
            ) : null}
            {country.capital ? (
              <span className='rounded-md border bg-(--surface) px-2 py-1'>Capital: {country.capital}</span>
            ) : null}
            {country.currency ? (
              <span className='rounded-md border bg-(--surface) px-2 py-1'>
                Currency: {country.currency}
                {country.currency_name ? ` (${country.currency_name})` : ''}
              </span>
            ) : null}
            {country.region?.name ? (
              <span className='rounded-md border bg-(--surface) px-2 py-1'>
                Region:{' '}
                <Link className='underline text-(--text)' href={`/regions/${country.region.id}`}>
                  {country.region.name}
                </Link>
              </span>
            ) : null}
            {country.subregion?.name ? (
              <span className='rounded-md border bg-(--surface) px-2 py-1'>
                Subregion:{' '}
                <Link className='underline text-(--text)' href={`/subregions/${country.subregion.id}`}>
                  {country.subregion.name}
                </Link>
              </span>
            ) : null}
          </div>
        </div>
        <Link className='text-sm text-(--text) underline' href='/countries'>
          Back
        </Link>
      </div>

      {country.latitude != null && country.longitude != null ? (
        <div className='mt-8'>
          <MapEmbed title='Location' lat={country.latitude} lng={country.longitude} zoom={5} />
        </div>
      ) : null}

      <div className='mt-8 grid gap-6 lg:grid-cols-2'>
        <section className='overflow-hidden rounded-xl border bg-(--surface) shadow-sm'>
          <div className='border-b bg-(--surface-2) px-4 py-3'>
            <div className='font-medium text-(--text)'>States (first 20)</div>
          </div>
          <ul className='divide-y divide-gray-100 text-sm'>
            {statesRes.data.map((s: any) => (
              <li key={s.id} className='px-4 py-3'>
                <Link
                  className='text-(--text) hover:underline'
                  href={`/states?country_id=${country.id}&search=${encodeURIComponent(s.name)}`}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className='border-t px-4 py-3 text-sm'>
            <Link className='underline text-(--text)' href={`/states?country_id=${country.id}`}>
              View all states →
            </Link>
          </div>
        </section>

        <section className='overflow-hidden rounded-xl border bg-(--surface) shadow-sm'>
          <div className='border-b bg-(--surface-2) px-4 py-3'>
            <div className='font-medium text-(--text)'>Cities (first 20)</div>
          </div>
          <ul className='divide-y divide-gray-100 text-sm'>
            {citiesRes.data.map((c: any) => (
              <li key={c.id} className='px-4 py-3'>
                <Link
                  className='text-(--text) hover:underline'
                  href={`/cities?country_id=${country.id}&search=${encodeURIComponent(c.name)}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className='border-t px-4 py-3 text-sm'>
            <Link className='underline text-(--text)' href={`/cities?country_id=${country.id}`}>
              View all cities →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
