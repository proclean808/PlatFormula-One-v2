import { TrendingUp, Shield, Zap, Target, AlertTriangle, CheckCircle, BarChart2, Globe } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────

interface CompetitorRow {
  company: string;
  focus: string;
  layer: "vertical-app" | "crm" | "messaging" | "infrastructure";
  arr?: string;
  moat: "low" | "medium" | "high";
}

interface VectorScore {
  vector: string;
  status: string;
  score: number;
  color: string;
}

// ── Data ──────────────────────────────────────────────────────────────────

const COMPETITORS: CompetitorRow[] = [
  { company: "OnePath AI",     focus: "AI-first lead response + scheduling",  layer: "vertical-app",    moat: "medium" },
  { company: "ServiceTitan",   focus: "CRM + dispatch + field ops",            layer: "crm",             arr: "$500M+", moat: "high" },
  { company: "Podium",         focus: "Messaging automation + reviews",        layer: "messaging",       arr: "$200M+", moat: "medium" },
  { company: "Jobber",         focus: "Contractor job management",             layer: "vertical-app",    arr: "$100M+", moat: "medium" },
  { company: "Housecall Pro",  focus: "Scheduling + payments",                 layer: "vertical-app",    moat: "medium" },
  { company: "ServiceFusion",  focus: "CRM + field service",                   layer: "crm",             moat: "low" },
];

const EVALU8_VECTORS: VectorScore[] = [
  { vector: "Unit Economics",        status: "Positive if AI replaces CSRs",              score: 80, color: "bg-green-500" },
  { vector: "Data Moat",             status: "Moderate — call + booking datasets",        score: 55, color: "bg-yellow-500" },
  { vector: "Agent Autonomy",        status: "Medium — human-in-loop dispatch",           score: 60, color: "bg-yellow-500" },
  { vector: "Enterprise Integration",status: "Strong — ServiceTitan API",                 score: 85, color: "bg-green-500" },
  { vector: "Regulatory Resilience", status: "Strong — no regulated data",                score: 90, color: "bg-green-500" },
  { vector: "Compute Efficiency",    status: "High — thin inference layer",               score: 85, color: "bg-green-500" },
  { vector: "Value Capture",         status: "Strong — replaces $40k/yr CSR role",       score: 82, color: "bg-green-500" },
  { vector: "Exit Viability",        status: "High — strategic fit ServiceTitan/Podium",  score: 88, color: "bg-green-500" },
];

const LAYER_COLORS: Record<string, string> = {
  "vertical-app": "bg-orange-900 text-orange-300",
  "crm":          "bg-blue-900 text-blue-300",
  "messaging":    "bg-purple-900 text-purple-300",
  "infrastructure":"bg-green-900 text-green-300",
};

const MOAT_COLORS: Record<string, string> = {
  high:   "text-green-400",
  medium: "text-yellow-400",
  low:    "text-red-400",
};

// ── Sub-components ────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, color }: { icon: React.ElementType; title: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm font-semibold ${color} mb-3`}>
      <Icon size={14} />
      {title}
    </div>
  );
}

function StatCard({ value, label, sub, color }: { value: string; label: string; sub?: string; color: string }) {
  return (
    <div className={`bg-gray-800 rounded-xl p-4 border border-gray-700`}>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

export default function MarketIntel() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart2 size={20} className="text-cyan-400" />
          Market Intelligence — Home Services AI
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          OnePath AI decomposition · competitive landscape · T-MAX vs vertical positioning
        </p>
      </div>

      {/* Market size KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard value="$700B+" label="US Home Services TAM" color="text-cyan-400" />
        <StatCard value="30–40%" label="Leads lost to missed calls" color="text-red-400" sub="primary pain point" />
        <StatCard value="$300–1.5k" label="SaaS price / contractor / mo" color="text-green-400" />
        <StatCard value="$100M ARR" label="At 10k contractors" color="text-yellow-400" sub="unit economics positive" />
      </div>

      {/* Two column: competitor table + positioning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Competitor landscape */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <SectionHeader icon={Globe} title="Competitive Landscape" color="text-cyan-400" />
          </div>
          <table className="w-full text-xs">
            <thead className="bg-gray-750">
              <tr className="text-gray-500 border-b border-gray-700">
                <th className="px-3 py-2 text-left">Company</th>
                <th className="px-3 py-2 text-left">Focus</th>
                <th className="px-3 py-2 text-left">Layer</th>
                <th className="px-3 py-2 text-left">ARR</th>
                <th className="px-3 py-2 text-left">Moat</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map(c => (
                <tr key={c.company} className="border-b border-gray-700/50 hover:bg-gray-750/50">
                  <td className="px-3 py-2 font-semibold text-white">{c.company}</td>
                  <td className="px-3 py-2 text-gray-400">{c.focus}</td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${LAYER_COLORS[c.layer]}`}>
                      {c.layer}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-500">{c.arr ?? "—"}</td>
                  <td className={`px-3 py-2 font-semibold ${MOAT_COLORS[c.moat]}`}>{c.moat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* OnePath AI system architecture */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <SectionHeader icon={Target} title="OnePath AI — System Architecture" color="text-orange-400" />
          <pre className="text-xs text-gray-400 font-mono leading-relaxed bg-gray-900 rounded-lg p-3">
{`Inbound Channels
   ├ Phone  ├ Web forms
   ├ Chat   ├ Ads
   └ Marketplaces (Angi/Yelp/Thumbtack)
        │
        ▼
   AI Lead Router
        │
        ├ NLP intent detection
        ├ Lead scoring
        └ Appointment eligibility
        │
        ▼
   Scheduling Engine
        │
        ├ Technician availability
        ├ Territory routing
        └ Calendar booking
        │
        ▼
   CRM / ERP  (ServiceTitan)`}
          </pre>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {[
              { layer: "Conversational AI", fn: "handle calls/chat" },
              { layer: "Lead scoring",      fn: "determine job likelihood" },
              { layer: "Dispatch logic",    fn: "schedule technicians" },
              { layer: "CRM sync",          fn: "update customer records" },
            ].map(r => (
              <div key={r.layer} className="bg-gray-700/50 rounded p-2">
                <div className="text-gray-300 font-medium">{r.layer}</div>
                <div className="text-gray-500">{r.fn}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evalu8 vector analysis */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <SectionHeader icon={TrendingUp} title="Evalu8 Vector Analysis — OnePath AI" color="text-green-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EVALU8_VECTORS.map(v => (
            <div key={v.vector} className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-300 font-medium">{v.vector}</span>
                  <span className="text-xs text-gray-500">{v.score}/100</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-1">
                  <div className={`h-full ${v.color} transition-all`} style={{ width: `${v.score}%` }} />
                </div>
                <div className="text-xs text-gray-500">{v.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Positioning comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Strategic weakness */}
        <div className="bg-gray-800 rounded-xl p-4 border border-red-900/50">
          <SectionHeader icon={AlertTriangle} title="Strategic Weakness — OnePath" color="text-red-400" />
          <div className="space-y-2 text-xs text-gray-400">
            <p>Thin orchestration layer over commodity APIs. Replicable if no proprietary data moat.</p>
            <p className="font-semibold text-gray-300">Defensibility requires:</p>
            <ul className="space-y-1 ml-2">
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400" />Proprietary call datasets</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400" />Booking conversion training data</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400" />Dispatch optimization models</li>
            </ul>
          </div>
        </div>

        {/* OnePath position */}
        <div className="bg-gray-800 rounded-xl p-4 border border-orange-900/50">
          <SectionHeader icon={Target} title="OnePath Position" color="text-orange-400" />
          <pre className="text-xs text-gray-400 font-mono leading-relaxed bg-gray-900 rounded p-2">
{`Marketing Leads
       ↓
  OnePath AI
       ↓
CRM / Dispatch
       ↓
  Technician`}
          </pre>
          <p className="text-xs text-gray-500 mt-2">
            Not replacing CRMs — sitting on top of them as an AI-first intake layer.
            <br /><br />
            Classification: <span className="text-orange-400 font-semibold">vertical application</span>
          </p>
        </div>

        {/* T-MAX / Factory.ai position */}
        <div className="bg-gray-800 rounded-xl p-4 border border-green-900/50">
          <SectionHeader icon={CheckCircle} title="T-MAX / Factory.ai Position" color="text-green-400" />
          <pre className="text-xs text-gray-400 font-mono leading-relaxed bg-gray-900 rounded p-2">
{`        Agent OS
           ↓
      Agent Swarms
           ↓
   Workflow Automation
           ↓
  Vertical Plugins
  (HomeService, Finance,
   Legal, Healthcare…)`}
          </pre>
          <p className="text-xs text-gray-500 mt-2">
            OnePath is a <em>single plugin</em> on this stack.
            <br /><br />
            <span className="text-green-400 font-semibold">Infrastructure layer</span> — controls which models, tools, and workflows run the entire stack across all verticals.
          </p>
        </div>
      </div>

      {/* Key insight */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-indigo-900/30 rounded-xl p-5 border border-cyan-800/40">
        <div className="flex items-start gap-3">
          <Zap size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-cyan-300 mb-1">Strategic Insight</div>
            <p className="text-sm text-gray-300 leading-relaxed">
              The home-services AI sector validates a repeating pattern across industries:{" "}
              <strong className="text-white">AI replacing the first human interaction layer</strong> in sales development,
              customer support, intake, and scheduling.
            </p>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              OnePath is well-executed at the application layer. The long-term leverage point is the{" "}
              <strong className="text-cyan-400">agent orchestration infrastructure beneath it</strong> — the control layer
              that determines which models, tools, and workflows run the entire stack.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {["$700B TAM", "30–40% lead leakage", "CSR replacement → ROI", "ServiceTitan integration moat", "Platform play > vertical app"].map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-cyan-900/50 text-cyan-300 rounded">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up sequence reference */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <SectionHeader icon={Shield} title="Automated Follow-Up Sequence (FollowUpDroid)" color="text-purple-400" />
        <div className="flex flex-wrap gap-3">
          {[
            { step: "T+0h",  label: "Immediate confirmation",    desc: "Booked: confirmation · Unbooked: 'We received your request'" },
            { step: "T+24h", label: "Check-in + schedule offer", desc: "Unbooked leads — offer to book, soft urgency" },
            { step: "T+72h", label: "Estimate reminder",         desc: "'Your estimate is ready, book today and save 10%'" },
            { step: "T+7d",  label: "Final rescue",              desc: "'We still have availability this week'" },
          ].map(s => (
            <div key={s.step} className="flex-1 min-w-[160px] bg-gray-700/50 rounded-lg p-3">
              <div className="text-purple-400 font-bold text-sm">{s.step}</div>
              <div className="text-gray-300 text-xs font-medium mt-0.5">{s.label}</div>
              <div className="text-gray-500 text-xs mt-1">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
