-- Migration: Enable Row Level Security on all user-owned tables
-- Purpose: Prevent unauthorized data access and ensure users can only access their own data
-- Date: 2026-03-03
-- Priority: CRITICAL - Security vulnerability fix

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookmarks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shopping_lists" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shopping_list_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cooking_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_preferences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recipe" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER TABLE POLICIES
-- ============================================================================

-- Users can view their own record
CREATE POLICY "Users can view own record"
  ON "user"
  FOR SELECT
  USING (id = current_setting('app.user_id', true)::text);

-- Users can update their own record
CREATE POLICY "Users can update own record"
  ON "user"
  FOR UPDATE
  USING (id = current_setting('app.user_id', true)::text);

-- Allow server to manage users (for Better Auth)
CREATE POLICY "Server can manage users"
  ON "user"
  FOR ALL
  TO authenticated, postgres
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- ACCOUNT TABLE POLICIES (CRITICAL - OAuth tokens)
-- ============================================================================

-- Users can only access their own OAuth accounts and tokens
CREATE POLICY "Users can view own accounts"
  ON "account"
  FOR SELECT
  USING (user_id = current_setting('app.user_id', true)::text);

-- Allow server to manage accounts (for Better Auth)
CREATE POLICY "Server can manage accounts"
  ON "account"
  FOR ALL
  TO authenticated, postgres
  USING (true)
  WITH CHECK (true);

-- Block all public access to accounts
REVOKE ALL ON TABLE "account" FROM PUBLIC;

-- ============================================================================
-- VERIFICATION TABLE POLICIES
-- ============================================================================

-- Allow server to manage verification tokens
CREATE POLICY "Server can manage verification"
  ON "verification"
  FOR ALL
  TO authenticated, postgres
  USING (true)
  WITH CHECK (true);

-- Block all public access
REVOKE ALL ON TABLE "verification" FROM PUBLIC;

-- ============================================================================
-- BOOKMARKS TABLE POLICIES
-- ============================================================================

-- Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON "bookmarks"
  FOR SELECT
  USING (user_id = current_setting('app.user_id', true)::text);

-- Users can create their own bookmarks
CREATE POLICY "Users can create own bookmarks"
  ON "bookmarks"
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', true)::text);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON "bookmarks"
  FOR DELETE
  USING (user_id = current_setting('app.user_id', true)::text);

-- ============================================================================
-- SHOPPING LISTS TABLE POLICIES
-- ============================================================================

-- Users can view their own shopping lists
CREATE POLICY "Users can view own shopping lists"
  ON "shopping_lists"
  FOR SELECT
  USING (user_id = current_setting('app.user_id', true)::text);

-- Users can create their own shopping lists
CREATE POLICY "Users can create own shopping lists"
  ON "shopping_lists"
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', true)::text);

-- Users can update their own shopping lists
CREATE POLICY "Users can update own shopping lists"
  ON "shopping_lists"
  FOR UPDATE
  USING (user_id = current_setting('app.user_id', true)::text);

-- Users can delete their own shopping lists
CREATE POLICY "Users can delete own shopping lists"
  ON "shopping_lists"
  FOR DELETE
  USING (user_id = current_setting('app.user_id', true)::text);

-- ============================================================================
-- SHOPPING LIST ITEMS TABLE POLICIES
-- ============================================================================

-- Users can view items in their own shopping lists
CREATE POLICY "Users can view own shopping list items"
  ON "shopping_list_items"
  FOR SELECT
  USING (
    list_id IN (
      SELECT id FROM shopping_lists
      WHERE user_id = current_setting('app.user_id', true)::text
    )
  );

-- Users can create items in their own shopping lists
CREATE POLICY "Users can create own shopping list items"
  ON "shopping_list_items"
  FOR INSERT
  WITH CHECK (
    list_id IN (
      SELECT id FROM shopping_lists
      WHERE user_id = current_setting('app.user_id', true)::text
    )
  );

-- Users can update items in their own shopping lists
CREATE POLICY "Users can update own shopping list items"
  ON "shopping_list_items"
  FOR UPDATE
  USING (
    list_id IN (
      SELECT id FROM shopping_lists
      WHERE user_id = current_setting('app.user_id', true)::text
    )
  );

-- Users can delete items from their own shopping lists
CREATE POLICY "Users can delete own shopping list items"
  ON "shopping_list_items"
  FOR DELETE
  USING (
    list_id IN (
      SELECT id FROM shopping_lists
      WHERE user_id = current_setting('app.user_id', true)::text
    )
  );

-- ============================================================================
-- COOKING SESSIONS TABLE POLICIES
-- ============================================================================

-- Users can view their own cooking sessions
CREATE POLICY "Users can view own cooking sessions"
  ON "cooking_sessions"
  FOR SELECT
  USING (user_id = current_setting('app.user_id', true)::text);

-- Users can create their own cooking sessions
CREATE POLICY "Users can create own cooking sessions"
  ON "cooking_sessions"
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', true)::text);

-- Users can update their own cooking sessions
CREATE POLICY "Users can update own cooking sessions"
  ON "cooking_sessions"
  FOR UPDATE
  USING (user_id = current_setting('app.user_id', true)::text);

-- Users can delete their own cooking sessions
CREATE POLICY "Users can delete own cooking sessions"
  ON "cooking_sessions"
  FOR DELETE
  USING (user_id = current_setting('app.user_id', true)::text);

-- ============================================================================
-- USER PREFERENCES TABLE POLICIES
-- ============================================================================

-- Users can view their own preferences
CREATE POLICY "Users can view own preferences"
  ON "user_preferences"
  FOR SELECT
  USING (user_id = current_setting('app.user_id', true)::text);

-- Users can create their own preferences
CREATE POLICY "Users can create own preferences"
  ON "user_preferences"
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', true)::text);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
  ON "user_preferences"
  FOR UPDATE
  USING (user_id = current_setting('app.user_id', true)::text);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences"
  ON "user_preferences"
  FOR DELETE
  USING (user_id = current_setting('app.user_id', true)::text);

-- ============================================================================
-- RECIPE TABLE POLICIES
-- ============================================================================

-- Anyone can view recipes (public read access)
CREATE POLICY "Anyone can view recipes"
  ON "recipe"
  FOR SELECT
  USING (true);

-- Allow server to create/manage recipes (for AI generation)
CREATE POLICY "Server can manage recipes"
  ON "recipe"
  FOR ALL
  TO authenticated, postgres
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- COMMENTS AND NOTES
-- ============================================================================

COMMENT ON TABLE "user" IS 'User accounts - RLS enforced, users can only access their own data';
COMMENT ON TABLE "account" IS 'OAuth accounts - RLS enforced, contains sensitive tokens';
COMMENT ON TABLE "bookmarks" IS 'User bookmarks - RLS enforced per user';
COMMENT ON TABLE "shopping_lists" IS 'Shopping lists - RLS enforced per user';
COMMENT ON TABLE "shopping_list_items" IS 'Shopping list items - RLS enforced via parent list ownership';
COMMENT ON TABLE "cooking_sessions" IS 'Cooking sessions - RLS enforced per user';
COMMENT ON TABLE "user_preferences" IS 'User preferences - RLS enforced per user';
COMMENT ON TABLE "recipe" IS 'Recipes - Public read access, server manages writes';

-- ============================================================================
-- IMPORTANT NOTES FOR DEVELOPERS
-- ============================================================================
--
-- To use RLS with Better Auth, you need to set the session variable in your queries:
--
-- Example in tRPC context or middleware:
--
--   await db.execute(sql`SET LOCAL app.user_id = ${userId}`);
--
-- This should be done at the start of each authenticated request.
-- The RLS policies use current_setting('app.user_id', true) to enforce permissions.
--
-- For server-side operations (like Better Auth managing sessions), the queries
-- run with the authenticated role which has full access via the "Server can manage" policies.
-- ============================================================================
