import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export function AppHeader() {
  return (
    <header className='sticky top-0 z-40 border-b bg-[var(--surface)]/80 backdrop-blur'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
        <Link className='flex items-center gap-2 font-semibold' href='/'>
          <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-[var(--surface)] text-[var(--text)] shadow-sm'>
            CSC
          </span>
          <span className='hidden sm:inline text-[var(--text)]'>Countries · States · Cities</span>
        </Link>

        <nav className='flex items-center gap-2 text-sm text-[var(--text)]'>
          <Link className='rounded-md px-3 py-2 hover:bg-[var(--surface-2)]' href='/countries'>
            Countries
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-[var(--surface-2)]' href='/regions'>
            Regions
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-[var(--surface-2)]' href='/states'>
            States
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-[var(--surface-2)]' href='/cities'>
            Cities
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-[var(--surface-2)]' href='/docs'>
            Docs
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-[var(--surface-2)]' href='/terms'>
            Terms
          </Link>
          <Link className='rounded-md px-3 py-2 hover:bg-[var(--surface-2)]' href='/api/docs'>
            Swagger
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
