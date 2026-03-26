import { osmEmbedSrc, osmHref } from '@/lib/maps/osm';

export function MapEmbed(props: {
  title: string;
  lat: number;
  lng: number;
  zoom?: number;
  heightClassName?: string;
  className?: string;
}) {
  const src = osmEmbedSrc(props.lat, props.lng, props.zoom);
  const href = osmHref(props.lat, props.lng, props.zoom);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border bg-(--surface) shadow-(--shadow) ${props.className ?? ''}`}
    >
      <div className='flex items-center justify-between rounded-t-2xl border-b bg-(--surface-2) px-4 py-3'>
        <div className='text-sm font-semibold text-(--text)'>{props.title}</div>
        <a className='text-sm underline' href={href} target='_blank' rel='noreferrer'>
          Open map →
        </a>
      </div>
      <div className={`min-h-0 ${props.heightClassName ?? 'h-72'}`}>
        <iframe
          title={props.title}
          src={src}
          className='h-full w-full'
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        />
      </div>
    </div>
  );
}
