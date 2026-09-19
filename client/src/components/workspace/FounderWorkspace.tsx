import { useMemo, useState } from 'react';
import { Bot, Browser, CheckCircle2, ExternalLink, Layers3, Mic, Search, Send, Sparkles, TerminalSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Candidate = {
  name: string;
  category: string;
  url: string;
  reason: string;
  status: 'researching' | 'qualified' | 'selected';
};

const seedCandidates: Candidate[] = [
  { name: 'Browser Use', category: 'Browser automation', url: 'https://github.com/browser-use/browser-use', reason: 'Agent browser control with a broad OSS ecosystem.', status: 'qualified' },
  { name: 'Hermes Agent', category: 'Agent runtime', url: 'https://github.com/NousResearch/hermes-agent', reason: 'Skills, memory, subagents, tools, scheduling and multiple execution backends.', status: 'selected' },
  { name: 'Vercel Sandbox', category: 'Execution', url: 'https://vercel.com/sandbox', reason: 'Disposable isolated execution environment for builds and agent work.', status: 'qualified' },
];

export default function FounderWorkspace({ onOpenResources }: { onOpenResources?: () => void }) {
  const [message, setMessage] = useState('');
  const [activity, setActivity] = useState([
    'Founder workspace ready',
    'Waiting for an objective',
  ]);
  const [candidates, setCandidates] = useState(seedCandidates);
  const [selectedUrl, setSelectedUrl] = useState(seedCandidates[0].url);

  const selected = useMemo(() => candidates.find(c => c.url === selectedUrl) ?? candidates[0], [candidates, selectedUrl]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const objective = message.trim();
    if (!objective) return;
    setActivity(prev => [
      `Objective captured: ${objective}`,
      'Research worker hook queued',
      'Resource qualification hook queued',
      'Shared-browser handoff hook ready',
      ...prev,
    ].slice(0, 8));
    setMessage('');
  };

  const selectCandidate = (url: string) => {
    setSelectedUrl(url);
    setCandidates(prev => prev.map(c => ({ ...c, status: c.url === url ? 'selected' : c.status === 'selected' ? 'qualified' : c.status })));
    setActivity(prev => [`Selected candidate: ${candidates.find(c => c.url === url)?.name ?? url}`, ...prev].slice(0, 8));
  };

  return (
    <section className="space-y-6" aria-label="Founder workspace">
      <div className="glass rounded-2xl p-6 md:p-8 border border-purple-500/20">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[38%] space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-300 mb-3">
                <Sparkles className="w-4 h-4" /> Founder Intelligence Workspace
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Tell Joyce what you're building.</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                Conversation becomes research, qualified resources, a working stack, build tasks and evidence.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 p-4">
              <div className="flex items-center gap-2 mb-3 font-semibold"><Bot className="w-4 h-4" /> Joyce</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                What are you building, what do you already have, and what would you like working next?
              </p>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="Example: I need an outbound stack that works with our existing CRM and I want to see the best candidates."
                className="w-full rounded-xl border border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-slate-900/70 p-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-2">
                <Button type="submit" className="gradient-btn flex-1"><Send className="w-4 h-4 mr-2" /> Start Work</Button>
                <Button type="button" variant="outline" aria-label="Voice session hook"><Mic className="w-4 h-4 mr-2" /> Voice</Button>
              </div>
            </form>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-purple-500/10 p-3"><Search className="w-4 h-4 mb-1" /> Research</div>
              <div className="rounded-lg bg-purple-500/10 p-3"><Browser className="w-4 h-4 mb-1" /> Browser</div>
              <div className="rounded-lg bg-purple-500/10 p-3"><TerminalSquare className="w-4 h-4 mb-1" /> Build</div>
            </div>
          </div>

          <div className="lg:w-[62%] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 min-h-[520px]">
            <div className="h-11 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-900 text-slate-200">
              <div className="flex items-center gap-2"><Browser className="w-4 h-4" /><span className="text-sm">Live research browser</span></div>
              <a href={selected.url} target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1 hover:text-white">Open site <ExternalLink className="w-3 h-3" /></a>
            </div>
            <div className="h-[390px] flex items-center justify-center p-8 text-center bg-gradient-to-br from-slate-950 to-slate-900">
              <div className="max-w-lg">
                <Browser className="w-14 h-14 mx-auto text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                <p className="text-slate-400 mt-2">{selected.reason}</p>
                <p className="text-xs text-slate-500 mt-5 break-all">{selected.url}</p>
                <div className="mt-6 rounded-lg border border-dashed border-purple-500/40 p-4 text-sm text-purple-200">
                  Shared-browser mount point — Browser Use / CDP / noVNC / Vercel Computer Use adapter.
                </div>
              </div>
            </div>
            <div className="p-4 grid sm:grid-cols-3 gap-3 bg-slate-900">
              {candidates.map(candidate => (
                <button key={candidate.url} onClick={() => selectCandidate(candidate.url)} className="text-left rounded-lg border border-slate-700 p-3 hover:border-purple-500 transition">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white text-sm">{candidate.name}</span>
                    {candidate.status === 'selected' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </div>
                  <span className="text-xs text-slate-400">{candidate.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4"><Layers3 className="w-5 h-5 text-purple-500" /><h3 className="font-bold text-lg">Working stack</h3></div>
          <div className="space-y-3">
            {candidates.filter(c => c.status === 'selected' || c.status === 'qualified').map(c => (
              <div key={c.url} className="flex items-center justify-between rounded-lg bg-white/50 dark:bg-slate-800/60 p-3">
                <div><div className="font-semibold">{c.name}</div><div className="text-xs text-slate-500">{c.category}</div></div>
                <Button size="sm" variant={c.status === 'selected' ? 'default' : 'outline'} onClick={() => selectCandidate(c.url)}>{c.status === 'selected' ? 'Selected' : 'Use'}</Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={onOpenResources}>Open Resource Registry</Button>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">Agent activity</h3>
          <div className="space-y-2">
            {activity.map((item, idx) => (
              <div key={idx} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><span className="text-purple-500">●</span><span>{item}</span></div>
            ))}
          </div>
          <div className="mt-5 text-xs text-slate-500">
            Hooks: conversation → work item → research/resource/browser/build workers → verification → ThreadLocker receipt.
          </div>
        </div>
      </div>
    </section>
  );
}
