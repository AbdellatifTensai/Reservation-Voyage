import { storage } from '../storage';
import { User, InsertUser } from '@shared/schema';

export class UserModel {
  static async findById(id: number): Promise<User | undefined> {
    return storage.getUser(id);
  }

  static async findByUsername(username: string): Promise<User | undefined> {
    return storage.getUserByUsername(username);
  }

  static async create(userData: InsertUser): Promise<User> {
    return storage.createUser(userData);
  }
}