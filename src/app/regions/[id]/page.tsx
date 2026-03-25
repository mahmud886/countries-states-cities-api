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

  return (
    <main>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{region.name}</h1>
          <div className="mt-2 text-sm text-gray-700">
            Region ID: {region.id}
          </div>
        </div>
        <Link className="text-sm underline" href="/regions">
          Back
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="font-medium">Subregions</div>
          </div>
          <ul className="divide-y divide-gray-100 text-sm">
            {region.subregions?.length ? (
              region.subregions.map((s) => (
                <li key={s.id} className="px-4 py-3">
                  <Link
                    className="hover:underline"
                    href={`/subregions/${s.id}`}
                  >
                    {s.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-10 text-center text-sm text-gray-600">
                No subregions
              </li>
            )}
          </ul>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="font-medium">Countries (first 50)</div>
          </div>
          <ul className="divide-y divide-gray-100 text-sm">
            {countriesRes.data?.length ? (
              countriesRes.data.map((c: any) => (
                <li key={c.id} className="px-4 py-3">
                  <Link
                    className="font-medium hover:underline"
                    href={`/countries/${c.id}`}
                  >
                    <span className="mr-2">{c.emoji ?? "🌍"}</span>
                    {c.name}
                  </Link>
                  <div className="mt-1 text-xs text-gray-600">
                    {c.subregion?.name
                      ? `Subregion: ${c.subregion.name}`
                      : "Subregion: -"}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-10 text-center text-sm text-gray-600">
                No countries
              </li>
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
