import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function RootLoading() {
  return (
    <main>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <Skeleton className='h-7 w-72 max-w-full rounded-md' />
            <div className='mt-2'>
              <Skeleton className='h-4 w-130 max-w-full rounded-md' />
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Skeleton className='h-10 w-36 rounded-md' />
            <Skeleton className='h-10 w-28 rounded-md' />
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className='rounded-2xl border bg-(--surface) shadow-(--shadow)'>
              <div className='px-5 py-5'>
                <Skeleton className='h-3 w-24 rounded-md' />
                <div className='mt-3'>
                  <Skeleton className='h-7 w-20 rounded-md' />
                </div>
                <div className='mt-3'>
                  <Skeleton className='h-3 w-28 rounded-md' />
                </div>
              </div>
              <div className='absolute right-0 top-0 hidden h-full w-1 bg-(--border)' />
            </div>
          ))}
        </div>

        <div className='grid gap-6 lg:grid-cols-12 lg:items-stretch'>
          <div className='lg:col-span-8'>
            <div className='flex h-90 flex-col overflow-hidden rounded-2xl border bg-(--surface) shadow-(--shadow) lg:h-[calc(100vh-438px)]'>
              <div className='flex items-center justify-between border-b bg-(--surface-2) px-4 py-3'>
                <Skeleton className='h-4 w-28 rounded-md' />
                <Skeleton className='h-4 w-20 rounded-md' />
              </div>
              <div className='min-h-0 flex-1 p-4'>
                <Skeleton className='h-full w-full rounded-xl' />
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-6 lg:col-span-4 lg:h-[calc(100vh-438px)] lg:justify-between'>
            <Card>
              <CardHeader
                title={<Skeleton className='h-4 w-28 rounded-md' />}
                description={<Skeleton className='h-3 w-52 rounded-md' />}
              />
              <CardBody className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-4 w-20 rounded-md' />
                  <Skeleton className='h-4 w-10 rounded-md' />
                </div>
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-4 w-16 rounded-md' />
                  <Skeleton className='h-4 w-10 rounded-md' />
                </div>
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-4 w-14 rounded-md' />
                  <Skeleton className='h-4 w-10 rounded-md' />
                </div>
                <div className='pt-2'>
                  <Skeleton className='h-9 w-32 rounded-md' />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title={<Skeleton className='h-4 w-28 rounded-md' />}
                description={<Skeleton className='h-3 w-40 rounded-md' />}
                right={<Skeleton className='h-4 w-12 rounded-md' />}
              />
              <CardBody className='grid gap-2'>
                <Skeleton className='h-10 w-full rounded-xl' />
                <Skeleton className='h-10 w-full rounded-xl' />
                <Skeleton className='h-10 w-full rounded-xl' />
              </CardBody>
            </Card>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-12'>
          <div className='lg:col-span-7'>
            <Card>
              <CardHeader
                title={<Skeleton className='h-4 w-28 rounded-md' />}
                description={<Skeleton className='h-3 w-56 rounded-md' />}
                right={<Skeleton className='h-9 w-28 rounded-md' />}
              />
              <CardBody className='space-y-4'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-14 w-14 rounded-2xl' />
                    <div className='min-w-0'>
                      <Skeleton className='h-5 w-44 rounded-md' />
                      <div className='mt-2'>
                        <Skeleton className='h-4 w-56 rounded-md' />
                      </div>
                    </div>
                  </div>
                  <div className='flex w-36 flex-col gap-2'>
                    <Skeleton className='h-10 w-full rounded-xl' />
                    <Skeleton className='h-10 w-full rounded-xl' />
                  </div>
                </div>
                <Skeleton className='h-64 w-full rounded-2xl' />
              </CardBody>
            </Card>
          </div>
          <div className='flex flex-col gap-6 lg:col-span-5'>
            <Card>
              <CardHeader
                title={<Skeleton className='h-4 w-28 rounded-md' />}
                description={<Skeleton className='h-3 w-44 rounded-md' />}
                right={<Skeleton className='h-4 w-12 rounded-md' />}
              />
              <CardBody className='space-y-2'>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className='h-10 w-full rounded-xl' />
                ))}
              </CardBody>
            </Card>
            <Card>
              <CardHeader
                title={<Skeleton className='h-4 w-24 rounded-md' />}
                description={<Skeleton className='h-3 w-44 rounded-md' />}
                right={<Skeleton className='h-4 w-12 rounded-md' />}
              />
              <CardBody className='space-y-2'>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className='h-10 w-full rounded-xl' />
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
