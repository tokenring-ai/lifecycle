import type { Agent } from "@tokenring-ai/agent";
import type { TokenRingService } from "@tokenring-ai/app/types";
import deepClone from "@tokenring-ai/utility/object/deepClone";
import KeyedRegistry from "@tokenring-ai/utility/registry/KeyedRegistry";
import type { ZodType, z } from "zod";
import { LifecycleAgentConfigSchema, type ParsedLifecycleServiceConfig } from "./schema.ts";
import { LifecycleState } from "./state/lifecycleState.ts";
import type { Hook, HookSubscription } from "./types";

export default class AgentLifecycleService implements TokenRingService {
  readonly name = "AgentLifecycleService";
  description = "A service which dispatches hooks when certain agent lifecycle event happen.";

  private hooks = new KeyedRegistry<HookSubscription<any>>();

  registerHook = this.hooks.set;
  getAllHookEntries = this.hooks.entriesArray;
  getAllHookNames = this.hooks.keysArray;

  constructor(readonly options: ParsedLifecycleServiceConfig) {}

  attach(agent: Agent): void {
    const { enabledHooks, ...config } = deepClone(this.options.agentDefaults, agent.getAgentConfigSlice("lifecycle", LifecycleAgentConfigSchema));

    // The enabled tools can include wildcards, so they need to be mapped to actual tool names with ensureItemNamesLike
    agent.initializeState(LifecycleState, {
      enabledHooks: this.hooks.requireKeysLike(enabledHooks),
      ...config,
    });
  }

  addHooks(...hooks: HookSubscription<any>[]) {
    for (const hook of hooks) {
      this.hooks.set(hook.name, hook);
    }
  }

  getEnabledHooks(agent: Agent): Set<string> {
    return agent.getState(LifecycleState).enabledHooks;
  }

  setEnabledHooks(hookNames: string[], agent: Agent): void {
    this.hooks.ensureItems(hookNames);

    agent.mutateState(LifecycleState, state => {
      state.enabledHooks = new Set(hookNames);
    });
  }

  enableHooks(hookNames: string[], agent: Agent): void {
    this.hooks.ensureItems(hookNames);

    agent.mutateState(LifecycleState, state => {
      for (const hook of hookNames) {
        if (!state.enabledHooks.has(hook)) {
          state.enabledHooks.add(hook);
        }
      }
    });
  }

  disableHooks(hookNames: string[], agent: Agent): void {
    this.hooks.ensureItems(hookNames);
    agent.mutateState(LifecycleState, state => {
      for (const hook of hookNames) {
        state.enabledHooks.delete(hook);
      }
    });
  }

  async executeHooks<T extends ZodType>(data: Hook<T>, agent: Agent): Promise<z.infer<T>[]> {
    const results: z.infer<T>[] = [];

    for (const hookName of this.getEnabledHooks(agent)) {
      const subscription = this.hooks.get(hookName);
      if (subscription) {
        for (const callback of subscription.callbacks) {
          if (callback.hookConstructor === data.constructor) {
            const result = await callback.callback(data, agent);
            results.push(result as any);
          }
        }
      }
    }

    return results;
  }
}
