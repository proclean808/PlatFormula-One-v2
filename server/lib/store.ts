/**
 * In-memory lead store. Used as the live data layer when Google Sheets
 * credentials are not configured. Seeded with realistic sample data so the
 * dashboard is immediately useful out of the box.
 */

import { nanoid } from "nanoid";
import type { IntakeLead, ProcessedLead, LeadStatus } from "./types.js";

const intakeLeads: IntakeLead[] = [
  {
    id: nanoid(),
    name: "Jordan Lee",
    role: "Head of RevOps",
    company: "Momentum SaaS",
    profile_text:
      "15 years scaling revenue operations across Series A–C SaaS. Currently rebuilding our GTM stack after rapid headcount growth doubled pipeline volume but our CRM can't keep up.",
    processed: false,
    created_at: new Date().toISOString(),
  },
];

const commandCenter: ProcessedLead[] = [
  {
    id: nanoid(),
    name: "Jane Doe",
    role: "VP Operations",
    company: "Acme Corp",
    lead_score: 82,
    pain_point: "Manual reporting bottleneck",
    inmail_draft:
      "Hi Jane, noticed your ops scaling work at Acme — teams in similar positions typically lose 10+ hrs/wk to manual reporting. Happy to share how we've helped ops leaders reclaim that time. Worth a quick chat?",
    email_framework: {
      hook: "Are your reports still manual?",
      insight: "Teams like yours save 12 hrs/wk on average",
      credibility: "Used by 3 Fortune 500 ops teams",
      cta: "15-min walkthrough this week?",
    },
    status: "Ready",
    processed_at: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: nanoid(),
    name: "Marcus Chen",
    role: "Dir. Revenue Ops",
    company: "ScaleUp Inc",
    lead_score: 91,
    pain_point: "CRM data fragmentation",
    inmail_draft:
      "Hi Marcus, your recent post on CRM debt resonated — fragmented data is the silent killer of RevOps at your stage. We've mapped this exact problem for 3 companies at $20M ARR. Open to a 20-min deep-dive?",
    email_framework: {
      hook: "CRM fragmentation cost one RevOps team $1.2M last year",
      insight: "Unified pipeline data cuts forecast error by 40%",
      credibility: "Worked with ScaleUp's comp-set at Series B",
      cta: "30-min strategy call, no pitch — just diagnosis",
    },
    status: "Sent",
    processed_at: new Date(Date.now() - 7200_000).toISOString(),
  },
  {
    id: nanoid(),
    name: "Sarah Kim",
    role: "Head of Growth",
    company: "NovaTech",
    lead_score: 67,
    pain_point: "Lead qualification inconsistency",
    inmail_draft:
      "Hi Sarah, noticed NovaTech is scaling its growth team — inconsistent lead scoring at that stage can bleed budget fast. We've helped similar teams cut wasted spend by 30% with a tighter qualification layer. Interested?",
    email_framework: {
      hook: "How consistent is your lead scoring right now?",
      insight: "Inconsistent qual costs growth teams $200K+ annually",
      credibility: "Backed by data from 50+ SaaS growth teams",
      cta: "Quick audit call this week?",
    },
    status: "Ready",
    processed_at: new Date(Date.now() - 1800_000).toISOString(),
  },
  {
    id: nanoid(),
    name: "David Okafor",
    role: "COO",
    company: "BridgePoint",
    lead_score: 94,
    pain_point: "Cross-team visibility gaps",
    inmail_draft:
      "Hi David, COOs at BridgePoint's scale often cite visibility as the constraint — not headcount. We've built a command-layer that surfaces exactly where handoffs break down. 20 minutes to show you the dashboard?",
    email_framework: {
      hook: "Can you see every handoff in your pipeline in real time?",
      insight: "Visibility gaps delay deals by an avg of 8 days",
      credibility: "Deployed with 2 other fintech COOs this quarter",
      cta: "Demo this Thursday or Friday?",
    },
    status: "Meeting",
    processed_at: new Date(Date.now() - 14400_000).toISOString(),
  },
  {
    id: nanoid(),
    name: "Emily Tran",
    role: "Sales Manager",
    company: "Vertex AI",
    lead_score: 45,
    pain_point: "Pipeline forecasting accuracy",
    inmail_draft:
      "Hi Emily, managing a sales team without reliable forecasts is like navigating without a map. We have a lightweight model that takes your existing CRM data and generates a ±5% accurate forecast in under an hour. Worth exploring?",
    email_framework: {
      hook: "How accurate is your current forecast?",
      insight: "Poor forecasting costs sales teams 2 deals/quarter on average",
      credibility: "Validated across 20+ sales teams",
      cta: "30-min forecast audit?",
    },
    status: "Ready",
    processed_at: new Date(Date.now() - 600_000).toISOString(),
  },
];

// ---------- Intake CRUD ----------

export function getIntakeLeads(): IntakeLead[] {
  return [...intakeLeads];
}

export function addIntakeLead(
  lead: Omit<IntakeLead, "id" | "processed" | "created_at">
): IntakeLead {
  const row: IntakeLead = {
    ...lead,
    id: nanoid(),
    processed: false,
    created_at: new Date().toISOString(),
  };
  intakeLeads.push(row);
  return row;
}

export function markProcessed(id: string): boolean {
  const lead = intakeLeads.find((l) => l.id === id);
  if (!lead) return false;
  lead.processed = true;
  return true;
}

// ---------- Command Center CRUD ----------

export function getCommandCenter(): ProcessedLead[] {
  return [...commandCenter].sort((a, b) => b.lead_score - a.lead_score);
}

export function appendToCommandCenter(lead: Omit<ProcessedLead, "id">): ProcessedLead {
  const row: ProcessedLead = { ...lead, id: nanoid() };
  commandCenter.push(row);
  return row;
}

export function updateLeadStatus(id: string, status: LeadStatus): boolean {
  const lead = commandCenter.find((l) => l.id === id);
  if (!lead) return false;
  lead.status = status;
  return true;
}
