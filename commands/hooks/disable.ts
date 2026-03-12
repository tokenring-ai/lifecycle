import type Agent from "@tokenring-ai/agent/Agent";
import type {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

export default {
  name: "hooks disable",
  description: "/hooks disable - Disable one or more hooks",
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
  execute: async (remainder: string, agent: Agent): Promise<string> => {
    const hookNames = remainder?.trim().split(/\s+/);
    agent.requireServiceByType(AgentLifecycleService).disableHooks(hookNames, agent);
    return `Disabled Hooks: ${hookNames.join(", ") || "(none)"}`;
  },
} satisfies TokenRingAgentCommand;
