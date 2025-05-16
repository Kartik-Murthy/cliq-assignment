// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `assignment_${name}`);

export const properties = createTable("property", (d) => ({
  id: d.uuid("id").defaultRandom().primaryKey(),
  name: d.varchar("name", { length: 255 }).notNull(),
  assetType: d.varchar("asset_type", { length: 100 }).notNull(),
  model: d.varchar("model", { length: 255 }).notNull(),
  address: d.varchar("address", { length: 255 }).notNull(),
  city: d.varchar("city", { length: 100 }).notNull(),
  state: d.varchar("state", { length: 50 }).notNull(),
  zip: d.varchar("zip", { length: 20 }).notNull(),
  note: d.text("note"),
  userId: d.varchar("user_id", { length: 255 }).notNull(),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d.timestamp("updated_at").defaultNow().notNull(),
}));
