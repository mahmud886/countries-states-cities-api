import { internalApiUrl } from "@/lib/server/internalApi";
import Link from "next/link";

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as {
    success: boolean;
    data: Array<{ id: number; name: string; wikidata_id: string | null }>;
    meta: { page: number; limit: number; total: number };
  };
}

export default async function RegionsPage() {
  const json = await fetchJson(
    await internalApiUrl("/api/regions", "limit=50&page=1"),
  );

  return (
    <main>
      <div>
        <h1 className="text-2xl font-semibold">Regions</h1>
        <p className="mt-1 text-sm text-gray-700">
          {json.meta.total} total · Regions contain subregions, and countries
          belong to regions.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {json.data.map((r) => (
          <Link
            key={r.id}
            href={`/regions/${r.id}`}
            className="rounded-xl border border-gray-200/60 bg-white p-5 shadow-sm hover:bg-gray-50"
          >
            <div className="text-sm font-medium">{r.name}</div>
            <div className="mt-1 text-xs text-gray-600">ID: {r.id}</div>
            <div className="mt-4 text-sm underline">Open →</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
