import type { BudgetInputs, EapItem, CostFactors } from "@/types";

export const defaultCostFactors: CostFactors = {
  baseCostPerSqm: 1200, // This is a base value, R$ in the example, but we'll use USD for consistency
  wallTypeMultiplier: {
    masonry: 1,
    structural: 1.1,
    drywall: 0.85,
  },
  finishQualityMultiplier: {
    economy: 1,
    medium: 1.2,
    high: 1.4,
  },
  wallFinishMultiplier: {
    paint: 1,
    cladding: 1.1,
    plaster: 1.15,
    skimCoat: 1.2,
  },
  frameCostPerSqm: 500, // Average from R$300-R$700
  costPerBathroom: 3000, // Average from R$2000-R$4000
  floorCostPerSqm: 80,
  ceilingCostPerSqm: {
    pvc: 40,
    gypsum: 50, // 40 * 1.25
  },
  roofTypeMultiplier: {
    ceramic: 1,
    metal: 0.9,
    slab: 1.3,
  },
  foundationMultiplier: {
    standard: 1,
    continuousHelix: 1.3
  }
};

// These are simplified percentages for the EAP breakdown, as they were not specified in the rules.
// They are based on a generic construction budget distribution.
const eapDistribution = {
  foundation: 0.10, // Etapa 1
  structure: 0.15, // Etapa 2
  masonry: 0.08, // Etapa 3
  plumbing: 0.07, // Etapa 4
  electrical: 0.07, // Etapa 5
  coatings: 0.10, // Etapa 6
  frames: 0.08, // Etapa 7
  roofing: 0.08, // Etapa 8
  ceiling: 0.05, // Etapa 9
  waterproofing: 0.02, // Etapa 10
  painting: 0.05, // Etapa 11
  indirectsAndMargin: 0.15, // Etapa 13
};


export const calculateBudget = (
  inputs: BudgetInputs,
  factors: CostFactors
) => {
  const {
    area,
    wallType,
    finishQuality,
    wallFinish,
    frameArea,
    bathrooms,
    floorArea,
    ceilingArea,
    ceilingType,
    roofType,
    roofArea,
    foundationType,
    wastePercentage
  } = inputs;

  let totalCost = 0;

  // 1. Calculate base cost influenced by total area
  const baseTotalCost = factors.baseCostPerSqm * area;

  // 2. Calculate cost for each EAP item
  
  // EAP 1: Foundation
  const foundationBaseCost = baseTotalCost * eapDistribution.foundation;
  const foundationCost = foundationBaseCost * (foundationType === 'continuous-helix' ? factors.foundationMultiplier.continuousHelix : factors.foundationMultiplier.standard);
  totalCost += foundationCost;

  // EAP 2: Structure (not directly modified by questions, uses base distribution)
  const structureCost = baseTotalCost * eapDistribution.structure;
  totalCost += structureCost;

  // EAP 3: Masonry
  const masonryBaseCost = baseTotalCost * eapDistribution.masonry;
  const masonryCost = masonryBaseCost * factors.wallTypeMultiplier[wallType];
  totalCost += masonryCost;
  
  // EAP 4 & 5 & 7 (partially): Bathrooms influence
  const bathroomAddition = bathrooms * factors.costPerBathroom * factors.finishQualityMultiplier[finishQuality];
  const plumbingCost = (baseTotalCost * eapDistribution.plumbing) + (bathroomAddition / 3);
  const electricalCost = (baseTotalCost * eapDistribution.electrical) + (bathroomAddition / 3);
  totalCost += plumbingCost + electricalCost;

  // EAP 6, 7, 11: Coatings, Frames, Painting (influenced by finish quality)
  let coatingsCost = baseTotalCost * eapDistribution.coatings;
  let framesCost = (baseTotalCost * eapDistribution.frames) + (bathroomAddition / 3);
  let paintingCost = baseTotalCost * eapDistribution.painting;

  // Adjust by Finish Quality
  const qualityMulti = factors.finishQualityMultiplier[finishQuality];
  coatingsCost *= qualityMulti;
  framesCost *= qualityMulti;
  paintingCost *= qualityMulti;

  // Adjust by Wall Finish
  const wallFinishMulti = factors.wallFinishMultiplier[wallFinish];
  coatingsCost *= wallFinishMulti;
  paintingCost *= wallFinishMulti;

  // Adjust by specific areas
  framesCost += frameArea * factors.frameCostPerSqm;
  coatingsCost += floorArea * factors.floorCostPerSqm * qualityMulti;
  
  totalCost += coatingsCost + framesCost + paintingCost;

  // EAP 9: Ceiling
  const ceilingCost = ceilingArea * factors.ceilingCostPerSqm[ceilingType];
  totalCost += ceilingCost;
  
  // EAP 8 & 10: Roofing & Waterproofing
  let roofingBaseCost = (baseTotalCost * eapDistribution.roofing) * (roofArea / area);
  roofingBaseCost *= factors.roofTypeMultiplier[roofType];
  let waterproofingCost = baseTotalCost * eapDistribution.waterproofing;
  if (roofType === 'slab' || roofType === 'metal') {
      waterproofingCost *= 1.5; // Increased need for waterproofing
  } else {
      waterproofingCost = 0; // Not always needed for ceramic
  }
  const roofingCost = roofingBaseCost;
  totalCost += roofingCost + waterproofingCost;

  // EAP 13: Indirects and Margin
  const indirectsAndMarginCost = totalCost * eapDistribution.indirectsAndMargin;
  totalCost += indirectsAndMarginCost;

  // EAP 12: Waste (global adjustment)
  const wasteCost = totalCost * (wastePercentage / 100);
  const finalTotal = totalCost + wasteCost;

  const eap: EapItem[] = [
     { id: '1', name: 'Fundação', unit: 'total', quantity: 1, unitPrice: foundationCost, totalPrice: foundationCost },
     { id: '2', name: 'Estrutura', unit: 'total', quantity: 1, unitPrice: structureCost, totalPrice: structureCost },
     { id: '3', name: 'Alvenaria', unit: 'total', quantity: 1, unitPrice: masonryCost, totalPrice: masonryCost },
     { id: '4', name: 'Instalações hidráulicas', unit: 'total', quantity: 1, unitPrice: plumbingCost, totalPrice: plumbingCost },
     { id: '5', name: 'Instalações elétricas', unit: 'total', quantity: 1, unitPrice: electricalCost, totalPrice: electricalCost },
     { id: '6', name: 'Revestimentos', unit: 'total', quantity: 1, unitPrice: coatingsCost, totalPrice: coatingsCost },
     { id: '7', name: 'Esquadrias, louças e metais', unit: 'total', quantity: 1, unitPrice: framesCost, totalPrice: framesCost },
     { id: '8', name: 'Cobertura', unit: 'total', quantity: 1, unitPrice: roofingCost, totalPrice: roofingCost },
     { id: '9', name: 'Forro', unit: 'total', quantity: 1, unitPrice: ceilingCost, totalPrice: ceilingCost },
     { id: '10', name: 'Impermeabilização', unit: 'total', quantity: 1, unitPrice: waterproofingCost, totalPrice: waterproofingCost },
     { id: '11', name: 'Pintura', unit: 'total', quantity: 1, unitPrice: paintingCost, totalPrice: paintingCost },
     { id: '12', name: 'Desperdício', unit: 'total', quantity: 1, unitPrice: wasteCost, totalPrice: wasteCost },
     { id: '13', name: 'Margem e indiretos', unit: 'total', quantity: 1, unitPrice: indirectsAndMarginCost, totalPrice: indirectsAndMarginCost },
  ];
  
  return { eap, total: finalTotal };
};
