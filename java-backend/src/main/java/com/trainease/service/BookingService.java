package com.trainease.service;

import com.trainease.entity.Booking;
import java.util.List;
import java.util.Optional;

public interface BookingService {
    List<Booking> getAllBookings();
    Optional<Booking> getBookingById(Long id);
    List<Booking> getBookingsByUserId(Long userId);
    List<Booking> getBookingsByRouteId(Long routeId);
    Booking createBooking(Booking booking);
    void updateBooking(Booking booking);
    boolean cancelBooking(Long id);
    boolean deleteBooking(Long id);
}
