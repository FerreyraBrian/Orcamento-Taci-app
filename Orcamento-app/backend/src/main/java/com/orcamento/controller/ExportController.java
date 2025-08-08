package com.orcamento.controller;

import com.orcamento.model.BudgetInputs;
import com.orcamento.service.BudgetCalculationService;
import com.opencsv.CSVWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/export")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:9002"})
public class ExportController {

    @Autowired
    private BudgetCalculationService budgetCalculationService;

    @PostMapping("/csv")
    public ResponseEntity<String> exportToCsv(@RequestBody BudgetInputs inputs) {
        try {
            var response = budgetCalculationService.calculateBudget(inputs);
            
            StringWriter stringWriter = new StringWriter();
            CSVWriter csvWriter = new CSVWriter(stringWriter);
            
            // Header
            csvWriter.writeNext(new String[]{"ID", "Item", "Unidade", "Quantidade", "Preço Unitário", "Preço Total"});
            
            // Data rows
            for (var item : response.getItems()) {
                csvWriter.writeNext(new String[]{
                    String.valueOf(item.getId()),
                    item.getName(),
                    item.getUnit(),
                    String.valueOf(item.getQuantity()),
                    String.format("R$ %.2f", item.getUnitPrice()),
                    String.format("R$ %.2f", item.getTotalPrice())
                });
            }
            
            // Total row
            csvWriter.writeNext(new String[]{"", "", "", "", "TOTAL:", String.format("R$ %.2f", response.getTotal())});
            
            csvWriter.close();
            
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
            String filename = "orcamento_" + timestamp + ".csv";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", filename);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(stringWriter.toString());
                    
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao gerar CSV: " + e.getMessage());
        }
    }
} 