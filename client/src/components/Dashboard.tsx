import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Users, Zap, Target, Handshake, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import SimplePricingTiers from './SimplePricingTiers';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

const HomePage: React.FC<HomePageProps> = ({ setActiveTab, onOpenAuth }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 mb-6 text-sm px-4 py-1">
          🚀 Bay Area AI Startup Ecosystem
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
          Your Path to Accelerator Acceptance
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed">
          Strategic equity partnerships that connect B2B SaaS founders with top accelerators, VCs, and angel investors through GenAI-powered application optimization and warm introductions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-10 py-7 text-xl font-bold shadow-2xl shadow-emerald-500/40"
            onClick={() => onOpenAuth && onOpenAuth('register')}
          >
            <Rocket className="w-6 h-6 mr-2" />
            Start Free with Foundry →
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg"
            onClick={() => setActiveTab('resources')}
          >
            View 60+ Accelerators
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Equity-Based Partnership</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Bay Area Network</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>GenAI-Powered</span>
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className="py-16 px-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Who We Are & What We Do</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              PlatFormula.ONE is a Bay Area-based startup accelerator program specializing in B2B SaaS and AI companies. 
              We combine strategic equity partnerships with GenAI-powered tools to maximize your accelerator acceptance rates and fundraising success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Accelerator Navigation</CardTitle>
                <CardDescription className="text-base">
                  GenAI-powered application optimization to boost your acceptance scores with bleeding-edge innovative content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Warm Introductions</CardTitle>
                <CardDescription className="text-base">
                  Direct connections to Bay Area accelerators, venture capital firms, and angel investor networks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Full-Stack Support</CardTitle>
                <CardDescription className="text-base">
                  From IP protection and business model validation to fundraising and investor relations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Simple, transparent process to accelerate your startup's growth
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Choose Your Tier",
                description: "Select from Foundry, Agent Forge, or Crucible based on your startup's stage and needs"
              },
              {
                step: "2",
                title: "Strategic Partnership",
                description: "We align our success with yours through equity-based arrangements tailored to your potential"
              },
              {
                step: "3",
                title: "Get Support",
                description: "Access our services, GenAI tools, Bay Area network, and warm introductions to accelerators"
              },
              {
                step: "4",
                title: "Scale & Succeed",
                description: "Get accepted to top accelerators, raise funding, and grow your B2B SaaS business"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 -z-10" style={{width: 'calc(100% - 3rem)'}} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                60+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Accelerators & VCs in Directory
              </div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                3
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Service Tiers for Every Stage
              </div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Success-Aligned Partnership
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <SimplePricingTiers onOpenAuth={onOpenAuth} />
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Accelerate Your Startup?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the Bay Area AI Startup Ecosystem. Choose your tier and start your journey to accelerator acceptance and funding success.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-6 text-xl shadow-lg shadow-emerald-600/30"
            onClick={() => setActiveTab('dashboard')}
          >
            View Services & Pricing
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>

      {/* Contact Footer */}
      <div className="py-12 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
            Questions? Contact us at{' '}
            <a href="mailto:info@platformula.one" className="text-emerald-600 hover:text-emerald-700 font-medium">
              info@platformula.one
            </a>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
            <a href="tel:+14156954604" className="hover:text-emerald-600 transition-colors">
              (415) 695-4604
            </a>
            <span>•</span>
            <a href="mailto:Jonathan@Behrendterprises.com" className="hover:text-emerald-600 transition-colors">
              Jonathan@Behrendterprises.com
            </a>
            <span>•</span>
            <a 
              href="http://lnkd.in/gjMdVuAf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-600 transition-colors"
            >
              Follow on LinkedIn →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
