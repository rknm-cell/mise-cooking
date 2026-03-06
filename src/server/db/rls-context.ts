"server-only";

import { sql } from "drizzle-orm";
import { db } from "~/server/db";

/**
 * Sets the user context for Row Level Security (RLS) policies.
 * This must be called at the start of each authenticated request.
 *
 * NOTE: With transaction-mode pooling, SET LOCAL only persists within
 * a transaction. For now, this is a no-op. RLS policies are in place
 * but we rely on application-level filtering in queries.
 *
 * TODO: Implement proper transaction wrapping or use service_role key
 *
 * @param userId - The authenticated user's ID
 * @returns Promise that resolves when context is set
 *
 * @example
 * ```typescript
 * // In tRPC context or API route:
 * await setRLSContext(session.userId);
 * // Now all queries will be filtered by RLS policies
 * const bookmarks = await getBookmarks(session.userId);
 * ```
 */
export async function setRLSContext(userId: string): Promise<void> {
  // With transaction-mode pooling, SET LOCAL doesn't persist across queries
  // Each query runs in its own transaction, so the setting is lost
  // For now, we rely on application-level filtering
  // TODO: Wrap queries in explicit transactions or use alternative RLS approach
  return Promise.resolve();
}

/**
 * Clears the user context for RLS.
 * Should be called after request completion if needed.
 *
 * @returns Promise that resolves when context is cleared
 */
export async function clearRLSContext(): Promise<void> {
  await db.execute(sql`RESET app.user_id`);
}

/**
 * Executes a function with RLS context set for a specific user.
 * Automatically sets and clears the context.
 *
 * @param userId - The authenticated user's ID
 * @param fn - Async function to execute with RLS context
 * @returns Result of the function
 *
 * @example
 * ```typescript
 * const bookmarks = await withRLSContext(userId, async () => {
 *   return await getBookmarks(userId);
 * });
 * ```
 */
export async function withRLSContext<T>(
  userId: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    await setRLSContext(userId);
    return await fn();
  } finally {
    await clearRLSContext();
  }
}

/**
 * Gets the current RLS user context.
 * Useful for debugging.
 *
 * @returns The current user ID set in RLS context, or null if not set
 */
export async function getRLSContext(): Promise<string | null> {
  const result = await db.execute<{ user_id: string }>(
    sql`SELECT current_setting('app.user_id', true) as user_id`
  );
  return result[0]?.user_id || null;
}
