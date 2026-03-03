import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sanitizeSession,
  sanitizeSessions,
  revokeSession,
  revokeAllUserSessions,
  isSessionValid,
  userOwnsSession,
  type PublicSession,
} from "~/server/session-utils";

describe("Session Security Tests", () => {
  describe("sanitizeSession", () => {
    it("should remove token field from session object", () => {
      const rawSession = {
        id: "session-123",
        userId: "user-456",
        token: "secret-token-12345",
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(),
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        revoked: false,
        revokedAt: null,
        revokedReason: "internal-reason",
      };

      const sanitized = sanitizeSession(rawSession);

      // Verify token is NOT present
      expect(sanitized).not.toHaveProperty("token");

      // Verify revokedReason is NOT present (internal only)
      expect(sanitized).not.toHaveProperty("revokedReason");

      // Verify all public fields ARE present
      expect(sanitized).toHaveProperty("id");
      expect(sanitized).toHaveProperty("userId");
      expect(sanitized).toHaveProperty("createdAt");
      expect(sanitized).toHaveProperty("updatedAt");
      expect(sanitized).toHaveProperty("expiresAt");
      expect(sanitized).toHaveProperty("ipAddress");
      expect(sanitized).toHaveProperty("userAgent");
      expect(sanitized).toHaveProperty("revoked");
      expect(sanitized).toHaveProperty("revokedAt");

      // Verify values are correct
      expect(sanitized.id).toBe("session-123");
      expect(sanitized.userId).toBe("user-456");
      expect(sanitized.ipAddress).toBe("192.168.1.1");
    });

    it("should handle session objects with minimal fields", () => {
      const rawSession = {
        id: "session-789",
        userId: "user-101",
        token: "another-secret-token",
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(),
        ipAddress: null,
        userAgent: null,
        revoked: false,
        revokedAt: null,
      };

      const sanitized = sanitizeSession(rawSession);

      expect(sanitized).not.toHaveProperty("token");
      expect(sanitized.id).toBe("session-789");
      expect(sanitized.ipAddress).toBeNull();
      expect(sanitized.userAgent).toBeNull();
    });
  });

  describe("sanitizeSessions", () => {
    it("should sanitize multiple session objects", () => {
      const rawSessions = [
        {
          id: "session-1",
          userId: "user-1",
          token: "token-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt: new Date(),
          ipAddress: "1.1.1.1",
          userAgent: "Chrome",
          revoked: false,
          revokedAt: null,
        },
        {
          id: "session-2",
          userId: "user-1",
          token: "token-2",
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt: new Date(),
          ipAddress: "2.2.2.2",
          userAgent: "Firefox",
          revoked: false,
          revokedAt: null,
        },
      ];

      const sanitized = sanitizeSessions(rawSessions);

      expect(sanitized).toHaveLength(2);
      sanitized.forEach((session) => {
        expect(session).not.toHaveProperty("token");
        expect(session).toHaveProperty("id");
        expect(session).toHaveProperty("userId");
      });
    });

    it("should return empty array for empty input", () => {
      const sanitized = sanitizeSessions([]);
      expect(sanitized).toEqual([]);
    });
  });

  describe("Token exposure prevention", () => {
    it("should not leak tokens in JSON serialization", () => {
      const rawSession = {
        id: "session-xyz",
        userId: "user-xyz",
        token: "VERY-SECRET-TOKEN",
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(),
        ipAddress: "10.0.0.1",
        userAgent: "Safari",
        revoked: false,
        revokedAt: null,
      };

      const sanitized = sanitizeSession(rawSession);
      const jsonString = JSON.stringify(sanitized);

      // Verify token is not in JSON string
      expect(jsonString).not.toContain("VERY-SECRET-TOKEN");
      expect(jsonString).not.toContain("token");

      // Verify other fields are present
      expect(jsonString).toContain("session-xyz");
      expect(jsonString).toContain("user-xyz");
    });

    it("should maintain type safety for PublicSession", () => {
      const rawSession = {
        id: "session-type-test",
        userId: "user-type-test",
        token: "token-should-not-appear",
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(),
        ipAddress: "127.0.0.1",
        userAgent: "Test Agent",
        revoked: false,
        revokedAt: null,
      };

      const sanitized: PublicSession = sanitizeSession(rawSession);

      // TypeScript should prevent accessing token property
      // @ts-expect-error - token should not exist on PublicSession type
      const tokenAccess = sanitized.token;

      expect(tokenAccess).toBeUndefined();
    });
  });

  describe("Session validation edge cases", () => {
    it("should handle undefined token gracefully", () => {
      const sessionWithoutToken = {
        id: "session-no-token",
        userId: "user-no-token",
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(),
        ipAddress: null,
        userAgent: null,
        revoked: false,
        revokedAt: null,
      };

      const sanitized = sanitizeSession(sessionWithoutToken);

      expect(sanitized).not.toHaveProperty("token");
      expect(sanitized.id).toBe("session-no-token");
    });

    it("should handle sessions with extra unexpected fields", () => {
      const sessionWithExtraFields = {
        id: "session-extra",
        userId: "user-extra",
        token: "token-extra",
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(),
        ipAddress: "8.8.8.8",
        userAgent: "Extra UA",
        revoked: false,
        revokedAt: null,
        revokedReason: "Should be excluded",
        unexpectedField: "This should pass through", // But token should not
      };

      const sanitized = sanitizeSession(sessionWithExtraFields);

      expect(sanitized).not.toHaveProperty("token");
      expect(sanitized).not.toHaveProperty("revokedReason");
      // Unexpected fields pass through (but sensitive ones are excluded)
      expect(sanitized).toHaveProperty("unexpectedField");
    });
  });

  describe("Array handling", () => {
    it("should handle large arrays of sessions without leaking tokens", () => {
      const largeSessions = Array.from({ length: 100 }, (_, i) => ({
        id: `session-${i}`,
        userId: `user-${i}`,
        token: `secret-token-${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(),
        ipAddress: `192.168.1.${i}`,
        userAgent: `Agent-${i}`,
        revoked: false,
        revokedAt: null,
      }));

      const sanitized = sanitizeSessions(largeSessions);

      expect(sanitized).toHaveLength(100);

      // Verify no tokens leaked
      const jsonString = JSON.stringify(sanitized);
      for (let i = 0; i < 100; i++) {
        expect(jsonString).not.toContain(`secret-token-${i}`);
      }

      // Verify structure is maintained
      sanitized.forEach((session, idx) => {
        expect(session.id).toBe(`session-${idx}`);
        expect(session).not.toHaveProperty("token");
      });
    });
  });
});

describe("Session Security Integration", () => {
  it("should demonstrate correct usage pattern", () => {
    // Simulating what a database might return
    const dbResult = {
      id: "real-session-id",
      userId: "real-user-id",
      token: "sha256-hashed-token-abc123",
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-02"),
      expiresAt: new Date("2026-02-01"),
      ipAddress: "203.0.113.42",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      revoked: false,
      revokedAt: null,
    };

    // CORRECT: Always sanitize before returning to client
    const apiResponse = sanitizeSession(dbResult);

    // Verify API response is safe
    expect(apiResponse).not.toHaveProperty("token");

    // This is what the client receives
    const clientData = JSON.parse(JSON.stringify(apiResponse));

    // Client cannot access token
    expect(clientData.token).toBeUndefined();
    expect(clientData.id).toBe("real-session-id");
  });

  it("should demonstrate incorrect usage pattern (anti-pattern)", () => {
    const dbResult = {
      id: "dangerous-session",
      userId: "user-123",
      token: "EXPOSED-TOKEN",
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(),
      ipAddress: "10.0.0.1",
      userAgent: "Chrome",
      revoked: false,
      revokedAt: null,
    };

    // INCORRECT: Returning raw database result
    const unsafeResponse = dbResult;
    const jsonString = JSON.stringify(unsafeResponse);

    // Token is exposed!
    expect(jsonString).toContain("EXPOSED-TOKEN");

    // CORRECT: Use sanitizer
    const safeResponse = sanitizeSession(dbResult);
    const safeJsonString = JSON.stringify(safeResponse);

    // Token is NOT exposed
    expect(safeJsonString).not.toContain("EXPOSED-TOKEN");
  });
});
