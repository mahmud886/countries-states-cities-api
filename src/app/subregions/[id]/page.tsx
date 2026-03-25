import { MapEmbed } from "@/components/MapEmbed";
import { internalApiUrl } from "@/lib/server/internalApi";
import Link from "next/link";

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as { success: boolean; data: any; meta?: any };
}

export default async function SubregionDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const subregionRes = await fetchJson(
    await internalApiUrl(`/api/subregions/${id}`),
  );
  const countriesRes = await fetchJson(
    await internalApiUrl(`/api/subregions/${id}/countries`, "page=1&limit=50"),
  );

  const subregion = subregionRes.data as {
    id: number;
    name: string;
    region_id: number;
    region: { id: number; name: string } | null;
  };

  const countries = (countriesRes.data ?? []) as Array<{
    id: number;
    name: string;
    emoji: string | null;
    latitude: number | null;
    longitude: number | null;
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
          <h1 className="text-2xl font-semibold">{subregion.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-700">
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1">
              ID: {subregion.id}
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1">
              Region:{" "}
              <Link
                className="underline"
                href={`/regions/${subregion.region_id}`}
              >
                {subregion.region?.name ?? subregion.region_id}
              </Link>
            </span>
          </div>
        </div>
        <Link
          className="text-sm underline"
          href={`/regions/${subregion.region_id}`}
        >
          Back
        </Link>
      </div>

      {center ? (
        <div className="mt-8">
          <MapEmbed
            title="Subregion map (center)"
            lat={center.lat}
            lng={center.lng}
            zoom={4}
          />
        </div>
      ) : null}

      <section className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="font-medium">Countries (first 50)</div>
        </div>
        <ul className="divide-y divide-gray-100 text-sm">
          {countries.length ? (
            countries.map((c) => (
              <li key={c.id} className="px-4 py-3">
                <Link
                  className="font-medium hover:underline"
                  href={`/countries/${c.id}`}
                >
                  <span className="mr-2">{c.emoji ?? "🌍"}</span>
                  {c.name}
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-10 text-center text-sm text-gray-600">
              No countries
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
