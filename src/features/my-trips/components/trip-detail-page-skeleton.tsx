const DayStepSkeleton = ({ index, isLast }: { index: number; isLast: boolean }) => (
  <div className="flex gap-4">
    {/* Timeline column */}
    <div className="flex flex-col items-center">
      <div
        className="flex size-8 shrink-0 animate-pulse items-center justify-center rounded-full bg-neutral-700"
        style={{ animationDelay: `${index * 80}ms` }}
      />
      {!isLast && <div className="mt-1 w-px flex-1 bg-neutral-700/60" />}
    </div>

    {/* Content */}
    <div className="min-w-0 flex-1 pb-8">
      <div className="flex items-baseline gap-2 pb-3">
        <div
          className="h-3.5 w-28 animate-pulse rounded bg-neutral-700"
          style={{ animationDelay: `${index * 80}ms` }}
        />
        <div
          className="h-3 w-20 animate-pulse rounded bg-neutral-700/60"
          style={{ animationDelay: `${index * 80 + 20}ms` }}
        />
      </div>
      <div className="space-y-2.5">
        {[0, 1, 2].map((j) => (
          <div key={j} className="flex items-start gap-2.5">
            <div
              className="mt-1.5 size-1.5 shrink-0 animate-pulse rounded-full bg-neutral-600"
              style={{ animationDelay: `${index * 80 + j * 25}ms` }}
            />
            <div className="flex-1 space-y-1">
              <div
                className="h-3.5 animate-pulse rounded bg-neutral-700"
                style={{
                  width: `${50 + ((index + j) % 4) * 10}%`,
                  animationDelay: `${index * 80 + j * 25}ms`,
                }}
              />
              <div
                className="h-3 w-24 animate-pulse rounded bg-neutral-700/60"
                style={{ animationDelay: `${index * 80 + j * 25 + 15}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const TripDetailPageSkeleton = () => {
  return (
    <div className="account-user-root relative flex min-h-[calc(100dvh-60px)] w-full min-w-0 flex-col overflow-hidden bg-surface text-neutral-100 md:min-h-screen">
      <div className="relative z-1 flex min-h-[calc(100dvh-60px)] w-full min-w-0 flex-1 flex-col md:min-h-screen">
        <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
          {/* Header row: back link + edit button */}
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="h-4 w-20 animate-pulse rounded bg-neutral-700" />
            <div className="h-8 w-24 animate-pulse rounded-xl bg-neutral-700" />
          </div>

          {/* Title block */}
          <div className="mb-6 space-y-2">
            <div className="h-7 w-56 animate-pulse rounded-lg bg-neutral-700" />
            <div className="h-4 w-32 animate-pulse rounded bg-neutral-700/70" />
          </div>

          {/* Stat bar */}
          <div className="mb-4 flex flex-wrap gap-2">
            {[40, 56, 48, 36].map((w, i) => (
              <div
                key={i}
                className="h-6 animate-pulse rounded-full bg-neutral-700"
                style={{ width: `${w * 4}px`, animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>

          {/* Date / departure row */}
          <div className="mb-8 flex gap-3">
            <div className="h-7 w-32 animate-pulse rounded-full border border-neutral-700 bg-neutral-800" />
            <div className="h-7 w-28 animate-pulse rounded-full border border-neutral-700 bg-neutral-800" />
          </div>

          {/* Day stepper */}
          <div>
            {[0, 1, 2, 3].map((i) => (
              <DayStepSkeleton key={i} index={i} isLast={i === 3} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
