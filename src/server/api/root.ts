
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { recipeRouter } from "./routers/recipe";
import { shoppingRouter } from "./routers/shopping";
import { cookingSessionRouter } from "./routers/cookingSession";
import { sessionRouter } from "./routers/session";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // post: postRouter,

  recipe: recipeRouter,
  shopping: shoppingRouter,
  cookingSession: cookingSessionRouter,
  session: sessionRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
