import { SidebarNav, type NavItem } from '@/components/SidebarNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard' },
  { href: '/countries', label: 'Countries' },
  { href: '/regions', label: 'Regions' },
  { href: '/states', label: 'States' },
  { href: '/cities', label: 'Cities' },
  { href: '/docs', label: 'Docs' },
  { href: '/terms', label: 'Terms' },
];

export function AppShell(props: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen w-full'>
      <div className='flex min-h-screen w-full'>
        <aside className='sticky top-0 hidden h-screen w-72 flex-col gap-6 overflow-y-auto border-r bg-[var(--surface)] p-5 lg:flex'>
          <Link href='/' className='flex items-center gap-3'>
            <div className='grid h-10 w-10 place-items-center rounded-xl border bg-[var(--surface-2)] shadow-sm'>
              <span className='text-sm font-semibold text-[var(--text)]'>CSC</span>
            </div>
            <div className='min-w-0'>
              <div className='truncate text-sm font-semibold text-[var(--text)]'>Location Manager</div>
              <div className='truncate text-xs text-[var(--text-muted)]'>Countries · States · Cities</div>
            </div>
          </Link>

          <SidebarNav items={navItems} />

          <div className='mt-auto space-y-3'>
            <div className='rounded-xl border bg-[var(--surface-2)] p-3 text-xs text-[var(--text-muted)] shadow-sm'>
              Tip: Use search on directory pages and open map previews to explore faster.
            </div>
            <div className='flex items-center justify-between'>
              <div className='text-xs text-[var(--text-muted)]'>Theme</div>
              <ThemeToggle />
            </div>
            <a
              className='block rounded-lg border bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] shadow-sm hover:bg-[var(--surface-2)]'
              href='/api/docs'
            >
              Swagger →
            </a>
          </div>
        </aside>

        <div className='flex min-w-0 flex-1 flex-col'>
          <header className='sticky top-0 z-30 border-b bg-[var(--surface)]/75 backdrop-blur lg:hidden'>
            <div className='flex items-center justify-between px-4 py-3'>
              <Link href='/' className='flex items-center gap-2'>
                <span className='grid h-9 w-9 place-items-center rounded-xl border bg-[var(--surface-2)] shadow-sm'>
                  <span className='text-xs font-semibold text-[var(--text)]'>CSC</span>
                </span>
                <span className='text-sm font-semibold text-[var(--text)]'>Location Manager</span>
              </Link>
              <ThemeToggle />
            </div>
            <div className='overflow-x-auto px-4 pb-3'>
              <div className='flex gap-2'>
                {navItems.map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    className='whitespace-nowrap rounded-full border bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--text)] shadow-sm hover:bg-[var(--surface-2)]'
                  >
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          </header>

          <main className='flex-1'>
            <div className='w-full px-4 py-6 sm:px-6 lg:px-8'>{props.children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
