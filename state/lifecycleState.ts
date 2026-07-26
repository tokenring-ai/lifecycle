import { AgentStateSlice } from "@tokenring-ai/agent/types";
import EnhancedSet from "@tokenring-ai/utility/set/enhancedSet";
import { z } from "zod";
import type { ParsedLifecycleServiceConfig } from "../schema.ts";

const serializationSchema = z
  .object({
    enabledHooks: z.array(z.string()).default([]),
  })
  .prefault({});

export class LifecycleState extends AgentStateSlice<typeof serializationSchema> {
  enabledHooks: EnhancedSet<string>;

  constructor(readonly initialConfig: ParsedLifecycleServiceConfig["agentDefaults"]) {
    super("LifecycleState", serializationSchema);
    this.enabledHooks = new EnhancedSet(initialConfig.enabledHooks);
  }

  reset(): void {
    this.enabledHooks = new EnhancedSet(this.initialConfig.enabledHooks);
  }

  serialize(): z.output<typeof serializationSchema> {
    return {
      enabledHooks: this.enabledHooks.valuesArray(),
    };
  }

  deserialize(data: z.output<typeof serializationSchema>): void {
    this.enabledHooks = new EnhancedSet(data.enabledHooks);
  }

  show(): string {
    return `Enabled Hooks: ${this.enabledHooks.joinWithDefault(",", "None")}`;
  }
}
