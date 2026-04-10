import z from "zod";

export const LifecycleAgentConfigSchema = z
  .object({
    enabledHooks: z.array(z.string()).optional(),
  })
  .default({});

export const LifecycleServiceConfigSchema = z
  .object({
    agentDefaults: z
      .object({
        enabledHooks: z.array(z.string()).default([]),
      })
      .prefault({}),
  })
  .prefault({});

export type ParsedLifecycleServiceConfig = z.output<
  typeof LifecycleServiceConfigSchema
>;
export type ParsedLifecycleAgentConfig = z.output<
  typeof LifecycleAgentConfigSchema
>;
