package com.orcamento.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EapItem {
    private String id;
    private String name;
    private String unit;
    private Double quantity;
    private Double unitPrice;
    private Double totalPrice;
} 