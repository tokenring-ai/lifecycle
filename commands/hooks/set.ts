import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

const inputSchema = {
  args: {},
  positionals: [{
    name: "hookNames",
    description: "Space-separated hook names to set as enabled",
    required: true,
    greedy: true,
  }],
  allowAttachments: false,
} as const satisfies AgentCommandInputSchema;

async function execute({positionals, agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const hookNames = positionals.hookNames.split(/\s+/);
  agent.requireServiceByType(AgentLifecycleService).setEnabledHooks(hookNames, agent);
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
