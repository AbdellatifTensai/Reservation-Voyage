package com.trainease.dao;

import com.trainease.entity.Booking;
import java.util.List;
import java.util.Optional;

public interface BookingDAO {
    List<Booking> findAll();
    Optional<Booking> findById(Long id);
    List<Booking> findByUserId(Long userId);
    List<Booking> findByRouteId(Long routeId);
    Booking save(Booking booking);
    void update(Booking booking);
    boolean delete(Long id);
}