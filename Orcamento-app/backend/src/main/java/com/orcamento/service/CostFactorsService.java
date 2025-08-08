package com.orcamento.service;

import com.orcamento.model.CostFactors;
import com.orcamento.repository.CostFactorsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CostFactorsService {
    
    @Autowired
    private CostFactorsRepository costFactorsRepository;
    
    private static final CostFactors DEFAULT_FACTORS = new CostFactors();
    
    public CostFactors getCurrentFactors() {
        CostFactors factors = costFactorsRepository.findFirstByOrderByIdAsc().orElse(null);
        if (factors == null) {
            factors = DEFAULT_FACTORS;
            costFactorsRepository.save(factors);
        }
        return factors;
    }
    
    public CostFactors updateFactors(CostFactors factors) {
        CostFactors existingFactors = costFactorsRepository.findFirstByOrderByIdAsc().orElse(null);
        if (existingFactors != null) {
            factors.setId(existingFactors.getId());
        }
        return costFactorsRepository.save(factors);
    }
} 