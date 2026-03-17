import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

const N8N_WEBHOOK = "http://localhost:5678/webhook/trd3max";

type QuorumStatus = "idle" | "debating" | "resolved" | "flagged" | "error";

interface JudgeResult {
  status: "ok" | "redacted" | "error";
  final: string;
  winner: string;
  scores: { optimist: number; auditor: number; contrarian: number };
  risk_detected: boolean;
  query: string;
}

interface Message {
  id: string;
  label: string;
  text: string;
  variant?: "default" | "flag" | "score";
}

const MODEL_LABELS = {
  openai: { label: "GPT-4o-mini", role: "Optimist", color: "text-green-400" },
  anthropic: { label: "Claude 3.5 Sonnet", role: "Auditor", color: "text-blue-400" },
  gemini: { label: "Gemini 1.5 Pro", role: "Contrarian", color: "text-purple-400" },
};

function StatusBadge({ status }: { status: QuorumStatus }) {
  if (status === "idle") return null;
  if (status === "debating") return (
    <Badge variant="outline" className="gap-1 border-yellow-500 text-yellow-400">
      <Loader2 className="h-3 w-3 animate-spin" />
      Debating…
    </Badge>
  );
  if (status === "resolved") return (
    <Badge variant="outline" className="gap-1 border-green-500 text-green-400">
      <CheckCircle2 className="h-3 w-3" />
      Resolved
    </Badge>
  );
  if (status === "flagged") return (
    <Badge variant="outline" className="gap-1 border-yellow-500 text-yellow-400">
      <ShieldAlert className="h-3 w-3" />
      Redacted
    </Badge>
  );
  return (
    <Badge variant="outline" className="gap-1 border-red-500 text-red-400">
      <XCircle className="h-3 w-3" />
      Error
    </Badge>
  );
}

export default function JoyceGPT() {
  const [query, setQuery] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [quorumStatus, setQuorumStatus] = useState<QuorumStatus>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [voteCount, setVoteCount] = useState<Record<string, boolean | null>>({
    openai: null,
    anthropic: null,
    gemini: null,
  });
  const [result, setResult] = useState<JudgeResult | null>(null);

  const startQuorumDebate = async () => {
    if (!query.trim()) {
      toast.error("Enter a decision query first");
      return;
    }

    setIsDebating(true);
    setQuorumStatus("debating");
    setMessages([]);
    setResult(null);
    setVoteCount({ openai: null, anthropic: null, gemini: null });

    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: JudgeResult = await res.json();

      setResult(data);
      setMessages([
        { id: "winner", label: "Winner", text: data.winner },
        { id: "final", label: "Final Answer", text: data.final },
        {
          id: "scores",
          label: "Scores",
          text: `Optimist ${data.scores.optimist} · Auditor ${data.scores.auditor} · Contrarian ${data.scores.contrarian}`,
          variant: "score",
        },
        {
          id: "risk",
          label: "Risk",
          text: data.risk_detected ? "PII / policy signal detected — output redacted" : "No risk signals detected",
          variant: data.risk_detected ? "flag" : "default",
        },
      ]);

      setVoteCount({
        openai: true,
        anthropic: !data.risk_detected,
        gemini: true,
      });

      if (data.status === "ok") setQuorumStatus("resolved");
      else if (data.status === "redacted") setQuorumStatus("flagged");
      else setQuorumStatus("error");

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setMessages([{ id: "error", label: "Error", text: `n8n unreachable: ${msg}` }]);
      setQuorumStatus("error");
      setVoteCount({ openai: null, anthropic: null, gemini: null });
    } finally {
      setIsDebating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400" />
            JoyceGPT — TR-D³Max Engine
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Deterministic multi-model arbitration · GPT / Claude / Gemini · n8n orchestrated
          </p>
        </div>
        <StatusBadge status={quorumStatus} />
      </div>

      {/* Query Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Decision Query</CardTitle>
          <CardDescription>Submit a strategic question. All three models debate in parallel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Create a YC-ready AI infrastructure pitch"
            className="min-h-[100px] bg-slate-950 border-slate-800 resize-none"
            disabled={isDebating}
          />
          <Button
            onClick={startQuorumDebate}
            disabled={isDebating || !query.trim()}
            className="w-full gap-2"
          >
            {isDebating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Agents debating…
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Start Quorum Debate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Agent Status Grid */}
      <div className="grid grid-cols-3 gap-4">
        {(Object.entries(MODEL_LABELS) as [keyof typeof MODEL_LABELS, typeof MODEL_LABELS[keyof typeof MODEL_LABELS]][]).map(([key, meta]) => {
          const vote = voteCount[key];
          return (
            <Card key={key} className="border-slate-800">
              <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2 text-center">
                <div className={`text-xs font-semibold uppercase tracking-wider ${meta.color}`}>
                  {meta.role}
                </div>
                <div className="text-sm font-medium text-muted-foreground">{meta.label}</div>
                {quorumStatus === "debating" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : vote === true ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                ) : vote === false ? (
                  <ShieldAlert className="h-5 w-5 text-yellow-400" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-slate-700" />
                )}
                <div className="text-xs text-muted-foreground">
                  {quorumStatus === "debating"
                    ? "Running…"
                    : vote === true
                    ? "Cleared"
                    : vote === false
                    ? "Flagged"
                    : "Idle"}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Judge Output */}
      {messages.length > 0 && (
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {quorumStatus === "resolved" ? (
                <ShieldCheck className="h-4 w-4 text-green-400" />
              ) : quorumStatus === "flagged" ? (
                <ShieldAlert className="h-4 w-4 text-yellow-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-400" />
              )}
              Deterministic Judge Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg p-3 text-sm ${
                  msg.variant === "flag"
                    ? "bg-yellow-500/10 border border-yellow-500/30"
                    : msg.variant === "score"
                    ? "bg-slate-800/60 font-mono"
                    : "bg-slate-900"
                }`}
              >
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                  {msg.label}
                </span>
                <span className="text-foreground">{msg.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Config Note */}
      <Card className="border-slate-800 bg-slate-950/60">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-green-500 shrink-0" />
            API keys configured server-side via n8n environment — never exposed to the frontend.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
