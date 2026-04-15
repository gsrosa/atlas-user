import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import type { ReactNode } from 'react';
import React from 'react';
import superjson from 'superjson';

import { getApiUrl } from '@/lib/env';
import { trpc } from '@/lib/trpc';

// Module-level singleton — survives App remounts caused by MFE host re-rendering.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — use cache, no refetch within window
      gcTime: 10 * 60 * 1000,   // 10 min — keep unused entries in memory
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type TrpcProviderProps = { children: ReactNode };

export function TrpcProvider({ children }: TrpcProviderProps) {
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getApiUrl()}/trpc`,
          transformer: superjson,
          fetch: (url, options) => fetch(url, { ...options, credentials: 'include' }),
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
