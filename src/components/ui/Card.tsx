import type { ReactNode } from 'react';

export function Card(props: { className?: string; children: ReactNode }) {
  return (
    <div className={`overflow-hidden rounded-2xl border bg-(--surface) shadow-(--shadow) ${props.className ?? ''}`}>
      {props.children}
    </div>
  );
}

export function CardHeader(props: { title: ReactNode; description?: ReactNode; right?: ReactNode }) {
  return (
    <div className='flex flex-col gap-3 rounded-t-2xl border-b bg-(--surface-2) px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='min-w-0'>
        <div className='truncate text-sm font-semibold text-(--text)'>{props.title}</div>
        {props.description ? <div className='mt-1 text-xs text-(--text-muted)'>{props.description}</div> : null}
      </div>
      {props.right ? <div className='flex flex-wrap items-center gap-2'>{props.right}</div> : null}
    </div>
  );
}

export function CardBody(props: { className?: string; children: ReactNode }) {
  return <div className={`px-5 py-5 ${props.className ?? ''}`}>{props.children}</div>;
}
