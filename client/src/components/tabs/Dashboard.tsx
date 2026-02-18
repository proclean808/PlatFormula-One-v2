import { useState } from 'react';
import { ArrowRight, Zap, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Dashboard Tab Component
 * 
 * Design: Hero section with feature highlights
 * - Large background image with gradient overlay
 * - Feature cards with glassmorphic design
 * - Call-to-action buttons
 * - Interactive newsletter signup
 */
export default function Dashboard({ onNavigateToPricing }: { onNavigateToPricing?: () => void }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-8">
      {/* Hero Section with Background Image */}
      <div 
        className="relative rounded-2xl overflow-hidden h-96 md:h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://files.manuscdn.com/user_upload_by_module/session_file/310419663031081065/ulwvClWrjLPCXvVg.png)',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-pink-900/80"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🏆 🏎 AI Startup Accelerator Program & ToolKit SDK 🏁
          </h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl">
            Everything Founders Need to Cross their B2B SaaS FinishLine First!
          </p>
          <Button className="gradient-btn" onClick={onNavigateToPricing}>
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

      {/* About Section */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          🏆 About PlatFormula.ONE
        </h3>
        <div className="space-y-4 text-slate-600 dark:text-slate-400">
          <p className="text-lg leading-relaxed">
            <strong className="gradient-text">🏎 AI Startup Accelerator Program & ToolKit SDK 🏁</strong>
          </p>
          <p className="leading-relaxed">
            PlatFormula.ONE is the ultimate B2B SaaS accelerator platform designed to help founders cross the finish line first. We provide everything you need to build, pitch, track, and scale your AI-powered startup with confidence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">🛠️ Comprehensive ToolKit</h4>
              <p className="text-sm">Access curated accelerator databases, application builders, pitch practice tools, and tracking systems.</p>
            </div>
            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
              <h4 className="font-semibold text-pink-900 dark:text-pink-200 mb-2">🚀 SDK for Founders</h4>
              <p className="text-sm">Pre-built components, templates, and frameworks to accelerate your B2B SaaS development and go-to-market strategy.</p>
            </div>
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <h4 className="font-semibold text-cyan-900 dark:text-cyan-200 mb-2">🤝 Community Network</h4>
              <p className="text-sm">Connect with fellow founders, share insights, and build relationships that drive success.</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">🎯 Competitive Edge</h4>
              <p className="text-sm">Stay ahead with AI-powered insights, real-time tracking, and data-driven decision-making tools.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Stay Updated
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Subscribe to our newsletter for the latest accelerator opportunities and startup insights
        </p>
        
        <form onSubmit={handleNewsletterSignup} className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg bg-white/80 dark:bg-slate-700/50 border border-purple-200 dark:border-purple-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <Button 
            type="submit" 
            className="gradient-btn"
            disabled={loading}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>

        {subscribed && (
          <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              ✓ Successfully subscribed! Check your email for confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
