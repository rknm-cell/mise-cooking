import { vi, expect, describe, it, beforeEach } from "vitest";
import type { CookingSession } from "~/server/db/schema";

// Mock the database
vi.mock("~/server/db", async (importActual) => {
  const actual = await importActual<typeof import("~/server/db")>();
  return {
    ...actual,
    db: {
      query: {
        cookingSession: {
          findFirst: vi.fn(),
          findMany: vi.fn(),
        },
      },
      insert: vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValue([{ id: "test-session-id" }]),
        })),
      })),
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValue([{ success: true }]),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        where: vi.fn().mockResolvedValue({ success: true }),
      })),
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          leftJoin: vi.fn(() => ({
            where: vi.fn(() => ({
              orderBy: vi.fn(() => ({
                limit: vi.fn().mockResolvedValue([]),
              })),
            })),
          })),
        })),
      })),
    },
  };
});

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
import { db } from "~/server/db";

describe("Cooking Session Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSession: CookingSession = {
    id: "test-session-id",
    userId: "user-123",
    recipeId: "recipe-456",
    currentStep: 0,
    status: "active",
    notes: null,
    startedAt: new Date("2024-01-01T10:00:00Z"),
    completedAt: null,
    lastActiveAt: new Date("2024-01-01T10:00:00Z"),
    createdAt: new Date("2024-01-01T10:00:00Z"),
    updatedAt: new Date("2024-01-01T10:00:00Z"),
  };

  describe("createCookingSession", () => {
    it("should create a new cooking session", async () => {
      const result = await createCookingSession("user-123", "recipe-456");

      expect(db.insert).toHaveBeenCalled();
      expect(result).toHaveProperty("session");
      expect(result.session).toHaveProperty("id", "test-session-id");
    });

    it("should handle errors when creating session fails", async () => {
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockRejectedValue(new Error("Database error")),
        returning: vi.fn(),
      } as any);

      const result = await createCookingSession("user-123", "recipe-456");

      expect(result).toHaveProperty("success", false);
      expect(result).toHaveProperty("message");
    });
  });

  describe("getCookingSession", () => {
    it("should return a cooking session by id", async () => {
      vi.mocked(db.query.cookingSession.findFirst).mockResolvedValue(mockSession);

      const result = await getCookingSession("test-session-id");

      expect(db.query.cookingSession.findFirst).toHaveBeenCalled();
      expect(result).toEqual(mockSession);
    });

    it("should return null when session not found", async () => {
      vi.mocked(db.query.cookingSession.findFirst).mockResolvedValue(undefined);

      const result = await getCookingSession("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("getActiveCookingSession", () => {
    it("should return active session for user and recipe", async () => {
      vi.mocked(db.query.cookingSession.findFirst).mockResolvedValue(mockSession);

      const result = await getActiveCookingSession("user-123", "recipe-456");

      expect(db.query.cookingSession.findFirst).toHaveBeenCalled();
      expect(result).toEqual(mockSession);
    });

    it("should return null when no active session exists", async () => {
      vi.mocked(db.query.cookingSession.findFirst).mockResolvedValue(undefined);

      const result = await getActiveCookingSession("user-123", "recipe-456");

      expect(result).toBeNull();
    });
  });

  describe("getUserCookingSessions", () => {
    it("should return all sessions for a user", async () => {
      const mockSessions = [mockSession, { ...mockSession, id: "session-2" }];
      vi.mocked(db.query.cookingSession.findMany).mockResolvedValue(mockSessions);

      const result = await getUserCookingSessions("user-123");

      expect(db.query.cookingSession.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockSessions);
      expect(result).toHaveLength(2);
    });

    it("should filter sessions by status", async () => {
      const completedSession = { ...mockSession, status: "completed" as const };
      vi.mocked(db.query.cookingSession.findMany).mockResolvedValue([completedSession]);

      const result = await getUserCookingSessions("user-123", "completed");

      expect(result).toHaveLength(1);
      expect(result[0]?.status).toBe("completed");
    });
  });

  describe("updateCookingSession", () => {
    it("should update session with new step", async () => {
      const result = await updateCookingSession("test-session-id", {
        currentStep: 2,
      });

      expect(db.update).toHaveBeenCalled();
      expect(result).toHaveProperty("success", true);
    });

    it("should update multiple fields", async () => {
      const result = await updateCookingSession("test-session-id", {
        currentStep: 3,
        notes: "Added extra seasoning",
        status: "paused",
      });

      expect(db.update).toHaveBeenCalled();
      expect(result).toHaveProperty("success", true);
    });

    it("should handle update errors", async () => {
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn(() => ({
          where: vi.fn().mockRejectedValue(new Error("Update failed")),
        })),
      } as any);

      const result = await updateCookingSession("test-session-id", {
        currentStep: 1,
      });

      expect(result).toHaveProperty("success", false);
    });
  });

  describe("completeCookingSession", () => {
    it("should mark session as completed", async () => {
      const result = await completeCookingSession("test-session-id");

      expect(db.update).toHaveBeenCalled();
      expect(result).toHaveProperty("success", true);
    });
  });

  describe("pauseCookingSession", () => {
    it("should mark session as paused", async () => {
      const result = await pauseCookingSession("test-session-id");

      expect(db.update).toHaveBeenCalled();
      expect(result).toHaveProperty("success", true);
    });
  });

  describe("resumeCookingSession", () => {
    it("should mark session as active", async () => {
      const result = await resumeCookingSession("test-session-id");

      expect(db.update).toHaveBeenCalled();
      expect(result).toHaveProperty("success", true);
    });
  });

  describe("abandonCookingSession", () => {
    it("should mark session as abandoned", async () => {
      const result = await abandonCookingSession("test-session-id");

      expect(db.update).toHaveBeenCalled();
      expect(result).toHaveProperty("success", true);
    });
  });

  describe("deleteCookingSession", () => {
    it("should delete a session", async () => {
      vi.mocked(db as any).delete = vi.fn(() => ({
        where: vi.fn().mockResolvedValue({ success: true }),
      }));

      const result = await deleteCookingSession("test-session-id");

      expect(result).toHaveProperty("success", true);
    });

    it("should handle delete errors", async () => {
      vi.mocked(db as any).delete = vi.fn(() => ({
        where: vi.fn().mockRejectedValue(new Error("Delete failed")),
      }));

      const result = await deleteCookingSession("test-session-id");

      expect(result).toHaveProperty("success", false);
    });
  });
});
