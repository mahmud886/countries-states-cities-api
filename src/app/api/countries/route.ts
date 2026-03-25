import { z } from "zod";
import { createPublicClient } from "@/utils/supabase/public";
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
    (v) =>
      v === "name" ||
      v === "id" ||
      v === "iso2" ||
      v === "iso3" ||
      v === "population",
    "Invalid sort",
  )
  .transform((v) => v as "name" | "id" | "iso2" | "iso3" | "population");

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { page, limit, offset } = parsePagination(url.searchParams);

    const search = getStringParam(url.searchParams, "search");
    const regionId = getStringParam(url.searchParams, "region_id");
    const subregionId = getStringParam(url.searchParams, "subregion_id");
    const iso2 = getStringParam(url.searchParams, "iso2");
    const iso3 = getStringParam(url.searchParams, "iso3");
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
        "id,name,iso2,iso3,capital,currency,currency_name,currency_symbol,emoji,population,region:regions(id,name),subregion:subregions(id,name,region_id)",
        { count: "exact" },
      );

    if (search) query = query.ilike("name", `%${search}%`);
    if (regionId) query = query.eq("region_id", Number.parseInt(regionId, 10));
    if (subregionId)
      query = query.eq("subregion_id", Number.parseInt(subregionId, 10));
    if (iso2) query = query.eq("iso2", iso2.toUpperCase());
    if (iso3) query = query.eq("iso3", iso3.toUpperCase());

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
