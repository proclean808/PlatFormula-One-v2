import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot, Cpu, Zap, Activity, Terminal, GitBranch, Layers, Play,
  Plus, Trash2, RefreshCw, Server, Smartphone, BarChart3, Code2,
  Search, Database, Globe, Radio, Brain, MessageSquare, Route,
  ArrowRight, Inbox, Send, Gauge, BookOpen,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
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

interface RouteDecision {
  droid: string;
  model: string;
  category: string;
  confidence: number;
}

interface RouterEntry {
  dispatch_id: number;
  prompt: string;
  target: string;
  category: string;
  confidence: number;
  elapsed_ms: number;
  timestamp: number;
}

interface BusMessage {
  msg_id: string;
  from_droid: string;
  to_droid: string;
  type: string;
  payload: unknown;
  timestamp: number;
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

interface ClusterInfo {
  head_node: { address: string; status: string };
  workers: { id: string; type: string; status: string; droids: string[] }[];
  ollama_models: string[];
  total_droids: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOOL_ICONS: Record<string, React.ReactNode> = {
  web_search:     <Globe className="h-3 w-3" />,
  vector_lookup:  <Database className="h-3 w-3" />,
  vector_store:   <Database className="h-3 w-3" />,
  crm_writer:     <Database className="h-3 w-3" />,
  database_query: <Database className="h-3 w-3" />,
  api_router:     <Radio className="h-3 w-3" />,
};

const MODEL_COLORS: Record<string, string> = {
  "llama3":         "text-orange-400",
  "qwen2.5":        "text-blue-400",
  "mistral":        "text-purple-400",
  "deepseek-coder": "text-emerald-400",
};

const STATUS_COLORS: Record<string, string> = {
  online:  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  busy:    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  offline: "bg-red-500/20 text-red-400 border-red-500/30",
};

const AVAILABLE_MODELS = ["llama3", "qwen2.5", "mistral", "deepseek-coder", "phi3", "gemma2"];
const AVAILABLE_TOOLS  = ["web_search", "vector_lookup", "database_query", "crm_writer", "api_router"];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DroidCard({
  droid,
  onDispatch,
  onKill,
}: {
  droid: DroidStatus;
  onDispatch: (name: string) => void;
  onKill: (name: string) => void;
}) {
  return (
    <Card className="border-border/50 bg-card/60 hover:bg-card/80 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">{droid.name}</CardTitle>
              <span className={`text-xs font-mono ${MODEL_COLORS[droid.model] ?? "text-muted-foreground"}`}>
                {droid.model}
              </span>
            </div>
          </div>
          <Badge variant="outline" className={`text-xs ${STATUS_COLORS[droid.status]}`}>
            {droid.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Tools */}
        <div className="flex flex-wrap gap-1">
          {droid.tools.map(tool => (
            <span
              key={tool}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground text-xs border border-border/50"
            >
              {TOOL_ICONS[tool] ?? <Code2 className="h-3 w-3" />}
              {tool}
            </span>
          ))}
          {droid.tools.length === 0 && (
            <span className="text-xs text-muted-foreground">No tools</span>
          )}
        </div>

        {/* Capability badges */}
        <div className="flex flex-wrap gap-1">
          {droid.use_gpu && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              <Zap className="h-2.5 w-2.5" /> GPU
            </span>
          )}
          {droid.memory_enabled && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Brain className="h-2.5 w-2.5" /> mem
            </span>
          )}
          {droid.messaging_enabled && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <MessageSquare className="h-2.5 w-2.5" /> bus
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3" /> {droid.task_count} tasks
          </span>
          <span>{new Date(droid.spawned_at).toLocaleTimeString()}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 h-7 text-xs bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
            onClick={() => onDispatch(droid.name)}
            disabled={droid.status === "busy"}
          >
            <Play className="h-3 w-3 mr-1" />
            Dispatch
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => onKill(droid.name)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskOutputCard({ task }: { task: TaskRecord }) {
  return (
    <Card className="border-border/40 bg-card/40">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">{task.task_id}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-primary font-medium">{task.droid}</span>
            <span>·</span>
            <span>{task.elapsed_ms}ms</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 truncate">{task.prompt}</p>
      </CardHeader>
      <CardContent>
        <pre className="text-xs font-mono bg-background/80 rounded-md p-3 overflow-x-auto whitespace-pre-wrap border border-border/30 max-h-48 overflow-y-auto">
          {task.output}
        </pre>
      </CardContent>
    </Card>
  );
}

function ClusterTopology({ cluster }: { cluster: ClusterInfo }) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" /> Ray Cluster Topology
        </CardTitle>
        <CardDescription>
          Live view of the distributed execution environment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Head node */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Server className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">Ray Head Node (Factory Controller)</p>
            <p className="text-xs text-muted-foreground font-mono">{cluster.head_node.address}</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
            {cluster.head_node.status}
          </Badge>
        </div>

        {/* Connector line */}
        <div className="flex justify-center">
          <div className="w-px h-4 bg-border" />
        </div>

        {/* Workers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cluster.workers.map(worker => (
            <div key={worker.id} className="p-3 rounded-lg bg-card/60 border border-border/50 space-y-2">
              <div className="flex items-center gap-2">
                {worker.type.includes("S25") ? (
                  <Smartphone className="h-4 w-4 text-blue-400" />
                ) : worker.type === "GPU" ? (
                  <Zap className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Cpu className="h-4 w-4 text-emerald-400" />
                )}
                <span className="text-xs font-medium">{worker.type}</span>
              </div>
              <p className="text-xs font-mono text-muted-foreground">{worker.id}</p>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                {worker.status}
              </Badge>
              {worker.droids.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {worker.droids.map(d => (
                    <span key={d} className="text-xs bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground">
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ollama models */}
        <div className="p-3 rounded-lg bg-muted/20 border border-border/40">
          <p className="text-xs font-medium mb-2 flex items-center gap-1">
            <Layers className="h-3 w-3 text-primary" /> Ollama Model Runtime
          </p>
          <div className="flex flex-wrap gap-2">
            {cluster.ollama_models.map(m => (
              <span
                key={m}
                className={`text-xs font-mono px-2 py-1 rounded-md bg-background/60 border border-border/50 ${MODEL_COLORS[m] ?? "text-muted-foreground"}`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function DroidFactory() {
  const [droids, setDroids]         = useState<DroidStatus[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskRecord[]>([]);
  const [cluster, setCluster]       = useState<ClusterInfo | null>(null);
  const [loading, setLoading]       = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("registry");

  // Spawn form state
  const [spawnName, setSpawnName]   = useState("");
  const [spawnModel, setSpawnModel] = useState("llama3");
  const [spawnTools, setSpawnTools] = useState<string[]>(["web_search"]);
  const [spawnCount, setSpawnCount] = useState(1);

  // Task dispatch state
  const [dispatchTarget, setDispatchTarget] = useState("");
  const [dispatchPrompt, setDispatchPrompt] = useState("");
  const [dispatchResult, setDispatchResult] = useState<TaskRecord | null>(null);
  const [dispatchLoading, setDispatchLoading] = useState(false);

  // Router state
  const [routerPrompt, setRouterPrompt]       = useState("");
  const [routerDecision, setRouterDecision]   = useState<RouteDecision | null>(null);
  const [routerLog, setRouterLog]             = useState<RouterEntry[]>([]);
  const [routerLoading, setRouterLoading]     = useState(false);
  const [routerAutoDispatch, setRouterAutoDispatch] = useState(false);

  // Memory state
  const [memDroid, setMemDroid]               = useState("");
  const [memStats, setMemStats]               = useState<Record<string, unknown> | null>(null);

  // Messaging state
  const [msgFrom, setMsgFrom]                 = useState("");
  const [msgTo, setMsgTo]                     = useState("*");
  const [msgPayload, setMsgPayload]           = useState("");
  const [msgType, setMsgType]                 = useState("data");
  const [msgInbox, setMsgInbox]               = useState<BusMessage[]>([]);
  const [busStats, setBusStats]               = useState<Record<string, unknown> | null>(null);

  // ------------------------------------------------------------------
  // Data fetching
  // ------------------------------------------------------------------

  const fetchDroids = useCallback(async () => {
    try {
      const res = await fetch("/api/factory/droids");
      if (res.ok) {
        const data = await res.json();
        setDroids(data.droids ?? []);
      }
    } catch { /* network unavailable — show placeholder */ }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/factory/history?limit=10");
      if (res.ok) {
        const data = await res.json();
        setTaskHistory(data.tasks ?? []);
      }
    } catch { /* ignore */ }
  }, []);

  const fetchCluster = useCallback(async () => {
    try {
      const res = await fetch("/api/factory/cluster");
      if (res.ok) setCluster(await res.json());
    } catch { /* ignore */ }
  }, []);

  const fetchRouterLog = useCallback(async () => {
    try {
      const res = await fetch("/api/factory/router/log?limit=15");
      if (res.ok) { const d = await res.json(); setRouterLog(d.log ?? []); }
    } catch { /* ignore */ }
  }, []);

  const fetchBusStats = useCallback(async () => {
    try {
      const res = await fetch("/api/factory/messages/stats");
      if (res.ok) setBusStats(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchDroids();
    fetchHistory();
    fetchCluster();
    fetchRouterLog();
    fetchBusStats();
    const id = setInterval(() => {
      fetchDroids(); fetchHistory(); fetchRouterLog(); fetchBusStats();
    }, 5000);
    return () => clearInterval(id);
  }, [fetchDroids, fetchHistory, fetchCluster, fetchRouterLog, fetchBusStats]);

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  const handleSpawn = async () => {
    if (!spawnName.trim() || !spawnModel) return;
    setLoading(true);
    try {
      if (spawnCount > 1) {
        await fetch("/api/factory/swarm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: spawnName.trim(), model: spawnModel, tools: spawnTools, count: spawnCount }),
        });
      } else {
        await fetch("/api/factory/spawn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: spawnName.trim(), model: spawnModel, tools: spawnTools }),
        });
      }
      setSpawnName("");
      await fetchDroids();
    } finally {
      setLoading(false);
    }
  };

  const handleKill = async (name: string) => {
    await fetch(`/api/factory/droids/${encodeURIComponent(name)}`, { method: "DELETE" });
    await fetchDroids();
  };

  const handleDispatch = async (droidName?: string) => {
    const target = droidName ?? dispatchTarget;
    const prompt = dispatchPrompt || `Hello from ${target}. Describe your role in one sentence.`;
    if (!target) return;
    setDispatchLoading(true);
    setDispatchResult(null);
    try {
      const res = await fetch("/api/factory/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ droid: target, prompt }),
      });
      if (res.ok) {
        const result = await res.json();
        setDispatchResult(result);
        await fetchHistory();
        await fetchDroids();
      }
    } finally {
      setDispatchLoading(false);
    }
  };

  const toggleTool = (tool: string) => {
    setSpawnTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]);
  };

  const handleRouterClassify = async () => {
    if (!routerPrompt.trim()) return;
    setRouterLoading(true);
    setRouterDecision(null);
    try {
      const endpoint = routerAutoDispatch ? "/api/factory/router/dispatch" : "/api/factory/router/classify";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: routerPrompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setRouterDecision(data.decision ?? data.routing ?? data);
        if (routerAutoDispatch) { await fetchHistory(); await fetchDroids(); }
        await fetchRouterLog();
      }
    } finally {
      setRouterLoading(false);
    }
  };

  const handleFetchMemory = async (droidName: string) => {
    if (!droidName) return;
    try {
      const res = await fetch(`/api/factory/memory/${encodeURIComponent(droidName)}`);
      if (res.ok) setMemStats(await res.json());
    } catch { /* ignore */ }
  };

  const handleEnableMemory = async (droidName: string) => {
    if (!droidName) return;
    await fetch(`/api/factory/memory/${encodeURIComponent(droidName)}/enable`, { method: "POST" });
    await fetchDroids();
    await handleFetchMemory(droidName);
  };

  const handlePublishMessage = async () => {
    if (!msgFrom || !msgTo || !msgPayload.trim()) return;
    await fetch("/api/factory/messages/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from_droid: msgFrom, to_droid: msgTo, payload: msgPayload, type: msgType }),
    });
    setMsgPayload("");
    await fetchBusStats();
  };

  const handleReadInbox = async (droidName: string) => {
    if (!droidName) return;
    try {
      const res = await fetch(`/api/factory/messages/${encodeURIComponent(droidName)}/inbox?limit=10`);
      if (res.ok) { const d = await res.json(); setMsgInbox(d.messages ?? []); }
    } catch { /* ignore */ }
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  const onlineDroids = droids.filter(d => d.status !== "offline").length;
  const busyDroids   = droids.filter(d => d.status === "busy").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <Bot className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Factory.ai — Droid Assembly Line</h2>
            <p className="text-muted-foreground text-sm">
              Ray.io · Ollama · Samsung Galaxy S25 Ultra Edge Node
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Droids Registered", value: droids.length, icon: <Bot className="h-4 w-4 text-primary" /> },
            { label: "Online",  value: onlineDroids, icon: <Activity className="h-4 w-4 text-emerald-400" /> },
            { label: "Active Tasks", value: busyDroids, icon: <Zap className="h-4 w-4 text-yellow-400" /> },
            { label: "Tasks Completed", value: taskHistory.length, icon: <BarChart3 className="h-4 w-4 text-blue-400" /> },
          ].map(stat => (
            <Card key={stat.label} className="border-border/40 bg-card/50">
              <CardContent className="p-3 flex items-center gap-3">
                {stat.icon}
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Main tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="flex flex-wrap gap-1 h-auto w-full sm:w-auto">
          <TabsTrigger value="registry" className="text-xs">Droid Registry</TabsTrigger>
          <TabsTrigger value="spawn"    className="text-xs">Spawn</TabsTrigger>
          <TabsTrigger value="dispatch" className="text-xs">Dispatch</TabsTrigger>
          <TabsTrigger value="router"   className="text-xs flex items-center gap-1"><Route className="h-3 w-3" />Router</TabsTrigger>
          <TabsTrigger value="memory"   className="text-xs flex items-center gap-1"><Brain className="h-3 w-3" />Memory</TabsTrigger>
          <TabsTrigger value="messaging" className="text-xs flex items-center gap-1"><MessageSquare className="h-3 w-3" />Messaging</TabsTrigger>
          <TabsTrigger value="cluster"  className="text-xs">Cluster</TabsTrigger>
        </TabsList>

        {/* ── Registry ── */}
        <TabsContent value="registry" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Active Droids ({droids.length})
            </h3>
            <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={fetchDroids}>
              <RefreshCw className="h-3 w-3" /> Refresh
            </Button>
          </div>

          {droids.length === 0 ? (
            <Card className="border-dashed border-border/50">
              <CardContent className="py-12 text-center space-y-2">
                <Bot className="h-10 w-10 mx-auto text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No droids registered</p>
                <p className="text-xs text-muted-foreground">Use the Spawn tab to create droids</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {droids.map(droid => (
                <DroidCard
                  key={droid.name}
                  droid={droid}
                  onDispatch={name => { setDispatchTarget(name); setActiveSubTab("dispatch"); }}
                  onKill={handleKill}
                />
              ))}
            </div>
          )}

          {/* Task history */}
          {taskHistory.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Recent Task Output
              </h3>
              <div className="space-y-3">
                {taskHistory.slice(0, 5).map(task => (
                  <TaskOutputCard key={task.task_id} task={task} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Spawn ── */}
        <TabsContent value="spawn" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spawn form */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" /> Spawn Droid
                </CardTitle>
                <CardDescription>
                  Compile a skill manifest into a live Ray actor bound to an Ollama model.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Droid Name</label>
                  <Input
                    placeholder="e.g. LeadHarvester, ScoutDroid..."
                    value={spawnName}
                    onChange={e => setSpawnName(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Ollama Model</label>
                  <Select value={spawnModel} onValueChange={setSpawnModel}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_MODELS.map(m => (
                        <SelectItem key={m} value={m} className="text-sm">{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Tool Plugins</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TOOLS.map(tool => (
                      <button
                        key={tool}
                        onClick={() => toggleTool(tool)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border transition-colors ${
                          spawnTools.includes(tool)
                            ? "bg-primary/20 text-primary border-primary/40"
                            : "bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted/60"
                        }`}
                      >
                        {TOOL_ICONS[tool]} {tool}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Swarm Count (1 = single droid)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={spawnCount}
                    onChange={e => setSpawnCount(Number(e.target.value))}
                    className="h-8 text-sm w-24"
                  />
                </div>

                <Button
                  onClick={handleSpawn}
                  disabled={!spawnName.trim() || loading}
                  className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {spawnCount > 1 ? `Launch Swarm (${spawnCount}x)` : "Spawn Droid"}
                </Button>
              </CardContent>
            </Card>

            {/* Skill manifest reference */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" /> Built-in Skill Manifests
                </CardTitle>
                <CardDescription>
                  Pre-configured droids from YAML manifests in <code className="text-xs">factory_ai/skills/</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "LeadHarvester", model: "mistral",       role: "Customer discovery & lead scoring",    color: "purple" },
                    { name: "ScoutDroid",    model: "llama3",         role: "Market research & trend analysis",     color: "orange" },
                    { name: "TradeDroid",    model: "qwen2.5",        role: "Financial signals & sector intel",     color: "blue"   },
                    { name: "CodeDroid",     model: "deepseek-coder", role: "Code generation & DevXOps automation", color: "emerald"},
                  ].map(s => (
                    <div
                      key={s.name}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card/60 border border-border/40 cursor-pointer hover:bg-card/80 transition-colors"
                      onClick={() => { setSpawnName(s.name); setSpawnModel(s.model); setSpawnCount(1); }}
                    >
                      <Bot className={`h-5 w-5 text-${s.color}-400 shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.role}</p>
                      </div>
                      <span className={`text-xs font-mono ${MODEL_COLORS[s.model] ?? ""}`}>{s.model}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Dispatch ── */}
        <TabsContent value="dispatch" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary" /> Dispatch Task
                </CardTitle>
                <CardDescription>
                  Send a prompt to a specific droid. Ray routes it to the correct Ollama worker.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Target Droid</label>
                  <Select value={dispatchTarget} onValueChange={setDispatchTarget}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select a droid..." />
                    </SelectTrigger>
                    <SelectContent>
                      {droids.map(d => (
                        <SelectItem key={d.name} value={d.name} className="text-sm">
                          {d.name} ({d.model})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Task Prompt</label>
                  <Textarea
                    placeholder="e.g. Find top AI startups in property technology..."
                    value={dispatchPrompt}
                    onChange={e => setDispatchPrompt(e.target.value)}
                    className="text-sm min-h-[100px] resize-none"
                  />
                </div>

                {/* Quick prompts */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Quick Prompts</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Find top AI startups in proptech",
                      "Summarize LLM research trends",
                      "Analyze AI infrastructure stocks",
                      "Write a retry-with-backoff function",
                    ].map(q => (
                      <button
                        key={q}
                        onClick={() => setDispatchPrompt(q)}
                        className="text-xs px-2 py-1 rounded-md bg-muted/40 text-muted-foreground border border-border/50 hover:bg-muted/60 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleDispatch()}
                  disabled={!dispatchTarget || dispatchLoading}
                  className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                >
                  {dispatchLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  {dispatchLoading ? "Running via Ollama..." : "Run Task"}
                </Button>
              </CardContent>
            </Card>

            {/* Output */}
            <div className="space-y-4">
              {dispatchResult ? (
                <TaskOutputCard task={dispatchResult} />
              ) : (
                <Card className="border-dashed border-border/40">
                  <CardContent className="py-16 text-center space-y-2">
                    <Terminal className="h-8 w-8 mx-auto text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">Task output will appear here</p>
                  </CardContent>
                </Card>
              )}

              {/* Lifecycle diagram */}
              <Card className="border-border/40 bg-card/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Droid Task Lifecycle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1 text-xs font-mono">
                    {[
                      "1. Skill manifest compiled",
                      "2. Factory spawns Ray actor",
                      "3. Actor attaches Ollama model",
                      "4. Droid registers tool plugins",
                      "5. Task dispatched via Ray",
                      "6. Prompt → LLM → Tool calls",
                      "7. Output returned to caller",
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-primary">{"→"}</span>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── Router ── */}
        <TabsContent value="router" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Route className="h-4 w-4 text-primary" /> RouterDroid — Intelligent Dispatch
                </CardTitle>
                <CardDescription>
                  Classifies prompts and auto-routes to the best available droid (KeywordRouter).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Task Prompt</label>
                  <Textarea
                    placeholder="e.g. Write a Python function to parse JSON..."
                    value={routerPrompt}
                    onChange={e => setRouterPrompt(e.target.value)}
                    className="text-sm min-h-[80px] resize-none"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {["Write a Python retry function", "Analyze AI stock signals", "Find proptech leads", "Research LLM trends"].map(q => (
                    <button key={q} onClick={() => setRouterPrompt(q)}
                      className="text-xs px-2 py-1 rounded-md bg-muted/40 text-muted-foreground border border-border/50 hover:bg-muted/60 transition-colors">
                      {q}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <input type="checkbox" checked={routerAutoDispatch}
                      onChange={e => setRouterAutoDispatch(e.target.checked)}
                      className="rounded border-border" />
                    Auto-dispatch after classify
                  </label>
                </div>

                <Button onClick={handleRouterClassify} disabled={!routerPrompt.trim() || routerLoading}
                  className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30">
                  {routerLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Route className="h-4 w-4 mr-2" />}
                  {routerAutoDispatch ? "Classify + Dispatch" : "Classify Only"}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {routerDecision && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" /> Routing Decision
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      ["Target Droid", (routerDecision as any).droid ?? "—"],
                      ["Model",        (routerDecision as any).model ?? "—"],
                      ["Category",     (routerDecision as any).category ?? "—"],
                      ["Confidence",   typeof (routerDecision as any).confidence === "number" ? `${Math.round((routerDecision as any).confidence * 100)}%` : "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className={`font-medium font-mono ${k === "Target Droid" ? "text-primary" : ""}`}>{v}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Routing rules reference */}
              <Card className="border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" /> Routing Table
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { category: "code",     keywords: "code, function, implement, deploy…", droid: "CodeDroid",     model: "deepseek-coder", color: "emerald" },
                      { category: "finance",  keywords: "stock, trade, signal, invest…",       droid: "TradeDroid",    model: "qwen2.5",        color: "blue"    },
                      { category: "leads",    keywords: "lead, crm, sales, prospect…",         droid: "LeadHarvester", model: "mistral",        color: "purple"  },
                      { category: "research", keywords: "research, analyze, trends, find…",    droid: "ScoutDroid",    model: "llama3",         color: "orange"  },
                    ].map(r => (
                      <div key={r.category} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <span className={`w-1.5 h-1.5 rounded-full bg-${r.color}-400 shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium capitalize">{r.category}</span>
                          <span className="text-xs text-muted-foreground ml-1">· {r.keywords}</span>
                        </div>
                        <span className="text-xs font-mono text-primary shrink-0">{r.droid}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Router log */}
          {routerLog.length > 0 && (
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Gauge className="h-3.5 w-3.5 text-primary" /> Recent Routing Decisions ({routerLog.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {routerLog.slice(0, 8).map(entry => (
                    <div key={entry.dispatch_id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 text-xs">
                      <span className="text-muted-foreground font-mono w-8">#{entry.dispatch_id}</span>
                      <span className="flex-1 truncate text-muted-foreground">{entry.prompt}</span>
                      <span className="text-primary font-medium shrink-0">{entry.target}</span>
                      <span className="text-muted-foreground shrink-0">{entry.category}</span>
                      <span className="text-muted-foreground shrink-0">{entry.elapsed_ms}ms</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Memory ── */}
        <TabsContent value="memory" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" /> Droid Memory Inspector
                </CardTitle>
                <CardDescription>
                  Three-tier memory: ring buffer · Chroma vectors · DuckDB episodic log
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Select Droid</label>
                  <Select value={memDroid} onValueChange={v => { setMemDroid(v); handleFetchMemory(v); }}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Choose a droid…" />
                    </SelectTrigger>
                    <SelectContent>
                      {droids.filter(d => d.name !== "RouterDroid").map(d => (
                        <SelectItem key={d.name} value={d.name} className="text-sm">{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs"
                    onClick={() => handleFetchMemory(memDroid)} disabled={!memDroid}>
                    <RefreshCw className="h-3 w-3 mr-1" /> Inspect
                  </Button>
                  <Button size="sm" className="flex-1 h-7 text-xs bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                    onClick={() => handleEnableMemory(memDroid)} disabled={!memDroid}>
                    <Brain className="h-3 w-3 mr-1" /> Enable Memory
                  </Button>
                </div>
              </CardContent>
            </Card>

            {memStats ? (
              <div className="space-y-3">
                {/* Vector memory */}
                <Card className="border-purple-500/20 bg-purple-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Database className="h-3.5 w-3.5 text-purple-400" /> Tier-2: Chroma Vector Memory
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {[
                      ["Backend",     (memStats as any).vector_memory?.backend ?? "—"],
                      ["Stored",      `${(memStats as any).vector_memory?.count ?? 0} vectors`],
                      ["Persist dir", (memStats as any).vector_memory?.persist_dir ?? "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-mono text-purple-300">{v}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Episodic log */}
                <Card className="border-emerald-500/20 bg-emerald-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-400" /> Tier-3: DuckDB Episodic Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {[
                      ["Backend",      (memStats as any).episodic_log?.backend ?? "—"],
                      ["Episodes",     `${(memStats as any).episodic_log?.episodes ?? 0} tasks`],
                      ["Avg latency",  `${(memStats as any).episodic_log?.avg_ms ?? 0}ms`],
                      ["Success rate", `${(memStats as any).episodic_log?.success_rate ?? 0}%`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-mono text-emerald-300">{v}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-dashed border-border/40">
                <CardContent className="py-12 text-center space-y-2">
                  <Brain className="h-8 w-8 mx-auto text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Select a droid to inspect its memory</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Memory architecture diagram */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Memory Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono text-muted-foreground">{`SkilledDroid memory stack
  ├── Tier 1: short_term_buffer   (in-actor ring buf, 20 entries, always on)
  ├── Tier 2: vector_memory       (Chroma embeddings, persistent, semantic recall)
  └── Tier 3: episodic_log        (DuckDB fact store, structured, aggregatable)

Recall flow:
  new prompt → query Tier 2 → inject top-K memories → augmented prompt → Ollama

Enable memory:  droid.enable_memory()
Recall:         droid.recall("AI proptech startups", top_k=5)
Episodic stats: droid.get_episodic_stats()`}</pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Messaging ── */}
        <TabsContent value="messaging" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Publish panel */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Send className="h-4 w-4 text-primary" /> Publish Message
                </CardTitle>
                <CardDescription>
                  Send structured data between droids via Redis Streams.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">From</label>
                    <Select value={msgFrom} onValueChange={setMsgFrom}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Sender…" /></SelectTrigger>
                      <SelectContent>
                        {droids.map(d => <SelectItem key={d.name} value={d.name} className="text-sm">{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">To</label>
                    <Select value={msgTo} onValueChange={setMsgTo}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="*" className="text-sm">* (broadcast)</SelectItem>
                        {droids.map(d => <SelectItem key={d.name} value={d.name} className="text-sm">{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Message Type</label>
                  <Select value={msgType} onValueChange={setMsgType}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["data", "request", "signal", "task_result"].map(t => (
                        <SelectItem key={t} value={t} className="text-sm">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Payload</label>
                  <Textarea
                    placeholder='e.g. {"research": "Top AI proptech startups Q1 2026"}'
                    value={msgPayload}
                    onChange={e => setMsgPayload(e.target.value)}
                    className="text-sm min-h-[80px] resize-none font-mono"
                  />
                </div>

                <Button onClick={handlePublishMessage}
                  disabled={!msgFrom || !msgTo || !msgPayload.trim()}
                  className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-sm">
                  <Send className="h-3.5 w-3.5 mr-2" /> Publish to {msgTo === "*" ? "all droids" : msgTo}
                </Button>
              </CardContent>
            </Card>

            {/* Inbox + stats */}
            <div className="space-y-4">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Inbox className="h-4 w-4 text-primary" /> Read Inbox
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Select value={msgFrom} onValueChange={v => { setMsgFrom(v); handleReadInbox(v); }}>
                      <SelectTrigger className="h-8 text-sm flex-1"><SelectValue placeholder="Select droid…" /></SelectTrigger>
                      <SelectContent>
                        {droids.map(d => <SelectItem key={d.name} value={d.name} className="text-sm">{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="h-8 text-xs"
                      onClick={() => handleReadInbox(msgFrom)} disabled={!msgFrom}>
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>

                  {msgInbox.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {msgInbox.map(msg => (
                        <div key={msg.msg_id} className="p-2 rounded-lg bg-muted/20 border border-border/40 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1 text-primary font-medium">
                              <ArrowRight className="h-3 w-3" />{msg.from_droid}
                            </span>
                            <Badge variant="outline" className="text-xs px-1 py-0">{msg.type}</Badge>
                          </div>
                          <p className="text-muted-foreground font-mono truncate">
                            {typeof msg.payload === "string" ? msg.payload : JSON.stringify(msg.payload)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">Inbox empty</p>
                  )}
                </CardContent>
              </Card>

              {/* Bus stats */}
              {busStats && (
                <Card className="border-border/40 bg-card/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Radio className="h-3.5 w-3.5 text-primary" /> Message Bus Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {[
                      ["Backend",    (busStats as any).backend ?? "memory"],
                      ["Broadcast",  `${(busStats as any).broadcast_depth ?? 0} messages`],
                      ["Total msgs", `${(busStats as any).total_messages ?? 0}`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-mono text-primary">{v}</span>
                      </div>
                    ))}
                    <pre className="text-xs font-mono mt-3 p-2 bg-background/60 rounded border border-border/30 text-muted-foreground">
{`# Stream keys (Redis)
factory:droid:<name>:inbox
factory:droid:<name>:outbox
factory:broadcast`}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Cluster ── */}
        <TabsContent value="cluster" className="mt-4 space-y-4">
          {cluster ? (
            <ClusterTopology cluster={cluster} />
          ) : (
            <Card className="border-dashed border-border/40">
              <CardContent className="py-12 text-center">
                <Server className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">Cluster info unavailable</p>
              </CardContent>
            </Card>
          )}

          {/* S25 Ultra quick-start */}
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-blue-400" /> Samsung Galaxy S25 Ultra — Control Node Setup
              </CardTitle>
              <CardDescription>
                Connect your S25 Ultra as the factory command interface via Termux + Ray Client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-background/80 rounded-md p-4 overflow-x-auto border border-border/30 whitespace-pre">
{`# 1. Install Termux from F-Droid on S25 Ultra
pkg install python clang

# 2. Install Ray client
pip install ray PyYAML

# 3. Connect to your Ray head node
python3 -c "
import ray
ray.init('ray://YOUR_SERVER_IP:10001')
print('Connected to Ray cluster:', ray.cluster_resources())
"

# 4. Run the factory deployment script
python3 factory_ai/deploy_droids.py --mode single

# 5. Launch a swarm of 20 droids
python3 factory_ai/deploy_droids.py --mode swarm --count 20`}
              </pre>
            </CardContent>
          </Card>

          {/* Environment setup */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" /> Production Environment Variables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-background/80 rounded-md p-3 border border-border/30">
{`# Ray cluster
RAY_ADDRESS=ray://YOUR_HEAD_NODE:10001

# Ollama runtime
OLLAMA_HOST=http://localhost:11434
OLLAMA_GPU=1          # enable GPU acceleration

# Memory layer
FACTORY_MEM_DIR=/var/factory/memory   # Chroma persist dir
FACTORY_DB_PATH=/var/factory/eps.db   # DuckDB episodic log

# Messaging (Redis Streams)
REDIS_URL=redis://localhost:6379/0

# Vector store
WEAVIATE_URL=http://localhost:8080    # or use embedded Chroma

# Search (optional)
SERPAPI_KEY=your_key_here`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
