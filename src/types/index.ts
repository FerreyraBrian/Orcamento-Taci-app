export interface EapItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BudgetInputs {
  area: number;
  wallType: 'masonry' | 'structural' | 'drywall';
  finishQuality: 'economy' | 'medium' | 'high';
  wallFinish: 'paint' | 'cladding' | 'plaster' | 'skim-coat';
  frameArea: number;
  bathrooms: number;
  floorArea: number;
  ceilingArea: number;
  ceilingType: 'pvc' | 'gypsum';
  roofType: 'ceramic' | 'metal' | 'slab';
  roofArea: number;
  foundationType: 'standard' | 'continuous-helix';
  wastePercentage: number;
}

export interface CostFactors {
  baseCostPerSqm: number;
  wallTypeMultiplier: {
    masonry: number;
    structural: number;
    drywall: number;
  },
  finishQualityMultiplier: {
    economy: number;
    medium: number;
    high: number;
  },
  wallFinishMultiplier: {
    paint: number;
    cladding: number;
    plaster: number;
    skimCoat: number;
  },
  frameCostPerSqm: number;
  costPerBathroom: number;
  floorCostPerSqm: number;
  ceilingCostPerSqm: {
    pvc: number;
    gypsum: number;
  },
  roofTypeMultiplier: {
    ceramic: number;
    metal: number;
    slab: number;
  },
  foundationMultiplier: {
    standard: number;
    continuousHelix: number;
  },
}
