import { Skeleton } from '@/components/ui/Skeleton';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export default function StatesLoading() {
  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <Skeleton className='h-7 w-32 rounded-md' />
          <div className='mt-2'>
            <Skeleton className='h-4 w-96 max-w-full rounded-md' />
          </div>
        </div>
        <div className='w-full sm:max-w-md'>
          <Skeleton className='h-10 w-full rounded-md' />
        </div>
      </div>

      <div className='mt-6'>
        <TableSkeleton columns={4} rows={12} />
      </div>
    </main>
  );
}
