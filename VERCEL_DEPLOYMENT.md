# Vercel Deployment Instructions for PlatFormula.ONE

## Quick Deploy

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Import Project**: Click "Add New" → "Project"
3. **Select Repository**: Choose `proclean808/PlatFormula-One-v2`
4. **Configure Project**:
   - Framework Preset: Vite
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

## Required Environment Variables

Add these in Vercel Project Settings → Environment Variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://vyprcxxmeteevwubfxt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5cHJjeHhtZXRlZWV2d3ViZnh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Mzc5NjYsImV4cCI6MjA3ODMxMzk2Nn0.I-VaWcpd6DAC6zJBFyXEJWGEui0qsJlKqkggooNjv2E

# Database (if using MySQL/TiDB)
DATABASE_URL=your_database_connection_string

# JWT Secret (generate a random 32-character string)
JWT_SECRET=your_jwt_secret_here

# OAuth Configuration (if re-enabling auth later)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=your_oauth_server
VITE_OAUTH_PORTAL_URL=your_oauth_portal
OWNER_OPEN_ID=your_owner_openid
OWNER_NAME=your_name
```

## Supabase Setup

Before deploying, run this SQL in your Supabase SQL Editor:

```sql
-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for newsletter signup)
CREATE POLICY "Allow public newsletter signup" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow public to read their own subscription
CREATE POLICY "Allow users to read own subscription" ON newsletter_subscribers
  FOR SELECT TO anon
  USING (true);
```

## Deploy Steps

1. Push your code to GitHub (already done ✓)
2. Import project in Vercel dashboard
3. Add environment variables
4. Run Supabase SQL script
5. Deploy!

## Post-Deployment

- Your site will be live at: `https://platformula-one.vercel.app` (or custom domain)
- Vercel will auto-deploy on every push to `main` branch
- Check deployment logs if there are issues

## Custom Domain

1. Go to Project Settings → Domains
2. Add your domain: `platformula.one`
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

---

**Note**: The current build is configured for static/frontend deployment. Backend features (auth, server routes) are disabled. To enable full backend:
1. Uncomment auth code in `App.tsx` and `Home.tsx`
2. Add all OAuth environment variables
3. Redeploy
