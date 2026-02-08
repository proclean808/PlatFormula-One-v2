import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Sparkles, TrendingUp, Users } from "lucide-react";

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
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setActiveTab("builder")}
          >
            <Rocket className="mr-2 h-5 w-5" />
            Start Building
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => setActiveTab("resources")}
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Explore Resources
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
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
              className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setActiveTab("resources")}
            >
              Explore Directory →
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
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
              className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setActiveTab("resources")}
            >
              View Database →
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
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
              className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setActiveTab("builder")}
            >
              Start Building →
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <Users className="h-6 w-6" />
            </div>
            <CardTitle>Pitch Studio</CardTitle>
            <CardDescription>
              Practice and perfect your pitch with AI-powered coaching and feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setActiveTab("pitch")}
            >
              Practice Pitch →
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <CardTitle>Application Tracking</CardTitle>
            <CardDescription>
              Track all your accelerator and investor applications in one organized dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setActiveTab("tracking")}
            >
              Track Progress →
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <Users className="h-6 w-6" />
            </div>
            <CardTitle>Founder Community</CardTitle>
            <CardDescription>
              Connect with fellow founders, share experiences, and grow together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setActiveTab("community")}
            >
              Join Community →
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="grid gap-6 md:grid-cols-4 py-12 border-y border-border/40">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">700+</div>
          <div className="text-sm text-muted-foreground mt-2">Accelerators</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">500+</div>
          <div className="text-sm text-muted-foreground mt-2">VC Firms</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">1000+</div>
          <div className="text-sm text-muted-foreground mt-2">Angel Investors</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">AI-Powered</div>
          <div className="text-sm text-muted-foreground mt-2">Matching</div>
        </div>
      </section>
    </div>
  );
}
