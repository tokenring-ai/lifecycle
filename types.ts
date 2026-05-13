import type { ZodType, ZodVoid } from "zod";
import type { HookCallback } from "./util/hooks.ts";

export type Hook<T extends ZodType = ZodVoid> = {
  type: "hook";
  returnType?: T;
  // The return type T is now part of the Hook definition
};

export type HookSubscription<T extends Hook = Hook> = {
  name: string;
  displayName: string;
  description: string;
  callbacks: HookCallback<T>[];
};
