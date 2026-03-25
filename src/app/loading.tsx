import { Skeleton } from '@/components/ui/Skeleton';

export default function RootLoading() {
  return (
    <main>
      <div className='rounded-2xl border border-gray-200 bg-white p-6 sm:p-10'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <Skeleton className='h-8 w-80 max-w-full rounded-md' />
            <div className='mt-3'>
              <Skeleton className='h-4 w-96 max-w-full rounded-md' />
            </div>
          </div>
          <div className='flex gap-2'>
            <Skeleton className='h-10 w-28 rounded-md' />
            <Skeleton className='h-10 w-28 rounded-md' />
          </div>
        </div>

        <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className='rounded-xl border border-gray-200 bg-gray-50 p-5'>
              <Skeleton className='h-4 w-28 rounded-md' />
              <div className='mt-3'>
                <Skeleton className='h-4 w-44 rounded-md' />
              </div>
              <div className='mt-6'>
                <Skeleton className='h-4 w-20 rounded-md' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
