package com.trainease.dao.impl;

import java.util.List;
import java.util.Optional;

import com.trainease.JpaUtil;
import com.trainease.dao.RouteDAO;
import com.trainease.entity.Route;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

public class RouteDAOImpl implements RouteDAO {
    
    @PersistenceContext
    private EntityManager entityManager = JpaUtil.getEntityManager();
    
    @Override
    public List<Route> findAll() {
        TypedQuery<Route> query = entityManager.createQuery("SELECT r FROM Route r", Route.class);
        return query.getResultList();
    }
    
    @Override
    public Optional<Route> findById(Long id) {
        Route route = entityManager.find(Route.class, id);
        return Optional.ofNullable(route);
    }
    
    @Override
    public List<Route> findByTrainId(Long trainId) {
        TypedQuery<Route> query = entityManager.createQuery(
            "SELECT r FROM Route r WHERE r.train.id = :trainId", Route.class);
        query.setParameter("trainId", trainId);
        return query.getResultList();
    }
    
    @Override
    public Route save(Route route) {
        entityManager.getTransaction().begin();
        entityManager.persist(route);
        entityManager.getTransaction().commit();
        return route;
    }
    
    @Override
    public void update(Route route) {
        entityManager.getTransaction().begin();
        entityManager.merge(route);
        entityManager.getTransaction().commit();
    }
    
    @Override
    public boolean delete(Long id) {
        entityManager.getTransaction().begin();
        Optional<Route> routeOpt = findById(id);
        if (routeOpt.isPresent()) {
            entityManager.remove(routeOpt.get());
            entityManager.getTransaction().commit();
            return true;
        }
        entityManager.getTransaction().rollback();
        return false;
    }
}