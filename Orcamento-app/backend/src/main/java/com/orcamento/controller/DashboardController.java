package com.orcamento.controller;

import com.orcamento.model.BudgetRequest;
import com.orcamento.service.BudgetRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:9002"})
public class DashboardController {

    @Autowired
    private BudgetRequestService budgetRequestService;

    @GetMapping("/requests")
    public ResponseEntity<List<BudgetRequest>> getAllRequests() {
        List<BudgetRequest> requests = budgetRequestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/requests/status/{status}")
    public ResponseEntity<List<BudgetRequest>> getRequestsByStatus(@PathVariable String status) {
        List<BudgetRequest> requests = budgetRequestService.getRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("pendingCount", budgetRequestService.getPendingCount());
        stats.put("approvedCount", budgetRequestService.getApprovedCount());
        stats.put("rejectedCount", budgetRequestService.getRejectedCount());
        stats.put("totalApprovedBudget", budgetRequestService.getTotalApprovedBudget());
        
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/requests/{id}/status")
    public ResponseEntity<BudgetRequest> updateRequestStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        String status = request.get("status");
        String notes = request.get("notes");
        
        BudgetRequest updatedRequest = budgetRequestService.updateRequestStatus(id, status, notes);
        
        if (updatedRequest != null) {
            return ResponseEntity.ok(updatedRequest);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<BudgetRequest> getRequestById(@PathVariable Long id) {
        return budgetRequestService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 