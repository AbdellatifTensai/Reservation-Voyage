package com.trainease.dao.impl;

import com.trainease.JpaUtil;
import com.trainease.dao.BookingDAO;
import com.trainease.entity.Booking;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

public class BookingDAOImpl implements BookingDAO {
    
    @PersistenceContext
    private EntityManager entityManager = JpaUtil.getEntityManager();
    
    @Override
    public List<Booking> findAll() {
        TypedQuery<Booking> query = entityManager.createQuery("SELECT b FROM Booking b", Booking.class);
        return query.getResultList();
    }
    
    @Override
    public Optional<Booking> findById(Long id) {
        Booking booking = entityManager.find(Booking.class, id);
        return Optional.ofNullable(booking);
    }
    
    @Override
    public List<Booking> findByUserId(Long userId) {
        TypedQuery<Booking> query = entityManager.createQuery(
            "SELECT b FROM Booking b WHERE b.user.id = :userId", Booking.class);
        query.setParameter("userId", userId);
        return query.getResultList();
    }
    
    @Override
    public List<Booking> findByRouteId(Long routeId) {
        TypedQuery<Booking> query = entityManager.createQuery(
            "SELECT b FROM Booking b WHERE b.route.id = :routeId", Booking.class);
        query.setParameter("routeId", routeId);
        return query.getResultList();
    }
    
    @Override
    public Booking save(Booking booking) {
        entityManager.getTransaction().begin();
        entityManager.persist(booking);
        entityManager.getTransaction().commit();
        return booking;
    }
    
    @Override
    public void update(Booking booking) {
        entityManager.getTransaction().begin();
        entityManager.merge(booking);
        entityManager.getTransaction().commit();
    }
    
    @Override
    public boolean delete(Long id) {
        entityManager.getTransaction().begin();
        Optional<Booking> bookingOpt = findById(id);
        if (bookingOpt.isPresent()) {
            entityManager.remove(bookingOpt.get());
            entityManager.getTransaction().commit();
            return true;
        }
        entityManager.getTransaction().rollback();
        return false;
    }
}