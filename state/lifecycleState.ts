import { AgentStateSlice } from "@tokenring-ai/agent/types";
import { z } from "zod";
import type { ParsedLifecycleServiceConfig } from "../schema.ts";

const serializationSchema = z
  .object({
    enabledHooks: z.array(z.string()).default([]),
  })
  .prefault({});

export class LifecycleState extends AgentStateSlice<typeof serializationSchema> {
  enabledHooks: Set<string>;

  constructor(readonly initialConfig: ParsedLifecycleServiceConfig["agentDefaults"]) {
    super("LifecycleState", serializationSchema);
    this.enabledHooks = new Set(initialConfig.enabledHooks);
  }

  reset(): void {
    this.enabledHooks = new Set(this.initialConfig.enabledHooks);
  }

  serialize(): z.output<typeof serializationSchema> {
    return {
      enabledHooks: [...this.enabledHooks],
    };
  }

  deserialize(data: z.output<typeof serializationSchema>): void {
    this.enabledHooks = new Set(data.enabledHooks);
  }

  show(): string {
    return `Enabled Hooks: ${this.enabledHooks.size > 0 ? [...this.enabledHooks].join(", ") : "None"}`;
  }
}
