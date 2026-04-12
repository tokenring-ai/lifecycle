import type {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import markdownList from "@tokenring-ai/utility/string/markdownList";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

function execute({
                   agent,
                 }: AgentCommandInputType<typeof inputSchema>): string {
  const hookEntries = agent
    .requireServiceByType(AgentLifecycleService)
    .getAllHookEntries();
  if (hookEntries.length === 0) return "No hooks are currently registered.";
  return `Registered hooks:\n${markdownList(hookEntries.map(([name]) => name))}`;
}

export default {
  name: "hooks list",
  description: "List all registered hooks",
  inputSchema,
  execute,
  help: `List all hooks currently registered with the agent lifecycle service.

## Usage

/hooks list

## Example

/hooks list   # Prints all registered hook names`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
