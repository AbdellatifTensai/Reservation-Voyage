import { storage } from '../storage';
import { Train, InsertTrain } from '@shared/schema';

export class TrainModel {
  static async findAll(): Promise<Train[]> {
    return storage.getTrains();
  }

  static async findById(id: number): Promise<Train | undefined> {
    return storage.getTrain(id);
  }

  static async create(trainData: InsertTrain): Promise<Train> {
    return storage.createTrain(trainData);
  }

  static async update(id: number, trainData: Partial<InsertTrain>): Promise<Train | undefined> {
    return storage.updateTrain(id, trainData);
  }

  static async delete(id: number): Promise<boolean> {
    return storage.deleteTrain(id);
  }
}