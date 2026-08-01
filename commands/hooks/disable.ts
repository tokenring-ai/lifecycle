import type { AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand } from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

const inputSchema = {
  args: {},
  remainder: {
    name: "hookNames",
    description: "Space-separated hook names to disable",
    required: true,
  },
} as const satisfies AgentCommandInputSchema;

function execute({ remainder, agent }: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const hookNames = remainder.split(/\s+/);
  agent.requireService(AgentLifecycleService).disableHooks(hookNames, agent);
  return Promise.resolve(`Disabled Hooks: ${hookNames.join(", ") || "(none)"}`);
}

export default {
  name: "hooks disable",
  description: "Disable one or more hooks",
  inputSchema,
  execute,
  help: `Remove one or more hooks from the current enabled set.

## Example

/hooks disable postProcess
/hooks disable preProcess onMessage`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
