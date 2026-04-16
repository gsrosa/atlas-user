import { cn } from '@gsrosa/atlas-ui';
import { CreditCardIcon, LockIcon, MenuIcon, SlidersHorizontalIcon, UserIcon } from 'lucide-react';

import type { AccountSectionId } from '@/features/users/account-section';

const items: { id: AccountSectionId; title: string; icon: typeof UserIcon }[] = [
  { id: 'profile', title: 'Profile', icon: UserIcon },
  { id: 'password', title: 'Password', icon: LockIcon },
  { id: 'payments', title: 'Payments', icon: CreditCardIcon },
  { id: 'preferences', title: 'Preferences', icon: SlidersHorizontalIcon },
];

type AccountSidebarProps = {
  activeSection: AccountSectionId;
  onSelectSection: (id: AccountSectionId) => void;
  onNavigate?: () => void;
};

export function AccountSidebar({ activeSection, onSelectSection, onNavigate }: AccountSidebarProps) {
  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-3 py-5 md:h-full md:px-4 md:py-6">
      <p className="mb-3 px-2 text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">
        Account
      </p>
      <nav className="flex flex-col gap-1" aria-label="Account sections">
        {items.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectSection(item.id);
                onNavigate?.();
              }}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-[var(--atlas-radius-md)] px-3 py-2.5 text-left text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-500/25 text-primary-400'
                  : 'text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100',
              )}
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {item.title}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

type AccountMobileBarProps = {
  sectionTitle: string;
  onOpenNav: () => void;
};

export function AccountMobileBar({ sectionTitle, onOpenNav }: AccountMobileBarProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-neutral-700 bg-neutral-800 px-3 py-3 md:hidden">
      <button
        type="button"
        onClick={onOpenNav}
        className="flex size-10 shrink-0 items-center justify-center rounded-[var(--atlas-radius-md)] text-neutral-100 ring-1 ring-neutral-700 transition-colors hover:bg-neutral-700"
        aria-label="Open account menu"
      >
        <MenuIcon className="size-5" aria-hidden />
      </button>
      <div className="min-w-0 flex-1 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          Account
        </p>
        <p className="truncate text-sm font-semibold text-neutral-100">
          {sectionTitle}
        </p>
      </div>
      <div className="size-10 shrink-0" aria-hidden />
    </div>
  );
}
