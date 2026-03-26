import { fetchAllPages } from '@/lib/api/fetchAll';
import { getStringParam, parsePagination, SortOrderSchema } from '@/lib/api/params';
import { jsonError, jsonSuccess } from '@/lib/api/response';
import { createPublicClient } from '@/utils/supabase/public';
import { z } from 'zod';

const SortBySchema = z
  .string()
  .optional()
  .transform((v) => (v ?? 'name').toLowerCase())
  .refine((v) => v === 'name' || v === 'id', 'Invalid sort')
  .transform((v) => v as 'name' | 'id');

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { page, limit, offset, paginate } = parsePagination(url.searchParams);

    const search = getStringParam(url.searchParams, 'search');
    const countryId = getStringParam(url.searchParams, 'country_id');
    const sortBy = SortBySchema.parse(url.searchParams.get('sort') ?? undefined);
    const order = SortOrderSchema.parse(url.searchParams.get('order') ?? undefined);

    const supabase = createPublicClient();
    const baseQuery = () => {
      let query = supabase
        .from('states')
        .select('id,name,iso2,iso3166_2,type,level,latitude,longitude,timezone,population,country_id', {
          count: 'exact',
        });

      if (countryId) query = query.eq('country_id', Number.parseInt(countryId, 10));
      if (search) query = query.ilike('name', `%${search}%`);

      query = query.order(sortBy, { ascending: order === 'asc' });
      return query;
    };

    let data: any[] | null;
    let error: { message: string } | null;
    let total: number | null;

    if (paginate) {
      const res = await baseQuery().range(offset, offset + limit - 1);
      data = res.data ?? null;
      error = res.error;
      total = (res as any).count ?? null;
    } else {
      const res = await fetchAllPages({
        fetchPage: async (from, to) => {
          const r = await baseQuery().range(from, to);
          return { data: r.data ?? null, error: r.error, count: (r as any).count ?? null };
        },
      });
      data = res.data;
      error = res.error;
      total = res.total;
    }
    if (error) {
      return jsonError({ status: 500, message: error.message, code: 'DB_ERROR' });
    }

    const finalTotal = total ?? data?.length ?? 0;
    const effectiveLimit = paginate ? limit : finalTotal;
    return jsonSuccess(data ?? [], { meta: { page: paginate ? page : 1, limit: effectiveLimit, total: finalTotal } });
  } catch (err) {
    return jsonError({
      status: 400,
      message: 'Invalid request',
      code: 'BAD_REQUEST',
      details: err instanceof Error ? err.message : err,
    });
  }
}
