// Phase 3: Real Backend Execution Layer

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// CONFIG — adjust to your local model endpoint if needed
const LOCAL_MODEL_ENDPOINT = "http://localhost:11434/api/generate"; // Ollama default
const USE_LOCAL_MODEL = true;

// fallback simulated response
function simulateResponse(query) {
  return {
    output: `[SIMULATION] Processed: ${query}`,
    meta: { mode: "simulated" },
  };
}

// real model call (Ollama-compatible)
async function callLocalModel(query) {
  const res = await fetch(LOCAL_MODEL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3", // adjust if needed
      prompt: query,
      stream: false,
    }),
  });

  const data = await res.json();
  return {
    output: data.response || "No response",
    meta: { mode: "local" },
  };
}

// MAIN INFERENCE ROUTE
app.post("/infer", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Missing query" });

    let result;

    if (USE_LOCAL_MODEL) {
      try {
        result = await callLocalModel(query);
      } catch (err) {
        console.error("Local model failed, fallback to simulation:", err.message);
        result = simulateResponse(query);
      }
    } else {
      result = simulateResponse(query);
    }

    res.json(result);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// HEALTH CHECK
app.get("/", (_, res) => res.send("AIOS-X backend running"));

// START SERVER
const PORT = 49999;
app.listen(PORT, () => {
  console.log(`AIOS-X backend listening on http://localhost:${PORT}`);
});
