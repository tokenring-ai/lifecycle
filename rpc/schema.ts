import { AgentNotFoundSchema } from "@tokenring-ai/rpc/types";
import { SuccessSchema } from "@tokenring-ai/rpc/types";
import type { RPCSchema } from "@tokenring-ai/rpc/types";
import { z } from "zod";

export default {
  name: "Lifecycle RPC",
  path: "/rpc/lifecycle",
  methods: {
    getAvailableHooks: {
      type: "query",
      input: z.object({}),
      result: z.object({
        hooks: z.record(
          z.string(),
          z.object({
            displayName: z.string(),
            description: z.string().exactOptional(),
          }),
        ),
      }),
    },
    getEnabledHooks: {
      type: "query",
      input: z.object({
        agentId: z.string(),
      }),
      result: z.discriminatedUnion("status", [
        SuccessSchema.extend({
          hooks: z.array(z.string()),
        }),
        AgentNotFoundSchema,
      ]),
    },
    streamEnabledHooks: {
      type: "stream",
      input: z.object({
        agentId: z.string(),
      }),
      result: z.discriminatedUnion("status", [
        SuccessSchema.extend({
          hooks: z.array(z.string()),
        }),
        AgentNotFoundSchema,
      ]),
    },
    setEnabledHooks: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
        hooks: z.array(z.string()),
      }),
      result: z.discriminatedUnion("status", [
        SuccessSchema.extend({
          hooks: z.array(z.string()),
        }),
        AgentNotFoundSchema,
      ]),
    },
    enableHooks: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
        hooks: z.array(z.string()),
      }),
      result: z.discriminatedUnion("status", [
        SuccessSchema.extend({
          hooks: z.array(z.string()),
        }),
        AgentNotFoundSchema,
      ]),
    },
    disableHooks: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
        hooks: z.array(z.string()),
      }),
      result: z.discriminatedUnion("status", [
        SuccessSchema.extend({
          hooks: z.array(z.string()),
        }),
        AgentNotFoundSchema,
      ]),
    },
  },
} satisfies RPCSchema;
