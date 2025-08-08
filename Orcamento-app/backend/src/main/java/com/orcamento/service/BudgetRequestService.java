package com.orcamento.service;

import com.orcamento.model.BudgetRequest;
import com.orcamento.repository.BudgetRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetRequestService {
    
    @Autowired
    private BudgetRequestRepository budgetRequestRepository;
    
    public List<BudgetRequest> getAllRequests() {
        return budgetRequestRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<BudgetRequest> getRequestsByStatus(String status) {
        return budgetRequestRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    public Optional<BudgetRequest> getRequestById(Long id) {
        return budgetRequestRepository.findById(id);
    }
    
    public BudgetRequest saveRequest(BudgetRequest request) {
        return budgetRequestRepository.save(request);
    }
    
    public BudgetRequest updateRequestStatus(Long id, String status, String notes) {
        Optional<BudgetRequest> optional = budgetRequestRepository.findById(id);
        if (optional.isPresent()) {
            BudgetRequest request = optional.get();
            request.setStatus(status);
            request.setNotes(notes);
            return budgetRequestRepository.save(request);
        }
        return null;
    }
    
    public Long getPendingCount() {
        return budgetRequestRepository.countByStatus("PENDENTE");
    }
    
    public Long getApprovedCount() {
        return budgetRequestRepository.countByStatus("APROVADO");
    }
    
    public Long getRejectedCount() {
        return budgetRequestRepository.countByStatus("REJEITADO");
    }
    
    public Double getTotalApprovedBudget() {
        Double total = budgetRequestRepository.getTotalApprovedBudget();
        return total != null ? total : 0.0;
    }
} 