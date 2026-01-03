import { ArrowRight, Zap, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Dashboard Tab Component
 * 
 * Design: Hero section with feature highlights
 * - Large background image with gradient overlay
 * - Feature cards with glassmorphic design
 * - Call-to-action buttons
 */
export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section with Background Image */}
      <div 
        className="relative rounded-2xl overflow-hidden h-96 md:h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/hero-gradient-abstract.png)',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-pink-900/80"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Your Startup Dashboard
          </h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl">
            Access all the tools you need to build, pitch, and scale your AI-powered startup
          </p>
          <Button className="gradient-btn">
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Zap,
            title: 'AI-Powered Tools',
            description: 'Leverage cutting-edge AI to accelerate your startup journey',
            color: 'from-purple-600 to-pink-500'
          },
          {
            icon: Users,
            title: 'Global Community',
            description: 'Connect with founders, investors, and mentors worldwide',
            color: 'from-pink-500 to-orange-500'
          },
          {
            icon: TrendingUp,
            title: 'Growth Tracking',
            description: 'Monitor your progress with real-time analytics and insights',
            color: 'from-cyan-500 to-blue-500'
          },
          {
            icon: Zap,
            title: 'Pitch Perfect',
            description: 'Practice and perfect your pitch with AI feedback',
            color: 'from-purple-600 to-cyan-500'
          }
        ].map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="glass p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Platform Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Active Startups', value: '2,500+' },
            { label: 'Success Rate', value: '78%' },
            { label: 'Total Funding', value: '$150M+' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="gradient-text text-4xl font-bold mb-2">
                {stat.value}
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
