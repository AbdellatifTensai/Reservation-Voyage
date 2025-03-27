package reservation_voyage.Controller;

import java.util.Optional;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import reservation_voyage.Metier.User;
import reservation_voyage.Service.LoginService;

@Path("/login")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class LoginController {

    private LoginService loginService = new LoginService();

    @POST
    public Response login(User loginRequest) {
        Optional<User> user = loginService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

        if (user.isPresent()) {
            return Response.ok().entity(user.get()).build();
        } else {
            User newUser = new User();
            newUser.setUsername(loginRequest.getUsername());
            newUser.setPassword(loginRequest.getPassword());
            newUser.setRole("user");

            loginService.saveUser(newUser);
            return Response.ok().entity(newUser).build();
        }
    }
}
