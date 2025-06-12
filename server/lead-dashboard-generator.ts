import fs from 'fs';
import path from 'path';

interface LeadData {
  id: string;
  slug: string;
  email: string;
  company: string;
  firstName: string;
  lastName: string;
  phone?: string;
  industry: string;
  companySize: string;
  interestLevel: string;
  source: string;
  capturedAt: Date;
  lastInteraction?: Date;
  interactions: LeadInteraction[];
  qnisScore?: number;
  leadVelocity?: number;
  dealProbability?: number;
}

interface LeadInteraction {
  type: string;
  timestamp: Date;
  details: string;
  value: number;
}

interface QNISMetrics {
  quality: number;
  need: number;
  interest: number;
  scale: number;
  overall: number;
}

export class LeadDashboardGenerator {
  private dashboardsDir = path.join(process.cwd(), 'dashboards');
  private configsDir = path.join(process.cwd(), 'configs');

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.dashboardsDir)) {
      fs.mkdirSync(this.dashboardsDir, { recursive: true });
    }
  }

  async generateDashboard(leadData: LeadData): Promise<string> {
    const qnisMetrics = this.calculateQNISScore(leadData);
    const leadVelocity = this.calculateLeadVelocity(leadData);
    const lastInteraction = this.getLastInteractionTime(leadData);
    
    leadData.qnisScore = qnisMetrics.overall;
    leadData.leadVelocity = leadVelocity;

    const dashboardContent = this.generateDashboardComponent(leadData, qnisMetrics, leadVelocity, lastInteraction);
    const dashboardPath = path.join(this.dashboardsDir, `${leadData.slug}.jsx`);
    
    fs.writeFileSync(dashboardPath, dashboardContent);
    
    await this.logDashboardCreation(leadData, dashboardPath);
    
    return `/dashboards/${leadData.slug}`;
  }

  private calculateQNISScore(leadData: LeadData): QNISMetrics {
    // Quality Score (0-100) - based on completeness and company profile
    let quality = 50;
    if (leadData.email && leadData.email.includes('@')) quality += 15;
    if (leadData.company && leadData.company.length > 2) quality += 15;
    if (leadData.phone) quality += 10;
    if (leadData.industry && leadData.industry !== 'unknown') quality += 10;

    // Need Score (0-100) - based on industry and company size
    let need = 40;
    const highNeedIndustries = ['technology', 'finance', 'healthcare', 'manufacturing'];
    if (highNeedIndustries.includes(leadData.industry.toLowerCase())) need += 25;
    
    const companySizeScores: { [key: string]: number } = {
      'startup': 60,
      'small': 70,
      'medium': 85,
      'large': 95,
      'enterprise': 100
    };
    need = Math.max(need, companySizeScores[leadData.companySize.toLowerCase()] || 40);

    // Interest Score (0-100) - based on interaction level and source
    let interest = 30;
    const interestLevelScores: { [key: string]: number } = {
      'low': 30,
      'medium': 60,
      'high': 85,
      'very_high': 95
    };
    interest = interestLevelScores[leadData.interestLevel.toLowerCase()] || 30;
    
    // Boost for premium sources
    if (['demo_request', 'consultation_request', 'pricing_inquiry'].includes(leadData.source)) {
      interest += 15;
    }

    // Scale Score (0-100) - potential deal size based on company profile
    let scale = 40;
    const companySizeScale: { [key: string]: number } = {
      'startup': 40,
      'small': 55,
      'medium': 70,
      'large': 85,
      'enterprise': 95
    };
    scale = companySizeScale[leadData.companySize.toLowerCase()] || 40;

    // Add interaction bonus
    if (leadData.interactions && leadData.interactions.length > 0) {
      const interactionBonus = Math.min(leadData.interactions.length * 5, 20);
      quality += interactionBonus;
      interest += interactionBonus;
    }

    // Calculate overall QNIS score
    const overall = Math.round((quality + need + interest + scale) / 4);

    return {
      quality: Math.min(quality, 100),
      need: Math.min(need, 100),
      interest: Math.min(interest, 100),
      scale: Math.min(scale, 100),
      overall: Math.min(overall, 100)
    };
  }

  private calculateLeadVelocity(leadData: LeadData): number {
    if (!leadData.interactions || leadData.interactions.length < 2) {
      return 0;
    }

    const now = new Date();
    const capturedDate = new Date(leadData.capturedAt);
    const daysSinceCaptured = (now.getTime() - capturedDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceCaptured <= 0) return 0;

    const interactionCount = leadData.interactions.length;
    const velocity = (interactionCount / daysSinceCaptured) * 7; // Weekly velocity
    
    return Math.round(velocity * 10) / 10;
  }

  private getLastInteractionTime(leadData: LeadData): string {
    if (!leadData.interactions || leadData.interactions.length === 0) {
      return 'No interactions';
    }

    const lastInteraction = leadData.interactions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    const now = new Date();
    const lastTime = new Date(lastInteraction.timestamp);
    const diffHours = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours < 24) return `${Math.round(diffHours)} hours ago`;
    if (diffHours < 168) return `${Math.round(diffHours / 24)} days ago`;
    return `${Math.round(diffHours / 168)} weeks ago`;
  }

  private generateDashboardComponent(leadData: LeadData, qnisMetrics: QNISMetrics, leadVelocity: number, lastInteraction: string): string {
    return `import { useState, useEffect } from 'react';

export default function Lead${leadData.slug.charAt(0).toUpperCase() + leadData.slug.slice(1)}Dashboard() {
  const [leadStatus, setLeadStatus] = useState('active');
  const [isHot, setIsHot] = useState(${qnisMetrics.overall >= 80});
  const [followUpScheduled, setFollowUpScheduled] = useState(false);

  const leadData = ${JSON.stringify(leadData, null, 2)};
  const qnisMetrics = ${JSON.stringify(qnisMetrics, null, 2)};

  const handleMarkAsHot = async () => {
    try {
      const response = await fetch('/api/leads/mark-hot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: leadData.id, isHot: !isHot })
      });
      
      if (response.ok) {
        setIsHot(!isHot);
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const handleAutoFollowUp = async () => {
    try {
      const response = await fetch('/api/leads/auto-follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: leadData.id })
      });
      
      if (response.ok) {
        setFollowUpScheduled(true);
        setTimeout(() => setFollowUpScheduled(false), 3000);
      }
    } catch (error) {
      console.error('Failed to schedule follow-up:', error);
    }
  };

  const handleConvertToDeal = async () => {
    try {
      const response = await fetch('/api/leads/convert-to-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: leadData.id })
      });
      
      if (response.ok) {
        setLeadStatus('converted');
        window.location.href = '/deals/' + leadData.id;
      }
    } catch (error) {
      console.error('Failed to convert lead:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {leadData.firstName} {leadData.lastName}
              </h1>
              <p className="text-gray-400">{leadData.company} • {leadData.industry}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/30">
                QNIS: {qnisMetrics.overall}
              </div>
              {isHot && (
                <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  🔥 Hot Lead
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Quality</h3>
              <span className="text-2xl font-bold text-green-400">
                {qnisMetrics.quality}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                style={{ width: \`\${qnisMetrics.quality}%\` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Need</h3>
              <span className="text-2xl font-bold text-purple-400">
                {qnisMetrics.need}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                style={{ width: \`\${qnisMetrics.need}%\` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Interest</h3>
              <span className="text-2xl font-bold text-yellow-400">
                {qnisMetrics.interest}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" 
                style={{ width: \`\${qnisMetrics.interest}%\` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Scale</h3>
              <span className="text-2xl font-bold text-cyan-400">
                {qnisMetrics.scale}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full" 
                style={{ width: \`\${qnisMetrics.scale}%\` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleMarkAsHot}
            className={\`py-4 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 \${
              isHot 
                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
            }\`}
          >
            {isHot ? '🔥 Remove Hot Status' : '🔥 Mark as Hot'}
          </button>

          <button
            onClick={handleAutoFollowUp}
            disabled={followUpScheduled}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {followUpScheduled ? '✓ Follow-Up Scheduled' : '📧 Auto Follow-Up'}
          </button>

          <button
            onClick={handleConvertToDeal}
            disabled={leadStatus === 'converted'}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {leadStatus === 'converted' ? '✓ Converted to Deal' : '💰 Convert to Deal'}
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Lead Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-4">Contact Details</h4>
              <div className="space-y-2 text-gray-400">
                <p><span className="text-white">Email:</span> {leadData.email}</p>
                {leadData.phone && <p><span className="text-white">Phone:</span> {leadData.phone}</p>}
                <p><span className="text-white">Company Size:</span> {leadData.companySize}</p>
                <p><span className="text-white">Interest Level:</span> {leadData.interestLevel}</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-4">Engagement History</h4>
              <div className="space-y-2 text-gray-400">
                <p><span className="text-white">Captured:</span> {new Date(leadData.capturedAt).toLocaleDateString()}</p>
                <p><span className="text-white">Total Interactions:</span> {leadData.interactions?.length || 0}</p>
                <p><span className="text-white">Conversion Probability:</span> {Math.round(qnisMetrics.overall * 0.8)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;
  }

  private async logDashboardCreation(leadData: LeadData, dashboardPath: string): Promise<void> {
    const logEntry = {
      leadId: leadData.id,
      slug: leadData.slug,
      dashboardUrl: `/dashboards/${leadData.slug}`,
      qnisScore: leadData.qnisScore,
      leadVelocity: leadData.leadVelocity,
      createdAt: new Date().toISOString(),
      filePath: dashboardPath
    };

    // Log to lead_log.json
    const leadLogPath = path.join(this.configsDir, 'lead_log.json');
    let leadLog = { leads: [] as any[] };
    
    if (fs.existsSync(leadLogPath)) {
      const existingLog = fs.readFileSync(leadLogPath, 'utf8');
      leadLog = JSON.parse(existingLog);
    }
    
    leadLog.leads.push(logEntry);
    fs.writeFileSync(leadLogPath, JSON.stringify(leadLog, null, 2));

    // Update goal_tracker.json
    await this.updateGoalTracker(leadData);
  }

  private async updateGoalTracker(leadData: LeadData): Promise<void> {
    const goalTrackerPath = path.join(this.configsDir, 'goal_tracker.json');
    
    if (fs.existsSync(goalTrackerPath)) {
      const goalTracker = JSON.parse(fs.readFileSync(goalTrackerPath, 'utf8'));
      
      if (!goalTracker.enhanced_leads) {
        goalTracker.enhanced_leads = [];
      }
      
      goalTracker.enhanced_leads.push({
        leadId: leadData.id,
        company: leadData.company,
        qnisScore: leadData.qnisScore,
        status: "🧠 Enhanced",
        enhancedAt: new Date().toISOString()
      });
      
      goalTracker.completion_status.lead_enhancement = "✅ ACTIVE";
      goalTracker.last_updated = new Date().toISOString();
      
      fs.writeFileSync(goalTrackerPath, JSON.stringify(goalTracker, null, 2));
    }
  }

  async processNewLead(leadData: Partial<LeadData>): Promise<string> {
    // Generate slug from company name and timestamp
    const slug = this.generateSlug(leadData.company || 'unknown', leadData.email || '');
    
    const fullLeadData: LeadData = {
      id: leadData.id || `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slug,
      email: leadData.email || '',
      company: leadData.company || '',
      firstName: leadData.firstName || '',
      lastName: leadData.lastName || '',
      phone: leadData.phone,
      industry: leadData.industry || 'unknown',
      companySize: leadData.companySize || 'unknown',
      interestLevel: leadData.interestLevel || 'medium',
      source: leadData.source || 'website',
      capturedAt: leadData.capturedAt || new Date(),
      interactions: leadData.interactions || []
    };

    return await this.generateDashboard(fullLeadData);
  }

  private generateSlug(company: string, email: string): string {
    const baseSlug = company
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const emailPrefix = email.split('@')[0].toLowerCase();
    const timestamp = Date.now().toString().slice(-6);
    
    return `${baseSlug}-${emailPrefix}-${timestamp}`;
  }
}

export const leadDashboardGenerator = new LeadDashboardGenerator();