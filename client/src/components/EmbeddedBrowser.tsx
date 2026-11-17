import { useState } from 'react';
const url = import.meta.env.VITE_SELKIES_GEMINI_URL as string | undefined;
export default function EmbeddedBrowser() {
  const [expanded,setExpanded] = useState(false);
  if (!url || !/^https:\/\//.test(url)) return <div className="p-8 text-slate-200"><h3 className="text-xl font-bold">Gemini browser workspace</h3><p className="mt-3">The isolated Chrome session has not been connected to this deployment. Set VITE_SELKIES_GEMINI_URL to the HTTPS address of the authenticated Selkies session.</p><p className="mt-3 text-sm text-slate-400">Google sign-in occurs only inside the real browser; PlatFormula.One does not collect your password.</p></div>;
  return <div className="p-3 md:p-5">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-300">Real Gemini in remote Chrome · microphone and speaker forwarded through Selkies</p>
      <div className="flex gap-2"><button className="rounded-lg border border-emerald-600 px-3 py-2 text-sm" onClick={()=>setExpanded(!expanded)}>{expanded?'Normal size':'Expand workspace'}</button><a href={url} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-slate-950">Open browser directly</a></div>
    </div>
    <iframe title="Isolated Gemini browser session" src={url} allow="microphone; camera; autoplay; clipboard-read; clipboard-write; fullscreen" referrerPolicy="no-referrer" className={`w-full rounded-xl border border-emerald-700 bg-slate-950 ${expanded?'h-[85vh]':'h-[70vh] min-h-[520px]'}`} />
    <p className="mt-2 text-xs text-slate-400">Use the session microphone control to forward audio. Enter Google credentials only on Google's official sign-in screen inside Chrome.</p>
  </div>;
}
