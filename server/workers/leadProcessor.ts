#!/usr/bin/env node
/**
 * Lead Processor Worker — PlatFormula.ONE
 *
 * Polls the Intake sheet/store for unprocessed leads, calls the Claude API
 * for extraction, then appends to Command Center. Runs as a standalone Node
 * process (no Express required).
 *
 * Usage:
 *   npx tsx server/workers/leadProcessor.ts
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY          — required
 *   GOOGLE_SHEET_ID            — optional (enables Google Sheets integration)
 *   GOOGLE_SERVICE_ACCOUNT_KEY — optional (base64-encoded service account JSON)
 *   POLL_INTERVAL_MS           — optional (default: 60000 = 1 minute)
 *   MAX_LEADS_PER_CYCLE        — optional (default: 10)
 */

import Anthropic from "@anthropic-ai/sdk";
import * as sheets from "../lib/sheets.js";
import * as store from "../lib/store.js";
import type { ExtractResponse, ProcessedLead, EmailFramework } from "../lib/types.js";

const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS ?? "60000", 10);
const MAX_PER_CYCLE = parseInt(process.env.MAX_LEADS_PER_CYCLE ?? "10", 10);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are JoyceGPT, an expert B2B sales intelligence engine for PlatFormula.ONE.
You analyze LinkedIn-style profile text and extract structured sales intelligence.

Always respond with ONLY raw JSON — no markdown, no code fences, no preamble.

Required JSON schema:
{
  "pain_point": "string — the most acute operational or strategic pain you infer from this person's role, company stage, and profile context",
  "lead_score": integer 0-100 — scored using: ICP match (35%) + role seniority (20%) + pain intensity (20%) + company growth signals (15%) + recent activity signals (10%),
  "inmail_draft": "string — 2-3 sentence LinkedIn InMail. Open with a specific observation, connect to their pain, end with a soft CTA",
  "email_framework": {
    "hook": "string — opening question that triggers self-recognition of the pain",
    "insight": "string — a data point or benchmark that reframes their situation",
    "credibility": "string — proof point showing you've solved this for similar companies",
    "cta": "string — low-friction call to action (15-20 min, specific action)"
  }
}`;

function stripFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
}

function clampScore(score: unknown): number {
  const n = typeof score === "number" ? score : parseInt(String(score), 10);
  return isNaN(n) ? 50 : Math.max(0, Math.min(100, Math.round(n)));
}

function validate(obj: Record<string, unknown>): ExtractResponse {
  const ef = (obj.email_framework ?? {}) as Record<string, unknown>;
  const email_framework: EmailFramework = {
    hook: String(ef.hook ?? ""),
    insight: String(ef.insight ?? ""),
    credibility: String(ef.credibility ?? ""),
    cta: String(ef.cta ?? ""),
  };
  const missing = (["hook", "insight", "credibility", "cta"] as const).filter(
    (k) => !email_framework[k]
  );
  if (missing.length) throw new Error(`Missing email_framework fields: ${missing.join(", ")}`);
  if (!obj.pain_point) throw new Error("Missing: pain_point");
  if (obj.lead_score === undefined) throw new Error("Missing: lead_score");
  if (!obj.inmail_draft) throw new Error("Missing: inmail_draft");

  return {
    pain_point: String(obj.pain_point),
    lead_score: clampScore(obj.lead_score),
    inmail_draft: String(obj.inmail_draft),
    email_framework,
  };
}

async function extractLead(
  name: string,
  role: string,
  company: string,
  profile_text: string
): Promise<ExtractResponse> {
  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyze this lead and return the JSON extraction:\n\nName: ${name}\nRole: ${role}\nCompany: ${company}\n\nProfile / Context:\n${profile_text}`,
      },
    ],
  });

  const message = await stream.finalMessage();
  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("No text block in LLM response");

  const cleaned = stripFences(textBlock.text);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`JSON parse failed. Raw: ${cleaned.slice(0, 300)}`);
  }
  return validate(parsed);
}

async function processCycle(): Promise<void> {
  const unprocessed = (await sheets.fetchIntakeLeads()).slice(0, MAX_PER_CYCLE);

  if (unprocessed.length === 0) {
    console.log(`[${new Date().toISOString()}] No unprocessed leads.`);
    return;
  }

  console.log(`[${new Date().toISOString()}] Processing ${unprocessed.length} lead(s)...`);

  for (const lead of unprocessed) {
    console.log(`  → ${lead.name} @ ${lead.company}`);
    try {
      const extracted = await extractLead(
        lead.name,
        lead.role,
        lead.company,
        lead.profile_text
      );

      const processed: ProcessedLead = {
        id: lead.id,
        name: lead.name,
        role: lead.role,
        company: lead.company,
        lead_score: extracted.lead_score,
        pain_point: extracted.pain_point,
        inmail_draft: extracted.inmail_draft,
        email_framework: extracted.email_framework,
        status: "Ready",
        processed_at: new Date().toISOString(),
      };

      await sheets.appendCommandCenterRow(processed);
      store.markProcessed(lead.id);

      console.log(`     ✓ Score: ${extracted.lead_score} | Pain: ${extracted.pain_point.slice(0, 60)}…`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`     ✗ Failed for ${lead.name}: ${msg}`);
      await sheets.logError(lead.name, lead.company, msg, "").catch(() => {});
    }

    // Small delay between LLM calls to avoid rate limit spikes
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`[${new Date().toISOString()}] Cycle complete.\n`);
}

async function main(): Promise<void> {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  PlatFormula.ONE — Lead Processor Worker     ║");
  console.log(`║  Poll interval: ${POLL_INTERVAL_MS / 1000}s | Max/cycle: ${MAX_PER_CYCLE.toString().padEnd(3)} ║`);
  console.log("╚══════════════════════════════════════════════╝\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY is not set.");
    process.exit(1);
  }

  // Run immediately, then poll
  await processCycle();
  setInterval(processCycle, POLL_INTERVAL_MS);
}

main().catch((err) => {
  console.error("Worker crashed:", err);
  process.exit(1);
});
