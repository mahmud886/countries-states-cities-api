import { z } from 'zod';
import { createPublicClient } from '@/utils/supabase/public';
import { jsonError, jsonSuccess } from '@/lib/api/response';

const IdSchema = z
  .string()
  .transform((v) => Number.parseInt(v, 10))
  .refine((v) => Number.isFinite(v) && v > 0, 'Invalid id');

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const cityId = IdSchema.parse(id);

    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('cities')
      .select('*,country:countries(id,name,iso2,iso3),state:states(id,name,iso2)')
      .eq('id', cityId)
      .maybeSingle();

    if (error) {
      return jsonError({ status: 500, message: error.message, code: 'DB_ERROR' });
    }

    if (!data) {
      return jsonError({ status: 404, message: 'City not found', code: 'NOT_FOUND' });
    }

    return jsonSuccess(data);
  } catch (err) {
    return jsonError({
      status: 400,
      message: 'Invalid request',
      code: 'BAD_REQUEST',
      details: err instanceof Error ? err.message : err,
    });
  }
}
