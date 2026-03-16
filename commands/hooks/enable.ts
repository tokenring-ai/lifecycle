import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

const inputSchema = {
  args: {},
  prompt: {
    description: "Space-separated hook names to enable",
    required: true,
  },
  allowAttachments: false,
} as const satisfies AgentCommandInputSchema;

async function execute({prompt, agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const hookNames = prompt?.trim().split(/\s+/);
  agent.requireServiceByType(AgentLifecycleService).enableHooks(hookNames, agent);
  return `Enabled Hooks: ${hookNames.join(", ") || "(none)"}`;
}

export default {
  name: "hooks enable",
  description: "Enable one or more hooks",
  inputSchema,
  execute,
  help: `# /hooks enable <hook1> [hook2...]

Add one or more hooks to the current enabled set.

## Usage

/hooks enable <hook1> [hook2...]

## Example

/hooks enable postProcess           # Enable the postProcess hook
/hooks enable preProcess onMessage  # Enable multiple hooks

## Notes

- Hook names are case-sensitive
- Adds to the current enabled set without replacing it`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
