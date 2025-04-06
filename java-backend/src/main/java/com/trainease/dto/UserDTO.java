package com.trainease.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String fullName;
    
    @JsonProperty("isAdmin")
    private boolean admin;
    
    private String password;
    private String username;
}
