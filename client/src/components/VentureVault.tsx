import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Shield, Users, Video, Mic, FileText, Zap } from "lucide-react";

export function VentureVault() {
  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
          <Lock className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-400">Venture Vault</span>
          <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">Coming Soon</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Venture Vault
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your secure, proprietary workspace. Store everything confidential, collaborate with vetted investors, 
          and deliver an immersive pitch experience that investors actually remember.
        </p>
      </section>

      {/* Core Features */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 mb-2">
              <Shield className="h-5 w-5" />
            </div>
            <CardTitle className="text-amber-400">Secure IP Storage</CardTitle>
            <CardDescription>
              End-to-end encrypted storage for your proprietary documents, code, designs, and research. 
              Your IP stays yours — fully locked, access-controlled, and auditable.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 mb-2">
              <Users className="h-5 w-5" />
            </div>
            <CardTitle className="text-orange-400">Investor Collaboration</CardTitle>
            <CardDescription>
              Invite vetted VCs and angel investors to interact directly with your pitch materials. 
              Controlled access, NDA-gated, with full activity tracking.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400 mb-2">
              <Video className="h-5 w-5" />
            </div>
            <CardTitle className="text-red-400">Power Pitch Deck</CardTitle>
            <CardDescription>
              Not a slide deck — an immersive experience. AI-generated video clips, graphics, and interactive 
              elements stitched together so investors understand your tech in seconds, not minutes.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-rose-500/30 bg-rose-500/5">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 mb-2">
              <Mic className="h-5 w-5" />
            </div>
            <CardTitle className="text-rose-400">Founder Avatar</CardTitle>
            <CardDescription>
              AI-generated avatar that looks and sounds like you — presents your pitch 24/7 to investors 
              in any timezone. One click connects them to the real you when they're ready to move forward.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400 mb-2">
              <FileText className="h-5 w-5" />
            </div>
            <CardTitle className="text-yellow-400">Data Room</CardTitle>
            <CardDescription>
              Structured, investor-ready data room with cap table, financials, legal docs, and due diligence 
              materials — organized automatically, always up to date.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-lime-500/30 bg-lime-500/5">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/10 text-lime-400 mb-2">
              <Zap className="h-5 w-5" />
            </div>
            <CardTitle className="text-lime-400">Investor Discovery Feed</CardTitle>
            <CardDescription>
              Like Product Hunt or Kickstarter — but for serious investors. Your venture gets surfaced to 
              matched VCs and angels based on stage, sector, and thesis alignment.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Access Gate */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 text-center">
        <CardContent className="py-12 space-y-4">
          <Lock className="h-12 w-12 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-bold text-amber-400">Vault Access — Studio Tier</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            The Venture Vault is available exclusively to Studio tier members. 
            Includes secure storage, investor collaboration tools, Power Pitch Deck generation, and Founder Avatar.
          </p>
          <p className="text-sm text-amber-400 font-medium">→ Upgrade to Studio to unlock</p>
        </CardContent>
      </Card>
    </div>
  );
}
