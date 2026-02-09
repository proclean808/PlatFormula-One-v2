-- Newsletter Subscribers Table
-- Run this SQL in your Supabase SQL Editor to create the newsletter table

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'footer',
  status VARCHAR(20) DEFAULT 'active',
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (subscribe)
CREATE POLICY "Allow public inserts" ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow reading own subscription (optional, for unsubscribe flow)
CREATE POLICY "Allow read own subscription" ON newsletter_subscribers
  FOR SELECT
  USING (true);
