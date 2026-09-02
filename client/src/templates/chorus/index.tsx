/**
 * ChorusTemplate
 * Design language inspired by chorus.app
 * — Pure black bg, coral CTAs, bold display type, product-led SaaS layout
 */
import { useState } from "react";
import { ArrowRight, CheckCircle2, Zap, Users, BarChart3, Headphones, DollarSign } from "lucide-react";
import type { PageTemplateProps } from "../shared/types";

const CORAL = "#E8705A";

const problems = [
  {
    icon: "🗺️",
    title: "Execution Gap",
    body: "Your roadmap is beautiful. Color-coded, prioritized, the works. Your team looked at it, said 'love this,' and went back to the 11 things they were already behind on.",
  },
  {
    icon: "🧠",
    title: "Coordination Lag",
    body: "The vision is in your head. It updates every day. There's no API for that. So your team is building on a cached version of your brain and the TTL expired 2 days ago.",
  },
  {
    icon: "🎲",
    title: "Optionality Crush",
    body: "You have 5 ideas for how to crack growth. You have the bandwidth to try one. So you pick, commit, and spend the next quarter hoping you guessed right.",
  },
];

const steps = [
  { n: "1", title: "Hire Your Agent", body: "Pick a role. Your agent gets a name, a profile, a workspace, and credentials. The whole thing takes under 60 seconds." },
  { n: "2", title: "Set a Goal, Not a Task List", body: "Tell it what you want done. Not how. It plans the work, picks the tools, and executes. You review the output." },
  { n: "3", title: "Let It Run", body: "Schedule recurring work. Monitor from the command center. Interrupt if you need to. Or don't — it's fine." },
];

const capabilities = [
  { icon: BarChart3, label: "Sales", body: "Your SDR agent researched 200 prospects, personalized 150 outreach emails, and booked 12 meetings. It did this on a Tuesday." },
  { icon: Zap,       label: "Marketing", body: "Your content agent drafted 8 posts, scheduled them across 3 platforms, and generated a performance report. You were asleep for most of this." },
  { icon: DollarSign, label: "Finance", body: "Your finance agent reconciled 3 months of transactions, flagged 7 anomalies, and had a cash flow forecast ready before your Monday standup." },
  { icon: Headphones, label: "Support", body: "Your support agent resolved 47 tickets while you were in a board meeting. Three got escalated. Zero customers churned." },
];

const pricingFeatures = [
  "Unlimited agents",
  "All integrations included",
  "Agent Studio access",
  "Workspace, Drive & Documents",
  "Priority support",
  "Scheduling & automation",
  "100K free credits included",
  "No credit card required to start",
];

export function ChorusTemplate({
  title = "Your AI Workforce. Ready Now.",
  subtitle = "Autonomous AI agents that join your org as real team members.",
  ctaLabel = "Get Started — It's Free",
  ctaUrl = "https://manus.im/invite",
  brandName = "PlatFormula.One",
}: PageTemplateProps) {
  const [activeCapability, setActiveCapability] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* ── Nav ───────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur">
        <span className="text-lg font-bold tracking-tight">{brandName}</span>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#problem" className="hover:text-white transition-colors">Problem</a>
          <a href="#how" className="hover:text-white transition-colors">How It Works</a>
          <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: CORAL }}
        >
          {ctaLabel}
        </a>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-16 gap-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight max-w-5xl">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl">{subtitle}</p>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-all hover:scale-105"
          style={{ backgroundColor: CORAL }}
        >
          {ctaLabel} <ArrowRight className="h-4 w-4" />
        </a>

        {/* Mock product UI */}
        <div className="w-full max-w-4xl mt-8 rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden shadow-2xl shadow-black/60">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-zinc-950">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-white/30">Agent Command Center</span>
          </div>
          <div className="grid grid-cols-4 gap-3 p-4">
            {["Manager Agent", "Social Media Agent", "Content Agent", "Ad Campaign Agent"].map((name, i) => (
              <div key={name} className="rounded-lg bg-zinc-800 border border-white/5 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: [CORAL, "#6366f1", "#10b981", "#f59e0b"][i] }}>
                    {name[0]}
                  </div>
                  <span className="text-xs font-medium truncate">{name}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-700 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${[75, 60, 45, 90][i]}%`, backgroundColor: [CORAL, "#6366f1", "#10b981", "#f59e0b"][i] }} />
                </div>
                <p className="text-[10px] text-white/40">3 tasks · running</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem ───────────────────────────────────────────── */}
      <section id="problem" className="px-6 py-20 max-w-6xl mx-auto">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Sound Familiar?</p>
        <h2 className="text-3xl md:text-5xl font-black text-center mb-12">Three things every founder knows too well.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map(({ icon, title, body }) => (
            <div key={title} className="rounded-2xl bg-zinc-900 border border-white/10 p-6 space-y-3 hover:border-white/20 transition-colors">
              <span className="text-3xl">{icon}</span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section id="how" className="px-6 py-20 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Our Process</p>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12">How It Works</h2>
          <div className="space-y-6">
            {steps.map(({ n, title, body }) => (
              <div key={n} className="flex gap-6 items-start p-6 rounded-2xl bg-zinc-900 border border-white/10">
                <span className="text-4xl font-black shrink-0" style={{ color: CORAL }}>{n}</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-white/60 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ──────────────────────────────────────── */}
      <section id="capabilities" className="px-6 py-20 max-w-6xl mx-auto">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Capabilities</p>
        <h2 className="text-3xl md:text-5xl font-black text-center mb-12">What Your AI Workforce Can Do</h2>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {capabilities.map(({ label }, i) => (
            <button
              key={label}
              onClick={() => setActiveCapability(i)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeCapability === i ? "text-white" : "bg-zinc-800 text-white/60 hover:text-white"}`}
              style={activeCapability === i ? { backgroundColor: CORAL } : {}}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl bg-zinc-900 border border-white/10 p-8 flex items-start gap-6">
          {(() => { const { icon: Icon, label, body } = capabilities[activeCapability]; return (
            <>
              <Icon className="h-10 w-10 shrink-0 mt-1" style={{ color: CORAL }} />
              <div>
                <h3 className="text-2xl font-bold mb-3">{label}</h3>
                <p className="text-white/60 text-lg leading-relaxed">{body}</p>
              </div>
            </>
          ); })()}
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section id="pricing" className="px-6 py-20 bg-zinc-950">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-black mb-4">Free to Start</h2>
          <p className="text-white/60 mb-10">$0 platform fee. Usage-based pricing. 100K free credits to start.</p>
          <div className="rounded-2xl bg-zinc-900 border border-white/10 p-8 text-left space-y-4">
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-black">$0</span>
              <span className="text-white/40 pb-2">platform fee</span>
            </div>
            <ul className="space-y-3">
              {pricingFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: CORAL }} />
                  <span className="text-white/80">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: CORAL }}
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────── */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 max-w-3xl mx-auto leading-tight">
          You could go post another job listing. Or you could build your team in the next 60 seconds.
        </h2>
        <p className="text-white/40 mb-8">For free.</p>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-10 py-5 rounded-full text-lg font-bold text-white transition-all hover:scale-105"
          style={{ backgroundColor: CORAL }}
        >
          {ctaLabel} <ArrowRight className="h-5 w-5" />
        </a>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <span className="font-bold text-white/60">{brandName}</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Get Started</a>
          </div>
          <span>© 2026 {brandName}. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
