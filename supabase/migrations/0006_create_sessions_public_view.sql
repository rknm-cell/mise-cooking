-- Migration: Create public-safe view of sessions table
-- Purpose: Provide a view that excludes sensitive columns (token)
-- Date: 2026-03-03

-- Drop view if it already exists (for idempotency)
DROP VIEW IF EXISTS "sessions_public";

-- Create a read-only view that excludes the token field
CREATE VIEW "sessions_public" AS
  SELECT
    id,
    user_id,
    created_at,
    updated_at,
    expires_at,
    ip_address,
    user_agent
  FROM "session";

-- Grant SELECT permission on the view to authenticated users
-- Note: Adjust role name based on your database setup
-- Common roles: authenticated, anon, postgres
COMMENT ON VIEW "sessions_public" IS 'Public-safe view of sessions table without sensitive token data';
