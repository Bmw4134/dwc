import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Legacy users table for existing business data
export const legacyUsers = pgTable("legacy_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("executive"), // executive, operational
  company: text("company"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Authentication users table for Replit Auth with Quantum Security
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").notNull().default("team_member"), // master_admin, admin, owner, team_member
  quantumSecurityLevel: integer("quantum_security_level").default(1), // 1-5 security clearance
  permissions: jsonb("permissions"), // Module access permissions
  watsonAccess: boolean("watson_access").default(false), // Master Watson control module access
  lastLogin: timestamp("last_login"),
  passwordResetRequired: boolean("password_reset_required").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Master login credentials table for secure access
export const masterLogins = pgTable("master_logins", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),
  displayName: varchar("display_name").notNull(),
  email: varchar("email").unique(),
  watsonAccess: boolean("watson_access").default(true),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  address: text("address").notNull(),
  zipCode: text("zip_code").notNull(),
  industry: text("industry").notNull(),
  employeeCount: integer("employee_count"),
  phoneNumber: text("phone_number"),
  website: text("website"),
  automationScore: integer("automation_score"), // 0-100
  estimatedSavings: decimal("estimated_savings", { precision: 10, scale: 2 }),
  priority: text("priority").notNull().default("medium"), // high, medium, low
  status: text("status").notNull().default("prospect"), // prospect, contacted, qualified, client
  painPoints: jsonb("pain_points"), // Array of identified pain points
  googlePlaceId: text("google_place_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  monthlyRevenue: decimal("monthly_revenue", { precision: 10, scale: 2 }),
  contractValue: decimal("contract_value", { precision: 10, scale: 2 }),
  implementationStatus: text("implementation_status").notNull().default("scoping"), // scoping, in_progress, active, completed
  monthlySavings: decimal("monthly_savings", { precision: 10, scale: 2 }),
  automations: jsonb("automations"), // Array of active automations
  startDate: timestamp("start_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const automations = pgTable("automations", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // data_entry, reporting, scheduling, inventory, etc.
  timeSaved: integer("time_saved"), // hours per month
  costSavings: decimal("cost_savings", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  workflow: jsonb("workflow"), // Automation workflow definition
  createdAt: timestamp("created_at").defaultNow(),
});

export const roiCalculations = pgTable("roi_calculations", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  industry: text("industry").notNull(),
  employeeCount: integer("employee_count").notNull(),
  monthlyLaborCost: decimal("monthly_labor_cost", { precision: 10, scale: 2 }),
  automationPercentage: decimal("automation_percentage", { precision: 5, scale: 2 }),
  monthlySavings: decimal("monthly_savings", { precision: 10, scale: 2 }),
  annualSavings: decimal("annual_savings", { precision: 10, scale: 2 }),
  implementationCost: decimal("implementation_cost", { precision: 10, scale: 2 }),
  monthlyServiceFee: decimal("monthly_service_fee", { precision: 10, scale: 2 }),
  roiPercentage: decimal("roi_percentage", { precision: 8, scale: 2 }),
  breakEvenMonths: decimal("break_even_months", { precision: 4, scale: 1 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // recommendation, pattern, alert
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("medium"),
  data: jsonb("data"), // Additional insight data
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  activeLeads: integer("active_leads"),
  monthlySavings: decimal("monthly_savings", { precision: 12, scale: 2 }),
  activeAutomations: integer("active_automations"),
  roiRate: decimal("roi_rate", { precision: 5, scale: 2 }),
  apiCalls: integer("api_calls"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const insertAutomationSchema = createInsertSchema(automations).omit({
  id: true,
  createdAt: true,
});

export const insertRoiCalculationSchema = createInsertSchema(roiCalculations).omit({
  id: true,
  createdAt: true,
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export const insertSystemMetricsSchema = createInsertSchema(systemMetrics).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Automation = typeof automations.$inferSelect;
export type InsertAutomation = z.infer<typeof insertAutomationSchema>;

export type RoiCalculation = typeof roiCalculations.$inferSelect;
export type InsertRoiCalculation = z.infer<typeof insertRoiCalculationSchema>;

export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;

export type SystemMetrics = typeof systemMetrics.$inferSelect;
export type InsertSystemMetrics = z.infer<typeof insertSystemMetricsSchema>;

// Authentication schema types
export type UpsertUser = typeof users.$inferInsert;
export type UserAccount = typeof users.$inferSelect;

export type InsertMasterLogin = typeof masterLogins.$inferInsert;
export type MasterLogin = typeof masterLogins.$inferSelect;

// Trading Strategy tables
export const tradingStrategies = pgTable("trading_strategies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'conservative', 'moderate', 'aggressive'
  riskLevel: integer("risk_level").notNull(),
  expectedReturn: decimal("expected_return", { precision: 5, scale: 2 }).notNull(),
  timeframe: text("timeframe").notNull(),
  description: text("description").notNull(),
  indicators: text("indicators").array().notNull(),
  stopLoss: decimal("stop_loss", { precision: 5, scale: 2 }).notNull(),
  takeProfit: decimal("take_profit", { precision: 5, scale: 2 }).notNull(),
  allocation: decimal("allocation", { precision: 5, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const portfolios = pgTable("portfolios", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull(),
  capitalAllocation: decimal("capital_allocation", { precision: 15, scale: 2 }).notNull(),
  riskTolerance: integer("risk_tolerance").notNull(),
  timeHorizon: text("time_horizon").notNull(),
  strategies: text("strategies").array().notNull(), // Array of strategy IDs
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fleetVehicles = pgTable("fleet_vehicles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // truck, van, car, motorcycle
  status: text("status").notNull(), // active, maintenance, offline
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  heading: decimal("heading", { precision: 5, scale: 2 }).notNull(), // degrees 0-360
  speed: decimal("speed", { precision: 5, scale: 2 }).notNull(), // mph
  fuel: decimal("fuel", { precision: 5, scale: 2 }).notNull(), // percentage 0-100
  lastUpdate: timestamp("last_update").defaultNow(),
  route: text("route"),
  destination: text("destination"),
  driver: text("driver"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTradingStrategySchema = createInsertSchema(tradingStrategies);
export const insertPortfolioSchema = createInsertSchema(portfolios);
export const insertFleetVehicleSchema = createInsertSchema(fleetVehicles);

export type InsertTradingStrategy = z.infer<typeof insertTradingStrategySchema>;
export type TradingStrategy = typeof tradingStrategies.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertFleetVehicle = z.infer<typeof insertFleetVehicleSchema>;
export type FleetVehicle = typeof fleetVehicles.$inferSelect;
