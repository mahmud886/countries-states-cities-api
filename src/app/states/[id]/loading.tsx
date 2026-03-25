import { Skeleton } from '@/components/ui/Skeleton';

export default function StateDetailsLoading() {
  return (
    <main>
      <div className='flex items-center justify-between'>
        <div>
          <Skeleton className='h-8 w-72 max-w-full rounded-md' />
          <div className='mt-3 flex flex-wrap gap-2'>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className='h-7 w-32 rounded-md' />
            ))}
          </div>
        </div>
        <Skeleton className='h-8 w-16 rounded-md' />
      </div>

      <div className='mt-8 overflow-hidden rounded-xl border bg-[var(--surface)] shadow-sm'>
        <div className='border-b bg-[var(--surface-2)] px-4 py-3'>
          <Skeleton className='h-4 w-48 rounded-md' />
        </div>
        <div className='divide-y'>
          {Array.from({ length: 14 }).map((_, idx) => (
            <div key={idx} className='px-4 py-3'>
              <Skeleton className='h-4 w-64 max-w-full rounded-md' />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
