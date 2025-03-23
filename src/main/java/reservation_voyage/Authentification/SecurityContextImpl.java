package reservation_voyage.Authentification;

import jakarta.ws.rs.core.SecurityContext;
import reservation_voyage.Metier.Role;

import java.security.Principal;

public class SecurityContextImpl implements SecurityContext {

    private String username;
    private Role role;

    public SecurityContextImpl(String username, Role role2) {
        this.username = username;
        this.role = role2;
    }

    @Override
    public Principal getUserPrincipal() {
        return () -> username;
    }

    @Override
    public boolean isUserInRole(String role) {
        return this.role.name().equalsIgnoreCase(role);
    }

    @Override
    public boolean isSecure() {
        return false;
    }

    @Override
    public String getAuthenticationScheme() {
        return "BASIC_AUTH";
    }

}
