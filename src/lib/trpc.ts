import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter, RouterInputs, RouterOutputs } from 'nexploring-bff/trpc';

export const trpc = createTRPCReact<AppRouter>();
export type { RouterInputs, RouterOutputs };
