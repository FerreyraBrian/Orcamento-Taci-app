import type { BudgetInputs, EapItem, CostFactors } from "@/types";

export const defaultCostFactors: CostFactors = {
  baseCostPerSqm: 1200,
  qualityMultiplier: {
    standard: 1.0,
    premium: 1.5,
    luxury: 2.2,
  },
  projectTypeMultiplier: {
    residential: 1.0,
    commercial: 1.2,
    industrial: 0.9,
  },
};

export const calculateBudget = (
  inputs: BudgetInputs,
  factors: CostFactors
) => {
  const { area, quality, projectType, floors } = inputs;

  const qualityMultiplier = factors.qualityMultiplier[quality];
  const typeMultiplier = factors.projectTypeMultiplier[projectType];
  const floorMultiplier = 1 + (floors - 1) * 0.1; // 10% more cost for each additional floor

  const finalCostPerSqm =
    factors.baseCostPerSqm * qualityMultiplier * typeMultiplier * floorMultiplier;
  
  const total = finalCostPerSqm * area;

  // Simplified EAP (Work Breakdown Structure)
  const eap: EapItem[] = [
    {
      id: "1",
      name: "Foundation & Structure",
      unit: "m²",
      quantity: area,
      unitPrice: finalCostPerSqm * 0.25,
      totalPrice: total * 0.25,
    },
    {
      id: "2",
      name: "Masonry & Walls",
      unit: "m²",
      quantity: area * floors * 1.2, // Assuming wall area is 1.2x floor area
      unitPrice: finalCostPerSqm * 0.15 / (floors * 1.2),
      totalPrice: total * 0.15,
    },
    {
      id: "3",
      name: "Roofing",
      unit: "m²",
      quantity: area,
      unitPrice: finalCostPerSqm * 0.10,
      totalPrice: total * 0.10,
    },
    {
      id: "4",
      name: "Electrical Systems",
      unit: "m²",
      quantity: area,
      unitPrice: finalCostPerSqm * 0.12,
      totalPrice: total * 0.12,
    },
    {
      id: "5",
      name: "Plumbing & Hydraulics",
      unit: "m²",
      quantity: area,
      unitPrice: finalCostPerSqm * 0.13,
      totalPrice: total * 0.13,
    },
    {
      id: "6",
      name: "Finishing (Floors, Paint, etc.)",
      unit: "m²",
      quantity: area,
      unitPrice: finalCostPerSqm * 0.20,
      totalPrice: total * 0.20,
    },
    {
      id: "7",
      name: "Overhead & Margin",
      unit: "total",
      quantity: 1,
      unitPrice: total * 0.05,
      totalPrice: total * 0.05,
    },
  ];

  const calculatedTotal = eap.reduce((sum, item) => sum + item.totalPrice, 0);

  return { eap, total: calculatedTotal };
};
