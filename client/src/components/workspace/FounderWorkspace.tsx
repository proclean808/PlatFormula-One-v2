import { useMemo, useState } from 'react';
import { Bot, Browser, CheckCircle2, Circle, ExternalLink, FileCheck2, Layers3, Mic, Search, Send, ShieldCheck, Sparkles, TerminalSquare, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CandidateStatus = 'researching' | 'qualified' | 'accepted' | 'rejected';
type Candidate = { id: string; name: string; category: string; url: string; reason: string; evidence: string[]; status: CandidateStatus };
type Stage = { id: string; label: string; state: 'pending' | 'active' | 'complete' };

const initialStages: Stage[] = [
  ['founder','Founder Profile'],['problem','Problem'],['evidence','Evidence'],['competitors','Competitors'],
  ['customer','Customer'],['programs','Programs'],['resources','Resources'],['stack','Stack'],
  ['experiments','Experiments'],['build','Build'],['deployment','Deployment'],['gtm','GTM'],['funding','Funding'],
].map(([id,label], index) => ({ id, label, state: index < 2 ? 'complete' : index === 2 ? 'active' : 'pending' }));

const initialCandidates: Candidate[] = [
  { id:'browser-use', name:'Browser Use', category:'Browser automation', url:'https://github.com/browser-use/browser-use', reason:'Candidate adapter for observable agent browser control.', evidence:['Official repository','Browser automation surface'], status:'qualified' },
  { id:'hermes', name:'Hermes Agent', category:'Agent runtime', url:'https://github.com/NousResearch/hermes-agent', reason:'Candidate work-plane runtime for skills, tools and delegated agents.', evidence:['Official repository','Local/runtime integration candidate'], status:'accepted' },
  { id:'vercel', name:'Vercel', category:'Build + deployment', url:'https://vercel.com', reason:'Existing deployment target and execution integration point.', evidence:['Official service','Current PlatFormula deployment target'], status:'qualified' },
];

export default function FounderWorkspace({ onOpenResources }: { onOpenResources?: () => void }) {
  const [message,setMessage]=useState('');
  const [objective,setObjective]=useState('Turn founder intent into verified venture state and executable work.');
  const [stages,setStages]=useState(initialStages);
  const [candidates,setCandidates]=useState(initialCandidates);
  const [selectedId,setSelectedId]=useState(initialCandidates[0].id);
  const [activity,setActivity]=useState(['ThreadLocker state loaded','Evidence stage active','Waiting for founder objective']);
  const selected=useMemo(()=>candidates.find(c=>c.id===selectedId)??candidates[0],[candidates,selectedId]);

  const log=(item:string)=>setActivity(prev=>[item,...prev].slice(0,10));
  const submit=(e:React.FormEvent)=>{
    e.preventDefault(); const value=message.trim(); if(!value)return;
    setObjective(value);
    setStages(prev=>prev.map(s=>s.id==='evidence'?{...s,state:'active'}:s));
    log('OBSERVED → work item created from Joyce conversation');
    log('Research request queued for browser execution and source capture');
    setMessage('');
  };
  const decide=(id:string,status:'accepted'|'rejected')=>{
    setCandidates(prev=>prev.map(c=>c.id===id?{...c,status}:c));
    setSelectedId(id);
    log(`${status.toUpperCase()} → ${candidates.find(c=>c.id===id)?.name ?? id}; ThreadLocker receipt staged`);
  };

  return <section className="space-y-6" aria-label="Founder workspace">
    <div className="glass rounded-2xl p-5 md:p-7 border border-purple-500/20">
      <div className="flex flex-col xl:flex-row gap-5">
        <div className="xl:w-[36%] space-y-4">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-300"><Sparkles className="w-4 h-4"/> Joyce · Venture Control Surface</div>
            <h2 className="text-3xl font-bold mt-2">Conversation becomes canonical venture state.</h2>
            <p className="text-sm text-slate-500 mt-2">Joyce observes intent. Research produces evidence. You authorize decisions. Execution follows only after authorization.</p>
          </div>
          <div className="rounded-xl border p-4 bg-white/60 dark:bg-slate-900/50">
            <div className="text-xs uppercase tracking-wide text-slate-500">Current objective</div>
            <div className="font-semibold mt-1">{objective}</div>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={4} placeholder="Tell Joyce the objective, constraint, decision or question…" className="w-full rounded-xl border border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-slate-900/70 p-4 outline-none focus:ring-2 focus:ring-purple-500"/>
            <div className="flex gap-2"><Button type="submit" className="gradient-btn flex-1"><Send className="w-4 h-4 mr-2"/>Create work item</Button><Button type="button" variant="outline"><Mic className="w-4 h-4 mr-2"/>Voice</Button></div>
          </form>
          <div className="rounded-xl border p-3 text-xs space-y-2">
            <div className="font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4"/>Logic Lattice</div>
            <div>OBSERVED → PROPOSED → AUTHORIZED → EXECUTED → VERIFIED → COMMITTED</div>
            <div className="text-slate-500">No candidate selection is treated as execution authority.</div>
          </div>
        </div>

        <div className="xl:w-[64%] space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
            <div className="h-11 px-4 flex items-center justify-between border-b border-slate-800 text-slate-200">
              <div className="flex items-center gap-2"><Browser className="w-4 h-4"/><span className="text-sm">Observable research surface</span></div>
              <a href={selected.url} target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1">Open source <ExternalLink className="w-3 h-3"/></a>
            </div>
            <div className="p-5 min-h-[250px]">
              <div className="flex items-start justify-between gap-4">
                <div><div className="text-xs text-purple-300">{selected.category}</div><h3 className="text-2xl text-white font-bold mt-1">{selected.name}</h3><p className="text-slate-400 mt-2">{selected.reason}</p></div>
                <span className="text-xs rounded-full border border-slate-700 px-3 py-1 text-slate-300">{selected.status}</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mt-5">{selected.evidence.map(e=><div key={e} className="rounded-lg bg-slate-900 border border-slate-800 p-3 text-sm text-slate-300 flex gap-2"><FileCheck2 className="w-4 h-4 text-purple-400 shrink-0"/>{e}</div>)}</div>
              <div className="mt-5 rounded-lg border border-dashed border-purple-500/40 p-4 text-sm text-purple-200">Runtime boundary: browser adapter supplies session/view/control URLs; this UI never fabricates browsing results.</div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">{candidates.map(c=><button key={c.id} onClick={()=>setSelectedId(c.id)} className={"text-left rounded-xl border p-3 "+(selectedId===c.id?'border-purple-500':'border-slate-300 dark:border-slate-700')}><div className="font-semibold">{c.name}</div><div className="text-xs text-slate-500">{c.category}</div><div className="mt-3 flex gap-2"><Button type="button" size="sm" onClick={e=>{e.stopPropagation();decide(c.id,'accepted')}}><CheckCircle2 className="w-3 h-3 mr-1"/>Accept</Button><Button type="button" size="sm" variant="outline" onClick={e=>{e.stopPropagation();decide(c.id,'rejected')}}><XCircle className="w-3 h-3 mr-1"/>Reject</Button></div></button>)}</div>
        </div>
      </div>
    </div>

    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4"><Layers3 className="w-5 h-5 text-purple-500"/><h3 className="font-bold">Persistent venture state</h3></div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2">{stages.map(s=><div key={s.id} className="rounded-lg border p-3 text-xs"><div className="flex items-center gap-2">{s.state==='complete'?<CheckCircle2 className="w-4 h-4 text-green-500"/>:s.state==='active'?<Search className="w-4 h-4 text-purple-500"/>:<Circle className="w-4 h-4 text-slate-400"/>}<span className="font-semibold">{s.label}</span></div><div className="mt-1 text-slate-500">{s.state}</div></div>)}</div>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="glass rounded-2xl p-5"><h3 className="font-bold mb-3 flex gap-2"><TerminalSquare className="w-5 h-5"/>Agent / execution activity</h3><div className="space-y-2">{activity.map((a,i)=><div key={i} className="text-sm flex gap-2"><span className="text-purple-500">●</span>{a}</div>)}</div></div>
      <div className="glass rounded-2xl p-5"><h3 className="font-bold mb-3">Control-plane boundaries</h3><div className="text-sm space-y-2 text-slate-600 dark:text-slate-300"><div>Joyce = interaction surface</div><div>ThreadLocker = canonical venture state</div><div>PiecePipe = ingestion + normalization</div><div>Hermes = work plane</div><div>Logic Lattice = authorization</div><div>Browser / build / deploy = execution</div><div>Evidence ledger = receipts + verification</div></div><Button variant="outline" className="w-full mt-4" onClick={onOpenResources}>Open Resource Registry</Button></div>
    </div>
  </section>;
}
