import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink } from "lucide-react";
import { useState } from "react";

interface Resource {
  name: string;
  url: string;
  description: string;
  category: "yc" | "techstars" | "accelerator" | "vc";
}

const resources: Resource[] = [
  // Y Combinator Resources
  { name: "YC Application", url: "https://www.ycombinator.com/apply", description: "Apply to Y Combinator's accelerator program", category: "yc" },
  { name: "Startup School", url: "https://www.startupschool.org", description: "Free online program for founders", category: "yc" },
  { name: "YC Startup Directory", url: "https://www.ycombinator.com/companies", description: "Browse YC-funded companies", category: "yc" },
  { name: "Hacker News", url: "https://news.ycombinator.com", description: "Tech and startup news community", category: "yc" },
  
  // Techstars
  { name: "Techstars", url: "https://www.techstars.com", description: "Global network providing investment and mentorship", category: "techstars" },
  
  // Accelerators
  { name: "500 Global", url: "https://500.co", description: "Global VC firm and accelerator for early-stage companies", category: "accelerator" },
  { name: "Alchemist Accelerator", url: "https://www.alchemistaccelerator.com", description: "Top program for seed-stage enterprise ventures", category: "accelerator" },
  { name: "Plug and Play", url: "https://www.plugandplaytechcenter.com", description: "Innovation platform connecting startups with corporations", category: "accelerator" },
  { name: "Berkeley SkyDeck", url: "https://skydeck.berkeley.edu", description: "UC Berkeley's official accelerator", category: "accelerator" },
  { name: "AngelPad", url: "https://angelpad.com", description: "Seed-stage accelerator with hands-on approach", category: "accelerator" },
  { name: "Founder Institute", url: "https://fi.co", description: "Global pre-seed accelerator", category: "accelerator" },
  { name: "HAX", url: "https://hax.co", description: "Venture firm focused on hard tech startups", category: "accelerator" },
  
  // VCs
  { name: "AngelList", url: "https://www.angellist.com", description: "Platform for connecting with angel investors", category: "vc" },
  { name: "Andreessen Horowitz (a16z)", url: "https://a16z.com", description: "Leading VC firm for seed to growth-stage companies", category: "vc" },
  { name: "Sequoia Capital", url: "https://www.sequoiacap.com", description: "One of the world's most influential VC firms", category: "vc" },
  { name: "Lightspeed Venture Partners", url: "https://lsvp.com", description: "Multi-stage VC focusing on enterprise and fintech", category: "vc" },
  { name: "Greylock", url: "https://greylock.com", description: "VC firm focused on enterprise software", category: "vc" },
  { name: "First Round Capital", url: "https://firstround.com", description: "Top-tier seed-stage firm", category: "vc" },
  { name: "Bessemer Venture Partners", url: "https://www.bvp.com", description: "Cross-stage investor in AI, cloud, and healthcare", category: "vc" },
  { name: "Founders Fund", url: "https://foundersfund.com", description: "SF-based firm investing in revolutionary tech", category: "vc" },
  { name: "Kleiner Perkins", url: "https://www.kleinerperkins.com", description: "Storied VC firm with iconic investments", category: "vc" },
];

const getCategoryColor = (category: Resource["category"]) => {
  switch (category) {
    case "yc":
      return "text-orange-500 hover:text-orange-400";
    case "techstars":
      return "text-blue-500 hover:text-blue-400";
    default:
      return "text-emerald-500 hover:text-emerald-400";
  }
};

const getCategoryName = (category: Resource["category"]) => {
  switch (category) {
    case "yc":
      return "Y Combinator";
    case "techstars":
      return "Techstars";
    case "accelerator":
      return "Accelerator";
    case "vc":
      return "Venture Capital";
  }
};

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedResources = filteredResources.reduce((acc, resource) => {
    const category = getCategoryName(resource.category);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Resources Directory</h2>
        <p className="text-muted-foreground">
          Explore 700+ accelerators, top VC firms, and angel investors to accelerate your startup journey.
        </p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {Object.entries(groupedResources).map(([category, categoryResources]) => (
        <div key={category}>
          <h3 className="text-2xl font-semibold mb-4 text-primary">{category}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryResources.map((resource) => (
              <Card key={resource.name} className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{resource.name}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm font-medium ${getCategoryColor(resource.category)} transition-colors`}
                  >
                    Visit Website →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
