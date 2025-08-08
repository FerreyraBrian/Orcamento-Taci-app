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

export interface BudgetResponse {
  eap: EapItem[];
  total: number;
}

export interface CostFactors {
  id?: number;
  alvenariaMultiplier: number;
  drywallMultiplier: number;
  steelFrameMultiplier: number;
  basicFinishMultiplier: number;
  standardFinishMultiplier: number;
  premiumFinishMultiplier: number;
  paintMultiplier: number;
  ceramicTileMultiplier: number;
  naturalStoneMultiplier: number;
  aluminumFrameMultiplier: number;
  woodFrameMultiplier: number;
  pvcFrameMultiplier: number;
  plasterCeilingMultiplier: number;
  drywallCeilingMultiplier: number;
  suspendedCeilingMultiplier: number;
  ceramicTileRoofMultiplier: number;
  metalRoofMultiplier: number;
  concreteRoofMultiplier: number;
  shallowFoundationMultiplier: number;
  deepFoundationMultiplier: number;
  pileFoundationMultiplier: number;
  baseConstructionCost: number;
  baseElectricalCost: number;
  basePlumbingCost: number;
  projectManagementCost: number;
  contingencyCost: number;
  taxRate: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  area: number;
  completionDate: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface BudgetRequest {
  id?: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  area: number;
  wallType: string;
  finishQuality: string;
  wallFinish: string;
  frameArea: number;
  bathrooms: number;
  floorArea: number;
  ceilingArea: number;
  ceilingType: string;
  roofType: string;
  roofArea: number;
  foundationType: string;
  wastePercentage: number;
  totalBudget: number;
  createdAt: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  notes?: string;
}

export interface DashboardStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalApprovedBudget: number;
}

export interface ClientData {
  name: string;
  email: string;
  phone: string;
} 