/**
 * Google Sheets abstraction layer.
 *
 * When GOOGLE_SERVICE_ACCOUNT_KEY and GOOGLE_SHEET_ID are set, this module
 * reads/writes live spreadsheet data. Otherwise it falls back to the in-memory
 * store so the app works without credentials during development.
 *
 * Required env vars (optional — enables Sheets integration):
 *   GOOGLE_SERVICE_ACCOUNT_KEY   Base64-encoded service account JSON key
 *   GOOGLE_SHEET_ID              The spreadsheet ID from the Sheets URL
 */

import type { IntakeLead, ProcessedLead, LeadStatus } from "./types.js";
import * as store from "./store.js";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SA_KEY_B64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

function isConfigured(): boolean {
  return !!(SHEET_ID && SA_KEY_B64);
}

async function getAuth() {
  if (!SA_KEY_B64) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not set");
  const { google } = await import("googleapis");
  const key = JSON.parse(Buffer.from(SA_KEY_B64, "base64").toString("utf8"));
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return { google, auth };
}

export async function fetchIntakeLeads(): Promise<IntakeLead[]> {
  if (!isConfigured()) return store.getIntakeLeads();

  const { google, auth } = await getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID!,
    range: "Intake!A2:E",
  });
  const rows = res.data.values ?? [];
  return rows.map((row, i) => ({
    id: String(i + 2),
    name: row[0] ?? "",
    role: row[1] ?? "",
    company: row[2] ?? "",
    profile_text: row[3] ?? "",
    processed: row[4] === "TRUE",
    created_at: new Date().toISOString(),
  }));
}

export async function fetchCommandCenter(): Promise<ProcessedLead[]> {
  if (!isConfigured()) return store.getCommandCenter();

  const { google, auth } = await getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID!,
    range: "Command Center!A2:M",
  });
  const rows = res.data.values ?? [];
  return rows
    .map((row, i) => ({
      id: String(i + 2),
      name: row[0] ?? "",
      role: row[1] ?? "",
      company: row[2] ?? "",
      lead_score: parseInt(row[3] ?? "0", 10),
      pain_point: row[4] ?? "",
      inmail_draft: row[5] ?? "",
      email_framework: {
        hook: row[6] ?? "",
        insight: row[7] ?? "",
        credibility: row[8] ?? "",
        cta: row[9] ?? "",
      },
      status: (row[10] ?? "Ready") as LeadStatus,
      processed_at: row[11] ?? new Date().toISOString(),
    }))
    .sort((a, b) => b.lead_score - a.lead_score);
}

export async function appendCommandCenterRow(lead: ProcessedLead): Promise<void> {
  if (!isConfigured()) {
    store.appendToCommandCenter(lead);
    return;
  }

  const { google, auth } = await getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID!,
    range: "Command Center!A:M",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          lead.name,
          lead.role,
          lead.company,
          lead.lead_score,
          lead.pain_point,
          lead.inmail_draft,
          lead.email_framework.hook,
          lead.email_framework.insight,
          lead.email_framework.credibility,
          lead.email_framework.cta,
          lead.status,
          lead.processed_at,
        ],
      ],
    },
  });
}

export async function updateStatus(
  id: string,
  status: LeadStatus
): Promise<boolean> {
  if (!isConfigured()) return store.updateLeadStatus(id, status);

  // When using Sheets, id is the row number (1-indexed, with header = row 1)
  const rowNum = parseInt(id, 10);
  if (isNaN(rowNum)) return false;

  const { google, auth } = await getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  // Status is column K (index 11, 1-indexed = 11)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID!,
    range: `Command Center!K${rowNum}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[status]] },
  });
  return true;
}

export async function logError(
  leadName: string,
  company: string,
  error: string,
  rawResponse: string
): Promise<void> {
  if (!isConfigured()) return; // Errors are logged to console in dev

  const { google, auth } = await getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID!,
    range: "Errors!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[leadName, company, error, rawResponse, new Date().toISOString()]],
    },
  });
}
