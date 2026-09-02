import { useState, useEffect } from "react";
import { loadFounderGraph, saveFounderGraph, type ICPProfile, type ProblemValidation } from "@/lib/storage";
import { scoreICP, computePVI, computeBPI, computeSAS, scoreAnswer } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Competitor { id: string; name: string; weakness: string; yourEdge: string; }

function SliderInput({ label, value, onChange, description }: {
  label: string; value: number; onChange: (v: number) => void; description?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm text-gray-300">{label}</label>
        <span className="text-sm font-bold text-white">{value}/10</span>
      </div>
      {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
      <input
        type="range" min={0} max={10} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-purple-500"
      />
    </div>
  );
}

export default function ConceptRefinement() {
  const [icp, setICP] = useState<ICPProfile>({
    targetRole: "", companySize: "", industry: "",
    painIntensity: 5, willingnessToPay: 5, accessibility: 5,
  });
  const [pv, setPV] = useState<ProblemValidation>({
    statement: "", frequency: 5, urgency: 5, existingSpend: 5, validationIndex: 0,
  });
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { id: "c1", name: "", weakness: "", yourEdge: "" },
    { id: "c2", name: "", weakness: "", yourEdge: "" },
    { id: "c3", name: "", weakness: "", yourEdge: "" },
  ]);
  const [oneLiner, setOneLiner] = useState("");
  const [bpi, setBPI] = useState(0);
  const [sas, setSAS] = useState(0);

  useEffect(() => {
    loadFounderGraph().then(g => {
      setICP(g.icp);
      setPV(g.problemValidation);
      setOneLiner(g.idea.oneLiner);
      const icpScore = scoreICP(g.icp.painIntensity, g.icp.willingnessToPay, g.icp.accessibility);
      const pviScore = computePVI(g.problemValidation.frequency, g.problemValidation.urgency, g.problemValidation.existingSpend);
      const clarity = g.idea.oneLiner ? scoreAnswer(g.idea.oneLiner, 20).clarity : 0;
      setBPI(computeBPI({ clarityScore: clarity, differentiationScore: icpScore / 100, hasTraction: false, programAlignment: 0.5 }));
      setSAS(computeSAS({ icpMatchScore: icpScore / 100, marketSizeScore: pviScore / 100, teamNarrativeScore: 0.5 }));
    });
  }, []);

  const recompute = (newICP: ICPProfile, newPV: ProblemValidation, newOneLiner: string) => {
    const icpScore = scoreICP(newICP.painIntensity, newICP.willingnessToPay, newICP.accessibility);
    const pviScore = computePVI(newPV.frequency, newPV.urgency, newPV.existingSpend);
    const clarity = newOneLiner ? scoreAnswer(newOneLiner, 20).clarity : 0;
    setBPI(computeBPI({ clarityScore: clarity, differentiationScore: icpScore / 100, hasTraction: false, programAlignment: 0.5 }));
    setSAS(computeSAS({ icpMatchScore: icpScore / 100, marketSizeScore: pviScore / 100, teamNarrativeScore: 0.5 }));
  };

  const updateICP = (field: keyof ICPProfile, value: string | number) => {
    const updated = { ...icp, [field]: value };
    setICP(updated);
    recompute(updated, pv, oneLiner);
  };

  const updatePV = (field: keyof ProblemValidation, value: string | number) => {
    const updated = { ...pv, [field]: value };
    setPV(updated);
    recompute(icp, updated, oneLiner);
  };

  const save = async () => {
    const g = await loadFounderGraph();
    const pviScore = computePVI(pv.frequency, pv.urgency, pv.existingSpend);
    await saveFounderGraph({
      ...g, icp,
      problemValidation: { ...pv, validationIndex: pviScore },
      idea: { ...g.idea, oneLiner, updatedAt: Date.now() },
      scores: { bpiGlobal: bpi, sasGlobal: sas, updatedAt: Date.now() },
    });
    toast("Concept saved.");
  };

  const icpScore = scoreICP(icp.painIntensity, icp.willingnessToPay, icp.accessibility);
  const pviScore = computePVI(pv.frequency, pv.urgency, pv.existingSpend);
  const scoreColor = (v: number) => v >= 70 ? "#10b981" : v >= 40 ? "#f59e0b" : "#ef4444";

  const icpFields: { field: keyof ICPProfile; label: string; placeholder: string }[] = [
    { field: "targetRole", label: "Target Role", placeholder: "e.g. CTO, VP Engineering, Founder" },
    { field: "companySize", label: "Company Size", placeholder: "e.g. 1-50 employees, Series A-B" },
    { field: "industry", label: "Industry", placeholder: "e.g. B2B SaaS, AI/ML, FinTech" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Concept Refinement
            </h1>
            <p className="text-gray-400 text-sm mt-1">ICP scoring · Problem Validation Index · Competitor Gap Analyzer</p>
          </div>
          <Button className="bg-emerald-700 hover:bg-emerald-600 text-white" onClick={save}>Save</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "ICP Score", value: icpScore, desc: "Ideal Customer Profile" },
            { label: "PVI", value: pviScore, desc: "Problem Validation Index" },
            { label: "BPI", value: bpi, desc: "Bullseye Probability Index" },
            { label: "SAS", value: sas, desc: "Strategic Alignment Score" },
          ].map(({ label, value, desc }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: scoreColor(value) }}>{value}</div>
              <div className="text-sm font-semibold text-gray-300">{label}</div>
              <div className="text-xs text-gray-600 mt-1">{desc}</div>
              <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: scoreColor(value) }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-emerald-400 mb-3">Company One-Liner</h2>
            <Textarea
              value={oneLiner}
              onChange={e => { setOneLiner(e.target.value); recompute(icp, pv, e.target.value); }}
              placeholder="[Company] makes [product] for [ICP] to [outcome]."
              className="bg-black border-gray-700 text-gray-200 text-sm min-h-[80px] resize-none focus:border-emerald-500"
            />
            {oneLiner && (
              <div className="mt-2 text-xs text-gray-500">
                {oneLiner.split(/\s+/).length} words · Clarity: {Math.round(scoreAnswer(oneLiner, 20).clarity * 100)}%
              </div>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-emerald-400">ICP Profile</h2>
              <span className="text-2xl font-bold" style={{ color: scoreColor(icpScore) }}>{icpScore}</span>
            </div>
            <div className="space-y-3 mb-5">
              {icpFields.map(({ field, label, placeholder }) => (
                <div key={String(field)}>
                  <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                  <input
                    value={String(icp[field])}
                    onChange={e => updateICP(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-black border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:border-emerald-500 outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <SliderInput label="Pain Intensity" value={icp.painIntensity} onChange={v => updateICP("painIntensity", v)} description="How painful? (1=minor, 10=business-critical)" />
              <SliderInput label="Willingness to Pay" value={icp.willingnessToPay} onChange={v => updateICP("willingnessToPay", v)} description="How likely to pay? (1=never, 10=already budgeted)" />
              <SliderInput label="Accessibility" value={icp.accessibility} onChange={v => updateICP("accessibility", v)} description="How easy to reach? (1=very hard, 10=direct channel)" />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-emerald-400">Problem Validation Index</h2>
              <span className="text-2xl font-bold" style={{ color: scoreColor(pviScore) }}>{pviScore}</span>
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-1 block">Problem Statement</label>
              <Textarea
                value={pv.statement}
                onChange={e => updatePV("statement", e.target.value)}
                placeholder="Describe the specific problem in one clear sentence."
                className="bg-black border-gray-700 text-gray-200 text-sm min-h-[80px] resize-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-4">
              <SliderInput label="Frequency" value={pv.frequency} onChange={v => updatePV("frequency", v)} description="How often does your ICP encounter this? (1=rarely, 10=daily)" />
              <SliderInput label="Urgency" value={pv.urgency} onChange={v => updatePV("urgency", v)} description="How urgently do they need a solution? (1=can wait, 10=needs fix now)" />
              <SliderInput label="Existing Spend" value={pv.existingSpend} onChange={v => updatePV("existingSpend", v)} description="Already spending on workarounds? (1=no, 10=significant budget)" />
            </div>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg text-sm">
              {pviScore >= 70
                ? <span className="text-green-400">Strong signal — worth building for.</span>
                : pviScore >= 40
                ? <span className="text-yellow-400">Moderate — validate further before building.</span>
                : <span className="text-red-400">Weak signal — reconsider problem or ICP.</span>}
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-emerald-400 mb-4">Competitor Gap Analyzer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {competitors.map((comp, i) => (
                <div key={comp.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-2">Competitor {i + 1}</div>
                  <input
                    value={comp.name}
                    onChange={e => setCompetitors(cs => cs.map(c => c.id === comp.id ? { ...c, name: e.target.value } : c))}
                    placeholder="Competitor name"
                    className="w-full bg-black border border-gray-700 text-gray-200 text-sm rounded px-2 py-1.5 mb-2 focus:border-emerald-500 outline-none"
                  />
                  <textarea
                    value={comp.weakness}
                    onChange={e => setCompetitors(cs => cs.map(c => c.id === comp.id ? { ...c, weakness: e.target.value } : c))}
                    placeholder="Their key weakness..."
                    rows={2}
                    className="w-full bg-black border border-gray-700 text-gray-300 text-xs rounded px-2 py-1.5 mb-2 resize-none focus:border-yellow-500 outline-none"
                  />
                  <textarea
                    value={comp.yourEdge}
                    onChange={e => setCompetitors(cs => cs.map(c => c.id === comp.id ? { ...c, yourEdge: e.target.value } : c))}
                    placeholder="Your edge over them..."
                    rows={2}
                    className="w-full bg-black border border-gray-700 text-emerald-300 text-xs rounded px-2 py-1.5 resize-none focus:border-emerald-500 outline-none"
                  />
                </div>
              ))}
            </div>
            {competitors.filter(c => c.name.trim()).length > 0 && (
              <div className="mt-4 p-4 bg-gray-800 border border-emerald-900 rounded-lg">
                <div className="text-sm font-semibold text-emerald-400 mb-2">Gap Summary</div>
                {competitors.filter(c => c.name.trim()).map(c => (
                  <div key={c.id} className="text-xs text-gray-300 mb-1">
                    <span className="text-gray-500">vs {c.name}:</span>{" "}
                    {c.weakness && <span className="text-red-400">Weak: {c.weakness}</span>}
                    {c.weakness && c.yourEdge && <span className="text-gray-600"> → </span>}
                    {c.yourEdge && <span className="text-emerald-400">Edge: {c.yourEdge}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
