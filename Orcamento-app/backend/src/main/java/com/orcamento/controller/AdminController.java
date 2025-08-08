package com.orcamento.controller;

import com.orcamento.model.CostFactors;
import com.orcamento.service.CostFactorsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:9002"})
public class AdminController {
    
    @Autowired
    private CostFactorsService costFactorsService;
    
    @GetMapping("/cost-factors")
    public ResponseEntity<CostFactors> getCostFactors() {
        try {
            CostFactors factors = costFactorsService.getCurrentFactors();
            return ResponseEntity.ok(factors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/cost-factors")
    public ResponseEntity<CostFactors> updateCostFactors(@Valid @RequestBody CostFactors factors) {
        try {
            CostFactors updatedFactors = costFactorsService.updateFactors(factors);
            return ResponseEntity.ok(updatedFactors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 