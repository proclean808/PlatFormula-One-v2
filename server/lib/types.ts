export type LeadStatus = "Ready" | "Sent" | "Replied" | "Meeting" | "Closed";

export interface IntakeLead {
  id: string;
  name: string;
  role: string;
  company: string;
  profile_text: string;
  processed: boolean;
  created_at: string;
}

export interface EmailFramework {
  hook: string;
  insight: string;
  credibility: string;
  cta: string;
}

export interface ProcessedLead {
  id: string;
  name: string;
  role: string;
  company: string;
  lead_score: number;
  pain_point: string;
  inmail_draft: string;
  email_framework: EmailFramework;
  status: LeadStatus;
  processed_at: string;
}

export interface ExtractRequest {
  name: string;
  role: string;
  company: string;
  profile_text: string;
}

export interface ExtractResponse {
  pain_point: string;
  lead_score: number;
  inmail_draft: string;
  email_framework: EmailFramework;
}
