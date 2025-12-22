import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  BarChart3,
  Target,
  Users,
  Award,
  RefreshCw,
  Eye,
  Download,
  MessageSquare
} from 'lucide-react'

interface Application {
  accelerator: string;
  submittedAt: string;
  deadline: string;
  status: 'submitted' | 'under-review' | 'interview' | 'accepted' | 'rejected';
}

interface Analytics {
  totalApplications: number;
  acceptanceRate: number;
  averageResponseTime: number;
  successfulApplications: number;
}

export function TrackingDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [analytics, setAnalytics] = useState<Analytics>({
    totalApplications: 0,
    acceptanceRate: 0,
    averageResponseTime: 0,
    successfulApplications: 0
  })

  useEffect(() => {
    loadApplications()
    calculateAnalytics()
  }, [])

  const loadApplications = () => {
    const savedApplications = JSON.parse(localStorage.getItem('platformula_applications') || '[]')
    setApplications(savedApplications)
  }

  const calculateAnalytics = () => {
    const savedApplications = JSON.parse(localStorage.getItem('platformula_applications') || '[]')
    const total = savedApplications.length
    const successful = savedApplications.filter((app: Application) => app.status === 'accepted').length
    const rate = total > 0 ? (successful / total) * 100 : 0
    
    setAnalytics({
      totalApplications: total,
      acceptanceRate: rate,
      averageResponseTime: 14, // Mock data
      successfulApplications: successful
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'interview': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'under-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'submitted': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <AlertCircle className="w-4 h-4" />
      case 'interview': return <Users className="w-4 h-4" />
      case 'under-review': return <Clock className="w-4 h-4" />
      case 'submitted': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleViewDetails = (application: Application) => {
    alert(`Viewing details for ${application.accelerator} application. This would show full application details and timeline.`)
  }

  const handleDownloadReport = () => {
    alert('Downloading comprehensive application report. This would generate a PDF with all your application data and analytics.')
  }

  const handleRefreshStatus = () => {
    alert('Refreshing application statuses. This would check for updates from accelerator programs.')
    // Simulate status update
    setTimeout(() => {
      const updatedApplications = applications.map(app => {
        if (app.status === 'submitted' && Math.random() > 0.7) {
          return { ...app, status: 'under-review' }
        }
        return app
      })
      setApplications(updatedApplications as Application[])
      localStorage.setItem('platformula_applications', JSON.stringify(updatedApplications))
    }, 1000)
  }

  const handleScheduleFollowUp = (application: Application) => {
    alert(`Scheduling follow-up for ${application.accelerator}. This would open a calendar to set a reminder.`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Application Tracking</h2>
          <p className="text-gray-600">Monitor your accelerator applications and success metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={handleRefreshStatus}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
          <Button 
            variant="outline"
            onClick={handleDownloadReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 mb-2">{analytics.totalApplications}</div>
            <p className="text-sm text-blue-600">Submitted across all programs</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Award className="w-5 h-5 mr-2 text-green-600" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 mb-2">{analytics.acceptanceRate.toFixed(1)}%</div>
            <p className="text-sm text-green-600">Above industry average (3%)</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 mb-2">{analytics.averageResponseTime} days</div>
            <p className="text-sm text-purple-600">Typical review period</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-600" />
              Acceptances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700 mb-2">{analytics.successfulApplications}</div>
            <p className="text-sm text-orange-600">Programs accepted to</p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
            <CardDescription>Track the status of all your accelerator applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((application, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{application.accelerator}</h3>
                        <p className="text-sm text-gray-600">
                          Submitted on {new Date(application.submittedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Deadline: {new Date(application.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">{application.status.replace('-', ' ')}</span>
                      </Badge>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(application)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleScheduleFollowUp(application)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Follow Up
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Timeline */}
                  <div className="mt-4 pl-16">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Submitted</span>
                      </div>
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <div className={`flex items-center space-x-2 ${
                        ['under-review', 'interview', 'accepted', 'rejected'].includes(application.status)
                          ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        <Clock className="w-4 h-4" />
                        <span>Under Review</span>
                      </div>
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <div className={`flex items-center space-x-2 ${
                        ['interview', 'accepted', 'rejected'].includes(application.status)
                          ? 'text-purple-600' : 'text-gray-400'
                      }`}>
                        <Users className="w-4 h-4" />
                        <span>Interview</span>
                      </div>
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <div className={`flex items-center space-x-2 ${
                        application.status === 'accepted' ? 'text-green-600' :
                        application.status === 'rejected' ? 'text-red-600' : 'text-gray-400'
                      }`}>
                        {application.status === 'accepted' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : application.status === 'rejected' ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Target className="w-4 h-4" />
                        )}
                        <span className="capitalize">
                          {application.status === 'accepted' ? 'Accepted' : 
                           application.status === 'rejected' ? 'Rejected' : 'Decision'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Start applying to accelerators using our Application Builder. Your applications will appear here automatically.
            </p>
            <Button>
              Go to Application Builder
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
