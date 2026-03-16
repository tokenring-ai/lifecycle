import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

const inputSchema = {
  args: {},
  prompt: {
    description: "Space-separated hook names to set as enabled",
    required: true,
  },
  allowAttachments: false,
} as const satisfies AgentCommandInputSchema;

async function execute({prompt, agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const hookNames = prompt?.trim().split(/\s+/);
  agent.requireServiceByType(AgentLifecycleService).setEnabledHooks(hookNames, agent);
  return `Selected hooks: ${hookNames.join(", ") || "(none)"}`;
}

export default {
  name: "hooks set",
  description: "Set enabled hooks (replaces current selection)",
  inputSchema,
  execute,
  help: `# /hooks set <hook1> [hook2...]

Set the enabled hooks, replacing the current selection entirely.

## Usage

/hooks set <hook1> [hook2...]

## Example

/hooks set preProcess onMessage   # Enable only preProcess and onMessage

## Notes

- Hook names are case-sensitive
- Replaces all currently enabled hooks with the specified list`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
