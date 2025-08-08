package com.orcamento.service;

import com.orcamento.model.BudgetInputs;
import com.orcamento.model.BudgetResponse;
import com.orcamento.model.CostFactors;
import com.orcamento.model.EapItem;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class BudgetCalculationService {
    
    private static final Map<String, Double> EAP_DISTRIBUTION = Map.ofEntries(
        Map.entry("foundation", 0.15),
        Map.entry("structure", 0.20),
        Map.entry("masonry", 0.08),
        Map.entry("finishing", 0.12),
        Map.entry("roof", 0.10),
        Map.entry("frames", 0.08),
        Map.entry("electrical", 0.08),
        Map.entry("plumbing", 0.06),
        Map.entry("painting", 0.05),
        Map.entry("flooring", 0.04),
        Map.entry("ceiling", 0.02),
        Map.entry("waterproofing", 0.01),
        Map.entry("cleaning", 0.01)
    );
    
    public BudgetResponse calculateBudget(BudgetInputs inputs) {
        List<EapItem> items = new ArrayList<>();
        double totalCost = 0.0;
        
        // Calculate base cost
        double baseCost = inputs.getArea() * 1500.0; // Base cost per m²
        
        // Apply multipliers based on inputs
        double wallMultiplier = getWallMultiplier(inputs.getWallType());
        double finishMultiplier = getFinishMultiplier(inputs.getFinishQuality());
        double wallFinishMultiplier = getWallFinishMultiplier(inputs.getWallFinish());
        
        // Calculate EAP items
        for (Map.Entry<String, Double> entry : EAP_DISTRIBUTION.entrySet()) {
            String itemName = entry.getKey();
            double percentage = entry.getValue();
            
            double itemCost = baseCost * percentage * wallMultiplier * finishMultiplier;
            
            EapItem item = new EapItem();
            item.setId(itemName);
            item.setName(getItemDisplayName(itemName));
            item.setUnit("m²");
            item.setQuantity(inputs.getArea());
            item.setUnitPrice(itemCost / inputs.getArea());
            item.setTotalPrice(itemCost);
            
            items.add(item);
            totalCost += itemCost;
        }
        
        // Add additional costs
        double additionalCosts = calculateAdditionalCosts(inputs, totalCost);
        totalCost += additionalCosts;
        
        return new BudgetResponse(items, totalCost);
    }
    
    private double getWallMultiplier(String wallType) {
        return switch (wallType) {
            case "alvenaria" -> 1.0;
            case "drywall" -> 0.8;
            case "steel_frame" -> 1.2;
            default -> 1.0;
        };
    }
    
    private double getFinishMultiplier(String finishQuality) {
        return switch (finishQuality) {
            case "basic" -> 0.7;
            case "standard" -> 1.0;
            case "premium" -> 1.5;
            default -> 1.0;
        };
    }
    
    private double getWallFinishMultiplier(String wallFinish) {
        return switch (wallFinish) {
            case "paint" -> 0.3;
            case "ceramic_tile" -> 1.2;
            case "natural_stone" -> 2.0;
            default -> 1.0;
        };
    }
    
    private double calculateAdditionalCosts(BudgetInputs inputs, double baseCost) {
        double additionalCosts = 0.0;
        
        // Frame costs
        additionalCosts += inputs.getFrameArea() * 200.0;
        
        // Bathroom costs
        additionalCosts += inputs.getBathrooms() * 5000.0;
        
        // Floor costs
        additionalCosts += inputs.getFloorArea() * 150.0;
        
        // Ceiling costs
        additionalCosts += inputs.getCeilingArea() * 100.0;
        
        // Roof costs
        additionalCosts += inputs.getRoofArea() * 300.0;
        
        // Waste percentage
        additionalCosts += baseCost * (inputs.getWastePercentage() / 100.0);
        
        return additionalCosts;
    }
    
    private String getItemDisplayName(String itemId) {
        return switch (itemId) {
            case "foundation" -> "Fundação";
            case "structure" -> "Estrutura";
            case "masonry" -> "Alvenaria";
            case "finishing" -> "Acabamento";
            case "roof" -> "Cobertura";
            case "frames" -> "Esquadrias";
            case "electrical" -> "Instalações Elétricas";
            case "plumbing" -> "Instalações Hidráulicas";
            case "painting" -> "Pintura";
            case "flooring" -> "Pisos";
            case "ceiling" -> "Forros";
            case "waterproofing" -> "Impermeabilização";
            case "cleaning" -> "Limpeza e Acabamento";
            default -> itemId;
        };
    }
} 