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
            PlatFormula.One
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-2">
            The Evolution of Startup Accelerators
          </p>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            From Idea to Impact. From Seed to Scale.
          </p>
        </div>

        <section className="mx-auto mb-10 max-w-3xl text-center" aria-label="Voice-first venture studio">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">The AI-Native, Voice-First Venture Studio.</p>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">Bring your idea. Talk it through. Build it slice by slice with your AI team—from first concept to working product, launch, and growth.</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No waiting for a cohort. No coding experience required to begin. Start building today, with your voice.</p>
          <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">Converse → Understand → Research → Qualify → Assemble → Build → Verify → Operate</p>
        </section>

        {(() => {
          const streams = [
            { name: 'joYCe · Live browser', url: import.meta.env.VITE_JOYCE_STREAM_URL },
            { name: 'Council · Live browser', url: import.meta.env.VITE_COUNCIL_STREAM_URL },
          ].filter((session): session is { name: string; url: string } =>
            typeof session.url === 'string' && /^https:\/\//.test(session.url)
          );
          if (!streams.length) return null;
          return <section aria-label="Live browser harness" className="mb-10 rounded-2xl border border-emerald-700/50 bg-slate-950 p-4 text-white">
            <h2 className="text-xl font-semibold">Live browser harness</h2>
            <p className="mt-1 mb-4 text-sm text-slate-400">Persistent interactive Chrome sessions with native provider interfaces. Microphone and audio are carried by the remote desktop stream, not an STT/TTS service.</p>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {streams.map(session => <div key={session.name} className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                <div className="flex items-center justify-between p-3">
                  <h3 className="font-medium">{session.name}</h3>
                  <a className="text-sm text-emerald-300 underline" href={session.url} target="_blank" rel="noopener noreferrer">Full screen</a>
                </div>
                <iframe title={session.name} src={session.url} allow="microphone; camera; autoplay; clipboard-read; clipboard-write" className="h-[550px] w-full bg-slate-950" />
              </div>)}
            </div>
          </section>;
        })()}

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
