import { TripDetailPageSkeleton } from '@/features/my-trips/components/trip-detail-page-skeleton'
import { TripsListPageSkeleton } from '@/features/my-trips/components/trips-list-page-skeleton'
import { TravelerProfileFormPageSkeleton } from '@/features/traveler-profile/components/traveler-profile-form-page-skeleton'
import { TravelerProfileSettingsPageSkeleton } from '@/features/traveler-profile/components/traveler-profile-settings-page-skeleton'

const resolveRoute = (p: string) => {
  if (/^\/profile\/onboarding\/?$/.test(p)) return 'onboarding'
  if (/^\/my-trips\/([\w-]+)$/.test(p)) return 'trip-detail'
  if (/^\/my-trips\/?$/.test(p)) return 'trips-list'
  if (p === '/profile' || /^\/profile\/settings\/?$/.test(p)) return 'profile'
  return 'profile'
}

export default function UserAppSkeleton() {
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const route = resolveRoute(path)

  if (route === 'onboarding') return <TravelerProfileFormPageSkeleton />
  if (route === 'trip-detail') return <TripDetailPageSkeleton />
  if (route === 'trips-list') return <TripsListPageSkeleton />
  return <TravelerProfileSettingsPageSkeleton />
}
