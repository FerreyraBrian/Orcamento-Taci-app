import axios from 'axios';
import { 
  BudgetInputs, 
  BudgetResponse, 
  CostFactors, 
  LoginRequest, 
  LoginResponse,
  BudgetRequest,
  DashboardStats
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Budget API
export const budgetApi = {
  calculate: async (inputs: BudgetInputs): Promise<BudgetResponse> => {
    const response = await apiClient.post('/budget/calculate', inputs);
    return response.data;
  },
  
  submit: async (data: any): Promise<BudgetRequest> => {
    const response = await apiClient.post('/budget/submit', data);
    return response.data;
  },
  
  exportCsv: async (inputs: BudgetInputs): Promise<Blob> => {
    const response = await apiClient.post('/export/csv', inputs, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Admin API
export const adminApi = {
  getCostFactors: async (): Promise<CostFactors> => {
    const response = await apiClient.get('/admin/cost-factors');
    return response.data;
  },
  
  updateCostFactors: async (factors: CostFactors): Promise<CostFactors> => {
    const response = await apiClient.put('/admin/cost-factors', factors);
    return response.data;
  }
};

// Dashboard API
export const dashboardApi = {
  getAllRequests: async (): Promise<BudgetRequest[]> => {
    const response = await apiClient.get('/dashboard/requests');
    return response.data;
  },
  
  getRequestsByStatus: async (status: string): Promise<BudgetRequest[]> => {
    const response = await apiClient.get(`/dashboard/requests/status/${status}`);
    return response.data;
  },
  
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
  
  updateRequestStatus: async (id: number, status: string, notes: string): Promise<BudgetRequest> => {
    const response = await apiClient.put(`/dashboard/requests/${id}/status`, { status, notes });
    return response.data;
  },
  
  getRequestById: async (id: number): Promise<BudgetRequest> => {
    const response = await apiClient.get(`/dashboard/requests/${id}`);
    return response.data;
  }
};

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
  
  validateToken: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/auth/validate');
      return response.data;
    } catch {
      return false;
    }
  }
};

export default apiClient; 