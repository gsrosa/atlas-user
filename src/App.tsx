import { Toaster } from 'sonner';

import { TravelerOnboardingPage } from '@/features/traveler-profile';
import { AccountLayout, TripDetailPage, TripsListPage } from '@/features/users';
import { TrpcProvider } from '@/providers/trpc-provider';

// ─── MFE root — exposed to the shell via Module Federation ────────────────────

type View =
  | { type: 'detail'; tripId: string }
  | { type: 'list' }
  | { type: 'account' }
  | { type: 'traveler-onboarding' }
  | { type: 'traveler-settings' };

function resolveView(): View {
  const path = window.location.pathname;
  if (/^\/profile\/onboarding\/?$/.test(path)) return { type: 'traveler-onboarding' };
  if (path === '/profile' || /^\/profile\/settings\/?$/.test(path)) return { type: 'traveler-settings' };
  if (/^\/my-trips\/?$/.test(path)) return { type: 'list' };
  const idMatch = /^\/my-trips\/([\w-]+)$/.exec(path);
  if (idMatch?.[1]) return { type: 'detail', tripId: idMatch[1] };
  return { type: 'account' };
}

export function App() {
  const view = resolveView();

  return (
    <TrpcProvider>
      <div className="flex min-h-full w-full min-w-0 flex-col bg-transparent font-sans">
        <div className="flex min-h-0 flex-1 flex-col">
          {view.type === 'detail' && <TripDetailPage tripId={view.tripId} />}
          {view.type === 'list' && <TripsListPage />}
          {view.type === 'traveler-onboarding' && <TravelerOnboardingPage />}
          {view.type === 'traveler-settings' && <AccountLayout initialSection="preferences" />}
          {view.type === 'account' && <AccountLayout />}
        </div>
        <Toaster richColors position="top-center" theme="dark" />
      </div>
    </TrpcProvider>
  );
}
