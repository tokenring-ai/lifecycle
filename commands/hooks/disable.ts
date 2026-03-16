import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

const inputSchema = {
  args: {},
  prompt: {
    description: "Space-separated hook names to disable",
    required: true,
  },
  allowAttachments: false,
} as const satisfies AgentCommandInputSchema;

async function execute({prompt, agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const hookNames = prompt?.trim().split(/\s+/);
  agent.requireServiceByType(AgentLifecycleService).disableHooks(hookNames, agent);
  return `Disabled Hooks: ${hookNames.join(", ") || "(none)"}`;
}

export default {
  name: "hooks disable",
  description: "Disable one or more hooks",
  inputSchema,
  execute,
  help: `# /hooks disable <hook1> [hook2...]

Remove one or more hooks from the current enabled set.

## Usage

/hooks disable <hook1> [hook2...]

## Example

/hooks disable postProcess            # Disable the postProcess hook
/hooks disable preProcess onMessage   # Disable multiple hooks

## Notes

- Hook names are case-sensitive
- Removes from the current enabled set without affecting other hooks`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
