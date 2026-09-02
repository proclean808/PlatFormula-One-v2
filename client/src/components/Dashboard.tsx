// Restoration style: retain the Racing-Control Founder Intelligence interface;
// preserve dark surfaces, multi-color workflow tiles, F1 anchors, and direct dashboard actions.
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket, Sparkles, TrendingUp, Lightbulb, BarChart3,
  Bot, Wrench, Mic, Database, ListChecks, ArrowRight,
  Zap, Shield, Users
} from "lucide-react";
import { DeadlineTracker } from "./DeadlineTracker";
import { SuccessMetrics } from "./SuccessMetrics";
import { Pricing } from "./Pricing";

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  return (
    <div className="space-y-16">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">The Founder Intelligence Platform</span>
        </div>

        {/* Title + Racing Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 md:gap-8">
            <img src="/manus-storage/15888_91746156.webp" alt="Formula 1 Racing" className="w-20 md:w-32 h-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
            <h1 className="text-3xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                PlatFormula.ONE
              </span>
            </h1>
            <img src="/manus-storage/15883_bb495f32.jpg" alt="Championship Trophy" className="w-20 md:w-28 h-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex justify-center">
            <img src="/manus-storage/15894_40b42506.jpg" alt="Formula 1 Car" className="w-28 md:w-40 h-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Every tool. Every accelerator. Every answer. <strong className="text-foreground">One platform.</strong>
          <br />
          <span className="text-base md:text-lg">
            Curated to <span className="text-blue-400 font-semibold">SOTA</span> ·{" "}
            <span className="text-purple-400 font-semibold">BIC</span> ·{" "}
            <span className="text-pink-400 font-semibold">BOB</span> standards.
            Powered by embedded multi-model AI.
          </span>
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Button
            size="lg"
            className="bg-violet-600 hover:bg-violet-700 text-white gap-2 text-base px-8"
            onClick={() => setActiveTab("toolkit")}
          >
            <Bot className="h-5 w-5" />
            Talk to JoyceGPT →
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 gap-2 text-base"
            onClick={() => setActiveTab("concept")}
          >
            <Lightbulb className="h-5 w-5" />
            Start with Your Concept
          </Button>
        </div>

        {/* JoyceGPT intro quote */}
        <div className="max-w-2xl mx-auto mt-4">
          <Card className="border-violet-500/30 bg-violet-500/5 text-left">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-violet-400 mb-1">JoyceGPT</p>
                  <p className="text-sm text-foreground/80 leading-relaxed italic">
                    "Hello. I'm JoyceGPT, your PlatFormula.ONE AI co-founder. Tell me about your startup idea —
                    what you're building, who it's for, and where you are right now.
                    I'll help you figure out exactly what you need and where to start."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── WHAT THIS IS ─────────────────────────────────────── */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">What PlatFormula.ONE Actually Is</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-red-400 text-lg">The Problem</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                The startup landscape is fractured. 50 builders, 50 AI tools, 50 accelerators — and no map.
                No-code fails 95% of the time. Founders waste months in trial and error before they build anything real.
                The bottleneck isn't the idea. <strong className="text-foreground/70">It's the infrastructure.</strong>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-blue-400 text-lg">The Solution</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Not a directory. Not a chatbot. An operating intelligence layer that learns your startup,
                understands your intent through real voice conversation, and assembles the exact stack you need
                from a curated universe of <strong className="text-foreground/70">SOTA, BIC, and BOB</strong> resources.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader>
              <CardTitle className="text-emerald-400 text-lg">The Delivery</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                What we build around you, we replicate and hand to you. 80% pre-built. Roadmap laid out.
                For solopreneurs, we operate as the co-founding team you don't have yet —
                <strong className="text-foreground/70"> technical, financial, strategic — persistent and always on.</strong>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* ── CURATION STANDARD ────────────────────────────────── */}
      <section className="max-w-3xl mx-auto">
        <Card className="border-primary/20 bg-primary/5 text-center">
          <CardContent className="py-8 space-y-4">
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 border text-sm px-4 py-1.5 font-semibold">
                SOTA — State of the Art
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 border text-sm px-4 py-1.5 font-semibold">
                BIC — Best in Class
              </Badge>
              <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/40 border text-sm px-4 py-1.5 font-semibold">
                BOB — Best of Breed
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Every resource, tool, and accelerator on this platform has been evaluated against three criteria.
              We don't list everything. <strong className="text-foreground">We list what works.</strong>
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── FOUNDER JOURNEY ──────────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">Your Founder Journey</h2>
          <p className="text-muted-foreground">Each step is a tab. Follow the sequence or jump where you need to.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { step: "01", label: "Concept", desc: "Sharpen your idea. ICP scoring, problem validation, competitor gaps.", tab: "concept", color: "purple", icon: Lightbulb },
            { step: "02", label: "Builder", desc: "Build your accelerator application with AI guidance and scoring.", tab: "builder", color: "orange", icon: Wrench },
            { step: "03", label: "Pitch Studio", desc: "Build, refine, and practice your pitch deck. Weak slide detection.", tab: "pitch", color: "pink", icon: Mic },
            { step: "04", label: "Resources", desc: "SOTA/BIC/BOB curated accelerators, VCs, tools, and dev platforms.", tab: "resources", color: "emerald", icon: Database },
            { step: "05", label: "Tracking", desc: "Track every application, deadline, and follow-up in one view.", tab: "tracking", color: "teal", icon: ListChecks },
            { step: "06", label: "JoyceGPT", desc: "Your AI co-founder. Always on. Holds context. Builds with you.", tab: "toolkit", color: "violet", icon: Bot },
          ].map(({ step, label, desc, tab, color, icon: Icon }) => {
            const colorMap: Record<string, string> = {
              purple: "border-purple-500/30 bg-purple-500/5 text-purple-400",
              orange: "border-orange-500/30 bg-orange-500/5 text-orange-400",
              pink:   "border-pink-500/30 bg-pink-500/5 text-pink-400",
              emerald:"border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
              teal:   "border-teal-500/30 bg-teal-500/5 text-teal-400",
              violet: "border-violet-500/30 bg-violet-500/5 text-violet-400",
            };
            return (
              <Card
                key={tab}
                className={`cursor-pointer hover:scale-[1.02] transition-transform ${colorMap[color]}`}
                onClick={() => setActiveTab(tab)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono opacity-50">{step}</span>
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">{label}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">{desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-xs opacity-60 flex items-center gap-1">
                    Open <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── STATS / DEADLINE / METRICS ───────────────────────── */}
      <section>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-5xl mx-auto">
          <Card
            className="border-emerald-500/30 bg-emerald-500/5 flex-1 min-w-[240px] cursor-pointer hover:bg-emerald-500/10 transition-colors"
            onClick={() => setActiveTab("toolkit")}
          >
            <CardContent className="pt-4 pb-4 text-center space-y-1">
              <p className="text-sm text-muted-foreground">Total Toolkit Value</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">$150K+</p>
              <p className="text-xs text-muted-foreground">in credits, bonuses & deals</p>
              <p className="text-xs text-emerald-400 mt-2">→ View Founder Toolkit</p>
            </CardContent>
          </Card>
          <Card
            className="border-orange-500/30 bg-orange-500/5 flex-1 min-w-[240px] cursor-pointer hover:bg-orange-500/10 transition-colors"
            onClick={() => window.open('https://www.ycombinator.com/apply', '_blank')}
          >
            <CardContent className="pt-4 pb-4 text-center space-y-1">
              <p className="text-sm text-muted-foreground">Next YC Deadline</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">May 4</p>
              <p className="text-xs text-muted-foreground">S26 Deadline: May 4, 2026</p>
              <p className="text-xs text-orange-400 mt-2">→ Apply to Y Combinator</p>
            </CardContent>
          </Card>
          <Card
            className="border-blue-500/30 bg-blue-500/5 flex-1 min-w-[240px] cursor-pointer hover:bg-blue-500/10 transition-colors"
            onClick={() => window.open('https://www.f6s.com/programs?type[]=short_event&sort=closest&sort_dir=desc', '_blank')}
          >
            <CardContent className="pt-4 pb-4 text-center space-y-1">
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">Find Now</p>
              <p className="text-xs text-muted-foreground">hackathons, pitch events & networking</p>
              <p className="text-xs text-blue-400 mt-2">→ Browse F6S Events</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── ELITE ACCELERATOR PROGRAMS ───────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Elite Accelerator Programs</h2>
          <p className="text-muted-foreground">Top-tier programs — highest funding, strongest networks, SOTA selection.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "a16z Speedrun", color: "purple", deal: "Up to $1M + 600-person operator network", desc: "Tech, gaming, and AI accelerator with direct access to Andreessen Horowitz's network and $5M+ in partner credits.", url: "https://a16z.com/speedrun/", cta: "Apply to Speedrun →" },
            { name: "Accel Atoms", color: "blue", deal: "Up to $2M co-investment with Google", desc: "AI Cohort 2026 with Google AI Futures Fund. Early access to DeepMind models and advanced compute infrastructure.", url: "https://www.accel.com/programs/atoms", cta: "Apply to Atoms →" },
            { name: "Y Combinator", color: "orange", deal: "$500K + $500K in ecosystem deals", desc: "World's most successful accelerator. Start with Startup School to unlock deals, then apply for the next batch.", url: "https://www.startupschool.org", cta: "Start with Startup School →" },
            { name: "Berkeley SkyDeck", color: "emerald", deal: "$810K in startup perks + UC Berkeley network", desc: "Innovation Partner Program provides institutional credibility and access to UC Berkeley advisors.", url: "https://skydeck.berkeley.edu/innovation-partner-program/", cta: "Apply to SkyDeck →" },
            { name: "Pear VC PearX", color: "pink", deal: "$250K–$2M + 90% raise follow-on rate", desc: "Exclusive 12-week pre-seed accelerator. 90% of teams raise follow-on. Dedicated recruiting, sales, and fundraising support.", url: "https://pear.vc/pearx/", cta: "Apply to PearX →" },
            { name: "Alchemy for Startups", color: "cyan", deal: "$10K in credits + VIP support", desc: "Web3 and AI infrastructure for building high-scale APIs. Dedicated support for founders building the future.", url: "https://www.alchemy.com/partners", cta: "Get Alchemy Credits →" },
          ].map(({ name, color, deal, desc, url, cta }) => {
            const c: Record<string, string> = {
              purple: "border-purple-500/50 from-purple-500/10 to-purple-600/5 hover:border-purple-500/70 hover:shadow-purple-500/20 text-purple-400 bg-purple-600 hover:bg-purple-700",
              blue:   "border-blue-500/50 from-blue-500/10 to-blue-600/5 hover:border-blue-500/70 hover:shadow-blue-500/20 text-blue-400 bg-blue-600 hover:bg-blue-700",
              orange: "border-orange-500/50 from-orange-500/10 to-orange-600/5 hover:border-orange-500/70 hover:shadow-orange-500/20 text-orange-400 bg-orange-600 hover:bg-orange-700",
              emerald:"border-emerald-500/50 from-emerald-500/10 to-emerald-600/5 hover:border-emerald-500/70 hover:shadow-emerald-500/20 text-emerald-400 bg-emerald-600 hover:bg-emerald-700",
              pink:   "border-pink-500/50 from-pink-500/10 to-pink-600/5 hover:border-pink-500/70 hover:shadow-pink-500/20 text-pink-400 bg-pink-600 hover:bg-pink-700",
              cyan:   "border-cyan-500/50 from-cyan-500/10 to-cyan-600/5 hover:border-cyan-500/70 hover:shadow-cyan-500/20 text-cyan-400 bg-cyan-600 hover:bg-cyan-700",
            };
            const parts = c[color].split(" ");
            return (
              <Card key={name} className={`${parts[0]} bg-gradient-to-br ${parts[1]} ${parts[2]} backdrop-blur ${parts[3]} transition-all hover:shadow-lg ${parts[4]} min-h-[260px] flex flex-col`}>
                <CardHeader>
                  <CardTitle className={`text-xl ${parts[5]}`}>{name}</CardTitle>
                  <CardDescription>{deal}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col justify-end">
                  <p className="text-sm text-muted-foreground">{desc}</p>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Button className={`w-full ${parts[6]} ${parts[7]} text-white`}>{cta}</Button>
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="text-center">
          <Button variant="outline" className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10" onClick={() => setActiveTab("resources")}>
            View All 35+ Accelerator Programs →
          </Button>
        </div>
      </section>

      {/* ── DEADLINE TRACKER ─────────────────────────────────── */}
      <section>
        <DeadlineTracker />
      </section>

      {/* ── SUCCESS METRICS ──────────────────────────────────── */}
      <section>
        <SuccessMetrics />
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <Pricing />

    </div>
  );
}
