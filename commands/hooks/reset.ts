import type Agent from "@tokenring-ai/agent/Agent";
import type {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import {LifecycleState} from "../../state/lifecycleState.ts";

export default {
  name: "hooks reset",
  description: "Reset hooks to initial configuration",
  help: `# /hooks reset

Reset the enabled hooks to the initial configuration defined at startup.

## Usage

/hooks reset

## Example

/hooks reset   # Restores the initial hook configuration`,
  execute: async (_remainder: string, agent: Agent): Promise<string> => {
    const hooks = agent.mutateState(LifecycleState, state => {
      return state.enabledHooks = state.initialConfig.enabledHooks;
    });
    return `Reset hooks to initial selections: ${hooks.join(", ") || "(none)"}`;
  },
} satisfies TokenRingAgentCommand;
