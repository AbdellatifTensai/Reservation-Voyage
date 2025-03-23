package reservation_voyage.Authentification;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.ext.Provider;
import reservation_voyage.Metier.Role;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Provider
public class AuthFilter implements ContainerRequestFilter {
    private static final Map<String, Role> tokenToRoleMap = new HashMap<>();

    static {
        tokenToRoleMap.put("admin-token", Role.ADMIN);
        tokenToRoleMap.put("user-token", Role.USER);
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String authHeader = requestContext.getHeaderString("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length());
            Role role = tokenToRoleMap.getOrDefault(token, Role.USER);

            requestContext.setSecurityContext(new SecurityContextImpl("user", role));
        }
    }
}
