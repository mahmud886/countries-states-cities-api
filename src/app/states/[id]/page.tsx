import { internalApiUrl } from "@/lib/server/internalApi";
import Link from "next/link";

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as { success: boolean; data: any };
}

export default async function StateDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const stateRes = await fetchJson(await internalApiUrl(`/api/states/${id}`));
  const state = stateRes.data as {
    id: number;
    name: string;
    iso2: string | null;
    type: string | null;
    country_id: number;
    country: { id: number; name: string; iso2: string | null } | null;
  };

  const citiesRes = await fetchJson(
    await internalApiUrl(`/api/states/${id}/cities`, "limit=50&page=1"),
  );

  return (
    <main>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{state.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-700">
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1">
              ID: {state.id}
            </span>
            {state.iso2 ? (
              <span className="rounded-md border border-gray-200 bg-white px-2 py-1">
                Code: {state.iso2}
              </span>
            ) : null}
            {state.type ? (
              <span className="rounded-md border border-gray-200 bg-white px-2 py-1">
                Type: {state.type}
              </span>
            ) : null}
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1">
              Country:{" "}
              <Link
                className="underline"
                href={`/countries/${state.country_id}`}
              >
                {state.country?.name ?? state.country_id}
              </Link>
            </span>
          </div>
        </div>
        <Link className="text-sm underline" href="/states">
          Back
        </Link>
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="font-medium">Cities (first 50)</div>
        </div>
        <ul className="divide-y divide-gray-100 text-sm">
          {citiesRes.data.map((c: any) => (
            <li key={c.id} className="px-4 py-3">
              <Link
                className="hover:underline"
                href={`/cities?state_id=${state.id}&search=${encodeURIComponent(c.name)}`}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-100 px-4 py-3 text-sm">
          <Link className="underline" href={`/cities?state_id=${state.id}`}>
            View all cities →
          </Link>
        </div>
      </section>
    </main>
  );
}
