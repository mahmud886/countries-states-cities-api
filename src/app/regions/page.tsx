import { MapEmbed } from "@/components/MapEmbed";
import { Pagination } from "@/components/Pagination";
import { SearchForm } from "@/components/SearchForm";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icons";
import { internalApiUrl } from "@/lib/server/internalApi";
import Link from "next/link";
import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as {
    success: boolean;
    data: Array<{ id: number; name: string; wikidata_id: string | null }>;
    meta: { page: number; limit: number; total: number };
  };
}

export default async function RegionsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const focus =
    typeof searchParams.focus === "string" ? searchParams.focus : undefined;
  const focusId =
    focus && /^\d+$/.test(focus) ? Number.parseInt(focus, 10) : null;

  const allMode = searchParams.all === "1";
  const hasPage =
    typeof searchParams.page === "string" && searchParams.page.length > 0;
  const hasLimit =
    typeof searchParams.limit === "string" && searchParams.limit.length > 0;

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string" && v.length) qs.set(k, v);
  }

  if (!allMode && !hasPage && !hasLimit) {
    const next = new URLSearchParams(qs.toString());
    next.set("page", "1");
    next.set("limit", "20");
    redirect(`/regions?${next.toString()}`);
  }

  const apiQs = new URLSearchParams(qs.toString());
  apiQs.delete("all");
  if (allMode) {
    apiQs.delete("page");
    apiQs.delete("limit");
  }

  const json = await fetchJson(
    await internalApiUrl("/api/regions", apiQs.toString()),
  );

  const focusedFromList = focusId
    ? (json.data.find((r) => r.id === focusId) ?? null)
    : null;

  const fetchRegion = async (id: number) => {
    const res = await fetch(await internalApiUrl(`/api/regions/${id}`), {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { data?: any };
    return j.data as {
      id: number;
      name: string;
      subregions: Array<{ id: number; name: string }>;
    };
  };

  const fetchCenter = async (id: number) => {
    const res = await fetch(
      await internalApiUrl(`/api/regions/${id}/countries`, "page=1&limit=50"),
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const j = (await res.json()) as {
      data?: Array<{ latitude: number | null; longitude: number | null }>;
    };
    const coords = (j.data ?? [])
      .map((c) => ({ lat: c.latitude, lng: c.longitude }))
      .filter(
        (p): p is { lat: number; lng: number } =>
          typeof p.lat === "number" && typeof p.lng === "number",
      );
    if (!coords.length) return null;
    return {
      lat: coords.reduce((sum, p) => sum + p.lat, 0) / coords.length,
      lng: coords.reduce((sum, p) => sum + p.lng, 0) / coords.length,
    };
  };

  const focused =
    focusedFromList ?? (focusId ? await fetchRegion(focusId) : null);
  const center = focusId ? await fetchCenter(focusId) : null;

  const toAllHref = () => {
    const next = new URLSearchParams(qs.toString());
    next.delete("page");
    next.delete("limit");
    next.set("all", "1");
    return `/regions?${next.toString()}`;
  };

  const toPaginateHref = (limit = 20) => {
    const next = new URLSearchParams(qs.toString());
    next.delete("all");
    next.set("page", "1");
    next.set("limit", String(limit));
    return `/regions?${next.toString()}`;
  };

  const focusHref = (id: number) => {
    const next = new URLSearchParams(qs.toString());
    next.set("focus", String(id));
    return `/regions?${next.toString()}`;
  };

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            Regions & Subregions
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {json.meta.total} total · Focus a region to preview
          </p>
        </div>
        <div className="w-full sm:max-w-md">
          <SearchForm placeholder="Search regions (e.g. Asia)" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader
              title="Regions"
              description={
                allMode
                  ? `All results · ${json.meta.total} total`
                  : `Page ${json.meta.page} · Limit ${json.meta.limit}`
              }
              right={
                <>
                  {allMode ? (
                    <ButtonLink
                      href={toPaginateHref(20)}
                      variant="outline"
                      size="sm"
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="list" className="h-4 w-4" />
                        Paginate
                      </span>
                    </ButtonLink>
                  ) : (
                    <ButtonLink href={toAllHref()} variant="outline" size="sm">
                      <span className="flex items-center gap-2">
                        <Icon name="sparkle" className="h-4 w-4" />
                        All
                      </span>
                    </ButtonLink>
                  )}
                  <ButtonLink
                    href={toPaginateHref(20)}
                    variant="ghost"
                    size="sm"
                  >
                    20
                  </ButtonLink>
                  <ButtonLink
                    href={toPaginateHref(50)}
                    variant="ghost"
                    size="sm"
                  >
                    50
                  </ButtonLink>
                  <ButtonLink
                    href={toPaginateHref(100)}
                    variant="ghost"
                    size="sm"
                  >
                    100
                  </ButtonLink>
                  <ButtonLink href="/countries" variant="outline" size="sm">
                    <span className="flex items-center gap-2">
                      <Icon name="countries" className="h-4 w-4" />
                      Countries
                      <Icon name="chevron-right" className="h-4 w-4" />
                    </span>
                  </ButtonLink>
                </>
              }
            />
            <div className="max-h-[calc(100vh-260px)] overflow-auto">
              <table className="w-full text-left text-[15px]">
                <thead className="bg-[var(--surface-2)] text-[var(--text-muted)]">
                  <tr>
                    <th className="px-5 py-4">Region</th>
                    <th className="px-5 py-4">Preview</th>
                    <th className="px-5 py-4 text-right">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {json.data.length ? (
                    json.data.map((r) => {
                      const active = focused?.id === r.id;
                      return (
                        <tr
                          key={r.id}
                          className={`border-t hover:bg-[var(--surface-2)] ${active ? "bg-[var(--surface-2)]" : ""}`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-between gap-4">
                              <Link
                                className="font-medium text-[var(--text)] hover:underline"
                                href={`/regions/${r.id}`}
                              >
                                {r.name}
                              </Link>
                              <Link
                                className="text-xs underline text-[var(--text)]"
                                href={focusHref(r.id)}
                              >
                                <span className="inline-flex items-center gap-1.5">
                                  <Icon name="focus" className="h-4 w-4" />
                                  Focus
                                </span>
                              </Link>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[var(--text-muted)]">
                            <Link
                              className="underline text-[var(--text)]"
                              href={`/regions/${r.id}`}
                            >
                              Open →
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-right font-mono text-xs text-[var(--text-muted)]">
                            {r.id}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="border-t">
                      <td
                        className="px-5 py-12 text-center text-sm text-[var(--text-muted)]"
                        colSpan={3}
                      >
                        No regions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {!allMode ? (
              <CardBody className="pt-3">
                <Pagination
                  page={json.meta.page}
                  limit={json.meta.limit}
                  total={json.meta.total}
                  pathname="/regions"
                  searchParams={searchParams}
                />
              </CardBody>
            ) : (
              <CardBody className="pt-3 text-sm text-[var(--text-muted)]">
                All mode can be slow on large datasets. Use the limit buttons to
                paginate.
              </CardBody>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          {focused && center ? (
            <MapEmbed
              title={`Preview: ${focused.name}`}
              lat={center.lat}
              lng={center.lng}
              zoom={3}
            />
          ) : (
            <Card>
              <CardHeader
                title="Map preview"
                description="Select a region using Focus"
              />
              <CardBody>
                <div className="text-sm text-[var(--text-muted)]">
                  Pick any region and click{" "}
                  <span className="font-semibold text-[var(--text)]">
                    Focus
                  </span>{" "}
                  to show a map preview here.
                </div>
              </CardBody>
            </Card>
          )}

          {focused ? (
            <Card>
              <CardHeader title="Subregions" description="Quick list" />
              <CardBody className="space-y-2 text-sm">
                {"subregions" in focused && focused.subregions?.length ? (
                  focused.subregions.slice(0, 12).map((s) => (
                    <Link
                      key={s.id}
                      className="block text-[var(--text)] underline"
                      href={`/subregions/${s.id}`}
                    >
                      {s.name}
                    </Link>
                  ))
                ) : (
                  <div className="text-[var(--text-muted)]">
                    Open the region details page to see subregions.
                  </div>
                )}
                <div className="pt-2">
                  <ButtonLink
                    href={`/regions/${focused.id}`}
                    variant="primary"
                    size="sm"
                  >
                    Open details →
                  </ButtonLink>
                </div>
              </CardBody>
            </Card>
          ) : null}
        </div>
      </div>
    </main>
  );
}
