import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import {LifecycleState} from "../../state/lifecycleState.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

async function execute({agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const hooks = agent.getState(LifecycleState).enabledHooks;
  return `Currently enabled hooks: ${hooks.join(", ") || "(none)"}`;
}

export default {
  name: "hooks get",
  description: "Show currently enabled hooks",
  inputSchema,
  execute,
  help: `Show the currently enabled hooks.

## Usage

/hooks get

## Example

/hooks get    # Prints the list of currently enabled hooks`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
