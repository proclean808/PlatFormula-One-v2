import { Mic, Video, BarChart3, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Pitch Studio Tab Component
 * 
 * Design: Practice and perfect your pitch
 * - Recording and feedback tools
 * - AI-powered analysis
 * - Performance metrics
 */
export default function PitchStudio() {
  const tools = [
    {
      icon: Mic,
      title: 'Voice Recording',
      description: 'Record and analyze your pitch delivery',
      color: 'from-purple-600 to-pink-500'
    },
    {
      icon: Video,
      title: 'Video Practice',
      description: 'Practice on camera with real-time feedback',
      color: 'from-pink-500 to-orange-500'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Get detailed metrics on your pitch quality',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Award,
      title: 'AI Coaching',
      description: 'Receive personalized coaching from AI mentors',
      color: 'from-purple-600 to-cyan-500'
    }
  ];

  const metrics = [
    { label: 'Clarity Score', value: '92%' },
    { label: 'Engagement Level', value: '88%' },
    { label: 'Pace & Delivery', value: '85%' },
    { label: 'Overall Score', value: '88%' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Pitch Studio
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Practice your pitch and get AI-powered feedback to perfect your delivery
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <div key={idx} className="glass p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {tool.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {tool.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recording Section */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Start Your Practice Session
        </h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-500/20 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300 dark:border-purple-700">
              <div className="text-center">
                <Video className="w-12 h-12 text-purple-600 dark:text-pink-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  Camera preview will appear here
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Recording Tips
              </h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Maintain eye contact with the camera</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Speak clearly and at a steady pace</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Show enthusiasm for your idea</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Keep your pitch between 60-90 seconds</span>
                </li>
              </ul>
            </div>
            <Button className="gradient-btn w-full mt-6">
              Start Recording
            </Button>
          </div>
        </div>
      </div>

      {/* Sample Metrics */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Sample Performance Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="text-center p-4 bg-white/50 dark:bg-slate-700/30 rounded-lg">
              <div className="gradient-text text-3xl font-bold mb-2">
                {metric.value}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
