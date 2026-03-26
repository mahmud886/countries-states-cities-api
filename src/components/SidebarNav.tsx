'use client';

import { Icon, type IconName } from '@/components/ui/Icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavItem = { href: string; label: string; icon: IconName };

export function SidebarNav(props: { items: NavItem[]; className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={`space-y-1 ${props.className ?? ''}`}>
      {props.items.map((it) => {
        const active = pathname === it.href || (it.href !== '/' && pathname.startsWith(it.href));
        return (
          <Link
            key={it.href}
            href={it.href}
            prefetch={false}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? 'bg-(--surface-2) text-(--text) shadow-sm'
                : 'text-(--text-muted) hover:bg-(--surface-2) hover:text-(--text)'
            }`}
          >
            <span className='flex min-w-0 items-center gap-2'>
              <Icon name={it.icon} className='h-4 w-4 flex-none' />
              <span className='truncate'>{it.label}</span>
            </span>
            {active ? <span className='h-1.5 w-1.5 rounded-full bg-(--primary)' /> : null}
          </Link>
        );
      })}
    </nav>
  );
}
