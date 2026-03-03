"server-only";

import { eq, and } from "drizzle-orm";
import { db } from "~/server/db";
import { session } from "~/server/db/schema";

/**
 * Public-safe session type that excludes sensitive fields
 * This should be used for all API responses involving session data
 */
export type PublicSession = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  revoked: boolean;
  revokedAt: Date | null;
};

/**
 * Sanitizes a session object by removing the token field
 * IMPORTANT: Always use this function before returning session data to clients
 *
 * @param sessionData - Raw session object from database
 * @returns Public-safe session object without token
 */
export function sanitizeSession(sessionData: any): PublicSession {
  // Explicitly destructure and exclude token
  const {
    token: _token, // Prefix with _ to indicate intentionally unused
    revokedReason: _revokedReason, // Also exclude internal reason
    ...publicData
  } = sessionData;

  return publicData as PublicSession;
}

/**
 * Sanitizes multiple session objects
 *
 * @param sessions - Array of raw session objects
 * @returns Array of public-safe session objects
 */
export function sanitizeSessions(sessions: any[]): PublicSession[] {
  return sessions.map(sanitizeSession);
}

/**
 * Revokes a single session by ID
 *
 * @param sessionId - ID of the session to revoke
 * @param reason - Reason for revocation (for audit trail)
 * @returns Success status
 */
export async function revokeSession(
  sessionId: string,
  reason: string = "Manual revocation"
): Promise<{ success: boolean; message?: string }> {
  try {
    await db
      .update(session)
      .set({
        revoked: true,
        revokedAt: new Date(),
        revokedReason: reason,
      })
      .where(eq(session.id, sessionId));

    return { success: true };
  } catch (error) {
    console.error("[Session Security] Failed to revoke session:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Revokes all sessions for a specific user
 * Useful for "logout from all devices" functionality or security incidents
 *
 * @param userId - ID of the user whose sessions should be revoked
 * @param reason - Reason for revocation
 * @returns Number of sessions revoked
 */
export async function revokeAllUserSessions(
  userId: string,
  reason: string = "User logged out from all devices"
): Promise<{ success: boolean; count: number; message?: string }> {
  try {
    const result = await db
      .update(session)
      .set({
        revoked: true,
        revokedAt: new Date(),
        revokedReason: reason,
      })
      .where(
        and(eq(session.userId, userId), eq(session.revoked, false))
      )
      .returning({ id: session.id });

    return { success: true, count: result.length };
  } catch (error) {
    console.error("[Session Security] Failed to revoke user sessions:", error);
    return {
      success: false,
      count: 0,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Revokes all sessions globally (emergency use only)
 * Use this in case of a security breach where all sessions need to be invalidated
 *
 * @param reason - Reason for mass revocation
 * @returns Number of sessions revoked
 */
export async function revokeAllSessions(
  reason: string = "Security incident - mass revocation"
): Promise<{ success: boolean; count: number; message?: string }> {
  try {
    console.warn("[Session Security] MASS REVOCATION initiated:", reason);

    const result = await db
      .update(session)
      .set({
        revoked: true,
        revokedAt: new Date(),
        revokedReason: reason,
      })
      .where(eq(session.revoked, false))
      .returning({ id: session.id });

    return { success: true, count: result.length };
  } catch (error) {
    console.error("[Session Security] Failed to revoke all sessions:", error);
    return {
      success: false,
      count: 0,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Validates that a session is still valid (not revoked, not expired)
 *
 * @param sessionId - ID of session to validate
 * @returns Whether session is valid
 */
export async function isSessionValid(sessionId: string): Promise<boolean> {
  try {
    const result = await db.query.session.findFirst({
      where: and(
        eq(session.id, sessionId),
        eq(session.revoked, false)
      ),
    });

    if (!result) return false;

    // Check if expired
    return new Date(result.expiresAt) > new Date();
  } catch (error) {
    console.error("[Session Security] Failed to validate session:", error);
    return false;
  }
}

/**
 * Helper to check if current user owns a session
 * Use this for authorization checks
 *
 * @param sessionId - ID of the session
 * @param userId - ID of the user to check ownership
 * @returns Whether user owns the session
 */
export async function userOwnsSession(
  sessionId: string,
  userId: string
): Promise<boolean> {
  try {
    const result = await db.query.session.findFirst({
      where: and(eq(session.id, sessionId), eq(session.userId, userId)),
      columns: { id: true },
    });

    return !!result;
  } catch (error) {
    console.error("[Session Security] Failed to check session ownership:", error);
    return false;
  }
}
