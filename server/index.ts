import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import leadsRouter from "./routes/leads.js";
import extractRouter from "./routes/extract.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // API routes — must be mounted before the static catch-all
  app.use("/api/leads", leadsRouter);
  app.use("/api/lead/extract", extractRouter);

  // Serve static files - in production, files are in the same dist folder
  const staticPath = path.resolve(__dirname, "..", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`  API:  /api/leads/intake | /api/leads/command-center`);
    console.log(`  API:  POST /api/lead/extract`);
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn("  WARN: ANTHROPIC_API_KEY not set — /api/lead/extract will error");
    }
    if (!process.env.GOOGLE_SHEET_ID) {
      console.log("  INFO: GOOGLE_SHEET_ID not set — using in-memory store");
    }
  });
}

startServer().catch(console.error);
