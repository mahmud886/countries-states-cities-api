import { z } from 'zod';
import { createPublicClient } from '@/utils/supabase/public';
import { getStringParam, parsePagination, SortOrderSchema } from '@/lib/api/params';
import { jsonError, jsonSuccess } from '@/lib/api/response';

const SortBySchema = z
  .string()
  .optional()
  .transform((v) => (v ?? 'name').toLowerCase())
  .refine((v) => v === 'name' || v === 'id', 'Invalid sort')
  .transform((v) => v as 'name' | 'id');

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { page, limit, offset } = parsePagination(url.searchParams);

    const search = getStringParam(url.searchParams, 'search');
    const countryId = getStringParam(url.searchParams, 'country_id');
    const sortBy = SortBySchema.parse(url.searchParams.get('sort') ?? undefined);
    const order = SortOrderSchema.parse(url.searchParams.get('order') ?? undefined);

    const supabase = createPublicClient();
    let query = supabase
      .from('states')
      .select('id,name,iso2,iso3166_2,type,level,latitude,longitude,timezone,population,country_id', {
        count: 'exact',
      });

    if (countryId) query = query.eq('country_id', Number.parseInt(countryId, 10));
    if (search) query = query.ilike('name', `%${search}%`);

    query = query.order(sortBy, { ascending: order === 'asc' });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) {
      return jsonError({ status: 500, message: error.message, code: 'DB_ERROR' });
    }

    return jsonSuccess(data ?? [], { meta: { page, limit, total: count ?? 0 } });
  } catch (err) {
    return jsonError({
      status: 400,
      message: 'Invalid request',
      code: 'BAD_REQUEST',
      details: err instanceof Error ? err.message : err,
    });
  }
}
