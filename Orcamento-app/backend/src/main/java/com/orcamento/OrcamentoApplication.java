package com.orcamento;

import com.orcamento.service.AuthService;
import com.orcamento.service.CostFactorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrcamentoApplication implements CommandLineRunner {

    @Autowired
    private CostFactorsService costFactorsService;
    
    @Autowired
    private AuthService authService;

    public static void main(String[] args) {
        SpringApplication.run(OrcamentoApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize default cost factors
        costFactorsService.getCurrentFactors();
        
        // Initialize default admin user
        authService.initializeDefaultAdmin();
        
        System.out.println("✅ Orçamento App started successfully!");
        System.out.println("📊 Default cost factors initialized");
        System.out.println("👤 Default admin user created (admin/1234)");
    }
} 