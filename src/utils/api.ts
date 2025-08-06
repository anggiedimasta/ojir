// API Utils
// This file provides the tRPC API client

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '~/server/api/root';

export const api = createTRPCReact<AppRouter>();