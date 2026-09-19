export type WorkStatus = 'observed' | 'proposed' | 'authorized' | 'executing' | 'verified' | 'committed' | 'blocked';

export interface WorkItem {
  id: string;
  threadId: string;
  objective: string;
  project?: string;
  status: WorkStatus;
  createdAt: string;
  updatedAt: string;
  sourceIds: string[];
  artifactIds: string[];
}

export interface ResourceRecord {
  id: string;
  name: string;
  type: string;
  provider?: string;
  officialUrl: string;
  applyUrl?: string;
  status: 'open' | 'closed' | 'rolling' | 'unknown';
  geography: string[];
  industries: string[];
  stages: string[];
  sourceUrl: string;
  sourceCheckedAt: string;
  verificationStatus: 'verified' | 'partial' | 'unverified' | 'stale';
}

export interface BrowserSession {
  id: string;
  provider: 'browser-use' | 'cdp' | 'vercel-computer-use' | 'browserbase' | 'other';
  viewerUrl?: string;
  controlUrl?: string;
  state: 'starting' | 'ready' | 'human-control' | 'agent-control' | 'stopped' | 'error';
}

export interface ArtifactRecord {
  id: string;
  workItemId: string;
  kind: 'browser' | 'stack' | 'comparison' | 'terminal' | 'repo' | 'resource' | 'application' | 'evidence' | 'other';
  title: string;
  uri?: string;
  sourceIds: string[];
  createdAt: string;
}

export interface EvidenceReceipt {
  id: string;
  workItemId: string;
  status: 'PASS' | 'PARTIAL' | 'BLOCKED' | 'FAIL';
  manifestUri?: string;
  commitSha?: string;
  sourceIds: string[];
  artifactIds: string[];
  verifiedAt: string;
}
