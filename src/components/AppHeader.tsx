import Link from 'next/link';

export function AppHeader() {
  return (
    <header className='sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
        <Link className='flex items-center gap-2 font-semibold' href='/'>
          <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-900'>
            CSC
          </span>
          <span className='hidden sm:inline'>Countries · States · Cities</span>
        </Link>

        <nav className='flex items-center gap-2 text-sm'>
          <Link className='rounded-md px-3 py-2 hover:bg-gray-100' href='/countries'>
            Countries
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-gray-100' href='/regions'>
            Regions
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-gray-100' href='/states'>
            States
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-gray-100' href='/cities'>
            Cities
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-gray-100' href='/docs'>
            Docs
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-gray-100' href='/terms'>
            Terms
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-gray-100' href='/api/docs'>
            Swagger
          </Link>
        </nav>
      </div>
    </header>
  );
}
