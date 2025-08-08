package com.orcamento.controller;

import com.orcamento.model.BudgetInputs;
import com.orcamento.model.BudgetRequest;
import com.orcamento.model.BudgetResponse;
import com.orcamento.service.BudgetCalculationService;
import com.orcamento.service.BudgetRequestService;
import com.orcamento.service.CostFactorsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/budget")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:9002"})
public class BudgetController {
    
    @Autowired
    private BudgetCalculationService budgetCalculationService;
    
    @Autowired
    private CostFactorsService costFactorsService;
    
    @Autowired
    private BudgetRequestService budgetRequestService;
    
    @PostMapping("/calculate")
    public ResponseEntity<BudgetResponse> calculateBudget(@Valid @RequestBody BudgetInputs inputs) {
        try {
            BudgetResponse response = budgetCalculationService.calculateBudget(inputs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/submit")
    public ResponseEntity<BudgetRequest> submitBudgetRequest(@Valid @RequestBody Map<String, Object> request) {
        try {
            BudgetInputs inputs = new BudgetInputs();
            
            // Extrair dados do cliente
            Map<String, String> clientData = (Map<String, String>) request.get("clientData");
            inputs.setArea(Double.parseDouble(request.get("area").toString()));
            inputs.setWallType((String) request.get("wallType"));
            inputs.setFinishQuality((String) request.get("finishQuality"));
            inputs.setWallFinish((String) request.get("wallFinish"));
            inputs.setFrameArea(Double.parseDouble(request.get("frameArea").toString()));
            inputs.setBathrooms(Integer.parseInt(request.get("bathrooms").toString()));
            inputs.setFloorArea(Double.parseDouble(request.get("floorArea").toString()));
            inputs.setCeilingArea(Double.parseDouble(request.get("ceilingArea").toString()));
            inputs.setCeilingType((String) request.get("ceilingType"));
            inputs.setRoofType((String) request.get("roofType"));
            inputs.setRoofArea(Double.parseDouble(request.get("roofArea").toString()));
            inputs.setFoundationType((String) request.get("foundationType"));
            inputs.setWastePercentage(Double.parseDouble(request.get("wastePercentage").toString()));
            
            // Calcular orçamento
            BudgetResponse response = budgetCalculationService.calculateBudget(inputs);
            
            // Criar pedido
            BudgetRequest budgetRequest = new BudgetRequest();
            budgetRequest.setClientName(clientData.get("name"));
            budgetRequest.setClientEmail(clientData.get("email"));
            budgetRequest.setClientPhone(clientData.get("phone"));
            budgetRequest.setArea(inputs.getArea());
            budgetRequest.setWallType(inputs.getWallType());
            budgetRequest.setFinishQuality(inputs.getFinishQuality());
            budgetRequest.setWallFinish(inputs.getWallFinish());
            budgetRequest.setFrameArea(inputs.getFrameArea());
            budgetRequest.setBathrooms(inputs.getBathrooms());
            budgetRequest.setFloorArea(inputs.getFloorArea());
            budgetRequest.setCeilingArea(inputs.getCeilingArea());
            budgetRequest.setCeilingType(inputs.getCeilingType());
            budgetRequest.setRoofType(inputs.getRoofType());
            budgetRequest.setRoofArea(inputs.getRoofArea());
            budgetRequest.setFoundationType(inputs.getFoundationType());
            budgetRequest.setWastePercentage(inputs.getWastePercentage());
            budgetRequest.setTotalBudget(response.getTotal());
            
            BudgetRequest savedRequest = budgetRequestService.saveRequest(budgetRequest);
            return ResponseEntity.ok(savedRequest);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 