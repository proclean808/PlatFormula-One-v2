import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle, AlertTriangle, ArrowRight, ChevronDown, ChevronUp,
  Copy, Pause, Settings, Database, Brain, FileSpreadsheet, GitBranch,
  Zap, RefreshCw, X, Mail, MessageSquare, Flame, Thermometer, Snowflake,
  Filter
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type LeadStatus = "Ready" | "Sent" | "Replied" | "Meeting" | "Closed";
type FilterTier = "all" | "hot" | "warm" | "cold";

interface EmailFramework {
  hook: string;
  insight: string;
  credibility: string;
  cta: string;
}

interface ProcessedLead {
  id: string;
  name: string;
  role: string;
  company: string;
  lead_score: number;
  pain_point: string;
  inmail_draft: string;
  email_framework: EmailFramework;
  status: LeadStatus;
  processed_at: string;
}

// ─── Workflow Definition ───────────────────────────────────────────────────────

const workflowNodes = [
  {
    id: "trigger-intake",
    name: "Batch Lead Intake (Sheet)",
    type: "googleSheetsTrigger",
    icon: "FileSpreadsheet",
    color: "emerald",
    description: "Polls Intake tab every minute for new rows",
    config: {
      "Poll Frequency": "Every minute",
      "Sheet Tab": "Intake",
      "Event": "rowAdded",
      "Required Columns": "name, role, company, profile_text"
    }
  },
  {
    id: "llm-extract",
    name: "JoyceGPT Extraction & Scoring",
    type: "anthropic",
    icon: "Brain",
    color: "violet",
    description: "Claude Opus 4.6 extracts pain points, scores lead, drafts InMail & email",
    config: {
      "Model": "claude-opus-4-6",
      "Thinking": "adaptive",
      "Output Format": "Raw JSON (no fences)",
      "Fields Extracted": "pain_point, lead_score, inmail_draft, email_framework"
    }
  },
  {
    id: "code-parse",
    name: "Parse & Validate Response",
    type: "code",
    icon: "Settings",
    color: "amber",
    description: "Parses LLM string → JSON, validates schema, strips code fences, clamps score",
    config: {
      "Auto-detect Output Path": "message.content | text | content[0].text",
      "Strip Code Fences": "Yes",
      "Validate Fields": "pain_point, lead_score, inmail_draft, email_framework.*",
      "Score Clamping": "0-100 integer"
    }
  },
  {
    id: "if-valid",
    name: "Is Valid?",
    type: "if",
    icon: "GitBranch",
    color: "blue",
    description: "Routes valid extractions to Command Center, failures to Error log",
    config: {
      "Condition": "_valid === true",
      "True →": "Append to Command Center",
      "False →": "Log Parse Error"
    }
  },
  {
    id: "append-command-center",
    name: "Append to Command Center",
    type: "googleSheets",
    icon: "Database",
    color: "emerald",
    description: "Writes enriched lead + score + drafts to Command Center tab",
    config: {
      "Operation": "append",
      "Sheet Tab": "Command Center",
      "Columns": "Name, Role, Company, Lead Score, Pain Point, InMail Draft, Email Hook/Insight/Credibility/CTA, Status, Processed At"
    }
  },
  {
    id: "log-error",
    name: "Log Parse Error",
    type: "googleSheets",
    icon: "AlertTriangle",
    color: "red",
    description: "Logs failed parses with raw LLM response for debugging",
    config: {
      "Operation": "append",
      "Sheet Tab": "Errors",
      "Columns": "Lead Name, Company, Error, Raw Response, Timestamp"
    }
  }
];

const sheetTabs = [
  {
    name: "Intake",
    color: "emerald",
    headers: ["name", "role", "company", "profile_text"],
    sampleRow: ["Jane Doe", "VP Operations", "Acme Corp", "15+ years scaling ops teams..."]
  },
  {
    name: "Command Center",
    color: "blue",
    headers: ["Name", "Role", "Company", "Lead Score", "Pain Point", "InMail Draft", "Email Hook", "Email Insight", "Email Credibility", "Email CTA", "Status", "Processed At"],
    sampleRow: ["Jane Doe", "VP Operations", "Acme Corp", "82", "Manual reporting bottleneck", "Hi Jane...", "Are your reports still manual?", "Teams save 12hrs/wk", "Used by 3 Fortune 500 ops teams", "15-min walkthrough?", "Ready", "2026-03-10T14:30:00Z"]
  },
  {
    name: "Errors",
    color: "red",
    headers: ["Lead Name", "Company", "Error", "Raw Response", "Timestamp"],
    sampleRow: ["John Smith", "Beta Inc", "Missing fields: email_framework", "{\"pain_point\":\"...\"}", "2026-03-10T14:31:00Z"]
  }
];

// ─── Style Maps ───────────────────────────────────────────────────────────────

const IconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FileSpreadsheet, Brain, Settings, GitBranch, Database, AlertTriangle
};

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string; badge: string }> = {
  emerald: { bg: "bg-emerald-900", border: "border-emerald-500", text: "text-emerald-400", dot: "bg-emerald-400", badge: "bg-emerald-500" },
  violet:  { bg: "bg-violet-900",  border: "border-violet-500",  text: "text-violet-400",  dot: "bg-violet-400",  badge: "bg-violet-500"  },
  amber:   { bg: "bg-amber-900",   border: "border-amber-500",   text: "text-amber-400",   dot: "bg-amber-400",   badge: "bg-amber-500"   },
  blue:    { bg: "bg-blue-900",    border: "border-blue-500",    text: "text-blue-400",    dot: "bg-blue-400",    badge: "bg-blue-500"    },
  red:     { bg: "bg-red-900",     border: "border-red-500",     text: "text-red-400",     dot: "bg-red-400",     badge: "bg-red-500"     },
};

const statusColors: Record<LeadStatus, string> = {
  Ready:   "bg-emerald-500 bg-opacity-20 text-emerald-400 border-emerald-500",
  Sent:    "bg-blue-500 bg-opacity-20 text-blue-400 border-blue-500",
  Replied: "bg-violet-500 bg-opacity-20 text-violet-400 border-violet-500",
  Meeting: "bg-amber-500 bg-opacity-20 text-amber-400 border-amber-500",
  Closed:  "bg-gray-500 bg-opacity-20 text-gray-400 border-gray-500",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";
  const bg    = score >= 80 ? "bg-emerald-400"   : score >= 60 ? "bg-amber-400"   : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${bg}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-mono font-bold ${color}`}>{score}</span>
    </div>
  );
}

function StatusSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: LeadStatus;
  onChange: (id: string, status: LeadStatus) => void;
}) {
  const statuses: LeadStatus[] = ["Ready", "Sent", "Replied", "Meeting", "Closed"];
  return (
    <select
      value={value}
      onChange={(e) => onChange(id, e.target.value as LeadStatus)}
      className={`text-xs font-medium px-2 py-0.5 rounded-full border bg-transparent cursor-pointer
        focus:outline-none focus:ring-1 focus:ring-gray-500
        ${statusColors[value]}`}
    >
      {statuses.map((s) => (
        <option key={s} value={s} className="bg-gray-900 text-white">
          {s}
        </option>
      ))}
    </select>
  );
}

interface NodeCardProps {
  node: typeof workflowNodes[number];
  expanded: boolean;
  onToggle: () => void;
}

function NodeCard({ node, expanded, onToggle }: NodeCardProps) {
  const Icon = IconMap[node.icon];
  const c = colorMap[node.color];
  return (
    <div className={`${c.bg} bg-opacity-30 border ${c.border} border-opacity-40 rounded-lg overflow-hidden`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between p-3 text-left hover:bg-white hover:bg-opacity-5 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${c.bg} bg-opacity-60 flex items-center justify-center`}>
            <Icon size={16} className={c.text} />
          </div>
          <div>
            <div className="text-white text-sm font-semibold">{node.name}</div>
            <div className="text-gray-400 text-xs">{node.type}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${c.dot}`} />
          {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>
      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-700 border-opacity-50 pt-2">
          <p className="text-gray-300 text-xs mb-2">{node.description}</p>
          <div className="space-y-1">
            {Object.entries(node.config).map(([k, v]) => (
              <div key={k} className="flex gap-2 text-xs">
                <span className="text-gray-500 shrink-0">{k}:</span>
                <span className={`${c.text} font-mono break-all`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Message Drawer ───────────────────────────────────────────────────────────

function MessageDrawer({ lead, onClose }: { lead: ProcessedLead; onClose: () => void }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose} />
      {/* Panel */}
      <div className="relative w-full max-w-lg bg-gray-900 border-l border-gray-700 h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">{lead.name}</div>
            <div className="text-xs text-gray-400">{lead.role} · {lead.company}</div>
          </div>
          <div className="flex items-center gap-3">
            <ScoreBadge score={lead.lead_score} />
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 flex-1">
          {/* Pain Point */}
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Pain Point</div>
            <p className="text-white text-sm">{lead.pain_point}</p>
          </div>

          {/* InMail Draft */}
          <div className="bg-violet-900 bg-opacity-30 border border-violet-500 border-opacity-30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <MessageSquare size={13} className="text-violet-400" />
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">InMail Draft</span>
              </div>
              <button
                onClick={() => copyText("inmail", lead.inmail_draft)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {copiedKey === "inmail" ? <CheckCircle size={11} className="text-emerald-400" /> : <Copy size={11} />}
                {copiedKey === "inmail" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">{lead.inmail_draft}</p>
          </div>

          {/* Email Framework */}
          <div className="bg-blue-900 bg-opacity-30 border border-blue-500 border-opacity-30 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-3">
              <Mail size={13} className="text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Email Framework</span>
            </div>
            <div className="space-y-3">
              {(["hook", "insight", "credibility", "cta"] as const).map((field) => {
                const labels: Record<string, string> = {
                  hook: "Hook",
                  insight: "Insight",
                  credibility: "Credibility",
                  cta: "CTA",
                };
                const text = lead.email_framework[field];
                return (
                  <div key={field}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-blue-400">{labels[field]}</span>
                      <button
                        onClick={() => copyText(field, text)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
                      >
                        {copiedKey === field ? <CheckCircle size={10} className="text-emerald-400" /> : <Copy size={10} />}
                        {copiedKey === field ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed bg-gray-800 bg-opacity-60 rounded px-2.5 py-1.5">
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Processed at */}
          <div className="text-xs text-gray-600 text-right">
            Processed: {new Date(lead.processed_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Analytics Strip ──────────────────────────────────────────────────────────

function AnalyticsBar({ leads }: { leads: ProcessedLead[] }) {
  const hot      = leads.filter((l) => l.lead_score >= 80).length;
  const warm     = leads.filter((l) => l.lead_score >= 60 && l.lead_score < 80).length;
  const cold     = leads.filter((l) => l.lead_score < 60).length;
  const meetings = leads.filter((l) => l.status === "Meeting").length;
  const replied  = leads.filter((l) => l.status === "Replied").length;

  const stats = [
    { label: "Total", value: leads.length, color: "text-white" },
    { label: "Hot ≥80", value: hot, color: "text-emerald-400" },
    { label: "Warm 60-79", value: warm, color: "text-amber-400" },
    { label: "Cold <60", value: cold, color: "text-red-400" },
    { label: "Meetings", value: meetings, color: "text-violet-400" },
    { label: "Replied", value: replied, color: "text-blue-400" },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-gray-900 rounded-lg p-2 text-center border border-gray-800">
          <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
          <div className="text-xs text-gray-500">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function LeadHarvester() {
  const [activeTab, setActiveTab] = useState("preview");
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Live data state
  const [leads, setLeads] = useState<ProcessedLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Phase 2 — filter, drawer
  const [filterTier, setFilterTier] = useState<FilterTier>("all");
  const [drawerLead, setDrawerLead] = useState<ProcessedLead | null>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/leads/command-center");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ProcessedLead[] = await res.json();
      setLeads(data);
      setLastFetch(new Date());
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setFetchError(msg);
      // In dev (no server), fall back to a small static set so UI still renders
      setLeads(FALLBACK_LEADS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ── Status update ──────────────────────────────────────────────────────────

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    if (drawerLead?.id === id) {
      setDrawerLead((prev) => (prev ? { ...prev, status } : null));
    }
    try {
      await fetch(`/api/leads/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Silent — optimistic update already applied
    }
  };

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredLeads = leads.filter((l) => {
    if (filterTier === "hot")  return l.lead_score >= 80;
    if (filterTier === "warm") return l.lead_score >= 60 && l.lead_score < 80;
    if (filterTier === "cold") return l.lead_score < 60;
    return true;
  });

  // ── JSON export copy ───────────────────────────────────────────────────────

  const handleCopy = () => {
    const fullJSON = JSON.stringify({
      name: "PlatFormula.ONE - Lead Harvester v2",
      nodes: [],
      connections: {},
      active: false,
      settings: { executionOrder: "v1" }
    }, null, 2);
    navigator.clipboard?.writeText(fullJSON).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {drawerLead && (
        <MessageDrawer lead={drawerLead} onClose={() => setDrawerLead(null)} />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">PlatFormula.ONE</h1>
              <p className="text-xs text-gray-500">Lead Harvester v2 — Sales Navigator Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lastFetch && (
              <span className="text-xs text-gray-600">
                Updated {lastFetch.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-xs"
            >
              <RefreshCw size={11} className={loading ? "animate-spin text-blue-400" : "text-gray-400"} />
              {loading ? "Loading…" : "Refresh"}
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 bg-opacity-20 border border-amber-500 border-opacity-30">
              <Pause size={10} className="text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">Inactive</span>
            </div>
          </div>
        </div>

        {/* Fetch error banner */}
        {fetchError && (
          <div className="mb-4 p-3 bg-amber-900 bg-opacity-30 border border-amber-500 border-opacity-40 rounded-lg flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-300">
              Could not reach API ({fetchError}). Showing sample data — start the server to see live leads.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-900 rounded-lg p-1">
          {[
            { key: "preview",  label: "Lead Preview" },
            { key: "pipeline", label: "Pipeline Nodes" },
            { key: "sheets",   label: "Sheet Schema" },
            { key: "json",     label: "Export JSON" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                activeTab === t.key ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Lead Preview Tab ──────────────────────────────────────────────── */}
        {activeTab === "preview" && (
          <div>
            <AnalyticsBar leads={leads} />

            {/* Filter bar */}
            <div className="flex items-center gap-2 mb-3">
              <Filter size={13} className="text-gray-500" />
              {(["all", "hot", "warm", "cold"] as FilterTier[]).map((tier) => {
                const icons: Record<FilterTier, React.ReactNode> = {
                  all:  null,
                  hot:  <Flame size={11} />,
                  warm: <Thermometer size={11} />,
                  cold: <Snowflake size={11} />,
                };
                const styles: Record<FilterTier, string> = {
                  all:  filterTier === "all"  ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white",
                  hot:  filterTier === "hot"  ? "bg-emerald-500 bg-opacity-30 text-emerald-300" : "text-gray-400 hover:text-emerald-300",
                  warm: filterTier === "warm" ? "bg-amber-500 bg-opacity-30 text-amber-300"   : "text-gray-400 hover:text-amber-300",
                  cold: filterTier === "cold" ? "bg-red-500 bg-opacity-30 text-red-300"       : "text-gray-400 hover:text-red-300",
                };
                return (
                  <button
                    key={tier}
                    onClick={() => setFilterTier(tier)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors capitalize ${styles[tier]}`}
                  >
                    {icons[tier]}
                    {tier === "all" ? "All" : tier.charAt(0).toUpperCase() + tier.slice(1)}
                    {tier !== "all" && (
                      <span className="opacity-60">
                        ({tier === "hot" ? leads.filter(l => l.lead_score >= 80).length
                          : tier === "warm" ? leads.filter(l => l.lead_score >= 60 && l.lead_score < 80).length
                          : leads.filter(l => l.lead_score < 60).length})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                <span className="text-sm font-semibold">Command Center</span>
                <span className="text-xs text-gray-500">
                  {filteredLeads.length} of {leads.length} leads
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-800 bg-opacity-50 text-gray-400">
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Role</th>
                      <th className="px-3 py-2 text-left">Company</th>
                      <th className="px-3 py-2 text-left">Score</th>
                      <th className="px-3 py-2 text-left">Pain Point</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-t border-gray-800 border-opacity-50 hover:bg-gray-800 hover:bg-opacity-30 transition-colors cursor-pointer"
                        onClick={() => setDrawerLead(lead)}
                      >
                        <td className="px-3 py-2.5 text-white font-medium whitespace-nowrap">{lead.name}</td>
                        <td className="px-3 py-2.5 text-gray-400 whitespace-nowrap">{lead.role}</td>
                        <td className="px-3 py-2.5 text-gray-400 whitespace-nowrap">{lead.company}</td>
                        <td className="px-3 py-2.5"><ScoreBadge score={lead.lead_score} /></td>
                        <td className="px-3 py-2.5 text-gray-300 max-w-xs truncate">{lead.pain_point}</td>
                        <td
                          className="px-3 py-2.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <StatusSelect
                            id={lead.id}
                            value={lead.status}
                            onChange={handleStatusChange}
                          />
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-3 py-8 text-center text-gray-600 text-xs">
                          No leads in this tier yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-gray-800 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span>≥80 Hot</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span>60-79 Warm</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /><span>&lt;60 Cold</span></div>
                <span className="ml-auto">Click a row to preview messages →</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Pipeline Tab ──────────────────────────────────────────────────── */}
        {activeTab === "pipeline" && (
          <div>
            <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
              {workflowNodes.map((node, i) => {
                const c = colorMap[node.color];
                return (
                  <React.Fragment key={node.id}>
                    <div className={`shrink-0 px-2.5 py-1.5 rounded-md text-xs font-medium ${c.bg} bg-opacity-40 ${c.text} border ${c.border} border-opacity-30 whitespace-nowrap`}>
                      {node.name.length > 18 ? node.name.substring(0, 18) + "…" : node.name}
                    </div>
                    {i < workflowNodes.length - 1 && (
                      <ArrowRight size={12} className="text-gray-600 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="space-y-2">
              {workflowNodes.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  expanded={expandedNode === node.id}
                  onToggle={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                />
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-800">
              <div className="text-xs font-semibold text-gray-400 mb-2">CONNECTION MAP</div>
              <div className="space-y-1 text-xs font-mono text-gray-500">
                <div>Intake → <span className="text-violet-400">JoyceGPT</span> → <span className="text-amber-400">Parse</span> → <span className="text-blue-400">Valid?</span></div>
                <div className="pl-4">├─ true → <span className="text-emerald-400">Command Center</span></div>
                <div className="pl-4">└─ false → <span className="text-red-400">Error Log</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ── Sheet Schema Tab ───────────────────────────────────────────────── */}
        {activeTab === "sheets" && (
          <div className="space-y-4">
            {sheetTabs.map((tab) => {
              const c = colorMap[tab.color];
              return (
                <div key={tab.name} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                  <div className="flex items-center gap-2 p-3 border-b border-gray-800">
                    <div className={`w-3 h-3 rounded ${c.badge}`} />
                    <span className="text-sm font-semibold">{tab.name}</span>
                    <span className="text-xs text-gray-500">({tab.headers.length} columns)</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-800 bg-opacity-50">
                          {tab.headers.map((h) => (
                            <th key={h} className={`px-3 py-2 text-left font-mono ${c.text} whitespace-nowrap`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {tab.sampleRow.map((val, i) => (
                            <td key={i} className="px-3 py-2 text-gray-400 whitespace-nowrap max-w-xs truncate">{val}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── JSON Export Tab ────────────────────────────────────────────────── */}
        {activeTab === "json" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">n8n Workflow JSON — Copy and import directly</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-xs font-medium"
              >
                {copied ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 overflow-auto max-h-96">
              <pre className="text-xs font-mono text-gray-400 whitespace-pre-wrap leading-relaxed">
{`{
  "name": "PlatFormula.ONE - Lead Harvester v2",
  "nodes": [
    { "id": "trigger-intake", "name": "Batch Lead Intake (Sheet)", "type": "googleSheetsTrigger" },
    { "id": "llm-extract", "name": "JoyceGPT Extraction & Scoring", "type": "anthropic" },
    { "id": "code-parse", "name": "Parse & Validate Response", "type": "code" },
    { "id": "if-valid", "name": "Is Valid?", "type": "if" },
    { "id": "append-cmd", "name": "Append to Command Center", "type": "googleSheets" },
    { "id": "log-error", "name": "Log Parse Error", "type": "googleSheets" }
  ],
  "connections": {
    "Batch Lead Intake (Sheet)": [["JoyceGPT Extraction & Scoring"]],
    "JoyceGPT Extraction & Scoring": [["Parse & Validate Response"]],
    "Parse & Validate Response": [["Is Valid?"]],
    "Is Valid?": {
      "true": ["Append to Command Center"],
      "false": ["Log Parse Error"]
    }
  },
  "active": false
}`}
              </pre>
            </div>
            <div className="mt-3 p-3 bg-blue-900 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-300">
                  This is a simplified preview. The full deployable JSON with all node parameters was provided in the previous message. Use that version for import into n8n.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-600">
          <span>PlatFormula.ONE • Lead Harvester v2</span>
          <span>6 nodes • 5 connections • 3 sheet tabs</span>
        </div>
      </div>
    </div>
  );
}

// ─── Fallback seed data (shown when server is not running) ────────────────────

const FALLBACK_LEADS: ProcessedLead[] = [
  {
    id: "1", name: "Jane Doe", role: "VP Operations", company: "Acme Corp",
    lead_score: 82, pain_point: "Manual reporting bottleneck",
    inmail_draft: "Hi Jane, noticed your ops scaling work at Acme — teams in similar positions typically lose 10+ hrs/wk to manual reporting. Happy to share how we've helped ops leaders reclaim that time. Worth a quick chat?",
    email_framework: { hook: "Are your reports still manual?", insight: "Teams like yours save 12 hrs/wk on average", credibility: "Used by 3 Fortune 500 ops teams", cta: "15-min walkthrough this week?" },
    status: "Ready", processed_at: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: "2", name: "Marcus Chen", role: "Dir. Revenue Ops", company: "ScaleUp Inc",
    lead_score: 91, pain_point: "CRM data fragmentation",
    inmail_draft: "Hi Marcus, your recent post on CRM debt resonated — fragmented data is the silent killer of RevOps at your stage. We've mapped this exact problem for 3 companies at $20M ARR. Open to a 20-min deep-dive?",
    email_framework: { hook: "CRM fragmentation cost one RevOps team $1.2M last year", insight: "Unified pipeline data cuts forecast error by 40%", credibility: "Worked with ScaleUp's comp-set at Series B", cta: "30-min strategy call, no pitch — just diagnosis" },
    status: "Sent", processed_at: new Date(Date.now() - 7200_000).toISOString(),
  },
  {
    id: "3", name: "Sarah Kim", role: "Head of Growth", company: "NovaTech",
    lead_score: 67, pain_point: "Lead qualification inconsistency",
    inmail_draft: "Hi Sarah, noticed NovaTech is scaling its growth team — inconsistent lead scoring at that stage can bleed budget fast. We've helped similar teams cut wasted spend by 30%. Interested?",
    email_framework: { hook: "How consistent is your lead scoring right now?", insight: "Inconsistent qual costs growth teams $200K+ annually", credibility: "Backed by data from 50+ SaaS growth teams", cta: "Quick audit call this week?" },
    status: "Ready", processed_at: new Date(Date.now() - 1800_000).toISOString(),
  },
  {
    id: "4", name: "David Okafor", role: "COO", company: "BridgePoint",
    lead_score: 94, pain_point: "Cross-team visibility gaps",
    inmail_draft: "Hi David, COOs at BridgePoint's scale often cite visibility as the constraint — not headcount. We've built a command-layer that surfaces exactly where handoffs break down. 20 minutes to show you the dashboard?",
    email_framework: { hook: "Can you see every handoff in your pipeline in real time?", insight: "Visibility gaps delay deals by an avg of 8 days", credibility: "Deployed with 2 other fintech COOs this quarter", cta: "Demo this Thursday or Friday?" },
    status: "Meeting", processed_at: new Date(Date.now() - 14400_000).toISOString(),
  },
  {
    id: "5", name: "Emily Tran", role: "Sales Manager", company: "Vertex AI",
    lead_score: 45, pain_point: "Pipeline forecasting accuracy",
    inmail_draft: "Hi Emily, managing a sales team without reliable forecasts is like navigating without a map. We have a lightweight model that generates ±5% accurate forecasts in under an hour. Worth exploring?",
    email_framework: { hook: "How accurate is your current forecast?", insight: "Poor forecasting costs sales teams 2 deals/quarter on average", credibility: "Validated across 20+ sales teams", cta: "30-min forecast audit?" },
    status: "Ready", processed_at: new Date(Date.now() - 600_000).toISOString(),
  },
];
