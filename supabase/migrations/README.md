# Database Migrations

This directory contains SQL migration files for the Mise application database schema.

## Migration System

We use **Drizzle Kit** for database migrations with PostgreSQL.

### Commands

```bash
# Generate new migration from schema changes
bun run db:generate

# Apply all pending migrations to database
bun run db:migrate

# Push schema directly without migration (dev only)
bun run db:push

# Open Drizzle Studio to view/edit data
bun run db:studio
```

---

## Migration Files

### Initial Schema Migrations

| File | Description |
|------|-------------|
| `0000_black_wonder_man.sql` | Initial schema setup |
| `0001_happy_reavers.sql` | Schema update |
| `0002_great_lady_vermin.sql` | Schema update |
| `0003_square_epoch.sql` | Schema update |
| `0004_modern_skrulls.sql` | Schema update |

### Security Enhancement Migrations (2026-03-03)

#### 0005_enable_rls_on_session.sql

**Purpose:** Enable Row Level Security on session table

**Changes:**
- Enables RLS on `session` table
- Adds policy: Users can SELECT only their own sessions
- Adds policy: Users can DELETE only their own sessions
- Prevents client-side INSERT/UPDATE

**Security Impact:** 🔴 CRITICAL
- Prevents unauthorized session access
- Users cannot view other users' sessions

#### 0006_create_sessions_public_view.sql

**Purpose:** Create safe public view without sensitive data

**Changes:**
- Creates `sessions_public` VIEW
- Excludes `token` field (sensitive)
- Excludes `revoked_reason` field (internal)
- Includes: id, user_id, timestamps, ip, user_agent

**Security Impact:** 🔴 CRITICAL
- Provides token-safe access to session data
- Applications should query this view instead of raw table

**Usage:**
```sql
-- Use this instead of raw table
SELECT * FROM sessions_public WHERE user_id = $1;
```

#### 0007_revoke_public_select_session.sql

**Purpose:** Remove public access to session table

**Changes:**
- `REVOKE ALL ON TABLE session FROM PUBLIC`
- `REVOKE SELECT ON TABLE session FROM PUBLIC`
- Revokes from `anon` role if exists

**Security Impact:** 🔴 CRITICAL
- Prevents unauthorized direct table access
- Forces use of sessions_public view or server endpoints

#### 0008_add_session_revocation.sql

**Purpose:** Add session revocation/invalidation support

**Changes:**
- Adds `revoked` BOOLEAN column (default FALSE)
- Adds `revoked_at` TIMESTAMP column
- Adds `revoked_reason` TEXT column
- Creates index on `revoked` for performance
- Creates compound index on `user_id`, `revoked`, `expires_at`

**Security Impact:** 🟡 HIGH
- Enables emergency session invalidation
- Supports "logout from all devices" feature
- Provides audit trail for revocations

**Usage:**
```typescript
// Revoke a single session
await revokeSession(sessionId, "User logged out");

// Revoke all user sessions
await revokeAllUserSessions(userId, "Password changed");

// Emergency: Revoke all sessions
await revokeAllSessions("Security incident");
```

---

## Migration Best Practices

### Before Creating Migrations

1. **Update schema first:** Edit `src/server/db/schema.ts`
2. **Test locally:** Use `bun run db:push` to test changes
3. **Generate migration:** Run `bun run db:generate` when satisfied
4. **Review SQL:** Always review generated SQL before committing
5. **Test migration:** Apply migration locally with `bun run db:migrate`

### Migration Naming

Drizzle auto-generates names like `0000_descriptive_name.sql`. The number ensures order.

### Idempotency

Migrations should be idempotent when possible:

```sql
-- Good: Safe to run multiple times
CREATE TABLE IF NOT EXISTS users (...);
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS revoked BOOLEAN;

-- Bad: Fails on second run
CREATE TABLE users (...);
ALTER TABLE sessions ADD COLUMN revoked BOOLEAN;
```

### Rollbacks

Production rollbacks should be rare. If needed:

1. Create a new "rollback" migration (don't delete existing ones)
2. Test rollback migration in staging
3. Apply to production
4. Document in this README

---

## Production Deployment Checklist

Before deploying migrations to production:

- [ ] Migrations tested in development
- [ ] Migrations tested in staging
- [ ] Backup database before migration
- [ ] Review migration SQL for syntax errors
- [ ] Check for breaking changes
- [ ] Plan rollback strategy
- [ ] Schedule deployment during low-traffic window
- [ ] Monitor application logs after deployment
- [ ] Verify database state with `db:studio`

---

## Security Migrations (Special Attention)

The security migrations (0005-0008) are **CRITICAL** and have special requirements:

### Pre-Deployment

1. **Notify team:** Security changes affect all developers
2. **Update code first:** Deploy code using `sanitizeSession()` utilities
3. **Test thoroughly:** Run security test suite
4. **Schedule carefully:** Potential for user session interruption

### Post-Deployment

1. **Verify RLS:** Check policies are active
2. **Verify view:** Ensure `sessions_public` excludes tokens
3. **Monitor logs:** Watch for permission errors
4. **Test endpoints:** Verify API responses don't include tokens

### Testing

```bash
# Run security test suite
bun run test src/__tests__/session-security.test.ts

# Manual verification
psql $DATABASE_URL -c "SELECT * FROM sessions_public LIMIT 1;"
# Should NOT show 'token' column
```

---

## Troubleshooting

### Migration fails with "relation already exists"

**Cause:** Migration already applied or schema drift

**Solution:**
```bash
# Check current database state
bun run db:studio

# If needed, manually adjust database to match expected state
# Then regenerate migrations
```

### RLS blocking legitimate queries

**Cause:** Missing or incorrect RLS policies

**Solution:**
```sql
-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'session';

-- Update policies as needed
-- See docs/SECURITY.md for correct policies
```

### Performance issues after security migrations

**Cause:** RLS policies and indexes

**Solution:**
```sql
-- Check query plans
EXPLAIN ANALYZE SELECT * FROM sessions_public WHERE user_id = 'xxx';

-- Ensure indexes exist
SELECT indexname FROM pg_indexes WHERE tablename = 'session';
```

---

## References

- [Drizzle Kit Migrations](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Security Runbook](../docs/SECURITY.md)

---

**Last Updated:** 2026-03-03
**Maintainer:** Engineering Team
