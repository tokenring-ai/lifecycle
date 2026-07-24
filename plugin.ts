import { AgentCommandService } from "@tokenring-ai/agent";
import type { TokenRingPlugin } from "@tokenring-ai/app";
import { RpcService } from "@tokenring-ai/rpc";
import { z } from "zod";
import AgentLifecycleService from "./AgentLifecycleService.ts";
import agentCommands from "./commands.ts";
import packageJSON from "./package.json" with { type: "json" };
import lifecycleRPC from "./rpc/lifecycle.ts";
import { LifecycleServiceConfigSchema } from "./schema.ts";

const packageConfigSchema = z.object({
  lifecycle: LifecycleServiceConfigSchema,
});

export default {
  name: packageJSON.name,
  displayName: "Lifecycle Management",
  version: packageJSON.version,
  description: packageJSON.description,
  install(app, config) {
    app.addServices(new AgentLifecycleService(config.lifecycle));
    app.waitForService(AgentCommandService, agentCommandService => {
      agentCommandService.addAgentCommands([...agentCommands]);
    });

    app.waitForService(RpcService, (rpcService: RpcService) => {
      rpcService.registerEndpoint(lifecycleRPC);
    });
  },
  configSchema: packageConfigSchema,
} satisfies TokenRingPlugin<typeof packageConfigSchema>;
