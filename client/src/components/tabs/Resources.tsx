import { BookOpen, Database, FileText, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Resources Tab Component
 * 
 * Design: Real accelerator database and learning resources
 * - Color-coded links: YC=orange, Techstars=blue, others=green
 * - Real accelerator programs with URLs
 * - YC resources hub
 * - Investor networks
 */
export default function Resources() {
  // Color coding: YC=orange, Techstars=blue, others=green
  const getLinkColor = (name: string) => {
    if (name.toLowerCase().includes('y combinator') || name.toLowerCase().includes('yc ')) {
      return 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300';
    }
    if (name.toLowerCase().includes('techstars')) {
      return 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300';
    }
    return 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300';
  };

  const accelerators = [
    { name: 'Y Combinator', url: 'https://www.ycombinator.com/', description: 'Leading startup accelerator with $500K investment' },
    { name: 'Techstars', url: 'https://www.techstars.com/', description: 'Global network providing investment and mentorship' },
    { name: '500 Global', url: 'https://500.co/', description: 'Global VC firm and accelerator for early-stage companies' },
    { name: 'Alchemist Accelerator', url: 'https://www.alchemistaccelerator.com/', description: 'Top program for seed-stage enterprise ventures' },
    { name: 'Plug and Play Tech Center', url: 'https://www.plugandplaytechcenter.com/', description: 'Innovation platform connecting startups with corporations' },
    { name: 'Berkeley SkyDeck', url: 'https://skydeck.berkeley.edu/', description: 'Official accelerator for UC Berkeley startups' },
    { name: 'AngelPad', url: 'https://angelpad.com/', description: 'Seed-stage accelerator with hands-on approach' },
    { name: 'Founder Institute', url: 'https://fi.co/', description: 'Global pre-seed accelerator with structured guidance' },
    { name: 'HAX', url: 'https://hax.co/', description: 'Venture firm focused on hard tech startups' }
  ];

  const ycResources = [
    { name: 'YC Application', url: 'https://www.ycombinator.com/apply', description: 'Apply to Y Combinator' },
    { name: 'Startup School', url: 'https://www.startupschool.org', description: 'Free online course for founders' },
    { name: 'YC Co-Founder Matching', url: 'https://www.ycombinator.com/cofounder-matching', description: 'Find your co-founder' },
    { name: 'YC Startup Directory', url: 'https://www.ycombinator.com/companies', description: 'Browse YC companies' },
    { name: 'YC Startup Library', url: 'https://www.ycombinator.com/library', description: 'Essential startup resources' },
    { name: 'Hacker News', url: 'https://news.ycombinator.com', description: 'Tech news and community' },
    { name: 'YC Safe Documents', url: 'https://www.ycombinator.com/documents', description: 'Standard financing documents' },
    { name: 'YC YouTube Channel', url: 'https://www.youtube.com/c/ycombinator', description: 'Startup advice videos' }
  ];

  const investors = [
    { name: 'AngelList', url: 'https://www.angellist.com/', description: 'Connect with angel investors and syndicates' },
    { name: 'Andreessen Horowitz (a16z)', url: 'https://a16z.com/', description: 'Leading VC investing in technology companies' },
    { name: 'Sequoia Capital', url: 'https://www.sequoiacap.com/', description: 'World\'s most influential VC firm' },
    { name: 'Lightspeed Venture Partners', url: 'https://lsvp.com/', description: 'Multi-stage firm for enterprise and fintech' },
    { name: 'Greylock', url: 'https://greylock.com/', description: 'Focus on enterprise software and consumer internet' },
    { name: 'First Round Capital', url: 'https://firstround.com/', description: 'Top-tier seed-stage firm' },
    { name: 'Bessemer Venture Partners', url: 'https://www.bvp.com/', description: 'Cross-stage investor in AI, cloud, healthcare' },
    { name: 'Founders Fund', url: 'https://foundersfund.com/', description: 'Investing in revolutionary technology' },
    { name: 'Kleiner Perkins', url: 'https://www.kleinerperkins.com/', description: 'Storied VC with iconic portfolio' }
  ];

  const tools = [
    { name: 'Crunchbase', url: 'https://www.crunchbase.com/', description: 'Startup and investor database' },
    { name: 'Product Hunt', url: 'https://www.producthunt.com/', description: 'Launch and discover new products' },
    { name: 'Indie Hackers', url: 'https://www.indiehackers.com/', description: 'Community for independent founders' },
    { name: 'Stripe Atlas', url: 'https://stripe.com/atlas', description: 'Incorporate your startup' },
    { name: 'Notion', url: 'https://www.notion.so/', description: 'All-in-one workspace' },
    { name: 'Figma', url: 'https://www.figma.com/', description: 'Collaborative design tool' }
  ];

  const ResourceLink = ({ item }: { item: { name: string; url: string; description: string } }) => (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 bg-white/50 dark:bg-slate-700/30 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all group block"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className={`font-semibold transition ${getLinkColor(item.name)} flex items-center gap-2`}>
            {item.name}
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {item.description}
          </p>
        </div>
      </div>
    </a>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Accelerator Database & Resources
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Access real accelerator programs, investor networks, and tools to accelerate your startup journey
        </p>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Y Combinator</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Techstars</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Other Programs</span>
          </div>
        </div>
      </div>

      {/* Accelerator Programs */}
      <div className="glass p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Top Accelerator Programs
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accelerators.map((item, idx) => (
            <ResourceLink key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Y Combinator Resources */}
      <div className="glass p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Y Combinator Resources Hub
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ycResources.map((item, idx) => (
            <ResourceLink key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Investor Networks */}
      <div className="glass p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <LinkIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Venture Capital & Investor Networks
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {investors.map((item, idx) => (
            <ResourceLink key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Tools & Platforms */}
      <div className="glass p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Essential Tools & Platforms
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((item, idx) => (
            <ResourceLink key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="glass p-8 rounded-2xl text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Ready to Apply?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Use our AI-powered application builder to craft winning applications for top accelerators
        </p>
        <Button className="gradient-btn">
          Start Building Your Application
        </Button>
      </div>
    </div>
  );
}
