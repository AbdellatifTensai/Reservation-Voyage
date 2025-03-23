package reservation_voyage.Authentification;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}