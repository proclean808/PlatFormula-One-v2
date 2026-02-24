import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Sparkles, TrendingUp, Users, Lightbulb, BarChart3 } from "lucide-react";
import { DeadlineTracker } from "./DeadlineTracker";
import { SuccessMetrics } from "./SuccessMetrics";

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">AI-Powered Startup Acceleration</span>
        </div>
        
        {/* Racing Theme Images */}
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {/* Left Car - Speed Blur */}
          <img 
            src="/15888.webp" 
            alt="Formula 1 Racing" 
            className="w-32 md:w-48 h-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              PlatFormula.One
            </span>
          </h1>
          
          {/* Trophy */}
          <img 
            src="/15883.jpg" 
            alt="Championship Trophy" 
            className="w-24 md:w-32 h-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
          
          {/* Right Car - Studio Shot */}
          <img 
            src="/15894.jpg" 
            alt="Formula 1 Car" 
            className="w-32 md:w-48 h-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          The comprehensive AI-powered platform connecting B2B SaaS founders with accelerators, 
          investors, and resources to accelerate your startup journey.
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button 
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => setActiveTab("builder")}
          >
            <Rocket className="mr-2 h-5 w-5" />
            Start Building
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
            onClick={() => setActiveTab("resources")}
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Explore Resources
          </Button>
        </div>

        {/* Value & Deadline Stats */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 max-w-4xl mx-auto">
          <Card 
            className="border-emerald-500/30 bg-emerald-500/5 flex-1 min-w-[280px] cursor-pointer hover:bg-emerald-500/10 transition-colors"
            onClick={() => setActiveTab("toolkit")}
          >
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Total Toolkit Value</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  $150K+
                </p>
                <p className="text-xs text-muted-foreground">in credits, bonuses & deals</p>
                <p className="text-xs text-emerald-400 mt-2">→ View Founder Toolkit</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-orange-500/30 bg-orange-500/5 flex-1 min-w-[280px] cursor-pointer hover:bg-orange-500/10 transition-colors"
            onClick={() => window.open('https://www.ycombinator.com/apply', '_blank')}
          >
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Next YC Deadline</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  14 Days
                </p>
                <p className="text-xs text-muted-foreground">S26 Early Deadline: Mar 8, 2026</p>
                <p className="text-xs text-orange-400 mt-2">→ Apply to Y Combinator</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Killer Square - Elite Programs */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Elite Accelerator Programs</h2>
          <p className="text-muted-foreground">Top-tier programs offering the highest funding and network access</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* a16z Speedrun */}
          <Card className="border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur hover:border-purple-500/70 transition-all hover:shadow-lg hover:shadow-purple-500/20 min-h-[280px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-purple-400">a16z Speedrun</CardTitle>
              <CardDescription>Up to $1M + 600-person operator network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-end">
              <p className="text-sm text-muted-foreground">
                Tech, gaming, and AI accelerator with direct access to Andreessen Horowitz's extensive network and over $5M in partner credits.
              </p>
              <a href="https://a16z.com/speedrun/" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Apply to Speedrun →
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Accel Atoms */}
          <Card className="border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur hover:border-blue-500/70 transition-all hover:shadow-lg hover:shadow-blue-500/20 min-h-[280px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-blue-400">Accel Atoms</CardTitle>
              <CardDescription>Up to $2M co-investment with Google</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-end">
              <p className="text-sm text-muted-foreground">
                AI Cohort 2026 with Google AI Futures Fund. Early access to DeepMind models and advanced compute infrastructure.
              </p>
              <a href="https://www.accel.com/programs/atoms" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Apply to Atoms →
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Y Combinator */}
          <Card className="border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur hover:border-orange-500/70 transition-all hover:shadow-lg hover:shadow-orange-500/20 min-h-[280px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-orange-400">Y Combinator</CardTitle>
              <CardDescription>$500K + $500K in ecosystem deals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-end">
              <p className="text-sm text-muted-foreground">
                World's most successful accelerator. Start with Startup School to unlock deals, then apply for Spring 2026 batch.
              </p>
              <a href="https://www.startupschool.org" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Start with Startup School →
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Berkeley SkyDeck */}
          <Card className="border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur hover:border-emerald-500/70 transition-all hover:shadow-lg hover:shadow-emerald-500/20 min-h-[280px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-emerald-400">Berkeley SkyDeck</CardTitle>
              <CardDescription>$810K in startup perks + UC Berkeley network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-end">
              <p className="text-sm text-muted-foreground">
                Innovation Partner Program (IPP) provides institutional credibility and access to UC Berkeley advisors.
              </p>
              <a href="https://skydeck.berkeley.edu/innovation-partner-program/" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Apply to SkyDeck →
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Alchemy */}
          <Card className="border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur hover:border-cyan-500/70 transition-all hover:shadow-lg hover:shadow-cyan-500/20 min-h-[280px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-cyan-400">Alchemy for Startups</CardTitle>
              <CardDescription>$10K in credits + VIP support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-end">
              <p className="text-sm text-muted-foreground">
                Web3 and AI infrastructure for building high-scale APIs. Dedicated support for founders building the future.
              </p>
              <a href="https://www.alchemy.com/partners" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                  Get Alchemy Credits →
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* PearX */}
          <Card className="border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-pink-600/5 backdrop-blur hover:border-pink-500/70 transition-all hover:shadow-lg hover:shadow-pink-500/20 min-h-[280px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-pink-400">Pear VC PearX</CardTitle>
              <CardDescription>$250K-$2M + 90% raise follow-on funding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-end">
              <p className="text-sm text-muted-foreground">
                Exclusive 12-week pre-seed accelerator with ~20 team batches. 90% success rate with dedicated recruiting, sales, and fundraising support.
              </p>
              <a href="https://pear.vc/pearx/" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                  Apply to PearX →
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Platforms - LinkedIn, Product Hunt, Framer.ai & AngelList */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* LinkedIn & LinkedInGenius.ai */}
        <Card className="border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur hover:border-blue-500/70 transition-all hover:shadow-lg hover:shadow-blue-500/20 min-h-[380px] flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <img src="/linkedin-logo.png" alt="LinkedIn" className="h-16 w-16" />
              <div>
                <CardTitle className="text-2xl text-blue-400">LinkedIn Essential</CardTitle>
                <p className="text-sm text-muted-foreground">Critical for founder networking & credibility</p>
              </div>
            </div>
            <CardDescription className="text-base">
              Build your founder brand, connect with investors, and establish credibility. Enhanced by LinkedInGenius.ai for profile optimization, content generation, and growth strategies.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Go to LinkedIn →
              </Button>
            </a>
            <a 
              href="https://linkedingenius.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10">
                Optimize with LinkedInGenius.ai →
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Product Hunt */}
        <Card className="border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur hover:border-orange-500/70 transition-all hover:shadow-lg hover:shadow-orange-500/20 min-h-[380px] flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <img src="/product-hunt-logo.png" alt="Product Hunt" className="h-16 w-16" />
              <div>
                <CardTitle className="text-2xl text-orange-400">Launch on Product Hunt</CardTitle>
                <p className="text-sm text-muted-foreground">Get discovered by early adopters</p>
              </div>
            </div>
            <CardDescription className="text-base">
              Launch your product to a community of tech enthusiasts, early adopters, and investors. Get feedback, traction, and visibility for your startup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a 
              href="https://producthunt.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Launch on Product Hunt →
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Framer.ai */}
        <Card className="border-indigo-500/50 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 backdrop-blur hover:border-indigo-500/70 transition-all hover:shadow-lg hover:shadow-indigo-500/20 min-h-[380px] flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                F
              </div>
              <div>
                <CardTitle className="text-2xl text-indigo-400">Framer.ai</CardTitle>
                <p className="text-sm text-muted-foreground">AI-powered website builder</p>
              </div>
            </div>
            <CardDescription className="text-base">
              Build stunning, responsive websites in minutes with AI. No code required. Perfect for founders who need a professional web presence fast.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a 
              href="https://framer.com/ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Try Framer.ai →
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* AngelList */}
        <Card className="border-teal-500/50 bg-gradient-to-br from-teal-500/10 to-teal-600/5 backdrop-blur hover:border-teal-500/70 transition-all hover:shadow-lg hover:shadow-teal-500/20 min-h-[380px] flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-2xl">
                AL
              </div>
              <div>
                <CardTitle className="text-2xl text-teal-400">AngelList</CardTitle>
                <p className="text-sm text-muted-foreground">Fundraising & talent platform</p>
              </div>
            </div>
            <CardDescription className="text-base">
              Connect with 17K+ investors, raise through syndicates, and hire from 10M+ startup-ready candidates. $3.5B+ deployed through the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a 
              href="https://www.angellist.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Explore AngelList →
              </Button>
            </a>
            <a 
              href="https://wellfound.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full border-teal-500 text-teal-400 hover:bg-teal-500/10">
                Find Talent on Wellfound →
              </Button>
            </a>
          </CardContent>
        </Card>
      </section>

      {/* Deadline Tracker */}
      <DeadlineTracker />

      {/* Success Metrics */}
      <SuccessMetrics />

      {/* Features Grid - Color Coded - Reordered for visual balance */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* GREEN - Resources/Database */}
        <Card className="border-emerald-500/30 bg-card/50 backdrop-blur hover:border-emerald-500/50 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <CardTitle>AI-Powered Matching</CardTitle>
            <CardDescription>
              Get matched with the perfect accelerators and investors using advanced AI algorithms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
              onClick={() => setActiveTab("resources")}
            >
              Explore Directory →
            </Button>
          </CardContent>
        </Card>

        {/* PURPLE - AI Tools */}
        <Card className="border-purple-500/30 bg-card/50 backdrop-blur hover:border-purple-500/50 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 mb-4">
              <Lightbulb className="h-6 w-6" />
            </div>
            <CardTitle>Concept Refinement</CardTitle>
            <CardDescription>
              Generate brand names, taglines, and positioning with AI-powered tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-purple-500 hover:text-purple-400 hover:bg-purple-500/10"
              onClick={() => setActiveTab("concept")}
            >
              Refine Concept →
            </Button>
          </CardContent>
        </Card>

        {/* TEAL - Tracking */}
        <Card className="border-teal-500/30 bg-card/50 backdrop-blur hover:border-teal-500/50 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <CardTitle>Application Tracking</CardTitle>
            <CardDescription>
              Track all your accelerator and investor applications in one organized dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-teal-500 hover:text-teal-400 hover:bg-teal-500/10"
              onClick={() => setActiveTab("tracking")}
            >
              Track Progress →
            </Button>
          </CardContent>
        </Card>

        {/* GREEN - Database */}
        <Card className="border-emerald-500/30 bg-card/50 backdrop-blur hover:border-emerald-500/50 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <CardTitle>Comprehensive Database</CardTitle>
            <CardDescription>
              Access 700+ accelerators, top VC firms, and angel investors all in one platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
              onClick={() => setActiveTab("resources")}
            >
              View Database →
            </Button>
          </CardContent>
        </Card>

        {/* ORANGE - Builder Tools */}
        <Card className="border-orange-500/30 bg-card/50 backdrop-blur hover:border-orange-500/50 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 mb-4">
              <Rocket className="h-6 w-6" />
            </div>
            <CardTitle>Application Builder</CardTitle>
            <CardDescription>
              Build winning applications with our guided process and expert templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-orange-500 hover:text-orange-400 hover:bg-orange-500/10"
              onClick={() => setActiveTab("builder")}
            >
              Start Building →
            </Button>
          </CardContent>
        </Card>

        {/* PURPLE - Application Assistant */}
        <Card className="border-purple-500/30 bg-card/50 backdrop-blur hover:border-purple-500/50 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <CardTitle>Application Assistant</CardTitle>
            <CardDescription>
              Get AI-powered help crafting compelling accelerator applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-purple-500 hover:text-purple-400 hover:bg-purple-500/10"
              onClick={() => setActiveTab("application")}
            >
              Get Help →
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
