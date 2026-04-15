export default function UserAppSkeleton() {
  return (
    <div className="relative flex min-h-[calc(100dvh-60px)] w-full flex-col overflow-hidden bg-surface md:min-h-screen">
      <div className="relative z-[1] flex min-h-[calc(100dvh-60px)] w-full flex-1 flex-col md:min-h-screen">
        <div className="flex min-h-0 w-full flex-1 flex-col items-stretch px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8">
          <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-muted shadow-[var(--atlas-shadow-lg)] md:min-h-[min(780px,calc(100dvh-7rem))]">
            {/* Mobile top bar */}
            <div className="flex shrink-0 items-center gap-3 border-b border-surface-border px-3 py-3 md:hidden">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-surface-border" />
              <div className="flex flex-1 flex-col items-center gap-1.5">
                <div className="h-2.5 w-16 animate-pulse rounded bg-surface-border" />
                <div className="h-3.5 w-24 animate-pulse rounded bg-surface-border" />
              </div>
              <div className="size-10 shrink-0" />
            </div>

            <div className="flex min-h-0 flex-1 flex-col md:flex-row md:items-stretch">
              {/* Sidebar (desktop only) */}
              <div className="hidden w-56 shrink-0 border-r border-surface-border bg-surface md:flex md:flex-col md:self-stretch">
                <div className="px-3 py-5 md:px-4 md:py-6">
                  <div className="mb-3 ml-2 h-2.5 w-14 animate-pulse rounded bg-surface-border" />
                  <nav className="flex flex-col gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                      >
                        <div
                          className="h-4 w-4 animate-pulse rounded bg-surface-border"
                          style={{ animationDelay: `${i * 50}ms` }}
                        />
                        <div
                          className="h-3.5 w-20 animate-pulse rounded bg-surface-border"
                          style={{ animationDelay: `${i * 50}ms` }}
                        />
                      </div>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main content area */}
              <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-10 md:py-10">
                <div className="space-y-6">
                  {/* Section title */}
                  <div className="h-6 w-32 animate-pulse rounded-lg bg-surface-border" />

                  {/* Form field rows */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div
                        className="h-3.5 w-24 animate-pulse rounded bg-surface-border"
                        style={{ animationDelay: `${i * 80}ms` }}
                      />
                      <div
                        className="h-10 w-full animate-pulse rounded-lg bg-surface-border"
                        style={{ animationDelay: `${i * 80}ms` }}
                      />
                    </div>
                  ))}

                  {/* Save button placeholder */}
                  <div className="h-10 w-28 animate-pulse rounded-lg bg-surface-border" />
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
