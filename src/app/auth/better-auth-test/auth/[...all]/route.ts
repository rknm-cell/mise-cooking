import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";
import { env } from "~/env";

// Create a minimal better-auth instance for testing with proper env vars
const testAuth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: { 
    enabled: true,
  },
});

// Export the handlers
export const { POST, GET } = toNextJsHandler(testAuth); 