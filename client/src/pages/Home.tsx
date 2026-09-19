import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import FounderWorkspace from '@/components/workspace/FounderWorkspace';
import Dashboard from '@/components/tabs/Dashboard';
import Resources from '@/components/tabs/Resources';
import Builder from '@/components/tabs/Builder';
import PitchStudio from '@/components/tabs/PitchStudio';
import Tracking from '@/components/tabs/Tracking';
import Community from '@/components/tabs/Community';
import Pricing from '@/components/tabs/Pricing';
import Footer from '@/components/Footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState('workspace');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="gradient-text text-4xl md:text-5xl lg:text-6xl font-bold mb-4">PlatFormula.ONE</h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-2">The Founder Intelligence Platform</p>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            Tell us what you're building. Research, resources, stack decisions and working artifacts appear in one workspace.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-8 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-purple-200/30 dark:border-purple-800/30">
            {[
              ['workspace', 'Joyce'],
              ['dashboard', 'Dashboard'],
              ['resources', 'Resources'],
              ['builder', 'Builder'],
              ['pitch', 'Pitch Studio'],
              ['tracking', 'Tracking'],
              ['community', 'Community'],
              ['pricing', 'Pricing'],
            ].map(([value, label]) => (
              <TabsTrigger key={value} value={value} className="text-xs md:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="workspace" className="animate-fade-in">
            <FounderWorkspace onOpenResources={() => setActiveTab('resources')} />
          </TabsContent>
          <TabsContent value="dashboard" className="animate-fade-in"><Dashboard onNavigateToPricing={() => setActiveTab('pricing')} /></TabsContent>
          <TabsContent value="resources" className="animate-fade-in"><Resources /></TabsContent>
          <TabsContent value="builder" className="animate-fade-in"><Builder /></TabsContent>
          <TabsContent value="pitch" className="animate-fade-in"><PitchStudio /></TabsContent>
          <TabsContent value="tracking" className="animate-fade-in"><Tracking /></TabsContent>
          <TabsContent value="community" className="animate-fade-in"><Community /></TabsContent>
          <TabsContent value="pricing" className="animate-fade-in"><Pricing /></TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
