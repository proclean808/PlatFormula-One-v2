// Phase 8: Execution Engine (step runner + backend bridge)

const BACKEND_URL = "http://localhost:49999/infer";

// simulate Claude-style oversight (lightweight validator)
function validateStep(step, input) {
  if (!step) return { ok: false, reason: "Invalid step" };

  const text = String(input || "");
  if (step === "execute_build" && text.length < 3) {
    return { ok: false, reason: "Insufficient input for build" };
  }

  return { ok: true };
}

async function callBackend(query) {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error(`Backend responded with ${res.status}`);

  return res.json(); // expects { output, meta }
}

export async function runExecution({ plan, input }) {
  try {
    const steps   = Array.isArray(plan) && plan.length ? plan : ["interpret"];
    const outputs = [];

    for (const step of steps) {
      const check = validateStep(step, input);
      if (!check.ok) {
        return {
          output: `Execution halted: ${check.reason}`,
          meta: { failedStep: step },
        };
      }

      const query  = `[${step}] ${input}`;
      const result = await callBackend(query);

      outputs.push({
        step,
        result: result.output,
        mode:   result.meta?.mode || "unknown",
      });
    }

    return {
      output: outputs.map((o) => o.result).join("\n"),
      meta: {
        steps,
        count: steps.length,
        modes: Array.from(new Set(outputs.map((o) => o.mode))),
      },
    };
  } catch (err) {
    console.error("Execution error:", err);
    return {
      output: "Execution failure",
      meta: { error: err.message },
    };
  }
}
