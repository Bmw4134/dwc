import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { googleAPIAutomation } from "./google-api-automation";
import { WebSocketServer } from 'ws';
import { nexusMasterControl } from "./nexus-master-control";
import { nexusTotalRecall } from "./nexus-total-recall";
import { nexusReconciliation } from "./nexus-reconciliation";
import { dwSystemMonitor } from "./dw-system-monitor";
import { nexusObserverCore } from "./nexus-observer-core";
import { nexusUltraDevEngine } from "./nexus-ultradev-engine";
import { NEXUSDeploymentAudit } from "./nexus-deployment-audit";
import { qnisBehaviorSimulator } from "./qnis-behavior-simulator";
import { nexusProductionCore } from "./nexus-production-core";
import { stripePaymentEngine, LLC_PACKAGES } from "./stripe-payment-engine";
import path from "path";
import fs from "fs";

export async function registerConsultingRoutes(app: Express): Promise<Server> {
  
  // REMOVED STATIC HTML ROUTE TO ALLOW REACT APP TO LOAD
  
  // Dashboard Metrics API with Production Core Integration
  app.get('/api/dashboard/metrics', async (req, res) => {
    try {
      console.log('📊 DW Dashboard metrics requested');
      
      // Get real-time data from NEXUS Production Core
      const productionData = await nexusProductionCore.getLiveMetrics();
      
      const metrics = {
        totalLeads: productionData.leads.length,
        activeProposals: productionData.leads.filter(lead => lead.status.includes('Active')).length,
        monthlyRevenue: 100, // Static baseline
        conversionRate: 33.3,
        totalPipelineValue: productionData.totalPipelineValue,
        roiProven: productionData.roiProven,
        systemHealth: productionData.systemHealth,
        automationLinkage: productionData.automationLinkage,
        quantumBehaviorConfidence: Math.random() * 10 + 90, // Simulated confidence
        lastUpdated: new Date().toISOString(),
        dwSystemStatus: dwSystemMonitor.getSystemStatus(),
        realLeads: productionData.leads
      };
      
      console.log('📊 Dashboard metrics:', JSON.stringify(metrics, null, 2));
      res.json(metrics);
    } catch (error) {
      console.error('❌ Dashboard metrics error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
  });

  // LLC Packages API
  app.get('/api/llc-packages', async (req, res) => {
    try {
      res.json({ success: true, packages: LLC_PACKAGES });
    } catch (error) {
      console.error('❌ LLC packages error:', error);
      res.status(500).json({ error: 'Failed to fetch LLC packages' });
    }
  });

  // NEXUS System Status API
  app.get('/api/nexus/system-status', async (req, res) => {
    try {
      const status = await nexusMasterControl.getSystemStatus();
      console.log('🌌 NEXUS system status requested:', JSON.stringify(status, null, 2));
      res.json(status);
    } catch (error) {
      console.error('❌ NEXUS status error:', error);
      res.status(500).json({ error: 'Failed to fetch NEXUS status' });
    }
  });

  // QNIS/PTNI Core Intelligence API
  app.get('/api/qnis/core-intelligence', async (req, res) => {
    try {
      const intelligence = await qnisBehaviorSimulator.getCoreIntelligence();
      res.json({ success: true, data: intelligence });
    } catch (error) {
      console.error('❌ QNIS intelligence error:', error);
      res.status(500).json({ error: 'Failed to fetch QNIS intelligence' });
    }
  });

  // Historical Intelligence Data API
  app.get('/api/historical/intelligence', async (req, res) => {
    try {
      const historical = await nexusTotalRecall.getHistoricalIntelligence();
      res.json({ success: true, data: historical });
    } catch (error) {
      console.error('❌ Historical intelligence error:', error);
      res.status(500).json({ error: 'Failed to fetch historical intelligence' });
    }
  });

  // Return HTTP server without WebSocket conflicts
  const httpServer = createServer(app);
  return httpServer;
}