import {Agent} from "@tokenring-ai/agent";
import type {
  ParsedAgentCancelledResponse,
  ParsedAgentErrorResponse,
  ParsedAgentResponse,
  ParsedAgentSuccessResponse,
  ParsedInputReceived
} from "@tokenring-ai/agent/AgentEvents";
import type {Hook} from "../types.ts";

export class BeforeAgentInput {
  readonly type = "hook";
  constructor(readonly request: ParsedInputReceived) {}
}

export class AfterAgentInputSuccess {
  readonly type = "hook";

  constructor(readonly request: ParsedInputReceived, readonly response: ParsedAgentSuccessResponse) {}
}

export class AfterAgentInputError {
  readonly type = "hook";

  constructor(readonly request: ParsedInputReceived, readonly response: ParsedAgentErrorResponse) {}
}

export class AfterAgentInputCancelled {
  readonly type = "hook";

  constructor(readonly request: ParsedInputReceived, readonly response: ParsedAgentCancelledResponse) {}
}

export class AfterAgentInputHandled {
  readonly type = "hook";

  constructor(readonly request: ParsedInputReceived, readonly response: ParsedAgentResponse) {}
}

export class HookCallback<T extends Hook> {
  constructor(
    readonly hookConstructor: abstract new (...args: any[]) => T,
    readonly callback: (data: T, agent: Agent) => Promise<void> | void
  ) {
  }
}