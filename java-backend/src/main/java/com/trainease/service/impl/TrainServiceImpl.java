package com.trainease.service.impl;

import com.trainease.dao.TrainDAO;
import com.trainease.entity.Train;
import com.trainease.service.TrainService;

import java.util.List;
import java.util.Optional;

public class TrainServiceImpl implements TrainService {
    
    private final TrainDAO trainDAO;
    
    public TrainServiceImpl(TrainDAO trainDAO) {
        this.trainDAO = trainDAO;
    }
    
    @Override
    public List<Train> getAllTrains() {
        return trainDAO.findAll();
    }
    
    @Override
    public Optional<Train> getTrainById(Long id) {
        return trainDAO.findById(id);
    }
    
    @Override
    public Train createTrain(Train train) {
        return trainDAO.save(train);
    }
    
    @Override
    public void updateTrain(Train train) {
        trainDAO.update(train);
    }
    
    @Override
    public boolean deleteTrain(Long id) {
        return trainDAO.delete(id);
    }
}
