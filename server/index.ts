import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: '1mb' }));

  app.post('/api/harness/run', async (req, res) => {
    const { provider, model, intent } = req.body ?? {};
    if (typeof intent !== 'string' || !intent.trim()) {
      return res.status(400).json({ error: 'A founder intent is required.' });
    }
    if (intent.length > 12000) {
      return res.status(400).json({ error: 'Intent exceeds the 12,000 character prototype limit.' });
    }

    try {
      if (provider === 'openai') {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return res.status(503).json({ error: 'OPENAI_API_KEY is not configured.' });
        const upstream = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
          body: JSON.stringify({
            model: model || process.env.OPENAI_MODEL || 'gpt-5-mini',
            input: intent,
            max_output_tokens: 1200,
          }),
        });
        const data = await upstream.json() as any;
        if (!upstream.ok) throw new Error(data?.error?.message || 'OpenAI request failed');
        return res.json({ provider, model: data.model, output: data.output_text || 'No text output returned.' });
      }

      if (provider === 'gemini') {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
        const selectedModel = model || process.env.GEMINI_MODEL || 'gemini-3-flash';
        const upstream = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(selectedModel)}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: intent }] }],
              generationConfig: { maxOutputTokens: 1200 },
            }),
          },
        );
        const data = await upstream.json() as any;
        if (!upstream.ok) throw new Error(data?.error?.message || 'Gemini request failed');
        const output = data?.candidates?.[0]?.content?.parts?.map((part: any) => part.text || '').join('') || 'No text output returned.';
        return res.json({ provider, model: selectedModel, output });
      }

      return res.status(400).json({ error: 'Unsupported provider.' });
    } catch (error) {
      return res.status(502).json({ error: error instanceof Error ? error.message : 'Upstream model request failed.' });
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
