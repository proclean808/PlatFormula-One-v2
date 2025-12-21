import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Star, Users, DollarSign, Calendar } from 'lucide-react'

export function Resources() {
  const ycResources = [
    {
      name: "Y Combinator Application",
      url: "https://www.ycombinator.com/apply",
      description: "Apply to the world's most successful startup accelerator",
      type: "Application",
      deadline: "Ongoing"
    },
    {
      name: "Startup School",
      url: "https://www.startupschool.org",
      description: "Free online course for entrepreneurs",
      type: "Education",
      deadline: "Self-paced"
    },
    {
      name: "YC Startup Library",
      url: "https://www.ycombinator.com/library",
      description: "Essential reading for startup founders",
      type: "Resources",
      deadline: "Always available"
    }
  ]

  const accelerators = [
    {
      name: "Techstars",
      url: "https://www.techstars.com",
      description: "Global network providing investment and mentorship",
      funding: "$120K",
      equity: "6%",
      duration: "3 months"
    },
    {
      name: "500 Global",
      url: "https://500.co",
      description: "Global venture capital firm and accelerator",
      funding: "$150K",
      equity: "6%",
      duration: "4 months"
    },
    {
      name: "Plug and Play",
      url: "https://www.plugandplaytechcenter.com",
      description: "Innovation platform connecting startups with corporations",
      funding: "$25K-250K",
      equity: "2-5%",
      duration: "3-6 months"
    }
  ]

  const investors = [
    {
      name: "Andreessen Horowitz",
      url: "https://a16z.com",
      description: "Leading venture firm investing in technology companies",
      stage: "Seed to Growth",
      focus: "Enterprise, Consumer, Crypto"
    },
    {
      name: "Sequoia Capital",
      url: "https://www.sequoiacap.com",
      description: "One of the world's most influential VC firms",
      stage: "Seed to IPO",
      focus: "Technology, Healthcare"
    },
    {
      name: "First Round Capital",
      url: "https://firstround.com",
      description: "Top-tier seed-stage firm with robust content platform",
      stage: "Pre-seed to Series A",
      focus: "B2B, Consumer, Healthcare"
    }
  ]

  return (
    <div className="space-y-8 p-6">
      {/* Y Combinator Resources */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-foreground">Y Combinator Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ycResources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-orange-200 dark:border-orange-900">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{resource.name}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-orange-200 text-orange-700 dark:text-orange-400">{resource.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {resource.deadline}
                  </div>
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Access Resource
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Accelerators */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-foreground">Top Accelerators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accelerators.map((accelerator, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-blue-200 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="text-lg">{accelerator.name}</CardTitle>
                <CardDescription>{accelerator.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                      <span>{accelerator.funding}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                      <span>{accelerator.equity}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration: {accelerator.duration}
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.open(accelerator.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Investors */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-foreground">Top Venture Capital Firms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investors.map((investor, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-emerald-200 dark:border-emerald-900">
              <CardHeader>
                <CardTitle className="text-lg">{investor.name}</CardTitle>
                <CardDescription>{investor.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      <span className="font-medium">Stage:</span>
                      <span className="ml-1 text-muted-foreground">{investor.stage}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="font-medium">Focus:</span>
                      <span className="ml-1 text-muted-foreground">{investor.focus}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => window.open(investor.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
