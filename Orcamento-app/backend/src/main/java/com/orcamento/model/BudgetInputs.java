package com.orcamento.model;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetInputs {
    
    @NotNull(message = "Area is required")
    @Min(value = 1, message = "Area must be at least 1 m²")
    @Max(value = 10000, message = "Area cannot exceed 10,000 m²")
    private Double area;
    
    @NotBlank(message = "Wall type is required")
    @Pattern(regexp = "^(alvenaria|drywall|steel_frame)$", message = "Invalid wall type")
    private String wallType;
    
    @NotBlank(message = "Finish quality is required")
    @Pattern(regexp = "^(basic|standard|premium)$", message = "Invalid finish quality")
    private String finishQuality;
    
    @NotBlank(message = "Wall finish is required")
    @Pattern(regexp = "^(paint|ceramic_tile|natural_stone)$", message = "Invalid wall finish")
    private String wallFinish;
    
    @NotNull(message = "Frame area is required")
    @Min(value = 0, message = "Frame area cannot be negative")
    private Double frameArea;
    
    @NotNull(message = "Number of bathrooms is required")
    @Min(value = 0, message = "Number of bathrooms cannot be negative")
    @Max(value = 20, message = "Number of bathrooms cannot exceed 20")
    private Integer bathrooms;
    
    @NotNull(message = "Floor area is required")
    @Min(value = 0, message = "Floor area cannot be negative")
    private Double floorArea;
    
    @NotNull(message = "Ceiling area is required")
    @Min(value = 0, message = "Ceiling area cannot be negative")
    private Double ceilingArea;
    
    @NotBlank(message = "Ceiling type is required")
    @Pattern(regexp = "^(plaster|drywall|suspended)$", message = "Invalid ceiling type")
    private String ceilingType;
    
    @NotBlank(message = "Roof type is required")
    @Pattern(regexp = "^(ceramic_tile|metal|concrete)$", message = "Invalid roof type")
    private String roofType;
    
    @NotNull(message = "Roof area is required")
    @Min(value = 0, message = "Roof area cannot be negative")
    private Double roofArea;
    
    @NotBlank(message = "Foundation type is required")
    @Pattern(regexp = "^(shallow|deep|pile)$", message = "Invalid foundation type")
    private String foundationType;
    
    @NotNull(message = "Waste percentage is required")
    @Min(value = 0, message = "Waste percentage cannot be negative")
    @Max(value = 50, message = "Waste percentage cannot exceed 50%")
    private Double wastePercentage;
} 