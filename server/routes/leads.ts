import { Router } from "express";
import type { Request, Response } from "express";
import * as sheets from "../lib/sheets.js";
import * as store from "../lib/store.js";
import type { LeadStatus } from "../lib/types.js";

const router = Router();

// GET /api/leads/intake — unprocessed intake rows
router.get("/intake", async (_req: Request, res: Response) => {
  try {
    const leads = await sheets.fetchIntakeLeads();
    res.json(leads.filter((l) => !l.processed));
  } catch (err) {
    console.error("[leads/intake]", err);
    res.status(500).json({ error: "Failed to fetch intake leads" });
  }
});

// GET /api/leads/command-center — all processed leads (sorted by score desc)
router.get("/command-center", async (_req: Request, res: Response) => {
  try {
    const leads = await sheets.fetchCommandCenter();
    res.json(leads);
  } catch (err) {
    console.error("[leads/command-center]", err);
    res.status(500).json({ error: "Failed to fetch command center" });
  }
});

// POST /api/leads/intake — add a new intake lead (manual submission)
router.post("/intake", async (req: Request, res: Response) => {
  const { name, role, company, profile_text } = req.body ?? {};
  if (!name || !role || !company || !profile_text) {
    res.status(400).json({ error: "name, role, company, profile_text required" });
    return;
  }
  try {
    const lead = store.addIntakeLead({ name, role, company, profile_text });
    res.status(201).json(lead);
  } catch (err) {
    console.error("[leads/intake POST]", err);
    res.status(500).json({ error: "Failed to add intake lead" });
  }
});

// PATCH /api/leads/:id/status — update a lead's status
router.patch("/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body ?? {};
  const valid: LeadStatus[] = ["Ready", "Sent", "Replied", "Meeting", "Closed"];
  if (!valid.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${valid.join(", ")}` });
    return;
  }
  try {
    const ok = await sheets.updateStatus(id, status as LeadStatus);
    if (!ok) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }
    res.json({ id, status });
  } catch (err) {
    console.error("[leads/:id/status]", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;
