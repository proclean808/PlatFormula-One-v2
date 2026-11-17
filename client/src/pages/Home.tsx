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

        {/* PitWall is the primary founder interaction, directly below the hero, never behind a tab. */}
        <section id="talk-to-joyce" aria-labelledby="joyce-heading" className="mx-auto mb-8 max-w-6xl overflow-hidden rounded-2xl border border-emerald-500/40 bg-[#07130f] text-white shadow-2xl">
          <div className="border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950 via-[#0b201b] to-slate-950 px-5 py-5 md:px-8">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Your AI-native venture studio</p>
            <h2 id="joyce-heading" className="text-2xl font-bold md:text-3xl">Talk to PitWall</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Start with your idea. Speak naturally in the provider's native conversation interface. From idea to impact. From seed to scale.</p>
          </div>
          {typeof import.meta.env.VITE_JOYCE_STREAM_URL === 'string' && /^https:\/\//.test(import.meta.env.VITE_JOYCE_STREAM_URL) ? (
            <div className="p-3 md:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-emerald-300">Interactive browser session</span>
                <a href={import.meta.env.VITE_JOYCE_STREAM_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-950">Open full-screen session</a>
              </div>
              <iframe title="PitWall — interactive browser conversation" src={import.meta.env.VITE_JOYCE_STREAM_URL} allow="microphone; camera; autoplay; clipboard-read; clipboard-write" className="h-[560px] w-full rounded-xl border border-slate-700 bg-slate-950 md:h-[680px]" />
              <p className="mt-2 text-xs text-slate-400">Native voice availability depends on the authenticated provider session, browser permissions and microphone forwarding.</p>
            </div>
          ) : (
            <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <div>
                <p className="font-medium text-white">Live browser connection not configured</p>
                <p className="mt-2 text-sm text-slate-400">Your PitWall session will appear here when the secure Chrome stream is deployed. This is not a simulated voice assistant.</p>
              </div>
              <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-500">Open Gemini conversation</a>
            </div>
          )}
        </section>

        <section className="mx-auto mb-8 max-w-4xl text-center" aria-label="Founder journey">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">The Evolution of Startup Accelerators</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Converse → Understand → Research → Qualify → Assemble → Build → Verify → Operate</p>
        </section>

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
