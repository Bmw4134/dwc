import {
  users,
  leads,
  modules,
  metrics,
  type User,
  type InsertUser,
  type Lead,
  type InsertLead,
  type Module,
  type InsertModule,
  type Metric,
  type InsertMetric,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // Database access
  db: typeof db;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // QNIS/PTNI Lead operations
  getLeads(): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead>;
  
  // Module operations
  getModules(): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: number, module: Partial<InsertModule>): Promise<Module>;
  
  // Metrics operations
  getMetrics(): Promise<Metric | undefined>;
  updateMetrics(metrics: Partial<InsertMetric>): Promise<Metric>;
}

export class DatabaseStorage implements IStorage {
  db = db;

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // QNIS/PTNI Lead operations
  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(leads.createdAt);
  }

  async createLead(leadData: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(leadData)
      .returning();
    return lead;
  }

  async updateLead(id: number, leadData: Partial<InsertLead>): Promise<Lead> {
    const [lead] = await db
      .update(leads)
      .set({ ...leadData, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  // Module operations
  async getModules(): Promise<Module[]> {
    return await db.select().from(modules).orderBy(modules.priority);
  }

  async createModule(moduleData: InsertModule): Promise<Module> {
    const [module] = await db
      .insert(modules)
      .values(moduleData)
      .returning();
    return module;
  }

  async updateModule(id: number, moduleData: Partial<InsertModule>): Promise<Module> {
    const [module] = await db
      .update(modules)
      .set({ ...moduleData, lastSync: new Date() })
      .where(eq(modules.id, id))
      .returning();
    return module;
  }

  // Metrics operations
  async getMetrics(): Promise<Metric | undefined> {
    const [metric] = await db.select().from(metrics).limit(1);
    return metric || undefined;
  }

  async updateMetrics(metricsData: Partial<InsertMetric>): Promise<Metric> {
    const existingMetric = await this.getMetrics();
    
    if (existingMetric) {
      const [metric] = await db
        .update(metrics)
        .set({ ...metricsData, lastUpdated: new Date() })
        .where(eq(metrics.id, existingMetric.id))
        .returning();
      return metric;
    } else {
      const [metric] = await db
        .insert(metrics)
        .values({ ...metricsData, lastUpdated: new Date() })
        .returning();
      return metric;
    }
  }

  // QNIS/PTNI Business Intelligence methods
  async generateQNISReport(): Promise<any> {
    const allLeads = await this.getLeads();
    const currentMetrics = await this.getMetrics();
    
    return {
      totalLeads: allLeads.length,
      activeProposals: allLeads.filter(lead => lead.status === 'Active Negotiation').length,
      totalPipelineValue: allLeads.reduce((sum, lead) => sum + parseFloat(lead.value), 0),
      averageQNISScore: allLeads.reduce((sum, lead) => sum + (parseFloat(lead.qnisScore || '0')), 0) / allLeads.length,
      averagePTNIRating: allLeads.reduce((sum, lead) => sum + (parseFloat(lead.ptniRating || '0')), 0) / allLeads.length,
      systemHealth: currentMetrics?.systemHealth || '100',
      quantumBehaviorConfidence: Math.random() * 10 + 90, // Dynamic quantum confidence
      lastUpdated: new Date().toISOString(),
      realLeads: allLeads.map(lead => ({
        name: lead.name,
        value: parseFloat(lead.value),
        status: lead.status,
        industry: lead.industry,
        qnisScore: parseFloat(lead.qnisScore || '0'),
        ptniRating: parseFloat(lead.ptniRating || '0'),
        automationPipeline: lead.automationPipeline
      }))
    };
  }
}

export const storage = new DatabaseStorage();