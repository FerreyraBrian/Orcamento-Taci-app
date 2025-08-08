package com.orcamento.service;

import com.orcamento.model.AdminUser;
import com.orcamento.model.LoginRequest;
import com.orcamento.model.LoginResponse;
import com.orcamento.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {
    
    @Autowired
    private AdminUserRepository adminUserRepository;
    
    // Simple in-memory token storage (in production, use Redis or JWT)
    private final ConcurrentHashMap<String, String> activeTokens = new ConcurrentHashMap<>();
    
    public LoginResponse login(LoginRequest request) {
        try {
            AdminUser user = adminUserRepository.findByUsernameAndActiveTrue(request.getUsername())
                    .orElse(null);
            
            if (user == null) {
                return LoginResponse.failure("Invalid username or password");
            }
            
            // Simple password comparison (in production, use BCrypt)
            if (!user.getPassword().equals(request.getPassword())) {
                return LoginResponse.failure("Invalid username or password");
            }
            
            // Generate simple token
            String token = UUID.randomUUID().toString();
            activeTokens.put(token, user.getUsername());
            
            return LoginResponse.success(token);
            
        } catch (Exception e) {
            return LoginResponse.failure("Login failed: " + e.getMessage());
        }
    }
    
    public boolean validateToken(String token) {
        return activeTokens.containsKey(token);
    }
    
    public String getUsernameFromToken(String token) {
        return activeTokens.get(token);
    }
    
    public void logout(String token) {
        activeTokens.remove(token);
    }
    
    public void initializeDefaultAdmin() {
        if (adminUserRepository.findByUsername("admin").isEmpty()) {
            AdminUser adminUser = new AdminUser();
            adminUser.setUsername("admin");
            adminUser.setPassword("1234");
            adminUser.setActive(true);
            adminUserRepository.save(adminUser);
        }
    }
} 