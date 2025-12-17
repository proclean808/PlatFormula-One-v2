import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Bot, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  RefreshCw,
  ArrowRight,
  Save
} from 'lucide-react'

export function ApplicationBuilder() {
  const [activeStep, setActiveStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')

  const steps = [
    { id: 1, title: "Company Basics", status: "completed" },
    { id: 2, title: "Problem & Solution", status: "current" },
    { id: 3, title: "Market & Traction", status: "upcoming" },
    { id: 4, title: "Team", status: "upcoming" }
  ]

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent("Our solution leverages proprietary computer vision algorithms to automate quality control in manufacturing lines. Unlike traditional sensors that require manual calibration, our system self-adapts to new product lines in under 15 minutes, reducing downtime by 40% and defect rates by 95%. We've already secured 3 pilot programs with Fortune 500 manufacturers.")
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Bot className="w-6 h-6 mr-2 text-purple-500" />
            AI Application Builder
          </h2>
          <p className="text-muted-foreground">Craft winning answers for YC, Techstars, and 500 Global applications</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by GPT-4o
        </Badge>
      </div>

      {/* Progress Stepper */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-10 transform -translate-y-1/2"></div>
        <div className="flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center bg-background px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-colors ${
                step.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                step.status === 'current' ? 'bg-white dark:bg-gray-900 border-purple-500 text-purple-500' :
                'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400'
              }`}>
                {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : step.id}
              </div>
              <span className={`text-xs font-medium ${
                step.status === 'current' ? 'text-purple-600 dark:text-purple-400' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <Card className="lg:col-span-2 border-t-4 border-t-purple-500">
          <CardHeader>
            <CardTitle>Describe your solution</CardTitle>
            <CardDescription>
              Explain what you're building and why it's 10x better than existing alternatives.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Key Value Proposition</label>
              <Textarea 
                placeholder="e.g., We automate quality control using computer vision..." 
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Customer</label>
              <Input placeholder="e.g., Mid-sized automotive manufacturers" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Traction</label>
              <Input placeholder="e.g., 3 pilot programs, $10k MRR" />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Answer
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Output Section */}
        <Card className="bg-gray-50 dark:bg-gray-900/50 border-dashed">
          <CardHeader>
            <CardTitle className="text-base">AI Suggestion</CardTitle>
            <CardDescription>Optimized for YC application format</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border text-sm leading-relaxed shadow-sm">
                  {generatedContent}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
                <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
                  <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                  <p>This answer uses the "Problem-Solution-Proof" framework favored by top accelerators.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Bot className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Fill out the details and click generate to see AI magic happen.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="ghost">Back</Button>
        <Button>
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
