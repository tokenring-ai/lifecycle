import type { HookCallback } from "./util/hooks.ts";

export type Hook = {
  type: "hook";
};

export type HookSubscription = {
  name: string;
  displayName: string;
  description: string;
  callbacks: HookCallback<any>[];
};
