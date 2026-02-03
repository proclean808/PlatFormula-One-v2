import { useState } from 'react';
import { FileText, Lightbulb, Target, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

/**
 * Builder Tab Component
 * 
 * Design: AI-Powered Accelerator Application Builder
 * - Fully functional multi-step form with state management
 * - Template selection with different accelerator formats
 * - Form validation and progress tracking
 * - Export functionality
 */
export default function Builder() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Company Basics
    companyName: '',
    industry: '',
    stage: '',
    website: '',
    
    // Step 2: Problem & Solution
    problem: '',
    solution: '',
    uniqueValue: '',
    targetMarket: '',
    
    // Step 3: Traction & Metrics
    traction: '',
    revenue: '',
    users: '',
    growthRate: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const steps = [
    { 
      number: 1, 
      title: 'Company Basics', 
      description: 'Tell us about your startup',
      icon: FileText,
      fields: ['companyName', 'industry', 'stage', 'website']
    },
    { 
      number: 2, 
      title: 'Problem & Solution', 
      description: 'Define the problem you\'re solving',
      icon: Lightbulb,
      fields: ['problem', 'solution', 'uniqueValue', 'targetMarket']
    },
    { 
      number: 3, 
      title: 'Traction & Metrics', 
      description: 'Show your progress',
      icon: Target,
      fields: ['traction', 'revenue', 'users', 'growthRate']
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
      id: 'yc',
      name: 'Y Combinator',
      color: 'from-orange-500 to-orange-600',
      questions: 12,
      time: '~45 min',
      difficulty: 'Moderate'
    },
    {
      id: 'techstars',
      name: 'Techstars',
      color: 'from-blue-500 to-blue-600',
      questions: 15,
      time: '~60 min',
      difficulty: 'Detailed'
    },
    {
      id: '500global',
      name: '500 Global',
      color: 'from-green-500 to-green-600',
      questions: 10,
      time: '~30 min',
      difficulty: 'Quick'
    },
    {
      id: 'generic',
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
      description: 'Ensure your application meets accelerator standards'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const currentStepData = steps[stepNumber - 1];
    const errors: Record<string, string> = {};
    
    currentStepData.fields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = 'This field is required';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      if (validateStep(currentStep)) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleExport = () => {
    const applicationText = `
APPLICATION FOR ${selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : 'ACCELERATOR'}

COMPANY BASICS
--------------
Company Name: ${formData.companyName}
Industry: ${formData.industry}
Stage: ${formData.stage}
Website: ${formData.website}

PROBLEM & SOLUTION
------------------
Problem: ${formData.problem}
Solution: ${formData.solution}
Unique Value Proposition: ${formData.uniqueValue}
Target Market: ${formData.targetMarket}

TRACTION & METRICS
------------------
Current Traction: ${formData.traction}
Revenue: ${formData.revenue}
Users: ${formData.users}
Growth Rate: ${formData.growthRate}

Generated by PlatFormula.ONE
    `.trim();

    const blob = new Blob([applicationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.companyName || 'application'}-accelerator-application.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const progress = (currentStep / 4) * 100;

  // Template Selection View
  if (!selectedTemplate) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Application Builder
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Choose an accelerator template to get started with your application
          </p>
        </div>

        {/* AI Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {aiFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-4">
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

        {/* Template Selection */}
        <div className="glass p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Select Application Template
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className="p-6 bg-white/50 dark:bg-slate-700/30 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all cursor-pointer group border-2 border-transparent hover:border-purple-500"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-4`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                  {template.name}
                </h4>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <p>{template.questions} questions</p>
                  <p>{template.time}</p>
                  <Badge variant="secondary">{template.difficulty}</Badge>
                </div>
                <Button className="w-full gradient-btn group-hover:scale-105 transition-transform">
                  Select Template
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Multi-Step Form View
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {templates.find(t => t.id === selectedTemplate)?.name} Application
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Step {currentStep} of 4: {steps[currentStep - 1].title}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Progress
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <div
              key={step.number}
              className={`p-4 rounded-lg text-center transition-all ${
                isActive 
                  ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white scale-105' 
                  : isCompleted
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? 'animate-pulse' : ''}`} />
              <p className="text-xs font-medium">{step.title}</p>
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="glass p-8 rounded-2xl">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Company Basics
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Company Name *
              </label>
              <Input
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="e.g., DataFlow AI"
                className={validationErrors.companyName ? 'border-red-500' : ''}
              />
              {validationErrors.companyName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.companyName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Industry *
              </label>
              <Input
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                placeholder="e.g., AI/ML, SaaS, FinTech"
                className={validationErrors.industry ? 'border-red-500' : ''}
              />
              {validationErrors.industry && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.industry}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Stage *
              </label>
              <select
                value={formData.stage}
                onChange={(e) => handleInputChange('stage', e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${validationErrors.stage ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
              >
                <option value="">Select stage</option>
                <option value="idea">Idea</option>
                <option value="mvp">MVP</option>
                <option value="early-traction">Early Traction</option>
                <option value="growth">Growth</option>
              </select>
              {validationErrors.stage && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.stage}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Website *
              </label>
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourcompany.com"
                className={validationErrors.website ? 'border-red-500' : ''}
              />
              {validationErrors.website && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.website}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Problem & Solution
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What problem are you solving? *
              </label>
              <Textarea
                value={formData.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                placeholder="Describe the problem your target customers face..."
                rows={4}
                className={validationErrors.problem ? 'border-red-500' : ''}
              />
              {validationErrors.problem && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.problem}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What is your solution? *
              </label>
              <Textarea
                value={formData.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                placeholder="Describe how your product solves this problem..."
                rows={4}
                className={validationErrors.solution ? 'border-red-500' : ''}
              />
              {validationErrors.solution && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.solution}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What makes you unique? *
              </label>
              <Textarea
                value={formData.uniqueValue}
                onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
                placeholder="What's your competitive advantage or unique insight?"
                rows={3}
                className={validationErrors.uniqueValue ? 'border-red-500' : ''}
              />
              {validationErrors.uniqueValue && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.uniqueValue}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Target Market *
              </label>
              <Input
                value={formData.targetMarket}
                onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                placeholder="e.g., B2B SaaS companies with 50-500 employees"
                className={validationErrors.targetMarket ? 'border-red-500' : ''}
              />
              {validationErrors.targetMarket && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.targetMarket}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Traction & Metrics
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Current Traction *
              </label>
              <Textarea
                value={formData.traction}
                onChange={(e) => handleInputChange('traction', e.target.value)}
                placeholder="Describe your current traction, milestones, or achievements..."
                rows={4}
                className={validationErrors.traction ? 'border-red-500' : ''}
              />
              {validationErrors.traction && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.traction}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Revenue (if any) *
              </label>
              <Input
                value={formData.revenue}
                onChange={(e) => handleInputChange('revenue', e.target.value)}
                placeholder="e.g., $50K MRR, $0 (pre-revenue)"
                className={validationErrors.revenue ? 'border-red-500' : ''}
              />
              {validationErrors.revenue && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.revenue}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Number of Users *
              </label>
              <Input
                value={formData.users}
                onChange={(e) => handleInputChange('users', e.target.value)}
                placeholder="e.g., 1,000 active users"
                className={validationErrors.users ? 'border-red-500' : ''}
              />
              {validationErrors.users && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.users}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Growth Rate *
              </label>
              <Input
                value={formData.growthRate}
                onChange={(e) => handleInputChange('growthRate', e.target.value)}
                placeholder="e.g., 20% MoM"
                className={validationErrors.growthRate ? 'border-red-500' : ''}
              />
              {validationErrors.growthRate && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.growthRate}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Review Your Application
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-400 mb-2">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Application Complete!</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your application is ready to export. Review the details below before downloading.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white/50 dark:bg-slate-700/30 rounded-lg">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Company Basics</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p><strong>Company:</strong> {formData.companyName}</p>
                    <p><strong>Industry:</strong> {formData.industry}</p>
                    <p><strong>Stage:</strong> {formData.stage}</p>
                    <p><strong>Website:</strong> {formData.website}</p>
                  </div>
                </div>

                <div className="p-4 bg-white/50 dark:bg-slate-700/30 rounded-lg">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Problem & Solution</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <p><strong>Problem:</strong> {formData.problem}</p>
                    <p><strong>Solution:</strong> {formData.solution}</p>
                    <p><strong>Unique Value:</strong> {formData.uniqueValue}</p>
                    <p><strong>Target Market:</strong> {formData.targetMarket}</p>
                  </div>
                </div>

                <div className="p-4 bg-white/50 dark:bg-slate-700/30 rounded-lg">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Traction & Metrics</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <p><strong>Traction:</strong> {formData.traction}</p>
                    <p><strong>Revenue:</strong> {formData.revenue}</p>
                    <p><strong>Users:</strong> {formData.users}</p>
                    <p><strong>Growth Rate:</strong> {formData.growthRate}</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleExport} className="w-full gradient-btn">
                <Download className="w-5 h-5 mr-2" />
                Export Application
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={handleNext}
            className="gradient-btn flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setSelectedTemplate(null);
              setCurrentStep(1);
              setFormData({
                companyName: '',
                industry: '',
                stage: '',
                website: '',
                problem: '',
                solution: '',
                uniqueValue: '',
                targetMarket: '',
                traction: '',
                revenue: '',
                users: '',
                growthRate: ''
              });
            }}
            variant="outline"
          >
            Start New Application
          </Button>
        )}
      </div>
    </div>
  );
}
