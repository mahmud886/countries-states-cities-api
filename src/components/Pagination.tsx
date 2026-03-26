import Link from 'next/link';

export function Pagination(props: {
  page: number;
  limit: number;
  total: number;
  pathname: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { page, limit, total, pathname, searchParams } = props;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);

  const toQuery = (nextPage: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (k === 'page') continue;
      if (typeof v === 'string' && v.length) params.set(k, v);
    }
    params.set('page', String(nextPage));
    params.set('limit', String(limit));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className='mt-4 flex items-center justify-between text-sm'>
      <div className='text-(--text-muted)'>
        Showing {from}-{to} of {total} · Page {page}/{totalPages}
      </div>
      <div className='flex gap-2'>
        <Link
          className={`rounded-md border bg-(--surface) px-3 py-1.5 shadow-sm ${
            page <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-(--surface-2)'
          }`}
          prefetch={false}
          href={toQuery(Math.max(1, page - 1))}
        >
          Prev
        </Link>
        <Link
          className={`rounded-md border bg-(--surface) px-3 py-1.5 shadow-sm ${
            page >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-(--surface-2)'
          }`}
          prefetch={false}
          href={toQuery(Math.min(totalPages, page + 1))}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
