import { Code2, Layers, Zap, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Builder Tab Component
 * 
 * Design: Application builder interface
 * - Builder tools and features
 * - Step-by-step guide
 * - Integration options
 */
export default function Builder() {
  const features = [
    {
      icon: Code2,
      title: 'No-Code Builder',
      description: 'Build applications without writing a single line of code',
      color: 'from-purple-600 to-pink-500'
    },
    {
      icon: Layers,
      title: 'Component Library',
      description: 'Drag-and-drop components for rapid development',
      color: 'from-pink-500 to-orange-500'
    },
    {
      icon: Zap,
      title: 'AI Integration',
      description: 'Integrate AI features with one click',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Palette,
      title: 'Design System',
      description: 'Professional design templates and themes',
      color: 'from-purple-600 to-cyan-500'
    }
  ];

  const steps = [
    { number: '1', title: 'Choose Template', description: 'Select from pre-built templates' },
    { number: '2', title: 'Customize Design', description: 'Personalize colors, fonts, and layout' },
    { number: '3', title: 'Add Features', description: 'Integrate AI, payments, and more' },
    { number: '4', title: 'Deploy', description: 'Launch your app in seconds' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div 
        className="relative rounded-2xl overflow-hidden h-80 md:h-96 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/ai-innovation.png)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-pink-900/80"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Build Your App with AI
          </h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl">
            Create powerful applications without coding expertise
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="glass p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Steps Section */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Build in 4 Simple Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 -z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass p-8 rounded-2xl text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Ready to Build?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Start building your next great app today
        </p>
        <Button className="gradient-btn">
          Launch Builder
        </Button>
      </div>
    </div>
  );
}
