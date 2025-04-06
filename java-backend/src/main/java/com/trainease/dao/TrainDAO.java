package com.trainease.dao;

import com.trainease.entity.Train;
import java.util.List;
import java.util.Optional;

public interface TrainDAO {
    List<Train> findAll();
    Optional<Train> findById(Long id);
    Train save(Train train);
    void update(Train train);
    boolean delete(Long id);
}