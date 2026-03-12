import {AgentCommandService} from "@tokenring-ai/agent";
import {TokenRingPlugin} from "@tokenring-ai/app";
import {z} from "zod";
import AgentLifecycleService from "./AgentLifecycleService.ts";
import agentCommands from "./commands.ts";
import packageJSON from "./package.json" with {type: "json"};
import {LifecycleServiceConfigSchema} from "./schema.ts";

const packageConfigSchema = z.object({
  lifecycle: LifecycleServiceConfigSchema
})


export default {
  name: packageJSON.name,
  version: packageJSON.version,
  description: packageJSON.description,
  install(app, config) {
    app.addServices(new AgentLifecycleService(config.lifecycle));
    app.waitForService(AgentCommandService, agentCommandService => {
      agentCommandService.addAgentCommands(agentCommands);
    })
  },
  config: packageConfigSchema
} satisfies TokenRingPlugin<typeof packageConfigSchema>;
