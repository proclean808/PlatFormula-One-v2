import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ExternalLink, 
  Search, 
  Filter, 
  Globe, 
  DollarSign, 
  Users, 
  Rocket, 
  BookOpen, 
  Zap, 
  Award,
  Server,
  Cloud,
  Code,
  Database,
  Shield,
  Bot,
  Cpu,
  Sparkles
} from 'lucide-react'

// Y Combinator Ecosystem
const ycResources = [
  {
    name: "YC Application",
    url: "https://www.ycombinator.com/apply",
    desc: "Apply to the world's most prestigious startup accelerator. Winter 2026 batch open.",
    category: "Core",
    icon: Rocket
  },
  {
    name: "Startup School",
    url: "https://www.startupschool.org",
    desc: "Free online program for founders. Learn how to start a company, with help from YC.",
    category: "Education",
    icon: BookOpen
  },
  {
    name: "Co-Founder Matching",
    url: "https://www.ycombinator.com/cofounder-matching",
    desc: "Find a co-founder with YC's matching platform. 45,000+ founders.",
    category: "Network",
    icon: Users
  },
  {
    name: "YC Library",
    url: "https://www.ycombinator.com/library",
    desc: "Videos, podcasts, and essays for startup founders. The collective wisdom of YC.",
    category: "Education",
    icon: BookOpen
  },
  {
    name: "Requests for Startups",
    url: "https://www.ycombinator.com/rfs",
    desc: "Ideas YC would like to see people working on. Great for inspiration.",
    category: "Ideas",
    icon: Zap
  },
  {
    name: "Work at a Startup",
    url: "https://www.ycombinator.com/jobs",
    desc: "Find a job at a YC startup. The best way to get into the ecosystem.",
    category: "Jobs",
    icon: Users
  },
  {
    name: "SAFE Financing",
    url: "https://www.ycombinator.com/documents",
    desc: "Standard documents for raising capital. Used by almost all early-stage startups.",
    category: "Legal",
    icon: Shield
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com",
    desc: "Cybersecurity, computer science, and entrepreneurship news aggregator.",
    category: "Community",
    icon: Globe
  }
]

// Massive Accelerator Database (Reconstructed)
const accelerators = [
  // Tier 1 Global
  { name: "Y Combinator", location: "San Francisco, CA", focus: "Generalist", funding: "$500k", url: "https://ycombinator.com" },
  { name: "Techstars", location: "Global", focus: "Generalist", funding: "$120k", url: "https://techstars.com" },
  { name: "500 Global", location: "Global", focus: "Generalist", funding: "$150k", url: "https://500.co" },
  { name: "Plug and Play", location: "Sunnyvale, CA", focus: "Corporate Innovation", funding: "Varies", url: "https://plugandplaytechcenter.com" },
  { name: "MassChallenge", location: "Boston, MA", focus: "Generalist", funding: "Equity Free", url: "https://masschallenge.org" },
  { name: "SOSV", location: "Global", focus: "Deep Tech", funding: "$250k+", url: "https://sosv.com" },
  { name: "Antler", location: "Global", focus: "Day Zero", funding: "Pre-seed", url: "https://antler.co" },
  { name: "Entrepreneur First", location: "London/Global", focus: "Talent First", funding: "Pre-seed", url: "https://joinef.com" },
  
  // Specialized / Tech
  { name: "Vercel Accelerator", location: "Remote", focus: "Frontend/Web", funding: "$150k credits", url: "https://vercel.com/accelerator" },
  { name: "Alchemist Accelerator", location: "San Francisco, CA", focus: "Enterprise B2B", funding: "$25k", url: "https://alchemistaccelerator.com" },
  { name: "AngelPad", location: "San Francisco/NYC", focus: "SaaS/Mobile", funding: "$120k", url: "https://angelpad.com" },
  { name: "HAX", location: "Shenzhen/SF", focus: "Hardware", funding: "$250k", url: "https://hax.co" },
  { name: "IndieBio", location: "SF/NYC", focus: "Biotech", funding: "$525k", url: "https://indiebio.co" },
  { name: "Heavybit", location: "San Francisco, CA", focus: "DevTools", funding: "Seed", url: "https://heavybit.com" },
  { name: "Orange DAO", location: "Remote", focus: "Crypto/Web3", funding: "$100k", url: "https://orangedao.xyz" },
  { name: "Alliance DAO", location: "Remote", focus: "Web3/DeFi", funding: "$500k", url: "https://alliance.xyz" },
  
  // Regional / Niche
  { name: "Berkeley SkyDeck", location: "Berkeley, CA", focus: "University", funding: "$200k", url: "https://skydeck.berkeley.edu" },
  { name: "StartX", location: "Palo Alto, CA", focus: "Stanford", funding: "Equity Free", url: "https://startx.com" },
  { name: "MuckerLab", location: "Los Angeles, CA", focus: "SaaS", funding: "$100k-175k", url: "https://mucker.com" },
  { name: "Amplify.LA", location: "Los Angeles, CA", focus: "Generalist", funding: "Seed", url: "https://amplify.la" },
  { name: "Pear VC", location: "Palo Alto, CA", focus: "Student/Early", funding: "$25k-2M", url: "https://pear.vc" },
  { name: "Forum Ventures", location: "NYC/SF", focus: "B2B SaaS", funding: "$100k", url: "https://forumvc.com" },
  { name: "TinySeed", location: "Remote", focus: "Bootstrapped SaaS", funding: "$120k+", url: "https://tinyseed.com" },
  { name: "Earnest Capital", location: "Remote", focus: "Bootstrappers", funding: "Shared Earnings", url: "https://earnestcapital.com" },
  
  // Corporate / Vertical
  { name: "Google for Startups", location: "Global", focus: "Tech", funding: "Equity Free", url: "https://startup.google.com" },
  { name: "AWS Impact", location: "Global", focus: "Cloud", funding: "Credits", url: "https://aws.amazon.com/startups/accelerator" },
  { name: "Microsoft for Startups", location: "Global", focus: "Enterprise", funding: "Credits", url: "https://startups.microsoft.com" },
  { name: "NVIDIA Inception", location: "Global", focus: "AI/Data Science", funding: "Support", url: "https://nvidia.com/inception" },
  { name: "Disney Accelerator", location: "Los Angeles, CA", focus: "Media/Entertainment", funding: "Investment", url: "https://disneyaccelerator.com" },
  { name: "Barclays Accelerator", location: "London/NYC", focus: "Fintech", funding: "$120k", url: "https://barclaysaccelerator.com" },
  { name: "Metaprop", location: "NYC", focus: "Proptech", funding: "Seed", url: "https://metaprop.org" },
  { name: "Rock Health", location: "SF", focus: "Digital Health", funding: "Seed", url: "https://rockhealth.com" },
  
  // International
  { name: "Station F", location: "Paris, France", focus: "Generalist", funding: "None", url: "https://stationf.co" },
  { name: "Flat6Labs", location: "MENA", focus: "Generalist", funding: "$50k-500k", url: "https://flat6labs.com" },
  { name: "Chinaccelerator", location: "Shanghai", focus: "Cross-border", funding: "$150k", url: "https://chinaccelerator.com" },
  { name: "Startupbootcamp", location: "Global", focus: "Industry Specific", funding: "€15k", url: "https://startupbootcamp.org" },
  { name: "Seedcamp", location: "London", focus: "European Founders", funding: "£100k+", url: "https://seedcamp.com" },
  { name: "Kima Ventures", location: "Paris", focus: "SaaS", funding: "Seed", url: "https://kimaventures.com" },
  { name: "Jungle Ventures", location: "Singapore", focus: "Southeast Asia", funding: "Series A/B", url: "https://jungle.vc" },
  { name: "Blackbird", location: "Australia", focus: "Generalist", funding: "Seed+", url: "https://blackbird.vc" }
]

// AI & Developer Toolkit
const aiTools = [
  {
    name: "Google AI Studio",
    desc: "Fastest way to build with Gemini models. Prototyping environment for developers.",
    category: "AI Development",
    icon: Sparkles,
    url: "https://aistudio.google.com"
  },
  {
    name: "Gemini Product Drops",
    desc: "Latest releases, model updates, and feature drops from Google DeepMind.",
    category: "News & Updates",
    icon: Zap,
    url: "https://deepmind.google/technologies/gemini"
  },
  {
    name: "GitHub Marketplace",
    desc: "Tools to improve your workflow. CI/CD, code quality, and AI extensions.",
    category: "Dev Ecosystem",
    icon: Code,
    url: "https://github.com/marketplace"
  },
  {
    name: "OpenAI Platform",
    desc: "Access GPT-4o, embeddings, and fine-tuning APIs.",
    category: "LLM APIs",
    icon: Bot,
    url: "https://platform.openai.com"
  },
  {
    name: "Hugging Face",
    desc: "The AI community building the future. Models, datasets, and spaces.",
    category: "Open Source",
    icon: Cpu,
    url: "https://huggingface.co"
  },
  {
    name: "Vercel AI SDK",
    desc: "The TypeScript toolkit for building AI-powered applications.",
    category: "Frameworks",
    icon: Code,
    url: "https://sdk.vercel.ai"
  }
]

// Affiliate & Partner Network
const partners = [
  {
    name: "AWS Activate",
    offer: "$100,000 in Credits",
    desc: "Cloud infrastructure for scaling your startup.",
    category: "Infrastructure",
    icon: Cloud,
    url: "https://aws.amazon.com/activate",
    domain: "aws.amazon.com"
  },
  {
    name: "Google Cloud",
    offer: "$200,000 in Credits",
    desc: "AI-first cloud platform and Firebase tools.",
    category: "Infrastructure",
    icon: Cloud,
    url: "https://cloud.google.com/startup",
    domain: "cloud.google.com"
  },
  {
    name: "Microsoft Azure",
    offer: "$150,000 in Credits",
    desc: "Includes OpenAI API access and GitHub Enterprise.",
    category: "AI & Cloud",
    icon: Server,
    url: "https://startups.microsoft.com",
    domain: "microsoft.com"
  },
  {
    name: "Stripe Atlas",
    offer: "50% Off Incorporation",
    desc: "Incorporate your company in Delaware instantly.",
    category: "Legal/Finance",
    icon: DollarSign,
    url: "https://stripe.com/atlas",
    domain: "stripe.com"
  },
  {
    name: "Mercury",
    offer: "Priority Onboarding",
    desc: "Banking built for startups. No fees.",
    category: "Finance",
    icon: DollarSign,
    url: "https://mercury.com",
    domain: "mercury.com"
  },
    {
    name: "Brex",
    offer: "50,000 Points",
    desc: "Corporate cards and spend management.",
    category: "Finance",
    icon: DollarSign,
    url: "https://brex.com",
    domain: "brex.com"
  },
  {
    name: "HubSpot",
    offer: "90% Off",
    desc: "CRM platform for scaling companies.",
    category: "Sales/Marketing",
    icon: Users,
    url: "https://hubspot.com/startups",
    domain: "hubspot.com"
  },
  {
    name: "Notion",
    offer: "6 Months Free",
    desc: "Connected workspace for your team.",
    category: "Productivity",
    icon: BookOpen,
    url: "https://notion.so/startups",
    domain: "notion.so"
  },
  {
    name: "Linear",
    offer: "6 Months Free",
    desc: "Issue tracking built for high-performance teams.",
    category: "Productivity",
    icon: Code,
    url: "https://linear.app",
    domain: "linear.app"
  },
  {
    name: "Segment",
    offer: "$50,000 Credits",
    desc: "Customer data platform (CDP) for every app.",
    category: "Analytics",
    icon: Users,
    url: "https://segment.com/startups",
    domain: "segment.com"
  },
  {
    name: "MongoDB",
    offer: "$5,000 Credits",
    desc: "The developer data platform.",
    category: "Database",
    icon: Database,
    url: "https://mongodb.com/startups",
    domain: "mongodb.com"
  },
  {
    name: "Mixpanel",
    offer: "$50,000 Credits",
    desc: "Product analytics for mobile, web, and more.",
    category: "Analytics",
    icon: Users,
    url: "https://mixpanel.com/startups",
    domain: "mixpanel.com"
  }
]

import { Brain } from 'lucide-react'

export function Resources() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredAccelerators = accelerators.filter(acc => 
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* NexusYC Launch Banner - PRESERVED */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
              <Rocket className="w-3 h-3 mr-1" />
              JUST LAUNCHED
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-2">NexusYC v1.0 - Human Capital Intelligence</h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl">
            Production-grade Co-Founder & Partner Matching Engine with JoyceGPT intelligence
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/20 pt-6 mt-6">
            <p className="italic text-blue-100 text-lg">"Execute faster, decide smarter, grow bigger."</p>
            <div className="text-right">
              <p className="text-sm text-blue-200">Release Date</p>
              <p className="font-bold">Sept 22, 2025</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="accelerators" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="accelerators">Accelerators (60+)</TabsTrigger>
          <TabsTrigger value="yc">YC Ecosystem</TabsTrigger>
          <TabsTrigger value="ai-tools">AI Toolkit</TabsTrigger>
          <TabsTrigger value="partners">Partner Perks</TabsTrigger>
        </TabsList>

        {/* ACCELERATORS TAB */}
        <TabsContent value="accelerators" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Global Accelerator Directory</h3>
              <p className="text-muted-foreground">Curated list of the world's top startup programs</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search by name, focus, or location..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAccelerators.map((acc, i) => (
              <Card key={i} className={`hover:shadow-md transition-all group ${
                acc.name.includes('Techstars') 
                  ? 'hover:border-blue-500/50 dark:hover:border-blue-500/50' 
                  : 'hover:border-emerald-500/50 dark:hover:border-emerald-500/50'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className={`text-base font-bold transition-colors ${
                      acc.name.includes('Techstars')
                        ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        : 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                    }`}>
                      {acc.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">{acc.funding}</Badge>
                  </div>
                  <CardDescription className="flex items-center text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    {acc.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs font-normal">
                      {acc.focus}
                    </Badge>
                    <Button 
                      size="sm" 
                      className={`h-8 px-3 text-xs text-white border-0 ${
                        acc.name.includes('Techstars')
                          ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'
                          : acc.name.includes('Y Combinator')
                            ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                            : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                      }`}
                      onClick={() => window.open(acc.url, '_blank')}
                    >
                      Visit
                      <ExternalLink className="w-3 h-3 ml-1.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI TOOLKIT TAB */}
        <TabsContent value="ai-tools" className="space-y-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-purple-500" />
              AI & Developer Toolkit
            </h3>
            <p className="text-muted-foreground">Essential tools for building the next generation of software</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool, i) => (
              <Card key={i} className="hover:shadow-lg transition-all border-t-4 border-t-purple-500 dark:border-t-purple-400">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <tool.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                      {tool.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{tool.desc}</p>
                  <Button className="w-full group bg-purple-600 hover:bg-purple-700 text-white border-0" onClick={() => window.open(tool.url, '_blank')}>
                    Launch Tool <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* YC ECOSYSTEM TAB */}
        <TabsContent value="yc" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ycResources.map((res, i) => (
              <Card key={i} className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <res.icon className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                      </div>
                      <CardTitle>{res.name}</CardTitle>
                    </div>
                    <Badge className="bg-orange-500 hover:bg-orange-600">{res.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{res.desc}</p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={() => window.open(res.url, '_blank')}>
                    Access Resource <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* PARTNERS TAB */}
        <TabsContent value="partners" className="space-y-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold">Affiliate Program Network</h3>
            <p className="text-muted-foreground">Exclusive deals and SaaS tiers for PlatFormula.One members</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.map((partner, i) => (
              <Card key={i} className="relative overflow-hidden hover:shadow-lg transition-all border-t-4 border-t-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <partner.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Badge variant="outline">{partner.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{partner.name}</CardTitle>
                  <CardDescription className="font-bold text-emerald-600 dark:text-emerald-400">
                    {partner.offer}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{partner.desc}</p>
                  <Button variant="outline" className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => window.open(partner.url, '_blank')}>
                    Claim Deal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
