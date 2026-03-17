import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

const inputSchema = {
  args: {},
  positionals: [{
    name: "hookNames",
    description: "Space-separated hook names to enable",
    required: true,
    greedy: true,
  }],
  allowAttachments: false,
} as const satisfies AgentCommandInputSchema;

async function execute({positionals, agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const hookNames = positionals.hookNames.split(/\s+/);
  agent.requireServiceByType(AgentLifecycleService).enableHooks(hookNames, agent);
  return `Enabled Hooks: ${hookNames.join(", ") || "(none)"}`;
}

export default {
  name: "hooks enable",
  description: "Enable one or more hooks",
  inputSchema,
  execute,
  help: `Add one or more hooks to the current enabled set.

## Example

/hooks enable postProcess
/hooks enable preProcess onMessage`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
