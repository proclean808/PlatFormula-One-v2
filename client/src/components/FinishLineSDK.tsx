import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Rocket, Zap, Bot, Globe, Code, Smartphone, Users, Shield,
  ArrowRight, ExternalLink, Star, CheckCircle2, ChevronDown, ChevronUp,
} from "lucide-react";

export function FinishLineSDK() {
  const [showExpo, setShowExpo] = useState(false);

  const handleManusSignup = () => window.open("https://manus.im/invite", "_blank");
  const handleManusLogin  = () => window.open("https://manus.im", "_blank");

  return (
    <div className="space-y-10 pb-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
          <Bot className="h-4 w-4 text-blue-400" />
          <span className="text-blue-400 text-sm font-medium">FinishLine Build Suite — Powered by Manus AI</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Build Your App with Manus
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Manus is the AI agent that builds, deploys, and iterates on your product autonomously.
          Sign up, describe your idea, and ship — no code required.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8"
            onClick={handleManusSignup}
          >
            <Rocket className="h-5 w-5" />
            Create Your Manus Account
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 gap-2"
            onClick={handleManusLogin}
          >
            <ExternalLink className="h-4 w-4" />
            Sign In to Manus
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <button onClick={handleManusLogin} className="text-blue-400 hover:underline">
            Go to your workspace →
          </button>
        </p>
      </section>

      {/* ── Why Manus ────────────────────────────────────────────── */}
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {([
          { icon: Bot,      color: "blue",    title: "Autonomous AI Agent",    desc: "Manus doesn't just suggest — it executes. It writes code, runs tests, deploys, and fixes bugs on its own." },
          { icon: Globe,    color: "cyan",    title: "Full-Stack Web & Mobile", desc: "Build web apps, APIs, dashboards, and mobile-ready PWAs from a single conversation. Ship to production in minutes." },
          { icon: Zap,      color: "purple",  title: "Instant Deployment",      desc: "Every build gets a live URL the moment it's ready. Share with investors, users, or your team immediately." },
          { icon: Code,     color: "pink",    title: "Real Code You Own",       desc: "Manus generates clean, production-grade code in your repo. Export, fork, or extend it anytime." },
          { icon: Users,    color: "emerald", title: "Team Collaboration",      desc: "Invite co-founders and collaborators. Multiple agents can work in parallel on different parts of your product." },
          { icon: Shield,   color: "orange",  title: "Secure & Private",        desc: "Your code and data stay in your workspace. Enterprise-grade security with role-based access controls." },
        ] as const).map(({ icon: Icon, color, title, desc }) => {
          const border: Record<string, string> = {
            blue:    "border-blue-500/40 from-blue-500/10 to-blue-600/5 hover:border-blue-500/60",
            cyan:    "border-cyan-500/40 from-cyan-500/10 to-cyan-600/5 hover:border-cyan-500/60",
            purple:  "border-purple-500/40 from-purple-500/10 to-purple-600/5 hover:border-purple-500/60",
            pink:    "border-pink-500/40 from-pink-500/10 to-pink-600/5 hover:border-pink-500/60",
            emerald: "border-emerald-500/40 from-emerald-500/10 to-emerald-600/5 hover:border-emerald-500/60",
            orange:  "border-orange-500/40 from-orange-500/10 to-orange-600/5 hover:border-orange-500/60",
          };
          const ic: Record<string, string> = {
            blue: "text-blue-400", cyan: "text-cyan-400", purple: "text-purple-400",
            pink: "text-pink-400", emerald: "text-emerald-400", orange: "text-orange-400",
          };
          return (
            <Card key={title} className={`bg-gradient-to-br ${border[color]} backdrop-blur transition-all`}>
              <CardHeader>
                <Icon className={`h-10 w-10 mb-2 ${ic[color]}`} />
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-center">How to Get Started</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {([
            { step: "1", title: "Create Your Account",   desc: "Sign up at manus.im — free tier available. Your workspace is ready in seconds.", cta: "Sign Up Free" as const, action: handleManusSignup },
            { step: "2", title: "Describe Your Product", desc: "Tell Manus what you want to build. Be as specific or broad as you like — it asks clarifying questions.", cta: null, action: null },
            { step: "3", title: "Ship & Iterate",        desc: "Manus builds, deploys, and gives you a live URL. Iterate with natural language — no PRs, no config files.", cta: null, action: null },
          ]).map(({ step, title, desc, cta, action }) => (
            <div key={step} className="relative p-5 rounded-xl border border-border/50 bg-card/50 space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">{step}</span>
                <h3 className="font-semibold">{title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{desc}</p>
              {cta && action && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1" onClick={action}>
                  {cta} <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── What Manus Can Build ─────────────────────────────────── */}
      <section className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-bold">What Founders Are Building with Manus</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "SaaS dashboards & admin panels",
            "AI-powered chatbots & copilots",
            "Landing pages & waitlist sites",
            "Mobile-ready PWAs",
            "Internal tools & CRMs",
            "Data pipelines & analytics",
            "API backends & microservices",
            "Pitch deck generators",
            "Investor portals & cap tables",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ── Primary CTA ──────────────────────────────────────────── */}
      <section className="text-center space-y-4 py-8 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/5">
        <h2 className="text-3xl font-bold">Ready to Build?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Join thousands of founders using Manus to go from idea to live product.
          Create your account and start building today — it's free to get started.
        </p>
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-10"
          onClick={handleManusSignup}
        >
          <Rocket className="h-5 w-5" />
          Get Started with Manus — Free
        </Button>
        <p className="text-xs text-muted-foreground">
          No credit card required · Instant workspace · Deploy in minutes
        </p>
      </section>

      {/* ── Expo Secondary Option (collapsible) ──────────────────── */}
      <section className="rounded-xl border border-border/40 bg-card/30">
        <button
          type="button"
          onClick={() => setShowExpo(!showExpo)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-card/50 transition-colors rounded-xl"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-purple-400" />
            <div>
              <p className="font-semibold text-sm">Also Need Native iOS / Android?</p>
              <p className="text-xs text-muted-foreground">Use Expo as your React Native mobile build layer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-purple-500/40 text-purple-400">Alternative</Badge>
            {showExpo
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
        </button>

        {showExpo && (
          <div className="px-5 pb-5 space-y-4 border-t border-border/40 pt-4">
            <p className="text-sm text-muted-foreground">
              Expo is the leading React Native framework for building native iOS and Android apps from a single codebase.
              Use it alongside Manus when you need App Store / Play Store distribution.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Expo Go (Dev)", url: "https://expo.dev/go",                        desc: "Test on your phone instantly" },
                { label: "EAS Build",    url: "https://expo.dev/eas",                        desc: "CI/CD for React Native" },
                { label: "Expo Orbit",   url: "https://expo.dev/orbit",                      desc: "Simulator & device manager" },
                { label: "Expo Docs",    url: "https://docs.expo.dev/",                      desc: "Full documentation" },
              ].map(({ label, url, desc }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => window.open(url, "_blank")}
                  className="text-left p-3 rounded-lg border border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all"
                >
                  <p className="text-sm font-medium text-purple-300">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 gap-2"
              onClick={() => window.open("https://expo.dev/?hl=en-US", "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Go to Expo.dev
            </Button>
          </div>
        )}
      </section>

    </div>
  );
}
