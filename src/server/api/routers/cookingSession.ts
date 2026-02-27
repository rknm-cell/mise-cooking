import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
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
  create: protectedProcedure
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
  getById: protectedProcedure.input(z.string()).query(async (opts) => {
    const sessionId = opts.input;
    return getCookingSession(sessionId);
  }),

  // Get active session for a user/recipe
  getActive: protectedProcedure
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
  getUserSessions: protectedProcedure
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
  update: protectedProcedure
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
  complete: protectedProcedure.input(z.string()).mutation(async (opts) => {
    const sessionId = opts.input;
    return completeCookingSession(sessionId);
  }),

  // Pause a cooking session
  pause: protectedProcedure.input(z.string()).mutation(async (opts) => {
    const sessionId = opts.input;
    return pauseCookingSession(sessionId);
  }),

  // Resume a cooking session
  resume: protectedProcedure.input(z.string()).mutation(async (opts) => {
    const sessionId = opts.input;
    return resumeCookingSession(sessionId);
  }),

  // Abandon a cooking session
  abandon: protectedProcedure.input(z.string()).mutation(async (opts) => {
    const sessionId = opts.input;
    return abandonCookingSession(sessionId);
  }),

  // Delete a cooking session
  delete: protectedProcedure.input(z.string()).mutation(async (opts) => {
    const sessionId = opts.input;
    return deleteCookingSession(sessionId);
  }),
});
