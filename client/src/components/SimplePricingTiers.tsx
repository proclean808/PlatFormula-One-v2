import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface SimplePricingTiersProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
  setActiveTab?: (tab: string) => void;
}

const SimplePricingTiers: React.FC<SimplePricingTiersProps> = ({ onOpenAuth, setActiveTab }) => {
  const tiers = [
    {
      name: "Foundry",
      price: "Free",
      description: "For early-stage founders validating their idea",
      features: [
        "Access to Resources Directory",
        "Basic Application Builder",
        "Community Access",
        "Weekly Office Hours",
        "Standard Support"
      ],
      notIncluded: [
        "AI Pitch Deck Analysis",
        "Warm Introductions",
        "Legal & IP Support",
        "Dedicated Mentor"
      ],
      cta: "Start for Free",
      popular: false,
      action: () => setActiveTab ? setActiveTab('builder') : (onOpenAuth && onOpenAuth('register'))
    },
    {
      name: "Agent Forge",
      price: "Equity",
      description: "For startups ready to build and launch",
      features: [
        "Everything in Foundry",
        "Advanced AI Tools",
        "Pitch Studio Access",
        "Co-Founder Matching",
        "Priority Support",
        "Cloud Credits ($5k+)"
      ],
      notIncluded: [
        "Warm Introductions",
        "Legal & IP Support",
        "Dedicated Mentor"
      ],
      cta: "Apply for Forge",
      popular: true,
      action: () => setActiveTab ? setActiveTab('builder') : (onOpenAuth && onOpenAuth('register'))
    },
    {
      name: "Crucible",
      price: "Equity + Fee",
      description: "For scaling startups seeking investment",
      features: [
        "Everything in Agent Forge",
        "Warm Introductions to VCs",
        "Legal & IP Support",
        "Dedicated Mentor",
        "Fundraising Strategy",
        "Cloud Credits ($100k+)"
      ],
      notIncluded: [],
      cta: "Apply for Crucible",
      popular: false,
      action: () => setActiveTab ? setActiveTab('builder') : (onOpenAuth && onOpenAuth('register'))
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {tiers.map((tier, index) => (
        <Card 
          key={index} 
          className={`flex flex-col relative ${
            tier.popular 
              ? 'border-emerald-500 shadow-xl scale-105 z-10' 
              : 'border-gray-200 dark:border-gray-800 hover:shadow-lg'
          }`}
        >
          {tier.popular && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              Most Popular
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">{tier.price}</span>
            </div>
            <CardDescription className="mt-2">{tier.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
              {tier.notIncluded.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-400">
                  <X className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className={`w-full ${
                tier.popular 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : ''
              }`}
              variant={tier.popular ? 'default' : 'outline'}
              onClick={tier.action}
            >
              {tier.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SimplePricingTiers;
