import { Button, TripStatBar } from '@gsrosa/atlas-ui'
import { ChevronRightIcon, MapPinIcon, PlusIcon } from 'lucide-react'

import { trpc } from '@/lib/trpc'

import { AccountShell } from '@/features/users'

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const parsePlanStats = (itinerary: Record<string, unknown>) => {
  const days = Array.isArray(itinerary.days)
    ? (itinerary.days as Array<Record<string, unknown>>)
    : []

  const cities = [
    ...new Set(
      days
        .map((d) => (typeof d.city === 'string' ? d.city : null))
        .filter((c): c is string => c !== null),
    ),
  ]

  const totalCostUsd = days.reduce((total, day) => {
    const attractions = Array.isArray(day.attractions)
      ? (day.attractions as Array<{ price?: { amount: number } }>)
      : []
    return (
      total +
      attractions.reduce((sum, a) => sum + (a.price?.amount ?? 0), 0)
    )
  }, 0)

  const weather = itinerary.weather as
    | { temperatureRangeCelsius?: string }
    | undefined

  return {
    cities,
    totalCostUsd,
    tempRange: weather?.temperatureRangeCelsius ?? null,
  }
}

export const TripsListPage = () => {
  const { data, isLoading, error } = trpc.plans.list.useQuery({ limit: 50 })
  const plans = data?.plans

  return (
    <AccountShell>
      <div className="animate-account-fade-in-up mx-auto w-full max-w-2xl space-y-8 px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-100">
            My plans
          </h1>
          <Button
            size="sm"
            onClick={() => window.location.assign('/assistant')}
          >
            <PlusIcon aria-hidden />
            New plan
          </Button>
        </div>

        {/* Loading */}
        {isLoading && (
          <ul className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-neutral-700"
              />
            ))}
          </ul>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500">
            Failed to load plans. Please try again.
          </p>
        )}

        {/* Empty */}
        {!isLoading && !error && plans?.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-neutral-700">
              <MapPinIcon
                className="size-8 text-neutral-400 opacity-40"
                strokeWidth={1.25}
                aria-hidden
              />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-neutral-100">No plans yet</p>
              <p className="text-sm text-neutral-400">
                Generate your first AI-powered trip itinerary
              </p>
            </div>
            <Button onClick={() => window.location.assign('/assistant')}>
              Plan a trip
            </Button>
          </div>
        )}

        {/* Plan list */}
        {!isLoading && !error && plans && plans.length > 0 && (
          <ul className="space-y-3">
            {plans.map((plan) => {
              const itinerary = plan.itinerary as Record<string, unknown>
              const { cities, totalCostUsd, tempRange } = parsePlanStats(itinerary)
              const displayName =
                plan.title ??
                plan.ai_suggested_title ??
                plan.destination ??
                'Untitled trip'
              const subtitle =
                plan.title && plan.destination ? plan.destination : null
              const departureLabel = formatDate(plan.departure_at)

              return (
                <li key={plan.id}>
                  <Button
                    variant="secondary"
                    onClick={() => window.location.assign(`/my-trips/${plan.id}`)}
                    className="group h-auto w-full cursor-pointer rounded-2xl border border-neutral-700 bg-neutral-800 p-5 text-left hover:bg-neutral-700"
                  >
                    <div className="flex w-full items-center gap-4">
                      {/* Icon */}
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500 shadow-(--atlas-shadow-sm)">
                        <MapPinIcon className="size-5 text-white" strokeWidth={1.75} aria-hidden />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div>
                          <p className="truncate font-semibold text-neutral-100">
                            {displayName}
                          </p>
                          {subtitle && (
                            <p className="truncate text-xs text-neutral-400">
                              {subtitle}
                            </p>
                          )}
                          {departureLabel && (
                            <p className="text-xs text-neutral-400">
                              {departureLabel}
                            </p>
                          )}
                        </div>
                        <TripStatBar
                          daysCount={plan.days_count}
                          cities={cities}
                          totalCostUsd={totalCostUsd}
                          tempRange={tempRange}
                        />
                      </div>

                      <ChevronRightIcon
                        className="size-4 shrink-0 text-neutral-400 transition-colors group-hover:text-primary-400"
                        aria-hidden
                      />
                    </div>
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </AccountShell>
  )
}
