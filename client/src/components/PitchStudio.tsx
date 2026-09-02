import { useState, useEffect } from "react";
import { loadFounderGraph, saveFounderGraph } from "@/lib/storage";
import { detectWeakSlides, type SlideFlag } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Slide {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  required: boolean;
}

const SLIDES: Slide[] = [
  { id: "problem", title: "Problem", description: "The pain you solve", placeholder: "Describe the specific, painful problem your target customer faces. Include frequency, cost, and why existing solutions fail.", required: true },
  { id: "solution", title: "Solution", description: "How you solve it", placeholder: "Explain your solution clearly. What does it do? How does it work? What makes it uniquely effective?", required: true },
  { id: "market", title: "Market", description: "TAM / SAM / SOM", placeholder: "Define your target market with specific numbers. Who is your ICP? What is the addressable market size?", required: true },
  { id: "traction", title: "Traction", description: "Proof it works", placeholder: "List concrete metrics: revenue, users, growth rate, key customers, LOIs, pilots. Use numbers.", required: true },
  { id: "team", title: "Team", description: "Why you win", placeholder: "Why is your team uniquely positioned? Relevant experience, domain expertise, unfair advantages.", required: true },
  { id: "business_model", title: "Business Model", description: "How you make money", placeholder: "Explain your revenue model, pricing strategy, unit economics (CAC, LTV, payback period).", required: true },
  { id: "competition", title: "Competition", description: "Competitive landscape", placeholder: "Map the competitive landscape. Why are you different? What is your defensible moat?", required: false },
  { id: "ask", title: "The Ask", description: "What you need", placeholder: "How much are you raising? What will you use it for? What milestones will this funding achieve?", required: false },
  { id: "vision", title: "Vision", description: "Where you are going", placeholder: "What does the world look like when you win? What is the 10-year vision?", required: false },
  { id: "product", title: "Product", description: "Demo / screenshots", placeholder: "Describe your product's key features, workflow, or demo highlights.", required: false },
];

const SEVERITY_COLORS: Record<string, string> = {
  critical: "border-red-600 bg-red-950 text-red-300",
  warning: "border-yellow-600 bg-yellow-950 text-yellow-300",
  info: "border-blue-600 bg-blue-950 text-blue-300",
};

const SEVERITY_BADGE: Record<string, string> = {
  critical: "bg-red-900 text-red-300",
  warning: "bg-yellow-900 text-yellow-300",
  info: "bg-blue-900 text-blue-300",
};

export default function PitchStudio() {
  const [slides, setSlides] = useState<Record<string, string>>({});
  const [activeSlide, setActiveSlide] = useState<string>("problem");
  const [flags, setFlags] = useState<SlideFlag[]>([]);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    loadFounderGraph().then(g => {
      setSlides(g.pitch.slides);
      if (Object.keys(g.pitch.slides).length > 0) {
        setFlags(detectWeakSlides(g.pitch.slides));
      }
    });
  }, []);

  const handleChange = (slideId: string, value: string) => {
    const updated = { ...slides, [slideId]: value };
    setSlides(updated);
    setFlags(detectWeakSlides(updated));
  };

  const handleBlur = async (slideId: string) => {
    const g = await loadFounderGraph();
    const weakSlides = flags.filter(f => f.severity === "critical").map(f => f.slideId);
    await saveFounderGraph({ ...g, pitch: { ...g.pitch, slides: { ...slides }, weakSlides, updatedAt: Date.now() } });
  };

  const completedRequired = SLIDES.filter(s => s.required && (slides[s.id] || "").trim().length > 0).length;
  const totalRequired = SLIDES.filter(s => s.required).length;
  const flagsForSlide = (slideId: string) => flags.filter(f => f.slideId === slideId);
  const criticalCount = flags.filter(f => f.severity === "critical").length;
  const warningCount = flags.filter(f => f.severity === "warning").length;

  const exportFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              Pitch Studio
            </h1>
            <p className="text-gray-400 text-sm mt-1">Build your deck. Detect weak slides. Export anywhere.</p>
          </div>
          <button
            onClick={() => setShowExport(!showExport)}
            className="px-3 py-1.5 text-sm rounded-lg border border-pink-700 text-pink-400 hover:bg-pink-950 transition-all"
          >
            Export ↓
          </button>
        </div>

        {showExport && (
          <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-wrap gap-3">
            <Button variant="outline" className="border-gray-700 text-gray-300" onClick={() => {
              const text = SLIDES.filter(s => slides[s.id]).map(s => `## ${s.title}\n${slides[s.id]}`).join("\n\n---\n\n");
              exportFile(text, "pitch_deck_outline.txt", "text/plain");
              toast("Google Slides outline downloaded.");
            }}>Google Slides Outline (.txt)</Button>
            <Button variant="outline" className="border-gray-700 text-gray-300" onClick={() => {
              const text = SLIDES.filter(s => slides[s.id]).map(s => `# ${s.title}\n\n${slides[s.id]}\n`).join("\n---\n\n");
              exportFile(text, "pitch_gamma_ready.md", "text/markdown");
              toast("Gamma-ready markdown downloaded.");
            }}>Gamma Markdown (.md)</Button>
            <Button variant="outline" className="border-gray-700 text-gray-300" onClick={() => {
              const text = SLIDES.filter(s => slides[s.id]).map(s => `SLIDE: ${s.title.toUpperCase()}\n${"─".repeat(40)}\n${slides[s.id]}\n`).join("\n\n");
              exportFile(text, "pitch_pdf_draft.txt", "text/plain");
              toast("PDF draft downloaded.");
            }}>PDF Draft (.txt)</Button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-pink-400">{completedRequired}/{totalRequired}</div>
            <div className="text-xs text-gray-500 mt-1">Required slides</div>
          </div>
          <div className="bg-gray-900 border border-red-900 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
            <div className="text-xs text-gray-500 mt-1">Critical flags</div>
          </div>
          <div className="bg-gray-900 border border-yellow-900 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
            <div className="text-xs text-gray-500 mt-1">Warnings</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Slides</div>
              <div className="space-y-1">
                {SLIDES.map(slide => {
                  const hasContent = (slides[slide.id] || "").trim().length > 0;
                  const slideFlags = flagsForSlide(slide.id);
                  const hasCritical = slideFlags.some(f => f.severity === "critical");
                  const hasWarning = slideFlags.some(f => f.severity === "warning");
                  return (
                    <button
                      key={slide.id}
                      onClick={() => setActiveSlide(slide.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                        activeSlide === slide.id ? "bg-pink-950 border border-pink-700 text-pink-300" : "hover:bg-gray-800 text-gray-400"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${hasContent ? "bg-green-500" : "bg-gray-700"}`} />
                        {slide.title}
                        {!slide.required && <span className="text-gray-600 text-xs">(opt)</span>}
                      </span>
                      {hasCritical && <span className="text-red-400 text-xs">!</span>}
                      {!hasCritical && hasWarning && <span className="text-yellow-400 text-xs">~</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {SLIDES.filter(s => s.id === activeSlide).map(slide => {
              const slideFlags = flagsForSlide(slide.id);
              const text = slides[slide.id] || "";
              const wc = text.trim() ? text.trim().split(/\s+/).length : 0;
              const activeIdx = SLIDES.findIndex(s => s.id === activeSlide);
              return (
                <div key={slide.id}>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-xl font-bold text-white">{slide.title}</h2>
                      <div className="flex items-center gap-2">
                        {!slide.required && <Badge variant="outline" className="text-xs text-gray-500 border-gray-700">Optional</Badge>}
                        <span className="text-xs text-gray-500">{wc} words</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{slide.description}</p>
                    <Textarea
                      value={text}
                      onChange={(e) => handleChange(slide.id, e.target.value)}
                      onBlur={() => handleBlur(slide.id)}
                      placeholder={slide.placeholder}
                      className="bg-black border-gray-700 text-gray-200 text-sm min-h-[180px] resize-none focus:border-pink-500"
                    />
                  </div>

                  {slideFlags.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Weak Slide Detector</div>
                      {slideFlags.map((flag, i) => (
                        <div key={i} className={`border rounded-lg p-3 ${SEVERITY_COLORS[flag.severity]}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${SEVERITY_BADGE[flag.severity]}`}>
                              {flag.severity.toUpperCase()}
                            </span>
                            <span className="text-sm font-medium">{flag.rule}</span>
                          </div>
                          <p className="text-xs opacity-80">{flag.description}</p>
                          {flag.suggestion && <p className="text-xs mt-1 opacity-60 italic">Suggestion: {flag.suggestion}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between">
                    {activeIdx > 0 && (
                      <button onClick={() => setActiveSlide(SLIDES[activeIdx - 1].id)} className="text-sm text-gray-500 hover:text-gray-300">
                        ← {SLIDES[activeIdx - 1].title}
                      </button>
                    )}
                    {activeIdx < SLIDES.length - 1 && (
                      <button onClick={() => setActiveSlide(SLIDES[activeIdx + 1].id)} className="text-sm text-pink-400 hover:text-pink-300 ml-auto">
                        {SLIDES[activeIdx + 1].title} →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {flags.filter(f => f.type === "narrative").length > 0 && (
          <div className="mt-6 bg-gray-900 border border-purple-800 rounded-xl p-4">
            <div className="text-sm font-semibold text-purple-400 mb-3">Narrative Consistency Engine</div>
            <div className="space-y-2">
              {flags.filter(f => f.type === "narrative").map((flag, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-purple-500 flex-shrink-0">◆</span>
                  <div>
                    <span className="text-gray-300">{flag.description}</span>
                    {flag.suggestion && <span className="text-gray-500 ml-2 italic text-xs">— {flag.suggestion}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
