import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { insertUserSchema } from '@shared/schema';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class UserController {
  static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }

  static async comparePasswords(supplied: string, stored: string): Promise<boolean> {
    const [hashed, salt] = stored.split('.');
    const hashedBuf = Buffer.from(hashed, 'hex');
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validationResult = insertUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({ error: 'Invalid user data', details: validationResult.error });
        return;
      }

      // Check if username already exists
      const existingUser = await UserModel.findByUsername(req.body.username);
      if (existingUser) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }

      // Hash password
      const hashedPassword = await UserController.hashPassword(req.body.password);

      // Create user
      const user = await UserModel.create({
        ...req.body,
        password: hashedPassword,
      });

      // Log in the user
      req.login(user, (err) => {
        if (err) {
          res.status(500).json({ error: 'Login failed after registration' });
          return;
        }
        
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  }

  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { password, ...userWithoutPassword } = req.user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: 'Server error fetching user data' });
    }
  }
}