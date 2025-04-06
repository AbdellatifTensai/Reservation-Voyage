import { storage } from '../storage';
import { Booking, InsertBooking } from '@shared/schema';

export class BookingModel {
  static async findAll(): Promise<Booking[]> {
    return storage.getBookings();
  }

  static async findByUserId(userId: number): Promise<Booking[]> {
    return storage.getBookingsByUser(userId);
  }

  static async findById(id: number): Promise<Booking | undefined> {
    return storage.getBooking(id);
  }

  static async create(bookingData: InsertBooking): Promise<Booking> {
    return storage.createBooking(bookingData);
  }

  static async update(id: number, bookingData: Partial<InsertBooking>): Promise<Booking | undefined> {
    return storage.updateBooking(id, bookingData);
  }

  static async cancel(id: number): Promise<boolean> {
    return storage.cancelBooking(id);
  }
}