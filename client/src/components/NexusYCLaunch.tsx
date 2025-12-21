import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Rocket, 
  Users, 
  Brain, 
  Target,
  CheckCircle,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react'

export function NexusYCLaunch() {
  const [isLaunched, setIsLaunched] = useState(false)

  const handleLaunch = () => {
    setIsLaunched(true)
    alert('NexusYC Co-Founder Matching Platform launched! This would open the matching interface in a real application.')
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="bg-purple-100 text-purple-800 border-purple-200 mb-4">
          <Brain className="w-3 h-3 mr-1" />
          AI-Powered Matching
        </Badge>
        <h2 className="text-3xl font-bold mb-2">NexusYC Co-Founder Matching</h2>
        <p className="text-gray-600 mb-6">
          Find your perfect co-founder using advanced AI algorithms and compatibility scoring
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>AI Matching</CardTitle>
            <CardDescription>
              Advanced algorithms analyze skills, experience, and goals to find perfect matches
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Verified Profiles</CardTitle>
            <CardDescription>
              All co-founders are verified with background checks and skill assessments
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Success Tracking</CardTitle>
            <CardDescription>
              Monitor partnership success rates and get ongoing relationship support
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-emerald-400 to-green-400 text-white border-0">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="w-8 h-8 mr-3" />
            <h3 className="text-2xl font-bold">Ready to Launch NexusYC?</h3>
          </div>
          <p className="text-green-100 mb-6">
            Start finding your ideal co-founder with our AI-powered matching platform
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100"
              onClick={handleLaunch}
              disabled={isLaunched}
            >
              {isLaunched ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Launched!
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Launch NexusYC
                </>
              )}
            </Button>
            {isLaunched && (
              <Badge className="bg-white/20 text-white border-white/30">
                <Star className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {isLaunched && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">NexusYC Platform Active</CardTitle>
            <CardDescription className="text-green-600">
              Your co-founder matching platform is now live and ready to connect founders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">AI matching algorithms activated</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Profile verification system online</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Communication tools ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Success tracking enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
