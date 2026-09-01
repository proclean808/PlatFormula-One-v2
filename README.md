# PlatFormula.ONE — v2

**The AI-powered platform for founders building venture-ready startups.**

PlatFormula.ONE is a full-stack web application that helps early-stage founders craft investor pitches, track applications, and access curated resources — all in a sleek dark-mode interface.

---

## Repository Structure

```
PlatFormula-One-v2/
├── client/              # React + Vite frontend (Tailwind CSS, shadcn/ui)
├── server/              # Express backend (TypeScript)
├── shared/              # Shared types and utilities
├── membrain-whisperer/  # Android live-pitch co-pilot (Kotlin + Jetpack Compose)
├── supabase-setup.sql   # Supabase schema (newsletter subscribers)
├── VERCEL_DEPLOYMENT.md # Vercel deployment guide
└── todo.md              # Project changelog / task tracker
```

---

## Web App

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Framer Motion |
| Backend | Express (Node.js) |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server (frontend + backend)
pnpm dev
```

Open <http://localhost:5173>.

### Production Build

```bash
pnpm build
pnpm start
```

### Deploy to Vercel

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for full instructions, required environment variables, and Supabase setup.

---

## Android Module — MemBrain Whisperer

A covert live-pitch co-pilot for the **Samsung Galaxy S25 Ultra**, delivering real-time Gemini-powered insights to a paired **Galaxy Watch 7** HUD.

See [`membrain-whisperer/README.md`](membrain-whisperer/README.md) for setup and build instructions.

---

## Environment Variables

Create a `.env` file (or set these in Vercel):

```
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

For the Android module, see `membrain-whisperer/local.properties.example`.

---

## License

MIT
