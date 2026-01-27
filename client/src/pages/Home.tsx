import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import Dashboard from '@/components/tabs/Dashboard';
import Resources from '@/components/tabs/Resources';
import Builder from '@/components/tabs/Builder';
import PitchStudio from '@/components/tabs/PitchStudio';
import Tracking from '@/components/tabs/Tracking';
import Community from '@/components/tabs/Community';
import Pricing from '@/components/tabs/Pricing';
import Footer from '@/components/Footer';

/**
 * Home Page - Main landing page with tab-based navigation
 * 
 * Design Philosophy: Modern Gradient Minimalism with Glassmorphism
 * - Tab navigation with smooth transitions
 * - Purple-to-pink gradient accents
 * - Glassmorphic content containers
 * - Responsive mobile-first layout
 */
export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="gradient-text text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            PlatFormula.ONE
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-2">
            AI-Powered Startup Accelerator Platform
          </p>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            Build, pitch, track, and scale your startup with intelligent tools and community support
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-8 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-purple-200/30 dark:border-purple-800/30">
              <TabsTrigger 
                value="dashboard"
                className="text-xs md:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="resources"
                className="text-xs md:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              >
                Resources
              </TabsTrigger>
              <TabsTrigger 
                value="builder"
                className="text-xs md:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              >
                Builder
              </TabsTrigger>
              <TabsTrigger 
                value="pitch"
                className="text-xs md:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              >
                Pitch Studio
              </TabsTrigger>
              <TabsTrigger 
                value="tracking"
                className="text-xs md:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              >
                Tracking
              </TabsTrigger>
              <TabsTrigger 
                value="community"
                className="text-xs md:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              >
                Community
              </TabsTrigger>
              <TabsTrigger 
                value="pricing"
                className="text-xs md:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              >
                Pricing
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="dashboard" className="animate-fade-in">
              <Dashboard onNavigateToPricing={() => setActiveTab('pricing')} />
            </TabsContent>
            <TabsContent value="resources" className="animate-fade-in">
              <Resources />
            </TabsContent>
            <TabsContent value="builder" className="animate-fade-in">
              <Builder />
            </TabsContent>
            <TabsContent value="pitch" className="animate-fade-in">
              <PitchStudio />
            </TabsContent>
            <TabsContent value="tracking" className="animate-fade-in">
              <Tracking />
            </TabsContent>
            <TabsContent value="community" className="animate-fade-in">
              <Community />
            </TabsContent>
            <TabsContent value="pricing" className="animate-fade-in">
              <Pricing />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
