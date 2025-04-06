package com.trainease.dao;

import com.trainease.entity.Route;
import java.util.List;
import java.util.Optional;

public interface RouteDAO {
    List<Route> findAll();
    Optional<Route> findById(Long id);
    List<Route> findByTrainId(Long trainId);
    Route save(Route route);
    void update(Route route);
    boolean delete(Long id);
}