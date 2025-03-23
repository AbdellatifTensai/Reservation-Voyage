package reservation_voyage.Controller;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import reservation_voyage.Authentification.AuthResponse;
import reservation_voyage.Authentification.LoginRequest;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class LoginController {

    @POST
    @Path("/login")
    public Response login(LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        if ("admin".equals(username) && "password".equals(password)) {
            String token = "dummy-jwt-token";
            return Response.ok(new AuthResponse(token)).build();
        }

        return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid credentials").build();
    }
}
