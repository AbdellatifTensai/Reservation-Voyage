import { Request, Response } from 'express';
import { BookingModel } from '../models/bookingModel';
import { insertBookingSchema } from '@shared/schema';

export class BookingController {
  static async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await BookingModel.findAll();
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Get all bookings error:', error);
      res.status(500).json({ error: 'Server error fetching bookings' });
    }
  }

  static async getBookingsByUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated() || !req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      console.log('Fetching bookings for user:', req.user.id);
      const userId = req.user.id;
      const bookings = await BookingModel.findByUserId(userId);
      console.log('Bookings found:', bookings.length);
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Get bookings by user error:', error);
      res.status(500).json({ error: 'Server error fetching user bookings' });
    }
  }

  static async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated() || !req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const bookingId = parseInt(req.params.id);
      if (isNaN(bookingId)) {
        res.status(400).json({ error: 'Invalid booking ID' });
        return;
      }

      const booking = await BookingModel.findById(bookingId);
      if (!booking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      // Check if user is authorized to view this booking
      if (!req.user.isAdmin && booking.userId !== req.user.id) {
        res.status(403).json({ error: 'Not authorized to view this booking' });
        return;
      }

      res.status(200).json(booking);
    } catch (error) {
      console.error('Get booking by ID error:', error);
      res.status(500).json({ error: 'Server error fetching booking' });
    }
  }

  static async createBooking(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated() || !req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      console.log('Creating booking with data:', req.body);
      
      // Parse the departure time
      const departureTime = new Date(req.body.departureTime || new Date());
      
      // Create the actual booking in the database
      const bookingData = {
        userId: req.user.id,
        trainId: req.body.trainId || 1,
        routeId: req.body.routeId || 1,
        departureTime: departureTime,
        journeyDate: departureTime, // Use the same date for journey date
        seats: req.body.seats || 1,
        status: "confirmed"
      };
      
      console.log('Prepared booking data:', bookingData);
      
      // Validate booking data
      const validationResult = insertBookingSchema.safeParse(bookingData);
      if (!validationResult.success) {
        console.error('Booking validation error:', validationResult.error);
        res.status(400).json({ error: 'Invalid booking data', details: validationResult.error });
        return;
      }
      
      const booking = await BookingModel.create(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ error: 'Server error creating booking' });
    }
  }

  static async updateBooking(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated() || !req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const bookingId = parseInt(req.params.id);
      if (isNaN(bookingId)) {
        res.status(400).json({ error: 'Invalid booking ID' });
        return;
      }

      // Check if booking exists
      const existingBooking = await BookingModel.findById(bookingId);
      if (!existingBooking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      // Check if user is authorized to update this booking
      if (!req.user.isAdmin && existingBooking.userId !== req.user.id) {
        res.status(403).json({ error: 'Not authorized to update this booking' });
        return;
      }

      // Validate request body (partial)
      const validationResult = insertBookingSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({ error: 'Invalid booking data', details: validationResult.error });
        return;
      }

      const updatedBooking = await BookingModel.update(bookingId, req.body);
      res.status(200).json(updatedBooking);
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({ error: 'Server error updating booking' });
    }
  }

  static async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated() || !req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const bookingId = parseInt(req.params.id);
      if (isNaN(bookingId)) {
        res.status(400).json({ error: 'Invalid booking ID' });
        return;
      }

      // Check if booking exists
      const existingBooking = await BookingModel.findById(bookingId);
      if (!existingBooking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      // Check if user is authorized to cancel this booking
      if (!req.user.isAdmin && existingBooking.userId !== req.user.id) {
        res.status(403).json({ error: 'Not authorized to cancel this booking' });
        return;
      }

      const success = await BookingModel.cancel(bookingId);
      if (!success) {
        res.status(500).json({ error: 'Failed to cancel booking' });
        return;
      }

      res.status(200).json({ message: 'Booking canceled successfully' });
    } catch (error) {
      console.error('Cancel booking error:', error);
      res.status(500).json({ error: 'Server error canceling booking' });
    }
  }
}