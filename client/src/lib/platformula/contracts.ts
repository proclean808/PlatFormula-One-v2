export type WorkStatus = 'observed' | 'proposed' | 'authorized' | 'executing' | 'verified' | 'committed' | 'blocked';
export type VentureStage = 'founder' | 'problem' | 'evidence' | 'competitors' | 'customer' | 'programs' | 'resources' | 'stack' | 'experiments' | 'build' | 'deployment' | 'gtm' | 'funding';
export type DecisionStatus = 'pending' | 'accepted' | 'rejected';

export interface WorkItem {
  id: string; threadId: string; objective: string; project?: string; status: WorkStatus;
  createdAt: string; updatedAt: string; sourceIds: string[]; artifactIds: string[];
}

export interface VentureState {
  id: string; threadId: string; currentStage: VentureStage; objective: string;
  stages: Partial<Record<VentureStage, { status: 'pending' | 'active' | 'complete' | 'blocked'; artifactIds: string[]; sourceIds: string[] }>>;
  updatedAt: string;
}

export interface SourceRecord {
  id: string; url: string; title?: string; publisher?: string; capturedAt: string;
  checkedAt: string; verificationStatus: 'verified' | 'partial' | 'unverified' | 'stale';
}

export interface CandidateRecord {
  id: string; workItemId: string; name: string; category: string; officialUrl: string;
  reason: string; sourceIds: string[]; decision: DecisionStatus; decidedAt?: string;
}

export interface ResourceRecord {
  id: string; name: string; type: string; provider?: string; officialUrl: string; applyUrl?: string;
  status: 'open' | 'closed' | 'rolling' | 'unknown'; geography: string[]; industries: string[];
  stages: string[]; sourceUrl: string; sourceCheckedAt: string;
  verificationStatus: 'verified' | 'partial' | 'unverified' | 'stale';
}

export interface BrowserSession {
  id: string; workItemId?: string;
  provider: 'browser-use' | 'cdp' | 'vercel-computer-use' | 'browserbase' | 'other';
  viewerUrl?: string; controlUrl?: string;
  state: 'starting' | 'ready' | 'human-control' | 'agent-control' | 'stopped' | 'error';
  sourceIds: string[];
}

export interface ArtifactRecord {
  id: string; workItemId: string;
  kind: 'browser' | 'stack' | 'comparison' | 'terminal' | 'repo' | 'resource' | 'application' | 'evidence' | 'other';
  title: string; uri?: string; sourceIds: string[]; createdAt: string;
}

export interface AuthorizationReceipt {
  id: string; workItemId: string; action: string; status: 'AUTHORIZED' | 'DENIED' | 'EXPIRED';
  policyChecks: string[]; authorizedAt: string;
}

export interface EvidenceReceipt {
  id: string; workItemId: string; status: 'PASS' | 'PARTIAL' | 'BLOCKED' | 'FAIL';
  manifestUri?: string; commitSha?: string; sourceIds: string[]; artifactIds: string[]; verifiedAt: string;
}
