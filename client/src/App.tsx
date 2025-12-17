import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeToggle } from './components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { 
  BarChart3, 
  Target, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Search,
  Filter,
  Star,
  CheckCircle,
  Rocket,
  Brain,
  Zap,
  ArrowRight
} from 'lucide-react'
import { Resources } from './components/Resources'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for demonstration
  const readinessScore = 78
  const applicationsSubmitted = 5
  const acceptanceRate = 12

  const accelerators = [
    {
      name: "Y Combinator",
      type: "Generalist",
      stage: "Pre-seed to Seed",
      acceptanceRate: "1.5%",
      funding: "$500K",
      location: "San Francisco",
      deadline: "2025-10-15",
      focus: ["B2B SaaS", "AI", "Consumer"],
      rating: 4.9
    },
    {
      name: "Forum Ventures",
      type: "B2B SaaS Specialist",
      stage: "Pre-seed",
      acceptanceRate: "3%",
      funding: "$250K",
      location: "San Francisco",
      deadline: "2025-11-01",
      focus: ["B2B SaaS", "Enterprise"],
      rating: 4.7
    },
    {
      name: "500 Global",
      type: "Generalist",
      stage: "Seed",
      acceptanceRate: "2%",
      funding: "$150K",
      location: "Global",
      deadline: "2025-10-30",
      focus: ["SaaS", "Fintech", "AI"],
      rating: 4.6
    },
    {
      name: "Techstars",
      type: "Industry Focused",
      stage: "Pre-seed to Seed",
      acceptanceRate: "1%",
      funding: "$120K",
      location: "Multiple",
      deadline: "2025-11-15",
      focus: ["B2B", "Healthcare", "Fintech"],
      rating: 4.8
    }
  ]

  const filteredAccelerators = accelerators.filter(acc => 
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.focus.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleGetStarted = () => {
    alert('Get Started functionality - This would open an onboarding modal in the full version.')
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-400 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  PlatFormula.One
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ready to Apply
              </Badge>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg shadow-emerald-500/25 border-0"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* 
            TAB BAR FIXES:
            1. Removed bg-transparent to avoid default shadcn styling issues
            2. Added overflow-x-auto for mobile responsiveness (no crunching)
            3. Added min-w-max to ensure tabs don't shrink too small
            4. Removed any overlay/shading in dark mode by using explicit transparent backgrounds
          */}
          <div className="w-full overflow-x-auto pb-2 mb-6 scrollbar-hide">
            <TabsList className="inline-flex w-full min-w-max sm:w-full sm:grid sm:grid-cols-6 bg-transparent dark:bg-transparent border-0 p-0 h-auto gap-2">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700 py-2.5"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="directory" 
                className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700 py-2.5"
              >
                <Search className="w-4 h-4" />
                <span>Directory</span>
              </TabsTrigger>
              <TabsTrigger 
                value="builder" 
                className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700 py-2.5"
              >
                <Target className="w-4 h-4" />
                <span>Builder</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700 py-2.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Resources</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tracking" 
                className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700 py-2.5"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Tracking</span>
              </TabsTrigger>
              <TabsTrigger 
                value="community" 
                className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700 py-2.5"
              >
                <Users className="w-4 h-4" />
                <span>Community</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-blue-500 dark:bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
                  <Target className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{readinessScore}%</div>
                  <Progress value={readinessScore} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Strong foundation, ready for top-tier programs
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-emerald-500 dark:bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <Rocket className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{applicationsSubmitted}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted this cycle
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 h-7 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
                    View Status
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500 dark:bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{acceptanceRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Above industry average (3%)
                  </p>
                  <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Excellent</Badge>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dark:bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recommended Actions</CardTitle>
                  <CardDescription>Next steps to improve your application success</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Complete pitch deck review", desc: "Get expert feedback on your presentation", icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                    { title: "Update financial projections", desc: "Ensure your numbers are investor-ready", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                    { title: "Schedule mentor session", desc: "Connect with successful alumni", icon: Users, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" }
                  ].map((action, i) => (
                    <div key={i} className={`flex items-center p-3 rounded-lg ${action.bg} hover:opacity-80 transition-opacity cursor-pointer`}>
                      <action.icon className={`w-5 h-5 mr-3 ${action.color}`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{action.title}</h4>
                        <p className="text-xs text-muted-foreground">{action.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Don't miss these important dates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Y Combinator", date: "Oct 15", type: "Application deadline", color: "text-orange-500" },
                    { name: "500 Global", date: "Oct 30", type: "Application deadline", color: "text-blue-500" },
                    { name: "Forum Ventures", date: "Nov 1", type: "Application deadline", color: "text-emerald-500" }
                  ].map((deadline, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-800">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${deadline.color.replace('text-', 'bg-')}`} />
                        <div>
                          <h4 className="text-sm font-medium">{deadline.name}</h4>
                          <p className="text-xs text-muted-foreground">{deadline.type}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{deadline.date}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Directory Tab */}
          <TabsContent value="directory" className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Top Accelerators</h2>
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search accelerators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAccelerators.map((accelerator, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow dark:bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{accelerator.name}</CardTitle>
                        <CardDescription>{accelerator.type}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">{accelerator.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs">Stage</span>
                        <p className="font-medium">{accelerator.stage}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Acceptance</span>
                        <p className="font-medium">{accelerator.acceptanceRate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Funding</span>
                        <p className="font-medium">{accelerator.funding}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Location</span>
                        <p className="font-medium">{accelerator.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {accelerator.focus.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full mt-2 bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-white border-0">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <Resources />
          </TabsContent>

          {/* Builder Tab Placeholder */}
          <TabsContent value="builder" className="space-y-6 animate-in fade-in-50 duration-500">
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Application Builder</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  This module will help you craft perfect answers for accelerator applications using AI.
                </p>
                <Button>Launch Builder Demo</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Tab Placeholder */}
          <TabsContent value="tracking" className="space-y-6 animate-in fade-in-50 duration-500">
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Application Tracking</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Track all your submitted applications, interview dates, and status updates in one place.
                </p>
                <Button>View Tracking Demo</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Tab Placeholder */}
          <TabsContent value="community" className="space-y-6 animate-in fade-in-50 duration-500">
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Founder Community</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Connect with other founders, share feedback, and get advice from alumni.
                </p>
                <Button>Join Community</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-400 rounded flex items-center justify-center">
                  <Rocket className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-lg">PlatFormula.One</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The premier accelerator preparation platform for B2B SaaS AI startups.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-emerald-500">Dashboard</a></li>
                <li><a href="#" className="hover:text-emerald-500">Directory</a></li>
                <li><a href="#" className="hover:text-emerald-500">Application Builder</a></li>
                <li><a href="#" className="hover:text-emerald-500">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-emerald-500">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-500">Community</a></li>
                <li><a href="#" className="hover:text-emerald-500">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-500">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="tel:4156954606" className="hover:text-emerald-500">(415) 695-4606</a></li>
                <li>
                  <a href="mailto:Jonathan@Behrendterprises.com" className="hover:text-emerald-500">
                    Jonathan@Behrendterprises.com
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com/in/Jonathan-Behrendt" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">
                    LinkedIn Profile
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=jonathan-behrendt" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Follow on LinkedIn →
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              © 2025 PlatFormula.One. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-xs text-muted-foreground hover:text-emerald-500">Privacy Policy</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-emerald-500">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </ThemeProvider>
  )
}



export default App
