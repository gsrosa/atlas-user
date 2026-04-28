import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import type { ReactNode } from "react";
import superjson from "superjson";

import { getApiUrl } from "@/lib/env";
import { trpc } from "@/trpc/client";

const defaultApi = "http://127.0.0.1:4000";

const trpcUrl = (): string => {
  const base = (getApiUrl() ?? defaultApi).replace(/\/$/, "");
  return `${base}/trpc`;
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

type TrpcProviderProps = { children: ReactNode };

export function TrpcProvider({ children }: TrpcProviderProps) {
  const queryClient = getQueryClient();
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: trpcUrl(),
          transformer: superjson,
          fetch: (url, options) =>
            fetch(url, { ...options, credentials: "include" }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}
