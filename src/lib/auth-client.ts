import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    // baseURL is optional when using the same domain - it will automatically use the current origin
    // This allows the app to work on any port during development
    basePath: "/auth", // Must match the basePath in auth.ts
})


