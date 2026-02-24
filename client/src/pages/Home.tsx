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
import { FounderToolkit } from "@/components/FounderToolkit";

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Rocket, color: "blue" },
  { id: "resources", label: "Resources", icon: Database, color: "emerald" },
  { id: "builder", label: "Builder", icon: Wrench, color: "orange" },
  { id: "pitch", label: "Pitch Studio", icon: Mic, color: "blue" },
  { id: "tracking", label: "Tracking", icon: ListChecks, color: "teal" },
  { id: "community", label: "Community", icon: Users, color: "teal" },
  { id: "application", label: "Application Assistant", icon: FileText, color: "purple" },
  { id: "concept", label: "Concept Refinement", icon: Lightbulb, color: "purple" },
  { id: "toolkit", label: "Founder Toolkit", icon: Wrench, color: "orange" },
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
                <Button variant="ghost" size="icon" className="lg:hidden h-14 w-14">
                  <Menu className="h-10 w-10" />
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
                      const colorClasses = {
                        blue: isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-500/10 text-blue-400 hover:text-blue-300',
                        emerald: isActive ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300',
                        orange: isActive ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10 text-orange-400 hover:text-orange-300',
                        purple: isActive ? 'bg-purple-600 text-white' : 'hover:bg-purple-500/10 text-purple-400 hover:text-purple-300',
                        teal: isActive ? 'bg-teal-600 text-white' : 'hover:bg-teal-500/10 text-teal-400 hover:text-teal-300',
                      };
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${colorClasses[item.color as keyof typeof colorClasses]}`}
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
              const colorClasses = {
                blue: isActive ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10',
                emerald: isActive ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10',
                orange: isActive ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10',
                purple: isActive ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10',
                teal: isActive ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'text-teal-400 hover:text-teal-300 hover:bg-teal-500/10',
              };
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className={`gap-2 ${colorClasses[item.color as keyof typeof colorClasses]}`}
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
        {activeTab === "toolkit" && <FounderToolkit />}
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
                <p>
                  <a href="https://lnkd.in/gjMdVuAf" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
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
