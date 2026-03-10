import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, ArrowRight, ChevronDown, ChevronUp, Copy, Pause, Settings, Database, Brain, FileSpreadsheet, GitBranch, Zap } from 'lucide-react';

const workflowJSON = {
  name: "PlatFormula.ONE - Lead Harvester v2",
  nodes: [
    {
      id: "trigger-intake",
      name: "Batch Lead Intake (Sheet)",
      type: "googleSheetsTrigger",
      icon: "FileSpreadsheet",
      color: "emerald",
      description: "Polls Intake tab every minute for new rows",
      config: {
        "Poll Frequency": "Every minute",
        "Sheet Tab": "Intake",
        "Event": "rowAdded",
        "Required Columns": "name, role, company, profile_text"
      }
    },
    {
      id: "llm-extract",
      name: "JoyceGPT Extraction & Scoring",
      type: "anthropic",
      icon: "Brain",
      color: "violet",
      description: "Claude 3.7 Sonnet extracts pain points, scores lead, drafts InMail & email",
      config: {
        "Model": "claude-3-7-sonnet-20260217",
        "Output Format": "Raw JSON (no fences)",
        "Fields Extracted": "pain_point, lead_score, inmail_draft, email_framework"
      }
    },
    {
      id: "code-parse",
      name: "Parse & Validate Response",
      type: "code",
      icon: "Settings",
      color: "amber",
      description: "Parses LLM string → JSON, validates schema, strips code fences, clamps score",
      config: {
        "Auto-detect Output Path": "message.content | text | content[0].text",
        "Strip Code Fences": "Yes",
        "Validate Fields": "pain_point, lead_score, inmail_draft, email_framework.*",
        "Score Clamping": "0-100 integer"
      }
    },
    {
      id: "if-valid",
      name: "Is Valid?",
      type: "if",
      icon: "GitBranch",
      color: "blue",
      description: "Routes valid extractions to Command Center, failures to Error log",
      config: {
        "Condition": "_valid === true",
        "True →": "Append to Command Center",
        "False →": "Log Parse Error"
      }
    },
    {
      id: "append-command-center",
      name: "Append to Command Center",
      type: "googleSheets",
      icon: "Database",
      color: "emerald",
      description: "Writes enriched lead + score + drafts to Command Center tab",
      config: {
        "Operation": "append",
        "Sheet Tab": "Command Center",
        "Columns": "Name, Role, Company, Lead Score, Pain Point, InMail Draft, Email Hook/Insight/Credibility/CTA, Status, Processed At"
      }
    },
    {
      id: "log-error",
      name: "Log Parse Error",
      type: "googleSheets",
      icon: "AlertTriangle",
      color: "red",
      description: "Logs failed parses with raw LLM response for debugging",
      config: {
        "Operation": "append",
        "Sheet Tab": "Errors",
        "Columns": "Lead Name, Company, Error, Raw Response, Timestamp"
      }
    }
  ]
};

const sheetTabs = [
  {
    name: "Intake",
    color: "emerald",
    headers: ["name", "role", "company", "profile_text"],
    sampleRow: ["Jane Doe", "VP Operations", "Acme Corp", "15+ years scaling ops teams..."]
  },
  {
    name: "Command Center",
    color: "blue",
    headers: ["Name", "Role", "Company", "Lead Score", "Pain Point", "InMail Draft", "Email Hook", "Email Insight", "Email Credibility", "Email CTA", "Status", "Processed At"],
    sampleRow: ["Jane Doe", "VP Operations", "Acme Corp", "82", "Manual reporting bottleneck", "Hi Jane, noticed your ops scaling work at Acme...", "Are your reports still manual?", "Teams like yours save 12hrs/wk", "Used by 3 Fortune 500 ops teams", "15-min walkthrough this week?", "Ready", "2026-03-10T14:30:00Z"]
  },
  {
    name: "Errors",
    color: "red",
    headers: ["Lead Name", "Company", "Error", "Raw Response", "Timestamp"],
    sampleRow: ["John Smith", "Beta Inc", "Missing fields: email_framework", "{\"pain_point\":\"...\",\"lead_score\":71}", "2026-03-10T14:31:00Z"]
  }
];

const mockLeads = [
  { name: "Jane Doe", role: "VP Operations", company: "Acme Corp", score: 82, pain: "Manual reporting bottleneck", status: "Ready" },
  { name: "Marcus Chen", role: "Dir. Revenue Ops", company: "ScaleUp Inc", score: 91, pain: "CRM data fragmentation", status: "Ready" },
  { name: "Sarah Kim", role: "Head of Growth", company: "NovaTech", score: 67, pain: "Lead qualification inconsistency", status: "Ready" },
  { name: "David Okafor", role: "COO", company: "BridgePoint", score: 94, pain: "Cross-team visibility gaps", status: "Ready" },
  { name: "Emily Tran", role: "Sales Manager", company: "Vertex AI", score: 45, pain: "Pipeline forecasting accuracy", status: "Ready" }
];

const IconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FileSpreadsheet, Brain, Settings, GitBranch, Database, AlertTriangle
};

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string; badge: string }> = {
  emerald: { bg: "bg-emerald-900", border: "border-emerald-500", text: "text-emerald-400", dot: "bg-emerald-400", badge: "bg-emerald-500" },
  violet: { bg: "bg-violet-900", border: "border-violet-500", text: "text-violet-400", dot: "bg-violet-400", badge: "bg-violet-500" },
  amber: { bg: "bg-amber-900", border: "border-amber-500", text: "text-amber-400", dot: "bg-amber-400", badge: "bg-amber-500" },
  blue: { bg: "bg-blue-900", border: "border-blue-500", text: "text-blue-400", dot: "bg-blue-400", badge: "bg-blue-500" },
  red: { bg: "bg-red-900", border: "border-red-500", text: "text-red-400", dot: "bg-red-400", badge: "bg-red-500" }
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";
  const bg = score >= 80 ? "bg-emerald-400" : score >= 60 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${bg}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-mono font-bold ${color}`}>{score}</span>
    </div>
  );
}

interface Node {
  id: string;
  name: string;
  type: string;
  icon: string;
  color: string;
  description: string;
  config: Record<string, string>;
}

function NodeCard({ node, expanded, onToggle }: { node: Node; expanded: boolean; onToggle: () => void }) {
  const Icon = IconMap[node.icon];
  const c = colorMap[node.color];
  return (
    <div className={`${c.bg} bg-opacity-30 border ${c.border} border-opacity-40 rounded-lg overflow-hidden`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between p-3 text-left hover:bg-white hover:bg-opacity-5 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${c.bg} bg-opacity-60 flex items-center justify-center`}>
            <Icon size={16} className={c.text} />
          </div>
          <div>
            <div className="text-white text-sm font-semibold">{node.name}</div>
            <div className="text-gray-400 text-xs">{node.type}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${c.dot}`} />
          {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>
      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-700 border-opacity-50 pt-2">
          <p className="text-gray-300 text-xs mb-2">{node.description}</p>
          <div className="space-y-1">
            {Object.entries(node.config).map(([k, v]) => (
              <div key={k} className="flex gap-2 text-xs">
                <span className="text-gray-500 shrink-0">{k}:</span>
                <span className={`${c.text} font-mono break-all`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadHarvester() {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullJSON = JSON.stringify({
      name: "PlatFormula.ONE - Lead Harvester v2",
      nodes: [],
      connections: {},
      active: false,
      settings: { executionOrder: "v1" }
    }, null, 2);
    navigator.clipboard?.writeText(fullJSON).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">PlatFormula.ONE</h1>
              <p className="text-xs text-gray-500">Lead Harvester v2 — Sales Navigator Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 bg-opacity-20 border border-amber-500 border-opacity-30">
              <Pause size={10} className="text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">Inactive</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-900 rounded-lg p-1">
          {[
            { key: "pipeline", label: "Pipeline Nodes" },
            { key: "sheets", label: "Sheet Schema" },
            { key: "preview", label: "Lead Preview" },
            { key: "json", label: "Export JSON" }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                activeTab === t.key ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Pipeline Tab */}
        {activeTab === "pipeline" && (
          <div>
            {/* Visual flow */}
            <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
              {workflowJSON.nodes.map((node, i) => {
                const c = colorMap[node.color];
                return (
                  <React.Fragment key={node.id}>
                    <div className={`shrink-0 px-2.5 py-1.5 rounded-md text-xs font-medium ${c.bg} bg-opacity-40 ${c.text} border ${c.border} border-opacity-30 whitespace-nowrap`}>
                      {node.name.length > 18 ? node.name.substring(0, 18) + "…" : node.name}
                    </div>
                    {i < workflowJSON.nodes.length - 1 && (
                      <ArrowRight size={12} className="text-gray-600 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Node detail cards */}
            <div className="space-y-2">
              {workflowJSON.nodes.map(node => (
                <NodeCard
                  key={node.id}
                  node={node}
                  expanded={expandedNode === node.id}
                  onToggle={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                />
              ))}
            </div>

            {/* Connections summary */}
            <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-800">
              <div className="text-xs font-semibold text-gray-400 mb-2">CONNECTION MAP</div>
              <div className="space-y-1 text-xs font-mono text-gray-500">
                <div>Intake → <span className="text-violet-400">JoyceGPT</span> → <span className="text-amber-400">Parse</span> → <span className="text-blue-400">Valid?</span></div>
                <div className="pl-4">├─ true → <span className="text-emerald-400">Command Center</span></div>
                <div className="pl-4">└─ false → <span className="text-red-400">Error Log</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Sheet Schema Tab */}
        {activeTab === "sheets" && (
          <div className="space-y-4">
            {sheetTabs.map(tab => {
              const c = colorMap[tab.color];
              return (
                <div key={tab.name} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                  <div className="flex items-center gap-2 p-3 border-b border-gray-800">
                    <div className={`w-3 h-3 rounded ${c.badge}`} />
                    <span className="text-sm font-semibold">{tab.name}</span>
                    <span className="text-xs text-gray-500">({tab.headers.length} columns)</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-800 bg-opacity-50">
                          {tab.headers.map(h => (
                            <th key={h} className={`px-3 py-2 text-left font-mono ${c.text} whitespace-nowrap`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {tab.sampleRow.map((val, i) => (
                            <td key={i} className="px-3 py-2 text-gray-400 whitespace-nowrap max-w-xs truncate">{val}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Lead Preview Tab */}
        {activeTab === "preview" && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="p-3 border-b border-gray-800 flex items-center justify-between">
              <span className="text-sm font-semibold">Command Center Preview</span>
              <span className="text-xs text-gray-500">{mockLeads.length} leads processed</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-800 bg-opacity-50 text-gray-400">
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Role</th>
                    <th className="px-3 py-2 text-left">Company</th>
                    <th className="px-3 py-2 text-left">Score</th>
                    <th className="px-3 py-2 text-left">Pain Point</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeads.sort((a, b) => b.score - a.score).map((lead, i) => (
                    <tr key={i} className="border-t border-gray-800 border-opacity-50 hover:bg-gray-800 hover:bg-opacity-30 transition-colors">
                      <td className="px-3 py-2.5 text-white font-medium">{lead.name}</td>
                      <td className="px-3 py-2.5 text-gray-400">{lead.role}</td>
                      <td className="px-3 py-2.5 text-gray-400">{lead.company}</td>
                      <td className="px-3 py-2.5"><ScoreBadge score={lead.score} /></td>
                      <td className="px-3 py-2.5 text-gray-300 max-w-xs truncate">{lead.pain}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 bg-opacity-20 text-emerald-400 text-xs font-medium">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-gray-800 flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>≥80 Hot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span>60-79 Warm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span>&lt;60 Cold</span>
              </div>
            </div>
          </div>
        )}

        {/* JSON Export Tab */}
        {activeTab === "json" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">n8n Workflow JSON — Copy and import directly</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-xs font-medium"
              >
                {copied ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 overflow-auto max-h-96">
              <pre className="text-xs font-mono text-gray-400 whitespace-pre-wrap leading-relaxed">
{`{
  "name": "PlatFormula.ONE - Lead Harvester v2",
  "nodes": [
    { "id": "trigger-intake", "name": "Batch Lead Intake (Sheet)", "type": "googleSheetsTrigger" },
    { "id": "llm-extract", "name": "JoyceGPT Extraction & Scoring", "type": "anthropic" },
    { "id": "code-parse", "name": "Parse & Validate Response", "type": "code" },
    { "id": "if-valid", "name": "Is Valid?", "type": "if" },
    { "id": "append-cmd", "name": "Append to Command Center", "type": "googleSheets" },
    { "id": "log-error", "name": "Log Parse Error", "type": "googleSheets" }
  ],
  "connections": {
    "Batch Lead Intake (Sheet)": [["JoyceGPT Extraction & Scoring"]],
    "JoyceGPT Extraction & Scoring": [["Parse & Validate Response"]],
    "Parse & Validate Response": [["Is Valid?"]],
    "Is Valid?": {
      "true": ["Append to Command Center"],
      "false": ["Log Parse Error"]
    }
  },
  "active": false
}`}
              </pre>
            </div>
            <div className="mt-3 p-3 bg-blue-900 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-300">
                  This is a simplified preview. The full deployable JSON with all node parameters was provided in the previous message. Use that version for import into n8n.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-600">
          <span>PlatFormula.ONE • Lead Harvester v2</span>
          <span>6 nodes • 5 connections • 3 sheet tabs</span>
        </div>
      </div>
    </div>
  );
}
