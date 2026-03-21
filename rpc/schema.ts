import {RPCSchema} from "@tokenring-ai/rpc/types";
import {z} from "zod";

export default {
  name: "Lifecycle RPC",
  path: "/rpc/lifecycle",
  methods: {
    getAvailableHooks: {
      type: "query",
      input: z.object({}),
      result: z.object({
        hooks: z.record(z.string(), z.object({ 
          displayName: z.string(),
          description: z.string().optional()
        }))
      })
    },
    getEnabledHooks: {
      type: "query",
      input: z.object({
        agentId: z.string()
      }),
      result: z.object({
        hooks: z.array(z.string())
      })
    },
    setEnabledHooks: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
        hooks: z.array(z.string())
      }),
      result: z.object({
        hooks: z.array(z.string())
      })
    },
    enableHooks: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
        hooks: z.array(z.string())
      }),
      result: z.object({
        hooks: z.array(z.string())
      })
    },
    disableHooks: {
      type: "mutation",
      input: z.object({
        agentId: z.string(),
        hooks: z.array(z.string())
      }),
      result: z.object({
        hooks: z.array(z.string())
      })
    }
  }
} satisfies RPCSchema;
