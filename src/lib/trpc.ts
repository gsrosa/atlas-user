import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter, RouterInputs, RouterOutputs } from 'atlas-bff/trpc';

export const trpc = createTRPCReact<AppRouter>();
export type { RouterInputs, RouterOutputs };
