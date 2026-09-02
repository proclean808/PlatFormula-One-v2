import { useState, useEffect } from "react";
import { loadFounderGraph, saveFounderGraph, type TrackedApplication } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DEFAULT_PROGRAMS: Omit<TrackedApplication, "id" | "status" | "bpi" | "sas" | "updatedAt">[] = [
  { programName: "Y Combinator S26", deadline: new Date("2026-05-04").getTime(), notes: "", tags: ["top-tier", "pre-seed"] },
  { programName: "Techstars", deadline: new Date("2026-06-01").getTime(), notes: "", tags: ["mentorship", "network"] },
  { programName: "a16z Speedrun", deadline: new Date("2026-07-15").getTime(), notes: "", tags: ["ai-native", "operator"] },
  { programName: "Berkeley SkyDeck", deadline: new Date("2026-08-01").getTime(), notes: "", tags: ["deep-tech", "uc-berkeley"] },
  { programName: "GenAI Fund FastTrack", deadline: new Date("2026-09-01").getTime(), notes: "", tags: ["enterprise-ai", "asean"] },
  { programName: "500 Global", deadline: new Date("2026-09-15").getTime(), notes: "", tags: ["global", "seed"] },
  { programName: "Alchemist Accelerator", deadline: new Date("2026-10-01").getTime(), notes: "", tags: ["b2b", "enterprise"] },
  { programName: "Plug and Play", deadline: new Date("2026-10-15").getTime(), notes: "", tags: ["corporate", "global"] },
  { programName: "Founder Institute", deadline: new Date("2026-11-01").getTime(), notes: "", tags: ["pre-seed", "global"] },
  { programName: "AngelPad", deadline: new Date("2026-11-15").getTime(), notes: "", tags: ["seed", "sf"] },
];

type KanbanStatus = "Researching" | "Applied" | "In Review" | "Decision";
const COLUMNS: KanbanStatus[] = ["Researching", "Applied", "In Review", "Decision"];

const COLUMN_COLORS: Record<KanbanStatus, string> = {
  Researching: "border-gray-600",
  Applied: "border-blue-600",
  "In Review": "border-yellow-600",
  Decision: "border-green-600",
};

const COLUMN_HEADER_COLORS: Record<KanbanStatus, string> = {
  Researching: "text-gray-400",
  Applied: "text-blue-400",
  "In Review": "text-yellow-400",
  Decision: "text-green-400",
};

const STATUS_BADGE: Record<KanbanStatus, string> = {
  Researching: "bg-gray-800 text-gray-300",
  Applied: "bg-blue-900 text-blue-300",
  "In Review": "bg-yellow-900 text-yellow-300",
  Decision: "bg-green-900 text-green-300",
};

function daysUntil(ts: number): number {
  return Math.ceil((ts - Date.now()) / (1000 * 60 * 60 * 24));
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Tracking() {
  const [apps, setApps] = useState<TrackedApplication[]>([]);
  const [view, setView] = useState<"kanban" | "timeline">("kanban");
  const [dragging, setDragging] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    loadFounderGraph().then(g => {
      if (g.trackedApps.length === 0) {
        const seeded: TrackedApplication[] = DEFAULT_PROGRAMS.map((p, i) => ({
          ...p,
          id: `default_${i}`,
          status: "Researching" as KanbanStatus,
          bpi: 0,
          sas: 0,
          updatedAt: Date.now(),
        }));
        const updated = { ...g, trackedApps: seeded };
        saveFounderGraph(updated);
        setApps(seeded);
      } else {
        setApps(g.trackedApps);
      }
    });
  }, []);

  const persistApps = async (updated: TrackedApplication[]) => {
    setApps(updated);
    const g = await loadFounderGraph();
    await saveFounderGraph({ ...g, trackedApps: updated });
  };

  const moveCard = async (id: string, newStatus: KanbanStatus) => {
    const updated = apps.map(a => a.id === id ? { ...a, status: newStatus, updatedAt: Date.now() } : a);
    await persistApps(updated);
    toast(`Moved to ${newStatus}`);
  };

  const saveNote = async (id: string) => {
    const updated = apps.map(a => a.id === id ? { ...a, notes: noteText, updatedAt: Date.now() } : a);
    await persistApps(updated);
    setEditingNote(null);
    toast("Note saved.");
  };

  const addCustomProgram = async () => {
    const name = prompt("Program name:");
    if (!name) return;
    const deadlineStr = prompt("Deadline (YYYY-MM-DD):");
    const deadline = deadlineStr ? new Date(deadlineStr).getTime() : Date.now() + 90 * 24 * 60 * 60 * 1000;
    const newApp: TrackedApplication = {
      id: `custom_${Date.now()}`,
      programName: name,
      deadline,
      status: "Researching",
      notes: "",
      tags: [],
      bpi: 0,
      sas: 0,
      updatedAt: Date.now(),
    };
    await persistApps([...apps, newApp]);
    toast(`Added ${name}`);
  };

  const removeApp = async (id: string) => {
    await persistApps(apps.filter(a => a.id !== id));
  };

  const alerts = apps.filter(a => {
    const days = daysUntil(a.deadline);
    const stale = (Date.now() - a.updatedAt) > 14 * 24 * 60 * 60 * 1000 && a.status !== "Decision";
    return (days <= 7 && days >= 0 && a.status === "Researching") || stale;
  });

  const byStatus = (status: KanbanStatus) => apps.filter(a => a.status === status);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Application Tracker
            </h1>
            <p className="text-gray-400 text-sm mt-1">Track every application from research to decision.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${view === "kanban" ? "border-blue-500 text-blue-400 bg-blue-950" : "border-gray-700 text-gray-400"}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView("timeline")}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${view === "timeline" ? "border-blue-500 text-blue-400 bg-blue-950" : "border-gray-700 text-gray-400"}`}
            >
              Timeline
            </button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={addCustomProgram}>
              + Add Program
            </Button>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map(a => {
              const days = daysUntil(a.deadline);
              const stale = (Date.now() - a.updatedAt) > 14 * 24 * 60 * 60 * 1000;
              return (
                <div key={a.id} className={`flex items-center gap-3 px-4 py-2 rounded-lg border text-sm ${stale ? "border-yellow-800 bg-yellow-950 text-yellow-300" : "border-red-800 bg-red-950 text-red-300"}`}>
                  <span>{stale ? "⚠" : "🔴"}</span>
                  <span>
                    {stale
                      ? `${a.programName} — no update in 14+ days (${a.status})`
                      : `${a.programName} — deadline in ${days} day${days !== 1 ? "s" : ""} (${formatDate(a.deadline)})`
                    }
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {COLUMNS.map(col => (
            <div key={col} className={`bg-gray-900 border ${COLUMN_COLORS[col]} rounded-xl p-3 text-center`}>
              <div className={`text-2xl font-bold ${COLUMN_HEADER_COLORS[col]}`}>{byStatus(col).length}</div>
              <div className="text-xs text-gray-500 mt-1">{col}</div>
            </div>
          ))}
        </div>

        {view === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map(col => (
              <div
                key={col}
                className={`bg-gray-950 border ${COLUMN_COLORS[col]} rounded-xl p-3 min-h-[200px]`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragging) moveCard(dragging, col);
                  setDragging(null);
                }}
              >
                <div className={`text-sm font-semibold mb-3 ${COLUMN_HEADER_COLORS[col]}`}>
                  {col} <span className="text-gray-600 font-normal">({byStatus(col).length})</span>
                </div>
                <div className="space-y-2">
                  {byStatus(col).map(app => {
                    const days = daysUntil(app.deadline);
                    const urgent = days <= 7 && days >= 0;
                    const overdue = days < 0;
                    return (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={() => setDragging(app.id)}
                        className="bg-gray-900 border border-gray-800 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-gray-600 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-gray-200 leading-tight">{app.programName}</span>
                          <button onClick={() => removeApp(app.id)} className="text-gray-700 hover:text-red-500 text-xs flex-shrink-0">✕</button>
                        </div>
                        <div className={`text-xs mt-1 ${overdue ? "text-red-400" : urgent ? "text-yellow-400" : "text-gray-500"}`}>
                          {overdue ? `Overdue (${formatDate(app.deadline)})` : `Due ${formatDate(app.deadline)} · ${days}d`}
                        </div>
                        {app.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {app.tags.map((t: string) => (
                              <span key={t} className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{t}</span>
                            ))}
                          </div>
                        )}
                        {app.bpi > 0 && (
                          <div className="flex gap-3 mt-2 text-xs">
                            <span className="text-purple-400">BPI {Math.round(app.bpi * 100)}</span>
                            <span className="text-cyan-400">SAS {Math.round(app.sas * 100)}</span>
                          </div>
                        )}
                        {editingNote === app.id ? (
                          <div className="mt-2">
                            <textarea
                              value={noteText}
                              onChange={e => setNoteText(e.target.value)}
                              className="w-full bg-black border border-gray-700 text-gray-300 text-xs rounded p-1.5 resize-none"
                              rows={2}
                              autoFocus
                            />
                            <div className="flex gap-1 mt-1">
                              <button onClick={() => saveNote(app.id)} className="text-xs text-green-400 hover:text-green-300">Save</button>
                              <button onClick={() => setEditingNote(null)} className="text-xs text-gray-500 hover:text-gray-300">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2">
                            {app.notes && <p className="text-xs text-gray-500 italic truncate">{app.notes}</p>}
                            <button
                              onClick={() => { setEditingNote(app.id); setNoteText(app.notes); }}
                              className="text-xs text-gray-600 hover:text-gray-400 mt-1"
                            >
                              {app.notes ? "Edit note" : "+ Add note"}
                            </button>
                          </div>
                        )}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {COLUMNS.filter(c => c !== col).map(c => (
                            <button
                              key={c}
                              onClick={() => moveCard(app.id, c)}
                              className={`text-xs px-1.5 py-0.5 rounded ${STATUS_BADGE[c]}`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "timeline" && (
          <div className="space-y-2">
            <div className="grid grid-cols-12 text-xs text-gray-500 px-4 pb-2 border-b border-gray-800">
              <span className="col-span-4">Program</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-3">Deadline</span>
              <span className="col-span-1">Days</span>
              <span className="col-span-2">BPI / SAS</span>
            </div>
            {[...apps]
              .sort((a, b) => a.deadline - b.deadline)
              .map(app => {
                const days = daysUntil(app.deadline);
                const overdue = days < 0;
                const urgent = days <= 7 && days >= 0;
                return (
                  <div key={app.id} className="grid grid-cols-12 items-center px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-600 transition-all">
                    <span className="col-span-4 text-sm text-gray-200 font-medium truncate pr-2">{app.programName}</span>
                    <span className="col-span-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${STATUS_BADGE[app.status as KanbanStatus]}`}>{app.status}</span>
                    </span>
                    <span className="col-span-3 text-xs text-gray-400">{formatDate(app.deadline)}</span>
                    <span className={`col-span-1 text-xs font-medium ${overdue ? "text-red-400" : urgent ? "text-yellow-400" : "text-gray-400"}`}>
                      {overdue ? `${Math.abs(days)}d ago` : `${days}d`}
                    </span>
                    <span className="col-span-2 text-xs">
                      {app.bpi > 0 ? (
                        <span>
                          <span className="text-purple-400">{Math.round(app.bpi * 100)}</span>
                          <span className="text-gray-600"> / </span>
                          <span className="text-cyan-400">{Math.round(app.sas * 100)}</span>
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
