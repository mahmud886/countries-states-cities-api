import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Countries, States & Cities
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Search and explore the dataset. Use Swagger docs for the REST API.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              className="rounded-md border border-gray-200/70 bg-white px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
              href="/countries"
            >
              Explore
            </Link>
            <Link
              className="rounded-md border border-gray-200/70 bg-white px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
              href="/api/docs"
            >
              API Docs
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            className="group rounded-xl border border-gray-200/60 bg-gray-50 p-5 shadow-sm hover:bg-white"
            href="/countries"
          >
            <div className="text-sm font-medium">Countries</div>
            <div className="mt-1 text-xs text-gray-600">
              Browse, search, filter, sort
            </div>
            <div className="mt-4 text-sm text-gray-900 group-hover:underline">
              Open →
            </div>
          </Link>
          <Link
            className="group rounded-xl border border-gray-200/60 bg-gray-50 p-5 shadow-sm hover:bg-white"
            href="/regions"
          >
            <div className="text-sm font-medium">Regions</div>
            <div className="mt-1 text-xs text-gray-600">
              Browse regions and subregions
            </div>
            <div className="mt-4 text-sm text-gray-900 group-hover:underline">
              Open →
            </div>
          </Link>
          <Link
            className="group rounded-xl border border-gray-200/60 bg-gray-50 p-5 shadow-sm hover:bg-white"
            href="/states"
          >
            <div className="text-sm font-medium">States</div>
            <div className="mt-1 text-xs text-gray-600">
              Filter by country_id
            </div>
            <div className="mt-4 text-sm text-gray-900 group-hover:underline">
              Open →
            </div>
          </Link>
          <Link
            className="group rounded-xl border border-gray-200/60 bg-gray-50 p-5 shadow-sm hover:bg-white"
            href="/cities"
          >
            <div className="text-sm font-medium">Cities</div>
            <div className="mt-1 text-xs text-gray-600">
              Filter by state_id / country_id
            </div>
            <div className="mt-4 text-sm text-gray-900 group-hover:underline">
              Open →
            </div>
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium">REST API</div>
            <div className="mt-1 text-xs text-gray-600">
              List endpoints support <span className="font-mono">page</span>,{" "}
              <span className="font-mono">limit</span>,{" "}
              <span className="font-mono">search</span>,{" "}
              <span className="font-mono">sort</span>,{" "}
              <span className="font-mono">order</span>.
            </div>
            <div className="mt-4 text-xs text-gray-700">
              Example:{" "}
              <span className="font-mono">
                /api/countries?search=dhaka&amp;limit=20
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200/60 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium">Swagger UI</div>
            <div className="mt-1 text-xs text-gray-600">
              Browse endpoints and try them in the browser.
            </div>
            <div className="mt-4">
              <Link className="text-sm underline" href="/api/docs">
                Open Swagger →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
