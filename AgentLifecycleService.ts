import type {Agent} from "@tokenring-ai/agent";
import type {TokenRingService} from "@tokenring-ai/app/types";
import deepMerge from "@tokenring-ai/utility/object/deepMerge";
import KeyedRegistry from "@tokenring-ai/utility/registry/KeyedRegistry";
import {LifecycleAgentConfigSchema, type ParsedLifecycleServiceConfig} from "./schema.ts";
import {LifecycleState} from "./state/lifecycleState.ts";
import type {Hook, HookSubscription} from "./types";

export default class AgentLifecycleService implements TokenRingService {
  readonly name = "AgentLifecycleService";
  description =
    "A service which dispatches hooks when certain agent lifecycle event happen.";

  private hooks = new KeyedRegistry<HookSubscription>();

  registerHook = this.hooks.set;
  getAllHookEntries = this.hooks.entriesArray;
  getAllHookNames = this.hooks.keysArray;

  constructor(readonly options: ParsedLifecycleServiceConfig) {
  }

  attach(agent: Agent): void {
    const {enabledHooks, ...config} = deepMerge(
      this.options.agentDefaults,
      agent.getAgentConfigSlice("lifecycle", LifecycleAgentConfigSchema),
    );

    // The enabled tools can include wildcards, so they need to be mapped to actual tool names with ensureItemNamesLike
    agent.initializeState(LifecycleState, {
      enabledHooks: this.hooks.requireKeysLike(enabledHooks),
      ...config,
    });
  }

  addHooks(hooks: Record<string, HookSubscription>) {
    for (const hookName in hooks) {
      this.hooks.set(hookName, hooks[hookName]);
    }
  }

  getEnabledHooks(agent: Agent): string[] {
    return agent.getState(LifecycleState).enabledHooks;
  }

  setEnabledHooks(hookNames: string[], agent: Agent): void {
    this.hooks.ensureItems(hookNames);

    agent.mutateState(LifecycleState, (state) => {
      state.enabledHooks = hookNames;
    });
  }

  enableHooks(hookNames: string[], agent: Agent): void {
    this.hooks.ensureItems(hookNames);

    agent.mutateState(LifecycleState, (state) => {
      for (const hook of hookNames) {
        if (!state.enabledHooks.includes(hook)) {
          state.enabledHooks.push(hook);
        }
      }
    });
  }

  disableHooks(hookNames: string[], agent: Agent): void {
    this.hooks.ensureItems(hookNames);
    agent.mutateState(LifecycleState, (state) => {
      state.enabledHooks = state.enabledHooks.filter(
        (hook) => !hookNames.includes(hook),
      );
    });
  }

  async executeHooks(data: Hook, agent: Agent): Promise<void> {
    for (const hookName of this.getEnabledHooks(agent)) {
      const subscription = this.hooks.get(hookName);
      if (subscription) {
        for (const callback of subscription.callbacks) {
          if (callback.hookConstructor === data.constructor) {
            await callback.callback(data, agent);
          }
        }
      }
    }
  }
}
