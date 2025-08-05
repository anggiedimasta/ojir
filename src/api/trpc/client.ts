import { createTRPCReact } from '@trpc/react-query';
import { httpBatchStreamLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '~/server/api/root';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchStreamLink({
      url: '/api/trpc',
      transformer: superjson,
    }),
  ],
});