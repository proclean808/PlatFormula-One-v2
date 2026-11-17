import { useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer, useVoiceAssistant, BarVisualizer, DisconnectButton } from '@livekit/components-react';
import '@livekit/components-styles';
const choices = ['Mario', 'Joyce', 'ChatGPT', 'Claude', 'Gemini', 'Grok', 'Mistral', 'Perplexity'];
function Conversation({ persona }: { persona: string }) {
  const { state, audioTrack } = useVoiceAssistant();
  return <div className="flex flex-col items-center gap-4 rounded-xl bg-slate-900 p-6">
    <div className="text-sm text-emerald-300">{persona} · {state}</div>
    <div className="h-20 w-full max-w-md">{audioTrack && <BarVisualizer state={state} trackRef={audioTrack} barCount={24} />}</div>
    <RoomAudioRenderer />
    <DisconnectButton className="rounded-xl bg-rose-600 px-5 py-2 text-white">End conversation</DisconnectButton>
  </div>;
}
export default function FounderVoice() {
  const [persona, setPersona] = useState('Mario');
  const [connection, setConnection] = useState<{token:string;url:string}|null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function connect() {
    setError('');setLoading(true);
    try {
      const r = await fetch('/api/voice/token', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({persona})});
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Voice service unavailable');
      setConnection(data);
    } catch(e) {setError(e instanceof Error ? e.message : 'Connection failed');}
    finally {setLoading(false);}
  }
  return <div className="p-5 md:p-8">
    <label htmlFor="founder-persona" className="mb-2 block text-sm font-semibold">Choose your AI</label>
    <select id="founder-persona" value={persona} disabled={!!connection} onChange={e=>setPersona(e.target.value)} className="mb-4 w-full max-w-sm rounded-lg border border-emerald-700 bg-slate-900 p-3 text-white">
      {choices.map(x=><option key={x}>{x}</option>)}
    </select>
    {!connection ? <div><button onClick={connect} disabled={loading} className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-slate-950 disabled:opacity-50">{loading?'Connecting…': 'Allow microphone & start conversation'}</button>
      <p className="mt-3 text-xs text-slate-400">Your browser will request microphone permission. Audio is sent to the selected voice service.</p>
      {error && <p role="alert" className="mt-3 text-sm text-amber-300">{error}</p>}</div> :
      <LiveKitRoom token={connection.token} serverUrl={connection.url} connect audio video={false} onDisconnected={()=>setConnection(null)} onError={e=>setError(e.message)}>
        <Conversation persona={persona} />
      </LiveKitRoom>}
    {persona!=='Mario' && persona!=='Joyce' && <p className="mt-3 text-xs text-amber-300">Provider-specific voice integration is not yet enabled. This selection is not a signed-in provider account.</p>}
  </div>;
}
