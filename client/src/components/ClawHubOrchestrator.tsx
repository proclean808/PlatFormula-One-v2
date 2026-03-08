import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Cog,
  GitBranch,
  Globe,
  Layers,
  Play,
  Plus,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Terminal,
  Trash2,
  Wifi,
  WifiOff,
  X,
  Zap,
  Database,
  BrainCircuit,
  Eye,
  Clock,
} from "lucide-react";

// ════════════════════════════════════════════════════════════════════════════
//  ClawHubOrchestrator.tsx — MultiVersal ClawHub
//  FinishLine Dashboard · Multi-VercelClaw · VROF Build 64
//  ─────────────────────────────────────────────────────────────────────────
//  Real integrations: GitHub API · Vercel API · Upstash Redis (MemBRAIN)
//  Human-in-the-loop: Sheriff validation gate before Propagation
//  Pipeline: Provisioning → Serialization → Propagation → Validation
//  Auto-error correction via Smart Code Blocks (Anthropic claude-opus-4-6)
// ════════════════════════════════════════════════════════════════════════════

// ── ENV CONFIGURATION ────────────────────────────────────────────────────────
const ENV = {
  GITHUB_TOKEN:
    typeof process !== "undefined"
      ? process.env?.REACT_APP_GITHUB_TOKEN ||
        process.env?.GITHUB_TOKEN ||
        import.meta.env?.VITE_GITHUB_TOKEN ||
        ""
      : "",
  VERCEL_TOKEN:
    typeof process !== "undefined"
      ? process.env?.REACT_APP_VERCEL_TOKEN ||
        process.env?.VERCEL_TOKEN ||
        import.meta.env?.VITE_VERCEL_TOKEN ||
        ""
      : "",
  UPSTASH_REDIS_URL:
    typeof process !== "undefined"
      ? process.env?.REACT_APP_UPSTASH_REDIS_URL ||
        process.env?.UPSTASH_REDIS_URL ||
        import.meta.env?.VITE_UPSTASH_REDIS_URL ||
        ""
      : "",
  UPSTASH_REDIS_TOKEN:
    typeof process !== "undefined"
      ? process.env?.REACT_APP_UPSTASH_REDIS_TOKEN ||
        process.env?.UPSTASH_REDIS_TOKEN ||
        import.meta.env?.VITE_UPSTASH_REDIS_TOKEN ||
        ""
      : "",
  ANTHROPIC_API_KEY:
    typeof process !== "undefined"
      ? process.env?.REACT_APP_ANTHROPIC_API_KEY ||
        import.meta.env?.VITE_ANTHROPIC_API_KEY ||
        ""
      : "",
};

// ── PIPELINE PHASE DEFINITIONS ───────────────────────────────────────────────
type PhaseKey =
  | "IDLE"
  | "PROVISIONING"
  | "SERIALIZATION"
  | "SHERIFF_GATE"
  | "PROPAGATION"
  | "VALIDATION"
  | "FINISHLINE"
  | "ERROR";

interface Phase {
  key: PhaseKey;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}

const PHASES: Record<PhaseKey, Phase> = {
  IDLE: {
    key: "IDLE",
    label: "Standing By",
    color: "text-slate-400",
    bgColor: "bg-slate-900/50",
    borderColor: "border-slate-700",
    icon: "◇",
    description: "Awaiting mission parameters",
  },
  PROVISIONING: {
    key: "PROVISIONING",
    label: "Provisioning",
    color: "text-amber-400",
    bgColor: "bg-amber-900/20",
    borderColor: "border-amber-700",
    icon: "⟐",
    description: "Validating repos & Vercel projects",
  },
  SERIALIZATION: {
    key: "SERIALIZATION",
    label: "Serialization",
    color: "text-blue-400",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-700",
    icon: "⟁",
    description: "Writing manifest to MemBRAIN",
  },
  SHERIFF_GATE: {
    key: "SHERIFF_GATE",
    label: "Sheriff Gate",
    color: "text-red-400",
    bgColor: "bg-red-900/20",
    borderColor: "border-red-700",
    icon: "⛊",
    description: "Awaiting human approval",
  },
  PROPAGATION: {
    key: "PROPAGATION",
    label: "Propagation",
    color: "text-purple-400",
    bgColor: "bg-purple-900/20",
    borderColor: "border-purple-700",
    icon: "⟰",
    description: "Deploying to Vercel",
  },
  VALIDATION: {
    key: "VALIDATION",
    label: "Validation",
    color: "text-cyan-400",
    bgColor: "bg-cyan-900/20",
    borderColor: "border-cyan-700",
    icon: "⟐",
    description: "Verifying deployments",
  },
  FINISHLINE: {
    key: "FINISHLINE",
    label: "FinishLine ✓",
    color: "text-emerald-400",
    bgColor: "bg-emerald-900/20",
    borderColor: "border-emerald-600",
    icon: "◆",
    description: "All Claws deployed successfully",
  },
  ERROR: {
    key: "ERROR",
    label: "Error",
    color: "text-red-500",
    bgColor: "bg-red-900/30",
    borderColor: "border-red-600",
    icon: "✕",
    description: "Pipeline halted — review logs",
  },
};

const PHASE_ORDER: PhaseKey[] = [
  "IDLE",
  "PROVISIONING",
  "SERIALIZATION",
  "SHERIFF_GATE",
  "PROPAGATION",
  "VALIDATION",
  "FINISHLINE",
];

// ── TYPES ────────────────────────────────────────────────────────────────────
interface LogEntry {
  ts: number;
  level: "info" | "warn" | "error" | "success" | "ai";
  msg: string;
}

interface ClawConfig {
  id: string;
  name: string;
  owner: string;
  repo: string;
  branch: string;
  vercelProjectId: string;
  vercelTeamId: string;
}

interface ClawState {
  config: ClawConfig;
  phase: PhaseKey;
  logs: LogEntry[];
  latestCommit?: string;
  deploymentUrl?: string;
  deploymentId?: string;
  error?: string;
}

interface MemBrainEntry {
  phase: PhaseKey;
  claws: Array<{ id: string; phase: PhaseKey; deploymentUrl?: string }>;
  startedAt: string;
  updatedAt: string;
}

// ── GITHUB API CLIENT ────────────────────────────────────────────────────────
const GitHubClient = {
  baseUrl: "https://api.github.com",
  headers: (token: string) => ({
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  }),

  async getRepo(owner: string, repo: string, token: string) {
    const res = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`, {
      headers: this.headers(token),
    });
    if (!res.ok) throw new Error(`GitHub getRepo: ${res.status} ${res.statusText}`);
    return res.json();
  },

  async getLatestCommit(owner: string, repo: string, branch = "main", token: string) {
    const res = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/commits/${branch}`,
      { headers: this.headers(token) }
    );
    if (!res.ok) throw new Error(`GitHub getLatestCommit: ${res.status}`);
    return res.json();
  },

  async getWorkflowRuns(owner: string, repo: string, token: string, perPage = 3) {
    const res = await fetch(
      `${this.baseUrl}/repos/${owner}/${repo}/actions/runs?per_page=${perPage}`,
      { headers: this.headers(token) }
    );
    if (!res.ok) throw new Error(`GitHub getWorkflowRuns: ${res.status}`);
    return res.json();
  },
};

// ── VERCEL API CLIENT ────────────────────────────────────────────────────────
const VercelClient = {
  baseUrl: "https://api.vercel.com",
  headers: (token: string) => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }),

  async getProject(projectId: string, token: string, teamId?: string) {
    const params = teamId ? `?teamId=${teamId}` : "";
    const res = await fetch(`${this.baseUrl}/v9/projects/${projectId}${params}`, {
      headers: this.headers(token),
    });
    if (!res.ok) throw new Error(`Vercel getProject: ${res.status} ${res.statusText}`);
    return res.json();
  },

  async listDeployments(projectId: string, token: string, teamId?: string, limit = 3) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (teamId) params.set("teamId", teamId);
    const res = await fetch(
      `${this.baseUrl}/v6/deployments?projectId=${projectId}&${params}`,
      { headers: this.headers(token) }
    );
    if (!res.ok) throw new Error(`Vercel listDeployments: ${res.status}`);
    return res.json();
  },

  async getDeployment(deploymentId: string, token: string, teamId?: string) {
    const params = teamId ? `?teamId=${teamId}` : "";
    const res = await fetch(
      `${this.baseUrl}/v13/deployments/${deploymentId}${params}`,
      { headers: this.headers(token) }
    );
    if (!res.ok) throw new Error(`Vercel getDeployment: ${res.status}`);
    return res.json();
  },

  async createDeployment(
    projectId: string,
    token: string,
    teamId: string | undefined,
    gitRef: string,
    meta: Record<string, string> = {}
  ) {
    const params = teamId ? `?teamId=${teamId}` : "";
    const res = await fetch(`${this.baseUrl}/v13/deployments${params}`, {
      method: "POST",
      headers: this.headers(token),
      body: JSON.stringify({
        name: projectId,
        project: projectId,
        gitSource: { type: "github", ref: gitRef },
        meta,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        `Vercel createDeployment: ${res.status} — ${(err as any)?.error?.message || res.statusText}`
      );
    }
    return res.json();
  },
};

// ── UPSTASH REDIS CLIENT (MemBRAIN) ──────────────────────────────────────────
const MemBRAIN = {
  async set(key: string, value: unknown, url: string, token: string) {
    if (!url || !token) return;
    const res = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
    if (!res.ok) throw new Error(`MemBRAIN set: ${res.status}`);
    return res.json();
  },

  async get(key: string, url: string, token: string) {
    if (!url || !token) return null;
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data as any)?.result ?? null;
  },

  async ping(url: string, token: string): Promise<boolean> {
    if (!url || !token) return false;
    try {
      const res = await fetch(`${url}/ping`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return (data as any)?.result === "PONG";
    } catch {
      return false;
    }
  },
};

// ── ANTHROPIC SMART CODE BLOCKS ──────────────────────────────────────────────
async function runSmartCodeBlock(
  errorContext: string,
  apiKey: string,
  onChunk: (text: string) => void
): Promise<string> {
  if (!apiKey) {
    return "No Anthropic API key configured — Smart Code Block unavailable.";
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      stream: true,
      system:
        "You are an expert DevOps and deployment engineer specializing in GitHub Actions, Vercel, and CI/CD pipelines. " +
        "When given a deployment error, diagnose the root cause and provide a concise, actionable fix. " +
        "Format your response as: 1) Root Cause (1-2 sentences), 2) Fix (step-by-step with code if needed), 3) Prevention tip.",
      messages: [
        {
          role: "user",
          content: `Deployment pipeline error:\n\n\`\`\`\n${errorContext}\n\`\`\`\n\nDiagnose and provide a fix.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic API: ${res.status} ${res.statusText}`);
  }

  let fullText = "";
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
    for (const line of lines) {
      try {
        const data = JSON.parse(line.slice(6));
        if (
          data.type === "content_block_delta" &&
          data.delta?.type === "text_delta"
        ) {
          fullText += data.delta.text;
          onChunk(data.delta.text);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  return fullText;
}

// ── HELPER ───────────────────────────────────────────────────────────────────
function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function ts() {
  return Date.now();
}

function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString("en-US", { hour12: false });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── COMPONENT ────────────────────────────────────────────────────────────────
export default function ClawHubOrchestrator() {
  // ── pipeline state
  const [globalPhase, setGlobalPhase] = useState<PhaseKey>("IDLE");
  const [claws, setClaws] = useState<ClawState[]>([]);
  const [globalLogs, setGlobalLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // ── config state
  const [showConfig, setShowConfig] = useState(false);
  const [githubToken, setGithubToken] = useState(ENV.GITHUB_TOKEN);
  const [vercelToken, setVercelToken] = useState(ENV.VERCEL_TOKEN);
  const [upstashUrl, setUpstashUrl] = useState(ENV.UPSTASH_REDIS_URL);
  const [upstashToken, setUpstashToken] = useState(ENV.UPSTASH_REDIS_TOKEN);
  const [anthropicKey, setAnthropicKey] = useState(ENV.ANTHROPIC_API_KEY);

  // ── new claw form
  const [showAddClaw, setShowAddClaw] = useState(false);
  const [newClaw, setNewClaw] = useState<Partial<ClawConfig>>({
    branch: "main",
    vercelTeamId: "",
  });

  // ── sheriff gate
  const [sheriffPending, setSheriffPending] = useState(false);
  const sheriffResolveRef = useRef<((approved: boolean) => void) | null>(null);
  const [sheriffManifest, setSheriffManifest] = useState<string>("");

  // ── smart code block
  const [showSmartBlock, setShowSmartBlock] = useState(false);
  const [smartBlockInput, setSmartBlockInput] = useState("");
  const [smartBlockOutput, setSmartBlockOutput] = useState("");
  const [smartBlockRunning, setSmartBlockRunning] = useState(false);

  // ── membrain
  const [membrainOnline, setMembrainOnline] = useState<boolean | null>(null);
  const membrainKey = "vrof:orchestrator:state";

  // ── logs panel
  const logsEndRef = useRef<HTMLDivElement>(null);

  // ── scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalLogs]);

  // ── ping MemBRAIN on mount and token change
  useEffect(() => {
    if (upstashUrl && upstashToken) {
      MemBRAIN.ping(upstashUrl, upstashToken).then(setMembrainOnline);
    } else {
      setMembrainOnline(null);
    }
  }, [upstashUrl, upstashToken]);

  // ── log helpers
  const log = useCallback(
    (msg: string, level: LogEntry["level"] = "info", clawId?: string) => {
      const entry: LogEntry = { ts: ts(), level, msg };
      setGlobalLogs((prev) => [...prev.slice(-199), entry]);
      if (clawId) {
        setClaws((prev) =>
          prev.map((c) =>
            c.config.id === clawId
              ? { ...c, logs: [...c.logs.slice(-49), entry] }
              : c
          )
        );
      }
    },
    []
  );

  const setClawPhase = useCallback((clawId: string, phase: PhaseKey) => {
    setClaws((prev) =>
      prev.map((c) => (c.config.id === clawId ? { ...c, phase } : c))
    );
  }, []);

  const setClawError = useCallback((clawId: string, error: string) => {
    setClaws((prev) =>
      prev.map((c) => (c.config.id === clawId ? { ...c, error } : c))
    );
  }, []);

  // ── add claw
  function addClaw() {
    if (!newClaw.owner || !newClaw.repo || !newClaw.name || !newClaw.vercelProjectId) return;
    const claw: ClawState = {
      config: {
        id: genId(),
        name: newClaw.name!,
        owner: newClaw.owner!,
        repo: newClaw.repo!,
        branch: newClaw.branch || "main",
        vercelProjectId: newClaw.vercelProjectId!,
        vercelTeamId: newClaw.vercelTeamId || "",
      },
      phase: "IDLE",
      logs: [],
    };
    setClaws((prev) => [...prev, claw]);
    setNewClaw({ branch: "main", vercelTeamId: "" });
    setShowAddClaw(false);
    log(`🦞 Claw registered: ${claw.config.name} (${claw.config.owner}/${claw.config.repo})`, "success");
  }

  function removeClaw(id: string) {
    setClaws((prev) => prev.filter((c) => c.config.id !== id));
    log(`Claw removed: ${id}`, "warn");
  }

  // ── sheriff gate (human-in-the-loop)
  async function awaitSheriff(manifest: string): Promise<boolean> {
    setSheriffManifest(manifest);
    setSheriffPending(true);
    return new Promise<boolean>((resolve) => {
      sheriffResolveRef.current = resolve;
    });
  }

  function sheriffApprove() {
    setSheriffPending(false);
    sheriffResolveRef.current?.(true);
    log("⛊ Sheriff APPROVED — initiating Propagation", "success");
  }

  function sheriffReject() {
    setSheriffPending(false);
    sheriffResolveRef.current?.(false);
    log("⛊ Sheriff REJECTED — pipeline aborted", "error");
  }

  // ── persist to MemBRAIN
  async function persistMemBRAIN(phase: PhaseKey, clawStates: ClawState[]) {
    if (!upstashUrl || !upstashToken) return;
    try {
      const entry: MemBrainEntry = {
        phase,
        claws: clawStates.map((c) => ({
          id: c.config.id,
          phase: c.phase,
          deploymentUrl: c.deploymentUrl,
        })),
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await MemBRAIN.set(membrainKey, entry, upstashUrl, upstashToken);
    } catch (err) {
      log(`MemBRAIN write failed: ${err}`, "warn");
    }
  }

  // ── PHASE: PROVISIONING ──────────────────────────────────────────────────
  async function runProvisioning(clawList: ClawState[]): Promise<ClawState[]> {
    log("⟐ PROVISIONING — validating repos & Vercel projects…", "info");
    const updated: ClawState[] = [];

    for (const claw of clawList) {
      const { config } = claw;
      log(`  → [${config.name}] checking GitHub repo…`, "info", config.id);
      setClawPhase(config.id, "PROVISIONING");

      try {
        await GitHubClient.getRepo(config.owner, config.repo, githubToken);
        log(`  ✓ [${config.name}] GitHub repo OK`, "success", config.id);
      } catch (err) {
        const msg = `GitHub repo not accessible: ${err}`;
        log(`  ✗ [${config.name}] ${msg}`, "error", config.id);
        setClawPhase(config.id, "ERROR");
        setClawError(config.id, msg);
        updated.push({ ...claw, phase: "ERROR", error: msg });
        continue;
      }

      try {
        await VercelClient.getProject(config.vercelProjectId, vercelToken, config.vercelTeamId || undefined);
        log(`  ✓ [${config.name}] Vercel project OK`, "success", config.id);
      } catch (err) {
        const msg = `Vercel project not accessible: ${err}`;
        log(`  ✗ [${config.name}] ${msg}`, "error", config.id);
        setClawPhase(config.id, "ERROR");
        setClawError(config.id, msg);
        updated.push({ ...claw, phase: "ERROR", error: msg });
        continue;
      }

      updated.push({ ...claw, phase: "PROVISIONING" });
    }

    return updated;
  }

  // ── PHASE: SERIALIZATION ────────────────────────────────────────────────
  async function runSerialization(clawList: ClawState[]): Promise<ClawState[]> {
    log("⟁ SERIALIZATION — fetching commits & writing to MemBRAIN…", "info");
    const updated: ClawState[] = [];

    for (const claw of clawList) {
      if (claw.phase === "ERROR") { updated.push(claw); continue; }
      const { config } = claw;
      setClawPhase(config.id, "SERIALIZATION");

      let latestCommit = "";
      try {
        const commitData = await GitHubClient.getLatestCommit(
          config.owner, config.repo, config.branch, githubToken
        );
        latestCommit = commitData.sha?.slice(0, 7) || "unknown";
        log(`  ✓ [${config.name}] HEAD commit: ${latestCommit} — "${commitData.commit?.message?.split("\n")[0]}"`, "success", config.id);
      } catch (err) {
        log(`  ⚠ [${config.name}] Could not fetch commit: ${err}`, "warn", config.id);
      }

      updated.push({ ...claw, phase: "SERIALIZATION", latestCommit });
    }

    // Write manifest to MemBRAIN
    try {
      await persistMemBRAIN("SERIALIZATION", updated);
      log("  ✓ Manifest serialized to MemBRAIN", "success");
    } catch (err) {
      log(`  ⚠ MemBRAIN unavailable — continuing without persistence: ${err}`, "warn");
    }

    return updated;
  }

  // ── PHASE: PROPAGATION ───────────────────────────────────────────────────
  async function runPropagation(clawList: ClawState[]): Promise<ClawState[]> {
    log("⟰ PROPAGATION — triggering Vercel deployments…", "info");
    const updated: ClawState[] = [];

    for (const claw of clawList) {
      if (claw.phase === "ERROR") { updated.push(claw); continue; }
      const { config } = claw;
      setClawPhase(config.id, "PROPAGATION");

      try {
        const deployment = await VercelClient.createDeployment(
          config.vercelProjectId,
          vercelToken,
          config.vercelTeamId || undefined,
          config.branch,
          { source: "vrof-orchestrator", commit: claw.latestCommit || "" }
        );
        const deployId: string = deployment.id || deployment.uid || "";
        const deployUrl: string = deployment.url
          ? `https://${deployment.url}`
          : "";
        log(`  ✓ [${config.name}] Deployment queued: ${deployId}`, "success", config.id);
        updated.push({ ...claw, phase: "PROPAGATION", deploymentId: deployId, deploymentUrl: deployUrl });
      } catch (err) {
        const msg = `Deployment trigger failed: ${err}`;
        log(`  ✗ [${config.name}] ${msg}`, "error", config.id);
        setClawPhase(config.id, "ERROR");
        setClawError(config.id, msg);
        updated.push({ ...claw, phase: "ERROR", error: msg });
      }
    }

    return updated;
  }

  // ── PHASE: VALIDATION ────────────────────────────────────────────────────
  async function runValidation(clawList: ClawState[]): Promise<ClawState[]> {
    log("⟐ VALIDATION — polling deployment status…", "info");
    const updated: ClawState[] = [];

    for (const claw of clawList) {
      if (claw.phase === "ERROR") { updated.push(claw); continue; }
      const { config } = claw;
      setClawPhase(config.id, "VALIDATION");

      if (!claw.deploymentId) {
        // No deployment ID — check latest from Vercel
        try {
          const deploymentsData = await VercelClient.listDeployments(
            config.vercelProjectId, vercelToken, config.vercelTeamId || undefined, 1
          );
          const latest = deploymentsData.deployments?.[0];
          if (latest?.url) {
            log(`  ✓ [${config.name}] Latest deployment: https://${latest.url}`, "success", config.id);
            updated.push({ ...claw, phase: "FINISHLINE", deploymentUrl: `https://${latest.url}` });
          } else {
            updated.push({ ...claw, phase: "FINISHLINE" });
          }
        } catch {
          updated.push({ ...claw, phase: "FINISHLINE" });
        }
        continue;
      }

      // Poll deployment status (max 12 attempts × 5s = 60s)
      let finalState: ClawState = { ...claw };
      let attempts = 0;
      const maxAttempts = 12;

      while (attempts < maxAttempts) {
        await sleep(5000);
        attempts++;
        try {
          const dep = await VercelClient.getDeployment(
            claw.deploymentId!, vercelToken, config.vercelTeamId || undefined
          );
          const state: string = dep.state || dep.readyState || "UNKNOWN";
          log(`  → [${config.name}] Deployment ${state} (${attempts}/${maxAttempts})`, "info", config.id);

          if (state === "READY") {
            const url = dep.url ? `https://${dep.url}` : claw.deploymentUrl;
            log(`  ✓ [${config.name}] READY at ${url}`, "success", config.id);
            finalState = { ...claw, phase: "FINISHLINE", deploymentUrl: url };
            break;
          } else if (state === "ERROR" || state === "CANCELED") {
            const errorMsg = `Deployment ${state}: ${dep.errorMessage || "unknown error"}`;
            log(`  ✗ [${config.name}] ${errorMsg}`, "error", config.id);
            setClawPhase(config.id, "ERROR");
            setClawError(config.id, errorMsg);
            finalState = { ...claw, phase: "ERROR", error: errorMsg };
            break;
          }
        } catch (err) {
          log(`  ⚠ [${config.name}] Poll error: ${err}`, "warn", config.id);
        }
      }

      if (finalState.phase !== "FINISHLINE" && finalState.phase !== "ERROR") {
        // Timeout — assume pending, mark as finishline optimistically
        log(`  ⚠ [${config.name}] Validation timeout — deployment may still be building`, "warn", config.id);
        finalState = { ...claw, phase: "FINISHLINE" };
      }

      updated.push(finalState);
    }

    return updated;
  }

  // ── MAIN PIPELINE RUNNER ─────────────────────────────────────────────────
  async function runPipeline() {
    if (claws.length === 0) {
      log("No Claws configured — add at least one Claw to proceed", "warn");
      return;
    }
    if (!githubToken || !vercelToken) {
      log("GitHub and Vercel tokens are required", "error");
      return;
    }

    setIsRunning(true);
    log("═══════════════════════════════════════", "info");
    log("🦞 VROF ClawHub Pipeline — LAUNCH", "success");
    log(`   Claws: ${claws.length} · ${new Date().toISOString()}`, "info");
    log("═══════════════════════════════════════", "info");

    try {
      // Reset all claws
      setClaws((prev) => prev.map((c) => ({ ...c, phase: "IDLE", error: undefined, logs: [] })));

      // ── Phase 1: PROVISIONING
      setGlobalPhase("PROVISIONING");
      let activeclaws = claws.map((c) => ({ ...c, phase: "IDLE" as PhaseKey, error: undefined, logs: [] }));
      activeclaws = await runProvisioning(activeclaws);
      setClaws(activeclaws);
      await sleep(600);

      const failedProvisioning = activeclaws.filter((c) => c.phase === "ERROR");
      if (failedProvisioning.length === activeclaws.length) {
        throw new Error("All Claws failed provisioning");
      }

      // ── Phase 2: SERIALIZATION
      setGlobalPhase("SERIALIZATION");
      activeclaws = await runSerialization(activeclaws);
      setClaws(activeclaws);
      await sleep(400);

      // ── Phase 3: SHERIFF GATE
      setGlobalPhase("SHERIFF_GATE");
      log("⛊ SHERIFF GATE — preparing deployment manifest…", "info");

      const manifest = activeclaws
        .filter((c) => c.phase !== "ERROR")
        .map(
          (c) =>
            `  • ${c.config.name} (${c.config.owner}/${c.config.repo}@${c.config.branch}) → ${c.config.vercelProjectId}` +
            (c.latestCommit ? ` [${c.latestCommit}]` : "")
        )
        .join("\n");

      const approved = await awaitSheriff(manifest);
      if (!approved) {
        setGlobalPhase("ERROR");
        setClaws((prev) =>
          prev.map((c) =>
            c.phase !== "ERROR" ? { ...c, phase: "IDLE" } : c
          )
        );
        setIsRunning(false);
        return;
      }

      // ── Phase 4: PROPAGATION
      setGlobalPhase("PROPAGATION");
      activeclaws = await runPropagation(activeclaws);
      setClaws(activeclaws);
      await sleep(400);

      // ── Phase 5: VALIDATION
      setGlobalPhase("VALIDATION");
      activeclaws = await runValidation(activeclaws);
      setClaws(activeclaws);

      // ── FINISHLINE
      const allOk = activeclaws.every(
        (c) => c.phase === "FINISHLINE" || c.phase === "ERROR"
      );
      const anySuccess = activeclaws.some((c) => c.phase === "FINISHLINE");

      if (anySuccess) {
        setGlobalPhase("FINISHLINE");
        await persistMemBRAIN("FINISHLINE", activeclaws);
        log("═══════════════════════════════════════", "success");
        log("◆ FINISHLINE — Pipeline Complete!", "success");
        activeclaws
          .filter((c) => c.phase === "FINISHLINE")
          .forEach((c) =>
            log(
              `   ✓ ${c.config.name}${c.deploymentUrl ? ` → ${c.deploymentUrl}` : ""}`,
              "success"
            )
          );
        log("═══════════════════════════════════════", "success");
      } else {
        setGlobalPhase("ERROR");
        log("✕ All Claws errored — see logs for details", "error");
      }
    } catch (err) {
      log(`Pipeline fatal error: ${err}`, "error");
      setGlobalPhase("ERROR");
    } finally {
      setIsRunning(false);
    }
  }

  // ── SMART CODE BLOCK ────────────────────────────────────────────────────
  async function runSmartBlock() {
    if (!smartBlockInput.trim() || !anthropicKey) return;
    setSmartBlockRunning(true);
    setSmartBlockOutput("");
    log("🧠 Smart Code Block activated — querying Claude Opus 4.6…", "ai");

    try {
      let output = "";
      await runSmartCodeBlock(smartBlockInput, anthropicKey, (chunk) => {
        output += chunk;
        setSmartBlockOutput(output);
      });
      log("🧠 Smart Code Block complete", "ai");
    } catch (err) {
      log(`Smart Code Block error: ${err}`, "error");
      setSmartBlockOutput(`Error: ${err}`);
    } finally {
      setSmartBlockRunning(false);
    }
  }

  function resetPipeline() {
    setGlobalPhase("IDLE");
    setClaws((prev) =>
      prev.map((c) => ({ ...c, phase: "IDLE", error: undefined, logs: [] }))
    );
    setGlobalLogs([]);
    log("Pipeline reset — Standing By", "info");
  }

  // ── RENDER HELPERS ───────────────────────────────────────────────────────
  const currentPhase = PHASES[globalPhase];
  const activeClawCount = claws.filter(
    (c) => c.phase !== "IDLE" && c.phase !== "ERROR"
  ).length;
  const errorClawCount = claws.filter((c) => c.phase === "ERROR").length;
  const doneClawCount = claws.filter((c) => c.phase === "FINISHLINE").length;

  const logColors: Record<LogEntry["level"], string> = {
    info: "text-slate-300",
    warn: "text-amber-400",
    error: "text-red-400",
    success: "text-emerald-400",
    ai: "text-purple-400",
  };

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/40">
            <Layers className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              MultiVersal ClawHub
            </h1>
            <p className="text-xs text-muted-foreground">
              VROF Orchestrator · Build 64 ·{" "}
              <span className={currentPhase.color}>{currentPhase.icon} {currentPhase.label}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* MemBRAIN status */}
          <Badge
            variant="outline"
            className={
              membrainOnline === true
                ? "border-emerald-600 text-emerald-400 gap-1"
                : membrainOnline === false
                ? "border-red-600 text-red-400 gap-1"
                : "border-slate-600 text-slate-400 gap-1"
            }
          >
            {membrainOnline === true ? (
              <><Wifi className="h-3 w-3" /> MemBRAIN</>
            ) : membrainOnline === false ? (
              <><WifiOff className="h-3 w-3" /> MemBRAIN Offline</>
            ) : (
              <><Database className="h-3 w-3" /> MemBRAIN</>
            )}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfig(!showConfig)}
            className="gap-2 border-slate-600 text-slate-300 hover:text-white"
          >
            <Cog className="h-4 w-4" />
            Config
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSmartBlock(!showSmartBlock)}
            className="gap-2 border-purple-600/60 text-purple-400 hover:text-purple-300"
          >
            <BrainCircuit className="h-4 w-4" />
            Smart Block
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={resetPipeline}
            disabled={isRunning}
            className="gap-2 border-slate-600 text-slate-400"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>

          <Button
            size="sm"
            onClick={runPipeline}
            disabled={isRunning || claws.length === 0}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isRunning ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Running…</>
            ) : (
              <><Play className="h-4 w-4" /> Launch Pipeline</>
            )}
          </Button>
        </div>
      </div>

      {/* ── Config Panel ── */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-slate-700 bg-slate-900/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                  <Cog className="h-4 w-4" /> API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "GitHub Token", val: githubToken, set: setGithubToken, placeholder: "ghp_…" },
                  { label: "Vercel Token", val: vercelToken, set: setVercelToken, placeholder: "…" },
                  { label: "Upstash Redis URL", val: upstashUrl, set: setUpstashUrl, placeholder: "https://…" },
                  { label: "Upstash Redis Token", val: upstashToken, set: setUpstashToken, placeholder: "…" },
                  { label: "Anthropic API Key", val: anthropicKey, set: setAnthropicKey, placeholder: "sk-ant-…" },
                ].map(({ label, val, set, placeholder }) => (
                  <div key={label} className="space-y-1">
                    <Label className="text-xs text-slate-400">{label}</Label>
                    <Input
                      type="password"
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      placeholder={placeholder}
                      className="bg-slate-800 border-slate-700 text-slate-200 text-xs h-8"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
                    onClick={() =>
                      MemBRAIN.ping(upstashUrl, upstashToken).then((ok) => {
                        setMembrainOnline(ok);
                        log(ok ? "MemBRAIN PONG ✓" : "MemBRAIN unreachable", ok ? "success" : "error");
                      })
                    }
                  >
                    Ping MemBRAIN
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pipeline Phase Ribbon ── */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {PHASE_ORDER.map((pk, i) => {
          const p = PHASES[pk];
          const isActive = globalPhase === pk;
          const isPast =
            PHASE_ORDER.indexOf(globalPhase) > i &&
            globalPhase !== "ERROR";
          return (
            <div key={pk} className="flex items-center shrink-0">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                  isActive
                    ? `${p.bgColor} ${p.borderColor} ${p.color} shadow-lg`
                    : isPast
                    ? "bg-emerald-900/20 border-emerald-800 text-emerald-600"
                    : "bg-slate-900/30 border-slate-800 text-slate-600"
                }`}
              >
                <span>{isActive && isRunning ? "◈" : isPast ? "✓" : p.icon}</span>
                <span>{p.label}</span>
              </div>
              {i < PHASE_ORDER.length - 1 && (
                <ChevronRight className={`h-3 w-3 mx-0.5 shrink-0 ${isPast ? "text-emerald-700" : "text-slate-700"}`} />
              )}
            </div>
          );
        })}
        {globalPhase === "ERROR" && (
          <>
            <ChevronRight className="h-3 w-3 mx-0.5 shrink-0 text-slate-700" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono bg-red-900/30 border-red-700 text-red-400">
              <span>✕</span>
              <span>Error</span>
            </div>
          </>
        )}
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Claws", value: claws.length, color: "text-slate-300", icon: <Layers className="h-4 w-4" /> },
          { label: "Deployed", value: doneClawCount, color: "text-emerald-400", icon: <CheckCircle2 className="h-4 w-4" /> },
          { label: "Errors", value: errorClawCount, color: "text-red-400", icon: <AlertCircle className="h-4 w-4" /> },
        ].map(({ label, value, color, icon }) => (
          <Card key={label} className="border-slate-800 bg-slate-900/40">
            <CardContent className="p-3 flex items-center gap-3">
              <div className={color}>{icon}</div>
              <div>
                <div className={`text-xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Claws Panel ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" /> Active Claws
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddClaw(!showAddClaw)}
              disabled={isRunning}
              className="gap-2 border-purple-600/60 text-purple-400 hover:bg-purple-600/10 h-7 text-xs"
            >
              <Plus className="h-3 w-3" /> Add Claw
            </Button>
          </div>

          {/* Add Claw Form */}
          <AnimatePresence>
            {showAddClaw && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-purple-700/50 bg-purple-950/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-purple-300">New Claw</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Claw Name</Label>
                        <Input
                          value={newClaw.name || ""}
                          onChange={(e) => setNewClaw({ ...newClaw, name: e.target.value })}
                          placeholder="my-app"
                          className="bg-slate-800 border-slate-700 text-slate-200 text-xs h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">GitHub Owner</Label>
                        <Input
                          value={newClaw.owner || ""}
                          onChange={(e) => setNewClaw({ ...newClaw, owner: e.target.value })}
                          placeholder="username / org"
                          className="bg-slate-800 border-slate-700 text-slate-200 text-xs h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">GitHub Repo</Label>
                        <Input
                          value={newClaw.repo || ""}
                          onChange={(e) => setNewClaw({ ...newClaw, repo: e.target.value })}
                          placeholder="repo-name"
                          className="bg-slate-800 border-slate-700 text-slate-200 text-xs h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Branch</Label>
                        <Input
                          value={newClaw.branch || "main"}
                          onChange={(e) => setNewClaw({ ...newClaw, branch: e.target.value })}
                          placeholder="main"
                          className="bg-slate-800 border-slate-700 text-slate-200 text-xs h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Vercel Project ID</Label>
                        <Input
                          value={newClaw.vercelProjectId || ""}
                          onChange={(e) => setNewClaw({ ...newClaw, vercelProjectId: e.target.value })}
                          placeholder="prj_…"
                          className="bg-slate-800 border-slate-700 text-slate-200 text-xs h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">Vercel Team ID (optional)</Label>
                        <Input
                          value={newClaw.vercelTeamId || ""}
                          onChange={(e) => setNewClaw({ ...newClaw, vercelTeamId: e.target.value })}
                          placeholder="team_…"
                          className="bg-slate-800 border-slate-700 text-slate-200 text-xs h-8"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={addClaw}
                        disabled={!newClaw.owner || !newClaw.repo || !newClaw.name || !newClaw.vercelProjectId}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Register Claw
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowAddClaw(false)}
                        className="text-xs h-7 text-slate-400"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Claw Cards */}
          <div className="space-y-3">
            {claws.length === 0 && (
              <Card className="border-dashed border-slate-700 bg-slate-900/20">
                <CardContent className="py-12 text-center">
                  <Layers className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No Claws registered.</p>
                  <p className="text-xs text-slate-600 mt-1">Add a Claw to configure a GitHub + Vercel deployment pair.</p>
                </CardContent>
              </Card>
            )}

            <AnimatePresence>
              {claws.map((claw) => {
                const phase = PHASES[claw.phase];
                return (
                  <motion.div
                    key={claw.config.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className={`border transition-all ${phase.borderColor} ${phase.bgColor}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-mono text-sm ${phase.color}`}>{phase.icon}</span>
                              <span className="font-semibold text-sm text-slate-200 truncate">{claw.config.name}</span>
                              <Badge variant="outline" className={`text-xs ${phase.color} border-current`}>
                                {phase.label}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <GitBranch className="h-3 w-3" />
                                {claw.config.owner}/{claw.config.repo}@{claw.config.branch}
                                {claw.latestCommit && (
                                  <span className="text-slate-500 font-mono ml-1">[{claw.latestCommit}]</span>
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {claw.config.vercelProjectId}
                              </span>
                            </div>

                            {claw.deploymentUrl && (
                              <a
                                href={claw.deploymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-1"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                {claw.deploymentUrl}
                              </a>
                            )}

                            {claw.error && (
                              <div className="mt-2 flex items-start gap-1">
                                <AlertCircle className="h-3 w-3 text-red-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-red-400">{claw.error}</p>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs h-5 px-1 text-purple-400 hover:text-purple-300 ml-1"
                                  onClick={() => {
                                    setSmartBlockInput(claw.error || "");
                                    setShowSmartBlock(true);
                                  }}
                                >
                                  <BrainCircuit className="h-3 w-3 mr-1" /> Fix with AI
                                </Button>
                              </div>
                            )}

                            {/* Mini log (last 3 entries) */}
                            {claw.logs.length > 0 && claw.phase !== "IDLE" && (
                              <div className="mt-2 space-y-0.5">
                                {claw.logs.slice(-3).map((l, i) => (
                                  <p
                                    key={i}
                                    className={`text-xs font-mono leading-tight ${logColors[l.level]}`}
                                  >
                                    <span className="text-slate-600">{formatTime(l.ts)} </span>
                                    {l.msg}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeClaw(claw.config.id)}
                            disabled={isRunning}
                            className="shrink-0 h-7 w-7 text-slate-600 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right Panel: Logs + MemBRAIN ── */}
        <div className="space-y-4">
          {/* Pipeline Logs */}
          <Card className="border-slate-800 bg-slate-950/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-400 flex items-center gap-2">
                <Terminal className="h-3 w-3" />
                Pipeline Logs
                <Badge variant="outline" className="ml-auto text-xs border-slate-700 text-slate-500">
                  {globalLogs.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-72">
                <div className="p-3 space-y-0.5 font-mono">
                  {globalLogs.length === 0 ? (
                    <p className="text-xs text-slate-600 italic">Awaiting pipeline launch…</p>
                  ) : (
                    globalLogs.map((l, i) => (
                      <div key={i} className="flex gap-2 text-xs leading-tight">
                        <span className="text-slate-600 shrink-0">{formatTime(l.ts)}</span>
                        <span className={logColors[l.level]}>{l.msg}</span>
                      </div>
                    ))
                  )}
                  <div ref={logsEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Phase Guide */}
          <Card className="border-slate-800 bg-slate-950/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-400 flex items-center gap-2">
                <Eye className="h-3 w-3" /> Phase Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {PHASE_ORDER.slice(1).map((pk) => {
                const p = PHASES[pk];
                return (
                  <div key={pk} className="flex items-start gap-2">
                    <span className={`font-mono text-xs shrink-0 ${p.color}`}>{p.icon}</span>
                    <div>
                      <p className={`text-xs font-medium ${p.color}`}>{p.label}</p>
                      <p className="text-xs text-slate-600">{p.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* MemBRAIN Status */}
          <Card className="border-slate-800 bg-slate-950/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-400 flex items-center gap-2">
                <Database className="h-3 w-3" /> MemBRAIN State
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    membrainOnline === true
                      ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                      : membrainOnline === false
                      ? "bg-red-500"
                      : "bg-slate-600"
                  }`}
                />
                <span className="text-xs text-slate-400">
                  {membrainOnline === true
                    ? "Connected"
                    : membrainOnline === false
                    ? "Offline — configure Upstash URL & token"
                    : "Not configured"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 font-mono break-all">{membrainKey}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Sheriff Gate Modal ── */}
      <AnimatePresence>
        {sheriffPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg mx-4"
            >
              <Card className="border-red-700/60 bg-slate-950 shadow-2xl shadow-red-900/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-900/40 border border-red-700">
                      <Shield className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <CardTitle className="text-red-300">Sheriff Gate</CardTitle>
                      <p className="text-xs text-slate-400">Human-in-the-loop approval required</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
                      Deployment Manifest
                    </p>
                    <pre className="text-xs text-slate-300 bg-slate-900 rounded-lg p-3 border border-slate-800 whitespace-pre-wrap font-mono">
                      {sheriffManifest}
                    </pre>
                  </div>

                  <Separator className="bg-slate-800" />

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <p className="text-xs text-amber-400">
                      Pipeline paused — review the manifest and approve or reject propagation.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={sheriffApprove}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Approve &amp; Deploy
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 border-red-700 text-red-400 hover:bg-red-900/20"
                      onClick={sheriffReject}
                    >
                      <ShieldX className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Smart Code Block Panel ── */}
      <AnimatePresence>
        {showSmartBlock && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="border-purple-700/50 bg-purple-950/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-purple-300 flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4" />
                    Smart Code Block
                    <span className="text-xs text-slate-500 font-normal">— Auto-error correction via claude-opus-4-6</span>
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowSmartBlock(false)}
                    className="h-6 w-6 text-slate-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Error / Context</Label>
                  <Textarea
                    value={smartBlockInput}
                    onChange={(e) => setSmartBlockInput(e.target.value)}
                    placeholder="Paste error logs, stack traces, or deployment output here…"
                    className="bg-slate-900 border-slate-700 text-slate-200 text-xs font-mono min-h-[100px] resize-none"
                  />
                </div>

                <Button
                  size="sm"
                  onClick={runSmartBlock}
                  disabled={smartBlockRunning || !smartBlockInput.trim() || !anthropicKey}
                  className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {smartBlockRunning ? (
                    <><Sparkles className="h-3 w-3 animate-pulse" /> Analyzing…</>
                  ) : (
                    <><Sparkles className="h-3 w-3" /> Run Smart Block</>
                  )}
                </Button>

                {!anthropicKey && (
                  <p className="text-xs text-amber-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Set Anthropic API Key in Config to enable Smart Code Blocks
                  </p>
                )}

                {smartBlockOutput && (
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-purple-400" /> Claude Analysis
                    </Label>
                    <ScrollArea className="h-64">
                      <div className="bg-slate-900 rounded-lg p-3 border border-purple-800/40">
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                          {smartBlockOutput}
                          {smartBlockRunning && (
                            <span className="animate-pulse text-purple-400">▋</span>
                          )}
                        </pre>
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FinishLine Banner ── */}
      <AnimatePresence>
        {globalPhase === "FINISHLINE" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-emerald-600/60 bg-gradient-to-r from-emerald-950/40 to-green-950/30">
              <CardContent className="py-6 text-center">
                <div className="text-3xl mb-2">◆</div>
                <h2 className="text-xl font-bold text-emerald-400">FinishLine Reached!</h2>
                <p className="text-sm text-emerald-300/70 mt-1">
                  {doneClawCount}/{claws.length} Claw{claws.length !== 1 ? "s" : ""} deployed successfully
                </p>
                {claws
                  .filter((c) => c.deploymentUrl)
                  .map((c) => (
                    <a
                      key={c.config.id}
                      href={c.deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 mt-2 block"
                    >
                      <Globe className="h-3 w-3" /> {c.config.name}: {c.deploymentUrl}
                    </a>
                  ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
