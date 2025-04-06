package com.trainease.controller;

import com.trainease.dto.BookingDTO;
import com.trainease.entity.Booking;
import com.trainease.service.BookingService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Path("/api/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GET
    public Response getAllBookings(@Context HttpServletRequest request) {
        // Check if user is admin
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("isAdmin") == null || 
            !(Boolean) session.getAttribute("isAdmin")) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<Booking> bookings = bookingService.getAllBookings();
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return Response.ok(bookingDTOs).build();
    }

    @GET
    @Path("/{id}")
    public Response getBookingById(@PathParam("id") Long id, @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        
        Optional<Booking> bookingOpt = bookingService.getBookingById(id);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            
            // Check if user is admin or the owner of the booking
            Long userId = (Long) session.getAttribute("userId");
            Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");
            
            if (!isAdmin && !booking.getUser().getId().equals(userId)) {
                return Response.status(Response.Status.FORBIDDEN).build();
            }
            
            return Response.ok(convertToDTO(booking)).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @GET
    @Path("/user")
    public Response getBookingsByUser(@Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        
        Long userId = (Long) session.getAttribute("userId");
        List<Booking> bookings = bookingService.getBookingsByUserId(userId);
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return Response.ok(bookingDTOs).build();
    }

    @POST
    public Response createBooking(BookingDTO bookingDTO, @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        
        Long userId = (Long) session.getAttribute("userId");
        
        // Set the userId from the session
        bookingDTO.setUserId(userId);
        
        Booking booking = convertToEntity(bookingDTO);
        Booking createdBooking = bookingService.createBooking(booking);
        return Response.status(Response.Status.CREATED)
                .entity(convertToDTO(createdBooking))
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response updateBooking(@PathParam("id") Long id, BookingDTO bookingDTO, @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        
        Optional<Booking> existingBookingOpt = bookingService.getBookingById(id);
        if (!existingBookingOpt.isPresent()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        Booking existingBooking = existingBookingOpt.get();
        
        // Check if user is admin or the owner of the booking
        Long userId = (Long) session.getAttribute("userId");
        Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");
        
        if (!isAdmin && !existingBooking.getUser().getId().equals(userId)) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Booking booking = convertToEntity(bookingDTO);
        booking.setId(id);
        
        bookingService.updateBooking(booking);
        return Response.ok(convertToDTO(booking)).build();
    }

    @POST
    @Path("/{id}/cancel")
    public Response cancelBooking(@PathParam("id") Long id, @Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        
        Optional<Booking> bookingOpt = bookingService.getBookingById(id);
        if (!bookingOpt.isPresent()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        Booking booking = bookingOpt.get();
        
        // Check if user is admin or the owner of the booking
        Long userId = (Long) session.getAttribute("userId");
        Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");
        
        if (!isAdmin && !booking.getUser().getId().equals(userId)) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        boolean cancelled = bookingService.cancelBooking(id);
        if (cancelled) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Failed to cancel booking")
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deleteBooking(@PathParam("id") Long id, @Context HttpServletRequest request) {
        // Only admin can delete bookings
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("isAdmin") == null || 
            !(Boolean) session.getAttribute("isAdmin")) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        boolean deleted = bookingService.deleteBooking(id);
        if (deleted) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setRouteId(booking.getRoute().getId());
        dto.setSeats(booking.getSeats());
        dto.setBookingDate(booking.getBookingDate());
        dto.setBookingStatus(booking.getBookingStatus());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setTotalPrice(booking.getTotalPrice());
        return dto;
    }

    private Booking convertToEntity(BookingDTO dto) {
        Booking booking = new Booking();
        if (dto.getId() != null) {
            booking.setId(dto.getId());
        }
        // Note: We don't set the user and route here since we need the services to get them.
        // This should be handled in the service layer.
        booking.setSeats(dto.getSeats());
        booking.setBookingDate(dto.getBookingDate());
        booking.setBookingStatus(dto.getBookingStatus());
        booking.setPaymentStatus(dto.getPaymentStatus());
        booking.setTotalPrice(dto.getTotalPrice());
        return booking;
    }
}
