import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export const greetingSchema = z.object({
  message: z.string(),
});
export type Greeting = z.infer<typeof greetingSchema>;
