import { useState } from 'react';
import { Mic, Video, BarChart3, Award, Play, Pause, RotateCcw, CheckCircle, AlertCircle, TrendingUp, Smartphone, Watch, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

/**
 * Pitch Studio Tab Component
 * 
 * Design: Practice and perfect your pitch with AI feedback
 * - Voice and video recording
 * - Real-time AI analysis
 * - Performance metrics and coaching
 * - Pitch deck templates
 */
export default function PitchStudio() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const tools = [
    {
      icon: Mic,
      title: 'Voice Recording',
      description: 'Record and analyze your pitch delivery with AI feedback on pace, clarity, and filler words',
      color: 'from-purple-600 to-pink-500',
      action: 'Start Recording'
    },
    {
      icon: Video,
      title: 'Video Practice',
      description: 'Practice on camera with real-time feedback on body language, eye contact, and confidence',
      color: 'from-pink-500 to-orange-500',
      action: 'Start Video'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Get detailed metrics on pitch quality, engagement level, and improvement areas',
      color: 'from-cyan-500 to-blue-500',
      action: 'View Analytics'
    },
    {
      icon: Award,
      title: 'AI Coaching',
      description: 'Receive personalized coaching from AI mentors trained on successful pitch patterns',
      color: 'from-purple-600 to-cyan-500',
      action: 'Get Coaching'
    }
  ];

  const metrics = [
    { label: 'Clarity Score', value: 92, color: 'bg-green-500', feedback: 'Excellent' },
    { label: 'Engagement Level', value: 88, color: 'bg-blue-500', feedback: 'Very Good' },
    { label: 'Pace & Delivery', value: 85, color: 'bg-cyan-500', feedback: 'Good' },
    { label: 'Confidence', value: 78, color: 'bg-yellow-500', feedback: 'Needs Work' }
  ];

  const pitchTips = [
    {
      icon: CheckCircle,
      tip: 'Start with a hook',
      description: 'Grab attention in the first 10 seconds with a compelling statement or question'
    },
    {
      icon: TrendingUp,
      tip: 'Show traction',
      description: 'Lead with your strongest metrics and growth numbers'
    },
    {
      icon: AlertCircle,
      tip: 'Address the problem',
      description: 'Make investors feel the pain point before presenting your solution'
    }
  ];

  const pitchDeckTemplates = [
    {
      name: 'YC Standard Deck',
      slides: 10,
      time: '3-5 min',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Investor Pitch',
      slides: 15,
      time: '10-15 min',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Demo Day',
      slides: 8,
      time: '2-3 min',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'One-Pager',
      slides: 1,
      time: '1 min',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const handleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setHasRecording(true);
      }, 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Pitch Studio
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Practice your pitch and get AI-powered feedback to perfect your delivery
        </p>
      </div>

      {/* Recording Studio */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Practice Your Pitch
        </h3>
        
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl p-8 text-white text-center mb-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {isRecording ? (
                <Pause className="w-12 h-12 animate-pulse" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </div>
            
            <div>
              <p className="text-2xl font-bold mb-2">
                {isRecording ? 'Recording...' : hasRecording ? 'Recording Complete' : 'Ready to Record'}
              </p>
              <p className="text-purple-100">
                {isRecording ? 'Speak clearly and confidently' : hasRecording ? 'Review your performance below' : 'Click the button to start recording'}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleRecording}
                disabled={isRecording}
                className="bg-white text-purple-600 hover:bg-purple-50"
              >
                {isRecording ? (
                  <>
                    <Pause className="mr-2 w-5 h-5" /> Recording...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 w-5 h-5" /> Start Recording
                  </>
                )}
              </Button>
              
              {hasRecording && (
                <Button
                  onClick={() => setHasRecording(false)}
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <RotateCcw className="mr-2 w-5 h-5" /> Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        {hasRecording && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
              Performance Analysis
            </h4>
            {metrics.map((metric, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {metric.label}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {metric.value}% - {metric.feedback}
                  </span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>AI Feedback:</strong> Your pitch shows strong clarity and engagement. Work on building confidence by practicing your opening hook more. Consider slowing down slightly in the problem section to let key points land.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Practice Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <div key={idx} className="glass p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {tool.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {tool.description}
              </p>
              <Button variant="outline" className="w-full">
                {tool.action}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Pitch Deck Templates */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Pitch Deck Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pitchDeckTemplates.map((template, idx) => (
            <div
              key={idx}
              className="p-6 bg-white/50 dark:bg-slate-700/30 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-4`}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                {template.name}
              </h4>
              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mb-4">
                <p>{template.slides} slides</p>
                <p>{template.time}</p>
              </div>
              <Button className="w-full gradient-btn text-sm">
                Use Template
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Pitch Tips */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Expert Pitch Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pitchTips.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.tip}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MemBrain Whisperer Companion App */}
      <div className="glass p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              MemBrain Whisperer
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Live Meeting Co-Pilot for VC Pitches
            </p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Take your pitch from practice to live meetings with our Android companion app. MemBrain Whisperer runs on Samsung S25 Ultra and pairs with Galaxy Watch 7 to deliver real-time, covert AI insights during investor conversations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-4 h-4 text-green-600 dark:text-green-400" />
              <h4 className="font-semibold text-green-900 dark:text-green-200 text-sm">Live Audio Capture</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">16 kHz PCM capture with Gemini 2.5 Flash for real-time RAG-injected insights on CAC, LTV, and valuation</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Watch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">Covert HUD Push</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">5-word insights transmitted to Galaxy Watch 7 via BLE with haptic alerts — glanceable during live conversation</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h4 className="font-semibold text-purple-900 dark:text-purple-200 text-sm">Zero-Trust Security</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Biometric dead-man's switch — watch must pulse within 5 seconds or audio capture is instantly severed</p>
          </div>
        </div>
        <Button variant="outline" className="w-full md:w-auto">
          <Smartphone className="mr-2 w-4 h-4" /> View Companion App Details
        </Button>
      </div>

      {/* CTA */}
      <div className="glass p-8 rounded-2xl text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Ready to Pitch Investors?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Book a 1-on-1 session with experienced founders and investors
        </p>
        <Button className="gradient-btn">
          Schedule Mock Pitch Session
        </Button>
      </div>
    </div>
  );
}
