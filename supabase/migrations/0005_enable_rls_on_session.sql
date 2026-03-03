-- Migration: Enable Row Level Security on session table
-- Purpose: Prevent unauthorized access to session data
-- Date: 2026-03-03

-- Enable Row Level Security on the session table
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;

-- Note: With Better Auth (not Supabase Auth), RLS policies need to be
-- configured based on your authentication setup. Since Better Auth handles
-- sessions server-side with direct database access, RLS primarily prevents
-- direct database access from client applications.

-- Allow authenticated database role to manage sessions
-- (Better Auth uses the main database connection)
CREATE POLICY "Allow server to manage sessions"
  ON "session"
  FOR ALL
  TO authenticated, postgres
  USING (true)
  WITH CHECK (true);

-- Block anonymous/public access completely
CREATE POLICY "Block public access"
  ON "session"
  FOR ALL
  TO PUBLIC
  USING (false);

-- Note: INSERT and UPDATE are handled by Better Auth server-side only
-- Client applications should never directly access the session table
