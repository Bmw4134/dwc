import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

// Users table for system access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// QNIS/PTNI leads and intelligence data
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 100 }).notNull(),
  industry: varchar("industry", { length: 255 }),
  contactInfo: jsonb("contact_info"),
  automationPipeline: jsonb("automation_pipeline"),
  location: jsonb("location"),
  qnisScore: decimal("qnis_score", { precision: 5, scale: 2 }),
  ptniRating: decimal("ptni_rating", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// System modules for NEXUS platform
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  moduleId: varchar("module_id", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(5),
  config: jsonb("config"),
  lastSync: timestamp("last_sync").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Performance metrics for dashboard
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  totalLeads: integer("total_leads").default(0),
  activeProposals: integer("active_proposals").default(0),
  monthlyRevenue: decimal("monthly_revenue", { precision: 12, scale: 2 }).default("0"),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0"),
  totalPipelineValue: decimal("total_pipeline_value", { precision: 15, scale: 2 }).default("0"),
  roiProven: decimal("roi_proven", { precision: 8, scale: 2 }).default("0"),
  systemHealth: decimal("system_health", { precision: 5, scale: 2 }).default("100"),
  automationLinkage: decimal("automation_linkage", { precision: 5, scale: 2 }).default("100"),
  quantumBehaviorConfidence: decimal("quantum_behavior_confidence", { precision: 8, scale: 5 }).default("95"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = typeof metrics.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
});

export const insertMetricSchema = createInsertSchema(metrics).omit({
  id: true,
  lastUpdated: true,
});

export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertLeadType = z.infer<typeof insertLeadSchema>;
export type InsertModuleType = z.infer<typeof insertModuleSchema>;
export type InsertMetricType = z.infer<typeof insertMetricSchema>;