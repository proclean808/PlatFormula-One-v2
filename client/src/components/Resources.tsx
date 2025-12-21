import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

export function Resources() {
  const resources = [
    {
      category: "Startup Resources",
      color: "orange",
      items: [
        {
          name: "Y Combinator",
          description: "The world's most prestigious startup accelerator",
          url: "https://www.ycombinator.com"
        },
        {
          name: "Startup School",
          description: "Free online program for founders",
          url: "https://www.startupschool.org"
        },
        {
          name: "YC Startup Library",
          description: "Essential reading and resources for founders",
          url: "https://www.ycombinator.com/library"
        },
        {
          name: "Techstars",
          description: "Global startup accelerator and venture capital firm",
          url: "https://www.techstars.com"
        },
        {
          name: "500 Global",
          description: "Venture capital firm and startup accelerator",
          url: "https://500.co"
        },
        {
          name: "Plug and Play",
          description: "Global innovation platform connecting startups with corporations",
          url: "https://www.plugandplaytechcenter.com"
        },
        {
          name: "On Deck Founding",
          description: "Community and accelerator for early-stage founders",
          url: "https://www.beondeck.com/founders"
        },
        {
          name: "Antler",
          description: "Global early-stage VC enabling people to start companies",
          url: "https://www.antler.co"
        },
        {
          name: "South Park Commons",
          description: "Community of technologists, founders, and researchers",
          url: "https://www.southparkcommons.com"
        },
        {
          name: "Indie Hackers",
          description: "Community for founders building profitable businesses",
          url: "https://www.indiehackers.com"
        },
        {
          name: "Product Hunt",
          description: "Platform to discover and launch new products",
          url: "https://www.producthunt.com"
        },
        {
          name: "Hacker News",
          description: "Tech news and discussion community",
          url: "https://news.ycombinator.com"
        }
      ]
    },
    {
      category: "Accelerators & Incubators",
      color: "blue",
      items: [
        {
          name: "YCombinator",
          description: "World's leading startup accelerator",
          url: "https://www.ycombinator.com/apply"
        },
        {
          name: "Techstars Accelerator",
          description: "Mentorship-driven accelerator program",
          url: "https://www.techstars.com/accelerators"
        },
        {
          name: "Alchemist Accelerator",
          description: "B2B/Enterprise Software - Deadline: November 21, 2025",
          url: "https://www.alchemistaccelerator.com/apply"
        },

        {
          name: "Founder Institute",
          description: "Pre-seed startup accelerator",
          url: "https://fi.co"
        },
        {
          name: "ERA",
          description: "NYC-based accelerator for early-stage startups",
          url: "https://www.eranyc.com"
        },
        {
          name: "Berkeley SkyDeck",
          description: "Deep Tech, UC Berkeley - Batch 22 opens January 2026",
          url: "https://skydeck.berkeley.edu/apply"
        },
        {
          name: "AWS Generative AI Accelerator",
          description: "Generative AI startups - Monitor for 2026 cohort",
          url: "https://aws.amazon.com/startups/programs/generative-ai"
        },
        {
          name: "Google for Startups Accelerator: AI-First",
          description: "AI-First startups - Monitor for 2026 cohort",
          url: "https://startup.google.com/programs/accelerator/ai-first/"
        },
        {
          name: "AngelPad",
          description: "Seed-stage accelerator - Currently closed, check for updates",
          url: "https://angelpad.com/more/"
        },
        {
          name: "NVIDIA Inception",
          description: "AI and data science startups - Rolling applications",
          url: "https://programs.nvidia.com/phoenix/application/"
        },
        {
          name: "Vercel AI Accelerator",
          description: "AI-powered startups building with Vercel - Rolling applications",
          url: "https://vercel.com/ai-accelerator"
        }
      ]
    },
    {
      category: "Venture Capital & Seed Networks",
      color: "green",
      items: [
        {
          name: "AngelList",
          description: "Platform for startups, investors, and job seekers",
          url: "https://www.angellist.com"
        },
        {
          name: "Crunchbase",
          description: "Business information platform about private and public companies",
          url: "https://www.crunchbase.com"
        },
        {
          name: "Gust",
          description: "Platform connecting startups with investors",
          url: "https://gust.com"
        },
        {
          name: "SeedInvest",
          description: "Equity crowdfunding platform",
          url: "https://www.seedinvest.com"
        },
        {
          name: "Republic",
          description: "Investment platform for startups",
          url: "https://republic.com"
        },
        {
          name: "Wefunder",
          description: "Crowdfunding platform for startups",
          url: "https://wefunder.com"
        },
        {
          name: "First Round Capital",
          description: "Seed-stage venture capital firm",
          url: "https://firstround.com"
        },
        {
          name: "Sequoia Capital",
          description: "Leading venture capital firm",
          url: "https://www.sequoiacap.com"
        },
        {
          name: "Andreessen Horowitz",
          description: "Silicon Valley venture capital firm",
          url: "https://a16z.com"
        },
        {
          name: "Kleiner Perkins",
          description: "Venture capital firm investing in technology companies",
          url: "https://www.kleinerperkins.com"
        },
        {
          name: "Greylock Partners",
          description: "Leading venture capital firm",
          url: "https://greylock.com"
        },
        {
          name: "Lightspeed Venture Partners",
          description: "Multi-stage venture capital firm",
          url: "https://lsvp.com"
        },
        {
          name: "Bessemer Venture Partners",
          description: "Global venture capital firm",
          url: "https://www.bvp.com"
        },
        {
          name: "Accel",
          description: "Venture capital firm",
          url: "https://www.accel.com"
        },
        {
          name: "Benchmark",
          description: "Venture capital firm for early-stage startups",
          url: "https://www.benchmark.com"
        },
        {
          name: "Founders Fund",
          description: "San Francisco-based venture capital firm",
          url: "https://foundersfund.com"
        },
        {
          name: "Index Ventures",
          description: "International venture capital firm",
          url: "https://www.indexventures.com"
        },
        {
          name: "NEA",
          description: "New Enterprise Associates - venture capital firm",
          url: "https://www.nea.com"
        },
        {
          name: "Insight Partners",
          description: "Global software investor",
          url: "https://www.insightpartners.com"
        },
        {
          name: "General Catalyst",
          description: "Venture capital firm",
          url: "https://www.generalcatalyst.com"
        },
        {
          name: "GV (Google Ventures)",
          description: "Venture capital arm of Alphabet Inc.",
          url: "https://www.gv.com"
        },
        {
          name: "Initialized Capital",
          description: "Early-stage venture capital firm",
          url: "https://initialized.com"
        },
        {
          name: "Lowercase Capital",
          description: "Seed-stage venture capital firm",
          url: "https://lowercasecapital.com"
        },
        {
          name: "SV Angel",
          description: "San Francisco-based angel fund",
          url: "https://svangel.com"
        },
        {
          name: "Craft Ventures",
          description: "Early-stage venture capital firm",
          url: "https://www.craftventures.com"
        },
        {
          name: "Lux Capital",
          description: "Venture capital firm investing in emerging science and technology",
          url: "https://www.luxcapital.com"
        },
        {
          name: "8VC",
          description: "Technology investment firm",
          url: "https://8vc.com"
        },
        {
          name: "Khosla Ventures",
          description: "Venture capital firm focused on technology",
          url: "https://www.khoslaventures.com"
        },
        {
          name: "Spark Capital",
          description: "Venture capital firm",
          url: "https://www.sparkcapital.com"
        },
        {
          name: "Union Square Ventures",
          description: "New York-based venture capital firm",
          url: "https://www.usv.com"
        },
        {
          name: "Felicis Ventures",
          description: "Early-stage venture capital firm",
          url: "https://www.felicis.com"
        },
        {
          name: "Forerunner Ventures",
          description: "Early-stage venture capital firm",
          url: "https://forerunnerventures.com"
        },
        {
          name: "Notation Capital",
          description: "Pre-seed venture capital firm",
          url: "https://notationcapital.com"
        },
        {
          name: "Floodgate",
          description: "Seed-stage venture capital firm",
          url: "https://www.floodgate.com"
        },
        {
          name: "Homebrew",
          description: "Seed-stage venture capital firm",
          url: "https://www.homebrew.co"
        },
        {
          name: "Cowboy Ventures",
          description: "Seed-stage venture capital firm",
          url: "https://cowboy.vc"
        },
        {
          name: "Bloomberg Beta",
          description: "Early-stage venture capital firm",
          url: "https://www.bloombergbeta.com"
        },
        {
          name: "Susa Ventures",
          description: "Seed-stage venture capital firm",
          url: "https://susaventures.com"
        }
      ]
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return {
          border: 'border-orange-200 dark:border-orange-900',
          badge: 'border-orange-200 text-orange-700 dark:text-orange-400',
          button: 'bg-orange-500 hover:bg-orange-600 text-white',
          icon: 'text-orange-500'
        }
      case 'blue':
        return {
          border: 'border-blue-200 dark:border-blue-900',
          badge: 'border-blue-200 text-blue-700 dark:text-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: 'text-blue-500'
        }
      case 'green':
        return {
          border: 'border-emerald-200 dark:border-emerald-900',
          badge: 'border-emerald-200 text-emerald-700 dark:text-emerald-400',
          button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
          icon: 'text-emerald-500'
        }
      default:
        return {
          border: 'border-gray-200',
          badge: 'border-gray-200 text-gray-700',
          button: 'bg-gray-900 text-white',
          icon: 'text-gray-500'
        }
    }
  }

  return (
    <div className="space-y-12 p-6">
      {resources.map((section, sectionIndex) => {
        const colors = getColorClasses(section.color)
        return (
          <div key={sectionIndex}>
            <div className="flex items-center mb-6">
              <div className={`w-1 h-8 rounded-full mr-3 ${
                section.color === 'orange' ? 'bg-orange-500' : 
                section.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
              }`} />
              <h3 className="text-2xl font-bold text-foreground">{section.category}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, index) => (
                <Card key={index} className={`hover:shadow-lg transition-shadow ${colors.border}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="mt-2">{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className={`w-full ${colors.button}`}
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Access Resource
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
