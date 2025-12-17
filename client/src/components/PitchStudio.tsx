import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Presentation, 
  Video, 
  Palette, 
  User, 
  Sparkles, 
  Play, 
  Download, 
  Share2,
  Mic,
  Image as ImageIcon,
  Wand2,
  MonitorPlay
} from 'lucide-react'

export function PitchStudio() {
  const [activeTool, setActiveTool] = useState('deck')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDemoAction = (action: string) => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      alert(`${action} completed! (Demo Mode)`)
    }, 1500)
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <MonitorPlay className="w-6 h-6 mr-2 text-pink-500" />
            Pitch Studio
          </h2>
          <p className="text-muted-foreground">Create investor-ready assets with AI-powered tools</p>
        </div>
        <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800">
          <Sparkles className="w-3 h-3 mr-1" />
          Pro Suite Active
        </Badge>
      </div>

      <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="deck" className="flex items-center gap-2">
            <Presentation className="w-4 h-4" />
            <span className="hidden sm:inline">PerfectPitch Deck</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Video Studio</span>
          </TabsTrigger>
          <TabsTrigger value="graphics" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Graphics Lab</span>
          </TabsTrigger>
          <TabsTrigger value="avatar" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">AI Presenters</span>
          </TabsTrigger>
        </TabsList>

        {/* PerfectPitch Deck */}
        <TabsContent value="deck" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-t-4 border-t-pink-500">
              <CardHeader>
                <CardTitle>Deck Generator</CardTitle>
                <CardDescription>Turn your text into a 10-slide investor deck</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer">
                  <Wand2 className="w-12 h-12 text-pink-500 mb-4" />
                  <h3 className="font-medium mb-2">Auto-Generate from Application</h3>
                  <p className="text-sm text-muted-foreground mb-4">Uses your company profile data to build a draft</p>
                  <Button onClick={() => handleDemoAction('Deck Generation')} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate Draft Deck'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {['Sequoia Seed', 'YC Demo Day', 'Guy Kawasaki 10/20/30'].map((template, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
                      <span className="text-sm">{template}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleDemoAction(`Applied ${template}`)}>Use</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Video Studio */}
        <TabsContent value="video" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <CardTitle>Script to Video</CardTitle>
                <CardDescription>Create product demos and explainers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-black/50"></div>
                  <Play className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform cursor-pointer" onClick={() => handleDemoAction('Video Preview')} />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleDemoAction('Video Render')}>
                    <Video className="w-4 h-4 mr-2" />
                    Render Video
                  </Button>
                  <Button variant="outline" onClick={() => handleDemoAction('Script Edit')}>
                    Edit Script
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voiceover Studio</CardTitle>
                <CardDescription>Professional AI narration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Sarah (Professional)', 'Mike (Energetic)', 'Emma (Calm)'].map((voice, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Mic className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium">{voice}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleDemoAction(`Selected ${voice}`)}>Select</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Graphics Lab */}
        <TabsContent value="graphics" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Social Posts', icon: Share2, color: 'text-blue-500' },
              { title: 'Deck Assets', icon: Presentation, color: 'text-pink-500' },
              { title: 'Logo Maker', icon: Sparkles, color: 'text-purple-500' },
              { title: 'Infographics', icon: ImageIcon, color: 'text-emerald-500' }
            ].map((item, i) => (
              <Card key={i} className="hover:shadow-lg transition-all cursor-pointer" onClick={() => handleDemoAction(`Opened ${item.title}`)}>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <item.icon className={`w-8 h-8 mb-3 ${item.color}`} />
                  <h3 className="font-medium">{item.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Generations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                    Asset Preview {i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Presenters */}
        <TabsContent value="avatar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Alex', style: 'Professional', img: 'bg-blue-100 dark:bg-blue-900/20' },
              { name: 'Sarah', style: 'Casual', img: 'bg-green-100 dark:bg-green-900/20' },
              { name: 'David', style: 'Tech', img: 'bg-purple-100 dark:bg-purple-900/20' }
            ].map((avatar, i) => (
              <Card key={i} className="overflow-hidden group cursor-pointer border-t-4 border-t-transparent hover:border-t-pink-500 transition-all">
                <div className={`aspect-[3/4] ${avatar.img} flex items-center justify-center`}>
                  <User className="w-24 h-24 text-gray-400 opacity-50" />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">{avatar.name}</h3>
                    <Badge variant="secondary">{avatar.style}</Badge>
                  </div>
                  <Button className="w-full mt-2" onClick={() => handleDemoAction(`Selected Avatar: ${avatar.name}`)}>
                    Create Video
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
