import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Sparkles, TrendingUp, Users, Lightbulb, BarChart3 } from "lucide-react";

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
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            PlatFormula.One
          </span>
        </h1>
        
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
      </section>

      {/* Featured Platforms - LinkedIn & Product Hunt */}
      <section className="grid gap-6 md:grid-cols-2 mb-8">
        {/* LinkedIn & LinkedInGenius.ai */}
        <Card className="border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur hover:border-blue-500/70 transition-all hover:shadow-lg hover:shadow-blue-500/20">
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
        <Card className="border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur hover:border-orange-500/70 transition-all hover:shadow-lg hover:shadow-orange-500/20">
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
      </section>

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
