import { z } from "zod";
// DEBUGGING: Using publicProcedure instead of protectedProcedure
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  createCookingSession,
  getCookingSession,
  getActiveCookingSession,
  getUserCookingSessions,
  updateCookingSession,
  completeCookingSession,
  pauseCookingSession,
  resumeCookingSession,
  abandonCookingSession,
  deleteCookingSession,
} from "~/server/db/queries";

export const cookingSessionRouter = createTRPCRouter({
  // Create a new cooking session
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        recipeId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { userId, recipeId } = opts.input;
      return createCookingSession(userId, recipeId);
    }),

  // Get a specific cooking session by ID
  getById: publicProcedure.input(z.string()).query(async (opts) => {
    const sessionId = opts.input;
    return getCookingSession(sessionId);
  }),

  // Get active session for a user/recipe
  getActive: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        recipeId: z.string(),
      }),
    )
    .query(async (opts) => {
      const { userId, recipeId } = opts.input;
      return getActiveCookingSession(userId, recipeId);
    }),

  // Get all sessions for a user
  getUserSessions: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        status: z.string().optional(),
      }),
    )
    .query(async (opts) => {
      const { userId, status } = opts.input;
      return getUserCookingSessions(userId, status);
    }),

  // Update cooking session (step, status, notes)
  update: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        currentStep: z.number().optional(),
        status: z.string().optional(),
        notes: z.string().optional(),
        lastActiveAt: z.date().optional(),
      }),
    )
    .mutation(async (opts) => {
      const { sessionId, ...updates } = opts.input;
      return updateCookingSession(sessionId, updates);
    }),

  // Complete a cooking session
  complete: publicProcedure.input(z.string()).mutation(async (opts) => {
    const sessionId = opts.input;
    return completeCookingSession(sessionId);
  }),

  // Pause a cooking session
  pause: publicProcedure.input(z.string()).mutation(async (opts) => {
    const sessionId = opts.input;
    return pauseCookingSession(sessionId);
  }),

  // Resume a cooking session
  resume: publicProcedure.input(z.string()).mutation(async (opts) => {
    const sessionId = opts.input;
    return resumeCookingSession(sessionId);
  }),

  // Abandon a cooking session
  abandon: publicProcedure.input(z.string()).mutation(async (opts) => {
    const sessionId = opts.input;
    return abandonCookingSession(sessionId);
  }),

  // Delete a cooking session
  delete: publicProcedure.input(z.string()).mutation(async (opts) => {
    const sessionId = opts.input;
    return deleteCookingSession(sessionId);
  }),
});
