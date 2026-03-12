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
  use_gpu?: boolean;
  memory_enabled?: boolean;
  messaging_enabled?: boolean;
  vector_memories?: number;
  episodic_tasks?: number;
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

// ---------------------------------------------------------------------------
// SSE (Server-Sent Events) — real-time swarm event bus
// ---------------------------------------------------------------------------
interface SwarmEvent {
  type: "task_completed" | "droid_spawned" | "droid_killed" | "route_decision" |
        "memory_store" | "message_published" | "status_change" | "heartbeat";
  payload: unknown;
  ts: number;
}

const sseClients = new Set<{ res: import("express").Response; id: number }>();
let sseClientId = 0;
const eventLog: SwarmEvent[] = [];

function pushEvent(type: SwarmEvent["type"], payload: unknown) {
  const ev: SwarmEvent = { type, payload, ts: Date.now() };
  if (eventLog.length >= 200) eventLog.shift();
  eventLog.push(ev);
  const data = `data: ${JSON.stringify(ev)}\n\n`;
  sseClients.forEach(client => {
    try { client.res.write(data); } catch { sseClients.delete(client); }
  });
}

// Memory activity timeline — used by MemoryGraph chart
interface MemoryTick { t: number; vectors: number; episodes: number }
const memoryTimeline: MemoryTick[] = [];

// Message bus: channel → message list
interface BusMessage {
  msg_id: string;
  from_droid: string;
  to_droid: string;
  type: string;
  payload: unknown;
  timestamp: number;
}
const messageBus = new Map<string, BusMessage[]>();
const broadcastChannel: BusMessage[] = [];

// Router dispatch log
interface RouterEntry {
  dispatch_id: number;
  prompt: string;
  target: string;
  category: string;
  confidence: number;
  elapsed_ms: number;
  timestamp: number;
}
const routerLog: RouterEntry[] = [];
let routerDispatchCount = 0;

// Routing rules (mirrors routing_rules.py)
const ROUTING_RULES: Array<{ category: string; keywords: string[]; droid: string; model: string }> = [
  { category: "code",     keywords: ["code","function","script","implement","debug","refactor","test","deploy","build","typescript","python"],  droid: "CodeDroid",     model: "deepseek-coder" },
  { category: "finance",  keywords: ["stock","trade","market","finance","invest","portfolio","signal","bullish","bearish","sector","crypto"],   droid: "TradeDroid",    model: "qwen2.5"        },
  { category: "leads",    keywords: ["lead","customer","prospect","crm","sales","outreach","icp","pipeline","b2b","saas","qualify","score"],   droid: "LeadHarvester", model: "mistral"        },
  { category: "research", keywords: ["research","summarize","analyze","survey","trends","competitor","intel","overview","compare","find","list"], droid: "ScoutDroid",  model: "llama3"         },
];

function classifyPrompt(prompt: string): { droid: string; model: string; category: string; confidence: number } {
  const lower = prompt.toLowerCase();
  let best = { droid: "ScoutDroid", model: "llama3", category: "research", confidence: 0.2 };
  for (const rule of ROUTING_RULES) {
    const hits = rule.keywords.filter(k => lower.includes(k)).length;
    const score = hits / rule.keywords.length;
    if (score > best.confidence) {
      best = { droid: rule.droid, model: rule.model, category: rule.category, confidence: Math.min(score * 3, 1.0) };
    }
  }
  return best;
}

// Pre-populate with the canonical Skilled Droids from the skill manifests
const DEFAULT_DROIDS: DroidStatus[] = [
  { name: "LeadHarvester", model: "mistral",       tools: ["web_search", "vector_lookup", "crm_writer", "api_router"],  status: "online", task_count: 0, spawned_at: new Date().toISOString(), use_gpu: false, memory_enabled: true,  messaging_enabled: true,  vector_memories: 0, episodic_tasks: 0 },
  { name: "ScoutDroid",    model: "llama3",         tools: ["web_search", "vector_lookup", "database_query"],            status: "online", task_count: 0, spawned_at: new Date().toISOString(), use_gpu: false, memory_enabled: true,  messaging_enabled: true,  vector_memories: 0, episodic_tasks: 0 },
  { name: "TradeDroid",    model: "qwen2.5",        tools: ["web_search", "database_query", "api_router"],               status: "online", task_count: 0, spawned_at: new Date().toISOString(), use_gpu: false, memory_enabled: true,  messaging_enabled: true,  vector_memories: 0, episodic_tasks: 0 },
  { name: "CodeDroid",     model: "deepseek-coder", tools: ["web_search", "database_query", "api_router"],               status: "online", task_count: 0, spawned_at: new Date().toISOString(), use_gpu: true,  memory_enabled: true,  messaging_enabled: true,  vector_memories: 0, episodic_tasks: 0 },
  { name: "RouterDroid",   model: "—",              tools: [],                                                            status: "online", task_count: 0, spawned_at: new Date().toISOString(), use_gpu: false, memory_enabled: false, messaging_enabled: true,  vector_memories: 0, episodic_tasks: 0 },
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
    pushEvent("droid_spawned", { name, model });
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

    pushEvent("task_completed", { task_id: record.task_id, droid: droidName, elapsed_ms });

    // Restore to online after simulated work
    setTimeout(() => {
      droid.status = "online";
      pushEvent("status_change", { droid: droidName, status: "online" });
    }, elapsed_ms);

    res.json(record);
  });

  /** DELETE /api/factory/droids/:name — kill a droid */
  app.delete("/api/factory/droids/:name", (req, res) => {
    const { name } = req.params;
    if (!droids.delete(name)) {
      return res.status(404).json({ error: `Droid not found: ${name}` });
    }
    console.log(`[Factory] Droid killed: ${name}`);
    pushEvent("droid_killed", { name });
    res.json({ message: `Droid ${name} terminated` });
  });

  /** GET /api/factory/history — recent task history */
  app.get("/api/factory/history", (req, res) => {
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    res.json({ tasks: taskHistory.slice(-limit).reverse(), total: taskHistory.length });
  });

  // ── Router API ───────────────────────────────────────────────────────────

  /** POST /api/factory/router/classify — classify a prompt without dispatching */
  app.post("/api/factory/router/classify", (req, res) => {
    const { prompt } = req.body ?? {};
    if (!prompt) return res.status(400).json({ error: "prompt is required" });
    const decision = classifyPrompt(prompt);
    const scores = ROUTING_RULES.map(r => ({
      category: r.category, droid: r.droid, model: r.model,
      hits:  r.keywords.filter(k => prompt.toLowerCase().includes(k)).length,
      score: parseFloat((r.keywords.filter(k => prompt.toLowerCase().includes(k)).length / r.keywords.length).toFixed(4)),
    }));
    res.json({ prompt, decision, scores });
  });

  /** POST /api/factory/router/dispatch — auto-route a prompt to best droid */
  app.post("/api/factory/router/dispatch", (req, res) => {
    const { prompt } = req.body ?? {};
    if (!prompt) return res.status(400).json({ error: "prompt is required" });

    routerDispatchCount += 1;
    const decision = classifyPrompt(prompt);
    const droid = droids.get(decision.droid) ?? droids.get("ScoutDroid");

    if (!droid) return res.status(503).json({ error: "No droids available" });

    droid.task_count += 1;
    droid.status = "busy";
    if (droid.episodic_tasks !== undefined) droid.episodic_tasks += 1;

    const elapsed_ms = 150 + Math.floor(Math.random() * 600);
    const output = simulateOutput(droid, prompt);

    const record: TaskRecord = {
      task_id:    generateTaskId(droid.name, droid.task_count),
      droid:      droid.name,
      model:      droid.model,
      prompt,
      output,
      elapsed_ms,
      created_at: new Date().toISOString(),
    };

    if (taskHistory.length >= 200) taskHistory.shift();
    taskHistory.push(record);
    setTimeout(() => { droid.status = "online"; }, elapsed_ms);

    const entry: RouterEntry = {
      dispatch_id: routerDispatchCount,
      prompt: prompt.slice(0, 120),
      target: droid.name,
      category: decision.category,
      confidence: decision.confidence,
      elapsed_ms,
      timestamp: Date.now(),
    };
    if (routerLog.length >= 100) routerLog.shift();
    routerLog.push(entry);

    const router = droids.get("RouterDroid");
    if (router) { router.task_count += 1; router.status = "online"; }

    res.json({ ...record, routing: decision });
  });

  /** GET /api/factory/router/log — recent routing decisions */
  app.get("/api/factory/router/log", (req, res) => {
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    res.json({ log: routerLog.slice(-limit).reverse(), total: routerLog.length });
  });

  // ── Memory API ───────────────────────────────────────────────────────────

  /** GET /api/factory/memory/:droid — get droid memory stats */
  app.get("/api/factory/memory/:droid", (req, res) => {
    const droid = droids.get(req.params.droid);
    if (!droid) return res.status(404).json({ error: `Droid not found: ${req.params.droid}` });
    res.json({
      droid: droid.name,
      memory_enabled: droid.memory_enabled ?? false,
      vector_memory: {
        backend: "chroma",
        count: droid.vector_memories ?? 0,
        persist_dir: process.env.FACTORY_MEM_DIR ?? "/tmp/factory_memory",
      },
      episodic_log: {
        backend: "duckdb",
        episodes: droid.episodic_tasks ?? 0,
        db_path: process.env.FACTORY_DB_PATH ?? "/tmp/factory_episodes.db",
        avg_ms: droid.task_count > 0 ? Math.round(350 + Math.random() * 200) : 0,
        success_rate: droid.task_count > 0 ? 97.2 : 0,
      },
    });
  });

  /** POST /api/factory/memory/:droid/enable — enable memory for a droid */
  app.post("/api/factory/memory/:droid/enable", (req, res) => {
    const droid = droids.get(req.params.droid);
    if (!droid) return res.status(404).json({ error: `Droid not found: ${req.params.droid}` });
    droid.memory_enabled = true;
    console.log(`[Factory] Memory enabled for: ${droid.name}`);
    res.json({ message: `Memory enabled for ${droid.name}`, vector_backend: "chroma", log_backend: "duckdb" });
  });

  // ── Messaging API ─────────────────────────────────────────────────────────

  /** POST /api/factory/messages/publish — publish a message droid-to-droid */
  app.post("/api/factory/messages/publish", (req, res) => {
    const { from_droid, to_droid, payload, type = "data" } = req.body ?? {};
    if (!from_droid || !to_droid || payload === undefined) {
      return res.status(400).json({ error: "from_droid, to_droid, and payload are required" });
    }
    const msg: BusMessage = {
      msg_id:     Math.random().toString(36).slice(2, 10),
      from_droid, to_droid, type,
      payload,
      timestamp: Date.now(),
    };
    if (to_droid === "*") {
      broadcastChannel.push(msg);
      if (broadcastChannel.length > 200) broadcastChannel.shift();
    } else {
      const inbox = messageBus.get(to_droid) ?? [];
      inbox.push(msg);
      if (inbox.length > 100) inbox.shift();
      messageBus.set(to_droid, inbox);
    }
    const sender = droids.get(from_droid);
    if (sender) sender.messaging_enabled = true;
    res.status(201).json({ msg_id: msg.msg_id, message: "Message published" });
  });

  /** GET /api/factory/messages/:droid/inbox — read droid inbox */
  app.get("/api/factory/messages/:droid/inbox", (req, res) => {
    const { droid } = req.params;
    const limit = Math.min(Number(req.query.limit ?? 10), 50);
    const inbox = (messageBus.get(droid) ?? []).slice(-limit).reverse();
    res.json({ droid, messages: inbox, total: inbox.length });
  });

  /** GET /api/factory/messages/broadcast — read broadcast channel */
  app.get("/api/factory/messages/broadcast", (req, res) => {
    const limit = Math.min(Number(req.query.limit ?? 10), 50);
    res.json({ messages: broadcastChannel.slice(-limit).reverse(), total: broadcastChannel.length });
  });

  /** GET /api/factory/messages/stats — message bus health */
  app.get("/api/factory/messages/stats", (_req, res) => {
    const channels: Record<string, number> = {};
    messageBus.forEach((msgs, droid) => { channels[droid] = msgs.length; });
    res.json({
      backend: process.env.REDIS_URL ? "redis" : "memory",
      redis_url: process.env.REDIS_URL ?? null,
      channels,
      broadcast_depth: broadcastChannel.length,
      total_messages: Array.from(messageBus.values()).reduce((s, m) => s + m.length, 0) + broadcastChannel.length,
    });
  });

  // ── GPU API ───────────────────────────────────────────────────────────────

  /** GET /api/factory/gpu — GPU worker status */
  app.get("/api/factory/gpu", (_req, res) => {
    const gpuDroids = Array.from(droids.values()).filter(d => d.use_gpu);
    res.json({
      gpu_enabled: gpuDroids.length > 0,
      ollama_gpu:  process.env.OLLAMA_GPU === "1",
      gpu_droids:  gpuDroids.map(d => ({ name: d.name, model: d.model, status: d.status })),
      recommended_models: ["deepseek-coder", "qwen2.5"],
      notes: [
        "Set OLLAMA_GPU=1 to enable GPU acceleration",
        "Ray resource: @ray.remote(num_gpus=1) for dedicated GPU actors",
        "S25 Ultra: Qualcomm GPU not yet supported by Ollama (CPU-only)",
        "Recommended GPU: RTX 3090+ or A10G for deepseek-coder inference",
      ],
    });
  });

  /** POST /api/factory/gpu/enable/:droid — mark a droid as GPU-enabled */
  app.post("/api/factory/gpu/enable/:droid", (req, res) => {
    const droid = droids.get(req.params.droid);
    if (!droid) return res.status(404).json({ error: `Droid not found: ${req.params.droid}` });
    droid.use_gpu = true;
    console.log(`[Factory] GPU enabled for: ${droid.name}`);
    res.json({ message: `GPU mode enabled for ${droid.name}`, ollama_env: "OLLAMA_GPU=1" });
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

  // ── SSE event stream ─────────────────────────────────────────────────────

  /** GET /api/factory/events — real-time Server-Sent Events stream */
  app.get("/api/factory/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();

    const clientId = ++sseClientId;
    const client = { res, id: clientId };
    sseClients.add(client);

    // Send event backlog (last 30) to new subscriber
    const backlog = eventLog.slice(-30);
    res.write(`data: ${JSON.stringify({ type: "backlog", payload: backlog, ts: Date.now() })}\n\n`);

    const heartbeat = setInterval(() => {
      try {
        res.write(`data: ${JSON.stringify({ type: "heartbeat", payload: { clients: sseClients.size }, ts: Date.now() })}\n\n`);
      } catch { clearInterval(heartbeat); sseClients.delete(client); }
    }, 5000);

    req.on("close", () => { clearInterval(heartbeat); sseClients.delete(client); });
  });

  /** GET /api/factory/swarm/topology — full swarm state snapshot for visual graph */
  app.get("/api/factory/swarm/topology", (_req, res) => {
    const droidList = Array.from(droids.values());
    const busyCount = droidList.filter(d => d.status === "busy").length;
    const gpuCount  = droidList.filter(d => d.use_gpu).length;
    const memCount  = droidList.filter(d => d.memory_enabled).length;
    const totalTasks = droidList.reduce((s, d) => s + d.task_count, 0);

    // Synthetic per-node CPU load based on busy droids
    const nodes = [
      {
        id: "head",
        label: "S25 Ultra",
        type: "head",
        address: process.env.RAY_ADDRESS ?? "auto",
        status: "connected",
        cpu_pct: Math.min(10 + busyCount * 5, 95),
        memory_gb: 12,
        memory_used_gb: 2 + busyCount * 0.8,
        droids: droidList.filter(d => ["RouterDroid", "LeadHarvester"].includes(d.name)).map(d => d.name),
        ollama_models: ["mistral", "llama3"],
        gpu: false,
      },
      {
        id: "worker-cpu-0",
        label: "CPU Worker",
        type: "cpu",
        status: "ready",
        cpu_pct: Math.min(15 + busyCount * 8, 95),
        memory_gb: 16,
        memory_used_gb: 3 + busyCount * 1.2,
        droids: droidList.filter(d => ["ScoutDroid", "TradeDroid"].includes(d.name)).map(d => d.name),
        ollama_models: ["llama3", "qwen2.5"],
        gpu: false,
      },
      {
        id: "worker-gpu-0",
        label: "GPU Worker",
        type: "gpu",
        status: gpuCount > 0 ? "ready" : "standby",
        cpu_pct: Math.min(5 + gpuCount * 20, 95),
        memory_gb: 32,
        memory_used_gb: 4 + gpuCount * 2,
        droids: droidList.filter(d => d.use_gpu).map(d => d.name),
        ollama_models: ["deepseek-coder", "qwen2.5"],
        gpu: true,
        gpu_pct: gpuCount > 0 ? Math.min(30 + busyCount * 15, 95) : 0,
      },
      {
        id: "worker-edge-0",
        label: "Cloud Spot",
        type: "cloud",
        status: "standby",
        cpu_pct: 0,
        memory_gb: 24,
        memory_used_gb: 0,
        droids: [],
        ollama_models: [],
        gpu: true,
        gpu_pct: 0,
      },
    ];

    // Build edges (RouterDroid → each worker droid)
    const edges = droidList
      .filter(d => d.name !== "RouterDroid")
      .map(d => ({
        from: "RouterDroid",
        to:   d.name,
        active: d.status === "busy",
        category: d.name === "CodeDroid" ? "code"
                : d.name === "TradeDroid" ? "finance"
                : d.name === "LeadHarvester" ? "leads"
                : "research",
      }));

    // Recent task throughput per droid
    const throughput = droidList.map(d => ({
      name:       d.name,
      tasks:      d.task_count,
      status:     d.status,
      model:      d.model,
      use_gpu:    d.use_gpu ?? false,
    }));

    res.json({
      nodes,
      edges,
      droids: droidList,
      throughput,
      summary: {
        total_droids: droids.size,
        busy:         busyCount,
        total_tasks:  totalTasks,
        gpu_droids:   gpuCount,
        mem_droids:   memCount,
        sse_clients:  sseClients.size,
      },
      event_log: eventLog.slice(-20).reverse(),
    });
  });

  /** GET /api/factory/memory/events — memory activity timeline */
  app.get("/api/factory/memory/events", (_req, res) => {
    // Build a synthetic 60-point timeline (last 60 "ticks")
    const droidList = Array.from(droids.values());
    const totalTasks = droidList.reduce((s, d) => s + d.task_count, 0);
    const now = Date.now();
    // Use existing timeline + synthesize missing points
    const timeline = Array.from({ length: 20 }, (_, i) => ({
      t:        now - (19 - i) * 3000,
      label:    new Date(now - (19 - i) * 3000).toLocaleTimeString(),
      vectors:  Math.max(0, totalTasks * i + Math.floor(Math.random() * 3)),
      episodes: Math.max(0, totalTasks + i),
      tasks:    Math.floor(Math.random() * 3),
    }));
    res.json({ timeline, total_vectors: totalTasks * 2, total_episodes: totalTasks });
  });

  // Heartbeat to keep SSE connections alive (every 25s)
  setInterval(() => pushEvent("heartbeat", { droids: droids.size, tasks: taskHistory.length }), 25000);

  // ── HomeService Pipeline API ────────────────────────────────────────────

  // In-memory lead store (mirrors a real CRM in prod)
  interface LeadRecord {
    lead_id: string;
    channel: string;
    contact: string;
    address: string;
    raw_input: string;
    qualification_score: number;
    tier: "hot" | "warm" | "cold";
    job_type: string;
    urgency: "emergency" | "routine" | "estimate";
    system_type: string;
    lead_score: "hot" | "warm" | "cold";
    recommended_action: string;
    dispatch_status: "pending" | "dispatched" | "nurture" | "disqualified";
    technician?: string;
    eta_minutes?: number;
    followup_step: string;
    created_at: number;
    updated_at: number;
  }

  const leads = new Map<string, LeadRecord>();

  function scoreKeywords(text: string): { score: number; tier: "hot"|"warm"|"cold"; urgency: "emergency"|"routine"|"estimate"; job_type: string; system_type: string } {
    const t = text.toLowerCase();
    const emergencyWords = ["not working","no heat","no ac","no air","gas smell","flooding","leak","emergency","newborn","baby","no hot water","completely broken"];
    const hotWords = ["today","asap","urgent","right now","immediately","broke","stopped","broken"];
    const coldWords = ["cheapest","just a quote","compare prices","how much","estimate only","shopping around"];
    const systemTypes: [RegExp, string][] = [
      [/heat pump/i, "heat_pump"], [/furnace/i, "furnace"], [/boiler/i, "boiler"],
      [/mini.?split/i, "mini_split"], [/central ac|central air/i, "central_ac"],
      [/ac|air conditioning|a\/c/i, "central_ac"], [/hvac/i, "central_ac"],
    ];

    let score = 50;
    let urgency: "emergency"|"routine"|"estimate" = "routine";
    let job_type = "service_call";

    if (emergencyWords.some(w => t.includes(w))) { score += 35; urgency = "emergency"; }
    else if (hotWords.some(w => t.includes(w))) { score += 20; }
    if (coldWords.some(w => t.includes(w))) { score -= 25; urgency = "estimate"; job_type = "estimate"; }
    if (t.includes("maintenance") || t.includes("annual") || t.includes("tune")) { job_type = "maintenance"; score += 5; }
    if (t.includes("replace") || t.includes("new system") || t.includes("install")) { job_type = "replacement"; score += 15; }
    if (t.includes("homeowner") || t.includes("my home") || t.includes("my house")) score += 10;

    score = Math.min(100, Math.max(0, score));
    const tier: "hot"|"warm"|"cold" = score >= 70 ? "hot" : score >= 45 ? "warm" : "cold";

    let system_type = "central_ac";
    for (const [re, st] of systemTypes) { if (re.test(text)) { system_type = st; break; } }

    return { score, tier, urgency, job_type, system_type };
  }

  // Sample technician pool
  const TECHNICIANS = [
    { id: "T001", name: "Carlos Rivera", zone: "South Austin", busy: false, rating: 4.9 },
    { id: "T002", name: "Aisha Johnson", zone: "North Austin", busy: false, rating: 4.8 },
    { id: "T003", name: "Mike Patterson", zone: "East Austin", busy: true,  rating: 4.7 },
    { id: "T004", name: "Priya Nair",     zone: "West Austin", busy: false, rating: 4.9 },
  ];

  /** POST /api/homeservice/leads — ingest a new lead */
  app.post("/api/homeservice/leads", (req, res) => {
    const { raw_input, channel = "website", contact = "Unknown", address = "" } = req.body;
    if (!raw_input) return res.status(400).json({ error: "raw_input required" });

    const lead_id = Math.random().toString(36).slice(2, 10).toUpperCase();
    const { score, tier, urgency, job_type, system_type } = scoreKeywords(raw_input);
    const recommended_action = score < 25 ? "disqualify" : score >= 60 ? "book_immediately" : "nurture";

    const lead: LeadRecord = {
      lead_id, channel, contact, address, raw_input,
      qualification_score: score, tier, urgency, job_type, system_type,
      lead_score: tier,
      recommended_action,
      dispatch_status: recommended_action === "disqualify" ? "disqualified" : "pending",
      followup_step: "t0",
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    leads.set(lead_id, lead);
    pushEvent("lead_ingested", { lead_id, channel, tier, urgency, score });
    res.json({ lead_id, tier, urgency, score, recommended_action });
  });

  /** POST /api/homeservice/leads/:id/dispatch — assign a technician */
  app.post("/api/homeservice/leads/:id/dispatch", (req, res) => {
    const lead = leads.get(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const available = TECHNICIANS.filter(t => !t.busy);
    if (!available.length) return res.status(503).json({ error: "No technicians available" });

    const tech = lead.urgency === "emergency"
      ? available[0]  // first available for emergency
      : available.reduce((a, b) => (a.rating > b.rating ? a : b));  // highest rated otherwise

    const etaMinutes = lead.urgency === "emergency" ? 20 + Math.floor(Math.random() * 20) : 60 + Math.floor(Math.random() * 120);
    lead.technician = tech.name;
    lead.eta_minutes = etaMinutes;
    lead.dispatch_status = "dispatched";
    lead.updated_at = Date.now();
    tech.busy = true;

    pushEvent("lead_dispatched", { lead_id: lead.lead_id, technician: tech.name, eta_minutes: etaMinutes, urgency: lead.urgency });
    res.json({ lead_id: lead.lead_id, technician: tech.name, eta_minutes: etaMinutes, zone: tech.zone });
  });

  /** GET /api/homeservice/leads — list all leads with optional filter */
  app.get("/api/homeservice/leads", (req, res) => {
    const { tier, status, channel } = req.query as Record<string, string>;
    let result = Array.from(leads.values()).sort((a, b) => b.created_at - a.created_at);
    if (tier) result = result.filter(l => l.tier === tier);
    if (status) result = result.filter(l => l.dispatch_status === status);
    if (channel) result = result.filter(l => l.channel === channel);
    res.json({ leads: result, total: result.length });
  });

  /** GET /api/homeservice/leads/:id — single lead detail */
  app.get("/api/homeservice/leads/:id", (req, res) => {
    const lead = leads.get(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  });

  /** GET /api/homeservice/stats — pipeline KPIs */
  app.get("/api/homeservice/stats", (_req, res) => {
    const all = Array.from(leads.values());
    const total = all.length;
    const hot = all.filter(l => l.tier === "hot").length;
    const warm = all.filter(l => l.tier === "warm").length;
    const cold = all.filter(l => l.tier === "cold").length;
    const dispatched = all.filter(l => l.dispatch_status === "dispatched").length;
    const disqualified = all.filter(l => l.dispatch_status === "disqualified").length;
    const bookRate = total > 0 ? Math.round((dispatched / total) * 100) : 0;
    const available = TECHNICIANS.filter(t => !t.busy).length;
    const channels: Record<string, number> = {};
    for (const l of all) channels[l.channel] = (channels[l.channel] || 0) + 1;
    res.json({ total, hot, warm, cold, dispatched, disqualified, book_rate: bookRate, technicians_available: available, channels });
  });

  /** GET /api/homeservice/technicians — fleet status */
  app.get("/api/homeservice/technicians", (_req, res) => {
    res.json({ technicians: TECHNICIANS });
  });

  /** POST /api/homeservice/leads/:id/followup — advance nurture sequence */
  app.post("/api/homeservice/leads/:id/followup", (req, res) => {
    const lead = leads.get(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    const steps = ["t0", "t24h", "t72h", "t7d"];
    const idx = steps.indexOf(lead.followup_step);
    const nextStep = steps[Math.min(idx + 1, steps.length - 1)];
    lead.followup_step = nextStep;
    lead.updated_at = Date.now();
    const messages: Record<string, string> = {
      t0: `Hi ${lead.contact.split(" ")[0]}, thanks for reaching out! We received your request and will contact you shortly.`,
      t24h: `Hi ${lead.contact.split(" ")[0]}, just checking in on your ${lead.system_type.replace("_"," ")} request. Ready to schedule?`,
      t72h: `Your estimate is ready, ${lead.contact.split(" ")[0]}. Book today and lock in this week's pricing!`,
      t7d: `Final notice: we still have availability this week for your ${lead.system_type.replace("_"," ")} service. Reply YES to confirm.`,
    };
    pushEvent("followup_sent", { lead_id: lead.lead_id, step: nextStep, channel: "sms" });
    res.json({ lead_id: lead.lead_id, step: nextStep, message: messages[nextStep] });
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
