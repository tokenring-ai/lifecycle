import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import {LifecycleState} from "../../state/lifecycleState.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

async function execute({agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const hooks = agent.mutateState(LifecycleState, state => {
    return state.enabledHooks = state.initialConfig.enabledHooks;
  });
  return `Reset hooks to initial selections: ${hooks.join(", ") || "(none)"}`;
}

export default {
  name: "hooks reset",
  description: "Reset hooks to initial configuration",
  inputSchema,
  execute,
  help: `Reset the enabled hooks to the initial configuration defined at startup.

## Usage

/hooks reset

## Example

/hooks reset   # Restores the initial hook configuration`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
