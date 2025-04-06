import { Request, Response } from 'express';
import { TrainModel } from '../models/trainModel';
import { insertTrainSchema } from '@shared/schema';

export class TrainController {
  static async getAllTrains(req: Request, res: Response): Promise<void> {
    try {
      const trains = await TrainModel.findAll();
      res.status(200).json(trains);
    } catch (error) {
      console.error('Get all trains error:', error);
      res.status(500).json({ error: 'Server error fetching trains' });
    }
  }

  static async getTrainById(req: Request, res: Response): Promise<void> {
    try {
      const trainId = parseInt(req.params.id);
      if (isNaN(trainId)) {
        res.status(400).json({ error: 'Invalid train ID' });
        return;
      }

      const train = await TrainModel.findById(trainId);
      if (!train) {
        res.status(404).json({ error: 'Train not found' });
        return;
      }

      res.status(200).json(train);
    } catch (error) {
      console.error('Get train by ID error:', error);
      res.status(500).json({ error: 'Server error fetching train' });
    }
  }

  static async createTrain(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validationResult = insertTrainSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({ error: 'Invalid train data', details: validationResult.error });
        return;
      }

      const train = await TrainModel.create(req.body);
      res.status(201).json(train);
    } catch (error) {
      console.error('Create train error:', error);
      res.status(500).json({ error: 'Server error creating train' });
    }
  }

  static async updateTrain(req: Request, res: Response): Promise<void> {
    try {
      const trainId = parseInt(req.params.id);
      if (isNaN(trainId)) {
        res.status(400).json({ error: 'Invalid train ID' });
        return;
      }

      // Validate request body (partial)
      const validationResult = insertTrainSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({ error: 'Invalid train data', details: validationResult.error });
        return;
      }

      const updatedTrain = await TrainModel.update(trainId, req.body);
      if (!updatedTrain) {
        res.status(404).json({ error: 'Train not found' });
        return;
      }

      res.status(200).json(updatedTrain);
    } catch (error) {
      console.error('Update train error:', error);
      res.status(500).json({ error: 'Server error updating train' });
    }
  }

  static async deleteTrain(req: Request, res: Response): Promise<void> {
    try {
      const trainId = parseInt(req.params.id);
      if (isNaN(trainId)) {
        res.status(400).json({ error: 'Invalid train ID' });
        return;
      }

      const success = await TrainModel.delete(trainId);
      if (!success) {
        res.status(404).json({ error: 'Train not found' });
        return;
      }

      res.status(204).end();
    } catch (error) {
      console.error('Delete train error:', error);
      res.status(500).json({ error: 'Server error deleting train' });
    }
  }
}