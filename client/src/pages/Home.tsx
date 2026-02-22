import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Rocket, Database, Wrench, Mic, ListChecks, Users, FileText, Lightbulb, Menu } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import Resources from "@/components/Resources";
import Builder from "@/components/Builder";
import PitchStudio from "@/components/PitchStudio";
import Tracking from "@/components/Tracking";
import Community from "@/components/Community";
import ApplicationAssistant from "@/components/ApplicationAssistant";
import ConceptRefinement from "@/components/ConceptRefinement";

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Rocket },
  { id: "resources", label: "Resources", icon: Database },
  { id: "builder", label: "Builder", icon: Wrench },
  { id: "pitch", label: "Pitch Studio", icon: Mic },
  { id: "tracking", label: "Tracking", icon: ListChecks },
  { id: "community", label: "Community", icon: Users },
  { id: "application", label: "Application Assistant", icon: FileText },
  { id: "concept", label: "Concept Refinement", icon: Lightbulb },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  const currentNav = navigationItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Rocket className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">PlatFormula.One</h2>
                        <p className="text-xs text-muted-foreground">AI Startup Accelerator</p>
                      </div>
                    </div>
                  </div>
                  <nav className="flex-1 p-4 space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <button 
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Rocket className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">PlatFormula.One</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">B2B SaaS AI Startup Accelerator</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Current Page Indicator (Mobile) */}
          <div className="lg:hidden flex items-center gap-2 text-sm font-medium">
            {currentNav && (
              <>
                <currentNav.icon className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline">{currentNav.label}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === "resources" && <Resources />}
        {activeTab === "builder" && <Builder />}
        {activeTab === "pitch" && <PitchStudio />}
        {activeTab === "tracking" && <Tracking />}
        {activeTab === "community" && <Community />}
        {activeTab === "application" && <ApplicationAssistant />}
        {activeTab === "concept" && <ConceptRefinement />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur mt-12">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-4 text-primary">Contact</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <a href="tel:415-695-4604" className="text-foreground hover:text-primary transition-colors">
                    415-695-4604
                  </a>
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <button onClick={() => setActiveTab("resources")} className="text-foreground hover:text-primary transition-colors">
                    Accelerator Resources
                  </button>
                </p>
                <p>
                  <button onClick={() => setActiveTab("application")} className="text-foreground hover:text-primary transition-colors">
                    Application Help
                  </button>
                </p>
                <p>
                  <button onClick={() => setActiveTab("concept")} className="text-foreground hover:text-primary transition-colors">
                    Brand Identity Tools
                  </button>
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">About</h3>
              <p className="text-sm text-foreground">
                PlatFormula.ONE connects B2B SaaS founders with accelerators, investors, and resources to accelerate their startup journey.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-foreground">
            <p>&copy; 2026 PlatFormula.One. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
