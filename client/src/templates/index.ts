/**
 * PlatFormula.One — Page Format Templates
 *
 * Prismatic.io-inspired scalable file tree:
 *
 * templates/
 *   index.ts              ← registry (this file)
 *   shared/
 *     types.ts            ← shared template interfaces
 *     TemplateWrapper.tsx ← common layout shell
 *   chorus/
 *     index.tsx           ← ChorusTemplate (chorus.app design language)
 *     sections/           ← individual section components
 *   ravynex/
 *     index.tsx           ← RavynexTemplate (ravynex.com design language)
 *     sections/           ← individual section components
 *
 * To add a new template:
 *   1. Create a new folder under templates/
 *   2. Export a component matching the PageTemplate interface
 *   3. Register it in TEMPLATE_REGISTRY below
 */

export { ChorusTemplate } from "./chorus";
export { RavynexTemplate } from "./ravynex";

export const TEMPLATE_REGISTRY = [
  {
    id: "chorus",
    name: "Chorus — AI Workforce",
    description: "Dark, bold, product-led layout. Full-width hero, problem/solution sections, capability tabs, usage-based pricing.",
    component: "ChorusTemplate",
    tags: ["dark", "bold", "saas", "ai-agents", "product-led"],
  },
  {
    id: "ravynex",
    name: "Ravynex — Dashboard App",
    description: "Navy dark mode, data-dense dashboard layout. Sidebar nav, kanban pipeline, status badges, table views.",
    component: "RavynexTemplate",
    tags: ["dark", "navy", "dashboard", "data", "pipeline", "crm"],
  },
] as const;

export type TemplateId = typeof TEMPLATE_REGISTRY[number]["id"];
