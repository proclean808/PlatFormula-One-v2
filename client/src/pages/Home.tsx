import { useState } from 'react';
import { ExternalLink, LayoutGrid } from 'lucide-react';
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
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [paneCount, setPaneCount] = useState(3);
  const [paneUrls, setPaneUrls] = useState(['https://gemini.google.com/app', 'https://chatgpt.com/', 'https://claude.ai/', 'https://poe.com/', 'https://www.perplexity.ai/', 'https://grok.com/']);
  const providers = ['Gemini · Joyce', 'ChatGPT', 'Claude', 'Poe', 'Perplexity', 'Grok'];
  const updatePane = (index: number, url: string) => setPaneUrls(current => current.map((value, i) => i === index ? url : value));

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

        <section aria-label="Multi-agent browser workspace" className="mb-10 rounded-2xl border border-emerald-500/30 bg-slate-950 p-4 text-slate-100 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="flex items-center gap-2 text-xl font-semibold"><LayoutGrid className="h-5 w-5 text-emerald-400" /> Multi-Agent Browser Workspace</h2>
            <p className="mt-1 text-sm text-slate-400">Native provider conversations in independently authenticated browser sessions. No speech synthesis or transcription layer.</p></div>
            <button type="button" onClick={() => setWorkspaceOpen(v => !v)} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white">{workspaceOpen ? 'Hide workspace' : 'Show workspace'}</button>
          </div>
          {workspaceOpen && <div className="mt-5">
            <div className="mb-4 flex flex-wrap gap-2" aria-label="Workspace layout">
              {[2,3,4,6].map(n => <button key={n} type="button" aria-pressed={paneCount===n} onClick={() => setPaneCount(n)} className={`rounded px-3 py-1 text-sm ${paneCount===n ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'}`}>{n} panes</button>)}
            </div>
            <p className="mb-3 text-xs text-amber-200">Provider sites may block iframe embedding or microphone permissions. If a pane is blank, use Open provider for its native voice mode. A true embedded interactive Chromium session requires a separately deployed browser-stream service and provider permission; this grid does not bypass those restrictions.</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {providers.slice(0,paneCount).map((provider,i) => <div key={provider} className="min-w-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                <div className="flex items-center justify-between gap-2 p-3"><span className="text-sm font-semibold">{provider}</span><a href={paneUrls[i]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-emerald-300">Open provider <ExternalLink className="h-3 w-3" /></a></div>
                <label className="sr-only" htmlFor={`agent-url-${i}`}>Provider URL for {provider}</label>
                <input id={`agent-url-${i}`} type="url" value={paneUrls[i]} onChange={e=>updatePane(i,e.target.value)} className="w-full border-y border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200" />
                <iframe title={provider} src={paneUrls[i]} allow="microphone; autoplay; clipboard-read; clipboard-write" referrerPolicy="strict-origin-when-cross-origin" className="h-[400px] w-full bg-white" />
              </div>)}
            </div>
          </div>}
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
