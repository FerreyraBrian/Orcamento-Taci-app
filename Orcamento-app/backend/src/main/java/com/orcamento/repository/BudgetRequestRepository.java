package com.orcamento.repository;

import com.orcamento.model.BudgetRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRequestRepository extends JpaRepository<BudgetRequest, Long> {
    
    List<BudgetRequest> findAllByOrderByCreatedAtDesc();
    
    List<BudgetRequest> findByStatusOrderByCreatedAtDesc(String status);
    
    @Query("SELECT COUNT(b) FROM BudgetRequest b WHERE b.status = ?1")
    Long countByStatus(String status);
    
    @Query("SELECT SUM(b.totalBudget) FROM BudgetRequest b WHERE b.status = 'APROVADO'")
    Double getTotalApprovedBudget();
} 