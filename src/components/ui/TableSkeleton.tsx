import { Skeleton } from '@/components/ui/Skeleton';

export function TableSkeleton(props: { columns: number; rows?: number; embedded?: boolean }) {
  const rows = props.rows ?? 10;
  const widths = ['w-24', 'w-28', 'w-32', 'w-36', 'w-40', 'w-44', 'w-52', 'w-60'] as const;

  const pickWidth = (seed: number) => widths[seed % widths.length];

  const table = (
    <div className='max-h-[calc(100vh-260px)] overflow-auto'>
      <table className='w-full text-[15px]'>
        <thead className='bg-(--surface-2)'>
          <tr>
            {Array.from({ length: props.columns }).map((_, idx) => (
              <th key={idx} className='px-5 py-4'>
                <Skeleton className='h-3 w-20 rounded-full' />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rIdx) => (
            <tr key={rIdx} className='border-t'>
              {Array.from({ length: props.columns }).map((_, cIdx) => (
                <td key={cIdx} className='px-5 py-4'>
                  {cIdx === 0 ? (
                    <div className='flex items-center gap-3'>
                      <Skeleton className='h-8 w-8 flex-none rounded-full' />
                      <div className='min-w-0'>
                        <Skeleton className={`h-4 ${pickWidth(rIdx * 7 + cIdx * 3)} max-w-85 rounded-full`} />
                        <div className='mt-2'>
                          <Skeleton className={`h-3 ${pickWidth(rIdx * 11 + cIdx * 5)} max-w-55 rounded-full`} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Skeleton className={`h-4 ${pickWidth(rIdx * 5 + cIdx * 9)} max-w-55 rounded-full`} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (props.embedded) return table;

  return <div className='overflow-hidden rounded-2xl border bg-(--surface) shadow-(--shadow)'>{table}</div>;
}
