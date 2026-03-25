import { osmEmbedSrc, osmHref } from "@/lib/maps/osm";

export function MapEmbed(props: {
  title: string;
  lat: number;
  lng: number;
  zoom?: number;
  heightClassName?: string;
}) {
  const src = osmEmbedSrc(props.lat, props.lng, props.zoom);
  const href = osmHref(props.lat, props.lng, props.zoom);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200/70 bg-gray-50 px-4 py-3">
        <div className="text-sm font-semibold text-gray-900">{props.title}</div>
        <a
          className="text-sm underline"
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          Open map →
        </a>
      </div>
      <div className={props.heightClassName ?? "h-72"}>
        <iframe
          title={props.title}
          src={src}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
