-- Migration: Add performance indexes to improve query speed
-- Purpose: Fix missing indexes that cause full table scans and slow queries
-- Date: 2026-03-03
-- Priority: CRITICAL - Performance optimization

-- ============================================================================
-- BOOKMARKS TABLE INDEXES
-- ============================================================================

-- Index for fetching user's bookmarks (queries.ts:79-87, 290-301)
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id
  ON bookmarks(user_id);

-- Index for checking if recipe is bookmarked
CREATE INDEX IF NOT EXISTS idx_bookmarks_recipe_id
  ON bookmarks(recipe_id);

-- Composite index for bookmark lookups (queries.ts:303-317)
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_recipe
  ON bookmarks(user_id, recipe_id);

-- Index for fetching bookmarked recipes with timestamp ordering
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created
  ON bookmarks(user_id, bookmarked_at DESC);

COMMENT ON INDEX idx_bookmarks_user_id IS 'Optimize user bookmark queries';
COMMENT ON INDEX idx_bookmarks_recipe_id IS 'Optimize recipe bookmark lookups';
COMMENT ON INDEX idx_bookmarks_user_recipe IS 'Optimize bookmark existence checks';

-- ============================================================================
-- SHOPPING LISTS TABLE INDEXES
-- ============================================================================

-- Index for fetching user's shopping lists (queries.ts:128-136)
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user_id
  ON shopping_lists(user_id);

-- Index for ordering by creation/update time
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user_created
  ON shopping_lists(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_shopping_lists_user_updated
  ON shopping_lists(user_id, updated_at DESC);

COMMENT ON INDEX idx_shopping_lists_user_id IS 'Optimize user shopping list queries';

-- ============================================================================
-- SHOPPING LIST ITEMS TABLE INDEXES
-- ============================================================================

-- Index for fetching items in a list (queries.ts:161-169, 171-191)
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list_id
  ON shopping_list_items(list_id);

-- Index for filtering completed items (queries.ts:319-344)
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_completed
  ON shopping_list_items(list_id, is_completed);

-- Partial index for active (incomplete) items only - more efficient
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_active
  ON shopping_list_items(list_id, created_at)
  WHERE is_completed = false;

-- Index for category-based filtering
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_category
  ON shopping_list_items(list_id, category, is_completed);

COMMENT ON INDEX idx_shopping_list_items_list_id IS 'Optimize list item queries';
COMMENT ON INDEX idx_shopping_list_items_completed IS 'Optimize completed item filtering';
COMMENT ON INDEX idx_shopping_list_items_active IS 'Partial index for active items only';

-- ============================================================================
-- COOKING SESSIONS TABLE INDEXES
-- ============================================================================

-- Index for fetching user's cooking sessions (queries.ts:503-525)
CREATE INDEX IF NOT EXISTS idx_cooking_sessions_user_id
  ON cooking_sessions(user_id);

-- Index for recipe-based queries
CREATE INDEX IF NOT EXISTS idx_cooking_sessions_recipe_id
  ON cooking_sessions(recipe_id);

-- Index for status filtering (queries.ts:506-515)
CREATE INDEX IF NOT EXISTS idx_cooking_sessions_user_status
  ON cooking_sessions(user_id, status);

-- Partial index for active sessions only (queries.ts:481-501)
CREATE INDEX IF NOT EXISTS idx_cooking_sessions_active
  ON cooking_sessions(user_id, recipe_id, status)
  WHERE status = 'active';

-- Index for ordering by last activity (queries.ts:519)
CREATE INDEX IF NOT EXISTS idx_cooking_sessions_last_active
  ON cooking_sessions(user_id, last_active_at DESC);

-- Composite index for finding active session for a user/recipe pair
CREATE INDEX IF NOT EXISTS idx_cooking_sessions_user_recipe_status
  ON cooking_sessions(user_id, recipe_id, status, last_active_at DESC);

-- Index for completed sessions analytics
CREATE INDEX IF NOT EXISTS idx_cooking_sessions_completed
  ON cooking_sessions(user_id, completed_at DESC)
  WHERE status = 'completed';

COMMENT ON INDEX idx_cooking_sessions_user_id IS 'Optimize user session queries';
COMMENT ON INDEX idx_cooking_sessions_active IS 'Partial index for active sessions only';
COMMENT ON INDEX idx_cooking_sessions_last_active IS 'Optimize session history queries';

-- ============================================================================
-- USER PREFERENCES TABLE INDEXES
-- ============================================================================

-- Index for userId lookup (should be unique anyway)
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id
  ON user_preferences(user_id);

-- Index for onboarding status checks (queries.ts:433-441)
CREATE INDEX IF NOT EXISTS idx_user_preferences_onboarding
  ON user_preferences(user_id, onboarding_completed);

COMMENT ON INDEX idx_user_preferences_user_id IS 'Optimize user preferences lookup';

-- ============================================================================
-- SESSION TABLE INDEXES (Authentication)
-- ============================================================================

-- Index for user's sessions (already has idx_session_active from migration 0008)
CREATE INDEX IF NOT EXISTS idx_session_user_id
  ON session(user_id);

-- Index for token lookups (Better Auth authentication)
CREATE INDEX IF NOT EXISTS idx_session_token
  ON session(token)
  WHERE revoked = false;

-- Index for cleanup of expired sessions
CREATE INDEX IF NOT EXISTS idx_session_expires
  ON session(expires_at)
  WHERE revoked = false;

COMMENT ON INDEX idx_session_user_id IS 'Optimize user session queries';
COMMENT ON INDEX idx_session_token IS 'Optimize session token lookups';
COMMENT ON INDEX idx_session_expires IS 'Optimize expired session cleanup';

-- ============================================================================
-- ACCOUNT TABLE INDEXES (OAuth)
-- ============================================================================

-- Index for user's OAuth accounts
CREATE INDEX IF NOT EXISTS idx_account_user_id
  ON account(user_id);

-- Index for provider lookups
CREATE INDEX IF NOT EXISTS idx_account_provider
  ON account(provider_id, account_id);

-- Unique index to prevent duplicate provider accounts
CREATE UNIQUE INDEX IF NOT EXISTS idx_account_provider_unique
  ON account(provider_id, account_id, user_id);

COMMENT ON INDEX idx_account_user_id IS 'Optimize user account queries';
COMMENT ON INDEX idx_account_provider IS 'Optimize provider account lookups';

-- ============================================================================
-- RECIPE TABLE INDEXES
-- ============================================================================

-- Index for recipe lookups by ID (already primary key)
-- Index for ordering recipes by creation time
-- Note: recipe table uses camelCase 'createdAt' instead of snake_case
CREATE INDEX IF NOT EXISTS idx_recipe_created
  ON recipe("createdAt" DESC);

-- Index for recipe name searches (future full-text search)
CREATE INDEX IF NOT EXISTS idx_recipe_name
  ON recipe(name);

-- Note: For full-text search on recipe names/descriptions, consider:
-- CREATE INDEX idx_recipe_search ON recipe USING GIN(to_tsvector('english', name || ' ' || description));

COMMENT ON INDEX idx_recipe_created IS 'Optimize recipe listing by creation date';

-- ============================================================================
-- USER TABLE INDEXES
-- ============================================================================

-- Email is already unique, which creates an index
-- Add index for email lookups
CREATE INDEX IF NOT EXISTS idx_user_email
  ON "user"(email);

-- Index for user creation time
CREATE INDEX IF NOT EXISTS idx_user_created
  ON "user"(created_at DESC);

COMMENT ON INDEX idx_user_email IS 'Optimize user email lookups (already unique)';

-- ============================================================================
-- VERIFICATION TABLE INDEXES
-- ============================================================================

-- Index for verification lookups
CREATE INDEX IF NOT EXISTS idx_verification_identifier
  ON verification(identifier);

-- Index for cleanup of expired verifications
CREATE INDEX IF NOT EXISTS idx_verification_expires
  ON verification(expires_at);

COMMENT ON INDEX idx_verification_identifier IS 'Optimize verification lookups';
COMMENT ON INDEX idx_verification_expires IS 'Optimize expired verification cleanup';

-- ============================================================================
-- ANALYZE TABLES FOR BETTER QUERY PLANNING
-- ============================================================================

-- Update table statistics for query optimizer
ANALYZE bookmarks;
ANALYZE shopping_lists;
ANALYZE shopping_list_items;
ANALYZE cooking_sessions;
ANALYZE user_preferences;
ANALYZE session;
ANALYZE account;
ANALYZE recipe;
ANALYZE "user";
ANALYZE verification;

-- ============================================================================
-- PERFORMANCE MONITORING NOTES
-- ============================================================================
--
-- To monitor index usage:
--   SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
--   FROM pg_stat_user_indexes
--   WHERE schemaname = 'public'
--   ORDER BY idx_scan ASC;
--
-- To find unused indexes:
--   SELECT schemaname, tablename, indexname
--   FROM pg_stat_user_indexes
--   WHERE idx_scan = 0 AND schemaname = 'public';
--
-- To check table sizes and bloat:
--   SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
--   FROM pg_tables
--   WHERE schemaname = 'public'
--   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
-- ============================================================================
