import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, ArrowRight, FileText, Video, Users, DollarSign } from 'lucide-react'

export function Builder() {
  const [progress, setProgress] = useState(35)

  const modules = [
    {
      title: "Company Profile",
      description: "Basic information, team, and history",
      status: "completed",
      icon: Users
    },
    {
      title: "Product & Market",
      description: "Problem, solution, and market size",
      status: "in-progress",
      icon: FileText
    },
    {
      title: "Traction & Metrics",
      description: "Revenue, users, and growth rates",
      status: "pending",
      icon: DollarSign
    },
    {
      title: "Video Pitch",
      description: "1-minute founder introduction",
      status: "pending",
      icon: Video
    }
  ]

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Application Builder</h2>
          <p className="text-muted-foreground">Craft a winning application for top accelerators.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-500">{progress}%</div>
          <div className="text-sm text-muted-foreground">Completion</div>
        </div>
      </div>

      <Card className="border-emerald-100 dark:border-emerald-900/50">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Complete all modules to unlock the "Apply All" feature.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3 bg-emerald-100 dark:bg-emerald-900/30" />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module, index) => (
          <Card key={index} className={`hover:shadow-md transition-all ${
            module.status === 'completed' ? 'border-emerald-200 bg-emerald-50/30 dark:bg-emerald-900/10' : ''
          }`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    module.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                    module.status === 'in-progress' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <module.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                </div>
                {module.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                ) : module.status === 'in-progress' ? (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">In Progress</Badge>
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant={module.status === 'pending' ? 'outline' : 'default'}
                disabled={module.status === 'pending'}
              >
                {module.status === 'completed' ? 'Review' : 'Continue'} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
