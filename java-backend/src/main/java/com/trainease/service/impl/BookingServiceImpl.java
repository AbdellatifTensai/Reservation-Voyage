package com.trainease.service.impl;

import com.trainease.dao.BookingDAO;
import com.trainease.entity.Booking;
import com.trainease.service.BookingService;

import java.util.List;
import java.util.Optional;

public class BookingServiceImpl implements BookingService {
    
    private final BookingDAO bookingDAO;
    
    public BookingServiceImpl(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }
    
    @Override
    public List<Booking> getAllBookings() {
        return bookingDAO.findAll();
    }
    
    @Override
    public Optional<Booking> getBookingById(Long id) {
        return bookingDAO.findById(id);
    }
    
    @Override
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingDAO.findByUserId(userId);
    }
    
    @Override
    public List<Booking> getBookingsByRouteId(Long routeId) {
        return bookingDAO.findByRouteId(routeId);
    }
    
    @Override
    public Booking createBooking(Booking booking) {
        return bookingDAO.save(booking);
    }
    
    @Override
    public void updateBooking(Booking booking) {
        bookingDAO.update(booking);
    }
    
    @Override
    public boolean cancelBooking(Long id) {
        Optional<Booking> bookingOpt = bookingDAO.findById(id);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setBookingStatus("CANCELLED");
            bookingDAO.update(booking);
            return true;
        }
        return false;
    }
    
    @Override
    public boolean deleteBooking(Long id) {
        return bookingDAO.delete(id);
    }
}
