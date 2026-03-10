/**
 * POST /api/lead/extract
 *
 * Calls Claude Opus 4.6 to extract pain point, score, InMail draft, and
 * email framework from a LinkedIn-style profile text. Returns structured JSON.
 * Uses adaptive thinking + streaming so it never times out on long profiles.
 */

import { Router } from "express";
import type { Request, Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import type { ExtractRequest, ExtractResponse, EmailFramework } from "../lib/types.js";

const router = Router();

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

function buildUserPrompt(req: ExtractRequest): string {
  return `Analyze this lead and return the JSON extraction:

Name: ${req.name}
Role: ${req.role}
Company: ${req.company}

Profile / Context:
${req.profile_text}`;
}

function stripFences(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

function clampScore(score: unknown): number {
  const n = typeof score === "number" ? score : parseInt(String(score), 10);
  if (isNaN(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function validateExtraction(obj: Record<string, unknown>): ExtractResponse {
  const ef = (obj.email_framework ?? {}) as Record<string, unknown>;
  const email_framework: EmailFramework = {
    hook: String(ef.hook ?? ""),
    insight: String(ef.insight ?? ""),
    credibility: String(ef.credibility ?? ""),
    cta: String(ef.cta ?? ""),
  };

  const missingEmailFields = (["hook", "insight", "credibility", "cta"] as const).filter(
    (k) => !email_framework[k]
  );
  if (missingEmailFields.length > 0) {
    throw new Error(`Missing email_framework fields: ${missingEmailFields.join(", ")}`);
  }

  if (!obj.pain_point) throw new Error("Missing field: pain_point");
  if (obj.lead_score === undefined) throw new Error("Missing field: lead_score");
  if (!obj.inmail_draft) throw new Error("Missing field: inmail_draft");

  return {
    pain_point: String(obj.pain_point),
    lead_score: clampScore(obj.lead_score),
    inmail_draft: String(obj.inmail_draft),
    email_framework,
  };
}

// POST /api/lead/extract
router.post("/", async (req: Request, res: Response) => {
  const { name, role, company, profile_text } = req.body ?? {};

  if (!name || !role || !company || !profile_text) {
    res.status(400).json({ error: "name, role, company, profile_text are required" });
    return;
  }

  const payload: ExtractRequest = { name, role, company, profile_text };

  try {
    // Stream with adaptive thinking so long profiles never time out
    const stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(payload) }],
    });

    const message = await stream.finalMessage();

    // Find the text block (may be preceded by a thinking block)
    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text block in LLM response");
    }

    const cleaned = stripFences(textBlock.text);
    let parsed: Record<string, unknown>;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(`JSON parse failed. Raw response: ${cleaned.slice(0, 500)}`);
    }

    const result = validateExtraction(parsed);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[lead/extract]", message);

    if (err instanceof Anthropic.AuthenticationError) {
      res.status(401).json({ error: "Invalid ANTHROPIC_API_KEY" });
    } else if (err instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: "Rate limited — retry shortly" });
    } else if (err instanceof Anthropic.APIError) {
      res.status(502).json({ error: `LLM API error: ${message}` });
    } else {
      res.status(500).json({ error: message });
    }
  }
});

export default router;
