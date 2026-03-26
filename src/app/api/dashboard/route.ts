import { jsonError, jsonSuccess } from '@/lib/api/response';
import { createPublicClient } from '@/utils/supabase/public';

type CountRes = { count: number | null; error: { message: string } | null };

async function countAll(table: string): Promise<CountRes> {
  const supabase = createPublicClient();
  const res = await supabase.from(table).select('id', { count: 'exact', head: true });
  return { count: (res as any).count ?? null, error: res.error };
}

async function countWithCoords(table: string): Promise<CountRes> {
  const supabase = createPublicClient();
  const res = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);
  return { count: (res as any).count ?? null, error: res.error };
}

export async function GET() {
  try {
    const supabase = createPublicClient();

    const [
      countries,
      states,
      cities,
      regions,
      subregions,
      countriesCoords,
      statesCoords,
      citiesCoords,
      topCountriesRes,
      topCitiesRes,
    ] = await Promise.all([
      countAll('countries'),
      countAll('states'),
      countAll('cities'),
      countAll('regions'),
      countAll('subregions'),
      countWithCoords('countries'),
      countWithCoords('states'),
      countWithCoords('cities'),
      supabase
        .from('countries')
        .select('id,name,emoji,population,latitude,longitude', { count: 'exact' })
        .not('population', 'is', null)
        .order('population', { ascending: false })
        .limit(5),
      supabase
        .from('cities')
        .select('id,name,country_id,state_id,population,latitude,longitude', { count: 'exact' })
        .not('population', 'is', null)
        .order('population', { ascending: false })
        .limit(5),
    ]);

    const allErrors = [
      countries.error,
      states.error,
      cities.error,
      regions.error,
      subregions.error,
      countriesCoords.error,
      statesCoords.error,
      citiesCoords.error,
      topCountriesRes.error,
      topCitiesRes.error,
    ].filter(Boolean) as Array<{ message: string }>;

    if (allErrors.length) {
      return jsonError({ status: 500, message: allErrors[0].message, code: 'DB_ERROR' });
    }

    return jsonSuccess({
      totals: {
        countries: countries.count ?? 0,
        states: states.count ?? 0,
        cities: cities.count ?? 0,
        regions: regions.count ?? 0,
        subregions: subregions.count ?? 0,
      },
      coverage: {
        countriesWithCoords: countriesCoords.count ?? 0,
        statesWithCoords: statesCoords.count ?? 0,
        citiesWithCoords: citiesCoords.count ?? 0,
      },
      top: {
        countriesByPopulation: topCountriesRes.data ?? [],
        citiesByPopulation: topCitiesRes.data ?? [],
      },
    });
  } catch {
    return jsonError({ status: 500, message: 'Failed to build dashboard', code: 'SERVER_ERROR' });
  }
}
