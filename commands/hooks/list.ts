import type Agent from "@tokenring-ai/agent/Agent";
import type {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import markdownList from "@tokenring-ai/utility/string/markdownList";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

export default {
  name: "hooks list",
  description: "List all registered hooks",
  help: `# /hooks list

List all hooks currently registered with the agent lifecycle service.

## Usage

/hooks list

## Example

/hooks list   # Prints all registered hook names`,
  execute: async (_remainder: string, agent: Agent): Promise<string> => {
    const hookEntries = agent.requireServiceByType(AgentLifecycleService).getAllHookEntries();
    if (hookEntries.length === 0) return "No hooks are currently registered.";
    return `Registered hooks:\n${markdownList(hookEntries.map(([name]) => name))}`;
  },
} satisfies TokenRingAgentCommand;
