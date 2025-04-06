import { users, type User, type InsertUser, trains, type Train, type InsertTrain, routes, type Route, type InsertRoute, bookings, type Booking, type InsertBooking } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import pg from "pg";

// Create a pg pool instance for the session store
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
  
  // Train methods
  getTrains(): Promise<Train[]>;
  getTrain(id: number): Promise<Train | undefined>;
  createTrain(train: InsertTrain): Promise<Train>;
  updateTrain(id: number, train: Partial<InsertTrain>): Promise<Train | undefined>;
  deleteTrain(id: number): Promise<boolean>;
  
  // Route methods
  getRoutes(): Promise<Route[]>;
  getRoute(id: number): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  updateRoute(id: number, route: Partial<InsertRoute>): Promise<Route | undefined>;
  deleteRoute(id: number): Promise<boolean>;
  
  // Booking methods
  getBookings(): Promise<Booking[]>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  cancelBooking(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool: pgPool,
      createTableIfMissing: true,
      tableName: 'session'
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    // First, delete any bookings associated with this user
    await db.delete(bookings).where(eq(bookings.userId, id));
    // Then delete the user
    const result = await db.delete(users).where(eq(users.id, id));
    return result.count > 0;
  }
  
  // Train methods
  async getTrains(): Promise<Train[]> {
    return await db.select().from(trains);
  }
  
  async getTrain(id: number): Promise<Train | undefined> {
    const [train] = await db.select().from(trains).where(eq(trains.id, id));
    return train || undefined;
  }
  
  async createTrain(train: InsertTrain): Promise<Train> {
    const [newTrain] = await db.insert(trains).values(train).returning();
    return newTrain;
  }
  
  async updateTrain(id: number, trainUpdate: Partial<InsertTrain>): Promise<Train | undefined> {
    const [updatedTrain] = await db
      .update(trains)
      .set(trainUpdate)
      .where(eq(trains.id, id))
      .returning();
    return updatedTrain || undefined;
  }
  
  async deleteTrain(id: number): Promise<boolean> {
    const result = await db.delete(trains).where(eq(trains.id, id));
    return result.count > 0;
  }
  
  // Route methods
  async getRoutes(): Promise<Route[]> {
    return await db.select().from(routes);
  }
  
  async getRoute(id: number): Promise<Route | undefined> {
    const [route] = await db.select().from(routes).where(eq(routes.id, id));
    return route || undefined;
  }
  
  async createRoute(route: InsertRoute): Promise<Route> {
    const [newRoute] = await db.insert(routes).values(route).returning();
    return newRoute;
  }
  
  async updateRoute(id: number, routeUpdate: Partial<InsertRoute>): Promise<Route | undefined> {
    const [updatedRoute] = await db
      .update(routes)
      .set(routeUpdate)
      .where(eq(routes.id, id))
      .returning();
    return updatedRoute || undefined;
  }
  
  async deleteRoute(id: number): Promise<boolean> {
    const result = await db.delete(routes).where(eq(routes.id, id));
    return result.count > 0;
  }
  
  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }
  
  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }
  
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }
  
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values({
      ...booking,
      // bookingDate will be set to defaultNow by the database
    }).returning();
    return newBooking;
  }
  
  async updateBooking(id: number, bookingUpdate: Partial<InsertBooking>): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set(bookingUpdate)
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }
  
  async cancelBooking(id: number): Promise<boolean> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(eq(bookings.id, id))
      .returning();
    return !!updatedBooking;
  }
}

export const storage = new DatabaseStorage();
