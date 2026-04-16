import React from 'react';

import { Toaster } from 'sonner';

import { TravelerProfileFormPage } from '@/features/traveler-profile';
import { TripDetailPage, TripsListPage } from '@/features/my-trips';
import { AccountLayout } from '@/features/users';
import { TrpcProvider } from '@/providers/trpc-provider';

// ─── MFE root — exposed to the shell via Module Federation ────────────────────

type View =
  | { type: 'detail'; tripId: string }
  | { type: 'list' }
  | { type: 'account' }
  | { type: 'traveler-profile-form' }
  | { type: 'traveler-settings' };

const resolveView = (): View => {
  const path = window.location.pathname;
  if (/^\/profile\/onboarding\/?$/.test(path)) return { type: 'traveler-profile-form' };
  if (path === '/profile' || /^\/profile\/settings\/?$/.test(path)) return { type: 'traveler-settings' };
  if (/^\/my-trips\/?$/.test(path)) return { type: 'list' };
  const idMatch = /^\/my-trips\/([\w-]+)$/.exec(path);
  if (idMatch?.[1]) return { type: 'detail', tripId: idMatch[1] };
  return { type: 'account' };
};

export const App = () => {
  const [view, setView] = React.useState<View>(resolveView);

  React.useEffect(() => {
    const handleNavigation = () => setView(resolveView());

    // popstate fires on browser back/forward
    window.addEventListener('popstate', handleNavigation);

    // pushState/replaceState don't fire popstate — patch them so in-MFE
    // navigation (e.g. /my-trips → /my-trips/:id) updates the view
    const originalPush = history.pushState.bind(history);
    const originalReplace = history.replaceState.bind(history);

    history.pushState = (...args) => { originalPush(...args); handleNavigation(); };
    history.replaceState = (...args) => { originalReplace(...args); handleNavigation(); };

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      history.pushState = originalPush;
      history.replaceState = originalReplace;
    };
  }, []);

  return (
    <TrpcProvider>
      <div className="flex min-h-full w-full min-w-0 flex-col bg-transparent font-sans">
        <div className="flex min-h-0 flex-1 flex-col">
          {view.type === 'detail' && <TripDetailPage tripId={view.tripId} />}
          {view.type === 'list' && <TripsListPage />}
          {view.type === 'traveler-profile-form' && <TravelerProfileFormPage />}
          {view.type === 'traveler-settings' && <AccountLayout initialSection="preferences" />}
          {view.type === 'account' && <AccountLayout />}
        </div>
        <Toaster richColors position="top-center" theme="dark" />
      </div>
    </TrpcProvider>
  );
};
