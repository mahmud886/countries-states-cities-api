import { createPublicClient } from '@/utils/supabase/public';
import { IdParamSchema } from '@/lib/api/id';
import { jsonError, jsonSuccess } from '@/lib/api/response';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const subregionId = IdParamSchema.parse(id);

    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('subregions')
      .select('id,name,region_id,wikidata_id,region:regions(id,name,wikidata_id)')
      .eq('id', subregionId)
      .maybeSingle();

    if (error) {
      return jsonError({ status: 500, message: error.message, code: 'DB_ERROR' });
    }
    if (!data) {
      return jsonError({ status: 404, message: 'Subregion not found', code: 'NOT_FOUND' });
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
