/**
 * PageTemplates
 * Hosts the Chorus and Ravynex page format templates in the main nav.
 * Uses a tab switcher so users can preview both design languages.
 */
import { useState } from "react";
import { ChorusTemplate } from "@/templates/chorus";
import { RavynexTemplate } from "@/templates/ravynex";
import { TEMPLATE_REGISTRY } from "@/templates/index";
import { Layout, Maximize2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TemplateId = "chorus" | "ravynex";

export function PageTemplates() {
  const [active, setActive] = useState<TemplateId>("chorus");
  const [fullscreen, setFullscreen] = useState(false);

  const current = TEMPLATE_REGISTRY.find(t => t.id === active)!;

  return (
    <div className="space-y-4 pb-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Layout className="h-6 w-6 text-cyan-400" />
          <div>
            <h2 className="text-xl font-bold">Page Format Templates</h2>
            <p className="text-sm text-muted-foreground">
              Prismatic.io-inspired scalable template system. Pick a layout, customize, deploy.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
            onClick={() => setFullscreen(!fullscreen)}
          >
            <Maximize2 className="h-3.5 w-3.5" />
            {fullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          </Button>
        </div>
      </div>

      {/* Template Switcher */}
      <div className="flex flex-wrap gap-3">
        {TEMPLATE_REGISTRY.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id as TemplateId)}
            className={`flex flex-col items-start gap-1 p-4 rounded-xl border text-left transition-all w-full md:w-auto md:min-w-[260px] ${
              active === t.id
                ? "border-cyan-500/60 bg-cyan-500/10"
                : "border-border/50 bg-card/50 hover:border-border"
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <span className="font-semibold text-sm">{t.name}</span>
              {active === t.id && (
                <Badge variant="outline" className="ml-auto text-xs border-cyan-500/40 text-cyan-400">Active</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {t.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">{tag}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* File Tree Info */}
      <div className="rounded-xl border border-border/40 bg-card/30 p-4 text-xs font-mono text-muted-foreground space-y-1">
        <p className="text-foreground font-semibold mb-2 text-sm font-sans">📁 Prismatic.io-Inspired File Tree</p>
        <p>client/src/templates/</p>
        <p className="pl-4">├── index.ts &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← template registry</p>
        <p className="pl-4">├── shared/types.ts &nbsp;&nbsp;&nbsp;&nbsp;← shared interfaces</p>
        <p className="pl-4">├── chorus/index.tsx &nbsp;&nbsp;&nbsp;← Chorus template</p>
        <p className="pl-4">└── ravynex/index.tsx &nbsp;&nbsp;← Ravynex template</p>
        <p className="mt-2 text-[11px] text-muted-foreground/60">Add new templates by creating a folder + exporting from index.ts</p>
      </div>

      {/* Template Preview */}
      <div className={`rounded-xl border border-border/40 overflow-hidden ${fullscreen ? "fixed inset-0 z-50 rounded-none" : ""}`}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-card/80 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-muted-foreground ml-2">{current.name} — Live Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setFullscreen(!fullscreen)}
            >
              <Maximize2 className="h-3 w-3" />
              {fullscreen ? "Exit" : "Expand"}
            </Button>
          </div>
        </div>

        <div className={`overflow-auto ${fullscreen ? "h-[calc(100vh-40px)]" : "max-h-[700px]"}`}>
          {active === "chorus" && (
            <ChorusTemplate
              brandName="PlatFormula.One"
              title="Your AI Workforce. Ready Now."
              subtitle="Autonomous AI agents that join your org as real team members."
              ctaLabel="Get Started — It's Free"
              ctaUrl="https://manus.im/invite"
            />
          )}
          {active === "ravynex" && (
            <RavynexTemplate
              brandName="PlatFormula.One"
              title="Talent Intelligence Platform"
              subtitle="AI-powered recruiting pipeline. Find, track, and hire top talent faster."
              ctaLabel="Start Free Trial"
              ctaUrl="https://manus.im/invite"
            />
          )}
        </div>
      </div>

    </div>
  );
}
