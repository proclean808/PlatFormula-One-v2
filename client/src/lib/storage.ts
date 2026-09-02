/**
 * StorageAdapter — Phase 1: IndexedDB
 * Phase 2 trigger: multi-device sync, collaboration, >500 records, auth/sharing
 * DO NOT hardcode IndexedDB anywhere outside this file.
 */

export interface StorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  query(prefix: string): Promise<any[]>;
}

// ─── FounderGraph: unified data model across all tabs ───────────────────────

export interface ApplicationAnswer {
  programId: string;
  questionId: string;
  rawText: string;
  tokens: number;
  score?: {
    clarity: number;       // 0–1
    concision: number;     // 0–1
    differentiation: number; // 0–1
  };
  versionHistory: string[];
  updatedAt: number;
}

export interface TrackedApplication {
  id: string;
  programName: string;
  deadline: number;
  status: string;
  notes: string;
  tags: string[];
  bpi: number;
  sas: number;
  updatedAt: number;
}

export interface Application {
  id: string;
  program: string;
  status: 'researching' | 'applied' | 'review' | 'accepted' | 'rejected';
  appliedAt?: number;
  deadline?: number;
  bpi?: number;  // Bullseye Probability Index 0–100
  sas?: number;  // Strategic Alignment Score 0–100
  notes: string;
  updatedAt: number;
}

export interface ICPProfile {
  targetRole: string;
  companySize: string;
  industry: string;
  painIntensity: number;    // 0–10
  willingnessToPay: number; // 0–10
  accessibility: number;    // 0–10
}

export interface ProblemValidation {
  statement: string;
  frequency: number;  // 0–10
  urgency: number;    // 0–10
  existingSpend: number; // 0–10
  validationIndex: number; // computed
}

export interface FounderGraph {
  idea: {
    oneLiner: string;
    problem: string;
    solution: string;
    market: string;
    updatedAt: number;
  };
  icp: ICPProfile;
  problemValidation: ProblemValidation;
  answers: ApplicationAnswer[];
  applications: Application[];
  pitch: {
    slides: Record<string, string>;
    weakSlides: string[];
    updatedAt: number;
  };
  scores: {
    bpiGlobal: number;
    sasGlobal: number;
    updatedAt: number;
  };
  trackedApps: TrackedApplication[];
}

export const defaultFounderGraph: FounderGraph = {
  idea: { oneLiner: '', problem: '', solution: '', market: '', updatedAt: 0 },
  icp: { targetRole: '', companySize: '', industry: '', painIntensity: 5, willingnessToPay: 5, accessibility: 5 },
  problemValidation: { statement: '', frequency: 5, urgency: 5, existingSpend: 5, validationIndex: 0 },
  answers: [],
  applications: [],
  pitch: { slides: {}, weakSlides: [], updatedAt: 0 },
  scores: { bpiGlobal: 0, sasGlobal: 0, updatedAt: 0 },
  trackedApps: [],
};

// ─── IndexedDB Adapter ───────────────────────────────────────────────────────

const DB_NAME = 'platformula_one';
const DB_VERSION = 1;
const STORE_NAME = 'founder_graph';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const indexedDBAdapter: StorageAdapter = {
  async get(key: string) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  },

  async set(key: string, value: any) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async delete(key: string) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async query(prefix: string) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const results: any[] = [];
      const req = store.openCursor();
      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          if (String(cursor.key).startsWith(prefix)) {
            results.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = () => reject(req.error);
    });
  },
};

// ─── Active adapter (swap here for Phase 2 Supabase) ────────────────────────
export const storage: StorageAdapter = indexedDBAdapter;

// ─── FounderGraph helpers ────────────────────────────────────────────────────
const GRAPH_KEY = 'founder_graph_v1';

export async function loadFounderGraph(): Promise<FounderGraph> {
  const saved = await storage.get(GRAPH_KEY);
  if (!saved) return { ...defaultFounderGraph };
  return { ...defaultFounderGraph, ...saved };
}

export async function saveFounderGraph(graph: FounderGraph): Promise<void> {
  await storage.set(GRAPH_KEY, graph);
}

export async function exportFounderGraph(): Promise<string> {
  const graph = await loadFounderGraph();
  return JSON.stringify(graph, null, 2);
}

export async function importFounderGraph(json: string): Promise<void> {
  const parsed = JSON.parse(json) as FounderGraph;
  await saveFounderGraph(parsed);
}
