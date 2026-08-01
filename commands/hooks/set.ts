import type { AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand } from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

const inputSchema = {
  args: {},
  remainder: {
    name: "hookNames",
    description: "Space-separated hook names to set as enabled",
    required: true,
  },
} as const satisfies AgentCommandInputSchema;

function execute({ remainder, agent }: AgentCommandInputType<typeof inputSchema>): string {
  const hookNames = remainder.split(/\s+/);
  agent.requireService(AgentLifecycleService).setEnabledHooks(hookNames, agent);
  return `Selected hooks: ${hookNames.join(", ") || "(none)"}`;
}

export default {
  name: "hooks set",
  description: "Set enabled hooks (replaces current selection)",
  inputSchema,
  execute,
  help: `Set the enabled hooks, replacing the current selection entirely.

## Example

/hooks set preProcess onMessage`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
