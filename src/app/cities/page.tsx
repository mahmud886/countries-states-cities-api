import { Pagination } from "@/components/Pagination";
import { SearchForm } from "@/components/SearchForm";
import { internalApiUrl } from "@/lib/server/internalApi";
import Link from "next/link";

type SearchParams = Record<string, string | string[] | undefined>;

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as {
    success: boolean;
    data: Array<{
      id: number;
      name: string;
      state_id: number;
      country_id: number;
      type: string | null;
    }>;
    meta: { page: number; limit: number; total: number };
  };
}

export default async function CitiesPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string" && v.length) qs.set(k, v);
  }

  const json = await fetchJson(
    await internalApiUrl("/api/cities", qs.toString()),
  );

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cities</h1>
          <p className="mt-1 text-sm text-gray-700">
            {json.meta.total} total · Filter by state_id / country_id
          </p>
        </div>
        <div className="w-full sm:max-w-md">
          <SearchForm placeholder="Search cities (e.g. Dhaka)" />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Country</th>
              </tr>
            </thead>
            <tbody>
              {json.data.length ? (
                json.data.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        className="font-medium hover:underline"
                        href={`/cities/${c.id}`}
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{c.type ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <Link
                        className="underline"
                        href={`/states/${c.state_id}`}
                      >
                        {c.state_id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <Link
                        className="underline"
                        href={`/countries/${c.country_id}`}
                      >
                        {c.country_id}
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-gray-100">
                  <td
                    className="px-4 py-10 text-center text-sm text-gray-600"
                    colSpan={4}
                  >
                    No cities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={json.meta.page}
        limit={json.meta.limit}
        total={json.meta.total}
        pathname="/cities"
        searchParams={searchParams}
      />
    </main>
  );
}
