import { useState, useEffect, useCallback } from "react";
import { loadFounderGraph, saveFounderGraph, type FounderGraph, type ApplicationAnswer } from "@/lib/storage";
import { scoreAnswer } from "@/lib/scoring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ProgramQuestion {
  id: string;
  text: string;
  wordLimit: number;
  intent: "clarity" | "traction" | "insight_density" | "differentiation" | "team";
  weight: number;
}

interface Program {
  id: string;
  name: string;
  color: string;
  questions: ProgramQuestion[];
  thesis: string;
}

const PROGRAMS: Program[] = [
  {
    id: "yc_s26",
    name: "Y Combinator S26",
    color: "#f97316",
    thesis: "Exceptional founders building something people want",
    questions: [
      { id: "yc_describe", text: "Describe what your company does in 50 characters or less.", wordLimit: 10, intent: "clarity", weight: 0.25 },
      { id: "yc_problem", text: "What is the problem or opportunity you are addressing?", wordLimit: 150, intent: "insight_density", weight: 0.2 },
      { id: "yc_solution", text: "What is your solution? How does it work?", wordLimit: 150, intent: "clarity", weight: 0.2 },
      { id: "yc_traction", text: "How far along are you? What traction do you have?", wordLimit: 200, intent: "traction", weight: 0.25 },
      { id: "yc_why_now", text: "Why is now the right time for this company?", wordLimit: 150, intent: "insight_density", weight: 0.1 },
    ],
  },
  {
    id: "techstars",
    name: "Techstars",
    color: "#3b82f6",
    thesis: "Founders-first, mentor-driven, global network",
    questions: [
      { id: "ts_elevator", text: "Give us your elevator pitch (2-3 sentences).", wordLimit: 75, intent: "clarity", weight: 0.2 },
      { id: "ts_problem", text: "What problem are you solving and for whom?", wordLimit: 200, intent: "insight_density", weight: 0.25 },
      { id: "ts_differentiation", text: "What makes your solution unique vs. existing alternatives?", wordLimit: 200, intent: "differentiation", weight: 0.25 },
      { id: "ts_traction", text: "Describe your traction: revenue, users, pilots, LOIs.", wordLimit: 200, intent: "traction", weight: 0.2 },
      { id: "ts_team", text: "Why is your team uniquely positioned to win?", wordLimit: 200, intent: "team", weight: 0.1 },
    ],
  },
  {
    id: "a16z_speedrun",
    name: "a16z Speedrun",
    color: "#8b5cf6",
    thesis: "AI-native companies with 600-person operator network access",
    questions: [
      { id: "a16z_one_liner", text: "One-line company description.", wordLimit: 20, intent: "clarity", weight: 0.15 },
      { id: "a16z_ai_angle", text: "How is AI core to your product, not just a feature?", wordLimit: 200, intent: "insight_density", weight: 0.3 },
      { id: "a16z_market", text: "What is your target market and why is it large?", wordLimit: 150, intent: "differentiation", weight: 0.2 },
      { id: "a16z_traction", text: "What have you built and shipped? What is working?", wordLimit: 200, intent: "traction", weight: 0.25 },
      { id: "a16z_team", text: "Why you? What is your unfair advantage?", wordLimit: 150, intent: "team", weight: 0.1 },
    ],
  },
  {
    id: "berkeley_skydeck",
    name: "Berkeley SkyDeck",
    color: "#10b981",
    thesis: "UC Berkeley network + institutional credibility for deep tech",
    questions: [
      { id: "bsd_summary", text: "Describe your startup in 2-3 sentences.", wordLimit: 75, intent: "clarity", weight: 0.2 },
      { id: "bsd_problem", text: "What specific problem are you solving?", wordLimit: 200, intent: "insight_density", weight: 0.25 },
      { id: "bsd_solution", text: "Describe your solution and technology.", wordLimit: 200, intent: "clarity", weight: 0.2 },
      { id: "bsd_market", text: "Who is your target customer and how large is the market?", wordLimit: 200, intent: "differentiation", weight: 0.2 },
      { id: "bsd_team", text: "Describe your team background and relevant experience.", wordLimit: 200, intent: "team", weight: 0.15 },
    ],
  },
  {
    id: "genaifund",
    name: "GenAI Fund FastTrack",
    color: "#ec4899",
    thesis: "AI startups ready for enterprise PoC and ASEAN expansion",
    questions: [
      { id: "gf_problem", text: "What enterprise problem does your AI solve?", wordLimit: 150, intent: "insight_density", weight: 0.25 },
      { id: "gf_solution", text: "Describe your AI solution and its technical differentiation.", wordLimit: 200, intent: "differentiation", weight: 0.3 },
      { id: "gf_traction", text: "What enterprise traction do you have (pilots, LOIs, revenue)?", wordLimit: 200, intent: "traction", weight: 0.25 },
      { id: "gf_asean", text: "How does your product fit the ASEAN market?", wordLimit: 150, intent: "insight_density", weight: 0.2 },
    ],
  },
];

const YC_TEMPLATES: Record<string, string> = {
  yc_describe: "[Company name] makes [product] for [customer] to [outcome].",
  yc_problem: "Today, [target customer] struggle with [specific pain point]. This costs them [time/money/opportunity]. Existing solutions fail because [specific gap].",
  yc_solution: "We built [product] that [mechanism]. Unlike [alternative], we [key differentiator]. Our approach works by [how it works in 1-2 sentences].",
  yc_traction: "We have [X] paying customers generating $[MRR] MRR. In the last [period], we grew [X]%. Key customers include [notable names]. We have [LOIs/pilots] in pipeline.",
  yc_why_now: "Three forces converge now: [technical enabler], [market shift], and [regulatory/behavioral change]. This creates a [window] that did not exist [timeframe] ago.",
};

const REUSE_MAP: Record<string, string[]> = {
  yc_problem: ["ts_problem", "a16z_ai_angle", "bsd_problem", "gf_problem"],
  yc_solution: ["ts_differentiation", "a16z_ai_angle", "bsd_solution", "gf_solution"],
  yc_traction: ["ts_traction", "a16z_traction", "gf_traction"],
  ts_team: ["a16z_team", "bsd_team"],
};

export default function Builder() {
  const [graph, setGraph] = useState<FounderGraph | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program>(PROGRAMS[0]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [showOneLiners, setShowOneLiners] = useState(false);
  const [optimizing, setOptimizing] = useState<string | null>(null);

  useEffect(() => {
    loadFounderGraph().then(g => {
      setGraph(g);
      const savedAnswers: Record<string, string> = {};
      g.answers.forEach((a: ApplicationAnswer) => { savedAnswers[a.questionId] = a.rawText; });
      setAnswers(savedAnswers);
    });
  }, []);

  const saveAnswer = useCallback(async (questionId: string, text: string) => {
    if (!graph) return;
    const q = selectedProgram.questions.find(q => q.id === questionId);
    const scored = scoreAnswer(text, q?.wordLimit || 150);
    const existing = graph.answers.find((a: ApplicationAnswer) => a.questionId === questionId);
    const prev = existing?.rawText || "";
    const newAnswer: ApplicationAnswer = {
      programId: selectedProgram.id,
      questionId,
      rawText: text,
      tokens: text.split(/\s+/).length,
      score: scored,
      versionHistory: prev ? [...(existing?.versionHistory || []), prev].slice(-5) : [],
      updatedAt: Date.now(),
    };
    const updatedAnswers = graph.answers.filter((a: ApplicationAnswer) => a.questionId !== questionId);
    updatedAnswers.push(newAnswer);
    const updated = { ...graph, answers: updatedAnswers };
    setGraph(updated);
    await saveFounderGraph(updated);
  }, [graph, selectedProgram]);

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleBlur = (questionId: string) => {
    const text = answers[questionId] || "";
    if (text.trim()) saveAnswer(questionId, text);
  };

  const rollback = (questionId: string) => {
    const a = graph?.answers.find((a: ApplicationAnswer) => a.questionId === questionId);
    if (!a || !a.versionHistory.length) return;
    const prev = a.versionHistory[a.versionHistory.length - 1];
    setAnswers(p => ({ ...p, [questionId]: prev }));
    toast("Rolled back — previous version restored.");
  };

  const simulateOptimize = async (questionId: string) => {
    const text = answers[questionId] || "";
    if (!text.trim()) return;
    setOptimizing(questionId);
    await new Promise(r => setTimeout(r, 1200));
    let optimized = text
      .replace(/\b(very|really|quite|just|actually|basically|essentially|literally)\b\s*/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    optimized = optimized
      .replace(/\bleverage\b/gi, "use")
      .replace(/\butilize\b/gi, "use")
      .replace(/\bfacilitate\b/gi, "enable")
      .replace(/\bsynergize\b/gi, "combine")
      .replace(/\bstreamline\b/gi, "simplify");
    setAnswers(p => ({ ...p, [questionId]: optimized }));
    await saveAnswer(questionId, optimized);
    setOptimizing(null);
    toast("Optimized: compress + de-jargonize pipeline complete.");
  };

  const applyReuse = (sourceId: string, targetId: string) => {
    const sourceText = answers[sourceId] || "";
    if (!sourceText) return;
    setAnswers(p => ({ ...p, [targetId]: sourceText }));
    toast("Answer reused — edit to adapt for this program.");
  };

  const completedCount = selectedProgram.questions.filter(q => (answers[q.id] || "").trim().length > 0).length;
  const progress = Math.round((completedCount / selectedProgram.questions.length) * 100);

  const oneLiners = {
    investor: "[Company] makes [product] for [ICP] — a $[TAM] market — using [key tech] to [measurable outcome]. Early traction: [metric].",
    technical: "[Product] is a [architecture] system that [mechanism] to solve [technical problem] for [developer/operator persona].",
    plainEnglish: "We help [who] [do what] without [pain point], so they can [outcome].",
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Application Engine
          </h1>
          <p className="text-gray-400">Deterministic compiler for accelerator applications. Build once, reuse across programs.</p>
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Select Program</label>
          <div className="flex flex-wrap gap-2">
            {PROGRAMS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProgram(p)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedProgram.id === p.id
                    ? "border-transparent text-black"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
                style={selectedProgram.id === p.id ? { backgroundColor: p.color } : {}}
              >
                {p.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 italic">Thesis: {selectedProgram.thesis}</p>
        </div>

        <div className="mb-6 bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">{completedCount}/{selectedProgram.questions.length} sections complete</span>
            <span className="text-sm font-bold" style={{ color: selectedProgram.color }}>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowOneLiners(!showOneLiners)}
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2"
          >
            <span>{showOneLiners ? "▼" : "▶"}</span> One-liner Generator (3 variants)
          </button>
          {showOneLiners && (
            <div className="mt-3 space-y-3">
              {[
                { label: "Investor-Friendly", key: "investor", color: "text-orange-400" },
                { label: "Technical", key: "technical", color: "text-blue-400" },
                { label: "Plain English", key: "plainEnglish", color: "text-green-400" },
              ].map(({ label, key, color }) => (
                <div key={key} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                  <div className={`text-xs font-semibold mb-1 ${color}`}>{label}</div>
                  <p className="text-sm text-gray-300">{oneLiners[key as keyof typeof oneLiners]}</p>
                  <button
                    onClick={() => { navigator.clipboard.writeText(oneLiners[key as keyof typeof oneLiners]); toast("Copied!"); }}
                    className="text-xs text-gray-500 hover:text-gray-300 mt-1"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {selectedProgram.questions.map((q, idx) => {
            const text = answers[q.id] || "";
            const wc = text.trim() ? text.trim().split(/\s+/).length : 0;
            const scored = text.trim() ? scoreAnswer(text, q.wordLimit) : null;
            const reuseSuggestions = REUSE_MAP[q.id] || [];
            const hasVersion = (graph?.answers.find((a: ApplicationAnswer) => a.questionId === q.id)?.versionHistory?.length || 0) > 0;
            const template = YC_TEMPLATES[q.id];

            return (
              <div
                key={q.id}
                className={`bg-gray-900 border rounded-xl p-5 transition-all ${
                  activeQuestion === q.id ? "border-purple-500" : "border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 font-mono">Q{idx + 1}</span>
                      <Badge variant="outline" className="text-xs capitalize" style={{ borderColor: selectedProgram.color, color: selectedProgram.color }}>
                        {q.intent.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-gray-600">weight: {Math.round(q.weight * 100)}%</span>
                    </div>
                    <p className="text-sm text-gray-200 font-medium">{q.text}</p>
                  </div>
                  <span className={`text-xs ml-4 flex-shrink-0 ${wc > q.wordLimit ? "text-red-400" : "text-gray-500"}`}>
                    {wc}/{q.wordLimit}w
                  </span>
                </div>

                <Textarea
                  value={text}
                  onChange={(e) => handleTextChange(q.id, e.target.value)}
                  onFocus={() => setActiveQuestion(q.id)}
                  onBlur={() => handleBlur(q.id)}
                  placeholder={template ? `Template: ${template}` : "Start writing..."}
                  className="bg-black border-gray-700 text-gray-200 text-sm min-h-[100px] resize-none focus:border-purple-500"
                />

                {scored && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { label: "Clarity", val: scored.clarity },
                      { label: "Concision", val: scored.concision },
                      { label: "Differentiation", val: scored.differentiation },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{label}</span>
                          <span>{Math.round(val * 100)}%</span>
                        </div>
                        <div className="h-1 bg-gray-800 rounded">
                          <div
                            className="h-1 rounded transition-all"
                            style={{
                              width: `${val * 100}%`,
                              backgroundColor: val > 0.7 ? "#10b981" : val > 0.4 ? "#f59e0b" : "#ef4444",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {template && (
                    <button
                      onClick={() => setAnswers(p => ({ ...p, [q.id]: template }))}
                      className="text-xs text-gray-500 hover:text-yellow-400 border border-gray-700 hover:border-yellow-600 px-2 py-1 rounded"
                    >
                      Use Template
                    </button>
                  )}
                  <button
                    onClick={() => simulateOptimize(q.id)}
                    disabled={!text.trim() || optimizing === q.id}
                    className="text-xs text-purple-400 hover:text-purple-300 border border-purple-800 hover:border-purple-600 px-2 py-1 rounded disabled:opacity-40"
                  >
                    {optimizing === q.id ? "Optimizing..." : "Optimize"}
                  </button>
                  {hasVersion && (
                    <button
                      onClick={() => rollback(q.id)}
                      className="text-xs text-gray-500 hover:text-blue-400 border border-gray-700 hover:border-blue-600 px-2 py-1 rounded"
                    >
                      Rollback
                    </button>
                  )}
                  {text.trim() && (
                    <button
                      onClick={() => { navigator.clipboard.writeText(text); toast("Copied!"); }}
                      className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 px-2 py-1 rounded"
                    >
                      Copy
                    </button>
                  )}
                  {reuseSuggestions.length > 0 && text.trim() && (
                    <div className="relative group">
                      <button className="text-xs text-green-500 hover:text-green-400 border border-green-900 hover:border-green-700 px-2 py-1 rounded">
                        Reuse to other programs
                      </button>
                      <div className="absolute left-0 top-7 z-10 hidden group-hover:block bg-gray-900 border border-gray-700 rounded-lg p-2 min-w-[200px]">
                        {reuseSuggestions.map(targetId => (
                          <button
                            key={targetId}
                            onClick={() => applyReuse(q.id, targetId)}
                            className="block w-full text-left text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800"
                          >
                            Copy to: {targetId.replace(/_/g, " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-400 hover:text-white"
            onClick={() => {
              const exportText = selectedProgram.questions
                .map(q => `## ${q.text}\n\n${answers[q.id] || "(empty)"}\n`)
                .join("\n---\n\n");
              const blob = new Blob([exportText], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${selectedProgram.id}_application.txt`;
              a.click();
            }}
          >
            Download .txt
          </Button>
          <Button
            variant="outline"
            className="border-gray-700 text-gray-400 hover:text-white"
            onClick={() => {
              const exportText = selectedProgram.questions
                .map(q => `## ${q.text}\n\n${answers[q.id] || "(empty)"}`)
                .join("\n\n---\n\n");
              navigator.clipboard.writeText(exportText);
              toast("Copied all answers to clipboard!");
            }}
          >
            Copy All
          </Button>
        </div>
      </div>
    </div>
  );
}
