import express from "express";
import { AccessToken, AgentDispatchClient } from "livekit-server-sdk";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({limit:"16kb"}));
  app.post("/api/voice/token", async (req, res) => {
    const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
    if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return res.status(503).json({error:"Live voice infrastructure is not configured."});
    }
    const persona = req.body?.persona;
    if (persona !== "Mario" && persona !== "Joyce") {
      return res.status(501).json({error:"This provider is not connected yet."});
    }
    const room = "founder-" + crypto.randomUUID();
    try {
      const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: "founder-" + crypto.randomUUID(), ttl: "20m"
      });
      token.addGrant({roomJoin:true, room, canPublish:true, canSubscribe:true});
      const dispatch = new AgentDispatchClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
      await dispatch.createDispatch(room, persona.toLowerCase());
      return res.json({url:LIVEKIT_URL,token:await token.toJwt()});
    } catch(e) {
      console.error("LiveKit dispatch failed", e);
      return res.status(503).json({error:"Voice agent is not available."});
    }
  });
  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
