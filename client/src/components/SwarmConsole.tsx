/**
 * SwarmConsole — Visual Ray + Ollama Swarm Orchestrator
 * =======================================================
 * Real-time operator console for the Factory.ai distributed droid swarm.
 *
 * Panels:
 *   1. Cluster Map      — SVG topology: head → workers, animated load arcs
 *   2. Droid Registry   — live actor table with recharts throughput bars
 *   3. Task Router Flow — animated SVG showing recent prompt → droid routes
 *   4. Memory Graph     — recharts AreaChart of vector + episodic activity
 *   5. Live Event Feed  — SSE-driven scrolling terminal
 *
 * Data sources:
 *   GET  /api/factory/swarm/topology  (polling 3 s)
 *   GET  /api/factory/memory/events   (polling 5 s)
 *   GET  /api/factory/events          (SSE — real-time)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cpu, Zap, Bot, Activity, Terminal, Server, Smartphone,
  Radio, Database, RefreshCw, Wifi, Circle, GitBranch,
  ArrowRight, Brain, BarChart3, Layers,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ClusterNode {
  id: string;
  label: string;
  type: "head" | "cpu" | "gpu" | "cloud";
  status: string;
  cpu_pct: number;
  memory_gb: number;
  memory_used_gb: number;
  droids: string[];
  ollama_models: string[];
  gpu: boolean;
  gpu_pct?: number;
}

interface SwarmEdge {
  from: string;
  to: string;
  active: boolean;
  category: string;
}

interface DroidThroughput {
  name: string;
  tasks: number;
  status: string;
  model: string;
  use_gpu: boolean;
}

interface TopologyData {
  nodes: ClusterNode[];
  edges: SwarmEdge[];
  droids: DroidThroughput[];
  throughput: DroidThroughput[];
  summary: {
    total_droids: number;
    busy: number;
    total_tasks: number;
    gpu_droids: number;
    mem_droids: number;
    sse_clients: number;
  };
  event_log: Array<{ type: string; payload: unknown; ts: number }>;
}

interface MemoryTick {
  label: string;
  vectors: number;
  episodes: number;
  tasks: number;
}

interface SwarmEvent {
  type: string;
  payload: unknown;
  ts: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODEL_COLOR: Record<string, string> = {
  "llama3":         "#f97316",
  "qwen2.5":        "#60a5fa",
  "mistral":        "#a78bfa",
  "deepseek-coder": "#34d399",
};

const CATEGORY_COLOR: Record<string, string> = {
  code:     "#34d399",
  finance:  "#60a5fa",
  leads:    "#a78bfa",
  research: "#f97316",
};

const NODE_ICON: Record<string, React.ReactNode> = {
  head:  <Smartphone className="h-4 w-4 text-blue-400" />,
  cpu:   <Cpu className="h-4 w-4 text-emerald-400" />,
  gpu:   <Zap className="h-4 w-4 text-yellow-400" />,
  cloud: <Wifi className="h-4 w-4 text-purple-400" />,
};

const EVENT_COLORS: Record<string, string> = {
  task_completed:    "text-emerald-400",
  droid_spawned:     "text-blue-400",
  droid_killed:      "text-red-400",
  route_decision:    "text-purple-400",
  memory_store:      "text-yellow-400",
  message_published: "text-cyan-400",
  status_change:     "text-orange-400",
  heartbeat:         "text-muted-foreground",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

// ── Load Bar ────────────────────────────────────────────────────────────────

function LoadBar({ pct, color = "primary" }: { pct: number; color?: string }) {
  const clamp = Math.min(Math.max(pct, 0), 100);
  const bg = color === "yellow" ? "bg-yellow-400"
           : color === "gpu"    ? "bg-purple-400"
           : "bg-emerald-400";
  return (
    <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
      <div
        className={`h-full ${bg} transition-all duration-700 rounded-full`}
        style={{ width: `${clamp}%` }}
      />
    </div>
  );
}

// ── Cluster Map (SVG) ────────────────────────────────────────────────────────

function ClusterMap({ nodes, edges }: { nodes: ClusterNode[]; edges: SwarmEdge[] }) {
  const activeEdgeCount = edges.filter(e => e.active).length;

  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5 text-primary" /> Ray Cluster Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Visual SVG topology */}
        <div className="relative w-full bg-background/50 rounded-lg border border-border/30 p-3" style={{ minHeight: 160 }}>
          <svg width="100%" viewBox="0 0 320 140" className="overflow-visible">
            {/* Head node */}
            <g transform="translate(145,14)">
              <rect x="-28" y="-10" width="56" height="24" rx="4"
                fill="hsl(var(--card))" stroke="hsl(var(--primary)/0.5)" strokeWidth="1.5" />
              <text x="0" y="3" textAnchor="middle" fontSize="8" fill="hsl(var(--primary))" fontFamily="monospace">
                S25 Ultra
              </text>
              <text x="0" y="12" textAnchor="middle" fontSize="6" fill="hsl(var(--muted-foreground))">
                Head Node
              </text>
            </g>

            {/* Worker nodes positioned in a row */}
            {[
              { label: "CPU Worker", x: 40,  color: "#34d399", droids: nodes.find(n => n.type === "cpu")?.droids ?? [] },
              { label: "GPU Worker", x: 160, color: "#facc15", droids: nodes.find(n => n.type === "gpu")?.droids ?? [] },
              { label: "Cloud Spot", x: 280, color: "#a78bfa", droids: [] },
            ].map((w, i) => (
              <g key={i} transform={`translate(${w.x},100)`}>
                {/* Connector line */}
                <line x1="0" y1="-75" x2="0" y2="-30"
                  stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray={i === 2 ? "3,3" : "0"} />
                {/* Animated pulse on active route */}
                {activeEdgeCount > 0 && i < 2 && (
                  <circle r="3" fill={w.color} opacity="0.8">
                    <animate attributeName="cy" values="-75;-30" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <rect x="-32" y="-28" width="64" height="28" rx="4"
                  fill="hsl(var(--card))" stroke={`${w.color}66`} strokeWidth="1.5" />
                <text x="0" y="-14" textAnchor="middle" fontSize="7" fill={w.color} fontFamily="monospace">
                  {w.label}
                </text>
                <text x="0" y="-5" textAnchor="middle" fontSize="6" fill="hsl(var(--muted-foreground))">
                  {w.droids.slice(0, 2).join(" · ") || "idle"}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Node stat cards */}
        <div className="grid grid-cols-2 gap-2">
          {nodes.map(node => (
            <div key={node.id} className="p-2 rounded-lg bg-card/60 border border-border/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {NODE_ICON[node.type]}
                  <span className="text-xs font-medium truncate max-w-[80px]">{node.label}</span>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  node.status === "connected" || node.status === "ready"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-muted/40 text-muted-foreground"
                }`}>{node.status}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>CPU</span><span>{node.cpu_pct.toFixed(0)}%</span>
                </div>
                <LoadBar pct={node.cpu_pct} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>RAM</span><span>{node.memory_used_gb.toFixed(1)}/{node.memory_gb}GB</span>
                </div>
                <LoadBar pct={(node.memory_used_gb / node.memory_gb) * 100} color="yellow" />
                {node.gpu && (
                  <>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>GPU</span><span>{node.gpu_pct?.toFixed(0) ?? 0}%</span>
                    </div>
                    <LoadBar pct={node.gpu_pct ?? 0} color="gpu" />
                  </>
                )}
              </div>
              {node.droids.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {node.droids.map(d => (
                    <span key={d} className="text-xs px-1 py-0.5 rounded bg-primary/10 text-primary font-mono">{d.slice(0, 8)}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Droid Registry ───────────────────────────────────────────────────────────

function DroidRegistryPanel({ droids, summary }: { droids: DroidThroughput[]; summary: TopologyData["summary"] }) {
  const maxTasks = Math.max(...droids.map(d => d.tasks), 1);

  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 text-primary" /> Active Droid Registry
        </CardTitle>
        <CardDescription className="text-xs">
          {summary.busy} busy · {summary.total_droids} total · {summary.gpu_droids} GPU
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mini recharts bar of task distribution */}
        <div className="h-24 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={droids.filter(d => d.name !== "RouterDroid")} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" />
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={v => v.replace("Droid", "").replace("Harvester", "H.")} />
              <YAxis tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="tasks" name="Tasks" radius={[3, 3, 0, 0]}
                fill="hsl(var(--primary))" opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Actor list */}
        <div className="space-y-1.5">
          {droids.map(d => (
            <div key={d.name} className="flex items-center gap-2 p-2 rounded-lg bg-card/60 border border-border/30">
              <Circle className={`h-2 w-2 shrink-0 ${
                d.status === "busy" ? "text-yellow-400 fill-yellow-400" :
                d.status === "online" ? "text-emerald-400 fill-emerald-400" :
                "text-muted-foreground fill-muted-foreground"
              }`} />
              <span className="text-xs font-medium min-w-[90px]">{d.name}</span>
              <span className="text-xs font-mono" style={{ color: MODEL_COLOR[d.model] ?? "inherit" }}>
                {d.model}
              </span>
              {d.use_gpu && <Zap className="h-2.5 w-2.5 text-yellow-400" />}
              <div className="flex-1">
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/60 rounded-full transition-all duration-500"
                    style={{ width: `${(d.tasks / maxTasks) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-mono w-8 text-right">{d.tasks}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Task Router Flow (SVG animated) ─────────────────────────────────────────

function TaskRouterFlow({ eventLog }: { eventLog: Array<{ type: string; payload: unknown; ts: number }> }) {
  const routeEvents = eventLog
    .filter(e => e.type === "task_completed" || e.type === "route_decision")
    .slice(0, 6);

  const DROIDS = ["LeadHarvester", "ScoutDroid", "TradeDroid", "CodeDroid"];
  const DROID_Y: Record<string, number> = {
    LeadHarvester: 20, ScoutDroid: 50, TradeDroid: 80, CodeDroid: 110,
  };

  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <ArrowRight className="h-3.5 w-3.5 text-primary" /> Task Router Flow
        </CardTitle>
        <CardDescription className="text-xs">RouterDroid → SkilledDroid dispatch</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* SVG flow diagram */}
        <div className="bg-background/50 rounded-lg border border-border/30 p-2">
          <svg width="100%" viewBox="0 0 280 130" className="overflow-visible">
            {/* RouterDroid node */}
            <g transform="translate(60,65)">
              <rect x="-40" y="-14" width="80" height="28" rx="5"
                fill="hsl(var(--card))" stroke="hsl(var(--primary)/0.6)" strokeWidth="1.5" />
              <text x="0" y="2" textAnchor="middle" fontSize="8" fill="hsl(var(--primary))" fontWeight="600" fontFamily="monospace">
                RouterDroid
              </text>
              <text x="0" y="10" textAnchor="middle" fontSize="6" fill="hsl(var(--muted-foreground))">
                KeywordRouter
              </text>
            </g>

            {/* Droid nodes */}
            {DROIDS.map((name, i) => {
              const y = DROID_Y[name] ?? 20 + i * 30;
              const isActive = routeEvents.some(e => (e.payload as any)?.droid === name);
              const cat = name === "CodeDroid" ? "code"
                        : name === "TradeDroid" ? "finance"
                        : name === "LeadHarvester" ? "leads"
                        : "research";
              const color = CATEGORY_COLOR[cat];
              return (
                <g key={name} transform={`translate(220,${y})`}>
                  {/* Edge */}
                  <line x1="-160" y1="0" x2="-36" y2="0"
                    stroke={isActive ? color : "hsl(var(--border))"}
                    strokeWidth={isActive ? "1.5" : "0.8"}
                    strokeDasharray={isActive ? "0" : "3,3"}
                  />
                  {/* Animated packet on active edge */}
                  {isActive && (
                    <circle r="3" fill={color} opacity="0.9">
                      <animate attributeName="cx" values="-160;-36" dur="0.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Droid node */}
                  <rect x="-35" y="-11" width="70" height="22" rx="4"
                    fill="hsl(var(--card))" stroke={`${color}55`} strokeWidth="1.2" />
                  <text x="0" y="2" textAnchor="middle" fontSize="7" fontFamily="monospace"
                    fill={isActive ? color : "hsl(var(--muted-foreground))"} fontWeight={isActive ? "600" : "400"}>
                    {name.replace("Harvester", "H.")}
                  </text>
                  <text x="0" y="9" textAnchor="middle" fontSize="5" fill="hsl(var(--muted-foreground))">
                    {cat}
                  </text>
                  {isActive && (
                    <circle cx="31" cy="-8" r="4" fill={color} opacity="0.85">
                      <animate attributeName="opacity" values="0.85;0.3;0.85" dur="1s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Recent routes */}
        <div className="space-y-1">
          {routeEvents.slice(0, 5).map((ev, i) => {
            const p = ev.payload as any;
            return (
              <div key={i} className="flex items-center gap-2 text-xs font-mono py-0.5">
                <span className="text-muted-foreground w-16 shrink-0 text-right">
                  {new Date(ev.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
                <ArrowRight className="h-2.5 w-2.5 text-primary shrink-0" />
                <span className="text-primary truncate">{p?.droid ?? p?.target ?? "—"}</span>
                {p?.elapsed_ms && <span className="text-muted-foreground ml-auto shrink-0">{p.elapsed_ms}ms</span>}
              </div>
            );
          })}
          {routeEvents.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">No routes yet — dispatch a task to see flow</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Memory Graph ─────────────────────────────────────────────────────────────

function MemoryGraph({ timeline, totals }: {
  timeline: MemoryTick[];
  totals: { total_vectors: number; total_episodes: number };
}) {
  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-primary" /> MemBrain Activity
        </CardTitle>
        <CardDescription className="text-xs">
          {totals.total_vectors} vectors · {totals.total_episodes} episodes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="vectorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="episodeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#34d399" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" />
              <XAxis dataKey="label" tick={{ fontSize: 7, fill: "hsl(var(--muted-foreground))" }}
                interval={4} />
              <YAxis tick={{ fontSize: 7, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              />
              <Area type="monotone" dataKey="vectors" name="Vectors (Chroma)"
                stroke="#a78bfa" fill="url(#vectorGrad)" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="episodes" name="Episodes (DuckDB)"
                stroke="#34d399" fill="url(#episodeGrad)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Memory tier summary */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Ring Buffer", value: "20 entries", color: "text-orange-400", icon: <Layers className="h-3 w-3" /> },
            { label: "Chroma",      value: `${totals.total_vectors} vecs`,  color: "text-purple-400", icon: <Database className="h-3 w-3" /> },
            { label: "DuckDB",      value: `${totals.total_episodes} eps`,  color: "text-emerald-400", icon: <BarChart3 className="h-3 w-3" /> },
          ].map(t => (
            <div key={t.label} className="p-2 rounded-lg bg-card/50 border border-border/30 text-center">
              <div className={`flex justify-center mb-1 ${t.color}`}>{t.icon}</div>
              <p className="text-xs font-medium">{t.value}</p>
              <p className="text-xs text-muted-foreground">{t.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Live Event Feed ───────────────────────────────────────────────────────────

function EventFeed({ events, connected }: { events: SwarmEvent[]; connected: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-primary" /> Live Event Stream
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <Circle className={`h-2 w-2 ${connected ? "text-emerald-400 fill-emerald-400" : "text-red-400 fill-red-400"}`} />
            <span className="text-xs text-muted-foreground">{connected ? "SSE connected" : "polling"}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={scrollRef}
          className="h-36 overflow-y-auto font-mono text-xs space-y-0.5 bg-background/60 rounded-lg p-3 border border-border/30"
        >
          {events.length === 0 && (
            <p className="text-muted-foreground/50">Waiting for events...</p>
          )}
          {events.slice(-60).map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-muted-foreground/50 shrink-0 tabular-nums">
                {new Date(ev.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
              <span className={`shrink-0 ${EVENT_COLORS[ev.type] ?? "text-muted-foreground"}`}>
                [{ev.type}]
              </span>
              <span className="text-muted-foreground truncate">
                {typeof ev.payload === "object"
                  ? Object.entries(ev.payload as Record<string, unknown>)
                      .slice(0, 3)
                      .map(([k, v]) => `${k}=${v}`)
                      .join(" ")
                  : String(ev.payload)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main SwarmConsole component
// ---------------------------------------------------------------------------

export default function SwarmConsole() {
  const [topology, setTopology]       = useState<TopologyData | null>(null);
  const [memTimeline, setMemTimeline] = useState<MemoryTick[]>([]);
  const [memTotals, setMemTotals]     = useState({ total_vectors: 0, total_episodes: 0 });
  const [events, setEvents]           = useState<SwarmEvent[]>([]);
  const [sseConnected, setSseConnected] = useState(false);
  const [refreshing, setRefreshing]   = useState(false);
  const sseRef = useRef<EventSource | null>(null);

  // ------------------------------------------------------------------
  // Data fetching
  // ------------------------------------------------------------------

  const fetchTopology = useCallback(async () => {
    try {
      const res = await fetch("/api/factory/swarm/topology");
      if (res.ok) setTopology(await res.json());
    } catch { /* ignore */ }
  }, []);

  const fetchMemory = useCallback(async () => {
    try {
      const res = await fetch("/api/factory/memory/events");
      if (res.ok) {
        const data = await res.json();
        setMemTimeline(data.timeline ?? []);
        setMemTotals({ total_vectors: data.total_vectors ?? 0, total_episodes: data.total_episodes ?? 0 });
      }
    } catch { /* ignore */ }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTopology(), fetchMemory()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTopology();
    fetchMemory();
    const id = setInterval(() => { fetchTopology(); fetchMemory(); }, 3000);
    return () => clearInterval(id);
  }, [fetchTopology, fetchMemory]);

  // ------------------------------------------------------------------
  // SSE subscription
  // ------------------------------------------------------------------

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      try {
        es = new EventSource("/api/factory/events");
        sseRef.current = es;

        es.onopen = () => setSseConnected(true);

        es.onmessage = (e) => {
          try {
            const ev: SwarmEvent & { payload?: SwarmEvent[] } = JSON.parse(e.data);
            if (ev.type === "backlog" && Array.isArray(ev.payload)) {
              setEvents(prev => [...ev.payload as SwarmEvent[], ...prev].slice(-100));
            } else {
              setEvents(prev => [...prev, ev].slice(-100));
            }
          } catch { /* ignore malformed */ }
        };

        es.onerror = () => {
          setSseConnected(false);
          es.close();
          retryTimeout = setTimeout(connect, 5000);
        };
      } catch {
        setSseConnected(false);
      }
    };

    connect();
    return () => {
      clearTimeout(retryTimeout);
      sseRef.current?.close();
    };
  }, []);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  const summary = topology?.summary ?? {
    total_droids: 0, busy: 0, total_tasks: 0, gpu_droids: 0, mem_droids: 0, sse_clients: 0,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Radio className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Swarm Console</h2>
              <p className="text-muted-foreground text-sm">
                Real-time Ray · Ollama · MemBrain orchestration view
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="gap-2 text-xs" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* KPI bar */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { label: "Droids",     value: summary.total_droids, icon: <Bot className="h-3.5 w-3.5 text-primary" /> },
            { label: "Busy",       value: summary.busy,         icon: <Activity className="h-3.5 w-3.5 text-yellow-400" /> },
            { label: "Tasks Done", value: summary.total_tasks,  icon: <BarChart3 className="h-3.5 w-3.5 text-blue-400" /> },
            { label: "GPU Droids", value: summary.gpu_droids,   icon: <Zap className="h-3.5 w-3.5 text-yellow-400" /> },
            { label: "Mem-Aware",  value: summary.mem_droids,   icon: <Brain className="h-3.5 w-3.5 text-purple-400" /> },
            { label: "SSE Clients",value: summary.sse_clients,  icon: <Wifi className="h-3.5 w-3.5 text-emerald-400" /> },
          ].map(stat => (
            <Card key={stat.label} className="border-border/40 bg-card/50">
              <CardContent className="p-2.5 flex items-center gap-2">
                {stat.icon}
                <div>
                  <p className="text-lg font-bold leading-none">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 2×2 panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClusterMap
          nodes={topology?.nodes ?? []}
          edges={topology?.edges ?? []}
        />
        <DroidRegistryPanel
          droids={topology?.droids ?? []}
          summary={summary}
        />
        <TaskRouterFlow
          eventLog={[...(topology?.event_log ?? []), ...events].slice(-20)}
        />
        <MemoryGraph
          timeline={memTimeline}
          totals={memTotals}
        />
      </div>

      {/* Full-width live event feed */}
      <EventFeed events={events} connected={sseConnected} />

      {/* Architecture reference */}
      <Card className="border-border/40 bg-card/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Server className="h-3.5 w-3.5 text-primary" /> Swarm Architecture Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono text-muted-foreground leading-relaxed">{`React Dashboard  →  Express API  →  Ray Head Node  →  SkilledDroid Actors
                                   ↓                         ↓
                              RouterDroid             Ollama Runtime
                            (KeywordRouter)       (local per-worker)
                                   ↓                         ↓
                     ┌─────────────────────┐         VectorMemory (Chroma)
                     │  Dispatch Strategy  │         EpisodicLog  (DuckDB)
                     │  code → CodeDroid   │         MessageBus   (Redis)
                     │  finance → Trade    │
                     │  leads → LeadH.     │
                     │  research → Scout   │
                     └─────────────────────┘

SSE stream: /api/factory/events  (task_completed · droid_spawned · route_decision)
Topology:   /api/factory/swarm/topology  (snapshot every 3s)
Memory:     /api/factory/memory/events   (timeline every 5s)`}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
