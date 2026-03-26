import { Skeleton } from '@/components/ui/Skeleton';

export default function CityDetailsLoading() {
  return (
    <main>
      <div className='flex items-center justify-between'>
        <div>
          <Skeleton className='h-8 w-72 max-w-full rounded-md' />
          <div className='mt-3 flex flex-wrap gap-2'>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className='h-7 w-32 rounded-md' />
            ))}
          </div>
        </div>
        <Skeleton className='h-8 w-16 rounded-md' />
      </div>

      <div className='mt-8 rounded-xl border bg-(--surface) p-6 shadow-sm'>
        <div className='grid gap-3 sm:grid-cols-2'>
          <Skeleton className='h-4 w-full rounded-md' />
          <Skeleton className='h-4 w-full rounded-md' />
          <Skeleton className='h-4 w-full rounded-md' />
          <Skeleton className='h-4 w-full rounded-md' />
        </div>
      </div>
    </main>
  );
}
