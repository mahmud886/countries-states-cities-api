import { z } from 'zod';

const IntFromString = z
  .string()
  .transform((v) => Number.parseInt(v, 10))
  .refine((v) => Number.isFinite(v), 'Invalid integer');

export const PaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .pipe(IntFromString)
    .refine((v) => v >= 1, 'page must be >= 1'),
  limit: z
    .string()
    .optional()
    .default('20')
    .pipe(IntFromString)
    .refine((v) => v >= 1 && v <= 100, 'limit must be 1..100'),
});

export const SortOrderSchema = z
  .string()
  .optional()
  .transform((v) => (v ?? 'asc').toLowerCase())
  .refine((v) => v === 'asc' || v === 'desc', 'order must be asc|desc')
  .transform((v) => v as 'asc' | 'desc');

export function getStringParam(searchParams: URLSearchParams, key: string): string | undefined {
  const value = searchParams.get(key);
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export function parsePagination(searchParams: URLSearchParams) {
  const hasPage = searchParams.has('page');
  const hasLimit = searchParams.has('limit');

  if (!hasPage && !hasLimit) {
    return { page: 1, limit: 20, offset: 0, paginate: false as const };
  }

  const parsed = PaginationSchema.parse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  });

  const offset = (parsed.page - 1) * parsed.limit;
  return { ...parsed, offset, paginate: true as const };
}
