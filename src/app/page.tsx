import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <div className='rounded-2xl border bg-[var(--surface)] p-6 shadow-sm sm:p-10'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-semibold tracking-tight text-[var(--text)]'>Countries, States & Cities</h1>
            <p className='mt-2 text-sm text-[var(--text-muted)]'>
              Search and explore the dataset. Use Swagger docs for the REST API.
            </p>
          </div>
          <div className='flex gap-2'>
            <Link
              className='rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] shadow-sm hover:opacity-95'
              href='/countries'
            >
              Explore
            </Link>
            <Link
              className='rounded-md border bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] shadow-sm hover:bg-[var(--surface-2)]'
              href='/api/docs'
            >
              API Docs
            </Link>
          </div>
        </div>

        <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Link
            className='group rounded-xl border bg-[var(--surface-2)] p-5 shadow-sm hover:bg-[var(--surface)]'
            href='/countries'
          >
            <div className='text-sm font-medium text-[var(--text)]'>Countries</div>
            <div className='mt-1 text-xs text-[var(--text-muted)]'>Browse, search, filter, sort</div>
            <div className='mt-4 text-sm text-[var(--text)] group-hover:underline'>Open →</div>
          </Link>
          <Link
            className='group rounded-xl border bg-[var(--surface-2)] p-5 shadow-sm hover:bg-[var(--surface)]'
            href='/regions'
          >
            <div className='text-sm font-medium text-[var(--text)]'>Regions</div>
            <div className='mt-1 text-xs text-[var(--text-muted)]'>Browse regions and subregions</div>
            <div className='mt-4 text-sm text-[var(--text)] group-hover:underline'>Open →</div>
          </Link>
          <Link
            className='group rounded-xl border bg-[var(--surface-2)] p-5 shadow-sm hover:bg-[var(--surface)]'
            href='/states'
          >
            <div className='text-sm font-medium text-[var(--text)]'>States</div>
            <div className='mt-1 text-xs text-[var(--text-muted)]'>Filter by country_id</div>
            <div className='mt-4 text-sm text-[var(--text)] group-hover:underline'>Open →</div>
          </Link>
          <Link
            className='group rounded-xl border bg-[var(--surface-2)] p-5 shadow-sm hover:bg-[var(--surface)]'
            href='/cities'
          >
            <div className='text-sm font-medium text-[var(--text)]'>Cities</div>
            <div className='mt-1 text-xs text-[var(--text-muted)]'>Filter by state_id / country_id</div>
            <div className='mt-4 text-sm text-[var(--text)] group-hover:underline'>Open →</div>
          </Link>
        </div>

        <div className='mt-8 grid gap-3 sm:grid-cols-2'>
          <div className='rounded-xl border bg-[var(--surface)] p-5 shadow-sm'>
            <div className='text-sm font-medium text-[var(--text)]'>REST API</div>
            <div className='mt-1 text-xs text-[var(--text-muted)]'>
              List endpoints support <span className='font-mono'>page</span>, <span className='font-mono'>limit</span>,{' '}
              <span className='font-mono'>search</span>, <span className='font-mono'>sort</span>,{' '}
              <span className='font-mono'>order</span>.
            </div>
            <div className='mt-4 text-xs text-[var(--text-muted)]'>
              Example: <span className='font-mono'>/api/countries?search=dhaka&amp;limit=20</span>
            </div>
          </div>
          <div className='rounded-xl border bg-[var(--surface)] p-5 shadow-sm'>
            <div className='text-sm font-medium text-[var(--text)]'>Swagger UI</div>
            <div className='mt-1 text-xs text-[var(--text-muted)]'>Browse endpoints and try them in the browser.</div>
            <div className='mt-4'>
              <Link className='text-sm underline text-[var(--text)]' href='/api/docs'>
                Open Swagger →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
