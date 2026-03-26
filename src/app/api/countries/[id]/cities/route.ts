import { fetchAllPages } from "@/lib/api/fetchAll";
import {
  getStringParam,
  parsePagination,
  SortOrderSchema,
} from "@/lib/api/params";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { createPublicClient } from "@/utils/supabase/public";
import { z } from "zod";

const IdSchema = z
  .string()
  .transform((v) => Number.parseInt(v, 10))
  .refine((v) => Number.isFinite(v) && v > 0, "Invalid id");

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
    const countryId = IdSchema.parse(id);

    const url = new URL(request.url);
    const { page, limit, offset, paginate } = parsePagination(url.searchParams);
    const search = getStringParam(url.searchParams, "search");
    const stateId = getStringParam(url.searchParams, "state_id");
    const sortBy = SortBySchema.parse(
      url.searchParams.get("sort") ?? undefined,
    );
    const order = SortOrderSchema.parse(
      url.searchParams.get("order") ?? undefined,
    );

    const supabase = createPublicClient();
    const baseQuery = () => {
      let query = supabase
        .from("cities")
        .select(
          "id,name,state_id,country_id,type,level,latitude,longitude,timezone,population",
          { count: "exact" },
        )
        .eq("country_id", countryId);

      if (stateId) query = query.eq("state_id", Number.parseInt(stateId, 10));
      if (search) query = query.ilike("name", `%${search}%`);

      query = query.order(sortBy, { ascending: order === "asc" });
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
          return {
            data: r.data ?? null,
            error: r.error,
            count: (r as any).count ?? null,
          };
        },
      });
      data = res.data;
      error = res.error;
      total = res.total;
    }
    if (error) {
      return jsonError({
        status: 500,
        message: error.message,
        code: "DB_ERROR",
      });
    }

    const finalTotal = total ?? data?.length ?? 0;
    const effectiveLimit = paginate ? limit : finalTotal;
    return jsonSuccess(data ?? [], {
      meta: {
        page: paginate ? page : 1,
        limit: effectiveLimit,
        total: finalTotal,
      },
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
