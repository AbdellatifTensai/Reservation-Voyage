package com.trainease.dao.impl;

import java.util.List;
import java.util.Optional;

import com.trainease.JpaUtil;
import com.trainease.dao.TrainDAO;
import com.trainease.entity.Train;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

public class TrainDAOImpl implements TrainDAO {
    
    @PersistenceContext
    private EntityManager entityManager = JpaUtil.getEntityManager();
    
    @Override
    public List<Train> findAll() {
        TypedQuery<Train> query = entityManager.createQuery("SELECT t FROM Train t", Train.class);
        return query.getResultList();
    }
    
    @Override
    public Optional<Train> findById(Long id) {
        Train train = entityManager.find(Train.class, id);
        return Optional.ofNullable(train);
    }
    
    @Override
    public Train save(Train train) {
        entityManager.getTransaction().begin();
        entityManager.persist(train);
        entityManager.getTransaction().commit();
        return train;
    }
    
    @Override
    public void update(Train train) {
        entityManager.getTransaction().begin();
        entityManager.merge(train);
        entityManager.getTransaction().commit();
    }
    
    @Override
    public boolean delete(Long id) {
        entityManager.getTransaction().begin();
        Optional<Train> trainOpt = findById(id);
        if (trainOpt.isPresent()) {
            entityManager.remove(trainOpt.get());
            entityManager.getTransaction().commit();
            return true;
        }
        entityManager.getTransaction().rollback();
        return false;
    }
}