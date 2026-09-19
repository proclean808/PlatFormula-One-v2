import { useEffect,useState } from 'react';
import { Browser,Globe2,ShoppingCart,TerminalSquare,Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
type Tool={id:string;label:string;status:string;capabilities:string[]};
const icons:Record<string,typeof Browser>={browser:Browser,commerce:ShoppingCart,'analyze-url':Globe2,builder:TerminalSquare};
export default function ToolDock(){
 const [tools,setTools]=useState<Tool[]>([]); const [url,setUrl]=useState('https://'); const [result,setResult]=useState('');
 useEffect(()=>{fetch('/api/tools').then(r=>r.json()).then(d=>setTools(d.tools||[])).catch(()=>setTools([]))},[]);
 async function analyze(){setResult('Checking…');const r=await fetch('/api/tools/analyze-url',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({url})});setResult(JSON.stringify(await r.json(),null,2))}
 return <div className="glass rounded-2xl p-5">
  <div className="flex items-center gap-2 mb-4"><Wrench className="w-5 h-5 text-purple-500"/><h3 className="font-bold">Live Tool Dock</h3></div>
  <div className="grid md:grid-cols-4 gap-3">{tools.map(t=>{const Icon=icons[t.id]||Wrench;return <div key={t.id} className="rounded-xl border p-3"><div className="flex justify-between gap-2"><span className="font-semibold flex gap-2"><Icon className="w-4 h-4"/>{t.label}</span><span className="text-xs">{t.status}</span></div><div className="text-xs text-slate-500 mt-2">{t.capabilities.join(' · ')}</div></div>})}</div>
  <div className="mt-4 flex gap-2"><input value={url} onChange={e=>setUrl(e.target.value)} className="flex-1 rounded-lg border bg-transparent px-3" aria-label="URL to analyze"/><Button onClick={analyze}>Analyze live URL</Button></div>
  {result&&<pre className="mt-3 rounded-lg bg-slate-950 text-slate-200 p-3 text-xs overflow-auto">{result}</pre>}
 </div>
}
