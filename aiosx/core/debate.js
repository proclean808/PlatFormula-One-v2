// Phase 7: Dual-Agent Debate Engine (plan synthesis)

function synthesizePlan({ input, memory }) {
  const steps = [];
  const text = String(input || "").toLowerCase();

  if (text.includes("build")) {
    steps.push("analyze_requirements");
    steps.push("design_structure");
    steps.push("execute_build");
  } else if (text.includes("analyze")) {
    steps.push("collect_data");
    steps.push("run_analysis");
    steps.push("summarize");
  } else {
    steps.push("interpret");
    steps.push("process");
    steps.push("respond");
  }

  if (memory && memory.lastOutput) {
    steps.unshift("contextualize");
  }

  return steps;
}

function runInternalDebate(input) {
  const snippet = String(input || "").slice(0, 80);
  return {
    agentA: `Expand possibilities for: ${snippet}`,
    agentB: "Constrain to executable steps",
  };
}

export async function runDebate({ input, memory }) {
  try {
    const reasoning = runInternalDebate(input);
    const plan      = synthesizePlan({ input, memory });
    return { reasoning, plan };
  } catch (err) {
    console.error("Debate error:", err);
    return { reasoning: null, plan: ["fallback_process"] };
  }
}
