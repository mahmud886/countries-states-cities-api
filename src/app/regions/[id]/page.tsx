import { MapEmbed } from "@/components/MapEmbed";
import { internalApiUrl } from "@/lib/server/internalApi";
import Link from "next/link";

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as { success: boolean; data: any; meta?: any };
}

export default async function RegionDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const regionRes = await fetchJson(await internalApiUrl(`/api/regions/${id}`));
  const countriesRes = await fetchJson(
    await internalApiUrl(`/api/regions/${id}/countries`, "page=1&limit=50"),
  );

  const region = regionRes.data as {
    id: number;
    name: string;
    subregions: Array<{ id: number; name: string }>;
  };

  const countries = (countriesRes.data ?? []) as Array<{
    id: number;
    name: string;
    emoji: string | null;
    latitude: number | null;
    longitude: number | null;
    subregion: { id: number; name: string } | null;
  }>;

  const coords = countries
    .map((c) => ({ lat: c.latitude, lng: c.longitude }))
    .filter(
      (p): p is { lat: number; lng: number } =>
        typeof p.lat === "number" && typeof p.lng === "number",
    );

  const center =
    coords.length > 0
      ? {
          lat: coords.reduce((sum, p) => sum + p.lat, 0) / coords.length,
          lng: coords.reduce((sum, p) => sum + p.lng, 0) / coords.length,
        }
      : null;

  return (
    <main>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            {region.name}
          </h1>
          <div className="mt-2 text-sm text-[var(--text-muted)]">
            Region ID: {region.id}
          </div>
        </div>
        <Link className="text-sm underline text-[var(--text)]" href="/regions">
          Back
        </Link>
      </div>

      {center ? (
        <div className="mt-8">
          <MapEmbed
            title="Region map (center)"
            lat={center.lat}
            lng={center.lng}
            zoom={3}
          />
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-xl border bg-[var(--surface)] shadow-sm">
          <div className="border-b bg-[var(--surface-2)] px-4 py-3">
            <div className="font-medium text-[var(--text)]">Subregions</div>
          </div>
          <ul className="divide-y divide-gray-100 text-sm">
            {region.subregions?.length ? (
              region.subregions.map((s) => (
                <li key={s.id} className="px-4 py-3">
                  <Link
                    className="text-[var(--text)] hover:underline"
                    href={`/subregions/${s.id}`}
                  >
                    {s.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">
                No subregions
              </li>
            )}
          </ul>
        </section>

        <section className="overflow-hidden rounded-xl border bg-[var(--surface)] shadow-sm">
          <div className="border-b bg-[var(--surface-2)] px-4 py-3">
            <div className="font-medium text-[var(--text)]">
              Countries (first 50)
            </div>
          </div>
          <ul className="divide-y divide-gray-100 text-sm">
            {countries.length ? (
              countries.map((c) => (
                <li key={c.id} className="px-4 py-3">
                  <Link
                    className="font-medium text-[var(--text)] hover:underline"
                    href={`/countries/${c.id}`}
                  >
                    <span className="mr-2">{c.emoji ?? "🌍"}</span>
                    {c.name}
                  </Link>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">
                    {c.subregion?.name
                      ? `Subregion: ${c.subregion.name}`
                      : "Subregion: -"}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">
                No countries
              </li>
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
