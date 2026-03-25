import { Skeleton } from '@/components/ui/Skeleton';

export default function SubregionDetailsLoading() {
  return (
    <main>
      <div className='flex items-start justify-between'>
        <div>
          <Skeleton className='h-8 w-72 max-w-full rounded-md' />
          <div className='mt-3 flex flex-wrap gap-2'>
            {Array.from({ length: 2 }).map((_, idx) => (
              <Skeleton key={idx} className='h-7 w-36 rounded-md' />
            ))}
          </div>
        </div>
        <Skeleton className='h-8 w-16 rounded-md' />
      </div>

      <div className='mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white'>
        <div className='border-b border-gray-100 px-4 py-3'>
          <Skeleton className='h-4 w-44 rounded-md' />
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
