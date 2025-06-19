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
  },
  plugins: [nextCookies()],
  // Temporarily remove database adapter to test basic functionality
  // adapter: postgresAdapter(env.DATABASE_URL),
});
