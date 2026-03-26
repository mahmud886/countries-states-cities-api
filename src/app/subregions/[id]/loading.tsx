import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

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

      <div className='mt-8'>
        <Card>
          <CardHeader
            title={<Skeleton className='h-4 w-44 rounded-md' />}
            description={<Skeleton className='h-3 w-48 rounded-md' />}
          />
          <CardBody className='space-y-3'>
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between gap-4 rounded-xl border bg-(--surface) px-4 py-3 shadow-sm'
              >
                <Skeleton className='h-4 w-64 max-w-full rounded-md' />
                <Skeleton className='h-4 w-10 rounded-md' />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
