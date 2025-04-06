import { Request, Response } from 'express';
import { RouteModel } from '../models/routeModel';
import { insertRouteSchema } from '@shared/schema';

export class RouteController {
  static async getAllRoutes(req: Request, res: Response): Promise<void> {
    try {
      const routes = await RouteModel.findAll();
      res.status(200).json(routes);
    } catch (error) {
      console.error('Get all routes error:', error);
      res.status(500).json({ error: 'Server error fetching routes' });
    }
  }

  static async getRouteById(req: Request, res: Response): Promise<void> {
    try {
      const routeId = parseInt(req.params.id);
      if (isNaN(routeId)) {
        res.status(400).json({ error: 'Invalid route ID' });
        return;
      }

      const route = await RouteModel.findById(routeId);
      if (!route) {
        res.status(404).json({ error: 'Route not found' });
        return;
      }

      res.status(200).json(route);
    } catch (error) {
      console.error('Get route by ID error:', error);
      res.status(500).json({ error: 'Server error fetching route' });
    }
  }

  static async createRoute(req: Request, res: Response): Promise<void> {
    try {
      console.log('Create route request body:', req.body);
      
      // Ensure duration is set if it's missing
      if (!req.body.duration) {
        req.body.duration = 120; // Default duration in minutes
      }
      
      // Validate request body
      const validationResult = insertRouteSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.error('Route validation error:', validationResult.error);
        res.status(400).json({ error: 'Invalid route data', details: validationResult.error });
        return;
      }

      const route = await RouteModel.create(req.body);
      res.status(201).json(route);
    } catch (error) {
      console.error('Create route error:', error);
      res.status(500).json({ error: 'Server error creating route' });
    }
  }

  static async updateRoute(req: Request, res: Response): Promise<void> {
    try {
      const routeId = parseInt(req.params.id);
      if (isNaN(routeId)) {
        res.status(400).json({ error: 'Invalid route ID' });
        return;
      }

      // Validate request body (partial)
      const validationResult = insertRouteSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({ error: 'Invalid route data', details: validationResult.error });
        return;
      }

      const updatedRoute = await RouteModel.update(routeId, req.body);
      if (!updatedRoute) {
        res.status(404).json({ error: 'Route not found' });
        return;
      }

      res.status(200).json(updatedRoute);
    } catch (error) {
      console.error('Update route error:', error);
      res.status(500).json({ error: 'Server error updating route' });
    }
  }

  static async deleteRoute(req: Request, res: Response): Promise<void> {
    try {
      const routeId = parseInt(req.params.id);
      if (isNaN(routeId)) {
        res.status(400).json({ error: 'Invalid route ID' });
        return;
      }

      const success = await RouteModel.delete(routeId);
      if (!success) {
        res.status(404).json({ error: 'Route not found' });
        return;
      }

      res.status(204).end();
    } catch (error) {
      console.error('Delete route error:', error);
      res.status(500).json({ error: 'Server error deleting route' });
    }
  }
}