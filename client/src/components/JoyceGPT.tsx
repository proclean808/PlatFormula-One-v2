import { useState, useCallback } from 'react';
import {
  Shield,
  Zap,
  Cpu,
  Users,
  TrendingUp,
  CheckCircle,
  Play,
  Terminal,
  Layers,
  Database,
  Lock,
  Activity,
} from 'lucide-react';

const FASTAPI_INFER = 'http://localhost:49999/infer';

type QuorumStatus = 'idle' | 'debating' | 'resolved' | 'flagged' | 'error';

const agents = [
  {
    id: 'openai' as const,
    name: 'The Architect',
    model: 'GPT-4o-mini',
    color: 'text-emerald-400',
    role: 'D²-Optimist / Growth',
    description: 'Proposes high-leverage venture strategies.',
  },
  {
    id: 'anthropic' as const,
    name: 'The Auditor',
    model: 'Claude 3.5 Sonnet',
    color: 'text-amber-400',
    role: 'D²-Auditor / Risk',
    description: 'Strips fluff and identifies structural risks.',
  },
  {
    id: 'gemini' as const,
    name: 'The Quant',
    model: 'Gemini 1.5 Pro',
    color: 'text-blue-400',
    role: 'D³-Contrarian / Market',
    description: 'Grounds arguments in real-time market data.',
  },
];

export default function JoyceGPT() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'apis'>('dashboard');
  const [isSimulating, setIsSimulating] = useState(false);
  const [quorumStatus, setQuorumStatus] = useState<QuorumStatus>('idle');
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [query, setQuery] = useState('');
  const [voteCount, setVoteCount] = useState<Record<string, boolean | null>>({
    openai: null,
    anthropic: null,
    gemini: null,
  });

  const startQuorumDebate = useCallback(async () => {
    if (!query?.trim()) return;

    setIsSimulating(true);
    setQuorumStatus('debating');
    setMessages([]);
    setVoteCount({ openai: null, anthropic: null, gemini: null });

    try {
      const res = await fetch(FASTAPI_INFER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const normalized = {
        winner: data.verdict?.winning_advocate || 'unknown',
        final: data.verdict?.final_answer || 'No output returned.',
        justification: data.verdict?.justification || '',
        status: data.status === 'success' && data.quorum_passed ? 'ok' : 'error',
        risk_detected: false,
        scores: {},
        latency_ms: data.latency_ms ?? null,
        quorum_passed: !!data.quorum_passed,
        sla_passed: !!data.sla_passed,
      };

      setMessages([
        { id: 'system', text: `Winner: ${normalized.winner}` },
        { id: 'system', text: `Final: ${normalized.final}` },
        { id: 'system', text: `Justification: ${normalized.justification}` },
        { id: 'system', text: `Latency: ${normalized.latency_ms ?? 'n/a'} ms` },
        { id: 'system', text: `Quorum: ${normalized.quorum_passed}` },
        { id: 'system', text: `SLA: ${normalized.sla_passed}` },
      ]);

      if (normalized.status === 'ok') {
        setQuorumStatus('resolved');
        setVoteCount({
          openai: normalized.winner === 'openai',
          anthropic: normalized.winner === 'anthropic',
          gemini: normalized.winner === 'gemini',
        });
      } else {
        setQuorumStatus('error');
        setVoteCount({ openai: null, anthropic: null, gemini: null });
      }
    } catch (err) {
      setMessages([
        {
          id: 'system',
          text: `Execution error: ${err instanceof Error ? err.message : String(err)}`,
        },
      ]);
      setQuorumStatus('error');
      setVoteCount({ openai: null, anthropic: null, gemini: null });
    } finally {
      setIsSimulating(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-blue-500/30 -mx-4 md:-mx-8 -mt-6 px-4 md:px-8 pt-6">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                TR-D³<span className="text-blue-500">Max</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.3em]">
                JoyceGPT // PlatFormula.ONE
              </p>
            </div>
          </div>

          <nav className="flex gap-2 mt-6 md:mt-0 bg-white/5 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white/10 text-white shadow-inner'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Control
            </button>
            <button
              onClick={() => setActiveTab('apis')}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'apis'
                  ? 'bg-white/10 text-white shadow-inner'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Network
            </button>
          </nav>
        </header>

        {/* ── Control Tab ── */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column — agents + input */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Users size={16} /> Council
                </h2>
                <div className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                  <Activity size={12} className="animate-pulse" /> Live
                </div>
              </div>

              <div className="space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-white/5 border border-white/5 p-5 rounded-2xl"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className={`font-black text-sm uppercase tracking-tight ${agent.color}`}>
                          {agent.name}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">{agent.model}</p>
                      </div>
                      <div
                        className={`p-2 rounded-lg bg-black/40 border border-white/5 transition-colors ${
                          voteCount[agent.id] === true
                            ? 'text-emerald-500'
                            : voteCount[agent.id] === false
                            ? 'text-red-500'
                            : 'text-slate-700'
                        }`}
                      >
                        <CheckCircle size={16} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{agent.description}</p>
                    <p className="text-[10px] text-slate-600 font-mono uppercase">{agent.role}</p>
                  </div>
                ))}
              </div>

              {/* Query + Execute */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-4">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isSimulating && startQuorumDebate()}
                  placeholder="Enter decision query…"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-sm font-mono focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-800"
                />
                <button
                  onClick={startQuorumDebate}
                  disabled={isSimulating || !query.trim()}
                  className="w-full relative overflow-hidden bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-[0.98]"
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <Play size={18} fill="currentColor" />
                    {isSimulating ? 'Processing…' : 'Execute Quorum'}
                  </div>
                </button>
              </div>
            </div>

            {/* Right column — stream + stats */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Live stream terminal */}
              <div className="flex-1 bg-white/5 border border-white/5 rounded-3xl flex flex-col overflow-hidden min-h-[500px]">
                <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-emerald-500" />
                    <span className="font-bold text-xs uppercase tracking-widest text-slate-300">
                      Live TR-D³ Stream
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-black/40 rounded-full border border-white/5 flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        quorumStatus === 'debating'
                          ? 'bg-amber-500 animate-pulse'
                          : quorumStatus === 'resolved'
                          ? 'bg-emerald-500'
                          : quorumStatus === 'flagged'
                          ? 'bg-yellow-500'
                          : quorumStatus === 'error'
                          ? 'bg-red-500'
                          : 'bg-slate-700'
                      }`}
                    />
                    <span className="text-[9px] font-mono text-slate-500 uppercase">
                      {quorumStatus}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto space-y-6">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                      <Zap size={48} className="mb-4" />
                      <p className="font-mono text-xs uppercase tracking-[0.4em]">
                        Ready for Payload
                      </p>
                    </div>
                  )}

                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 animate-in slide-in-from-bottom-2 duration-200"
                    >
                      <div
                        className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${
                          m.id === 'system' ? 'bg-slate-500' : 'bg-blue-500'
                        }`}
                      />
                      <p className="flex-1 text-xs font-mono leading-relaxed text-slate-300">
                        {m.text}
                      </p>
                    </div>
                  ))}

                  {quorumStatus === 'resolved' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl mt-8 text-center animate-in zoom-in-95 duration-300">
                      <h4 className="text-emerald-400 font-black text-xl mb-1 italic uppercase">
                        Consensus Reached
                      </h4>
                      <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest">
                        Deterministic Proof Validated
                      </p>
                    </div>
                  )}

                  {quorumStatus === 'flagged' && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl mt-8 text-center animate-in zoom-in-95 duration-300">
                      <h4 className="text-yellow-400 font-black text-xl mb-1 italic uppercase">
                        Output Redacted
                      </h4>
                      <p className="text-[10px] text-yellow-500/60 font-bold uppercase tracking-widest">
                        PII / Policy Signal Detected
                      </p>
                    </div>
                  )}

                  {quorumStatus === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mt-8 text-center animate-in zoom-in-95 duration-300">
                      <h4 className="text-red-400 font-black text-xl mb-1 italic uppercase">
                        Execution Failed
                      </h4>
                      <p className="text-[10px] text-red-500/60 font-bold uppercase tracking-widest">
                        Check FastAPI gateway · localhost:49999
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl h-32 flex flex-col justify-between">
                  <TrendingUp size={14} className="text-slate-500" />
                  <div>
                    <div className="text-2xl font-black italic uppercase">Live</div>
                    <div className="text-[10px] text-emerald-500 font-mono">Quorum Engine</div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl h-32 flex flex-col justify-between">
                  <Database size={14} className="text-slate-500" />
                  <div>
                    <div className="text-2xl font-black uppercase tracking-tighter">n8n</div>
                    <div className="text-[10px] text-blue-500 font-mono">Webhook Active</div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl h-32 flex flex-col justify-between">
                  <Lock size={14} className="text-slate-500" />
                  <div>
                    <div className="text-2xl font-black uppercase text-emerald-500 italic">
                      Muzzled
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                      Double-Check Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Network Tab ── */}
        {activeTab === 'apis' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
              <h2 className="text-2xl font-black italic uppercase mb-4">Network Status</h2>
              <div className="p-6 bg-blue-900/10 border border-blue-900/30 rounded-2xl mb-8">
                <div className="flex gap-4 items-start">
                  <Shield size={20} className="text-blue-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-1">
                      Server-Side Security
                    </h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed uppercase">
                      API keys are configured strictly within the n8n environment (.env).
                      The frontend does not handle or store credentials.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 text-slate-500 font-mono text-[10px]">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>NODE GATEWAY: http://localhost:49999/infer</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600 font-mono text-[10px]">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span>AGENTS: OpenAI GPT-4o-mini · Claude 3.5 Sonnet · Gemini 1.5 Pro</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600 font-mono text-[10px]">
                  <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <span>JUDGE: Deterministic · temperature=0 · score-ranked arbitration</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600 font-mono text-[10px]">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>TIMEOUT: 8 000 ms per agent · continueOnFail enabled</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-slate-600">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">PlatFormula.ONE</span>
          <span className="text-[9px] font-mono tracking-widest uppercase italic">
            Live Deterministic Decision Engine
          </span>
        </footer>
      </div>
    </div>
  );
}
