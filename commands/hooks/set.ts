import type Agent from "@tokenring-ai/agent/Agent";
import type {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

export default {
  name: "hooks set",
  description: "Set enabled hooks (replaces current selection)",
  help: `# /hooks set <hook1> [hook2...]

Set the enabled hooks, replacing the current selection entirely.

## Usage

/hooks set <hook1> [hook2...]

## Example

/hooks set preProcess onMessage   # Enable only preProcess and onMessage

## Notes

- Hook names are case-sensitive
- Replaces all currently enabled hooks with the specified list`,
  execute: async (remainder: string, agent: Agent): Promise<string> => {
    const hookNames = remainder?.trim().split(/\s+/);
    agent.requireServiceByType(AgentLifecycleService).setEnabledHooks(hookNames, agent);
    return `Selected hooks: ${hookNames.join(", ") || "(none)"}`;
  },
} satisfies TokenRingAgentCommand;
