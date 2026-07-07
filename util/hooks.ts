import type { Agent } from "@tokenring-ai/agent";
import type {
  ParsedAgentCancelledResponse,
  ParsedAgentErrorResponse,
  ParsedAgentResponse,
  ParsedAgentSuccessResponse,
  ParsedInputReceived,
} from "@tokenring-ai/agent/AgentEvents";
import type { MaybePromise } from "bun";
import type { Hook } from "../types.ts";

export class BeforeAgentInput implements Hook {
  readonly type = "hook";

  constructor(readonly request: ParsedInputReceived) {}
}

export class AfterAgentInputSuccess implements Hook {
  readonly type = "hook";

  constructor(
    readonly request: ParsedInputReceived,
    readonly response: ParsedAgentSuccessResponse,
  ) {}
}

export class AfterAgentInputError implements Hook {
  readonly type = "hook";

  constructor(
    readonly request: ParsedInputReceived,
    readonly response: ParsedAgentErrorResponse,
  ) {}
}

export class AfterAgentInputCancelled implements Hook {
  readonly type = "hook";

  constructor(
    readonly request: ParsedInputReceived,
    readonly response: ParsedAgentCancelledResponse,
  ) {}
}

export class AfterAgentInputHandled implements Hook {
  readonly type = "hook";

  constructor(
    readonly request: ParsedInputReceived,
    readonly response: ParsedAgentResponse,
  ) {}
}

export class HookCallback<H extends Hook> {
  constructor(
    readonly hookConstructor: abstract new (...args: any[]) => H,
    readonly callback: (data: H, agent: Agent) => MaybePromise<unknown>,
  ) {}
}
