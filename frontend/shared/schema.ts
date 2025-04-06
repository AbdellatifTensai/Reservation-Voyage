import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  isAdmin: true,
});

// Train model
export const trains = pgTable("trains", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  type: text("type").notNull(),
});

export const insertTrainSchema = createInsertSchema(trains).pick({
  name: true,
  capacity: true,
  type: true,
});

// Route model
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  duration: integer("duration").notNull(), // in minutes
  departureTime: text("departure_time").notNull().default("09:00 AM"),
  arrivalTime: text("arrival_time").notNull().default("11:00 AM"),
  price: doublePrecision("price").notNull(),
});

export const insertRouteSchema = createInsertSchema(routes).pick({
  origin: true,
  destination: true,
  duration: true,
  departureTime: true,
  arrivalTime: true,
  price: true,
});

// Booking model
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  trainId: integer("train_id").notNull(),
  routeId: integer("route_id").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  bookingDate: timestamp("booking_date").notNull().defaultNow(),
  journeyDate: timestamp("journey_date").notNull(),
  seats: integer("seats").notNull().default(1),
  status: text("status").notNull().default("confirmed"),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  trainId: true,
  routeId: true,
  departureTime: true,
  journeyDate: true,
  seats: true,
  status: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const trainsRelations = relations(trains, ({ many }) => ({
  bookings: many(bookings),
}));

export const routesRelations = relations(routes, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  train: one(trains, {
    fields: [bookings.trainId],
    references: [trains.id],
  }),
  route: one(routes, {
    fields: [bookings.routeId],
    references: [routes.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Train = typeof trains.$inferSelect;
export type InsertTrain = z.infer<typeof insertTrainSchema>;

export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
