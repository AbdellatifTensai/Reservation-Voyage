import { storage } from '../storage';
import { Route, InsertRoute } from '@shared/schema';

export class RouteModel {
  static async findAll(): Promise<Route[]> {
    return storage.getRoutes();
  }

  static async findById(id: number): Promise<Route | undefined> {
    return storage.getRoute(id);
  }

  static async create(routeData: InsertRoute): Promise<Route> {
    return storage.createRoute(routeData);
  }

  static async update(id: number, routeData: Partial<InsertRoute>): Promise<Route | undefined> {
    return storage.updateRoute(id, routeData);
  }

  static async delete(id: number): Promise<boolean> {
    return storage.deleteRoute(id);
  }
}