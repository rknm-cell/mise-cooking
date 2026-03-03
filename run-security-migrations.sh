#!/bin/bash

# Security Migrations Runner
# Applies database security migrations for session token protection

set -e  # Exit on error

echo "🔒 Running Security Migrations..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable not set"
  echo "   Please run: source .env"
  exit 1
fi

# Array of migration files in order
migrations=(
  "0005_enable_rls_on_session.sql"
  "0006_create_sessions_public_view.sql"
  "0007_revoke_public_select_session.sql"
  "0008_add_session_revocation.sql"
)

cd supabase/migrations

# Run each migration
for migration in "${migrations[@]}"; do
  if [ -f "$migration" ]; then
    echo "📝 Running: $migration"
    psql "$DATABASE_URL" -f "$migration" -q
    echo "   ✅ Success"
    echo ""
  else
    echo "   ⚠️  File not found: $migration"
  fi
done

echo "🎉 All security migrations completed!"
echo ""
echo "Next steps:"
echo "1. Verify migrations: bun run db:studio"
echo "2. Check RLS is enabled: SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'session';"
echo "3. Check view exists: SELECT * FROM sessions_public LIMIT 1;"
