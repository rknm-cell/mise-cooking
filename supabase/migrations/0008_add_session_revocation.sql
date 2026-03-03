-- Migration: Add revocation support for session tokens
-- Purpose: Enable ability to invalidate sessions for security incidents
-- Date: 2026-03-03

-- Add revoked column to track invalidated sessions
ALTER TABLE "session"
  ADD COLUMN IF NOT EXISTS "revoked" BOOLEAN DEFAULT FALSE NOT NULL;

-- Add revoked_at timestamp to track when session was revoked
ALTER TABLE "session"
  ADD COLUMN IF NOT EXISTS "revoked_at" TIMESTAMP;

-- Add reason column to track why session was revoked
ALTER TABLE "session"
  ADD COLUMN IF NOT EXISTS "revoked_reason" TEXT;

-- Create index for efficient querying of non-revoked sessions
CREATE INDEX IF NOT EXISTS "idx_session_revoked" ON "session" ("revoked")
  WHERE "revoked" = FALSE;

-- Create index for user's active (non-revoked, non-expired) sessions
CREATE INDEX IF NOT EXISTS "idx_session_active" ON "session" ("user_id", "revoked", "expires_at")
  WHERE "revoked" = FALSE;

COMMENT ON COLUMN "session"."revoked" IS 'Whether this session has been manually revoked';
COMMENT ON COLUMN "session"."revoked_at" IS 'Timestamp when session was revoked';
COMMENT ON COLUMN "session"."revoked_reason" IS 'Reason for session revocation (e.g., security incident, user logout all devices)';
