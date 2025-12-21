import { useState } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Rocket, LayoutDashboard, BookOpen, Hammer, Mic2, LineChart, Users, Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

// Import restored components
import { Dashboard } from '@/components/Dashboard'
import { Resources } from '@/components/Resources'
import { Builder } from '@/components/Builder'
import { Tracking } from '@/components/Tracking'
import { Community } from '@/components/Community'
import { NexusYCLaunch } from '@/components/NexusYCLaunch'
import { ServicesSection } from '@/components/ServicesSection'

// Placeholder for Pitch Studio
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

function PitchStudio() {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Pitch Studio
        </h2>
        <p className="text-muted-foreground mt-2">Create, practice, and perfect your pitch</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all cursor-pointer border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center"><Mic2 className="mr-2 text-purple-500" /> AI Pitch Coach</CardTitle>
            <CardDescription>Get real-time feedback on your delivery</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-all cursor-pointer border-pink-500/20">
          <CardHeader>
            <CardTitle className="flex items-center"><LineChart className="mr-2 text-pink-500" /> Deck Analytics</CardTitle>
            <CardDescription>See how investors engage with your slides</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              PlatFormula.One
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <a href="mailto:info@platformula.one" className="hover:text-emerald-500 transition-colors">info@platformula.one</a>
              <span>•</span>
              <a href="tel:+14156954604" className="hover:text-emerald-500 transition-colors">(415) 695-4604</a>
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="inline-flex w-full md:w-auto min-w-full md:min-w-0 justify-start md:justify-center p-1 bg-muted/50 backdrop-blur-sm sticky top-20 z-40 border border-border/50 shadow-sm">
              <TabsTrigger value="dashboard" className="flex-1 md:flex-none data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex-1 md:flex-none data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="builder" className="flex-1 md:flex-none data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Hammer className="w-4 h-4 mr-2" />
                Builder
              </TabsTrigger>
              <TabsTrigger value="pitch" className="flex-1 md:flex-none data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Mic2 className="w-4 h-4 mr-2" />
                Pitch Studio
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex-1 md:flex-none data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <LineChart className="w-4 h-4 mr-2" />
                Tracking
              </TabsTrigger>
              <TabsTrigger value="community" className="flex-1 md:flex-none data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Community
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6 min-h-[calc(100vh-12rem)]">
            <TabsContent value="dashboard" className="space-y-8 animate-in fade-in-50 duration-500">
              <NexusYCLaunch />
              <Dashboard />
              <ServicesSection />
            </TabsContent>
            
            <TabsContent value="resources" className="animate-in fade-in-50 duration-500">
              <Resources />
            </TabsContent>
            
            <TabsContent value="builder" className="animate-in fade-in-50 duration-500">
              <Builder />
            </TabsContent>
            
            <TabsContent value="pitch" className="animate-in fade-in-50 duration-500">
              <PitchStudio />
            </TabsContent>
            
            <TabsContent value="tracking" className="animate-in fade-in-50 duration-500">
              <Tracking />
            </TabsContent>
            
            <TabsContent value="community" className="animate-in fade-in-50 duration-500">
              <Community />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
