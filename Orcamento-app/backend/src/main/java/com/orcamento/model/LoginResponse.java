package com.orcamento.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    
    private boolean success;
    private String message;
    private String token;
    
    public static LoginResponse success(String token) {
        return new LoginResponse(true, "Login successful", token);
    }
    
    public static LoginResponse failure(String message) {
        return new LoginResponse(false, message, null);
    }
} 