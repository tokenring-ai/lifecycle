import type Agent from "@tokenring-ai/agent/Agent";
import type {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";
import {LifecycleState} from "../../state/lifecycleState.ts";

export default {
  name: "hooks get",
  description: "/hooks get - Show currently enabled hooks",
  help: `# /hooks get

Show the currently enabled hooks.

## Usage

/hooks get

## Example

/hooks get    # Prints the list of currently enabled hooks`,
  execute: async (_remainder: string, agent: Agent): Promise<string> => {
    const hooks = agent.getState(LifecycleState).enabledHooks;
    return `Currently enabled hooks: ${hooks.join(", ") || "(none)"}`;
  },
} satisfies TokenRingAgentCommand;
