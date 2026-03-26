import { IdParamSchema } from "@/lib/api/id";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { createPublicClient } from "@/utils/supabase/public";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const countryId = IdParamSchema.parse(id);

    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("countries")
      .select(
        "*,region:regions(id,name),subregion:subregions(id,name,region_id)",
      )
      .eq("id", countryId)
      .maybeSingle();

    if (error) {
      return jsonError({
        status: 500,
        message: error.message,
        code: "DB_ERROR",
      });
    }

    if (!data) {
      return jsonError({
        status: 404,
        message: "Country not found",
        code: "NOT_FOUND",
      });
    }

    return jsonSuccess(data);
  } catch (err) {
    return jsonError({
      status: 400,
      message: "Invalid request",
      code: "BAD_REQUEST",
      details: err instanceof Error ? err.message : err,
    });
  }
}
