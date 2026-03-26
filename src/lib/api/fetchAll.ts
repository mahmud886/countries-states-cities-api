export async function fetchAllPages<T>(opts: {
  chunkSize?: number;
  fetchPage: (
    from: number,
    to: number,
  ) => Promise<{
    data: T[] | null;
    error: { message: string } | null;
    count: number | null;
  }>;
}) {
  const chunkSize = Math.max(1, Math.min(5000, opts.chunkSize ?? 1000));

  let from = 0;
  let total: number | null = null;
  const all: T[] = [];

  while (true) {
    const { data, error, count } = await opts.fetchPage(
      from,
      from + chunkSize - 1,
    );
    if (error)
      return { data: null as T[] | null, error, total: null as number | null };
    if (typeof count === "number" && total == null) total = count;

    const rows = data ?? [];
    all.push(...rows);

    if (rows.length < chunkSize) break;
    from += chunkSize;
  }

  return {
    data: all,
    error: null as { message: string } | null,
    total: total ?? all.length,
  };
}
