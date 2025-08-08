package com.orcamento.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "budget_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    private String clientName;
    
    @NotNull
    private String clientEmail;
    
    private String clientPhone;
    
    @NotNull
    @Positive
    private Double area;
    
    @NotNull
    private String wallType;
    
    @NotNull
    private String finishQuality;
    
    @NotNull
    private String wallFinish;
    
    @NotNull
    @Positive
    private Double frameArea;
    
    @NotNull
    @Positive
    private Integer bathrooms;
    
    @NotNull
    @Positive
    private Double floorArea;
    
    @NotNull
    @Positive
    private Double ceilingArea;
    
    @NotNull
    private String ceilingType;
    
    @NotNull
    private String roofType;
    
    @NotNull
    @Positive
    private Double roofArea;
    
    @NotNull
    private String foundationType;
    
    @NotNull
    @Positive
    private Double wastePercentage;
    
    @NotNull
    @Positive
    private Double totalBudget;
    
    @NotNull
    private LocalDateTime createdAt;
    
    private String status = "PENDENTE"; // PENDENTE, APROVADO, REJEITADO
    
    private String notes;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 