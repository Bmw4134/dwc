import { apiRequest } from "./queryClient";

export interface DashboardStats {
  activeLeads: number;
  monthlySavings: number;
  activeAutomations: number;
  roiRate: number;
  totalClients: number;
  lastUpdated: string;
}

export interface Lead {
  id: number;
  businessName: string;
  address: string;
  zipCode: string;
  industry: string;
  employeeCount?: number;
  phoneNumber?: string;
  website?: string;
  automationScore?: number;
  estimatedSavings: string;
  priority: string;
  status: string;
  painPoints?: string[];
  createdAt: string;
}

export interface Client {
  id: number;
  businessName: string;
  contactName: string;
  email: string;
  monthlyRevenue: string;
  implementationStatus: string;
  monthlySavings: string;
  automations?: any[];
}

export interface RoiCalculation {
  id: number;
  industry: string;
  employeeCount: number;
  monthlyLaborCost: string;
  automationPercentage: string;
  monthlySavings: string;
  annualSavings: string;
  implementationCost: string;
  monthlyServiceFee: string;
  roiPercentage: string;
  breakEvenMonths: string;
}

export interface AiInsight {
  id: number;
  type: string;
  title: string;
  description: string;
  priority: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export interface PainPointAnalysis {
  painPoints: Array<{
    department: string;
    process: string;
    timeWasted: number;
    difficulty: 'low' | 'medium' | 'high';
    savings: number;
  }>;
  totalMonthlySavings: number;
  implementationComplexity: 'low' | 'medium' | 'high';
  priorityRecommendations: string[];
}

export interface RevenueProjection {
  currentMRR: string;
  projections: Array<{
    month: number;
    monthlyRevenue: string;
    annualRevenue: string;
    clientCount: number;
    date: string;
  }>;
  targets: {
    year1: { arr: string; clients: number };
    year2: { arr: string; clients: number };
    year5: { arr: string; clients: number };
  };
}

// Dashboard API
export const dashboardApi = {
  getStats: (): Promise<DashboardStats> =>
    fetch("/api/dashboard/stats", { credentials: "include" }).then(res => res.json()),
  
  getRealTimeMetrics: (): Promise<DashboardStats> =>
    fetch("/api/realtime/metrics", { credentials: "include" }).then(res => res.json()),
};

// Leads API
export const leadsApi = {
  getAll: (filters?: { zipCode?: string; priority?: string; status?: string }): Promise<Lead[]> => {
    const params = new URLSearchParams();
    if (filters?.zipCode) params.append('zipCode', filters.zipCode);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);
    
    return fetch(`/api/leads?${params}`, { credentials: "include" }).then(res => res.json());
  },
  
  getByZipCode: (zipCode: string): Promise<Lead[]> =>
    fetch(`/api/leads/zip/${zipCode}`, { credentials: "include" }).then(res => res.json()),
  
  create: async (leadData: Partial<Lead>): Promise<Lead> => {
    const res = await apiRequest("POST", "/api/leads", leadData);
    return res.json();
  },
  
  update: async (id: number, updates: Partial<Lead>): Promise<Lead> => {
    const res = await apiRequest("PATCH", `/api/leads/${id}`, updates);
    return res.json();
  },
  
  scan: async (zipCode: string, industry: string): Promise<{ leads: Lead[]; scanned: number }> => {
    const res = await apiRequest("POST", "/api/leads/scan", { zipCode, industry });
    return res.json();
  },
};

// Clients API
export const clientsApi = {
  getAll: (): Promise<Client[]> =>
    fetch("/api/clients", { credentials: "include" }).then(res => res.json()),
  
  create: async (clientData: Partial<Client>): Promise<Client> => {
    const res = await apiRequest("POST", "/api/clients", clientData);
    return res.json();
  },
};

// ROI API
export const roiApi = {
  calculate: async (params: {
    industry: string;
    employeeCount: number;
    monthlyLaborCost: number;
    automationPercentage: number;
  }): Promise<RoiCalculation> => {
    const res = await apiRequest("POST", "/api/roi/calculate", params);
    return res.json();
  },
  
  getCalculations: (leadId?: number): Promise<RoiCalculation[]> => {
    const url = leadId ? `/api/roi/${leadId}` : "/api/roi";
    return fetch(url, { credentials: "include" }).then(res => res.json());
  },
};

// AI Insights API
export const insightsApi = {
  getAll: (filters?: { type?: string; priority?: string }): Promise<AiInsight[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.priority) params.append('priority', filters.priority);
    
    return fetch(`/api/insights?${params}`, { credentials: "include" }).then(res => res.json());
  },
  
  markAsRead: async (id: number): Promise<void> => {
    await apiRequest("PATCH", `/api/insights/${id}/read`);
  },
};

// Analysis API
export const analysisApi = {
  analyzePainPoints: async (businessData: {
    businessName: string;
    industry: string;
    description?: string;
    employeeCount?: number;
  }): Promise<PainPointAnalysis> => {
    const res = await apiRequest("POST", "/api/analysis/pain-points", businessData);
    return res.json();
  },
};

// Forecasting API
export const forecastingApi = {
  getRevenueProjections: (timeframe: string = '12'): Promise<RevenueProjection> =>
    fetch(`/api/forecasting/revenue?timeframe=${timeframe}`, { credentials: "include" }).then(res => res.json()),
};
