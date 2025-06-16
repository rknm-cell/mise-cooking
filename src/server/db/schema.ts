// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {  mysqlTableCreator } from "drizzle-orm/mysql-core";
import type { InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

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
  servings: varchar("servings").notNull(),
  instructions: jsonb("instructions").notNull(),
  ingredients: jsonb("ingredients").notNull(),
  storage: varchar("storage").notNull(),
  nutrition: varchar("nutrition").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type Recipe = InferSelectModel<typeof recipe>;
