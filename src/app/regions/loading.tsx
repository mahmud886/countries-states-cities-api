import { Skeleton } from '@/components/ui/Skeleton';

export default function RegionsLoading() {
  return (
    <main>
      <Skeleton className='h-7 w-36 rounded-md' />
      <div className='mt-2'>
        <Skeleton className='h-4 w-96 max-w-full rounded-md' />
      </div>

      <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className='rounded-xl border border-gray-200 bg-white p-5'>
            <Skeleton className='h-4 w-32 rounded-md' />
            <div className='mt-2'>
              <Skeleton className='h-3 w-20 rounded-md' />
            </div>
            <div className='mt-6'>
              <Skeleton className='h-4 w-16 rounded-md' />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
