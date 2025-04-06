package com.trainease.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.trainease.dao.impl.TrainDAOImpl;
import com.trainease.dto.TrainDTO;
import com.trainease.entity.Train;
import com.trainease.service.TrainService;
import com.trainease.service.impl.TrainServiceImpl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/trains")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TrainController {

    private TrainService trainService = new TrainServiceImpl(new TrainDAOImpl());

    @GET
    public Response getAllTrains() {
        List<Train> trains = trainService.getAllTrains();
        List<TrainDTO> trainDTOs = trains.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return Response.ok(trainDTOs).build();
    }

    @GET
    @Path("/{id}")
    public Response getTrainById(@PathParam("id") Long id) {
        Optional<Train> trainOpt = trainService.getTrainById(id);
        if (trainOpt.isPresent()) {
            return Response.ok(convertToDTO(trainOpt.get())).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @POST
    public Response createTrain(TrainDTO trainDTO, @Context HttpServletRequest request) {
        // Check if user is admin
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("isAdmin") == null || 
            !(Boolean) session.getAttribute("isAdmin")) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Train train = convertToEntity(trainDTO);
        Train createdTrain = trainService.createTrain(train);
        return Response.status(Response.Status.CREATED)
                .entity(convertToDTO(createdTrain))
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response updateTrain(@PathParam("id") Long id, TrainDTO trainDTO, @Context HttpServletRequest request) {
        // Check if user is admin
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("isAdmin") == null || 
            !(Boolean) session.getAttribute("isAdmin")) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Optional<Train> existingTrainOpt = trainService.getTrainById(id);
        if (!existingTrainOpt.isPresent()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        Train train = convertToEntity(trainDTO);
        train.setId(id);
        
        trainService.updateTrain(train);
        return Response.ok(convertToDTO(train)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteTrain(@PathParam("id") Long id, @Context HttpServletRequest request) {
        // Check if user is admin
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("isAdmin") == null || 
            !(Boolean) session.getAttribute("isAdmin")) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        boolean deleted = trainService.deleteTrain(id);
        if (deleted) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    private TrainDTO convertToDTO(Train train) {
        TrainDTO dto = new TrainDTO();
        dto.setId(train.getId());
        dto.setName(train.getName());
        dto.setType(train.getType());
        dto.setCapacity(train.getCapacity());
        return dto;
    }

    private Train convertToEntity(TrainDTO dto) {
        Train train = new Train();
        if (dto.getId() != null) {
            train.setId(dto.getId());
        }
        train.setName(dto.getName());
        train.setType(dto.getType());
        train.setCapacity(dto.getCapacity());
        return train;
    }
}
