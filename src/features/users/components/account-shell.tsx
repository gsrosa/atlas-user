import { cn } from '@gsrosa/nexploring-ui';
import type { ReactNode } from 'react';

type AccountShellProps = {
  children: ReactNode;
};

export function AccountShell({ children }: AccountShellProps) {
  return (
    <div className="account-user-root relative flex min-h-[calc(100dvh-60px)] w-full min-w-0 flex-col overflow-hidden bg-surface text-neutral-100 md:min-h-screen">
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[min(52vh,480px)] bg-[radial-gradient(ellipse_92%_66%_at_50%_100%,rgba(255,255,255,0.04),transparent_58%)] opacity-80 motion-safe:animate-stitch-aurora-drift',
        )}
        aria-hidden
      />
      <div className="relative z-[1] flex min-h-[calc(100dvh-60px)] w-full min-w-0 flex-1 flex-col md:min-h-screen">
        {children}
      </div>
    </div>
  );
}
