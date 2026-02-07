import { vi, expect, describe, it, beforeEach } from "vitest";

vi.mock("~/server/db", async (importActual) => {
  const actual = await importActual<typeof import("~/server/db")>();
  return {
    ...actual,
    db: {
      query: {
        user: {
          findFirst: vi.fn(),
        },
        userPreferences: {
          findFirst: vi.fn(),
        },
      },
      insert: vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn(),
          })),
        })),
      })),
    },
  };
});

import {
  getUserById,
  getUserPreferences,
  createUserPreferences,
  updateUserPreferences,
  checkOnboardingStatus,
} from "~/server/db/queries";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema";

describe("User Auth Queries", () => {
  describe("getUserById", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should return a user when found by id", async () => {
      const mockUser = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        emailVerified: true,
        image: "https://example.com/avatar.jpg",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      };

      vi.mocked(db.query.user.findFirst).mockResolvedValue(mockUser);

      const result = await getUserById("user-123");

      expect(db.query.user.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
      expect(result).toHaveProperty("id", "user-123");
      expect(result).toHaveProperty("email", "john@example.com");
      expect(result).toHaveProperty("name", "John Doe");
    });

    it("should return null when user is not found", async () => {
      vi.mocked(db.query.user.findFirst).mockResolvedValue(undefined);

      const result = await getUserById("non-existent-user");

      expect(db.query.user.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it("should return null and log error when database query fails", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(db.query.user.findFirst).mockRejectedValue(
        new Error("Database error")
      );

      const result = await getUserById("user-123");

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching user user-123:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("getUserPreferences", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should return user preferences when found", async () => {
      const mockPreferences = {
        id: "pref-123",
        userId: "user-123",
        dietaryRestrictions: ["vegetarian", "gluten-free"],
        allergies: ["peanuts"],
        favoriteCuisines: ["italian", "mexican"],
        skillLevel: "intermediate",
        spiceTolerance: "medium",
        maxCookingTime: 45,
        preferredServingSize: 4,
        availableEquipment: ["oven", "stovetop", "blender"],
        mealPrepFriendly: true,
        quickMealsOnly: false,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date("2024-01-05"),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      };

      vi.mocked(db.query.userPreferences.findFirst).mockResolvedValue(
        mockPreferences
      );

      const result = await getUserPreferences("user-123");

      expect(db.query.userPreferences.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPreferences);
      expect(result?.userId).toBe("user-123");
      expect(result?.dietaryRestrictions).toContain("vegetarian");
      expect(result?.onboardingCompleted).toBe(true);
    });

    it("should return null when preferences not found", async () => {
      vi.mocked(db.query.userPreferences.findFirst).mockResolvedValue(
        undefined
      );

      const result = await getUserPreferences("user-no-prefs");

      expect(db.query.userPreferences.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it("should return null and log error when database query fails", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(db.query.userPreferences.findFirst).mockRejectedValue(
        new Error("Database connection lost")
      );

      const result = await getUserPreferences("user-123");

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching user preferences for user-123:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("createUserPreferences", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should create user preferences successfully", async () => {
      const userId = "user-123";
      const preferencesData = {
        dietaryRestrictions: ["vegan"],
        allergies: ["shellfish", "dairy"],
        favoriteCuisines: ["thai", "indian"],
        skillLevel: "beginner",
        spiceTolerance: "hot",
        maxCookingTime: 30,
        preferredServingSize: 2,
        availableEquipment: ["microwave", "stovetop"],
        mealPrepFriendly: false,
        quickMealsOnly: true,
      };

      const mockCreatedPreferences = {
        id: "pref-new-123",
        userId: "user-123",
        ...preferencesData,
        onboardingCompleted: false,
        onboardingCompletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReturning = vi.fn().mockResolvedValue([mockCreatedPreferences]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      vi.mocked(db.insert).mockReturnValue({ values: mockValues } as any);

      const result = await createUserPreferences(userId, preferencesData);

      expect(db.insert).toHaveBeenCalledWith(schema.userPreferences);
      expect(mockValues).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.preferences).toEqual(mockCreatedPreferences);
      expect(result.preferences?.userId).toBe(userId);
      expect(result.preferences?.onboardingCompleted).toBe(false);
    });

    it("should handle partial preferences data", async () => {
      const userId = "user-456";
      const partialPreferences = {
        dietaryRestrictions: ["pescatarian"],
        skillLevel: "advanced",
      };

      const mockCreatedPreferences = {
        id: "pref-new-456",
        userId: "user-456",
        dietaryRestrictions: ["pescatarian"],
        allergies: undefined,
        favoriteCuisines: undefined,
        skillLevel: "advanced",
        spiceTolerance: undefined,
        maxCookingTime: undefined,
        preferredServingSize: undefined,
        availableEquipment: undefined,
        mealPrepFriendly: undefined,
        quickMealsOnly: undefined,
        onboardingCompleted: false,
        onboardingCompletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReturning = vi.fn().mockResolvedValue([mockCreatedPreferences]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      vi.mocked(db.insert).mockReturnValue({ values: mockValues } as any);

      const result = await createUserPreferences(userId, partialPreferences);

      expect(result.success).toBe(true);
      expect(result.preferences?.skillLevel).toBe("advanced");
    });

    it("should handle errors when creating preferences fails", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const userId = "user-789";
      const preferences = { skillLevel: "beginner" };

      const mockError = new Error("Unique constraint violation");
      const mockReturning = vi.fn().mockRejectedValue(mockError);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      vi.mocked(db.insert).mockReturnValue({ values: mockValues } as any);

      const result = await createUserPreferences(userId, preferences);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Unique constraint violation");
      expect(result.preferences).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error creating user preferences:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("updateUserPreferences", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should update user preferences successfully", async () => {
      const userId = "user-123";
      const updates = {
        skillLevel: "advanced",
        maxCookingTime: 60,
        favoriteCuisines: ["japanese", "korean"],
      };

      const mockUpdatedPreferences = {
        id: "pref-123",
        userId: "user-123",
        dietaryRestrictions: ["vegetarian"],
        allergies: [],
        favoriteCuisines: ["japanese", "korean"],
        skillLevel: "advanced",
        spiceTolerance: "medium",
        maxCookingTime: 60,
        preferredServingSize: 4,
        availableEquipment: ["oven", "stovetop"],
        mealPrepFriendly: true,
        quickMealsOnly: false,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date("2024-01-05"),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
      };

      const mockReturning = vi.fn().mockResolvedValue([mockUpdatedPreferences]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      vi.mocked(db.update).mockReturnValue({ set: mockSet } as any);

      const result = await updateUserPreferences(userId, updates);

      expect(db.update).toHaveBeenCalledWith(schema.userPreferences);
      expect(result.success).toBe(true);
      expect(result.preferences).toEqual(mockUpdatedPreferences);
      expect(result.preferences?.skillLevel).toBe("advanced");
      expect(result.preferences?.maxCookingTime).toBe(60);
    });

    it("should update onboarding status and set completion timestamp", async () => {
      const userId = "user-456";
      const updates = {
        onboardingCompleted: true,
        dietaryRestrictions: ["vegan"],
      };

      const mockUpdatedPreferences = {
        id: "pref-456",
        userId: "user-456",
        dietaryRestrictions: ["vegan"],
        allergies: [],
        favoriteCuisines: [],
        skillLevel: "beginner",
        spiceTolerance: "medium",
        maxCookingTime: null,
        preferredServingSize: 2,
        availableEquipment: [],
        mealPrepFriendly: false,
        quickMealsOnly: false,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
      };

      const mockReturning = vi.fn().mockResolvedValue([mockUpdatedPreferences]);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      vi.mocked(db.update).mockReturnValue({ set: mockSet } as any);

      const result = await updateUserPreferences(userId, updates);

      expect(result.success).toBe(true);
      expect(result.preferences?.onboardingCompleted).toBe(true);
      expect(result.preferences?.onboardingCompletedAt).toBeInstanceOf(Date);
    });

    it("should handle errors when updating preferences fails", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const userId = "user-789";
      const updates = { skillLevel: "expert" };

      const mockError = new Error("Record not found");
      const mockReturning = vi.fn().mockRejectedValue(mockError);
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning });
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      vi.mocked(db.update).mockReturnValue({ set: mockSet } as any);

      const result = await updateUserPreferences(userId, updates);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Record not found");
      expect(result.preferences).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error updating user preferences:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("checkOnboardingStatus", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should return true when onboarding is completed", async () => {
      const mockPreferences = {
        id: "pref-123",
        userId: "user-123",
        dietaryRestrictions: [],
        allergies: [],
        favoriteCuisines: [],
        skillLevel: "beginner",
        spiceTolerance: "medium",
        maxCookingTime: null,
        preferredServingSize: 2,
        availableEquipment: [],
        mealPrepFriendly: false,
        quickMealsOnly: false,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date("2024-01-05"),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      };

      vi.mocked(db.query.userPreferences.findFirst).mockResolvedValue(
        mockPreferences
      );

      const result = await checkOnboardingStatus("user-123");

      expect(result).toBe(true);
    });

    it("should return false when onboarding is not completed", async () => {
      const mockPreferences = {
        id: "pref-456",
        userId: "user-456",
        dietaryRestrictions: [],
        allergies: [],
        favoriteCuisines: [],
        skillLevel: "beginner",
        spiceTolerance: "medium",
        maxCookingTime: null,
        preferredServingSize: 2,
        availableEquipment: [],
        mealPrepFriendly: false,
        quickMealsOnly: false,
        onboardingCompleted: false,
        onboardingCompletedAt: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      vi.mocked(db.query.userPreferences.findFirst).mockResolvedValue(
        mockPreferences
      );

      const result = await checkOnboardingStatus("user-456");

      expect(result).toBe(false);
    });

    it("should return false when preferences do not exist", async () => {
      vi.mocked(db.query.userPreferences.findFirst).mockResolvedValue(
        undefined
      );

      const result = await checkOnboardingStatus("user-new");

      expect(result).toBe(false);
    });

    it("should return false and log error when database query fails", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(db.query.userPreferences.findFirst).mockRejectedValue(
        new Error("Connection timeout")
      );

      const result = await checkOnboardingStatus("user-123");

      expect(result).toBe(false);
      // checkOnboardingStatus calls getUserPreferences internally, which logs its own error
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching user preferences for user-123:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
