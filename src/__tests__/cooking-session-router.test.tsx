import { vi, expect, describe, it, beforeEach } from "vitest";
import { cookingSessionRouter } from "~/server/api/routers/cookingSession";
import * as queries from "~/server/db/queries";

// Mock all the query functions
vi.mock("~/server/db/queries", () => ({
  createCookingSession: vi.fn(),
  getCookingSession: vi.fn(),
  getActiveCookingSession: vi.fn(),
  getUserCookingSessions: vi.fn(),
  updateCookingSession: vi.fn(),
  completeCookingSession: vi.fn(),
  pauseCookingSession: vi.fn(),
  resumeCookingSession: vi.fn(),
  abandonCookingSession: vi.fn(),
  deleteCookingSession: vi.fn(),
}));

describe("Cooking Session Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSession = {
    id: "session-123",
    userId: "user-456",
    recipeId: "recipe-789",
    currentStep: 0,
    status: "active",
    notes: null,
    startedAt: new Date(),
    completedAt: null,
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("create procedure", () => {
    it("should create a new cooking session", async () => {
      const mockResult = { success: true, session: mockSession };
      vi.mocked(queries.createCookingSession).mockResolvedValue(mockResult);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.create({
        userId: "user-456",
        recipeId: "recipe-789",
      });

      expect(queries.createCookingSession).toHaveBeenCalledWith(
        "user-456",
        "recipe-789"
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe("getById procedure", () => {
    it("should retrieve a session by id", async () => {
      vi.mocked(queries.getCookingSession).mockResolvedValue(mockSession);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.getById("session-123");

      expect(queries.getCookingSession).toHaveBeenCalledWith("session-123");
      expect(result).toEqual(mockSession);
    });

    it("should return null for non-existent session", async () => {
      vi.mocked(queries.getCookingSession).mockResolvedValue(null);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.getById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("getActive procedure", () => {
    it("should get active session for user and recipe", async () => {
      vi.mocked(queries.getActiveCookingSession).mockResolvedValue(mockSession);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.getActive({
        userId: "user-456",
        recipeId: "recipe-789",
      });

      expect(queries.getActiveCookingSession).toHaveBeenCalledWith(
        "user-456",
        "recipe-789"
      );
      expect(result).toEqual(mockSession);
    });
  });

  describe("getUserSessions procedure", () => {
    it("should retrieve all sessions for a user", async () => {
      const mockSessions = [mockSession, { ...mockSession, id: "session-456" }];
      vi.mocked(queries.getUserCookingSessions).mockResolvedValue(mockSessions);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.getUserSessions({
        userId: "user-456",
      });

      expect(queries.getUserCookingSessions).toHaveBeenCalledWith(
        "user-456",
        undefined
      );
      expect(result).toEqual(mockSessions);
      expect(result).toHaveLength(2);
    });

    it("should filter sessions by status", async () => {
      const completedSession = { ...mockSession, status: "completed" };
      vi.mocked(queries.getUserCookingSessions).mockResolvedValue([
        completedSession,
      ]);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.getUserSessions({
        userId: "user-456",
        status: "completed",
      });

      expect(queries.getUserCookingSessions).toHaveBeenCalledWith(
        "user-456",
        "completed"
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("update procedure", () => {
    it("should update session current step", async () => {
      const mockResult = { success: true };
      vi.mocked(queries.updateCookingSession).mockResolvedValue(mockResult);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.update({
        sessionId: "session-123",
        currentStep: 2,
      });

      expect(queries.updateCookingSession).toHaveBeenCalledWith("session-123", {
        currentStep: 2,
      });
      expect(result).toEqual(mockResult);
    });

    it("should update multiple fields", async () => {
      const mockResult = { success: true };
      vi.mocked(queries.updateCookingSession).mockResolvedValue(mockResult);

      const testDate = new Date();
      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.update({
        sessionId: "session-123",
        currentStep: 3,
        notes: "Test notes",
        lastActiveAt: testDate,
      });

      expect(queries.updateCookingSession).toHaveBeenCalledWith("session-123", {
        currentStep: 3,
        notes: "Test notes",
        lastActiveAt: testDate,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe("complete procedure", () => {
    it("should mark session as completed", async () => {
      const mockResult = { success: true };
      vi.mocked(queries.completeCookingSession).mockResolvedValue(mockResult);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.complete("session-123");

      expect(queries.completeCookingSession).toHaveBeenCalledWith("session-123");
      expect(result).toEqual(mockResult);
    });
  });

  describe("pause procedure", () => {
    it("should pause a session", async () => {
      const mockResult = { success: true };
      vi.mocked(queries.pauseCookingSession).mockResolvedValue(mockResult);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.pause("session-123");

      expect(queries.pauseCookingSession).toHaveBeenCalledWith("session-123");
      expect(result).toEqual(mockResult);
    });
  });

  describe("resume procedure", () => {
    it("should resume a paused session", async () => {
      const mockResult = { success: true };
      vi.mocked(queries.resumeCookingSession).mockResolvedValue(mockResult);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.resume("session-123");

      expect(queries.resumeCookingSession).toHaveBeenCalledWith("session-123");
      expect(result).toEqual(mockResult);
    });
  });

  describe("abandon procedure", () => {
    it("should abandon a session", async () => {
      const mockResult = { success: true };
      vi.mocked(queries.abandonCookingSession).mockResolvedValue(mockResult);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.abandon("session-123");

      expect(queries.abandonCookingSession).toHaveBeenCalledWith("session-123");
      expect(result).toEqual(mockResult);
    });
  });

  describe("delete procedure", () => {
    it("should delete a session", async () => {
      const mockResult = { success: true };
      vi.mocked(queries.deleteCookingSession).mockResolvedValue(mockResult);

      const caller = cookingSessionRouter.createCaller({} as any);
      const result = await caller.delete("session-123");

      expect(queries.deleteCookingSession).toHaveBeenCalledWith("session-123");
      expect(result).toEqual(mockResult);
    });
  });
});
