import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink } from "lucide-react";
import { useState } from "react";

interface Resource {
  name: string;
  url: string;
  description: string;
  category: "yc" | "techstars" | "accelerator" | "vc";
  logo?: string;
}

const resources: Resource[] = [
  // Y Combinator Resources
  { name: "Y Combinator", url: "https://www.ycombinator.com", description: "$500K standard deal for early-stage startups across all industries", category: "yc", logo: "/yc-logo.png" },
  { name: "YC Application", url: "https://www.ycombinator.com/apply", description: "Apply to Y Combinator's accelerator program", category: "yc" },
  { name: "Startup School", url: "https://www.startupschool.org", description: "Free online program for founders", category: "yc" },
  { name: "YC Startup Directory", url: "https://www.ycombinator.com/companies", description: "Browse 7,800+ YC-funded companies", category: "yc" },
  { name: "Hacker News", url: "https://news.ycombinator.com", description: "Tech and startup news community", category: "yc" },
  
  // Techstars
  { name: "Techstars", url: "https://www.techstars.com", description: "$220K investment with global mentorship network (6,300+ startups)", category: "techstars", logo: "/techstars-logo.webp" },
  
  // Top AI Accelerators & Incubators
  { name: "500 Global", url: "https://500.co", description: "$150K investment, 3,000+ portfolio companies including Canva", category: "accelerator", logo: "/500global-logo.png" },
  { name: "Thrive Capital", url: "https://thrivecap.com", description: "Backed Stripe, GitHub, and OpenAI with long-term capital", category: "accelerator" },
  { name: "Innovation Works", url: "https://innovationworks.org", description: "AlphaLab & Robotics Factory programs in Pittsburgh", category: "accelerator" },
  { name: "Startupbootcamp", url: "https://www.startupbootcamp.org", description: "Global network of industry-focused accelerators (FinTech, AI, HealthTech)", category: "accelerator" },
  { name: "Forum Ventures", url: "https://www.forumvc.com", description: "$100K for B2B SaaS founders with go-to-market focus", category: "accelerator" },
  { name: "Entrepreneurs First", url: "https://www.joinef.com", description: "$250K for deep tech teams, often pre-idea", category: "accelerator" },
  { name: "NFX", url: "https://www.nfx.com", description: "$500K-$2M for startups with network effects", category: "accelerator" },
  { name: "NTT DOCOMO Ventures", url: "https://www.nttdocomo-v.com/en/", description: "Japan's largest telecom investment arm for AI, IoT, FinTech", category: "accelerator" },
  { name: "Idealab", url: "https://www.idealab.com", description: "Founded 1996, 100+ investments in AI and tech", category: "accelerator" },
  { name: "DMZ", url: "https://dmz.torontomu.ca", description: "Canada's top university incubator, 278 investments", category: "accelerator" },
  { name: "European Innovation Council", url: "https://eic.ec.europa.eu", description: "EU's flagship innovation program, 1,199 investments", category: "accelerator" },
  { name: "Founder Friendly Labs", url: "https://founderfriendlylabs.com", description: "176 investments since 2011", category: "accelerator" },
  { name: "FounderFuel", url: "https://founderfuel.com", description: "Montreal-based accelerator, 101 investments", category: "accelerator" },
  { name: "H-FARM", url: "https://www.h-farm.com", description: "Italy's leading innovation hub since 2005", category: "accelerator" },
  { name: "BonAngels Venture Partners", url: "https://www.bonangels.net", description: "South Korea's top accelerator, 247 investments", category: "accelerator" },
  { name: "South Park Commons", url: "https://www.southparkcommons.com", description: "Community-driven accelerator, 229 investments", category: "accelerator" },
  { name: "Surge", url: "https://surge.xyz", description: "Singapore-based, 212 investments since 2019", category: "accelerator" },
  { name: "Microsoft for Startups", url: "https://www.microsoft.com/startups", description: "Cloud credits and resources for AI startups", category: "accelerator" },
  { name: "SparkLabs", url: "https://www.sparklabs.co.kr", description: "Seoul accelerator, 229 investments", category: "accelerator" },
  { name: "Accelerator Centre", url: "https://acceleratorcentre.com", description: "Waterloo, Canada - 211 investments since 2006", category: "accelerator" },
  { name: "Outlier Ventures", url: "https://outlierventures.io", description: "Web3 and AI focus, 348 investments", category: "accelerator" },
  { name: "IndieBio", url: "https://indiebio.co", description: "Biotech and AI, 535 investments", category: "accelerator" },
  { name: "AppWorks", url: "https://appworks.tw", description: "Taiwan's largest accelerator, 150 investments", category: "accelerator" },
  { name: "Allen Institute for AI", url: "https://allenai.org", description: "Seattle-based AI research and incubation", category: "accelerator" },
  { name: "Cyberport Hong Kong", url: "https://www.cyberport.hk", description: "Hong Kong's digital tech hub, 199 investments", category: "accelerator" },
  { name: "SCALE AI", url: "https://www.scaleai.ca", description: "Canada's AI supercluster", category: "accelerator" },
  { name: "EXPERT DOJO", url: "https://expertdojo.com", description: "Santa Monica accelerator, 308 investments", category: "accelerator" },
  { name: "TandemLaunch", url: "https://tandemlaunch.com", description: "Deep tech commercialization, Montreal", category: "accelerator" },
  { name: "Zeroth.AI", url: "https://zeroth.ai", description: "Asia's first AI-focused accelerator", category: "accelerator" },
  { name: "AI Fund", url: "https://aifund.ai", description: "Andrew Ng's AI-focused fund and accelerator", category: "accelerator" },
  { name: "Next AI", url: "https://www.nextcanada.com/next-ai/", description: "Canada's AI accelerator, 88 investments", category: "accelerator" },
  { name: "Accelerating Asia", url: "https://www.acceleratingasia.com", description: "Singapore-based, 98 investments", category: "accelerator" },
  { name: "Nvidia Inception", url: "https://www.nvidia.com/en-us/startups/", description: "GPU resources and support for AI startups", category: "accelerator" },
  { name: "AI Grant", url: "https://aigrant.org", description: "Non-dilutive grants for AI researchers", category: "accelerator" },
  { name: "Alchemist Accelerator", url: "https://www.alchemistaccelerator.com", description: "Top program for seed-stage enterprise ventures", category: "accelerator" },
  { name: "Plug and Play", url: "https://www.plugandplaytechcenter.com", description: "Innovation platform connecting startups with corporations", category: "accelerator" },
  { name: "Berkeley SkyDeck", url: "https://skydeck.berkeley.edu", description: "UC Berkeley's official accelerator", category: "accelerator" },
  { name: "AngelPad", url: "https://angelpad.com", description: "Seed-stage accelerator with hands-on approach", category: "accelerator" },
  { name: "Founder Institute", url: "https://fi.co", description: "Global pre-seed accelerator", category: "accelerator" },
  { name: "HAX", url: "https://hax.co", description: "Venture firm focused on hard tech startups", category: "accelerator" },
  { name: "Deepcore", url: "https://deepcore.jp/en/", description: "Tokyo-based AI and deep tech, 97 investments", category: "accelerator" },
  { name: "AI2 Incubator", url: "https://allenai.org/incubator", description: "Allen Institute's AI startup incubator", category: "accelerator" },
  { name: "Vercel AI Accelerator", url: "https://vercel.com/blog/the-vercel-ai-accelerator-is-back-with-6-million-in-credits", description: "$6M in credits for AI startups building with Vercel", category: "accelerator", logo: "/vercel-logo.png" },
  { name: "Accel Atoms", url: "https://www.accel.com/programs/atoms", description: "Pre-seed AI cohort 2026 with up to $2M co-investment with Google AI Futures Fund", category: "accelerator" },
  { name: "a16z Speedrun", url: "https://a16z.com/speedrun/", description: "Tech, gaming, and AI accelerator with up to $1M funding and 600-person operator network", category: "accelerator" },
  { name: "Pear VC PearX", url: "https://pear.vc/pearx/", description: "Exclusive 12-week pre-seed accelerator with $250K-$2M investment, ~20 team batches, and 90% success rate. Dedicated recruiting, sales, and fundraising support", category: "accelerator" },
  { name: "Berkeley SkyDeck IPP", url: "https://skydeck.berkeley.edu/innovation-partner-program/", description: "Innovation Partner Program with $810K in startup perks and UC Berkeley network access", category: "accelerator" },
  { name: "Digital Catapult", url: "https://www.digicalcatapult.org.uk", description: "UK's leading deep tech innovation center", category: "accelerator" },
  { name: "Jolt Capital", url: "https://www.jolt.vc", description: "Paris-based deep tech investor", category: "accelerator" },
  
  // Developer GTM Tools
  { name: "Reo.Dev", url: "https://reo.dev", description: "AI-native GTM platform for DevTool companies. De-anonymize GitHub traffic and convert intent signals into qualified leads", category: "accelerator", logo: "/reodev-logo.jpg" },
  
  // VCs - Pre-Seed/Seed
  { name: "AngelList", url: "https://www.angellist.com", description: "Platform for connecting with angel investors and syndicates", category: "vc" },
  { name: "First Round Capital", url: "https://firstround.com", description: "Top-tier seed-stage firm with First Round Review content platform", category: "vc" },
  { name: "TQ Ventures", url: "https://www.tqventures.com", description: "Pre-seed and seed-stage VC focused on technical founders", category: "vc" },
  { name: "e2vc", url: "https://www.e2vc.com", description: "European seed-stage VC backing ambitious tech founders", category: "vc" },
  { name: "Inovo", url: "https://www.inovo.vc", description: "European seed and Series A investor in tech startups", category: "vc" },
  { name: "Rockaway Ventures", url: "https://www.rockaway.com", description: "CEE-focused VC investing in seed to growth-stage companies", category: "vc" },
  
  // VCs - Early Stage (Series A)
  { name: "Uncork Capital", url: "https://www.uncorkcapital.com", description: "Seed and Series A investor in software and marketplace startups", category: "vc" },
  { name: "Samsung Next", url: "https://www.samsungnext.com", description: "Corporate VC investing in software and services across all stages", category: "vc" },
  { name: "Encoded Ventures", url: "https://www.encoded.vc", description: "Series A-focused VC backing technical founders in B2B software", category: "vc" },
  { name: "Elevation Capital", url: "https://www.elevationcapital.com", description: "India-focused early-stage VC (formerly SAIF Partners)", category: "vc" },
  { name: "Lightspeed Venture Partners", url: "https://lsvp.com", description: "Multi-stage VC focusing on enterprise, fintech, and consumer", category: "vc" },
  { name: "Bain Capital Ventures", url: "https://www.baincapitalventures.com", description: "Seed to growth-stage investor with deep operational expertise", category: "vc" },
  { name: "Greylock", url: "https://greylock.com", description: "Classic VC firm focused on enterprise software and consumer internet", category: "vc" },
  { name: "Norwest Venture Partners", url: "https://www.nvp.com", description: "Multi-stage VC with focus on enterprise and consumer tech", category: "vc" },
  { name: "Two Bear Capital", url: "https://www.twobearcapital.com", description: "Early-stage VC investing in software and internet companies", category: "vc" },
  
  // VCs - Growth Stage (Series C/D+)
  { name: "Infinity Ventures", url: "https://www.infinityventures.com", description: "Growth-stage investor in technology and internet companies", category: "vc" },
  { name: "Synchrony Ventures", url: "https://www.synchronyventures.com", description: "Growth equity firm focused on healthcare and financial services", category: "vc" },
  { name: "Andreessen Horowitz (a16z)", url: "https://a16z.com", description: "Leading VC firm investing seed to growth-stage in technology", category: "vc" },
  { name: "NEA", url: "https://www.nea.com", description: "New Enterprise Associates - one of world's largest VCs, all stages", category: "vc" },
  { name: "General Catalyst", url: "https://www.generalcatalyst.com", description: "Multi-stage VC backing transformational companies globally", category: "vc" },
  { name: "Georgian Partners", url: "https://www.georgian.io", description: "Growth-stage investor in B2B software with applied AI focus", category: "vc" },
  { name: "Sequoia Capital", url: "https://www.sequoiacap.com", description: "One of the world's most influential VCs, seed to growth-stage", category: "vc" },
  { name: "Sapphire Ventures", url: "https://sapphireventures.com", description: "Growth-stage VC focused on B2B software companies", category: "vc" },
  
  // VCs - Other Notable Firms
  { name: "Bessemer Venture Partners", url: "https://www.bvp.com", description: "Cross-stage investor with depth in AI, cloud, and healthcare", category: "vc" },
  { name: "Founders Fund", url: "https://foundersfund.com", description: "SF-based firm investing in revolutionary technology companies", category: "vc" },
  { name: "Kleiner Perkins", url: "https://www.kleinerperkins.com", description: "Storied VC firm with long history of iconic investments", category: "vc" },
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
      return "AI Accelerators";
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold">Resources Directory</h2>
            <p className="text-muted-foreground">
              Explore 50+ top AI accelerators, leading VC firms, and angel investors to accelerate your startup journey.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Toolkit Value</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              $150K+
            </p>
            <p className="text-xs text-muted-foreground">in credits & deals</p>
          </div>
        </div>
        
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
                    <span className="flex items-center gap-2">
                      {resource.logo && <img src={resource.logo} alt={`${resource.name} logo`} className="h-5 w-5" />}
                      {resource.name}
                    </span>
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
