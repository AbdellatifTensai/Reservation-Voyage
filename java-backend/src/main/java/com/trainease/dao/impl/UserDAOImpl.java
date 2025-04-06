package com.trainease.dao.impl;

import java.util.List;
import java.util.Optional;

import com.trainease.JpaUtil;
import com.trainease.dao.UserDAO;
import com.trainease.entity.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

public class UserDAOImpl implements UserDAO {
    
    @PersistenceContext
    private EntityManager entityManager = JpaUtil.getEntityManager();
    
    @Override
    public List<User> findAll() {
        TypedQuery<User> query = entityManager.createQuery("SELECT u FROM User u", User.class);
        return query.getResultList();
    }
    
    @Override
    public Optional<User> findById(Long id) {
        User user = entityManager.find(User.class, id);
        return Optional.ofNullable(user);
    }
    
    @Override
    public Optional<User> findByUsername(String username) {
        TypedQuery<User> query = entityManager.createQuery(
            "SELECT u FROM User u WHERE u.username = :username", User.class);
        query.setParameter("username", username);
        try {
            return Optional.of(query.getSingleResult());
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public User save(User user) {
        entityManager.getTransaction().begin();
        entityManager.persist(user);
        entityManager.getTransaction().commit();
        return user;
    }
    
    @Override
    public void update(User user) {
        entityManager.getTransaction().begin();
        entityManager.merge(user);
        entityManager.getTransaction().commit();
    }
    
    @Override
    public boolean delete(Long id) {
        entityManager.getTransaction().begin();
        Optional<User> userOpt = findById(id);
        if (userOpt.isPresent()) {
            entityManager.remove(userOpt.get());
            entityManager.getTransaction().commit();
            return true;
        }
        entityManager.getTransaction().rollback();
        return false;
    }
}