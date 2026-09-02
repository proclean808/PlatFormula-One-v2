/**
 * RavynexTemplate
 * Design language inspired by ravynex.com
 * — Deep navy bg, blue accents, dashboard layout, data-dense, Bebas Neue headers
 */
import { useState } from "react";
import {
  Users, Briefcase, TrendingUp, Search, Bell, Settings,
  ChevronRight, BarChart2, CheckCircle, Clock, XCircle, ArrowUpRight,
} from "lucide-react";
import type { PageTemplateProps } from "../shared/types";

const NAVY_BG   = "#0a0f1e";
const NAVY_CARD = "#0d1526";
const NAVY_BORDER = "#1e3a8a33";
const BLUE_ACCENT = "#3b82f6";

const pipeline = [
  { name: "Sarah Chen",       role: "Senior Engineer",    stage: "Interview",  score: 94, status: "active"   },
  { name: "Marcus Williams",  role: "Product Manager",    stage: "Offer",      score: 88, status: "offer"    },
  { name: "Priya Patel",      role: "Data Scientist",     stage: "Hired",      score: 97, status: "hired"    },
  { name: "Jordan Lee",       role: "UX Designer",        stage: "Screening",  score: 79, status: "active"   },
  { name: "Alex Rivera",      role: "DevOps Engineer",    stage: "Rejected",   score: 52, status: "rejected" },
];

const statusStyle: Record<string, string> = {
  active:   "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
  offer:    "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  hired:    "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-400 border border-red-500/30",
};

const metrics = [
  { label: "Active Candidates", value: "247",  delta: "+12%", icon: Users,     color: BLUE_ACCENT },
  { label: "Open Positions",    value: "34",   delta: "+3",   icon: Briefcase, color: "#8b5cf6"   },
  { label: "Hired This Month",  value: "18",   delta: "+6",   icon: CheckCircle, color: "#10b981" },
  { label: "Avg. Time to Hire", value: "14d",  delta: "-2d",  icon: Clock,     color: "#f59e0b"   },
];

const sidebarItems = [
  { icon: BarChart2, label: "Dashboard",   active: true  },
  { icon: Users,     label: "Candidates",  active: false },
  { icon: Briefcase, label: "Positions",   active: false },
  { icon: TrendingUp,label: "Pipeline",    active: false },
  { icon: Search,    label: "Search",      active: false },
  { icon: Settings,  label: "Settings",    active: false },
];

export function RavynexTemplate({
  title = "Talent Intelligence Platform",
  subtitle = "AI-powered recruiting pipeline. Find, track, and hire top talent faster.",
  ctaLabel = "Start Free Trial",
  ctaUrl = "https://manus.im/invite",
  brandName = "PlatFormula.One",
}: PageTemplateProps) {
  const [activeRow, setActiveRow] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: NAVY_BG, fontFamily: "'Inter', sans-serif", color: "#e2e8f0" }}>

      {/* ── Top Nav ───────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: NAVY_BORDER, backgroundColor: NAVY_CARD }}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ backgroundColor: BLUE_ACCENT }}>
            {brandName[0]}
          </div>
          <span className="font-bold text-sm tracking-wide">{brandName}</span>
          <span className="hidden md:block text-xs px-2 py-0.5 rounded-full border ml-2" style={{ borderColor: BLUE_ACCENT + "55", color: BLUE_ACCENT }}>
            Recruiter
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search candidates..."
              className="pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
              style={{ backgroundColor: "#0a0f1e", border: `1px solid ${NAVY_BORDER}`, color: "#94a3b8", width: 220 }}
            />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Bell className="h-5 w-5 text-slate-400" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full" style={{ backgroundColor: BLUE_ACCENT }} />
          </button>
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: BLUE_ACCENT }}>
            JD
          </div>
        </div>
      </header>

      <div className="flex flex-1">

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-56 border-r py-6 px-3 gap-1 shrink-0" style={{ borderColor: NAVY_BORDER, backgroundColor: NAVY_CARD }}>
          {sidebarItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
              style={active
                ? { backgroundColor: BLUE_ACCENT + "22", color: BLUE_ACCENT }
                : { color: "#64748b" }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && <ChevronRight className="ml-auto h-3 w-3" />}
            </button>
          ))}
        </aside>

        {/* ── Main ────────────────────────────────────────────── */}
        <main className="flex-1 p-6 space-y-6 overflow-auto">

          {/* Page header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 1 }}>
                {title}
              </h1>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>{subtitle}</p>
            </div>
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BLUE_ACCENT }}
            >
              {ctaLabel} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map(({ label, value, delta, icon: Icon, color }) => (
              <div key={label} className="rounded-xl p-4 border space-y-3" style={{ backgroundColor: NAVY_CARD, borderColor: NAVY_BORDER }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: "#64748b" }}>{label}</span>
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "22" }}>
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{value}</span>
                  <span className="text-xs pb-0.5" style={{ color: delta.startsWith("-") && label !== "Avg. Time to Hire" ? "#ef4444" : "#10b981" }}>
                    {delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline table */}
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: NAVY_CARD, borderColor: NAVY_BORDER }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: NAVY_BORDER }}>
              <h2 className="font-bold text-sm">Active Pipeline</h2>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: BLUE_ACCENT + "22", color: BLUE_ACCENT }}>
                {pipeline.length} candidates
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider border-b" style={{ color: "#475569", borderColor: NAVY_BORDER }}>
                    <th className="text-left px-5 py-3 font-medium">Candidate</th>
                    <th className="text-left px-5 py-3 font-medium">Role</th>
                    <th className="text-left px-5 py-3 font-medium">Stage</th>
                    <th className="text-left px-5 py-3 font-medium">AI Score</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pipeline.map(({ name, role, stage, score, status }, i) => (
                    <tr
                      key={name}
                      onClick={() => setActiveRow(activeRow === i ? null : i)}
                      className="border-b cursor-pointer transition-colors"
                      style={{
                        borderColor: NAVY_BORDER,
                        backgroundColor: activeRow === i ? BLUE_ACCENT + "11" : "transparent",
                      }}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ backgroundColor: BLUE_ACCENT + "33", color: BLUE_ACCENT }}>
                            {name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="font-medium">{name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-400">{role}</td>
                      <td className="px-5 py-3 text-slate-400">{stage}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-slate-700 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444" }} />
                          </div>
                          <span className="text-xs font-mono">{score}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[status]}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA banner */}
          <div className="rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border"
            style={{ backgroundColor: BLUE_ACCENT + "11", borderColor: BLUE_ACCENT + "33" }}>
            <div>
              <h3 className="font-bold text-base">Ready to supercharge your hiring?</h3>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>Start free — no credit card required. 100K AI credits included.</p>
            </div>
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: BLUE_ACCENT }}
            >
              {ctaLabel} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

        </main>
      </div>
    </div>
  );
}
