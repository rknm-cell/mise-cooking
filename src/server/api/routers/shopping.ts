import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { 
  getShoppingLists,
  createShoppingList,
  deleteShoppingList,
  getShoppingListItems,
  getAllShoppingListItems,
  addShoppingListItem,
  updateShoppingListItem,
  deleteShoppingListItem,
  generateShoppingListFromRecipe,
  clearCompletedShoppingItems
} from "~/server/db/queries";

export const shoppingRouter = createTRPCRouter({
  // Shopping List queries
  getShoppingLists: protectedProcedure.input(z.string()).query(async (opts) => {
    const { input: userId } = opts;
    const lists = await getShoppingLists(userId);
    return lists;
  }),

  createShoppingList: protectedProcedure
    .input(z.object({
      userId: z.string(),
      name: z.string(),
    }))
    .mutation(async (opts) => {
      const { userId, name } = opts.input;
      const result = await createShoppingList(userId, name);
      return result;
    }),

  deleteShoppingList: protectedProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const { input: listId } = opts;
      const result = await deleteShoppingList(listId);
      return result;
    }),

  getShoppingListItems: protectedProcedure.input(z.string()).query(async (opts) => {
    const { input: listId } = opts;
    const items = await getShoppingListItems(listId);
    return items;
  }),

  getAllShoppingListItems: protectedProcedure.input(z.string()).query(async (opts) => {
    const { input: userId } = opts;
    const items = await getAllShoppingListItems(userId);
    return items;
  }),

  addShoppingListItem: protectedProcedure
    .input(z.object({
      listId: z.string(),
      name: z.string(),
      quantity: z.string(),
      unit: z.string().optional(),
      category: z.string().optional(),
    }))
    .mutation(async (opts) => {
      const { listId, name, quantity, unit, category } = opts.input;
      const result = await addShoppingListItem(listId, name, quantity, unit, category);
      return result;
    }),

  updateShoppingListItem: protectedProcedure
    .input(z.object({
      itemId: z.string(),
      updates: z.object({
        name: z.string().optional(),
        quantity: z.string().optional(),
        unit: z.string().optional(),
        category: z.string().optional(),
        isCompleted: z.boolean().optional(),
      }),
    }))
    .mutation(async (opts) => {
      const { itemId, updates } = opts.input;
      const result = await updateShoppingListItem(itemId, updates);
      return result;
    }),

  deleteShoppingListItem: protectedProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const { input: itemId } = opts;
      const result = await deleteShoppingListItem(itemId);
      return result;
    }),

  generateShoppingListFromRecipe: protectedProcedure
    .input(z.object({
      recipeId: z.string(),
      userId: z.string(),
      listName: z.string().optional(),
    }))
    .mutation(async (opts) => {
      const { recipeId, userId, listName } = opts.input;
      const result = await generateShoppingListFromRecipe(recipeId, userId, listName);
      return result;
    }),

  clearCompletedShoppingItems: protectedProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const { input: userId } = opts;
      const result = await clearCompletedShoppingItems(userId);
      return result;
    }),
}); 