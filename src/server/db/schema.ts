// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {  mysqlTableCreator } from "drizzle-orm/mysql-core";
import type { InferSelectModel } from "drizzle-orm";
import { integer, jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import {z} from "zod/v4"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `RecipeApp_${name}`);

export const recipe = pgTable("Recipe", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  totalTime: varchar("total_time").notNull(),
  servings: integer("servings").notNull(),
  ingredients: varchar("ingredients").array().notNull(),
  instructions: varchar("instructions").array().notNull(),
  storage: varchar("storage").notNull(),
  nutrition: varchar("nutrition").array().notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type Recipe = InferSelectModel<typeof recipe>;


export const recipeObject = z.object({
  id: z.string(),
  name: z.string(),
  totalTime: z.string(),
  servings: z.number(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  storage: z.string(),
  nutrition: z.array(z.string())
})

export type RecipeSchema = z.infer<typeof recipeObject>