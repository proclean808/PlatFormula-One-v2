import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Eye, Layers, Sparkles, Lock } from "lucide-react";

export function VentureVision() {
  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30">
          <Eye className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-medium text-violet-400">Venture Vision Studio</span>
          <Badge variant="outline" className="text-xs border-violet-500/50 text-violet-400">Coming Soon</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Venture Vision
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          In-house venture builds and portfolio projects — curated, developed, and deployed by PlatFormula.ONE. 
          Founders can co-build, invest, or license from a growing library of 300+ concepts.
        </p>
      </section>

      {/* What This Is */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border-violet-500/30 bg-violet-500/5">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 mb-2">
              <Layers className="h-5 w-5" />
            </div>
            <CardTitle className="text-violet-400">In-House Builds</CardTitle>
            <CardDescription>
              300+ proprietary startup concepts — validated ideas with market research, technical specs, and go-to-market plans ready to execute.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 mb-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle className="text-purple-400">Co-Build Program</CardTitle>
            <CardDescription>
              Partner with PlatFormula.ONE to co-develop a venture. Bring your domain expertise — we bring the technical stack, AI infrastructure, and network.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-pink-500/30 bg-pink-500/5">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 mb-2">
              <Rocket className="h-5 w-5" />
            </div>
            <CardTitle className="text-pink-400">License & Launch</CardTitle>
            <CardDescription>
              License a fully-built concept and launch it as your own. White-label, rebrand, and go to market with a proven foundation — not a blank page.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Coming Soon Notice */}
      <Card className="border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-purple-500/5 text-center">
        <CardContent className="py-12 space-y-4">
          <Lock className="h-12 w-12 text-violet-400 mx-auto" />
          <h2 className="text-2xl font-bold text-violet-400">Portfolio Access — Members Only</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            The full Venture Vision portfolio is available to Pro and Studio tier members. 
            Sign up to get early access and first look at available co-build opportunities.
          </p>
          <p className="text-sm text-violet-400 font-medium">→ Upgrade to Pro or Studio to unlock</p>
        </CardContent>
      </Card>
    </div>
  );
}
