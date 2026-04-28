import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter, RouterInputs, RouterOutputs } from "./types";

export const trpc = createTRPCReact<AppRouter>();

export type { RouterInputs, RouterOutputs };
