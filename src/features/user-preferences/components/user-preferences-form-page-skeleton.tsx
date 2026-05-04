export const UserPreferencesFormPageSkeleton = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-neutral-900 text-neutral-100">
      <header className="sticky top-0 z-50 border-b border-neutral-800/20 bg-neutral-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <div className="h-4 w-14 animate-pulse rounded bg-neutral-700" />
          <div className="h-3 w-28 animate-pulse rounded bg-neutral-700" />
          <div className="h-3 w-16 animate-pulse rounded bg-neutral-700" />
        </div>
        <div className="h-0.5 bg-neutral-700">
          <div className="h-full w-1/3 animate-pulse bg-primary-500/60" />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 pb-16 pt-12">
        <div className="w-full max-w-2xl">
          <div className="mb-10 flex flex-col items-center space-y-3 text-center">
            <div className="size-14 animate-pulse rounded-2xl bg-neutral-700" />
            <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-700 sm:w-64" />
            <div className="h-4 w-full max-w-sm animate-pulse rounded bg-neutral-700/70" />
          </div>

          <div className="space-y-8">
            {[0, 1].map((i) => (
              <div key={i} className="space-y-3" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="h-3.5 w-32 animate-pulse rounded bg-neutral-700" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-neutral-800" />
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <div className="h-11 w-36 animate-pulse rounded-xl bg-neutral-700" />
          </div>
        </div>
      </main>
    </div>
  )
}
