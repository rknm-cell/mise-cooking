-- Migration: Revoke public access to session table
-- Purpose: Ensure session table is not directly accessible
-- Date: 2026-03-03

-- Revoke all privileges from PUBLIC role on session table
REVOKE ALL ON TABLE "session" FROM PUBLIC;

-- Revoke SELECT specifically to be explicit
REVOKE SELECT ON TABLE "session" FROM PUBLIC;

-- If you have an 'anon' role (common in Supabase), revoke from that too
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON TABLE "session" FROM anon;
  END IF;
END $$;

-- Note: Better Auth will still have access through the database connection
-- with proper credentials. This prevents unauthorized public access.
COMMENT ON TABLE "session" IS 'Auth sessions table - access restricted, use sessions_public view for safe reads';
