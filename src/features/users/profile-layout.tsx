import React from 'react';

import { cn } from '@gsrosa/atlas-ui';
import { CreditCardIcon, LockIcon, MenuIcon, SlidersHorizontalIcon, UserIcon } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';

import { TrpcProvider } from '@/providers/trpc-provider';

import { AccountShell } from '@/features/users/components/account-shell';

// ─── Sidebar items ────────────────────────────────────────────────────────────

const NAV_ITEM_DEFS = [
  { to: '/profile/about', key: 'nav.profile', icon: UserIcon },
  { to: '/profile/password', key: 'nav.password', icon: LockIcon },
  { to: '/profile/billing', key: 'nav.billing', icon: CreditCardIcon },
  { to: '/profile/preferences', key: 'nav.preferences', icon: SlidersHorizontalIcon },
] as const;

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex w-full items-center gap-3 rounded-[var(--atlas-radius-md)] px-3 py-2.5 text-left text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary-500/25 text-primary-400'
      : 'text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100',
  );

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function ProfileSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation('profile');
  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-3 py-5 md:h-full md:px-4 md:py-6">
      <p className="mb-3 px-2 text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">
        {t('nav.account')}
      </p>
      <nav className="flex flex-col gap-1" aria-label="Account sections">
        {NAV_ITEM_DEFS.map((item) => (
          <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={onNavigate}>
            <item.icon className="size-4 shrink-0" aria-hidden />
            {t(item.key)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

// ─── Mobile bar ───────────────────────────────────────────────────────────────

function ProfileMobileBar({ onOpenNav }: { onOpenNav: () => void }) {
  const { t } = useTranslation('profile');
  const { pathname } = useLocation();
  const current = NAV_ITEM_DEFS.find((item) => pathname.startsWith(item.to));

  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-neutral-700 bg-neutral-800 px-3 py-3 md:hidden">
      <button
        type="button"
        onClick={onOpenNav}
        className="flex size-10 shrink-0 items-center justify-center rounded-[var(--atlas-radius-md)] text-neutral-100 ring-1 ring-neutral-700 transition-colors hover:bg-neutral-700"
        aria-label={t('nav.openMenu')}
      >
        <MenuIcon className="size-5" aria-hidden />
      </button>
      <div className="min-w-0 flex-1 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">{t('nav.account')}</p>
        <p className="truncate text-sm font-semibold text-neutral-100">
          {current ? t(current.key) : t('nav.profile')}
        </p>
      </div>
      <div className="size-10 shrink-0" aria-hidden />
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

function ProfileLayoutInner() {
  const { t } = useTranslation('profile');
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <AccountShell>
      <div className="flex min-h-0 w-full flex-1 flex-col items-stretch px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8">
        <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-800 shadow-(--atlas-shadow-lg) md:min-h-[min(780px,calc(100dvh-7rem))]">
          <ProfileMobileBar onOpenNav={() => setNavOpen(true)} />

          <div className="relative flex min-h-0 flex-1 flex-col md:flex-row md:items-stretch">
            {navOpen && (
              <button
                type="button"
                className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] md:hidden"
                aria-label={t('nav.closeMenu')}
                onClick={() => setNavOpen(false)}
              />
            )}

            <div
              className={cn(
                'z-50 flex min-h-0 w-[min(88vw,280px)] shrink-0 flex-col border-neutral-700 bg-neutral-800 md:relative md:z-auto md:flex md:w-56 md:shrink-0 md:self-stretch md:border-r',
                navOpen
                  ? 'fixed inset-y-0 left-0 overflow-y-auto shadow-2xl md:static md:inset-auto md:h-auto md:overflow-visible md:shadow-none'
                  : 'hidden md:flex',
              )}
            >
              <ProfileSidebar onNavigate={() => setNavOpen(false)} />
            </div>

            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 text-neutral-100 sm:px-6 md:px-10 md:py-10">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

export default function ProfileLayout() {
  return (
    <TrpcProvider>
      <ProfileLayoutInner />
      <Toaster richColors position="top-center" theme="dark" />
    </TrpcProvider>
  );
}
