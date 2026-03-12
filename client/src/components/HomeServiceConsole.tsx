import { useState, useEffect, useRef, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Phone, Zap, Clock, UserCheck, AlertTriangle, CheckCircle,
  TrendingUp, Radio, RefreshCw, Send, ChevronRight, Wrench
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────

interface Lead {
  lead_id: string;
  channel: string;
  contact: string;
  address: string;
  raw_input: string;
  qualification_score: number;
  tier: "hot" | "warm" | "cold";
  urgency: "emergency" | "routine" | "estimate";
  job_type: string;
  system_type: string;
  dispatch_status: "pending" | "dispatched" | "nurture" | "disqualified";
  technician?: string;
  eta_minutes?: number;
  followup_step: string;
  created_at: number;
}

interface Stats {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  dispatched: number;
  disqualified: number;
  book_rate: number;
  technicians_available: number;
  channels: Record<string, number>;
}

interface Technician {
  id: string;
  name: string;
  zone: string;
  busy: boolean;
  rating: number;
}

// ── Constants ─────────────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  hot: "#ef4444",
  warm: "#f97316",
  cold: "#3b82f6",
};

const URGENCY_COLORS: Record<string, string> = {
  emergency: "#ef4444",
  routine: "#22c55e",
  estimate: "#94a3b8",
};

const CHANNEL_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

const SAMPLE_INPUTS = [
  { channel: "phone",     contact: "Maria Santos",  address: "4821 Oak Creek Dr, Austin TX", raw_input: "My AC stopped completely. It's 95 degrees and I have a newborn at home. Need someone TODAY." },
  { channel: "angi",      contact: "Dave Kim",      address: "1102 Maple Ave, Austin TX",    raw_input: "Looking for the cheapest quote to replace my old furnace. Just comparing prices." },
  { channel: "google_ads",contact: "Jennifer Walsh", address: "9203 Sunset Blvd, Austin TX", raw_input: "Heat pump making loud grinding noise, house not warming up like it should." },
  { channel: "website",   contact: "Robert Chen",   address: "3314 Pecan St, Austin TX",     raw_input: "Need annual AC maintenance before summer. Central air, 5 years old. Homeowner." },
  { channel: "thumbtack", contact: "Priya Mehta",   address: "6718 Congress Ave, Austin TX", raw_input: "Gas smell near furnace. House smells like rotten eggs. Is this an emergency?" },
];

// ── Sub-components ────────────────────────────────────────────────────────

function KPICard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string | number; sub?: string;
  color: string; icon: React.ElementType;
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 flex items-start gap-3 border border-gray-700">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-gray-400 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = { hot: "bg-red-900 text-red-300", warm: "bg-orange-900 text-orange-300", cold: "bg-blue-900 text-blue-300" };
  return <span className={`text-xs px-2 py-0.5 rounded font-semibold ${colors[tier] ?? "bg-gray-700 text-gray-300"}`}>{tier.toUpperCase()}</span>;
}

function UrgencyBadge({ urgency }: { urgency: string }) {
  const colors: Record<string, string> = { emergency: "bg-red-500 text-white", routine: "bg-green-800 text-green-300", estimate: "bg-gray-700 text-gray-400" };
  return <span className={`text-xs px-2 py-0.5 rounded ${colors[urgency] ?? "bg-gray-700 text-gray-300"}`}>{urgency}</span>;
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = { dispatched: "bg-green-400", pending: "bg-yellow-400", nurture: "bg-blue-400", disqualified: "bg-gray-500" };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] ?? "bg-gray-400"}`} />;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-red-500" : score >= 45 ? "bg-orange-400" : "bg-blue-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-6 text-right">{score}</span>
    </div>
  );
}

// ── Pipeline Flow Panel ───────────────────────────────────────────────────

function PipelineFlow() {
  const stages = [
    { label: "Inbound",      icon: Phone,       color: "text-blue-400",   bg: "bg-blue-900/30" },
    { label: "Qualify",      icon: CheckCircle, color: "text-yellow-400", bg: "bg-yellow-900/30" },
    { label: "Intake",       icon: Wrench,      color: "text-orange-400", bg: "bg-orange-900/30" },
    { label: "Dispatch",     icon: UserCheck,   color: "text-green-400",  bg: "bg-green-900/30" },
    { label: "Follow-Up",    icon: Radio,       color: "text-purple-400", bg: "bg-purple-900/30" },
  ];
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">AI Pipeline Flow</div>
      <div className="flex items-center gap-1">
        {stages.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1 flex-1">
            <div className={`flex-1 ${s.bg} rounded-lg p-2 text-center`}>
              <s.icon size={14} className={`${s.color} mx-auto mb-1`} />
              <div className="text-xs text-gray-300 font-medium">{s.label}</div>
            </div>
            {i < stages.length - 1 && <ChevronRight size={12} className="text-gray-600 flex-shrink-0" />}
          </div>
        ))}
      </div>
      <div className="mt-2 text-center text-xs text-gray-500">
        QualifierDroid → HVACIntakeDroid → DispatchDroid → FollowUpDroid
      </div>
    </div>
  );
}

// ── Technician Fleet Panel ────────────────────────────────────────────────

function TechFleet({ technicians }: { technicians: Technician[] }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
        <Wrench size={12} /> Technician Fleet
      </div>
      <div className="space-y-2">
        {technicians.map(t => (
          <div key={t.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.busy ? "bg-red-400" : "bg-green-400"}`} />
              <span className="text-sm text-white">{t.name}</span>
              <span className="text-xs text-gray-500">{t.zone}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-yellow-400">★ {t.rating}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${t.busy ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}`}>
                {t.busy ? "On Job" : "Available"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Lead Intake Form ──────────────────────────────────────────────────────

function LeadIntakeForm({ onSubmit }: { onSubmit: () => void }) {
  const [form, setForm] = useState({ raw_input: "", channel: "website", contact: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ lead_id: string; tier: string; score: number; recommended_action: string } | null>(null);

  const fillSample = (idx: number) => {
    const s = SAMPLE_INPUTS[idx];
    setForm({ raw_input: s.raw_input, channel: s.channel, contact: s.contact, address: s.address });
  };

  const submit = async () => {
    if (!form.raw_input.trim()) return;
    setLoading(true);
    try {
      const r = await fetch("/api/homeservice/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      setLastResult(data);
      setForm({ raw_input: "", channel: "website", contact: "", address: "" });
      onSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
        <Send size={12} /> Ingest Lead
      </div>

      {/* Sample buttons */}
      <div className="flex flex-wrap gap-1 mb-3">
        {SAMPLE_INPUTS.map((s, i) => (
          <button key={i} onClick={() => fillSample(i)}
            className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors">
            {s.channel}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <select value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}
          className="bg-gray-700 text-gray-200 text-sm rounded px-2 py-1.5 border border-gray-600">
          {["phone","website","angi","yelp","google_ads","thumbtack"].map(c =>
            <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Contact name" value={form.contact}
          onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
          className="bg-gray-700 text-gray-200 text-sm rounded px-2 py-1.5 border border-gray-600 placeholder-gray-500" />
      </div>
      <input placeholder="Address" value={form.address}
        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
        className="w-full bg-gray-700 text-gray-200 text-sm rounded px-2 py-1.5 border border-gray-600 placeholder-gray-500 mb-2" />
      <textarea placeholder="Customer message or call transcript..." value={form.raw_input}
        onChange={e => setForm(f => ({ ...f, raw_input: e.target.value }))}
        rows={3}
        className="w-full bg-gray-700 text-gray-200 text-sm rounded px-2 py-1.5 border border-gray-600 placeholder-gray-500 mb-2 resize-none" />

      <button onClick={submit} disabled={loading || !form.raw_input.trim()}
        className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white text-sm font-semibold rounded py-1.5 transition-colors">
        {loading ? "Processing..." : "Submit Lead →"}
      </button>

      {lastResult && (
        <div className="mt-2 text-xs bg-gray-750 rounded p-2 border border-gray-700 space-y-0.5">
          <div className="text-gray-300">Lead <span className="text-white font-mono">{lastResult.lead_id}</span> ingested</div>
          <div className="flex gap-2">
            <TierBadge tier={lastResult.tier} />
            <span className="text-gray-400">Score: {lastResult.score}</span>
            <span className="text-gray-400">→ {lastResult.recommended_action}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Lead Table ────────────────────────────────────────────────────────────

function LeadTable({ leads, onDispatch }: { leads: Lead[]; onDispatch: (id: string) => void }) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="px-4 py-2 border-b border-gray-700 text-xs text-gray-400 font-semibold uppercase tracking-wider">
        Lead Pipeline ({leads.length})
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-750">
            <tr className="text-gray-500 border-b border-gray-700">
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Contact</th>
              <th className="px-3 py-2 text-left">Channel</th>
              <th className="px-3 py-2 text-left">System</th>
              <th className="px-3 py-2 text-left">Tier</th>
              <th className="px-3 py-2 text-left">Urgency</th>
              <th className="px-3 py-2 text-left">Score</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={9} className="px-3 py-6 text-center text-gray-600">No leads yet — submit one above</td></tr>
            )}
            {leads.map(l => (
              <tr key={l.lead_id} className="border-b border-gray-700/50 hover:bg-gray-750/50 transition-colors">
                <td className="px-3 py-2 font-mono text-gray-400">{l.lead_id}</td>
                <td className="px-3 py-2 text-gray-200">{l.contact}</td>
                <td className="px-3 py-2 text-gray-400">{l.channel}</td>
                <td className="px-3 py-2 text-gray-400">{l.system_type.replace("_", " ")}</td>
                <td className="px-3 py-2"><TierBadge tier={l.tier} /></td>
                <td className="px-3 py-2"><UrgencyBadge urgency={l.urgency} /></td>
                <td className="px-3 py-2 w-24"><ScoreBar score={l.qualification_score} /></td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={l.dispatch_status} />
                    <span className="text-gray-400">{l.dispatch_status}</span>
                    {l.technician && <span className="text-green-400 ml-1">→ {l.technician}</span>}
                    {l.eta_minutes && <span className="text-gray-500">({l.eta_minutes}m)</span>}
                  </div>
                </td>
                <td className="px-3 py-2">
                  {l.dispatch_status === "pending" && (
                    <button onClick={() => onDispatch(l.lead_id)}
                      className="text-xs px-2 py-0.5 bg-green-800 hover:bg-green-700 text-green-300 rounded transition-colors">
                      Dispatch
                    </button>
                  )}
                  {l.dispatch_status === "nurture" && (
                    <span className="text-blue-400 text-xs">{l.followup_step}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

export default function HomeServiceConsole() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [s, l, t] = await Promise.all([
        fetch("/api/homeservice/stats").then(r => r.json()),
        fetch("/api/homeservice/leads").then(r => r.json()),
        fetch("/api/homeservice/technicians").then(r => r.json()),
      ]);
      setStats(s);
      setLeads(l.leads ?? []);
      setTechnicians(t.technicians ?? []);
    } catch (_) { /* server not available */ }
  }, []);

  const refresh = async () => { setRefreshing(true); await fetchAll(); setRefreshing(false); };

  const dispatch = async (id: string) => {
    await fetch(`/api/homeservice/leads/${id}/dispatch`, { method: "POST" });
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
    pollRef.current = setInterval(fetchAll, 4000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchAll]);

  // Channel breakdown for pie chart
  const channelData = stats
    ? Object.entries(stats.channels).map(([name, value]) => ({ name, value }))
    : [];

  // Tier breakdown for bar chart
  const tierData = stats ? [
    { name: "Hot", leads: stats.hot, fill: "#ef4444" },
    { name: "Warm", leads: stats.warm, fill: "#f97316" },
    { name: "Cold", leads: stats.cold, fill: "#3b82f6" },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench size={20} className="text-orange-400" />
            HomeService AI Console
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Factory.ai vertical plugin · OnePath-equivalent CSR replacement pipeline
          </p>
        </div>
        <button onClick={refresh}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors">
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* KPI Bar */}
      {stats && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <KPICard label="Total Leads" value={stats.total} color="bg-indigo-600" icon={TrendingUp} />
          <KPICard label="Hot Leads" value={stats.hot} sub="book immediately" color="bg-red-600" icon={Zap} />
          <KPICard label="Dispatched" value={stats.dispatched} color="bg-green-700" icon={CheckCircle} />
          <KPICard label="Book Rate" value={`${stats.book_rate}%`} color="bg-orange-600" icon={UserCheck} />
          <KPICard label="Disqualified" value={stats.disqualified} color="bg-gray-600" icon={AlertTriangle} />
          <KPICard label="Techs Available" value={stats.technicians_available} color="bg-blue-600" icon={Clock} />
        </div>
      )}

      {/* Pipeline Flow */}
      <PipelineFlow />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left column */}
        <div className="space-y-4">
          <LeadIntakeForm onSubmit={fetchAll} />
          <TechFleet technicians={technicians} />
        </div>

        {/* Center column */}
        <div className="space-y-4">
          {/* Tier distribution */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Lead Tier Distribution</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={tierData} barCategoryGap="30%">
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", fontSize: 12 }} />
                <Bar dataKey="leads" radius={[4, 4, 0, 0]}>
                  {tierData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Channel pie */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Leads by Channel</div>
            {channelData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={channelData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                    {channelData.map((_, i) => <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[160px] flex items-center justify-center text-gray-600 text-sm">No data yet</div>
            )}
          </div>
        </div>

        {/* Right column — Architecture */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-3">
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Architecture Stack</div>
          <pre className="text-xs text-gray-400 font-mono leading-relaxed bg-gray-900 rounded-lg p-3 overflow-auto">
{`Inbound Channels
  ├ Phone (Twilio/Vapi)
  ├ Web forms
  ├ Chat
  ├ Angi / Yelp
  └ Google Ads
       │
       ▼
 QualifierDroid          ← llama3
  NLP scoring, territory
  tier: hot/warm/cold
       │
       ▼
 HVACIntakeDroid         ← mistral
  structured extraction
  urgency + system_type
       │
       ▼
 DispatchDroid           ← qwen2.5
  tech availability
  route optimization
       │
       ▼
 FollowUpDroid           ← mistral
  t0 / t24h / t72h / t7d
  SMS + email sequences
       │
       ▼
 CRM / ServiceTitan API`}
          </pre>
          <div className="text-xs text-gray-500 border-t border-gray-700 pt-2">
            <div className="font-semibold text-gray-400 mb-1">Factory.ai provides:</div>
            <ul className="space-y-0.5">
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />Ray actor lifecycle management</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />Chroma vector memory per droid</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />RouterDroid intelligent dispatch</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />Redis inter-agent messaging</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />GPU acceleration (OLLAMA_GPU)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lead table */}
      <LeadTable leads={leads} onDispatch={dispatch} />

    </div>
  );
}
