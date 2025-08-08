package com.orcamento.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse {
    private List<EapItem> items;
    private Double total;
} 