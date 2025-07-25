import type { BudgetInputs, EapItem, CostFactors } from "@/types";

export const defaultCostFactors: CostFactors = {
  baseCostPerSqm: 1200, // Base value in BRL
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
    skimCoat: 1.2, // This corresponds to "reboco"
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
  indirectsAndMargin: 0.15, // Etapa 13 - Corresponds to profit margin and indirects
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

  let totalBeforeAdjustments = 0;

  // Calculate base cost influenced by total area
  const baseTotalCost = factors.baseCostPerSqm * area;

  // 1. Foundation Cost
  const foundationBaseCost = baseTotalCost * eapDistribution.foundation;
  const foundationCost = foundationBaseCost * (foundationType === 'continuous-helix' ? factors.foundationMultiplier.continuousHelix : factors.foundationMultiplier.standard);
  
  // 2. Structure Cost
  const structureCost = baseTotalCost * eapDistribution.structure;

  // 3. Masonry Cost
  const masonryBaseCost = baseTotalCost * eapDistribution.masonry;
  const masonryCost = masonryBaseCost * factors.wallTypeMultiplier[wallType];
  
  // Bathroom additions affect multiple EAP items
  const bathroomAdditionCost = bathrooms * factors.costPerBathroom * factors.finishQualityMultiplier[finishQuality];

  // 4. Plumbing Cost
  const plumbingCost = (baseTotalCost * eapDistribution.plumbing) + (bathroomAdditionCost / 3); // Distribute cost
  
  // 5. Electrical Cost
  const electricalCost = (baseTotalCost * eapDistribution.electrical) + (bathroomAdditionCost / 3); // Distribute cost

  // 6. Coatings Cost
  let coatingsCost = baseTotalCost * eapDistribution.coatings;
  coatingsCost += floorArea * factors.floorCostPerSqm; // Add specific floor cost
  coatingsCost *= factors.finishQualityMultiplier[finishQuality];
  coatingsCost *= factors.wallFinishMultiplier[wallFinish === 'skim-coat' ? 'skimCoat' : wallFinish];
  
  // 7. Frames, Fixtures, and Metals Cost
  let framesCost = baseTotalCost * eapDistribution.frames;
  framesCost += frameArea * factors.frameCostPerSqm; // Add specific frame cost
  framesCost += (bathroomAdditionCost / 3); // Distribute bathroom cost
  framesCost *= factors.finishQualityMultiplier[finishQuality];

  // 8. Roofing Cost
  let roofingBaseCost = (baseTotalCost * eapDistribution.roofing) * (roofArea > 0 ? (roofArea / area) : 1);
  const roofingCost = roofingBaseCost * factors.roofTypeMultiplier[roofType];

  // 9. Ceiling Cost
  const ceilingCost = ceilingArea * factors.ceilingCostPerSqm[ceilingType];

  // 10. Waterproofing Cost
  let waterproofingCost = baseTotalCost * eapDistribution.waterproofing;
  if (roofType === 'slab' || roofType === 'metal') {
      waterproofingCost *= 1.5; // Increased need for waterproofing
  } else {
      waterproofingCost = 0; // Not always needed for ceramic
  }
  
  // 11. Painting Cost
  let paintingCost = baseTotalCost * eapDistribution.painting;
  paintingCost *= factors.finishQualityMultiplier[finishQuality];
  paintingCost *= factors.wallFinishMultiplier[wallFinish === 'skim-coat' ? 'skimCoat' : wallFinish];
  
  // Sum of all primary costs
  const sumOfCosts = foundationCost + structureCost + masonryCost + plumbingCost + electricalCost + coatingsCost + framesCost + roofingCost + ceilingCost + waterproofingCost + paintingCost;

  // 13. Margin and Indirects
  const indirectsAndMarginCost = sumOfCosts * eapDistribution.indirectsAndMargin;
  
  const totalWithMargin = sumOfCosts + indirectsAndMarginCost;

  // 12. Waste (global adjustment)
  const wasteCost = totalWithMargin * (wastePercentage / 100);
  const finalTotal = totalWithMargin + wasteCost;

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
     { id: '13', name: 'Margem e indiretos', unit: 'total', quantity: 1, unitPrice: indirectsAndMarginCost, totalPrice: indirectsAndMarginCost },
     { id: '12', name: 'Desperdício', unit: 'total', quantity: 1, unitPrice: wasteCost, totalPrice: wasteCost },
  ];
  
  return { eap, total: finalTotal };
};
