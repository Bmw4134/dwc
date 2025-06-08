// Client-side OpenAI utilities and types
export interface AutomationAnalysis {
  automationScore: number;
  estimatedSavings: number;
  painPoints: string[];
  priority: 'high' | 'medium' | 'low';
  recommendations: string[];
}

export interface BusinessInsight {
  type: 'opportunity' | 'risk' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
}

export const automationCategories = {
  'Data Entry': {
    description: 'Automated data input and validation',
    avgTimeSavings: 15, // hours per month
    avgCostSavings: 750, // dollars per month
    difficulty: 'low' as const,
  },
  'Report Generation': {
    description: 'Automated report creation and distribution',
    avgTimeSavings: 12,
    avgCostSavings: 600,
    difficulty: 'medium' as const,
  },
  'Email Marketing': {
    description: 'Automated email campaigns and follow-ups',
    avgTimeSavings: 8,
    avgCostSavings: 400,
    difficulty: 'low' as const,
  },
  'Inventory Management': {
    description: 'Automated stock tracking and ordering',
    avgTimeSavings: 20,
    avgCostSavings: 1000,
    difficulty: 'medium' as const,
  },
  'Customer Scheduling': {
    description: 'Automated appointment booking and reminders',
    avgTimeSavings: 10,
    avgCostSavings: 500,
    difficulty: 'low' as const,
  },
  'Invoice Processing': {
    description: 'Automated invoice generation and payment tracking',
    avgTimeSavings: 18,
    avgCostSavings: 900,
    difficulty: 'medium' as const,
  },
  'Customer Support': {
    description: 'AI-powered chatbots and ticket routing',
    avgTimeSavings: 25,
    avgCostSavings: 1250,
    difficulty: 'high' as const,
  },
  'Social Media Management': {
    description: 'Automated posting and engagement tracking',
    avgTimeSavings: 6,
    avgCostSavings: 300,
    difficulty: 'low' as const,
  },
};

export const industrySpecificAutomations = {
  'Healthcare': [
    'Patient Scheduling',
    'Insurance Verification',
    'Medical Records Management',
    'Appointment Reminders',
    'Billing Automation',
  ],
  'Legal Services': [
    'Document Processing',
    'Client Intake',
    'Time Tracking',
    'Court Date Management',
    'Contract Review',
  ],
  'Manufacturing': [
    'Inventory Management',
    'Quality Control Reporting',
    'Supply Chain Optimization',
    'Production Scheduling',
    'Equipment Monitoring',
  ],
  'Retail': [
    'Inventory Management',
    'Customer Support',
    'Order Processing',
    'Price Monitoring',
    'Marketing Automation',
  ],
  'Automotive': [
    'Service Scheduling',
    'Inventory Management',
    'Customer Follow-up',
    'Parts Ordering',
    'Warranty Tracking',
  ],
  'Real Estate': [
    'Lead Management',
    'Property Listing Automation',
    'Client Communication',
    'Document Processing',
    'Market Analysis',
  ],
};

export function calculateAutomationPotential(
  industry: string,
  employeeCount: number,
  currentProcesses: string[]
): AutomationAnalysis {
  const industryAutomations = industrySpecificAutomations[industry as keyof typeof industrySpecificAutomations] || [];
  const applicableProcesses = currentProcesses.filter(process => 
    industryAutomations.some(automation => 
      automation.toLowerCase().includes(process.toLowerCase()) ||
      process.toLowerCase().includes(automation.toLowerCase())
    )
  );

  const totalPotentialSavings = applicableProcesses.reduce((sum, process) => {
    const category = Object.entries(automationCategories).find(([key]) => 
      key.toLowerCase().includes(process.toLowerCase()) ||
      process.toLowerCase().includes(key.toLowerCase())
    );
    return sum + (category ? category[1].avgCostSavings : 500);
  }, 0);

  const automationScore = Math.min(100, 
    (applicableProcesses.length / industryAutomations.length) * 100 +
    Math.min(30, employeeCount * 2) // Employee count factor
  );

  const priority = automationScore >= 80 ? 'high' : 
                   automationScore >= 60 ? 'medium' : 'low';

  return {
    automationScore: Math.round(automationScore),
    estimatedSavings: totalPotentialSavings,
    painPoints: applicableProcesses,
    priority,
    recommendations: generateRecommendations(industry, applicableProcesses, employeeCount),
  };
}

function generateRecommendations(
  industry: string,
  processes: string[],
  employeeCount: number
): string[] {
  const recommendations = [];

  if (processes.length === 0) {
    recommendations.push('Conduct detailed process audit to identify automation opportunities');
  }

  if (employeeCount > 50) {
    recommendations.push('Consider enterprise-grade automation solutions');
  } else if (employeeCount < 10) {
    recommendations.push('Start with simple, high-impact automations');
  }

  if (processes.includes('Data Entry') || processes.includes('Manual Reporting')) {
    recommendations.push('Prioritize data automation for immediate ROI');
  }

  if (industry === 'Healthcare') {
    recommendations.push('Focus on patient experience automation to improve satisfaction');
  } else if (industry === 'Legal Services') {
    recommendations.push('Document automation can provide significant time savings');
  }

  return recommendations;
}

export function generateBusinessInsights(
  leads: any[],
  clients: any[],
  recentActivity: any[]
): BusinessInsight[] {
  const insights: BusinessInsight[] = [];

  // Analyze lead conversion patterns
  const highPriorityLeads = leads.filter(lead => lead.priority === 'high');
  if (highPriorityLeads.length > 5) {
    insights.push({
      type: 'opportunity',
      title: 'High-Priority Lead Surge',
      description: `${highPriorityLeads.length} high-priority leads identified. Focus resources on conversion.`,
      impact: 'high',
      actionRequired: true,
    });
  }

  // Analyze industry trends
  const industryCount = leads.reduce((acc, lead) => {
    acc[lead.industry] = (acc[lead.industry] || 0) + 1;
    return acc;
  }, {});

  const topIndustry = Object.entries(industryCount)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0];

  if (topIndustry && (topIndustry[1] as number) > 3) {
    insights.push({
      type: 'trend',
      title: `${topIndustry[0]} Sector Opportunity`,
      description: `${topIndustry[1]} prospects in ${topIndustry[0]}. Consider industry-specific marketing.`,
      impact: 'medium',
      actionRequired: false,
    });
  }

  // Analyze client satisfaction
  const activeClients = clients.filter(client => client.implementationStatus === 'active');
  if (activeClients.length > 0) {
    const avgSavings = activeClients.reduce((sum, client) => 
      sum + parseFloat(client.monthlySavings || '0'), 0) / activeClients.length;
    
    if (avgSavings > 8000) {
      insights.push({
        type: 'opportunity',
        title: 'High Client Value Achieved',
        description: `Average monthly savings of $${avgSavings.toFixed(0)} per client. Use as case studies.`,
        impact: 'high',
        actionRequired: false,
      });
    }
  }

  return insights;
}
