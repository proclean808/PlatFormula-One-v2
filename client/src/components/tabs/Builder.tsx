import { useState } from 'react';
import { FileText, Lightbulb, Target, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/**
 * Builder Tab Component
 * 
 * Design: AI-Powered Accelerator Application Builder
 * - Step-by-step application creation
 * - AI-assisted content generation
 * - Template library for different accelerators
 * - Real-time validation and feedback
 */
export default function Builder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    problem: '',
    solution: '',
    traction: ''
  });

  const steps = [
    { 
      number: 1, 
      title: 'Company Basics', 
      description: 'Tell us about your startup',
      icon: FileText,
      fields: ['companyName', 'industry', 'stage']
    },
    { 
      number: 2, 
      title: 'Problem & Solution', 
      description: 'Define the problem you\'re solving',
      icon: Lightbulb,
      fields: ['problem', 'solution', 'uniqueValue']
    },
    { 
      number: 3, 
      title: 'Traction & Metrics', 
      description: 'Show your progress',
      icon: Target,
      fields: ['traction', 'revenue', 'users']
    },
    { 
      number: 4, 
      title: 'Review & Export', 
      description: 'Finalize your application',
      icon: CheckCircle2,
      fields: []
    }
  ];

  const templates = [
    {
      name: 'Y Combinator',
      color: 'from-orange-500 to-orange-600',
      questions: 12,
      time: '~45 min',
      difficulty: 'Moderate'
    },
    {
      name: 'Techstars',
      color: 'from-blue-500 to-blue-600',
      questions: 15,
      time: '~60 min',
      difficulty: 'Detailed'
    },
    {
      name: '500 Global',
      color: 'from-green-500 to-green-600',
      questions: 10,
      time: '~30 min',
      difficulty: 'Quick'
    },
    {
      name: 'Generic Template',
      color: 'from-purple-500 to-pink-500',
      questions: 8,
      time: '~20 min',
      difficulty: 'Basic'
    }
  ];

  const aiFeatures = [
    {
      icon: Sparkles,
      title: 'AI Content Generation',
      description: 'Generate compelling answers based on your inputs'
    },
    {
      icon: Target,
      title: 'Smart Suggestions',
      description: 'Get real-time feedback on your responses'
    },
    {
      icon: CheckCircle2,
      title: 'Validation & Review',
      description: 'Ensure your application meets all requirements'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          AI-Powered Application Builder
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Build winning accelerator applications with AI assistance and expert templates
        </p>
      </div>

      {/* Template Selection */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Choose Your Template
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template, idx) => (
            <div
              key={idx}
              className="p-6 bg-white/50 dark:bg-slate-700/30 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all cursor-pointer group border-2 border-transparent hover:border-purple-500"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-4`}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                {template.name}
              </h4>
              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <p>{template.questions} questions</p>
                <p>{template.time}</p>
                <p className="font-medium">{template.difficulty}</p>
              </div>
              <Button className="w-full mt-4 gradient-btn text-sm">
                Use Template
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Builder */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Build Your Application
        </h3>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={idx} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isActive 
                          ? 'bg-gradient-to-br from-purple-600 to-pink-500 scale-110' 
                          : isCompleted
                          ? 'bg-green-500'
                          : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-xs font-medium text-center ${
                      isActive ? 'text-purple-600 dark:text-pink-400' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 ${
                      isCompleted ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-8">
          {currentStep === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Company Name *
                </label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter your company name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Industry
                </label>
                <Input
                  placeholder="e.g., B2B SaaS, FinTech, HealthTech"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Stage
                </label>
                <Input
                  placeholder="e.g., Idea, MVP, Revenue"
                  className="w-full"
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  What problem are you solving? *
                </label>
                <Textarea
                  value={formData.problem}
                  onChange={(e) => handleInputChange('problem', e.target.value)}
                  placeholder="Describe the problem in 2-3 sentences..."
                  className="w-full min-h-[100px]"
                />
                <Button variant="outline" size="sm" className="mt-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with AI
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Your Solution *
                </label>
                <Textarea
                  value={formData.solution}
                  onChange={(e) => handleInputChange('solution', e.target.value)}
                  placeholder="Explain your solution..."
                  className="w-full min-h-[100px]"
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Traction & Metrics *
                </label>
                <Textarea
                  value={formData.traction}
                  onChange={(e) => handleInputChange('traction', e.target.value)}
                  placeholder="Share your key metrics, growth, and achievements..."
                  className="w-full min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Monthly Revenue
                  </label>
                  <Input
                    type="number"
                    placeholder="$0"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Active Users
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Application Ready!
              </h4>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Review your application and export to PDF or Word
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="gradient-btn">
                  Export to PDF
                </Button>
                <Button variant="outline">
                  Export to Word
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              className="gradient-btn"
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            >
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* AI Features */}
      <div className="glass p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          AI-Powered Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
