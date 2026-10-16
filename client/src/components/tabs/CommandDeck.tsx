import { useMemo, useState } from 'react';
import { ExternalLink, Loader2, Play, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type Provider = 'openai' | 'gemini';

const providers: Array<{ id: Provider; name: string; model: string; launchUrl: string }> = [
  { id: 'openai', name: 'OpenAI', model: 'gpt-5-mini', launchUrl: 'https://chatgpt.com/' },
  { id: 'gemini', name: 'Gemini', model: 'gemini-3-flash', launchUrl: 'https://gemini.google.com/app' },
];

const ventureLoop = [
  ['Validate', 'Customer, pain, alternatives, evidence'],
  ['Plan', 'Offer, moat, economics, milestones'],
  ['Build', 'Product, assets, pitch, operating stack'],
  ['Launch', 'Distribution, applications, measurement'],
] as const;

export default function CommandDeck() {
  const [provider, setProvider] = useState<Provider>('openai');
  const [intent, setIntent] = useState('');
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const selected = useMemo(() => providers.find((item) => item.id === provider)!, [provider]);

  const run = async () => {
    if (!intent.trim() || busy) return;
    setBusy(true);
    setResult('');
    try {
      const response = await fetch('/api/harness/run', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ provider, model: selected.model, intent: intent.trim() }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Harness request failed');
      setResult(payload.output);
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Harness request failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-purple-600" />
          <h2 className="text-3xl font-bold">Command Deck</h2>
        </div>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          One founder intent, routed through the best available engine. No account setup in this prototype.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {providers.map((item) => (
          <button key={item.id} onClick={() => setProvider(item.id)} className="text-left">
            <Card className={provider === item.id ? 'border-purple-500 ring-2 ring-purple-500/30' : ''}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.model}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm">
                <span>{provider === item.id ? 'Selected engine' : 'Select engine'}</span>
                <Play className="h-4 w-4" />
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ventureLoop.map(([name, output], index) => (
          <Card key={name} className="gap-3 py-4">
            <CardHeader className="px-4">
              <CardDescription>Stage {index + 1}</CardDescription>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 text-sm text-slate-600 dark:text-slate-300">{output}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What are you building?</CardTitle>
          <CardDescription>The same intent can later fan out to specialists, assets, and workflows.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={intent}
            onChange={(event) => setIntent(event.target.value)}
            placeholder="Describe the company, outcome, customer, and constraint…"
            className="min-h-36"
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={run} disabled={busy || !intent.trim()}>
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Run with {selected.name}
            </Button>
            <Button variant="outline" asChild>
              <a href={selected.launchUrl} target="_blank" rel="noreferrer">
                Open signed-in app <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader><CardTitle>Result</CardTitle></CardHeader>
          <CardContent><pre className="whitespace-pre-wrap font-sans text-sm leading-6">{result}</pre></CardContent>
        </Card>
      )}
    </div>
  );
}
