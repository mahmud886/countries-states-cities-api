import { Skeleton } from '@/components/ui/Skeleton';

export default function CountryDetailsLoading() {
  return (
    <main>
      <div className='flex items-center justify-between'>
        <div>
          <Skeleton className='h-8 w-72 max-w-full rounded-md' />
          <div className='mt-3 flex flex-wrap gap-2'>
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className='h-7 w-28 rounded-md' />
            ))}
          </div>
        </div>
        <Skeleton className='h-8 w-16 rounded-md' />
      </div>

      <div className='mt-8 grid gap-6 lg:grid-cols-2'>
        <div className='overflow-hidden rounded-xl border bg-(--surface) shadow-sm'>
          <div className='border-b bg-(--surface-2) px-4 py-3'>
            <Skeleton className='h-4 w-40 rounded-md' />
          </div>
          <div className='divide-y'>
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className='px-4 py-3'>
                <Skeleton className='h-4 w-60 max-w-full rounded-md' />
              </div>
            ))}
          </div>
        </div>

        <div className='overflow-hidden rounded-xl border bg-(--surface) shadow-sm'>
          <div className='border-b bg-(--surface-2) px-4 py-3'>
            <Skeleton className='h-4 w-40 rounded-md' />
          </div>
          <div className='divide-y'>
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className='px-4 py-3'>
                <Skeleton className='h-4 w-60 max-w-full rounded-md' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
