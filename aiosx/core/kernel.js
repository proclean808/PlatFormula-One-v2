// Phase 5: AIOS-X Kernel (single entrypoint for full system flow)

import { playVoicePair }  from "./voice.js";
import { runOrchestration } from "./orchestrator.js";

// lightweight event bus
const listeners = {};

function emit(event, payload) {
  (listeners[event] || []).forEach((fn) => {
    try { fn(payload); } catch (e) { console.error("AIOS-X listener error:", e); }
  });

  if (window.AIOSX_GRAPH && payload) {
    if (event === "node:start")   window.AIOSX_GRAPH.setNodeState(payload, "running");
    if (event === "node:success") window.AIOSX_GRAPH.setNodeState(payload, "success");
    if (event === "node:error")   window.AIOSX_GRAPH.setNodeState(payload, "error");
  }
}

export function on(event, fn) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
}

export async function runAIOSX({ input }) {
  try {
    if (!input) return;

    if (window.AIOSX_GRAPH) window.AIOSX_GRAPH.resetAll();

    // normalize
    emit("node:start",   "input");
    const normalized = String(input).trim();
    emit("node:success", "input");

    // voice layer: Joyce → GPT
    emit("node:start",   "voices");
    const voiceResult = await playVoicePair(normalized.slice(0, 80));
    emit("node:success", "voices");

    // orchestration (debate → execution → memory → output)
    emit("node:start",   "orchestrator");
    const result = await runOrchestration({ input: normalized });
    emit("node:success", "orchestrator");

    return {
      input:  normalized,
      voice:  voiceResult,
      output: result.output,
      meta:   result.meta,
      plan:   result.plan,
    };
  } catch (err) {
    console.error("AIOS-X Kernel Error:", err);
    emit("node:error", "execution");
    return { error: err.message };
  }
}
