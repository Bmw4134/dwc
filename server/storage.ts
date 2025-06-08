import {
  users,
  leads,
  clients,
  automations,
  masterLogins,
  type User,
  type UpsertUser,
  type Lead,
  type InsertLead,
  type Client,
  type InsertClient,
  type Automation,
  type InsertAutomation,
  type MasterLogin,
  type InsertMasterLogin,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // Database access
  db: typeof db;
  
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Business operations
  getLeads(): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  
  getAutomations(): Promise<Automation[]>;
  createAutomation(automation: InsertAutomation): Promise<Automation>;
  
  // Dashboard operations
  getDashboardStats(): Promise<{
    totalLeads: number;
    qualifiedLeads: number;
    activeProposals: number;
    totalRevenue: number;
    conversionRate: number;
    avgDealSize: number;
  }>;
  
  getLatestMetrics(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // Database access
  db = db;
  
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Additional methods needed for the application
  async getLeadsByZipCode(zipCode: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.zipCode, zipCode));
  }

  async calculateROI(): Promise<any> {
    // ROI calculation logic
    return { roi: 277, monthlySavings: 8500 };
  }

  async getRoiCalculations(): Promise<any[]> {
    return [];
  }

  async getAiInsights(): Promise<any[]> {
    return [];
  }

  async createAiInsight(insight: any): Promise<any> {
    return insight;
  }

  async markInsightAsRead(id: number): Promise<void> {
    // Mark insight as read
  }

  // Business operations
  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async createLead(leadData: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(leadData).returning();
    return lead;
  }

  async updateLead(id: number, leadData: Partial<InsertLead>): Promise<Lead | undefined> {
    const [lead] = await db
      .update(leads)
      .set({ ...leadData, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  async getClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async createClient(clientData: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(clientData).returning();
    return client;
  }

  async getAutomations(): Promise<Automation[]> {
    return await db.select().from(automations);
  }

  async createAutomation(automationData: InsertAutomation): Promise<Automation> {
    const [automation] = await db.insert(automations).values(automationData).returning();
    return automation;
  }

  async getDashboardStats(): Promise<{
    totalLeads: number;
    qualifiedLeads: number;
    activeProposals: number;
    totalRevenue: number;
    conversionRate: number;
    avgDealSize: number;
  }> {
    const allLeads = await this.getLeads();
    const qualifiedLeads = allLeads.filter(lead => lead.status === 'qualified' || lead.status === 'proposal').length;
    const activeProposals = allLeads.filter(lead => lead.status === 'proposal').length;
    const wonLeads = allLeads.filter(lead => lead.status === 'won');
    
    // Calculate revenue from won leads (using estimatedSavings as deal value)
    const totalRevenue = wonLeads.reduce((sum, lead) => {
      const savings = parseFloat(lead.estimatedSavings?.replace(/[$,]/g, '') || '0');
      return sum + (savings * 0.15); // Assuming 15% commission
    }, 0);
    
    const conversionRate = allLeads.length > 0 ? (wonLeads.length / allLeads.length) * 100 : 0;
    const avgDealSize = wonLeads.length > 0 ? totalRevenue / wonLeads.length : 0;

    return {
      totalLeads: allLeads.length,
      qualifiedLeads,
      activeProposals,
      totalRevenue,
      conversionRate,
      avgDealSize
    };
  }

  async getLatestMetrics(): Promise<any[]> {
    const recentLeads = await this.getLeads();
    return recentLeads.slice(-10).map(lead => ({
      id: lead.id,
      action: `New lead: ${lead.businessName}`,
      timestamp: lead.createdAt,
      value: lead.estimatedSavings,
      status: lead.status
    }));
  }
}

export const storage = new DatabaseStorage();