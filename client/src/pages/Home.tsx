import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Database, Wrench, Mic, ListChecks, Users, FileText, Lightbulb } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import Resources from "@/components/Resources";
import Builder from "@/components/Builder";
import PitchStudio from "@/components/PitchStudio";
import Tracking from "@/components/Tracking";
import Community from "@/components/Community";
import ApplicationAssistant from "@/components/ApplicationAssistant";
import ConceptRefinement from "@/components/ConceptRefinement";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PlatFormula.One</h1>
              <p className="text-xs text-muted-foreground">B2B SaaS AI Startup Accelerator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-8 bg-card/50 backdrop-blur">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Builder</span>
            </TabsTrigger>
            <TabsTrigger value="pitch" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Pitch Studio</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              <span className="hidden sm:inline">Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="application" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Application</span>
            </TabsTrigger>
            <TabsTrigger value="concept" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Concept</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard setActiveTab={setActiveTab} />
          </TabsContent>

          <TabsContent value="resources">
            <Resources />
          </TabsContent>

          <TabsContent value="builder">
            <Builder />
          </TabsContent>

          <TabsContent value="pitch">
            <PitchStudio />
          </TabsContent>

          <TabsContent value="tracking">
            <Tracking />
          </TabsContent>

          <TabsContent value="community">
            <Community />
          </TabsContent>

          <TabsContent value="application">
            <ApplicationAssistant />
          </TabsContent>

          <TabsContent value="concept">
            <ConceptRefinement />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur mt-12">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-4 text-primary">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <a href="mailto:Jonathan@Behrendterprizes.com" className="text-emerald-500 hover:underline">
                    Jonathan@Behrendterprizes.com
                  </a>
                </p>
                <p>
                  <a href="tel:+14156954604" className="text-emerald-500 hover:underline">
                    (415) 695-4604
                  </a>
                </p>
                <p>
                  <a 
                    href="https://linkedin.com/in/Jonathan-Behrendt" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-500 hover:underline"
                  >
                    LinkedIn Profile →
                  </a>
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">About</h3>
              <p className="text-sm text-muted-foreground">
                PlatFormula.One accelerates B2B SaaS AI startups with comprehensive resources, 
                tools, and connections to top accelerators and investors.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">Resources</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <a href="https://www.ycombinator.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
                    Y Combinator
                  </a>
                </p>
                <p>
                  <a href="https://500.co" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
                    500 Global
                  </a>
                </p>
                <p>
                  <a href="https://www.techstars.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
                    Techstars
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>© 2026 PlatFormula.One. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
