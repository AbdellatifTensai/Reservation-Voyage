package com.trainease.controller;

import com.trainease.dto.RouteDTO;
import com.trainease.entity.Route;
import com.trainease.service.RouteService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Path("/api/routes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GET
    public Response getAllRoutes() {
        List<Route> routes = routeService.getAllRoutes();
        List<RouteDTO> routeDTOs = routes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return Response.ok(routeDTOs).build();
    }

    @GET
    @Path("/{id}")
    public Response getRouteById(@PathParam("id") Long id) {
        Optional<Route> routeOpt = routeService.getRouteById(id);
        if (routeOpt.isPresent()) {
            return Response.ok(convertToDTO(routeOpt.get())).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @GET
    @Path("/train/{trainId}")
    public Response getRoutesByTrainId(@PathParam("trainId") Long trainId) {
        List<Route> routes = routeService.getRoutesByTrainId(trainId);
        List<RouteDTO> routeDTOs = routes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return Response.ok(routeDTOs).build();
    }

    @POST
    public Response createRoute(RouteDTO routeDTO, @Context HttpServletRequest request) {
        // Check if user is admin
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("isAdmin") == null || 
            !(Boolean) session.getAttribute("isAdmin")) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Route route = convertToEntity(routeDTO);
        Route createdRoute = routeService.createRoute(route);
        return Response.status(Response.Status.CREATED)
                .entity(convertToDTO(createdRoute))
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response updateRoute(@PathParam("id") Long id, RouteDTO routeDTO, @Context HttpServletRequest request) {
        // Check if user is admin
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("isAdmin") == null || 
            !(Boolean) session.getAttribute("isAdmin")) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Optional<Route> existingRouteOpt = routeService.getRouteById(id);
        if (!existingRouteOpt.isPresent()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        Route route = convertToEntity(routeDTO);
        route.setId(id);
        
        routeService.updateRoute(route);
        return Response.ok(convertToDTO(route)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteRoute(@PathParam("id") Long id, @Context HttpServletRequest request) {
        // Check if user is admin
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("isAdmin") == null || 
            !(Boolean) session.getAttribute("isAdmin")) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        boolean deleted = routeService.deleteRoute(id);
        if (deleted) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    private RouteDTO convertToDTO(Route route) {
        RouteDTO dto = new RouteDTO();
        dto.setId(route.getId());
        dto.setTrainId(route.getTrain().getId());
        dto.setDepartureStation(route.getDepartureStation());
        dto.setArrivalStation(route.getArrivalStation());
        dto.setDepartureTime(route.getDepartureTime());
        dto.setArrivalTime(route.getArrivalTime());
        dto.setPrice(route.getPrice());
        return dto;
    }

    private Route convertToEntity(RouteDTO dto) {
        Route route = new Route();
        if (dto.getId() != null) {
            route.setId(dto.getId());
        }
        // Note: We don't set the train here since we need the TrainService to get it.
        // This should be handled in the service layer.
        route.setDepartureStation(dto.getDepartureStation());
        route.setArrivalStation(dto.getArrivalStation());
        route.setDepartureTime(dto.getDepartureTime());
        route.setArrivalTime(dto.getArrivalTime());
        route.setPrice(dto.getPrice());
        return route;
    }
}
