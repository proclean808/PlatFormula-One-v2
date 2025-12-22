import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Handshake, Scale, FileText, TrendingUp, DollarSign, Brain, Zap } from 'lucide-react'
import SimplePricingTiers from './SimplePricingTiers';

interface ServicesSectionProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export default function ServicesSection({ onOpenAuth }: ServicesSectionProps) {
  const coreServices = [
    {
      icon: Target,
      title: "Accelerator Program Navigation & Application Optimization",
      description: "Promote top accelerators with sizable seed funding. Leverage GenAI multi-modal aspects to boost your Application Acceptance Score with bleeding-edge innovative content.",
      highlight: true
    },
    {
      icon: Handshake,
      title: "Warm Introductions",
      description: "Direct connections to Bay Area accelerators, venture capital firms, and angel investor networks. Strategic partnerships to accelerate your growth.",
      highlight: true
    },
    {
      icon: FileText,
      title: "IP Protection & Valuation",
      description: "Copyright, trademark, and patent valuations and searches. Comprehensive IP strategy and portfolio development for your innovations.",
      highlight: false
    },
    {
      icon: Brain,
      title: "Business Model Validation & Refinement",
      description: "Feature set validation and refinement. Business model optimization, market fit analysis, and pricing strategy development.",
      highlight: true
    },
    {
      icon: Scale,
      title: "Corporate Legal",
      description: "Entity formation, equity/cap table management, contracts, and legal infrastructure for your startup's foundation.",
      highlight: false
    },
    {
      icon: DollarSign,
      title: "Fundraising & Investor Relations",
      description: "Investor network access, pitch deck development, and comprehensive fundraising strategy to secure your next round.",
      highlight: false
    }
  ]

  const preferredProviders = [
    {
      name: "HubSpot",
      logo: "🎯",
      description: "Comprehensive marketing, sales, and service platform that helps businesses grow.",
      category: "Marketing & Sales"
    },
    {
      name: "Rippling",
      logo: "💼",
      description: "Modern payroll and benefits platform that streamlines HR operations for startups.",
      category: "HR & Payroll"
    },
    {
      name: "Mercury Bank",
      logo: "🏦",
      description: "Digital banking built specifically for startups with powerful financial tools.",
      category: "Banking"
    },
    {
      name: "Sound Advice Bookkeeping",
      logo: "📊",
      description: "Expert bookkeeping services tailored for startups with tech expertise.",
      category: "Accounting"
    },
    {
      name: "Elevato Studios Marketing",
      logo: "🚀",
      description: "Full-service digital marketing and brand development for startups.",
      category: "Marketing"
    },
    {
      name: "MapMatix",
      logo: "⚙️",
      description: "Business automation specialists for sales, marketing, and data management.",
      category: "Automation"
    },
    {
      name: "GritHR Solutions",
      logo: "👥",
      description: "Full-service HR solutions streamlining hiring, payroll, and talent management.",
      category: "HR Solutions"
    },
    {
      name: "Advanced CFO",
      logo: "💰",
      description: "Fractional CFO services providing financial clarity and strategic forecasting.",
      category: "Financial"
    },
    {
      name: "Jaffe Insurance",
      logo: "🛡️",
      description: "Insurance solutions for startups and growing businesses.",
      category: "Insurance"
    }
  ]

  return (
    <div className="space-y-12">
      {/* Core Services Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Core Services</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Bay Area AI Startup Ecosystem support through strategic equity partnerships, 
            tailored to each venture's unique stage and potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreServices.map((service, index) => {
            const Icon = service.icon
            return (
              <Card 
                key={index} 
                className={`hover:shadow-lg transition-shadow ${
                  service.highlight 
                    ? 'border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20' 
                    : ''
                }`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    service.highlight 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600' 
                      : 'bg-gradient-to-r from-blue-400 to-purple-400'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg leading-tight">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Key Differentiators */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-blue-950/30 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-center mb-6">Why Choose PlatFormula.ONE</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">GenAI-Powered Applications</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bleeding-edge multi-modal AI to boost your acceptance scores
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Handshake className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Bay Area Network</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Warm intros to local accelerators, VCs, and angel investors
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Comprehensive Support</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              From IP protection to business model validation and beyond
            </p>
          </div>
        </div>
      </div>

      {/* Preferred Provider Roster Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Preferred Provider Roster</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Beyond our core services, startups gain access to our curated roster of third-party service providers 
            offering special rates for accounting, payroll, insurance, benefits, fundraising support, specialized AI 
            consulting, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {preferredProviders.map((provider, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-3">{provider.logo}</div>
                <CardTitle className="text-lg">{provider.name}</CardTitle>
                <CardDescription className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {provider.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {provider.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Choose Your Tier</h2>
        <SimplePricingTiers onOpenAuth={onOpenAuth} />
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <Card className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="py-8">
            <h3 className="text-2xl font-bold mb-3">Ready to Accelerate Your Startup?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Join the Bay Area AI Startup Ecosystem. Get access to our comprehensive service network, 
              GenAI-powered application tools, and warm introductions to accelerators and investors.
            </p>
            <button 
              onClick={() => onOpenAuth && onOpenAuth('register')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg transition-all cursor-pointer"
            >
              Get Started Today
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
