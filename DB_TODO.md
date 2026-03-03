# DB & Security TODO

TODO list for codebase implementation: session token safety, DB migrations, and operational runbooks.

---

## 1. Prevent tokens from being returned by APIs *(Code-only)*

**Description:** Ensure server and client API responses never include raw session tokens.

**What to change:**

- Backend controllers/serializers that return session objects (e.g., sessions controllers, auth endpoints).
- GraphQL resolvers that expose session fields.
- API DTOs / response mappers that shape session payloads.

**Implementation hints:**

- Remove `token` from returned fields or map session → `SessionPublic { id, user_id, created_at, expires_at }`.
- Add tests asserting responses do not contain `token`.
- Where tokens are required internally, only return masks (e.g., show last 4 chars) or boolean flags.

---

## 2. Stop client code from storing/using service_role or long-lived tokens *(Code-only)*

**Description:** Remove any usage of the Supabase `service_role` / long-lived secrets in frontend or untrusted code.

**What to change:**

- Audit env usage across repos (search for `SUPABASE_SERVICE_ROLE_KEY`, `service_role`).
- Replace with server-side endpoints that use service role and return minimal/non-sensitive data.

**Implementation hints:**

- Move operations requiring `service_role` (e.g., deleting user sessions) behind authenticated server endpoints.
- Add CI linter rule to fail builds if `service_role` env is referenced in frontend bundles.

---

## 3. Centralize token management on server *(Code-only + small DB migration optional)*

**Description:** Ensure creation, rotation, and invalidation of session tokens happens only in server code.

**What to change:**

- Add server endpoints for token issuance and rotation.
- Replace any client-side token generation flows.

**Implementation hints:**

- Use short-lived access tokens + refresh tokens pattern; store refresh tokens server-side.
- Add unit and integration tests around token lifecycle.

---

## 4. Expose a safe public sessions view *(Requires DB migration)*

**Description:** Create a read-only DB view that excludes sensitive columns (e.g. `token`) and use it as the API backing table.

**What to change in code:**

- Update ORM models or API queries to read from the view (e.g. `SELECT` from `sessions_public`).
- Update migrations folder to include SQL to create the view.

**SQL migration to include:**

```sql
CREATE VIEW public.sessions_public AS
  SELECT id, user_id, created_at, expires_at, ...
  FROM public.session;

GRANT SELECT ON public.sessions_public TO your_api_role;
```

**Implementation hints:**

- Ensure application uses the view for read-only public endpoints while writes still go to base table via server endpoints.

---

## 5. Add server-side authorization checks to session endpoints *(Code-only)*

**Description:** Enforce that only the session owner or a trusted backend role can read/modify session rows.

**What to change:**

- Update middleware/route handlers to verify current user's `id` equals `session.user_id` before returning/modifying sessions.
- Add tests simulating unauthorized access attempts.

**Implementation hints:**

- Obtain current user id from request auth context (JWT `sub` claim) and compare to `session.user_id`.

---

## 6. Revoke broad DB privileges as part of migrations *(Requires DB migration)*

**Description:** Remove `SELECT` privileges from `PUBLIC`/`anon` for the session table.

**What to change in code:**

- Add migration SQL: `REVOKE SELECT ON public.session FROM PUBLIC;`

**Implementation hints:**

- Add migration and a post-deploy job to verify privileges.

---

## 7. Rotate / invalidate exposed tokens *(Requires DB migration + server job)*

**Description:** If tokens might have been leaked, invalidate existing tokens and force re-authentication.

**What to change in code:**

- Create a server job or migration that sets `session.revoked = true` or `expires_at = now()` for affected rows.
- Update auth flows to honor `revoked` flag.

**Implementation hints:**

- Implement endpoint to bulk rotate sessions per user or global; set TTL/expiry shorter.
- Add notification emails/UX to prompt users to re-login if necessary.

---

## 8. Add automated tests and lint rules to prevent re-introduction *(Code-only)*

**Description:** Add tests and CI checks ensuring:

- `session.token` is never serialized to API responses
- Frontend repo does not contain `service_role` keys
- Migration files include RLS enabling for sensitive tables

**What to change:**

- Add unit/integration tests to backend test suites.
- Add static analyzer / grep-based CI job scanning for sensitive column exposure (e.g. scanning serializers for `'token'`).

**Implementation hints:**

- Use existing test frameworks; fail build on detection.

---

## 9. Add logging and alerting around high-volume session reads *(Code-only + optional infra)*

**Description:** Instrument endpoints that list sessions to log requester identity and counts; alert if abnormal.

**What to change:**

- Add request logging for session-list API routes.
- Add rate-limiting and alarms in app or monitoring platform (Sentry/Datadog).

**Implementation hints:**

- Implement rate-limiter middleware; create alert rule for >X reads/min from a single API key.

---

## 10. Document policy and operational runbook *(Code-only)*

**Description:** Add a runbook for handling suspected token leakage, token rotation steps, and who to notify.

**What to change:**

- Add `docs/SECURITY.md` with step-by-step instructions to rotate keys, revoke sessions, and communicate to users.

**Implementation hints:**

- Include exact migration filenames and commands to run.

---

## Deliverables (DB operations)

SQL files for migrations:

| File | Purpose |
|------|---------|
| `0001_enable_rls_on_session.sql` | `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` |
| `0002_create_sessions_public_view.sql` | `CREATE VIEW ...` |
| `0003_revoke_public_select_session.sql` | `REVOKE SELECT ...` |
| `0004_invalidate_tokens.sql` | `UPDATE public.session SET revoked = true WHERE ...;` |

- A small server script / admin endpoint to run token rotation/invalidation *(Code-only)* that uses `SERVICE_ROLE_KEY` from server env.

---

## Priority order (for Claude Code)

1. **Code-only:** Prevent tokens returned by APIs; add server-side authorization checks; remove `service_role` usage in client.
2. Add tests/CI linting to block regressions.
3. **DB migrations:** Create public-safe view; revoke public privileges; enable RLS.
4. Token rotation/invalidation and monitoring; update documentation/runbook.
