package com.trainease.service;

import com.trainease.entity.Route;
import java.util.List;
import java.util.Optional;

public interface RouteService {
    List<Route> getAllRoutes();
    Optional<Route> getRouteById(Long id);
    List<Route> getRoutesByTrainId(Long trainId);
    Route createRoute(Route route);
    void updateRoute(Route route);
    boolean deleteRoute(Long id);
}
