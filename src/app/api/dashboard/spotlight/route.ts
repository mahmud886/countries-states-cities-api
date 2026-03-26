import { jsonError, jsonSuccess } from '@/lib/api/response';
import { createPublicClient } from '@/utils/supabase/public';

export async function GET() {
  try {
    const supabase = createPublicClient();

    const countRes = await supabase
      .from('countries')
      .select('id', { count: 'exact', head: true })
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (countRes.error) {
      return jsonError({ status: 500, message: countRes.error.message, code: 'DB_ERROR' });
    }

    const total = ((countRes as any).count ?? 0) as number;
    if (!total) {
      return jsonSuccess(null);
    }

    const offset = Math.floor(Math.random() * total);

    const rowRes = await supabase
      .from('countries')
      .select(
        'id,name,emoji,capital,region:regions(id,name),subregion:subregions(id,name,region_id),population,latitude,longitude',
      )
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('id', { ascending: true })
      .range(offset, offset);

    if (rowRes.error) {
      return jsonError({ status: 500, message: rowRes.error.message, code: 'DB_ERROR' });
    }

    return jsonSuccess(rowRes.data?.[0] ?? null);
  } catch {
    return jsonError({ status: 500, message: 'Failed to load spotlight', code: 'SERVER_ERROR' });
  }
}
