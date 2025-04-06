package com.trainease.service;

import com.trainease.entity.Train;
import java.util.List;
import java.util.Optional;

public interface TrainService {
    List<Train> getAllTrains();
    Optional<Train> getTrainById(Long id);
    Train createTrain(Train train);
    void updateTrain(Train train);
    boolean deleteTrain(Long id);
}