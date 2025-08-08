package com.orcamento.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "cost_factors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CostFactors {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Wall Type Multipliers
    @NotNull @Positive
    private Double alvenariaMultiplier = 1.0;
    
    @NotNull @Positive
    private Double drywallMultiplier = 0.8;
    
    @NotNull @Positive
    private Double steelFrameMultiplier = 1.2;
    
    // Finish Quality Multipliers
    @NotNull @Positive
    private Double basicFinishMultiplier = 0.7;
    
    @NotNull @Positive
    private Double standardFinishMultiplier = 1.0;
    
    @NotNull @Positive
    private Double premiumFinishMultiplier = 1.5;
    
    // Wall Finish Multipliers
    @NotNull @Positive
    private Double paintMultiplier = 0.3;
    
    @NotNull @Positive
    private Double ceramicTileMultiplier = 1.2;
    
    @NotNull @Positive
    private Double naturalStoneMultiplier = 2.0;
    
    // Frame Multipliers
    @NotNull @Positive
    private Double aluminumFrameMultiplier = 1.5;
    
    @NotNull @Positive
    private Double woodFrameMultiplier = 1.0;
    
    @NotNull @Positive
    private Double pvcFrameMultiplier = 1.3;
    
    // Ceiling Multipliers
    @NotNull @Positive
    private Double plasterCeilingMultiplier = 0.8;
    
    @NotNull @Positive
    private Double drywallCeilingMultiplier = 1.0;
    
    @NotNull @Positive
    private Double suspendedCeilingMultiplier = 1.5;
    
    // Roof Multipliers
    @NotNull @Positive
    private Double ceramicTileRoofMultiplier = 1.0;
    
    @NotNull @Positive
    private Double metalRoofMultiplier = 1.2;
    
    @NotNull @Positive
    private Double concreteRoofMultiplier = 1.8;
    
    // Foundation Multipliers
    @NotNull @Positive
    private Double shallowFoundationMultiplier = 1.0;
    
    @NotNull @Positive
    private Double deepFoundationMultiplier = 1.5;
    
    @NotNull @Positive
    private Double pileFoundationMultiplier = 2.0;
    
    // Base Costs
    @NotNull @Positive
    private Double baseConstructionCost = 1500.0;
    
    @NotNull @Positive
    private Double baseElectricalCost = 200.0;
    
    @NotNull @Positive
    private Double basePlumbingCost = 300.0;
    
    // Additional Costs
    @NotNull @Positive
    private Double projectManagementCost = 10.0;
    
    @NotNull @Positive
    private Double contingencyCost = 5.0;
    
    @NotNull @Positive
    private Double taxRate = 15.0;
} 