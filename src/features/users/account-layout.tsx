import React from 'react';

import { cn } from '@gsrosa/atlas-ui';

import { ACCOUNT_SECTION_LABELS, type AccountSectionId } from '@/features/users/account-section';
import { AccountMobileBar, AccountSidebar } from '@/features/users/components/account-sidebar';
import { AccountShell } from '@/features/users/components/account-shell';
import { PasswordPage } from '@/features/users/components/password-page';
import { PaymentsPage } from '@/features/users/components/payments-page';
import { PreferencesPage } from '@/features/users/components/preferences-page';
import { ProfilePage } from '@/features/users/components/profile-page';

function AccountSectionContent({ section }: { section: AccountSectionId }) {
  switch (section) {
    case 'profile':
      return <ProfilePage />;
    case 'password':
      return <PasswordPage />;
    case 'payments':
      return <PaymentsPage />;
    case 'preferences':
      return <PreferencesPage />;
    default:
      return null;
  }
}

type AccountLayoutProps = {
  /** When opening `/profile/settings` from shell, start on travel preferences. */
  initialSection?: AccountSectionId;
};

export function AccountLayout({ initialSection = 'profile' }: AccountLayoutProps) {
  const [navOpen, setNavOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<AccountSectionId>(initialSection);

  return (
    <AccountShell>
      <div className="flex min-h-0 w-full flex-1 flex-col items-stretch px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8">
        <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-muted shadow-[var(--atlas-shadow-lg)] md:min-h-[min(780px,calc(100dvh-7rem))]">
          <AccountMobileBar
            sectionTitle={ACCOUNT_SECTION_LABELS[activeSection]}
            onOpenNav={() => setNavOpen(true)}
          />

          <div className="relative flex min-h-0 flex-1 flex-col md:flex-row md:items-stretch">
            {navOpen ? (
              <button
                type="button"
                className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] md:hidden"
                aria-label="Close menu"
                onClick={() => setNavOpen(false)}
              />
            ) : null}

            <div
              className={cn(
                'z-50 flex min-h-0 w-[min(88vw,280px)] shrink-0 flex-col border-surface-border bg-surface md:relative md:z-auto md:flex md:w-56 md:shrink-0 md:self-stretch md:border-r',
                navOpen
                  ? 'fixed inset-y-0 left-0 overflow-y-auto shadow-2xl md:static md:inset-auto md:h-auto md:overflow-visible md:shadow-none'
                  : 'hidden md:flex',
              )}
            >
              <AccountSidebar
                activeSection={activeSection}
                onSelectSection={setActiveSection}
                onNavigate={() => setNavOpen(false)}
              />
            </div>

            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 text-neutral-100 sm:px-6 md:px-10 md:py-10">
              <AccountSectionContent section={activeSection} />
            </main>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
