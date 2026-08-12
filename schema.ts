import type { ConfigFieldMeta } from "@tokenring-ai/app/config/metadata";
import z from "zod";

export const LifecycleAgentConfigSchema = z
  .object({
    enabledHooks: z.array(z.string()).exactOptional(),
  })
  .default({});

export const LifecycleServiceConfigSchema = z
  .object({
    globalHooks: z
      .array(z.string())
      .default([])
      .meta({ label: "Global Hooks", description: "Lifecycle hooks to apply to all agents" } satisfies ConfigFieldMeta),
    agentDefaults: z
      .object({
        enabledHooks: z
          .array(z.string())
          .default([])
          .meta({ description: "Lifecycle hook names enabled by default for agents that do not specify any" } satisfies ConfigFieldMeta),
      })
      .prefault({})
      .meta({ label: "Agent Defaults" } satisfies ConfigFieldMeta),
  })
  .prefault({})
  .meta({ label: "Lifecycle", description: "Agent lifecycle hook configuration" } satisfies ConfigFieldMeta);

export type ParsedLifecycleServiceConfig = z.output<typeof LifecycleServiceConfigSchema>;
export type ParsedLifecycleAgentConfig = z.output<typeof LifecycleAgentConfigSchema>;
