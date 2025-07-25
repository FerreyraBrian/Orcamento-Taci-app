export interface EapItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BudgetInputs {
  projectType: "residential" | "commercial" | "industrial";
  area: number;
  quality: "standard" | "premium" | "luxury";
  floors: number;
}

export interface CostFactors {
  baseCostPerSqm: number;
  qualityMultiplier: {
    standard: number;
    premium: number;
    luxury: number;
  };
  projectTypeMultiplier: {
    residential: number;
    commercial: number;
    industrial: number;
  };
}
