import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NODE_ENV === "production" 
        ? "https://your-domain.com" 
        : "http://localhost:3000",
})


