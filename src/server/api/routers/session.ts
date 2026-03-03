import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eq, and, desc } from "drizzle-orm";
import { session } from "~/server/db/schema";
import {
  sanitizeSession,
  sanitizeSessions,
  revokeSession,
  revokeAllUserSessions,
  userOwnsSession,
} from "~/server/session-utils";
import { TRPCError } from "@trpc/server";

/**
 * Session Management Router
 * Provides safe endpoints for users to view and manage their sessions
 * IMPORTANT: All responses use sanitized session objects (no tokens)
 */
export const sessionRouter = createTRPCRouter({
  /**
   * Get all sessions for the current user
   * Returns only public-safe session data (tokens excluded)
   */
  getMySessions: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Get userId from auth context once protectedProcedure is properly implemented
    // For now, this endpoint requires manual userId passing or proper auth setup

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Auth context not yet implemented in tRPC. Use Better Auth endpoints directly.",
    });

    // Future implementation:
    // const userId = ctx.session.user.id;
    // const sessions = await ctx.db.query.session.findMany({
    //   where: and(
    //     eq(session.userId, userId),
    //     eq(session.revoked, false)
    //   ),
    //   orderBy: [desc(session.createdAt)],
    // });
    // return sanitizeSessions(sessions);
  }),

  /**
   * Get a specific session by ID (only if owned by current user)
   */
  getById: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Auth context not yet implemented in tRPC. Use Better Auth endpoints directly.",
      });

      // Future implementation:
      // const userId = ctx.session.user.id;
      // const owns = await userOwnsSession(input.sessionId, userId);
      //
      // if (!owns) {
      //   throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: "You do not have permission to access this session",
      //   });
      // }
      //
      // const sessionData = await ctx.db.query.session.findFirst({
      //   where: eq(session.id, input.sessionId),
      // });
      //
      // if (!sessionData) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: "Session not found",
      //   });
      // }
      //
      // return sanitizeSession(sessionData);
    }),

  /**
   * Revoke a specific session (logout from one device)
   */
  revokeSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Auth context not yet implemented in tRPC. Use Better Auth endpoints directly.",
      });

      // Future implementation:
      // const userId = ctx.session.user.id;
      // const owns = await userOwnsSession(input.sessionId, userId);
      //
      // if (!owns) {
      //   throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: "You do not have permission to revoke this session",
      //   });
      // }
      //
      // const result = await revokeSession(input.sessionId, "User revoked session");
      //
      // if (!result.success) {
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: result.message || "Failed to revoke session",
      //   });
      // }
      //
      // return { success: true };
    }),

  /**
   * Revoke all sessions except current (logout from all other devices)
   */
  revokeAllOtherSessions: protectedProcedure.mutation(async ({ ctx }) => {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Auth context not yet implemented in tRPC. Use Better Auth endpoints directly.",
    });

    // Future implementation:
    // const userId = ctx.session.user.id;
    // const currentSessionId = ctx.session.id;
    //
    // // Revoke all sessions for this user except the current one
    // const result = await ctx.db
    //   .update(session)
    //   .set({
    //     revoked: true,
    //     revokedAt: new Date(),
    //     revokedReason: "User logged out from all other devices",
    //   })
    //   .where(
    //     and(
    //       eq(session.userId, userId),
    //       ne(session.id, currentSessionId),
    //       eq(session.revoked, false)
    //     )
    //   )
    //   .returning({ id: session.id });
    //
    // return { success: true, count: result.length };
  }),

  /**
   * Admin endpoint: Revoke all sessions for a user (security incident)
   * TODO: Add admin role check
   */
  adminRevokeUserSessions: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Add admin authorization check
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin endpoints not yet implemented",
      });

      // Future implementation:
      // const result = await revokeAllUserSessions(
      //   input.userId,
      //   input.reason || "Admin revocation"
      // );
      //
      // if (!result.success) {
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: result.message || "Failed to revoke sessions",
      //   });
      // }
      //
      // return result;
    }),
});
