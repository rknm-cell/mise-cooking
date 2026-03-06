-- Temporary: Disable RLS to fix transaction-mode pooling issues
ALTER TABLE bookmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists DISABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE cooking_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;
