package com.orcamento.repository;

import com.orcamento.model.CostFactors;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CostFactorsRepository extends JpaRepository<CostFactors, Long> {
    
    Optional<CostFactors> findFirstByOrderByIdAsc();
} 