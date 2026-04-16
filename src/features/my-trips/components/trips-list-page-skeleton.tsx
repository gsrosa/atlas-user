export const TripsListPageSkeleton = () => {
  return (
    <div className="account-user-root relative flex min-h-[calc(100dvh-60px)] w-full min-w-0 flex-col overflow-hidden bg-surface text-neutral-100 md:min-h-screen">
      <div className="relative z-1 flex min-h-[calc(100dvh-60px)] w-full min-w-0 flex-1 flex-col md:min-h-screen">
        <div className="mx-auto w-full max-w-2xl space-y-8 px-4 py-10 sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="h-7 w-24 animate-pulse rounded-lg bg-neutral-700" />
            <div className="h-9 w-28 animate-pulse rounded-xl bg-neutral-700" />
          </div>

          {/* Trip cards */}
          <ul className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <li
                key={i}
                className="rounded-2xl border border-neutral-700 bg-neutral-800 p-5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="size-12 shrink-0 animate-pulse rounded-xl bg-neutral-700" />

                  {/* Info */}
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <div className="space-y-1.5">
                      <div
                        className="h-4 animate-pulse rounded bg-neutral-700"
                        style={{ width: `${55 + (i % 3) * 12}%`, animationDelay: `${i * 60}ms` }}
                      />
                      <div
                        className="h-3 w-24 animate-pulse rounded bg-neutral-700/70"
                        style={{ animationDelay: `${i * 60 + 30}ms` }}
                      />
                    </div>
                    {/* Stat bar */}
                    <div className="flex gap-3">
                      <div className="h-5 w-16 animate-pulse rounded-full bg-neutral-700/70" />
                      <div className="h-5 w-20 animate-pulse rounded-full bg-neutral-700/70" />
                      <div className="h-5 w-14 animate-pulse rounded-full bg-neutral-700/70" />
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="size-4 shrink-0 animate-pulse rounded bg-neutral-700" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
