import AgentManager from "@tokenring-ai/agent/services/AgentManager";
import type TokenRingApp from "@tokenring-ai/app";
import {createRPCEndpoint} from "@tokenring-ai/rpc/createRPCEndpoint";
import AgentLifecycleService from "../AgentLifecycleService.ts";
import LifecycleRpcSchema from "./schema.ts";

export default createRPCEndpoint(LifecycleRpcSchema, {
  getAvailableHooks(_args, app: TokenRingApp) {
    const lifecycleService = app.requireService(AgentLifecycleService);
    const hooks = lifecycleService.getAllHookEntries();
    return {
      hooks: Object.fromEntries(
        hooks.map(([hookName, hook]) => [
          hookName,
          {
            displayName: hook.displayName || hookName,
            description: hook.description,
          },
        ]),
      ),
    };
  },

  getEnabledHooks(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) {
      return {status: 'agentNotFound'};
    }
    const lifecycleService = app.requireService(AgentLifecycleService);
    return {
      status: 'success',
      hooks: lifecycleService.getEnabledHooks(agent),
    };
  },

  setEnabledHooks(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) {
      return {status: 'agentNotFound'};
    }
    const lifecycleService = app.requireService(AgentLifecycleService);
    lifecycleService.setEnabledHooks(args.hooks, agent);
    return {status: 'success', hooks: lifecycleService.getEnabledHooks(agent)};
  },

  enableHooks(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) {
      return {status: 'agentNotFound'};
    }
    const lifecycleService = app.requireService(AgentLifecycleService);
    lifecycleService.enableHooks(args.hooks, agent);
    return {status: 'success', hooks: lifecycleService.getEnabledHooks(agent)};
  },

  disableHooks(args, app: TokenRingApp) {
    const agent = app.requireService(AgentManager).getAgent(args.agentId);
    if (!agent) {
      return {status: 'agentNotFound'};
    }
    const lifecycleService = app.requireService(AgentLifecycleService);
    lifecycleService.disableHooks(args.hooks, agent);
    return {status: 'success', hooks: lifecycleService.getEnabledHooks(agent)};
  },
});
