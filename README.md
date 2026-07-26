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
- **RPC endpoints** for remote hook configuration, including streaming support
- **Type-safe hook definitions** with TypeScript classes and optional return types
- **Wildcard support** for enabling hooks by pattern

## Key Features

- **Extensible Hook System**: Register custom hooks that execute at specific lifecycle points
- **Per-Agent Configuration**: Each agent maintains its own set of enabled hooks
- **Typed Hook Returns**: Hooks can optionally define a `returnType` Zod schema for collecting typed results
- **Interactive Commands**: CLI commands for listing, enabling, disabling, and selecting hooks
- **RPC API**: Remote procedure call endpoints for programmatic hook management, including streaming
- **State Persistence**: Hook configuration persists across agent sessions
- **Type Safety**: Full TypeScript support with Zod schema validation
- **Event-Driven Architecture**: Callback-based execution with async support
- **Wildcard Hook Selection**: Enable hooks using glob-style patterns

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

## Chat Commands

| Command                     | Description                                      |
|-----------------------------|--------------------------------------------------|
| `/hooks list`               | List all registered hooks                        |
| `/hooks get`                | Show currently enabled hooks                     |
| `/hooks set <hooks...>`     | Set enabled hooks (replaces current selection)   |
| `/hooks enable <hooks...>`  | Enable one or more hooks                         |
| `/hooks disable <hooks...>` | Disable one or more hooks                        |
| `/hooks select`             | Interactive hook selection                       |
| `/hooks reset`              | Reset hooks to initial configuration             |

### `/hooks list`

List all hooks currently registered with the agent lifecycle service.

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

When no hooks are registered:

```text
No hooks are currently registered.
```

### `/hooks get`

Show the currently enabled hooks.

```bash
/hooks get
```

**Example Output**:

```text
Currently enabled hooks: preProcess, onMessage
```

When no hooks are enabled:

```text
Currently enabled hooks: (none)
```

### `/hooks set <hooks...>`

Set the enabled hooks, replacing the current selection entirely.

```bash
/hooks set preProcess onMessage
```

**Example Output**:

```text
Selected hooks: preProcess, onMessage
```

### `/hooks enable <hooks...>`

Add one or more hooks to the current enabled set.

```bash
/hooks enable postProcess
/hooks enable preProcess onMessage
```

**Example Output**:

```text
Enabled Hooks: postProcess
```

### `/hooks disable <hooks...>`

Remove one or more hooks from the current enabled set.

```bash
/hooks disable postProcess
/hooks disable preProcess onMessage
```

**Example Output**:

```text
Disabled Hooks: postProcess
```

### `/hooks select`

Open an interactive tree-based selector to choose which hooks to enable.

```bash
/hooks select
```

**Notes**:

- Only available in interactive (non-headless) mode
- Selection replaces the current enabled hooks

**Example Output**:

```text
Selected hook: preProcess, onMessage
```

When cancelled:

```text
Hook selection cancelled.
```

### `/hooks reset`

Reset the enabled hooks to the initial configuration defined at startup.

```bash
/hooks reset
```

**Example Output**:

```text
Reset hooks to initial selections: preProcess, onMessage
```

## RPC Endpoints

The package provides RPC endpoints for remote hook management:

| Endpoint         | Method              | Type     | Request Params                     | Response Params                                                                         |
|------------------|---------------------|----------|------------------------------------|-----------------------------------------------------------------------------------------|
| `/rpc/lifecycle` | `getAvailableHooks` | query    | `{}`                               | `{ hooks: Record<string, { displayName: string, description?: string }> }`               |
| `/rpc/lifecycle` | `getEnabledHooks`   | query    | `{ agentId: string }`              | `{ status: "success", hooks: string[] }` or `{ status: "agentNotFound" }`                |
| `/rpc/lifecycle` | `streamEnabledHooks`| stream   | `{ agentId: string }`              | `{ status: "success", hooks: string[] }` or `{ status: "agentNotFound" }`                |
| `/rpc/lifecycle` | `setEnabledHooks`   | mutation | `{ agentId: string, hooks: string[] }` | `{ status: "success", hooks: string[] }` or `{ status: "agentNotFound" }`             |
| `/rpc/lifecycle` | `enableHooks`       | mutation | `{ agentId: string, hooks: string[] }` | `{ status: "success", hooks: string[] }` or `{ status: "agentNotFound" }`             |
| `/rpc/lifecycle` | `disableHooks`      | mutation | `{ agentId: string, hooks: string[] }` | `{ status: "success", hooks: string[] }` or `{ status: "agentNotFound" }`             |

### RPC Usage Example

```typescript
import { createRPCClient } from "@tokenring-ai/rpc";
import LifecycleRpcSchema from "@tokenring-ai/lifecycle/rpc/schema";

const client = createRPCClient(LifecycleRpcSchema, rpcTransport);

// Get available hooks
const available = await client.getAvailableHooks({});
console.log("Available hooks:", available.hooks);

// Get enabled hooks for an agent
const enabled = await client.getEnabledHooks({ agentId: "agent-123" });
if (enabled.status === "success") {
  console.log("Enabled hooks:", enabled.hooks);
}

// Stream enabled hooks for an agent (real-time updates)
const stream = await client.streamEnabledHooks({ agentId: "agent-123" });

// Enable hooks
const result = await client.enableHooks({
  agentId: "agent-123",
  hooks: ["preProcess", "onMessage"]
});
if (result.status === "success") {
  console.log("Updated hooks:", result.hooks);
}
```

## Configuration

### Service Configuration

```yaml
lifecycle:
  agentDefaults:
    enabledHooks: []  # Default enabled hooks for new agents
```

### Agent Configuration Slice

Each agent maintains its own lifecycle configuration:

```yaml
enabledHooks:
  - preProcess
  - onMessage
```

## Core Components

### AgentLifecycleService

The main service class that manages hook registration and execution.

**Location**: `plugin/lifecycle/AgentLifecycleService.ts`

**Implements**: `TokenRingService`

**Key Methods**:

```typescript
class AgentLifecycleService implements TokenRingService {
  readonly name = "AgentLifecycleService";
  description = "A service which dispatches hooks when certain agent lifecycle event happen.";

  constructor(readonly options: ParsedLifecycleServiceConfig) {}

  // Hook registration
  registerHook: (name: string, hook: HookSubscription) => void
  getAllHookEntries: () => [string, HookSubscription][]
  getAllHookNames: () => string[]
  addHooks: (...hooks: HookSubscription[]) => void

  // Agent lifecycle
  attach(agent: Agent): void

  // Hook management
  getEnabledHooks(agent: Agent): Set<string>
  setEnabledHooks(hookNames: string[], agent: Agent): void
  enableHooks(hookNames: string[], agent: Agent): void
  disableHooks(hookNames: string[], agent: Agent): void

  // Hook execution (collects typed results)
  executeHooks<T extends ZodType>(data: Hook<T>, agent: Agent): Promise<z.infer<T>[]>
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
interface Hook<ReturnTypeValidator extends ZodType = ZodType> {
  readonly type: "hook";
  readonly returnType?: ReturnTypeValidator;
}
```

The optional `returnType` property allows hooks to define a Zod schema for collecting typed results from callbacks.

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
  class BeforeAgentInput implements Hook {
    readonly type = "hook";
    constructor(readonly request: ParsedInputReceived) {}
  }
  ```

- **`AfterAgentInputSuccess`**: Triggered after a successful agent response

  ```typescript
  class AfterAgentInputSuccess implements Hook {
    readonly type = "hook";
    constructor(
      readonly request: ParsedInputReceived,
      readonly response: ParsedAgentSuccessResponse
    ) {}
  }
  ```

- **`AfterAgentInputError`**: Triggered when an agent encounters an error

  ```typescript
  class AfterAgentInputError implements Hook {
    readonly type = "hook";
    constructor(
      readonly request: ParsedInputReceived,
      readonly response: ParsedAgentErrorResponse
    ) {}
  }
  ```

- **`AfterAgentInputCancelled`**: Triggered when an agent request is cancelled

  ```typescript
  class AfterAgentInputCancelled implements Hook {
    readonly type = "hook";
    constructor(
      readonly request: ParsedInputReceived,
      readonly response: ParsedAgentCancelledResponse
    ) {}
  }
  ```

- **`AfterAgentInputHandled`**: Triggered after any agent response (success, error, or cancelled)

  ```typescript
  class AfterAgentInputHandled implements Hook {
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
class HookCallback<H extends Hook> {
  constructor(
    readonly hookConstructor: abstract new (...args: any[]) => H,
    readonly callback: (data: H, agent: Agent) => MaybePromise<unknown>
  ) {}
}
```

The callback may return a value. When the hook defines a `returnType` Zod schema, these return values are collected
by `executeHooks` and returned as a typed array.

## State Management

The package uses `LifecycleState` for per-agent state persistence:

```typescript
class LifecycleState extends AgentStateSlice<typeof serializationSchema> {
  enabledHooks: Set<string>;

  constructor(readonly initialConfig: ParsedLifecycleServiceConfig["agentDefaults"])

  // State methods
  reset(): void
  serialize(): { enabledHooks: string[] }
  deserialize(data: { enabledHooks: string[] }): void
  show(): string
}
```

**Persistence**: Hook configuration is automatically persisted and restored when agents are reloaded.

**Serialization**: State is serialized using a Zod schema that converts the `Set<string>` to an array for storage.

**Display**: The `show()` method returns a human-readable summary of enabled hooks.

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
import { BeforeAgentInput, AfterAgentInputSuccess, HookCallback } from "@tokenring-ai/lifecycle/util/hooks";

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

// Or use addHooks to register multiple at once
lifecycleService.addHooks(
  { name: "hook1", displayName: "Hook 1", description: "...", callbacks: [] },
  { name: "hook2", displayName: "Hook 2", description: "...", callbacks: [] }
);
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

// Get currently enabled hooks (returns a Set)
const enabled = lifecycleService.getEnabledHooks(agent);
console.log(`Enabled: ${[...enabled].join(", ")}`);
```

### Executing Hooks

Trigger hook execution during agent processing. Results are collected when hooks define a `returnType`:

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

## Integration

### With Agent System

The lifecycle service integrates with the agent system through:

1. **Service Registration**: Registered as a `TokenRingService`
2. **Agent Attachment**: Hooks are attached during agent initialization via `attach()`
3. **State Management**: Uses `LifecycleState` for persistence
4. **Command Registration**: Commands registered with `AgentCommandService`
5. **Wildcard Support**: The `attach()` method resolves wildcard patterns in `enabledHooks` to actual hook names

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
8. **Use Return Types**: Define `returnType` on hooks when you need to collect callback results

## Testing and Development

### Running Tests

The lifecycle plugin currently does not include test files. The test infrastructure is configured via `bun.config.ts`.

### Development Setup

1. Install dependencies: `bun install`
2. Run type check: `bun run build`
3. Run tests: `bun test`

### Package Structure

```text
plugin/lifecycle/
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

- `@tokenring-ai/agent` (workspace:*) - Core agent system
- `@tokenring-ai/app` (workspace:*) - Base application framework
- `@tokenring-ai/rpc` (workspace:*) - RPC service
- `@tokenring-ai/utility` (workspace:*) - Shared utilities
- `zod` (^4.4.3) - Schema validation

## Related Components

- **@tokenring-ai/agent** - Core agent system that uses lifecycle hooks
- **@tokenring-ai/app** - Base application framework
- **@tokenring-ai/rpc** - RPC service for remote endpoints

## License

MIT License - see LICENSE file for details.
