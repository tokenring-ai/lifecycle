import type { ZodType } from "zod";
import type { HookCallback } from "./util/hooks.ts";

/**
 * Base interface for all hook event objects.
 * Hook classes carry their specific data as properties (e.g. request, response, filePath).
 * Optionally declare a `returnType` Zod schema if executeHooks should collect typed results.
 */
export interface Hook<ReturnTypeValidator extends ZodType = ZodType> {
  readonly type: "hook";
  readonly returnType?: ReturnTypeValidator;
}

export type HookSubscription = {
  name: string;
  displayName: string;
  description: string;
  callbacks: HookCallback<any>[];
};
