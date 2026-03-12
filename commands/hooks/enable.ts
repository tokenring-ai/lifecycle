import type Agent from "@tokenring-ai/agent/Agent";
import type {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

export default {
  name: "hooks enable",
  description: "/hooks enable - Enable one or more hooks",
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
  execute: async (remainder: string, agent: Agent): Promise<string> => {
    const hookNames = remainder?.trim().split(/\s+/);
    agent.requireServiceByType(AgentLifecycleService).enableHooks(hookNames, agent);
    return `Enabled Hooks: ${hookNames.join(", ") || "(none)"}`;
  },
} satisfies TokenRingAgentCommand;
