# @tokenring-ai/lifecycle

Agent lifecycle management for TokenRing that provides a hook-based system for dispatching events during agent lifecycle
operations. This package enables extensible event-driven interactions with agent processing, allowing custom handlers to
be registered and executed at key points in the agent's request/response cycle.

## Overview

The `@tokenring-ai/lifecycle` package provides a comprehensive hook system for the Token Ring AI ecosystem. It serves as
an event dispatching service that enables agents to notify registered handlers about lifecycle events such as input
processing, success responses, error responses, and cancellations.

As a core service package, it integrates seamlessly with the Token Ring framework through its plugin system, offering:

- **Hook-based event system** for agent lifecycle events
- **State management** for enabled/disabled hooks per agent
- **Command interface** for CLI-based hook management
- **RPC endpoints** for remote hook configuration
- **Type-safe hook definitions** with TypeScript classes

## Key Features

- **Extensible Hook System**: Register custom hooks that execute at specific lifecycle points
- **Per-Agent Configuration**: Each agent maintains its own set of enabled hooks
- **Interactive Commands**: CLI commands for listing, enabling, disabling, and selecting hooks
- **RPC API**: Remote procedure call endpoints for programmatic hook management
- **State Persistence**: Hook configuration persists across agent sessions
- **Type Safety**: Full TypeScript support with Zod schema validation
- **Event-Driven Architecture**: Callback-based execution with async support

## Installation

```bash
bun add @tokenring-ai/lifecycle
```

### Package Dependencies

This package requires the following dependencies:

- `@tokenring-ai/agent` - Core agent system
- `@tokenring-ai/app` - Base application framework
- `@tokenring-ai/rpc` - RPC service for remote endpoints
- `@tokenring-ai/utility` - Shared utilities
- `zod` - Schema validation

## Core Components

### AgentLifecycleService

The main service class that manages hook registration and execution.

**Location**: `AgentLifecycleService.ts`

**Implements**: `TokenRingService`

**Key Methods**:

```typescript
class AgentLifecycleService implements TokenRingService {
  readonly name = "AgentLifecycleService";
  readonly description = "A service which dispatches hooks when certain agent lifecycle event happen.";

  // Hook registration
  registerHook: (name: string, hook: HookSubscription) => void
  getAllHookEntries: () => [string, HookSubscription][]
  getAllHookNames: () => string[]

  // Agent lifecycle
  attach(agent: Agent): void

  // Hook management
  addHooks(hooks: Record<string, HookSubscription>): void

  getEnabledHooks(agent: Agent): string[]

  setEnabledHooks(hookNames: string[], agent: Agent): void

  enableHooks(hookNames: string[], agent: Agent): void

  disableHooks(hookNames: string[], agent: Agent): void

  // Hook execution
  executeHooks(data: Hook, agent: Agent): Promise<void>
}
```

**Configuration**:

```typescript
interface ParsedLifecycleServiceConfig {
  agentDefaults: {
    enabledHooks: string[]  // Default enabled hooks for new agents
  }
}
```

### Hook Types

The package defines several hook event types for different lifecycle stages. All hook types implement the `Hook`
interface:

```typescript
interface Hook {
  type: "hook";
}
```

**Hook Subscription**:

```typescript
interface HookSubscription {
  name: string;
  displayName: string;
  description: string;
  callbacks: HookCallback<any>[];
}
```

**Predefined Hook Classes**:

- **`BeforeAgentInput`**: Triggered before processing an agent input

  ```typescript
  class BeforeAgentInput {
    readonly type = "hook";
    constructor(readonly request: ParsedInputReceived) {}
  }
  ```

- **`AfterAgentInputSuccess`**: Triggered after a successful agent response

  ```typescript
  class AfterAgentInputSuccess {
    readonly type = "hook";
    constructor(
      readonly request: ParsedInputReceived,
      readonly response: ParsedAgentSuccessResponse
    ) {}
  }
  ```

- **`AfterAgentInputError`**: Triggered when an agent encounters an error

  ```typescript
  class AfterAgentInputError {
    readonly type = "hook";
    constructor(
      readonly request: ParsedInputReceived,
      readonly response: ParsedAgentErrorResponse
    ) {}
  }
  ```

- **`AfterAgentInputCancelled`**: Triggered when an agent request is cancelled

  ```typescript
  class AfterAgentInputCancelled {
    readonly type = "hook";
    constructor(
      readonly request: ParsedInputReceived,
      readonly response: ParsedAgentCancelledResponse
    ) {}
  }
  ```

- **`AfterAgentInputHandled`**: Triggered after any agent response (success, error, or cancelled)

  ```typescript
  class AfterAgentInputHandled {
    readonly type = "hook";
    constructor(
      readonly request: ParsedInputReceived,
      readonly response: ParsedAgentResponse
    ) {}
  }
  ```

### HookCallback

Callback registration for hook execution:

```typescript
class HookCallback<T extends Hook> {
  constructor(
    readonly hookConstructor: abstract new (...args: any[]) => T,
    readonly callback: (data: T, agent: Agent) => MaybePromise<void>
  ) {}
}
```

## Usage Examples

### Plugin Registration

Register the lifecycle plugin in your TokenRing application:

```typescript
import { TokenRingApp } from "@tokenring-ai/app";
import lifecyclePlugin from "@tokenring-ai/lifecycle/plugin";

const app = new TokenRingApp();

// Install the plugin with configuration
await app.install(lifecyclePlugin, {
  lifecycle: {
    agentDefaults: {
      enabledHooks: []  // No hooks enabled by default
    }
  }
});
```

### Registering Hooks

Add hooks to the lifecycle service:

```typescript
import { AgentLifecycleService } from "@tokenring-ai/lifecycle";
import { BeforeAgentInput, AfterAgentInputSuccess, HookCallback } from "@tokenring-ai/lifecycle";

// Get the lifecycle service
const lifecycleService = app.getService(AgentLifecycleService);

// Register a new hook subscription
lifecycleService.registerHook("preProcess", {
  name: "preProcess",
  displayName: "Pre-Process Input",
  description: "Executed before agent input is processed",
  callbacks: [
    new HookCallback(
      BeforeAgentInput,
      async (data, agent) => {
        console.log(`Processing input: ${data.message}`);
        // Custom pre-processing logic
      }
    )
  ]
});

// Register post-processing hook
lifecycleService.registerHook("onMessage", {
  name: "onMessage",
  displayName: "On Message Success",
  description: "Executed after successful agent response",
  callbacks: [
    new HookCallback(
      AfterAgentInputSuccess,
      async (data, agent) => {
        console.log(`Response: ${data.response}`);
        // Custom post-processing logic
      }
    )
  ]
});
```

### Enabling/Disabling Hooks

Manage hooks for individual agents:

```typescript
// Enable hooks for an agent
lifecycleService.enableHooks(["preProcess", "onMessage"], agent);

// Disable specific hooks
lifecycleService.disableHooks(["preProcess"], agent);

// Set exact hook list (replaces current)
lifecycleService.setEnabledHooks(["onMessage"], agent);

// Get currently enabled hooks
const enabled = lifecycleService.getEnabledHooks(agent);
console.log(`Enabled: ${enabled.join(", ")}`);
```

### Executing Hooks

Trigger hook execution during agent processing:

```typescript
// Before processing input
await lifecycleService.executeHooks(new BeforeAgentInput(inputRequest), agent);

// After successful response
await lifecycleService.executeHooks(
  new AfterAgentInputSuccess(inputRequest, successResponse),
  agent
);

// After error
await lifecycleService.executeHooks(
  new AfterAgentInputError(inputRequest, errorResponse),
  agent
);
```

## Chat Commands

The package provides several agent commands for hook management:

| Command                     | Description                                    |
|-----------------------------|------------------------------------------------|
| `/hooks list`               | List all registered hooks                      |
| `/hooks get`                | Show currently enabled hooks                   |
| `/hooks set <hooks...>`     | Set enabled hooks (replaces current selection) |
| `/hooks enable <hooks...>`  | Add hooks to the enabled set                   |
| `/hooks disable <hooks...>` | Remove hooks from the enabled set              |
| `/hooks select`             | Interactive tree-based hook selection          |
| `/hooks reset`              | Reset enabled hooks to initial configuration   |

### `/hooks list`

List all registered hooks.

```bash
/hooks list
```

**Example Output**:

```text
Registered hooks:
- preProcess
- onMessage
- onError
```

### `/hooks get`

Show currently enabled hooks for the agent.

```bash
/hooks get
```

**Example Output**:

```text
Currently enabled hooks: preProcess, onMessage
```

### `/hooks set <hooks...>`

Set enabled hooks (replaces current selection).

```bash
/hooks set preProcess onMessage
```

### `/hooks enable <hooks...>`

Add hooks to the enabled set.

```bash
/hooks enable onError
```

### `/hooks disable <hooks...>`

Remove hooks from the enabled set.

```bash
/hooks disable preProcess
```

### `/hooks select`

Interactive tree-based hook selection (non-headless mode only).

```bash
/hooks select
```

Opens an interactive UI to select which hooks to enable.

### `/hooks reset`

Reset enabled hooks to initial configuration.

```bash
/hooks reset
```

## RPC Endpoints

The package provides RPC endpoints for remote hook management:

| Endpoint         | Method              | Request Params                         | Response Params                                                           |
|------------------|---------------------|----------------------------------------|---------------------------------------------------------------------------|
| `/rpc/lifecycle` | `getAvailableHooks` | `{}`                                   | `{ hooks: Record<string, { displayName: string, description: string }> }` |
| `/rpc/lifecycle` | `getEnabledHooks`   | `{ agentId: string }`                  | `{ status: "success", hooks: string[] }` or `{ status: "agentNotFound" }` |
| `/rpc/lifecycle` | `setEnabledHooks`   | `{ agentId: string, hooks: string[] }` | `{ status: "success", hooks: string[] }` or `{ status: "agentNotFound" }` |
| `/rpc/lifecycle` | `enableHooks`       | `{ agentId: string, hooks: string[] }` | `{ status: "success", hooks: string[] }` or `{ status: "agentNotFound" }` |
| `/rpc/lifecycle` | `disableHooks`      | `{ agentId: string, hooks: string[] }` | `{ status: "success", hooks: string[] }` or `{ status: "agentNotFound" }` |

### RPC Usage Example

```typescript
import { RPCClient } from "@tokenring-ai/rpc";

const rpc = new RPCClient("/rpc/lifecycle");

// Get available hooks
const available = await rpc.call("getAvailableHooks", {});
console.log("Available hooks:", available.hooks);

// Get enabled hooks for an agent
const enabled = await rpc.call("getEnabledHooks", { agentId: "agent-123" });
console.log("Enabled hooks:", enabled.hooks);

// Enable hooks
const result = await rpc.call("enableHooks", {
  agentId: "agent-123",
  hooks: ["preProcess", "onMessage"]
});
console.log("Updated hooks:", result.hooks);
```

## Configuration

### Service Configuration

```typescript
import { LifecycleServiceConfigSchema } from "@tokenring-ai/lifecycle/schema";

const config = {
  lifecycle: {
    agentDefaults: {
      enabledHooks: []  // Default enabled hooks for new agents
    }
  }
};
```

### Agent Configuration Slice

Each agent maintains its own lifecycle configuration:

```typescript
import { LifecycleAgentConfigSchema } from "@tokenring-ai/lifecycle/schema";

// Agent-specific configuration
const agentConfig = {
  enabledHooks: ["preProcess", "onMessage"]  // Agent-specific enabled hooks
};
```

## State Management

The package uses `LifecycleState` for per-agent state persistence:

```typescript
class LifecycleState extends AgentStateSlice {
  enabledHooks: string[] = [];

  constructor(readonly initialConfig: ParsedLifecycleServiceConfig["agentDefaults"])

  // State methods
  reset(): void

  serialize(): { enabledHooks: string[] }

  deserialize(data: { enabledHooks: string[] }): void

  show(): string
}
```

**Persistence**: Hook configuration is automatically persisted to SQLite and restored when agents are reloaded.

**Checkpointing**: State checkpoints include hook configuration for recovery scenarios.

## Integration

### With Agent System

The lifecycle service integrates with the agent system through:

1. **Service Registration**: Registered as a `TokenRingService`
2. **Agent Attachment**: Hooks are attached during agent initialization
3. **State Management**: Uses `LifecycleState` for persistence
4. **Command Registration**: Commands registered with `AgentCommandService`

### With RPC System

The lifecycle RPC endpoint is registered with the `RpcService`:

```typescript
app.waitForService(RpcService, (rpcService) => {
  rpcService.registerEndpoint(lifecycleRPC);
});
```

## Best Practices

1. **Register Hooks Early**: Register all hooks during plugin initialization before agent creation
2. **Use Descriptive Names**: Give hooks clear, descriptive names and descriptions
3. **Handle Async Properly**: Hook callbacks can be async; await them appropriately
4. **Check Hook Type**: Use `hookConstructor` to ensure callbacks receive the correct hook type
5. **Enable Selectively**: Only enable hooks that are needed for specific agent tasks
6. **Test Hook Execution**: Verify hooks execute at the expected lifecycle points
7. **Monitor Performance**: Be aware that hooks add overhead to agent processing

## Testing and Development

### Running Tests

```bash
cd pkg/lifecycle
bun test
bun test:watch
bun test:coverage
```

### Development Setup

1. Install dependencies: `bun install`
2. Run type check: `bun run build`
3. Run tests: `bun test`

### Package Structure

```text
pkg/lifecycle/
├── AgentLifecycleService.ts    # Main service class
├── index.ts                    # Package exports
├── plugin.ts                   # Plugin definition
├── schema.ts                   # Configuration schemas
├── types.ts                    # Type definitions
├── commands.ts                 # Command registry
├── rpc/
│   ├── schema.ts               # RPC schema definition
│   └── lifecycle.ts            # RPC endpoint implementation
├── state/
│   └── lifecycleState.ts       # Agent state slice
├── util/
│   └── hooks.ts                # Hook utilities and classes
└── commands/
    └── hooks/
        ├── list.ts             # /hooks list command
        ├── select.ts           # /hooks select command
        ├── get.ts              # /hooks get command
        ├── set.ts              # /hooks set command
        ├── enable.ts           # /hooks enable command
        ├── disable.ts          # /hooks disable command
        └── reset.ts            # /hooks reset command
```

## npm Dependencies

- `@tokenring-ai/agent` (0.2.0) - Core agent system
- `@tokenring-ai/app` (0.2.0) - Base application framework
- `@tokenring-ai/rpc` (0.2.0) - RPC service
- `@tokenring-ai/utility` (0.2.0) - Shared utilities
- `zod` (^4.3.6) - Schema validation

## Related Components

- **@tokenring-ai/agent** - Core agent system that uses lifecycle hooks
- **@tokenring-ai/app** - Base application framework
- **@tokenring-ai/rpc** - RPC service for remote endpoints

## License

MIT License - see LICENSE file for details.
