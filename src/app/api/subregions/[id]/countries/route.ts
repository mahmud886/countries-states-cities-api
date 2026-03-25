import { z } from "zod";
import { createPublicClient } from "@/utils/supabase/public";
import { IdParamSchema } from "@/lib/api/id";
import {
  getStringParam,
  parsePagination,
  SortOrderSchema,
} from "@/lib/api/params";
import { jsonError, jsonSuccess } from "@/lib/api/response";

const SortBySchema = z
  .string()
  .optional()
  .transform((v) => (v ?? "name").toLowerCase())
  .refine(
    (v) => v === "name" || v === "id" || v === "population",
    "Invalid sort",
  )
  .transform((v) => v as "name" | "id" | "population");

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const subregionId = IdParamSchema.parse(id);

    const url = new URL(request.url);
    const { page, limit, offset } = parsePagination(url.searchParams);
    const search = getStringParam(url.searchParams, "search");
    const sortBy = SortBySchema.parse(
      url.searchParams.get("sort") ?? undefined,
    );
    const order = SortOrderSchema.parse(
      url.searchParams.get("order") ?? undefined,
    );

    const supabase = createPublicClient();
    let query = supabase
      .from("countries")
      .select(
        "id,name,iso2,iso3,capital,emoji,region:regions(id,name),subregion:subregions(id,name,region_id)",
        {
          count: "exact",
        },
      )
      .eq("subregion_id", subregionId);

    if (search) query = query.ilike("name", `%${search}%`);

    query = query.order(sortBy, { ascending: order === "asc" });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) {
      return jsonError({
        status: 500,
        message: error.message,
        code: "DB_ERROR",
      });
    }

    return jsonSuccess(data ?? [], {
      meta: { page, limit, total: count ?? 0 },
    });
  } catch (err) {
    return jsonError({
      status: 400,
      message: "Invalid request",
      code: "BAD_REQUEST",
      details: err instanceof Error ? err.message : err,
    });
  }
}
