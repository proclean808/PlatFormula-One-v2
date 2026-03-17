// Phase 6: Orchestrator — drives debate → execution → memory, emits node events

import { runDebate }     from "./debate.js";
import { runExecution }  from "./execution.js";
import { getMemory, saveMemory } from "./memory.js";

function emitStart(nodeId, meta)   { window.AIOSX_UI_EVENTS?.onNodeStart(nodeId, meta); }
function emitSuccess(nodeId, meta) { window.AIOSX_UI_EVENTS?.onNodeSuccess(nodeId, meta); }
function emitError(nodeId, meta)   { window.AIOSX_UI_EVENTS?.onNodeError(nodeId, meta); }

export async function runOrchestration({ input }) {
  const memory = getMemory();

  emitStart("debate", "planner+critic");
  const { reasoning, plan } = await runDebate({ input, memory });
  emitSuccess("debate", plan.join(" → "));

  emitStart("execution", "step-runner");
  const execResult = await runExecution({ plan, input });
  emitSuccess("execution", execResult.meta?.modes?.join("/") || "done");

  emitStart("memory", "persist");
  saveMemory({ input, output: execResult.output });
  emitSuccess("memory", "stored");

  emitStart("output", "emit");
  emitSuccess("output", "done");

  return {
    output:    execResult.output,
    meta:      execResult.meta,
    reasoning,
    plan,
  };
}
