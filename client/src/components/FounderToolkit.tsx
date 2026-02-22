import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, DollarSign, TrendingUp, Scale, Code } from "lucide-react";

interface Tool {
  name: string;
  url: string;
  description: string;
  value: string;
  category: "financial" | "sales" | "legal" | "developer";
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
  }
};

export function FounderToolkit() {
  const categories: Tool["category"][] = ["financial", "sales", "developer", "legal"];

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
