package com.orcamento.controller;

import com.orcamento.model.LoginRequest;
import com.orcamento.model.LoginResponse;
import com.orcamento.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:9002"})
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String actualToken = token.substring(7);
            authService.logout(actualToken);
        }
        return ResponseEntity.ok("Logged out successfully");
    }
    
    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String actualToken = token.substring(7);
            boolean isValid = authService.validateToken(actualToken);
            return ResponseEntity.ok(isValid);
        }
        return ResponseEntity.ok(false);
    }
} 