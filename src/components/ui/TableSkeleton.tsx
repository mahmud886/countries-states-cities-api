import { Skeleton } from '@/components/ui/Skeleton';

export function TableSkeleton(props: { columns: number; rows?: number }) {
  const rows = props.rows ?? 10;
  const widths = ['w-24', 'w-28', 'w-32', 'w-36', 'w-40', 'w-44', 'w-52', 'w-60'] as const;

  const pickWidth = (seed: number) => widths[seed % widths.length];

  return (
    <div className='overflow-hidden rounded-xl border bg-[var(--surface)] shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-[var(--surface-2)]'>
            <tr>
              {Array.from({ length: props.columns }).map((_, idx) => (
                <th key={idx} className='px-4 py-3'>
                  <Skeleton className='h-3 w-20 rounded-full' />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rIdx) => (
              <tr key={rIdx} className='border-t'>
                {Array.from({ length: props.columns }).map((_, cIdx) => (
                  <td key={cIdx} className='px-4 py-3'>
                    {cIdx === 0 ? (
                      <div className='flex items-center gap-3'>
                        <Skeleton className='h-8 w-8 flex-none rounded-full' />
                        <div className='min-w-0'>
                          <Skeleton className={`h-4 ${pickWidth(rIdx * 7 + cIdx * 3)} max-w-[340px] rounded-full`} />
                          <div className='mt-2'>
                            <Skeleton className={`h-3 ${pickWidth(rIdx * 11 + cIdx * 5)} max-w-[220px] rounded-full`} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Skeleton className={`h-4 ${pickWidth(rIdx * 5 + cIdx * 9)} max-w-[220px] rounded-full`} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
