-- Temporary fix: Allow bypassing RLS for transaction-mode pooling
-- This grants the database role permission to bypass RLS policies
--
-- WHY: With transaction-mode pooling and prepare:false, SET LOCAL commands
-- don't persist across queries (each query is its own transaction).
-- This means app.user_id context is lost between setRLSContext() and actual queries.
--
-- SECURITY NOTE: This removes RLS protection at the database level.
-- We rely on application-level filtering in all queries.
-- TODO: Implement proper transaction wrapping or use session-mode pooling

-- Grant bypassrls to the postgres role (or your connection user)
-- Note: Replace 'postgres' with your actual connection role if different
ALTER ROLE postgres BYPASSRLS;

-- Alternative: Grant to authenticator role for Supabase
-- ALTER ROLE authenticator BYPASSRLS;

-- Document the change
COMMENT ON ROLE postgres IS 'Has BYPASSRLS granted due to transaction-mode pooling limitations';
