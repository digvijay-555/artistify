'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CampProvider } from '@campnetwork/origin/react';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Create a client instance - we use useState to ensure it's only created once per render
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider clientId={process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID || "fce77d7a-8085-47ca-adff-306a933e76aa"}>
        {children}
      </CampProvider>
    </QueryClientProvider>
  );
}
