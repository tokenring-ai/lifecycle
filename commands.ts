import type {TokenRingAgentCommand} from "@tokenring-ai/agent/types";
import hooksDisable from "./commands/hooks/disable.ts";
import hooksEnable from "./commands/hooks/enable.ts";
import hooksGet from "./commands/hooks/get.ts";
import hooksList from "./commands/hooks/list.ts";
import hooksReset from "./commands/hooks/reset.ts";
import hooksSelect from "./commands/hooks/select.ts";
import hooksSet from "./commands/hooks/set.ts";

export default [hooksGet, hooksSet, hooksSelect, hooksList, hooksEnable, hooksDisable, hooksReset] as const satisfies readonly TokenRingAgentCommand<any>[];
