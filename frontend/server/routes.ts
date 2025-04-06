import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTrainSchema, insertRouteSchema, insertBookingSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { TrainController } from "./controllers/trainController";
import { RouteController } from "./controllers/routeController";
import { BookingController } from "./controllers/bookingController";
import { BookingModel } from "./models/bookingModel";
import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "../shared/schema";
import { createProxyMiddleware } from 'http-proxy-middleware';

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is an admin
const isAdmin = (req: Request, res: Response, next: any) => {
  if (req.isAuthenticated() && req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: Admin access required" });
};

async function seedInitialData() {
  try {
    // Check if admin exists
    const adminUser = await storage.getUserByUsername("admin");
    
    if (!adminUser) {
      // Hash password using the same method as in auth.ts
      const salt = randomBytes(16).toString("hex");
      const buf = (await promisify(scrypt)("admin", salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString("hex")}.${salt}`;
      
      // Create admin user
      await storage.createUser({
        username: "admin",
        password: hashedPassword,
        fullName: "Admin User",
        isAdmin: true
      });
      
      console.log("Admin user created successfully");
    }
    
    // Add sample trains if none exist
    const trains = await storage.getTrains();
    if (trains.length === 0) {
      const sampleTrains = [
        { name: "Express 101", capacity: 200, type: "Express" },
        { name: "Local 202", capacity: 150, type: "Local" },
        { name: "Bullet 303", capacity: 300, type: "Bullet" }
      ];
      
      for (const train of sampleTrains) {
        await storage.createTrain(train);
      }
      
      console.log("Sample trains created successfully");
    }
    
    // Add sample routes if none exist
    const routes = await storage.getRoutes();
    if (routes.length === 0) {
      const sampleRoutes = [
        { 
          origin: "New York", 
          destination: "Boston", 
          duration: 240, 
          departureTime: "09:00 AM", 
          arrivalTime: "01:00 PM", 
          price: 45.99 
        },
        { 
          origin: "Boston", 
          destination: "Washington DC", 
          duration: 360, 
          departureTime: "10:30 AM", 
          arrivalTime: "04:30 PM", 
          price: 65.50 
        },
        { 
          origin: "Washington DC", 
          destination: "Chicago", 
          duration: 720, 
          departureTime: "08:15 AM", 
          arrivalTime: "08:15 PM", 
          price: 120.75 
        },
        { 
          origin: "Chicago", 
          destination: "Los Angeles", 
          duration: 2160, 
          departureTime: "07:00 AM", 
          arrivalTime: "07:00 AM", 
          price: 250.00 
        },
        { 
          origin: "Los Angeles", 
          destination: "San Francisco", 
          duration: 380, 
          departureTime: "02:00 PM", 
          arrivalTime: "08:20 PM", 
          price: 89.99 
        }
      ];
      
      for (const route of sampleRoutes) {
        await storage.createRoute(route);
      }
      
      console.log("Sample routes created successfully");
    }
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Seed initial data
  await seedInitialData();
  
  // Setup proxy to Java backend
  const javaApiProxy = createProxyMiddleware({
    target: 'http://localhost:8080/api',
    pathRewrite: {
      '^/java-api': ''
    },
    changeOrigin: true
  });
  
  // Register the Java API proxy
  app.use('/java-api', javaApiProxy);
  
  // Helper function to transform object properties
  function transformObject(obj: any) {
    if (!obj) return obj;
    
    const newObj = { ...obj };
    if (newObj.admin !== undefined) {
      newObj.isAdmin = newObj.admin;
      delete newObj.admin;
    }
    return newObj;
  }

  // Train routes
  app.get("/api/trains", TrainController.getAllTrains);
  app.get("/api/trains/:id", TrainController.getTrainById);
  app.post("/api/trains", isAdmin, TrainController.createTrain);
  app.put("/api/trains/:id", isAdmin, TrainController.updateTrain);
  app.delete("/api/trains/:id", isAdmin, TrainController.deleteTrain);

  // Route routes
  app.get("/api/routes", RouteController.getAllRoutes);
  app.get("/api/routes/:id", RouteController.getRouteById);
  app.post("/api/routes", isAdmin, RouteController.createRoute);
  app.put("/api/routes/:id", isAdmin, RouteController.updateRoute);
  app.patch("/api/routes/:id", isAdmin, RouteController.updateRoute);
  app.delete("/api/routes/:id", isAdmin, RouteController.deleteRoute);

  // Booking routes
  app.get("/api/bookings", isAuthenticated, BookingController.getBookingsByUser);
  app.get("/api/bookings/:id", isAuthenticated, BookingController.getBookingById);
  app.post("/api/bookings", isAuthenticated, BookingController.createBooking);
  app.put("/api/bookings/:id", isAuthenticated, BookingController.updateBooking);
  app.post("/api/bookings/:id/cancel", isAuthenticated, BookingController.cancelBooking);

  // User management routes
  app.get("/api/users", isAdmin, async (req, res) => {
    try {
      const users = await db.select().from(schema.users);
      
      // Remove password for security
      const safeUsers = users.map(user => ({
        ...user,
        password: undefined
      }));
      
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.patch("/api/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { isAdmin: makeAdmin } = req.body;
      
      // Don't allow modifying the first admin account
      if (userId === 1) {
        return res.status(403).json({ message: "Cannot modify the main administrator account" });
      }
      
      const [updatedUser] = await db.update(schema.users)
        .set({ isAdmin: makeAdmin })
        .where(eq(schema.users.id, userId))
        .returning();
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password for security
      const safeUser = {
        ...updatedUser,
        password: undefined
      };
      
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // Delete user route
  app.delete("/api/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Don't allow deleting the first admin account
      if (userId === 1) {
        return res.status(403).json({ message: "Cannot delete the main administrator account" });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Delete the user and its associated bookings
      const success = await storage.deleteUser(userId);
      
      if (success) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete user" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
