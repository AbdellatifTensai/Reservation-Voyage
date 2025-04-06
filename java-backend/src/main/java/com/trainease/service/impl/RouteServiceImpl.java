package com.trainease.service.impl;

import com.trainease.dao.RouteDAO;
import com.trainease.entity.Route;
import com.trainease.service.RouteService;

import java.util.List;
import java.util.Optional;

public class RouteServiceImpl implements RouteService {
    
    private final RouteDAO routeDAO;
    
    public RouteServiceImpl(RouteDAO routeDAO) {
        this.routeDAO = routeDAO;
    }
    
    @Override
    public List<Route> getAllRoutes() {
        return routeDAO.findAll();
    }
    
    @Override
    public Optional<Route> getRouteById(Long id) {
        return routeDAO.findById(id);
    }
    
    @Override
    public List<Route> getRoutesByTrainId(Long trainId) {
        return routeDAO.findByTrainId(trainId);
    }
    
    @Override
    public Route createRoute(Route route) {
        return routeDAO.save(route);
    }
    
    @Override
    public void updateRoute(Route route) {
        routeDAO.update(route);
    }
    
    @Override
    public boolean deleteRoute(Long id) {
        return routeDAO.delete(id);
    }
}
