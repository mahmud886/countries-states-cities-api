import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

export function StatCard(props: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
}) {
  const accent =
    props.accent === 'primary'
      ? 'bg-(--primary)'
      : props.accent === 'secondary'
        ? 'bg-(--secondary)'
        : props.accent === 'tertiary'
          ? 'bg-(--tertiary)'
          : 'bg-(--border)';

  return (
    <Card className='relative overflow-hidden'>
      <div className='px-5 py-5'>
        <div className='text-xs text-(--text-muted)'>{props.label}</div>
        <div className='mt-2 text-2xl font-semibold text-(--text)'>{props.value}</div>
        {props.hint ? <div className='mt-2 text-xs text-(--text-muted)'>{props.hint}</div> : null}
      </div>
      <div className={`absolute right-0 top-0 h-full w-1 ${accent}`} />
    </Card>
  );
}
