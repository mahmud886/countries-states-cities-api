import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export default function CountriesLoading() {
  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <Skeleton className='h-7 w-44 rounded-md' />
          <div className='mt-2'>
            <Skeleton className='h-4 w-96 max-w-full rounded-md' />
          </div>
        </div>
        <div className='w-full sm:max-w-md'>
          <Skeleton className='h-10 w-full rounded-md' />
        </div>
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <Card>
            <CardHeader
              title={<Skeleton className='h-4 w-28 rounded-md' />}
              description={<Skeleton className='h-3 w-56 rounded-md' />}
              right={
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-9 w-20 rounded-md' />
                  <Skeleton className='h-9 w-16 rounded-md' />
                  <Skeleton className='h-9 w-16 rounded-md' />
                  <Skeleton className='h-9 w-16 rounded-md' />
                  <Skeleton className='h-9 w-24 rounded-md' />
                </div>
              }
            />
            <TableSkeleton columns={5} rows={14} embedded />
            <CardBody className='pt-3'>
              <Skeleton className='h-4 w-80 max-w-full rounded-md' />
            </CardBody>
          </Card>
        </div>
        <div className='flex flex-col gap-6 lg:col-span-4'>
          <Card>
            <CardHeader
              title={<Skeleton className='h-4 w-40 rounded-md' />}
              description={<Skeleton className='h-3 w-48 rounded-md' />}
            />
            <div className='p-4'>
              <Skeleton className='h-90 w-full rounded-xl' />
            </div>
          </Card>
          <Card>
            <CardHeader
              title={<Skeleton className='h-4 w-20 rounded-md' />}
              description={<Skeleton className='h-3 w-28 rounded-md' />}
            />
            <CardBody className='space-y-3'>
              <Skeleton className='h-4 w-full rounded-md' />
              <Skeleton className='h-4 w-5/6 rounded-md' />
              <Skeleton className='h-4 w-2/3 rounded-md' />
              <Skeleton className='h-9 w-40 rounded-md' />
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
