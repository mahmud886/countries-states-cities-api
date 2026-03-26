import { Skeleton } from "@/components/ui/Skeleton";

export default function RegionDetailsLoading() {
  return (
    <main>
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-8 w-64 max-w-full rounded-md" />
          <div className="mt-3">
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, colIdx) => (
          <div
            key={colIdx}
            className="overflow-hidden rounded-xl border bg-[var(--surface)] shadow-sm"
          >
            <div className="border-b bg-[var(--surface-2)] px-4 py-3">
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <div className="divide-y">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="px-4 py-3">
                  <Skeleton className="h-4 w-64 max-w-full rounded-md" />
                  <div className="mt-2">
                    <Skeleton className="h-3 w-40 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
