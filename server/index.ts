import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Factory.ai in-memory state (persists for server lifetime)
// In production, replace with Redis or a database.
// ---------------------------------------------------------------------------

interface DroidStatus {
  name: string;
  model: string;
  tools: string[];
  status: "online" | "busy" | "offline";
  task_count: number;
  spawned_at: string;
}

interface TaskRecord {
  task_id: string;
  droid: string;
  model: string;
  prompt: string;
  output: string;
  elapsed_ms: number;
  created_at: string;
}

const droids = new Map<string, DroidStatus>();
const taskHistory: TaskRecord[] = [];

// Pre-populate with the canonical Skilled Droids from the skill manifests
const DEFAULT_DROIDS: DroidStatus[] = [
  { name: "LeadHarvester", model: "mistral",       tools: ["web_search", "vector_lookup", "crm_writer", "api_router"],  status: "online", task_count: 0, spawned_at: new Date().toISOString() },
  { name: "ScoutDroid",    model: "llama3",         tools: ["web_search", "vector_lookup", "database_query"],            status: "online", task_count: 0, spawned_at: new Date().toISOString() },
  { name: "TradeDroid",    model: "qwen2.5",        tools: ["web_search", "database_query", "api_router"],               status: "online", task_count: 0, spawned_at: new Date().toISOString() },
  { name: "CodeDroid",     model: "deepseek-coder", tools: ["web_search", "database_query", "api_router"],               status: "online", task_count: 0, spawned_at: new Date().toISOString() },
];
DEFAULT_DROIDS.forEach(d => droids.set(d.name, d));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateTaskId(droidName: string, count: number): string {
  return `${droidName}_${String(count).padStart(4, "0")}`;
}

function simulateOutput(droid: DroidStatus, prompt: string): string {
  const templates: Record<string, string> = {
    LeadHarvester: `[LeadHarvester — ${droid.model}]\n\nAnalyzed prompt: "${prompt.slice(0, 60)}..."\n\nTop Leads Identified:\n1. Company: PropAI Inc | ICP Score: 87 | Signal: Series A funding\n2. Company: RealtechAI | ICP Score: 81 | Signal: Hiring SDRs\n3. Company: HomeFlow | ICP Score: 76 | Signal: New product launch\n\nRecommended Action: Outreach via LinkedIn with proptech ROI case study.`,
    ScoutDroid:    `[ScoutDroid — ${droid.model}]\n\nResearch Brief: "${prompt.slice(0, 60)}..."\n\nKey Findings:\n• LLM parameter counts grew 10x YoY (2023→2024)\n• Mixture-of-experts (MoE) is the dominant scaling strategy\n• Edge inference (Ollama, llama.cpp) reached production maturity\n\nConfidence: High | Next Steps: Deep-dive on MoE architecture tradeoffs.`,
    TradeDroid:    `[TradeDroid — ${droid.model}]\n\nSignal Analysis: "${prompt.slice(0, 60)}..."\n\nSignal: AI Infrastructure | Direction: Bullish | Conviction: 8/10\nRationale: GPU demand exceeds supply through 2026; hyperscaler capex +40% YoY\nKey Risks: Regulatory uncertainty, China export controls\nTime Horizon: 12–18 months\n\n⚠ For informational purposes only. Not financial advice.`,
    CodeDroid:     `[CodeDroid — ${droid.model}]\n\nTask: "${prompt.slice(0, 60)}..."\n\n\`\`\`python\nimport time\nimport requests\n\ndef retry_with_backoff(url, max_retries=4, base_delay=2):\n    for attempt in range(max_retries):\n        try:\n            resp = requests.get(url, timeout=10)\n            resp.raise_for_status()\n            return resp\n        except requests.RequestException as exc:\n            if attempt == max_retries - 1:\n                raise\n            delay = base_delay * (2 ** attempt)\n            time.sleep(delay)\n\`\`\`\n\nExponential backoff: 2s → 4s → 8s → 16s.`,
  };
  return templates[droid.name] ?? `[${droid.name} — ${droid.model}]\n\nTask completed: ${prompt.slice(0, 80)}...\n\n✓ Result processed via Ollama local inference.`;
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // ── Factory API ──────────────────────────────────────────────────────────

  /** GET /api/factory/droids — list all registered droids */
  app.get("/api/factory/droids", (_req, res) => {
    res.json({
      droids: Array.from(droids.values()),
      total: droids.size,
      ray_address: process.env.RAY_ADDRESS ?? "auto",
      ollama_host: process.env.OLLAMA_HOST ?? "http://localhost:11434",
    });
  });

  /** GET /api/factory/droids/:name — get a single droid's status */
  app.get("/api/factory/droids/:name", (req, res) => {
    const droid = droids.get(req.params.name);
    if (!droid) return res.status(404).json({ error: `Droid not found: ${req.params.name}` });
    res.json(droid);
  });

  /** POST /api/factory/spawn — spawn a new droid from a spec */
  app.post("/api/factory/spawn", (req, res) => {
    const { name, model, tools = [] } = req.body ?? {};
    if (!name || !model) {
      return res.status(400).json({ error: "name and model are required" });
    }
    if (droids.has(name)) {
      return res.status(409).json({ error: `Droid already exists: ${name}` });
    }
    const droid: DroidStatus = {
      name,
      model,
      tools: Array.isArray(tools) ? tools : [],
      status: "online",
      task_count: 0,
      spawned_at: new Date().toISOString(),
    };
    droids.set(name, droid);
    console.log(`[Factory] Droid spawned: ${name} (model=${model})`);
    res.status(201).json({ message: `Droid ${name} spawned`, droid });
  });

  /** POST /api/factory/swarm — spawn N identical droids from a spec */
  app.post("/api/factory/swarm", (req, res) => {
    const { name, model, tools = [], count = 5 } = req.body ?? {};
    if (!name || !model) {
      return res.status(400).json({ error: "name and model are required" });
    }
    const n = Math.min(Math.max(1, Number(count)), 50);
    const spawned: DroidStatus[] = [];

    for (let i = 0; i < n; i++) {
      const droidName = `${name}_${String(i).padStart(2, "0")}`;
      if (droids.has(droidName)) continue;
      const droid: DroidStatus = {
        name: droidName,
        model,
        tools: Array.isArray(tools) ? tools : [],
        status: "online",
        task_count: 0,
        spawned_at: new Date().toISOString(),
      };
      droids.set(droidName, droid);
      spawned.push(droid);
    }

    console.log(`[Factory] Swarm launched: ${spawned.length}x ${name}`);
    res.status(201).json({ message: `Swarm launched`, count: spawned.length, droids: spawned });
  });

  /** POST /api/factory/task — dispatch a task to a named droid */
  app.post("/api/factory/task", (req, res) => {
    const { droid: droidName, prompt } = req.body ?? {};
    if (!droidName || !prompt) {
      return res.status(400).json({ error: "droid and prompt are required" });
    }
    const droid = droids.get(droidName);
    if (!droid) {
      return res.status(404).json({ error: `Droid not found: ${droidName}` });
    }

    droid.task_count += 1;
    droid.status = "busy";

    const start = Date.now();
    // Simulate async Ollama call (replace with real subprocess in production)
    const elapsed_ms = 200 + Math.floor(Math.random() * 800);
    const output = simulateOutput(droid, prompt);

    const record: TaskRecord = {
      task_id:    generateTaskId(droidName, droid.task_count),
      droid:      droidName,
      model:      droid.model,
      prompt,
      output,
      elapsed_ms,
      created_at: new Date().toISOString(),
    };

    if (taskHistory.length >= 200) taskHistory.shift();
    taskHistory.push(record);

    // Restore to online after simulated work
    setTimeout(() => { droid.status = "online"; }, elapsed_ms);

    res.json(record);
  });

  /** DELETE /api/factory/droids/:name — kill a droid */
  app.delete("/api/factory/droids/:name", (req, res) => {
    const { name } = req.params;
    if (!droids.delete(name)) {
      return res.status(404).json({ error: `Droid not found: ${name}` });
    }
    console.log(`[Factory] Droid killed: ${name}`);
    res.json({ message: `Droid ${name} terminated` });
  });

  /** GET /api/factory/history — recent task history */
  app.get("/api/factory/history", (req, res) => {
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    res.json({ tasks: taskHistory.slice(-limit).reverse(), total: taskHistory.length });
  });

  /** GET /api/factory/cluster — Ray cluster topology info */
  app.get("/api/factory/cluster", (_req, res) => {
    res.json({
      head_node: { address: process.env.RAY_ADDRESS ?? "auto", status: "connected" },
      workers: [
        { id: "worker-gpu-0",  type: "GPU", status: "ready",  droids: Array.from(droids.keys()).slice(0, 2) },
        { id: "worker-cpu-0",  type: "CPU", status: "ready",  droids: Array.from(droids.keys()).slice(2, 4) },
        { id: "worker-edge-0", type: "Edge (S25 Ultra)", status: "connected", droids: [] },
      ],
      ollama_models: ["llama3", "qwen2.5", "mistral", "deepseek-coder"],
      total_droids: droids.size,
    });
  });

  // ── Static + SPA fallback ───────────────────────────────────────────────

  const staticPath = path.resolve(__dirname, "..", "public");
  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Factory API: http://localhost:${port}/api/factory`);
  });
}

startServer().catch(console.error);
