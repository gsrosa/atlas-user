const NAV_ITEMS = ['Profile', 'Password', 'Payments', 'Preferences']

const SECTION_ROWS = [4, 3, 4]

export const TravelerProfileSettingsPageSkeleton = () => {
  return (
    <div className="account-user-root relative flex min-h-[calc(100dvh-60px)] w-full min-w-0 flex-col overflow-hidden bg-surface text-neutral-100 md:min-h-screen">
      <div className="relative z-1 flex min-h-[calc(100dvh-60px)] w-full min-w-0 flex-1 flex-col md:min-h-screen">
        <div className="flex min-h-0 w-full flex-1 flex-col items-stretch px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8">
          <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-800 shadow-(--atlas-shadow-lg) md:min-h-[min(780px,calc(100dvh-7rem))]">
            {/* Mobile top bar */}
            <div className="flex shrink-0 items-center gap-3 border-b border-neutral-700 bg-neutral-800 px-3 py-3 md:hidden">
              <div className="size-10 shrink-0 animate-pulse rounded-lg bg-neutral-700" />
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <div className="h-2.5 w-14 animate-pulse rounded bg-neutral-700" />
                <div className="h-3.5 w-24 animate-pulse rounded bg-neutral-700" />
              </div>
              <div className="size-10 shrink-0" />
            </div>

            <div className="flex min-h-0 flex-1 flex-col md:flex-row md:items-stretch">
              {/* Sidebar (desktop only) */}
              <div className="hidden w-56 shrink-0 border-r border-neutral-700 bg-neutral-800 md:flex md:flex-col md:self-stretch">
                <div className="px-3 py-5 md:px-4 md:py-6">
                  <div className="mb-3 ml-2 h-2.5 w-14 animate-pulse rounded bg-neutral-700" />
                  <nav className="flex flex-col gap-1">
                    {NAV_ITEMS.map((_, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                        <div
                          className="size-4 animate-pulse rounded bg-neutral-700"
                          style={{ animationDelay: `${i * 40}ms` }}
                        />
                        <div
                          className="h-3.5 w-20 animate-pulse rounded bg-neutral-700"
                          style={{ animationDelay: `${i * 40}ms` }}
                        />
                      </div>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main content */}
              <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-10 md:py-10">
                <div className="space-y-6">
                  {/* Page header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="h-6 w-40 animate-pulse rounded-lg bg-neutral-700" />
                      <div className="h-3.5 w-64 animate-pulse rounded bg-neutral-700/70" />
                    </div>
                    <div className="h-8 w-16 animate-pulse rounded-lg bg-neutral-700" />
                  </div>

                  {/* Preference sections */}
                  <div className="space-y-4">
                    {SECTION_ROWS.map((rowCount, si) => (
                      <div
                        key={si}
                        className="rounded-2xl border border-neutral-700 bg-neutral-800 px-5 py-4 sm:px-6"
                        style={{ animationDelay: `${si * 60}ms` }}
                      >
                        {/* Section label */}
                        <div
                          className="mb-3 h-2.5 w-20 animate-pulse rounded bg-neutral-700"
                          style={{ animationDelay: `${si * 60}ms` }}
                        />
                        {/* 2-col grid of label + value */}
                        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                          {Array.from({ length: rowCount }).map((_, ri) => (
                            <div key={ri} className="flex items-center justify-between gap-3">
                              <div
                                className="h-3 w-20 animate-pulse rounded bg-neutral-700/70"
                                style={{ animationDelay: `${si * 60 + ri * 30}ms` }}
                              />
                              <div
                                className="h-6 w-20 animate-pulse rounded-full bg-neutral-700"
                                style={{ animationDelay: `${si * 60 + ri * 30 + 15}ms` }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
