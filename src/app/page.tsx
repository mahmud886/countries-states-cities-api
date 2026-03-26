import { MapEmbed } from "@/components/MapEmbed";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { internalApiUrl } from "@/lib/server/internalApi";
import Link from "next/link";

async function fetchTotal(pathname: string) {
  const res = await fetch(await internalApiUrl(pathname, "page=1&limit=1"), {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { meta?: { total?: number } };
  return typeof json.meta?.total === "number" ? json.meta.total : null;
}

export default async function HomePage() {
  const [countries, states, cities, regions, subregions] = await Promise.all([
    fetchTotal("/api/countries"),
    fetchTotal("/api/states"),
    fetchTotal("/api/cities"),
    fetchTotal("/api/regions"),
    fetchTotal("/api/subregions"),
  ]);

  return (
    <main>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-[var(--text)]">
                Dashboard Overview
              </h1>
              <Badge>Location Manager</Badge>
              <Badge>Light/Dark</Badge>
              <Badge>Supabase</Badge>
            </div>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Explore countries, states, cities, regions, and subregions. Use
              built-in search, pagination, and map previews.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/countries" variant="primary">
              Open directory
            </ButtonLink>
            <ButtonLink href="/api/docs" variant="outline">
              Swagger
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Countries"
            value={countries ?? "—"}
            accent="primary"
          />
          <StatCard label="States" value={states ?? "—"} accent="secondary" />
          <StatCard label="Cities" value={cities ?? "—"} accent="tertiary" />
          <StatCard label="Regions" value={regions ?? "—"} accent="neutral" />
          <StatCard
            label="Subregions"
            value={subregions ?? "—"}
            accent="neutral"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MapEmbed
              title="Global map"
              lat={20}
              lng={0}
              zoom={2}
              heightClassName="h-[360px]"
            />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Card>
              <CardHeader
                title="Quick actions"
                description="Jump to key screens"
                right={
                  <Link
                    className="text-sm underline text-[var(--text)]"
                    href="/docs"
                  >
                    Docs →
                  </Link>
                }
              />
              <CardBody className="grid gap-2">
                <Link
                  className="rounded-xl border bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] shadow-sm hover:bg-[var(--surface-2)]"
                  href="/countries"
                >
                  Countries directory →
                </Link>
                <Link
                  className="rounded-xl border bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] shadow-sm hover:bg-[var(--surface-2)]"
                  href="/regions"
                >
                  Regions & subregions →
                </Link>
                <Link
                  className="rounded-xl border bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] shadow-sm hover:bg-[var(--surface-2)]"
                  href="/api/openapi"
                >
                  OpenAPI JSON →
                </Link>
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="API hints"
                description="Query options supported by list endpoints"
              />
              <CardBody>
                <div className="grid gap-2 text-sm text-[var(--text-muted)]">
                  <div>
                    <span className="font-mono text-[var(--text)]">page</span>,{" "}
                    <span className="font-mono text-[var(--text)]">limit</span>,{" "}
                    <span className="font-mono text-[var(--text)]">search</span>
                    , <span className="font-mono text-[var(--text)]">sort</span>
                    ,{" "}
                    <span className="font-mono text-[var(--text)]">order</span>
                  </div>
                  <div className="rounded-xl border bg-[var(--surface-2)] p-3 font-mono text-xs text-[var(--text)]">
                    /api/countries?search=bang&limit=20&sort=population&order=desc
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
