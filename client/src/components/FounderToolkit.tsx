import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, DollarSign, TrendingUp, Scale, Code, Cpu } from "lucide-react";

interface Tool {
  name: string;
  url: string;
  description: string;
  value: string;
  category: "financial" | "sales" | "legal" | "developer" | "ai_infrastructure";
}

const tools: Tool[] = [
  // Financial Infrastructure & Fintech
  { 
    name: "Deel", 
    url: "https://www.deel.com/partners/refer", 
    description: "Global payroll, compliance, and contractor management", 
    value: "$1,500 signup bonus",
    category: "financial" 
  },
  { 
    name: "Mercury", 
    url: "https://mercury.com/referrals", 
    description: "Banking built for startups with powerful financial tools", 
    value: "Up to $1,500 bonus",
    category: "financial" 
  },
  { 
    name: "Rho", 
    url: "https://www.rho.co/partners", 
    description: "Corporate cards, banking, and expense management", 
    value: "$500-$1,000 bonus",
    category: "financial" 
  },
  { 
    name: "Brex", 
    url: "https://www.brex.com/partners", 
    description: "Corporate cards and spend management for startups", 
    value: "High-value rewards",
    category: "financial" 
  },
  { 
    name: "Gusto", 
    url: "https://gusto.com/partners", 
    description: "Payroll, benefits, and HR for growing teams", 
    value: "$200-$500 per signup",
    category: "financial" 
  },
  
  // Sales, CRM & Scaling
  { 
    name: "HubSpot", 
    url: "https://www.hubspot.com/partners/affiliates", 
    description: "All-in-one CRM, marketing, and sales platform", 
    value: "30% recurring commission",
    category: "sales" 
  },
  { 
    name: "Monday.com", 
    url: "https://monday.com/p/partners/", 
    description: "Work OS for teams to run projects and workflows", 
    value: "25-100% first-year revenue",
    category: "sales" 
  },
  { 
    name: "Shopify", 
    url: "https://www.shopify.com/affiliates", 
    description: "E-commerce platform for online stores", 
    value: "Up to $150 per referral",
    category: "sales" 
  },
  { 
    name: "ActiveCampaign", 
    url: "https://www.activecampaign.com/partner", 
    description: "Email marketing automation and CRM", 
    value: "20-30% recurring lifetime",
    category: "sales" 
  },
  { 
    name: "Kinsta", 
    url: "https://kinsta.com/affiliates/", 
    description: "Premium managed WordPress and application hosting", 
    value: "$50-$500 + 10% recurring",
    category: "sales" 
  },
  { 
    name: "Mailmodo", 
    url: "https://mailmodo.com/affiliates", 
    description: "Interactive email marketing with AMP emails for higher engagement", 
    value: "20% recurring (up to $5K)",
    category: "sales" 
  },
  { 
    name: "Semrush", 
    url: "https://semrush.com/affiliate", 
    description: "SEO, content marketing, and competitive research platform", 
    value: "$200 per sale + trial bonuses",
    category: "sales" 
  },
  { 
    name: "Thinkific", 
    url: "https://thinkific.com/affiliates", 
    description: "Create and sell online courses for founder education and training", 
    value: "30% recurring (up to $1.7K)",
    category: "sales" 
  },
  
  // Legal & Equity
  { 
    name: "Firstbase.io", 
    url: "https://firstbase.io/referral-partner-program", 
    description: "Full-service incorporation with compliance, tax, and ongoing support", 
    value: "$100-$150 per incorporation",
    category: "legal" 
  },
  { 
    name: "Stripe Atlas", 
    url: "https://stripe.com/atlas", 
    description: "Incorporate your company and get banking, tax, and legal tools", 
    value: "$2,500 in credits",
    category: "legal" 
  },
  { 
    name: "Carta", 
    url: "https://carta.com/partners/", 
    description: "Cap table management and equity administration", 
    value: "Referral discounts",
    category: "legal" 
  },
  { 
    name: "Priori Legal", 
    url: "https://www.priorilegal.com/talent", 
    description: "On-demand legal services marketplace", 
    value: "Managed legal RFP",
    category: "legal" 
  },
  { 
    name: "Clerky", 
    url: "https://www.clerky.com/", 
    description: "Legal paperwork for startups (incorporation, fundraising)", 
    value: "Bundled bonuses",
    category: "legal" 
  },
  
  // AI Infrastructure Ecosystem
  // Tier 1: Infrastructure & Data Foundations
  { 
    name: "CoreWeave", 
    url: "https://www.coreweave.com/", 
    description: "High-performance GPU hyperscaler for massive AI workload scaling", 
    value: "Enterprise GPU clusters",
    category: "ai_infrastructure" 
  },
  { 
    name: "Snowflake", 
    url: "https://www.snowflake.com/", 
    description: "AI Data Cloud for governed, enterprise-grade data layers", 
    value: "Data platform",
    category: "ai_infrastructure" 
  },
  { 
    name: "Scale AI", 
    url: "https://scale.com/", 
    description: "The data engine providing RLHF and high-fidelity training datasets", 
    value: "Training data",
    category: "ai_infrastructure" 
  },
  { 
    name: "Together AI", 
    url: "https://www.together.ai/", 
    description: "AI-native cloud for fast inference, fine-tuning, & GPU clusters", 
    value: "AI cloud platform",
    category: "ai_infrastructure" 
  },
  { 
    name: "Fireworks AI", 
    url: "https://fireworks.ai/", 
    description: "High-speed generative AI inference platform for open-source & custom models", 
    value: "Fast inference",
    category: "ai_infrastructure" 
  },
  { 
    name: "Cohere", 
    url: "https://cohere.com/", 
    description: "Enterprise-focused AI platform specializing in RAG, multilingual models, and sovereign AI deployment", 
    value: "Enterprise AI",
    category: "ai_infrastructure" 
  },
  { 
    name: "Chamber", 
    url: "https://www.ycombinator.com/companies/chamber", 
    description: "(YC W26) Autopiloting AI infrastructure; optimizes GPU allocation & governance", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "Crusoe", 
    url: "https://crusoeenergy.com/", 
    description: "Sustainable HPC powered by stranded energy & methane reduction", 
    value: "Green computing",
    category: "ai_infrastructure" 
  },
  // Tier 2: Agentic Orchestration & Connectivity
  { 
    name: "Xpander.ai", 
    url: "https://xpander.ai/", 
    description: "Autonomous connectivity layer linking agents to enterprise APIs (Salesforce, AWS)", 
    value: "Agent connectivity",
    category: "ai_infrastructure" 
  },
  { 
    name: "Mem0", 
    url: "https://mem0.ai/", 
    description: "The memory layer; enables long-term personalization & context for AI agents", 
    value: "Agent memory",
    category: "ai_infrastructure" 
  },
  { 
    name: "VectorShift.ai", 
    url: "https://vectorshift.ai/", 
    description: "No-code IDE for orchestrating complex, multi-agent pipelines", 
    value: "No-code agents",
    category: "ai_infrastructure" 
  },
  { 
    name: "Blaxel.ai", 
    url: "https://blaxel.ai/", 
    description: "Global agentic infrastructure for high-speed, sandboxed execution", 
    value: "Agent execution",
    category: "ai_infrastructure" 
  },
  { 
    name: "Temporal", 
    url: "https://temporal.io/", 
    description: "Open-source durable execution platform for resilient, long-running workflows", 
    value: "Workflow engine",
    category: "ai_infrastructure" 
  },
  { 
    name: "Terminal Use", 
    url: "https://www.ycombinator.com/companies/terminal-use", 
    description: "(YC W26) CLI-first environment for agents to interact with filesystems securely", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  // Tier 3: Operational & Internal Automation
  { 
    name: "Serval", 
    url: "https://serval.ai/", 
    description: "AI-native ITSM that automates IT, HR, and Finance tickets into workflows", 
    value: "ITSM automation",
    category: "ai_infrastructure" 
  },
  { 
    name: "Devops.io", 
    url: "https://devops.io/", 
    description: "Agentic DevOps platform for autonomous CI/CD & infrastructure management", 
    value: "DevOps agents",
    category: "ai_infrastructure" 
  },
  { 
    name: "Oximy", 
    url: "https://www.ycombinator.com/companies/oximy", 
    description: "(YC W26) The system of record for governance and safety in enterprise AI usage", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "Mendral", 
    url: "https://www.ycombinator.com/companies/mendral", 
    description: "(YC W26) AI DevOps Engineer that autonomously diagnoses and fixes CI/CD failures", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "Canary AI", 
    url: "https://www.ycombinator.com/companies/canary-ai", 
    description: "(YC W26) The first AI QA engineer that understands codebases to catch broken user flows", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "FullSeam", 
    url: "https://www.ycombinator.com/companies/fullseam", 
    description: "(YC W26) AI employee for finance teams; automates AP/AR & reconciliation", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  // Tier 4: Strategic Vertical & Developer Tools
  { 
    name: "Cursor", 
    url: "https://cursor.sh/", 
    description: "The premier AI-first code editor and 'vibe coding' standard (Anysphere)", 
    value: "AI code editor",
    category: "ai_infrastructure" 
  },
  { 
    name: "Devin", 
    url: "https://www.cognition-labs.com/", 
    description: "The world's first autonomous AI software engineer (Cognition AI)", 
    value: "AI engineer",
    category: "ai_infrastructure" 
  },
  { 
    name: "Lovable.dev", 
    url: "https://lovable.dev/", 
    description: "Natural language-to-web app generation (full-stack co-engineer)", 
    value: "AI web builder",
    category: "ai_infrastructure" 
  },
  { 
    name: "Jinba", 
    url: "https://www.ycombinator.com/companies/jinba", 
    description: "(YC W26) Enterprise chat-to-workflow automation; 'vibe coding' for non-technical teams", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "Stilta", 
    url: "https://www.ycombinator.com/companies/stilta", 
    description: "(YC W26) Specialized AI for patent practitioners and intellectual property defense", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "Fed10", 
    url: "https://www.ycombinator.com/companies/fed10", 
    description: "(YC W26) AI legislative consultants monitoring bills and policy threats in real-time", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "Fenrock AI", 
    url: "https://www.ycombinator.com/companies/fenrock-ai", 
    description: "(YC W26) AI agents for high-stakes Financial Crime Compliance & anti-money laundering", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "Rhizome AI", 
    url: "https://www.ycombinator.com/companies/rhizome-ai", 
    description: "(YC W26) Regulatory intelligence for healthcare compliance and FDA filings", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "Caretta", 
    url: "https://www.ycombinator.com/companies/caretta", 
    description: "(YC W26) Real-time Sales Intelligence that assists reps during live technical calls", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "BeeSafe AI", 
    url: "https://www.ycombinator.com/companies/beesafe-ai", 
    description: "(YC W26) Real-time scam prevention & fraud channel shutdown for B2B", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "Moda", 
    url: "https://www.ycombinator.com/companies/moda", 
    description: "(YC W26) 'Sentry for AI' that alerts on agent performance & intent drift", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "Traverse", 
    url: "https://www.ycombinator.com/companies/traverse", 
    description: "(YC W26) AI SRE for complex systems that finds & fixes production incidents", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  { 
    name: "Didit", 
    url: "https://www.ycombinator.com/companies/didit", 
    description: "(YC W26) Modular identity & verification layer built for the AI era", 
    value: "YC W26",
    category: "ai_infrastructure" 
  },
  
  // Developer & AI Tools
  { 
    name: "Pinecone", 
    url: "https://www.pinecone.io/partners/", 
    description: "Vector database for AI/ML applications and RAG systems", 
    value: "Qualified CPA via PartnerStack",
    category: "developer" 
  },
  { 
    name: "ElevenLabs", 
    url: "https://elevenlabs.io/affiliates", 
    description: "AI voice generation and text-to-speech platform", 
    value: "22% recurring (12 months)",
    category: "developer" 
  },
  { 
    name: "Writesonic", 
    url: "https://writesonic.com/affiliate", 
    description: "AI content generation and SEO automation platform", 
    value: "30% lifetime recurring",
    category: "developer" 
  },
  { 
    name: "Framer", 
    url: "https://www.framer.com/affiliates/", 
    description: "Professional website builder for startups and designers", 
    value: "50% commission (12 months)",
    category: "developer" 
  },
  { 
    name: "BlackBox AI", 
    url: "https://www.blackbox.ai/partners", 
    description: "AI coding assistant for developers", 
    value: "15% recurring (12 months)",
    category: "developer" 
  },
  { 
    name: "Cal.com", 
    url: "https://cal.com/partners", 
    description: "Open-source scheduling infrastructure for developers", 
    value: "Recurring seat-based payouts",
    category: "developer" 
  },
  { 
    name: "FreshBooks", 
    url: "https://www.freshbooks.com/affiliates", 
    description: "Accounting and invoicing for service-based startups", 
    value: "$10 per lead + $200 per sale",
    category: "developer" 
  },
  { 
    name: "Alchemy", 
    url: "https://www.alchemy.com/partners", 
    description: "Web3 and AI infrastructure for building high-scale APIs", 
    value: "Up to $10K in credits + VIP support",
    category: "developer" 
  },
  { 
    name: "LiveKit", 
    url: "https://livekit.io/", 
    description: "Real-time video, audio, and data infrastructure for developers", 
    value: "Open-source platform",
    category: "developer" 
  },
  { 
    name: "thirdweb", 
    url: "https://thirdweb.com/", 
    description: "Complete Web3 development platform with smart contracts and SDKs", 
    value: "Free tier + enterprise",
    category: "developer" 
  },
  { 
    name: "Lexica", 
    url: "https://lexica.art/", 
    description: "AI art search engine and Stable Diffusion image generator", 
    value: "AI art platform",
    category: "ai_infrastructure" 
  },
];

const getCategoryColor = (category: Tool["category"]) => {
  switch (category) {
    case "financial":
      return {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        text: "text-emerald-500",
        hover: "hover:border-emerald-500/50",
        icon: DollarSign
      };
    case "sales":
      return {
        border: "border-blue-500/30",
        bg: "bg-blue-500/10",
        text: "text-blue-500",
        hover: "hover:border-blue-500/50",
        icon: TrendingUp
      };
    case "legal":
      return {
        border: "border-purple-500/30",
        bg: "bg-purple-500/10",
        text: "text-purple-500",
        hover: "hover:border-purple-500/50",
        icon: Scale
      };
    case "developer":
      return {
        border: "border-orange-500/30",
        bg: "bg-orange-500/10",
        text: "text-orange-500",
        hover: "hover:border-orange-500/50",
        icon: Code
      };
    case "ai_infrastructure":
      return {
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/10",
        text: "text-cyan-500",
        hover: "hover:border-cyan-500/50",
        icon: Cpu
      };
  }
};

const getCategoryName = (category: Tool["category"]) => {
  switch (category) {
    case "financial":
      return "Financial Infrastructure";
    case "sales":
      return "Sales & Scaling";
    case "legal":
      return "Legal & Equity";
    case "developer":
      return "Developer & AI Tools";
    case "ai_infrastructure":
      return "AI Infrastructure Ecosystem";
  }
};

export function FounderToolkit() {
  const categories: Tool["category"][] = ["ai_infrastructure", "financial", "sales", "developer", "legal"];

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Founder Toolkit
        </h1>
        <p className="text-lg text-muted-foreground">
          Best-in-class tools to build, scale, and manage your startup. Zero fluff, only real value.
        </p>
      </div>

      {categories.map((category) => {
        const categoryTools = tools.filter((t) => t.category === category);
        const colors = getCategoryColor(category);
        const Icon = colors.icon;

        return (
          <section key={category} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
                <Icon className={`h-5 w-5 ${colors.text}`} />
              </div>
              <h2 className="text-2xl font-bold">{getCategoryName(category)}</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <Card
                  key={tool.name}
                  className={`${colors.border} bg-card/50 backdrop-blur ${colors.hover} transition-colors`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {tool.name}
                      <span className={`text-sm font-normal ${colors.text}`}>
                        {tool.value}
                      </span>
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-between ${colors.text} hover:${colors.text} ${colors.hover}`}
                      >
                        Learn More
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardHeader>
          <CardTitle className="text-orange-400">Partner Networks</CardTitle>
          <CardDescription>
            Manage multiple partner programs from a single dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href="https://www.partnerstack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full justify-between border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
              PartnerStack
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
          <a
            href="https://firstpromoter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full justify-between border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
              FirstPromoter
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
          <a
            href="https://impact.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full justify-between border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
              Impact.com
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
