import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});