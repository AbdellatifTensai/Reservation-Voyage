package com.trainease.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.trainease.dto.LoginRequest;
import com.trainease.dto.UserDTO;
import com.trainease.entity.User;
import com.trainease.service.UserService;

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

@Path("/api/user")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GET
    public Response getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return Response.ok(userDTOs).build();
    }

    @GET
    @Path("/{id}")
    public Response getUserById(@PathParam("id") Long id) {
        Optional<User> userOpt = userService.getUserById(id);
        if (userOpt.isPresent()) {
            return Response.ok(convertToDTO(userOpt.get())).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @POST
    @Path("/register")
    public Response registerUser(UserDTO userDTO) {
        User user = convertToEntity(userDTO);
        
        // Check if username already exists
        if (userService.getUserByUsername(user.getUsername()).isPresent()) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Username already exists")
                    .build();
        }
        
        User createdUser = userService.createUser(user);
        return Response.status(Response.Status.CREATED)
                .entity(convertToDTO(createdUser))
                .build();
    }

    @POST
    @Path("/login")
    public Response login(LoginRequest loginRequest, @Context HttpServletRequest request) {
        boolean authenticated = userService.authenticate(
                loginRequest.getUsername(), 
                loginRequest.getPassword()
        );
        
        if (authenticated) {
            Optional<User> userOpt = userService.getUserByUsername(loginRequest.getUsername());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Create session
                HttpSession session = request.getSession(true);
                session.setAttribute("userId", user.getId());
                session.setAttribute("isAdmin", user.isAdmin());
                
                return Response.ok(convertToDTO(user)).build();
            }
        }
        
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    @POST
    @Path("/logout")
    public Response logout(@Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return Response.ok().build();
    }

    @GET
    @Path("/current")
    public Response getCurrentUser(@Context HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("userId") != null) {
            Long userId = (Long) session.getAttribute("userId");
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isPresent()) {
                return Response.ok(convertToDTO(userOpt.get())).build();
            }
        }
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateUser(@PathParam("id") Long id, UserDTO userDTO, @Context HttpServletRequest request) {
        // Check authentication
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        
        Long currentUserId = (Long) session.getAttribute("userId");
        Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");
        
        // Only admin or the user itself can update the user
        if (!isAdmin && !currentUserId.equals(id)) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Optional<User> existingUserOpt = userService.getUserById(id);
        if (!existingUserOpt.isPresent()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        User existingUser = existingUserOpt.get();
        User updatedUser = convertToEntity(userDTO);
        updatedUser.setId(id);
        
        // If not admin, prevent changing admin status
        if (!isAdmin) {
            updatedUser.setAdmin(existingUser.isAdmin());
        }
        
        userService.updateUser(updatedUser);
        return Response.ok(convertToDTO(updatedUser)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteUser(@PathParam("id") Long id, @Context HttpServletRequest request) {
        // Check if user is admin
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("isAdmin") == null || 
            !(Boolean) session.getAttribute("isAdmin")) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        // Prevent deleting of main admin account
        if (id == 1) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("Cannot delete the main admin account")
                    .build();
        }
        
        boolean deleted = userService.deleteUser(id);
        if (deleted) {
            return Response.ok().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setAdmin(user.isAdmin());
        // Don't set password in DTO for security
        return dto;
    }

    private User convertToEntity(UserDTO dto) {
        User user = new User();
        if (dto.getId() != null) {
            user.setId(dto.getId());
        }
        user.setUsername(dto.getUsername());
        user.setFullName(dto.getFullName());
        user.setPassword(dto.getPassword());
        user.setAdmin(dto.isAdmin());
        return user;
    }
}
