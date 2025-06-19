import { z } from 'zod';
import { procedure, router } from '../trpc';
import { recipe } from '../db/schema';
import { recipeRouter } from './recipe';

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  recipe: recipeRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;