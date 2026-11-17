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
        <section aria-labelledby="founder-hero" className="relative mb-5 overflow-hidden rounded-[28px] border border-emerald-500/20 bg-[#07130f] px-5 py-8 text-white shadow-2xl md:px-10 md:py-12">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <p className="relative mb-4 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">PlatFormula.One · AI-native venture studio</p>
          <h1 id="founder-hero" className="relative max-w-4xl text-4xl font-black leading-[1.06] tracking-tight md:text-6xl">Your startup starts with a conversation.</h1>
          <p className="relative mt-5 max-w-3xl text-lg leading-relaxed text-slate-200 md:text-xl">Have an idea? You don't need an application, a cohort, or a technical co-founder just to get started. Tell us what you're building. Explore the opportunity, shape the business, assemble your AI team, and take the first step toward a working venture.</p>
          <p className="relative mt-4 text-sm font-semibold text-emerald-300">From idea to impact. From seed to scale.</p>
          <a href="#talk-to-mario" className="relative mt-7 inline-flex rounded-xl bg-emerald-500 px-6 py-3 font-bold text-[#07130f] shadow-lg shadow-emerald-950/40 hover:bg-emerald-400">Start talking now <span aria-hidden="true" className="ml-2">↗</span></a>
          <p className="relative mt-4 text-xs text-slate-400">Explore the experience first. Decide whether to continue afterward.</p>
        </section>

        <section id="talk-to-mario" aria-labelledby="mario-heading" className="mx-auto mb-10 max-w-6xl overflow-hidden rounded-[24px] border border-emerald-500/40 bg-[#0b1715] text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-500/20 px-5 py-5 md:px-8">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Founder conversation · Starting grid</p>
              <h2 id="mario-heading" className="text-3xl font-bold">Talk to Mario</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">Bring the idea. Mario helps you begin the founder journey through a live, native browser conversation.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-emerald-700 bg-emerald-950 px-3 py-1 text-emerald-200">Mario</span>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Joyce</span>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Grok Auto</span>
            </div>
          </div>
          {typeof import.meta.env.VITE_MARIO_ELEVENLABS_AGENT_ID === 'string' && /^agent_[a-zA-Z0-9]+$/.test(import.meta.env.VITE_MARIO_ELEVENLABS_AGENT_ID) ? (
            <div className="p-5 md:p-8">
              <p className="mb-4 text-sm text-emerald-200">Mario · Live voice and text conversation</p>
              <div ref={(node) => {
                if (!node || node.childElementCount) return;
                const widget = document.createElement('elevenlabs-convai');
                widget.setAttribute('agent-id', import.meta.env.VITE_MARIO_ELEVENLABS_AGENT_ID);
                widget.setAttribute('variant', 'expanded');
                widget.setAttribute('action-text', 'Talk to Mario');
                widget.setAttribute('start-call-text', 'Start talking');
                node.appendChild(widget);
              }} />
              <p className="mt-4 text-xs text-slate-400">Voice requires microphone permission. The configured agent must be enabled for public widget access and restricted to approved domains.</p>
            </div>
          ) : typeof import.meta.env.VITE_JOYCE_STREAM_URL === 'string' && /^https:\/\//.test(import.meta.env.VITE_JOYCE_STREAM_URL) ? (
            <div className="p-3 md:p-5">
              <p className="mb-3 text-sm text-emerald-300">Mario · Interactive browser conversation</p>
              <iframe title="Mario — interactive browser conversation" src={import.meta.env.VITE_JOYCE_STREAM_URL} allow="microphone; camera; autoplay; clipboard-read; clipboard-write" className="h-[560px] w-full rounded-xl border border-slate-700 bg-slate-950 md:h-[680px]" />
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <p className="font-semibold">Mario's live voice connection is being configured.</p>
              <p className="mt-2 text-sm text-slate-300">A verified ElevenLabs agent ID or existing secure browser stream is required. No simulated voice controls.</p>
              <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950">Start a browser conversation ↗</a>
            </div>
          )}
        </section>

        <section aria-label="How PlatFormula works" className="mb-10 grid gap-3 md:grid-cols-3">
          {[
            { n: '01', heading: 'Tell us the idea', body: 'Start with your voice. Describe the problem, customer, or opportunity. No pitch deck required.' },
            { n: '02', heading: 'Build the venture', body: 'Turn the conversation into research, a business model, a product plan, and verifiable next steps.' },
            { n: '03', heading: 'Take the wheel', body: 'Keep what you create. Review the evidence, direct the AI team, and decide what gets built next.' }
          ].map(step => <div key={step.n} className="rounded-2xl border border-emerald-900/20 bg-white p-5 shadow-sm dark:bg-slate-900">
            <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400">{step.n}</span>
            <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{step.heading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.body}</p>
          </div>)}
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
