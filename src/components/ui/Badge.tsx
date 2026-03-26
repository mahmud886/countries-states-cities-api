import type { ReactNode } from 'react';

export function Badge(props: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border bg-(--surface) px-2 py-0.5 text-xs text-(--text-muted) shadow-sm ${props.className ?? ''}`}
    >
      {props.children}
    </span>
  );
}
