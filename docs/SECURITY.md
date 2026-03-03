# Security Policy & Runbook

## Overview

This document outlines the security measures implemented to protect session tokens and sensitive authentication data in the Mise application. It also provides operational procedures for responding to security incidents.

**Last Updated:** 2026-03-03
**Owner:** Engineering Team

---

## Table of Contents

1. [Security Measures Implemented](#security-measures-implemented)
2. [Session Token Protection](#session-token-protection)
3. [Incident Response Runbook](#incident-response-runbook)
4. [Database Migrations](#database-migrations)
5. [API Usage Guidelines](#api-usage-guidelines)
6. [Testing & Verification](#testing--verification)
7. [Regular Audits](#regular-audits)

---

## Security Measures Implemented

### 1. Row Level Security (RLS)

**Status:** ✅ Implemented
**Migration:** `0005_enable_rls_on_session.sql`

RLS has been enabled on the `session` table to ensure users can only access their own session data.

**Policies:**
- Users can SELECT only their own sessions
- Users can DELETE only their own sessions
- INSERT/UPDATE restricted to server-side only (Better Auth)

### 2. Public Access Revocation

**Status:** ✅ Implemented
**Migration:** `0007_revoke_public_select_session.sql`

All public SELECT privileges on the `session` table have been revoked. Direct table access is restricted.

### 3. Safe Public View

**Status:** ✅ Implemented
**Migration:** `0006_create_sessions_public_view.sql`

Created `sessions_public` view that excludes sensitive fields:
- ✅ Includes: id, user_id, created_at, updated_at, expires_at, ip_address, user_agent
- ❌ Excludes: **token**, revoked_reason

### 4. Session Revocation System

**Status:** ✅ Implemented
**Migration:** `0008_add_session_revocation.sql`

Added ability to invalidate sessions with:
- `revoked` boolean flag
- `revoked_at` timestamp
- `revoked_reason` for audit trail
- Indexed for performance

### 5. Server-Side Token Sanitization

**Status:** ✅ Implemented
**File:** `src/server/session-utils.ts`

Utility functions ensure tokens are never exposed:
- `sanitizeSession()` - Removes token from single session
- `sanitizeSessions()` - Removes tokens from session arrays
- `PublicSession` type - TypeScript type safety

### 6. Automated Testing

**Status:** ✅ Implemented
**File:** `src/__tests__/session-security.test.ts`

11 comprehensive tests verify:
- ✅ Token fields are removed from responses
- ✅ JSON serialization doesn't leak tokens
- ✅ Array handling is secure
- ✅ Type safety is enforced

---

## Session Token Protection

### How Tokens Are Protected

1. **Storage:** Tokens stored in database with restricted access
2. **Transit:** Better Auth handles secure transmission via HTTP-only cookies
3. **Sanitization:** All API responses pass through `sanitizeSession()` before returning to clients
4. **Access Control:** RLS ensures users only access their own sessions
5. **Revocation:** Ability to invalidate compromised tokens immediately

### What NOT To Do ⚠️

```typescript
// ❌ NEVER: Return raw session from database
const session = await db.query.session.findFirst(...);
return session; // EXPOSES TOKEN!

// ✅ ALWAYS: Sanitize before returning
const session = await db.query.session.findFirst(...);
return sanitizeSession(session); // SAFE
```

### Example: Safe API Endpoint

```typescript
import { sanitizeSession } from "~/server/session-utils";

export async function getUserSessions(userId: string) {
  const sessions = await db.query.session.findMany({
    where: eq(session.userId, userId),
  });

  // CRITICAL: Always sanitize
  return sanitizeSessions(sessions);
}
```

---

## Incident Response Runbook

### Scenario 1: Session Token Leak Detected

**Severity:** 🔴 CRITICAL

**Immediate Actions (Within 1 hour):**

1. **Assess Scope**
   ```bash
   # Check logs for suspicious access
   # Identify which tokens/users may be affected
   ```

2. **Revoke Affected Sessions**

   If specific user affected:
   ```typescript
   import { revokeAllUserSessions } from "~/server/session-utils";

   await revokeAllUserSessions(
     "affected-user-id",
     "Security incident - token leak detected on 2026-03-03"
   );
   ```

   If widespread:
   ```typescript
   import { revokeAllSessions } from "~/server/session-utils";

   await revokeAllSessions(
     "SECURITY INCIDENT: Mass token leak - all sessions invalidated"
   );
   ```

3. **Database Migration (If Needed)**
   ```bash
   # Apply migration to force logout all users
   bun run db:migrate
   ```

4. **Notify Users**
   - Send email to affected users
   - Require re-authentication
   - Explain incident transparently

**Follow-Up Actions (Within 24 hours):**

5. **Root Cause Analysis**
   - Identify how tokens were exposed
   - Document findings in incident report
   - Update this runbook with lessons learned

6. **Prevention Measures**
   - Add additional monitoring/alerts
   - Review code for similar vulnerabilities
   - Update CI/CD checks

7. **Compliance Reporting**
   - Notify legal/compliance team
   - File incident report per company policy
   - Consider regulatory requirements (GDPR, etc.)

---

### Scenario 2: Suspicious Session Activity

**Severity:** 🟡 MEDIUM

**Actions:**

1. **Verify Activity**
   ```sql
   -- Check session details
   SELECT id, user_id, ip_address, user_agent, created_at
   FROM sessions_public
   WHERE user_id = 'suspicious-user-id'
   ORDER BY created_at DESC;
   ```

2. **Revoke Specific Session**
   ```typescript
   import { revokeSession } from "~/server/session-utils";

   await revokeSession(
     "suspicious-session-id",
     "Suspicious activity detected"
   );
   ```

3. **Contact User**
   - Email user about suspicious activity
   - Recommend password change
   - Enable MFA if available

4. **Monitor**
   - Watch for further suspicious activity
   - Set up alerts for this user

---

### Scenario 3: User Requests All Sessions Logout

**Severity:** 🟢 LOW

**Actions:**

```typescript
import { revokeAllUserSessions } from "~/server/session-utils";

await revokeAllUserSessions(
  "user-id",
  "User requested logout from all devices"
);
```

Or via tRPC (once implemented):
```typescript
// Client-side
await trpc.session.revokeAllOtherSessions.mutate();
```

---

## Database Migrations

### Migration Order

Migrations must be applied in this order:

| Order | File | Purpose |
|-------|------|---------|
| 1 | `0005_enable_rls_on_session.sql` | Enable Row Level Security |
| 2 | `0006_create_sessions_public_view.sql` | Create safe public view |
| 3 | `0007_revoke_public_select_session.sql` | Revoke public access |
| 4 | `0008_add_session_revocation.sql` | Add revocation fields |

### Running Migrations

**Development:**
```bash
# Push schema changes directly
bun run db:push
```

**Production:**
```bash
# Generate migration files (already created)
# bun run db:generate

# Apply migrations
bun run db:migrate

# Verify with Drizzle Studio
bun run db:studio
```

### Rollback Procedure

If migrations cause issues:

```sql
-- Rollback in reverse order

-- 4. Remove revocation columns
ALTER TABLE session DROP COLUMN IF EXISTS revoked;
ALTER TABLE session DROP COLUMN IF EXISTS revoked_at;
ALTER TABLE session DROP COLUMN IF EXISTS revoked_reason;
DROP INDEX IF EXISTS idx_session_revoked;
DROP INDEX IF EXISTS idx_session_active;

-- 3. Restore public access (if needed for rollback)
GRANT SELECT ON TABLE session TO authenticated;

-- 2. Drop public view
DROP VIEW IF EXISTS sessions_public;

-- 1. Disable RLS
ALTER TABLE session DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own sessions" ON session;
DROP POLICY IF EXISTS "Users can delete own sessions" ON session;
```

**⚠️ WARNING:** Only rollback in emergency. Consult team first.

---

## API Usage Guidelines

### For Backend Developers

**Rule 1: Always Sanitize Sessions**

```typescript
// Import sanitizer
import { sanitizeSession, sanitizeSessions } from "~/server/session-utils";

// For single session
const session = await db.query.session.findFirst(...);
return sanitizeSession(session);

// For multiple sessions
const sessions = await db.query.session.findMany(...);
return sanitizeSessions(sessions);
```

**Rule 2: Use sessions_public View for Read-Only**

```sql
-- Instead of:
SELECT * FROM session WHERE user_id = $1;

-- Use:
SELECT * FROM sessions_public WHERE user_id = $1;
```

**Rule 3: Validate Ownership**

```typescript
import { userOwnsSession } from "~/server/session-utils";

const owns = await userOwnsSession(sessionId, currentUserId);
if (!owns) {
  throw new Error("Forbidden");
}
```

### For Frontend Developers

**What You'll Receive:**

```typescript
type PublicSession = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  revoked: boolean;
  revokedAt: Date | null;
  // token is NEVER included
};
```

**You should NEVER:**
- See or handle session tokens
- Access the raw `session` table
- Need to know about token internals

---

## Testing & Verification

### Running Security Tests

```bash
# Run all tests
bun run test

# Run only session security tests
bun run test src/__tests__/session-security.test.ts
```

**Expected Output:**
```
✓ Session Security Tests (11)
  ✓ sanitizeSession should remove token field
  ✓ should handle session objects with minimal fields
  ✓ should sanitize multiple session objects
  ...
```

### Manual Verification

1. **Check RLS is enabled:**
   ```sql
   SELECT relname, relrowsecurity
   FROM pg_class
   WHERE relname = 'session';
   -- relrowsecurity should be TRUE
   ```

2. **Check policies exist:**
   ```sql
   SELECT policyname, permissive, roles, cmd
   FROM pg_policies
   WHERE tablename = 'session';
   ```

3. **Verify view exists:**
   ```sql
   SELECT * FROM sessions_public LIMIT 1;
   -- Should NOT have 'token' column
   ```

4. **Test sanitizer:**
   ```bash
   bun run test src/__tests__/session-security.test.ts
   ```

---

## Regular Audits

### Monthly Security Checklist

- [ ] Review session access logs for anomalies
- [ ] Verify RLS policies are still active
- [ ] Run security test suite
- [ ] Check for expired but non-revoked sessions
- [ ] Review and clean up old revoked sessions
- [ ] Update this document with any changes

### Quarterly Reviews

- [ ] Full code audit for token exposure
- [ ] Penetration testing on auth endpoints
- [ ] Review and update incident response procedures
- [ ] Team training on secure session handling
- [ ] Dependency audit (Better Auth, Drizzle, etc.)

### Commands for Cleanup

```sql
-- Find expired sessions
SELECT COUNT(*)
FROM session
WHERE expires_at < NOW() AND revoked = FALSE;

-- Clean up old revoked sessions (older than 90 days)
DELETE FROM session
WHERE revoked = TRUE
  AND revoked_at < NOW() - INTERVAL '90 days';
```

---

## Emergency Contacts

| Role | Contact | Purpose |
|------|---------|---------|
| Security Lead | security@mise.app | Security incidents |
| Database Admin | dba@mise.app | Database issues |
| DevOps Lead | devops@mise.app | Infrastructure issues |
| Legal/Compliance | legal@mise.app | Breach notification |

---

## Appendix: Better Auth Integration

Better Auth handles:
- Token generation (secure random tokens)
- Token hashing (before storage)
- Cookie-based session management
- CSRF protection

**We handle:**
- Preventing token exposure in API responses
- Session revocation
- Access control (RLS)
- Audit trail (revoked_reason, timestamps)

**Division of Responsibility:**
- Better Auth: Token lifecycle management
- Application: Token protection and access control

---

## References

- [Better Auth Documentation](https://better-auth.com)
- [Drizzle ORM Security](https://orm.drizzle.team/docs/security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- OWASP Session Management Cheat Sheet

---

**Document Version:** 1.0
**Last Review:** 2026-03-03
**Next Review:** 2026-06-03
