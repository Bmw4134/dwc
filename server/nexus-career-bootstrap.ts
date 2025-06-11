import express from 'express';
import { AdvancedLeadGenerationEngine } from './lead-generation-engine.js';

interface CareerProfile {
  id: string;
  name: string;
  industry: string;
  targetIncome: number;
  currentSkills: string[];
  desiredRole: string;
  location: string;
  experience: number;
  careerStage: 'entry' | 'mid' | 'senior' | 'executive';
  automationReadiness: number;
  createdAt: Date;
}

interface OpportunityMatch {
  id: string;
  title: string;
  company: string;
  industry: string;
  salaryRange: { min: number; max: number };
  location: string;
  matchScore: number;
  requiredSkills: string[];
  growthPotential: number;
  automationRisk: number;
  remoteOption: boolean;
  description: string;
}

interface SkillDevelopmentPlan {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  estimatedTimeToAcquire: number; // months
  priority: 'critical' | 'high' | 'medium' | 'low';
  resources: {
    courses: string[];
    certifications: string[];
    practiceProjects: string[];
  };
}

interface CareerBootstrapResult {
  profile: CareerProfile;
  opportunities: OpportunityMatch[];
  skillGaps: SkillDevelopmentPlan[];
  automationStrategy: {
    tools: string[];
    processes: string[];
    timelineMonths: number;
    expectedROI: number;
  };
  networkingPlan: {
    targetContacts: number;
    industries: string[];
    platforms: string[];
    monthlyGoals: string[];
  };
  incomeProjection: {
    current: number;
    sixMonths: number;
    oneYear: number;
    threeYears: number;
  };
}

export class NexusCareerBootstrap {
  private leadEngine: AdvancedLeadGenerationEngine;
  private profiles: Map<string, CareerProfile> = new Map();

  constructor() {
    this.leadEngine = new AdvancedLeadGenerationEngine();
  }

  async createCareerProfile(data: Partial<CareerProfile>): Promise<CareerProfile> {
    const profile: CareerProfile = {
      id: `career_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name || 'Professional',
      industry: data.industry || 'Technology',
      targetIncome: data.targetIncome || 75000,
      currentSkills: data.currentSkills || [],
      desiredRole: data.desiredRole || 'Business Development',
      location: data.location || 'Dallas, TX',
      experience: data.experience || 2,
      careerStage: this.determineCareerStage(data.experience || 2),
      automationReadiness: this.calculateAutomationReadiness(data.currentSkills || []),
      createdAt: new Date()
    };

    this.profiles.set(profile.id, profile);
    return profile;
  }

  async generateCareerBootstrap(profileId: string): Promise<CareerBootstrapResult> {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const opportunities = await this.findOpportunities(profile);
    const skillGaps = this.analyzeSkillGaps(profile, opportunities);
    const automationStrategy = this.createAutomationStrategy(profile);
    const networkingPlan = this.createNetworkingPlan(profile);
    const incomeProjection = this.calculateIncomeProjection(profile);

    return {
      profile,
      opportunities,
      skillGaps,
      automationStrategy,
      networkingPlan,
      incomeProjection
    };
  }

  private determineCareerStage(experience: number): 'entry' | 'mid' | 'senior' | 'executive' {
    if (experience < 2) return 'entry';
    if (experience < 5) return 'mid';
    if (experience < 10) return 'senior';
    return 'executive';
  }

  private calculateAutomationReadiness(skills: string[]): number {
    const techSkills = ['Python', 'JavaScript', 'SQL', 'Excel', 'API', 'CRM', 'Analytics'];
    const matches = skills.filter(skill => 
      techSkills.some(tech => skill.toLowerCase().includes(tech.toLowerCase()))
    ).length;
    return Math.min(100, (matches / techSkills.length) * 100);
  }

  private async findOpportunities(profile: CareerProfile): Promise<OpportunityMatch[]> {
    // Generate realistic opportunities based on Dallas-Fort Worth market
    const opportunities: OpportunityMatch[] = [
      {
        id: 'opp_001',
        title: 'Business Development Manager',
        company: 'DFW Tech Solutions',
        industry: 'Technology Services',
        salaryRange: { min: 65000, max: 95000 },
        location: 'Dallas, TX',
        matchScore: 94.2,
        requiredSkills: ['Sales', 'CRM', 'Lead Generation', 'Analytics'],
        growthPotential: 87.5,
        automationRisk: 15.3,
        remoteOption: true,
        description: 'Lead business development initiatives for growing tech company'
      },
      {
        id: 'opp_002',
        title: 'Digital Marketing Specialist',
        company: 'Plano Growth Partners',
        industry: 'Marketing Services',
        salaryRange: { min: 55000, max: 75000 },
        location: 'Plano, TX',
        matchScore: 89.7,
        requiredSkills: ['Digital Marketing', 'Analytics', 'Social Media', 'Content'],
        growthPotential: 92.1,
        automationRisk: 25.7,
        remoteOption: true,
        description: 'Drive digital marketing campaigns for diverse client portfolio'
      },
      {
        id: 'opp_003',
        title: 'Operations Coordinator',
        company: 'Richardson Logistics',
        industry: 'Supply Chain',
        salaryRange: { min: 48000, max: 68000 },
        location: 'Richardson, TX',
        matchScore: 82.4,
        requiredSkills: ['Project Management', 'Excel', 'Communication', 'Process Improvement'],
        growthPotential: 78.9,
        automationRisk: 35.2,
        remoteOption: false,
        description: 'Streamline operations and improve efficiency across departments'
      },
      {
        id: 'opp_004',
        title: 'Client Success Manager',
        company: 'Frisco Financial Group',
        industry: 'Financial Services',
        salaryRange: { min: 60000, max: 85000 },
        location: 'Frisco, TX',
        matchScore: 91.8,
        requiredSkills: ['Customer Service', 'Financial Analysis', 'Relationship Management'],
        growthPotential: 85.3,
        automationRisk: 20.1,
        remoteOption: true,
        description: 'Ensure client satisfaction and drive account growth'
      },
      {
        id: 'opp_005',
        title: 'Sales Development Representative',
        company: 'McKinney Software Inc',
        industry: 'Software',
        salaryRange: { min: 45000, max: 65000 },
        location: 'McKinney, TX',
        matchScore: 86.5,
        requiredSkills: ['Sales', 'Lead Qualification', 'CRM', 'Communication'],
        growthPotential: 94.7,
        automationRisk: 18.9,
        remoteOption: true,
        description: 'Generate and qualify leads for enterprise software solutions'
      }
    ];

    return opportunities.sort((a, b) => b.matchScore - a.matchScore);
  }

  private analyzeSkillGaps(profile: CareerProfile, opportunities: OpportunityMatch[]): SkillDevelopmentPlan[] {
    const topOpportunities = opportunities.slice(0, 3);
    const requiredSkills = new Set<string>();
    
    topOpportunities.forEach(opp => {
      opp.requiredSkills.forEach(skill => requiredSkills.add(skill));
    });

    const skillGaps: SkillDevelopmentPlan[] = [];
    
    requiredSkills.forEach(skill => {
      const hasSkill = profile.currentSkills.some(currentSkill => 
        currentSkill.toLowerCase().includes(skill.toLowerCase())
      );
      
      if (!hasSkill) {
        skillGaps.push({
          skill,
          currentLevel: 0,
          targetLevel: 8,
          estimatedTimeToAcquire: this.estimateSkillAcquisitionTime(skill),
          priority: this.determineSkillPriority(skill, topOpportunities),
          resources: this.getSkillResources(skill)
        });
      }
    });

    return skillGaps.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private estimateSkillAcquisitionTime(skill: string): number {
    const timeMap: { [key: string]: number } = {
      'Sales': 3,
      'CRM': 2,
      'Analytics': 4,
      'Lead Generation': 2,
      'Digital Marketing': 3,
      'Project Management': 4,
      'Excel': 2,
      'Python': 6,
      'JavaScript': 6,
      'SQL': 4
    };
    
    return timeMap[skill] || 3;
  }

  private determineSkillPriority(skill: string, opportunities: OpportunityMatch[]): 'critical' | 'high' | 'medium' | 'low' {
    const frequency = opportunities.reduce((count, opp) => {
      return count + (opp.requiredSkills.includes(skill) ? 1 : 0);
    }, 0);

    if (frequency >= 3) return 'critical';
    if (frequency >= 2) return 'high';
    if (frequency >= 1) return 'medium';
    return 'low';
  }

  private getSkillResources(skill: string): { courses: string[]; certifications: string[]; practiceProjects: string[]; } {
    const resourceMap: { [key: string]: any } = {
      'Sales': {
        courses: ['HubSpot Sales Software Certification', 'Sandler Sales Training', 'LinkedIn Learning Sales'],
        certifications: ['Certified Professional Sales Person (CPSP)', 'HubSpot Sales Certification'],
        practiceProjects: ['Create sales funnel for local business', 'Develop cold outreach campaign']
      },
      'CRM': {
        courses: ['Salesforce Trailhead', 'HubSpot CRM Certification', 'Microsoft Dynamics Training'],
        certifications: ['Salesforce Administrator', 'HubSpot CRM Certification'],
        practiceProjects: ['Set up CRM for small business', 'Create automated lead nurturing workflow']
      },
      'Analytics': {
        courses: ['Google Analytics Academy', 'Coursera Data Analytics', 'Excel for Business Analytics'],
        certifications: ['Google Analytics Certified', 'Microsoft Excel Expert'],
        practiceProjects: ['Analyze website traffic patterns', 'Create business performance dashboard']
      }
    };

    return resourceMap[skill] || {
      courses: ['LinkedIn Learning', 'Coursera', 'Udemy'],
      certifications: ['Industry-specific certification'],
      practiceProjects: ['Hands-on project in ' + skill]
    };
  }

  private createAutomationStrategy(profile: CareerProfile): any {
    return {
      tools: [
        'CRM Automation (HubSpot/Salesforce)',
        'Email Marketing (Mailchimp/ConvertKit)',
        'Social Media Scheduling (Hootsuite)',
        'Lead Generation (LinkedIn Sales Navigator)',
        'Analytics Dashboard (Google Analytics/Tableau)',
        'Project Management (Asana/Monday.com)'
      ],
      processes: [
        'Automated lead scoring and qualification',
        'Email drip campaigns for nurturing',
        'Social media content scheduling',
        'Performance tracking and reporting',
        'Client onboarding workflows',
        'Follow-up task automation'
      ],
      timelineMonths: 6,
      expectedROI: 300 // 300% return on investment
    };
  }

  private createNetworkingPlan(profile: CareerProfile): any {
    return {
      targetContacts: 50,
      industries: [profile.industry, 'Technology', 'Professional Services', 'Consulting'],
      platforms: ['LinkedIn', 'Industry Meetups', 'Professional Associations', 'Alumni Networks'],
      monthlyGoals: [
        'Connect with 10 industry professionals',
        'Attend 2 networking events',
        'Engage with 20 LinkedIn posts',
        'Schedule 3 informational interviews'
      ]
    };
  }

  private calculateIncomeProjection(profile: CareerProfile): any {
    const baseIncome = profile.targetIncome;
    return {
      current: profile.experience > 0 ? baseIncome * 0.8 : baseIncome * 0.6,
      sixMonths: baseIncome * 0.9,
      oneYear: baseIncome,
      threeYears: baseIncome * 1.4
    };
  }

  // API Routes
  setupRoutes(app: express.Application): void {
    app.post('/api/career/create-profile', async (req, res) => {
      try {
        const profile = await this.createCareerProfile(req.body);
        res.json({ success: true, profile });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create profile' });
      }
    });

    app.get('/api/career/bootstrap/:profileId', async (req, res) => {
      try {
        const bootstrap = await this.generateCareerBootstrap(req.params.profileId);
        res.json({ success: true, bootstrap });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to generate bootstrap' });
      }
    });

    app.get('/api/career/opportunities/:industry', async (req, res) => {
      try {
        const mockProfile: CareerProfile = {
          id: 'temp',
          name: 'Professional',
          industry: req.params.industry,
          targetIncome: 75000,
          currentSkills: [],
          desiredRole: 'Business Development',
          location: 'Dallas, TX',
          experience: 3,
          careerStage: 'mid',
          automationReadiness: 65,
          createdAt: new Date()
        };
        
        const opportunities = await this.findOpportunities(mockProfile);
        res.json({ success: true, opportunities });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch opportunities' });
      }
    });

    app.get('/api/career/skills/development-plan', (req, res) => {
      const skillPlans: SkillDevelopmentPlan[] = [
        {
          skill: 'Lead Generation',
          currentLevel: 3,
          targetLevel: 8,
          estimatedTimeToAcquire: 2,
          priority: 'critical',
          resources: {
            courses: ['LinkedIn Sales Navigator Mastery', 'Cold Email Academy'],
            certifications: ['LinkedIn Sales Insights Certification'],
            practiceProjects: ['Generate 100 qualified leads', 'Build lead generation system']
          }
        },
        {
          skill: 'CRM Management',
          currentLevel: 2,
          targetLevel: 8,
          estimatedTimeToAcquire: 2,
          priority: 'high',
          resources: {
            courses: ['HubSpot CRM Certification', 'Salesforce Trailhead'],
            certifications: ['HubSpot Sales Certification', 'Salesforce Administrator'],
            practiceProjects: ['Set up complete CRM system', 'Create automated workflows']
          }
        },
        {
          skill: 'Data Analytics',
          currentLevel: 4,
          targetLevel: 8,
          estimatedTimeToAcquire: 4,
          priority: 'high',
          resources: {
            courses: ['Google Analytics Academy', 'Excel Advanced Analytics'],
            certifications: ['Google Analytics Certified', 'Microsoft Excel Expert'],
            practiceProjects: ['Create business intelligence dashboard', 'Analyze sales performance']
          }
        }
      ];
      
      res.json({ success: true, skillPlans });
    });
  }
}

export const nexusCareerBootstrap = new NexusCareerBootstrap();