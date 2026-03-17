import type {TreeLeaf} from "@tokenring-ai/agent/question";
import {AgentCommandInputSchema, AgentCommandInputType, TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import AgentLifecycleService from "../../AgentLifecycleService.ts";

const inputSchema = {} as const satisfies AgentCommandInputSchema;

async function execute({agent}: AgentCommandInputType<typeof inputSchema>): Promise<string> {
  const agentLifecycleService = agent.requireServiceByType(AgentLifecycleService);
  const hookNames = agentLifecycleService.getAllHookNames();

  if (hookNames.length === 0) return "No hooks are currently registered.";

  const hookTree: TreeLeaf[] = [{
    name: `Registered Hooks (${hookNames.length})`,
    children: hookNames.sort().map(name => ({ value: name, name })),
  }];

  const selection = await agent.askQuestion({
    message: "Select a hook:",
    question: { type: "treeSelect", label: "Hook Selection", key: "result", tree: hookTree },
  });

  if (selection) {
    agentLifecycleService.setEnabledHooks(selection, agent);
    return `Selected hook: ${selection.join(", ") || "(none)"}`;
  }
  return "Hook selection cancelled.";
}

export default {
  name: "hooks select",
  description: "Interactive hook selection",
  inputSchema,
  execute,
  help: `Open an interactive tree-based selector to choose which hooks to enable.

## Usage

/hooks select

## Example

/hooks select   # Opens the interactive hook selection UI

## Notes

- Only available in interactive (non-headless) mode
- Selection replaces the current enabled hooks`,
} satisfies TokenRingAgentCommand<typeof inputSchema>;
