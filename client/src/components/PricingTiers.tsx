import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingTiers = () => {
  console.log('🎯 PricingTiers component is rendering!');
  const tiers = [
    {
      name: "Foundry",
      tagline: "Essential Foundation",
      price: "Equity-based",
      description: "Perfect for early-stage startups building their foundation",
      features: [
        "Corporate legal setup & entity formation",
        "Basic IP protection strategy",
        "Business model validation session",
        "Access to preferred provider roster",
        "Community network access",
        "Quarterly office hours"
      ],
      cta: "Start Building",
      highlighted: false,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Agent Forge",
      tagline: "Accelerator-Ready",
      price: "Equity-based",
      description: "Comprehensive support to maximize accelerator acceptance",
      features: [
        "Everything in Foundry, plus:",
        "GenAI-powered application optimization",
        "Warm introductions to 3 accelerators",
        "Pitch deck development & refinement",
        "Full IP portfolio development",
        "Business model & pricing strategy",
        "Monthly strategic advisory sessions",
        "Investor relations support"
      ],
      cta: "Get Accepted",
      highlighted: true,
      gradient: "from-emerald-500 to-green-500"
    },
    {
      name: "Crucible",
      tagline: "Full-Stack Partnership",
      price: "Equity-based",
      description: "End-to-end partnership for rapid scaling and fundraising",
      features: [
        "Everything in Agent Forge, plus:",
        "Warm introductions to 10+ VCs & angels",
        "Dedicated strategic advisor",
        "Full software development support",
        "Comprehensive marketing & PR strategy",
        "Sales & go-to-market execution",
        "Fundraising campaign management",
        "Weekly advisory & hands-on support",
        "Priority access to investor network"
      ],
      cta: "Scale Fast",
      highlighted: false,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="w-full py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Strategic equity partnerships tailored to your startup's stage and needs. 
          All tiers include access to our Bay Area network and GenAI tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {tiers.map((tier, index) => (
          <Card 
            key={index} 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
              tier.highlighted 
                ? 'border-2 border-emerald-500 shadow-xl scale-105 z-10' 
                : 'hover:scale-105'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                MOST POPULAR
              </div>
            )}
            
            <CardHeader className="text-center pb-8">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${tier.gradient} flex items-center justify-center`}>
                <span className="text-2xl font-bold text-white">
                  {tier.name.charAt(0)}
                </span>
              </div>
              <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
              <CardDescription className="text-lg font-medium">
                {tier.tagline}
              </CardDescription>
              <div className="mt-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  {tier.price}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Success-aligned partnership
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-center text-gray-600 dark:text-gray-400 min-h-[3rem]">
                {tier.description}
              </p>

              <ul className="space-y-3">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      tier.highlighted ? 'text-emerald-500' : 'text-green-500'
                    }`} />
                    <span className={`text-sm ${
                      feature.includes('Everything in') ? 'font-semibold' : ''
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full mt-6 bg-gradient-to-r ${tier.gradient} hover:opacity-90 text-white shadow-lg ${
                  tier.highlighted ? 'shadow-emerald-500/25 py-6 text-lg' : 'shadow-lg'
                }`}
                size={tier.highlighted ? "lg" : "default"}
              >
                {tier.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12 max-w-3xl mx-auto px-4">
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Equity Partnership Model:</strong> We align our success with yours through strategic equity arrangements. 
          Investment amount and equity percentage are tailored to each venture's unique stage, potential, and service needs.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
          Schedule a consultation to discuss which tier best fits your startup's current needs and growth trajectory.
        </p>
      </div>
    </div>
  );
};

export default PricingTiers;

