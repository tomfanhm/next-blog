import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, a staleTime above 0 avoids refetching immediately on the
        // client after data was already fetched on the server.
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  // Server: always create a new client (no cross-request leaking)
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  // Browser: reuse the same client across renders
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
