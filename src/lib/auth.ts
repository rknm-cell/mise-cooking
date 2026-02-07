import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~/server/db";
import { env } from "~/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/auth",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // No email verification for now
    passwordMinLength: 8,
    passwordMaxLength: 128,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    rememberMe: true, // Enable remember me functionality
  },
  plugins: [nextCookies()],
  callbacks: {
    onSignIn: async ({ user, account }) => {
      // Track sign-in for analytics
      console.log(`User ${user.email} signed in via ${account?.providerId || 'email'}`);
      return true;
    },
    onSignUp: async ({ user }) => {
      // Initialize user preferences and history
      console.log(`New user registered: ${user.email}`);
      // New users will be redirected to onboarding in the login flow
      return true;
    },
  },
});
