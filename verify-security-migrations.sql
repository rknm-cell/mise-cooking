-- Security Migrations Verification Script
-- Run this in Supabase SQL Editor to verify all security measures are in place

-- ============================================================================
-- 1. Check if RLS is enabled on session table
-- ============================================================================
SELECT
  'RLS Status' as check_name,
  relname as table_name,
  CASE
    WHEN relrowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as status
FROM pg_class
WHERE relname = 'session';

-- ============================================================================
-- 2. Check RLS policies exist
-- ============================================================================
SELECT
  'RLS Policies' as check_name,
  policyname as policy_name,
  cmd as command_type,
  CASE
    WHEN permissive = 'PERMISSIVE' THEN '✅ Active'
    ELSE '⚠️ Restrictive'
  END as status
FROM pg_policies
WHERE tablename = 'session';

-- ============================================================================
-- 3. Verify sessions_public view exists and excludes token
-- ============================================================================
SELECT
  'View Columns' as check_name,
  column_name,
  data_type,
  CASE
    WHEN column_name = 'token' THEN '❌ TOKEN EXPOSED (BAD!)'
    WHEN column_name = 'revoked_reason' THEN '⚠️ Internal field exposed'
    ELSE '✅ Safe to expose'
  END as security_status
FROM information_schema.columns
WHERE table_name = 'sessions_public'
ORDER BY ordinal_position;

-- ============================================================================
-- 4. Check revocation columns exist on session table
-- ============================================================================
SELECT
  'Revocation Columns' as check_name,
  column_name,
  data_type,
  column_default,
  CASE
    WHEN is_nullable = 'YES' THEN 'NULL'
    ELSE 'NOT NULL'
  END as nullable
FROM information_schema.columns
WHERE table_name = 'session'
  AND column_name IN ('revoked', 'revoked_at', 'revoked_reason')
ORDER BY column_name;

-- ============================================================================
-- 5. Check indexes for performance
-- ============================================================================
SELECT
  'Indexes' as check_name,
  indexname as index_name,
  indexdef as definition
FROM pg_indexes
WHERE tablename = 'session'
  AND indexname LIKE '%revoked%';

-- ============================================================================
-- 6. Test sessions_public view (should NOT show token)
-- ============================================================================
SELECT
  'View Test' as check_name,
  COUNT(*) as total_sessions,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ View accessible'
    ELSE 'ℹ️ No sessions yet'
  END as status
FROM sessions_public;

-- ============================================================================
-- Summary: What should you see?
-- ============================================================================
-- ✅ RLS Status: ENABLED on session table
-- ✅ RLS Policies: At least 2 policies (Allow server, Block public)
-- ✅ View Columns: sessions_public should NOT have 'token' column
-- ✅ Revocation Columns: revoked (boolean), revoked_at (timestamp), revoked_reason (text)
-- ✅ Indexes: idx_session_revoked, idx_session_active
-- ✅ View Test: Should work without errors
