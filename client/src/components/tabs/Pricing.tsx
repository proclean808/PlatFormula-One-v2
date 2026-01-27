import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

/**
 * Pricing Tab - 3-Tier SaaS Pricing Structure
 * 
 * Tiers:
 * 1. Foundry (Freemium) - Free tier for getting started
 * 2. Agent Forge (Pro $50) - Professional tier with advanced features
 * 3. Crucible - Enterprise tier with custom pricing
 */
export default function Pricing() {
  const pricingTiers = [
    {
      name: "Foundry",
      subtitle: "Freemium",
      price: "$0",
      period: "/month",
      description: "Perfect for founders just starting their journey",
      features: [
        "Access to accelerator database",
        "Basic application templates",
        "Community forum access",
        "Weekly newsletter",
        "Up to 3 application drafts",
        "Basic pitch practice tools"
      ],
      cta: "Get Started Free",
      highlighted: false,
      gradient: "from-slate-600 to-slate-800"
    },
    {
      name: "Agent Forge",
      subtitle: "Pro",
      price: "$50",
      period: "/month",
      description: "Advanced tools and AI-powered features for serious founders",
      features: [
        "Everything in Foundry, plus:",
        "AI-powered application builder",
        "Advanced pitch studio with feedback",
        "Unlimited application tracking",
        "Priority community support",
        "1-on-1 mentor sessions (2/month)",
        "Custom accelerator matching",
        "Analytics dashboard",
        "Export to PDF/Word"
      ],
      cta: "Start Pro Trial",
      highlighted: true,
      gradient: "from-purple-600 to-pink-600"
    },
    {
      name: "Crucible",
      subtitle: "Enterprise",
      price: "$100",
      period: "/month",
      description: "Tailored solutions for accelerators and startup programs",
      features: [
        "Everything in Agent Forge, plus:",
        "White-label platform",
        "Custom integrations",
        "Dedicated account manager",
        "Unlimited mentor sessions",
        "Custom AI training",
        "API access",
        "Advanced analytics & reporting",
        "SLA guarantee"
      ],
      cta: "Contact Sales",
      highlighted: false,
      gradient: "from-cyan-600 to-blue-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Choose Your <span className="gradient-text">Formula</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Select the perfect plan to accelerate your startup journey. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier, idx) => (
          <div
            key={idx}
            className={`glass rounded-2xl p-8 relative transition-all duration-300 hover:scale-105 ${
              tier.highlighted
                ? "ring-2 ring-purple-500 shadow-2xl shadow-purple-500/20"
                : ""
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            {/* Tier Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {tier.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {tier.subtitle}
              </p>
              <div className="flex items-baseline justify-center mb-2">
                <span className={`text-5xl font-bold bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-slate-600 dark:text-slate-400 ml-2">
                    {tier.period}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {tier.description}
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, featureIdx) => (
                <li key={featureIdx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button
              className={`w-full ${
                tier.highlighted
                  ? "gradient-btn"
                  : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white"
              }`}
              onClick={() => {
                if (tier.name === "Crucible") {
                  window.location.href = "mailto:info@alphabots.team?subject=Crucible Enterprise Inquiry";
                } else {
                  alert(`${tier.name} plan coming soon! We'll notify you when it's ready.`);
                }
              }}
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="glass p-8 rounded-2xl mt-12">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "Can I switch plans anytime?",
              a: "Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately."
            },
            {
              q: "Is there a free trial for Pro?",
              a: "Yes, Agent Forge Pro includes a 14-day free trial. No credit card required."
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, PayPal, and wire transfers for Enterprise plans."
            },
            {
              q: "Do you offer refunds?",
              a: "Yes, we offer a 30-day money-back guarantee for all paid plans."
            }
          ].map((faq, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {faq.q}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
