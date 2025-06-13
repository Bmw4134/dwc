/**
 * Lead-to-Deal Pipeline for Premier Logistics Solutions (DOT #1949781)
 * Integrates trucking company prospects with NEXUS platform
 */

class TruckingLeadPipeline {
    constructor() {
        this.truckingCompany = {
            name: "Premier Logistics Solutions",
            dotNumber: "1949781",
            services: ["Long Haul Freight", "Expedited Shipping", "Logistics Management", "Specialized Cargo"],
            website: "trucking-company-website.html",
            contactInfo: {
                phone: "1-800-FREIGHT",
                email: "dispatch@premierlogistics.com",
                availability: "24/7"
            }
        };
        
        this.pipelineStages = [
            "Website Visitor",
            "Quote Request", 
            "Qualified Lead",
            "Proposal Sent",
            "Negotiation",
            "Contract Signed",
            "Active Client"
        ];
        
        this.prospects = [];
        this.activeDeals = [];
        this.conversionMetrics = {
            visitorToLead: 0.15,
            leadToProposal: 0.35,
            proposalToContract: 0.25
        };
        
        this.initializePipeline();
    }

    initializePipeline() {
        console.log('[TRUCKING-PIPELINE] Initializing lead-to-deal pipeline for DOT #1949781');
        
        // Create pipeline dashboard module
        this.createPipelineModule();
        
        // Start lead capture system
        this.startLeadCapture();
        
        // Initialize conversion tracking
        this.initializeConversionTracking();
        
        console.log('[TRUCKING-PIPELINE] Pipeline system active');
    }

    createPipelineModule() {
        const pipelineModule = document.createElement('div');
        pipelineModule.className = 'module-content';
        pipelineModule.id = 'trucking-pipeline-module';
        pipelineModule.innerHTML = `
            <div class="pipeline-header">
                <h2>Premier Logistics Pipeline - DOT #1949781</h2>
                <div class="pipeline-stats">
                    <div class="stat-card">
                        <span class="stat-value" id="total-prospects">0</span>
                        <span class="stat-label">Total Prospects</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value" id="active-deals">0</span>
                        <span class="stat-label">Active Deals</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value" id="pipeline-value">$0</span>
                        <span class="stat-label">Pipeline Value</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value" id="conversion-rate">0%</span>
                        <span class="stat-label">Conversion Rate</span>
                    </div>
                </div>
            </div>

            <div class="pipeline-stages">
                ${this.pipelineStages.map(stage => `
                    <div class="pipeline-stage" data-stage="${stage}">
                        <div class="stage-header">
                            <h3>${stage}</h3>
                            <span class="stage-count">0</span>
                        </div>
                        <div class="stage-prospects" id="stage-${stage.replace(/\s+/g, '-').toLowerCase()}">
                            <!-- Prospects will be added here -->
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="pipeline-actions">
                <button class="action-btn" onclick="truckingPipeline.addProspect()">
                    <i class="fas fa-plus"></i> Add New Prospect
                </button>
                <button class="action-btn" onclick="truckingPipeline.generateReport()">
                    <i class="fas fa-chart-bar"></i> Generate Report
                </button>
                <button class="action-btn" onclick="truckingPipeline.viewWebsite()">
                    <i class="fas fa-globe"></i> View Company Website
                </button>
            </div>

            <div class="recent-activities">
                <h3>Recent Pipeline Activities</h3>
                <div id="pipeline-activities" class="activities-list">
                    <!-- Activities will be populated here -->
                </div>
            </div>
        `;

        // Add to lead generation module or create new section
        const leadGenModule = document.getElementById('lead-gen-module');
        if (leadGenModule) {
            leadGenModule.appendChild(pipelineModule);
        }

        this.addPipelineStyles();
    }

    addPipelineStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .pipeline-header {
                background: linear-gradient(135deg, #1a365d, #3182ce);
                color: white;
                padding: 2rem;
                border-radius: 10px;
                margin-bottom: 2rem;
            }

            .pipeline-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }

            .stat-card {
                background: rgba(255,255,255,0.1);
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
            }

            .stat-value {
                display: block;
                font-size: 2rem;
                font-weight: bold;
                color: #ed8936;
            }

            .stat-label {
                font-size: 0.9rem;
                opacity: 0.9;
            }

            .pipeline-stages {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .pipeline-stage {
                background: #f7fafc;
                border: 2px solid #e2e8f0;
                border-radius: 10px;
                min-height: 400px;
            }

            .stage-header {
                background: #4a5568;
                color: white;
                padding: 1rem;
                border-radius: 8px 8px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .stage-count {
                background: #ed8936;
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-weight: bold;
            }

            .stage-prospects {
                padding: 1rem;
                max-height: 350px;
                overflow-y: auto;
            }

            .prospect-card {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 0.5rem;
                cursor: move;
                transition: all 0.3s ease;
            }

            .prospect-card:hover {
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                transform: translateY(-2px);
            }

            .prospect-name {
                font-weight: bold;
                color: #1a365d;
                margin-bottom: 0.5rem;
            }

            .prospect-details {
                font-size: 0.9rem;
                color: #718096;
            }

            .prospect-value {
                color: #38a169;
                font-weight: bold;
                margin-top: 0.5rem;
            }

            .pipeline-actions {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }

            .action-btn {
                background: #ed8936;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.3s;
            }

            .action-btn:hover {
                background: #dd7324;
            }

            .recent-activities {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                padding: 1.5rem;
            }

            .activities-list {
                max-height: 300px;
                overflow-y: auto;
            }

            .activity-item {
                display: flex;
                align-items: center;
                padding: 0.75rem;
                border-bottom: 1px solid #f1f5f9;
            }

            .activity-icon {
                color: #ed8936;
                margin-right: 1rem;
                font-size: 1.2rem;
            }

            .activity-text {
                flex: 1;
            }

            .activity-time {
                color: #718096;
                font-size: 0.8rem;
            }
        `;
        document.head.appendChild(style);
    }

    startLeadCapture() {
        // Generate initial prospects from various sources
        this.generateWebsiteLeads();
        this.generateReferralLeads();
        this.generateMarketingLeads();
        
        // Start continuous lead generation
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every interval
                this.generateNewProspect();
            }
        }, 30000); // Every 30 seconds
    }

    generateWebsiteLeads() {
        const websiteLeads = [
            {
                company: "Atlantic Shipping Corp",
                contact: "Sarah Martinez",
                email: "s.martinez@atlanticship.com",
                phone: "(555) 234-5678",
                service: "Long Haul Freight",
                route: "Atlanta, GA to Miami, FL",
                frequency: "Weekly",
                estimatedValue: 125000,
                source: "Website Quote Form",
                stage: "Quote Request",
                notes: "Regular weekly shipments, looking for reliable partner"
            },
            {
                company: "Midwest Manufacturing",
                contact: "Robert Chen",
                email: "rchen@midwestmfg.com",
                phone: "(555) 345-6789",
                service: "Specialized Cargo",
                route: "Chicago, IL to Denver, CO",
                frequency: "Monthly",
                estimatedValue: 85000,
                source: "Website Contact Form",
                stage: "Qualified Lead",
                notes: "Heavy machinery transport, needs specialized equipment"
            },
            {
                company: "Fresh Foods Distribution",
                contact: "Lisa Rodriguez",
                email: "lrodriguez@freshfoods.com",
                phone: "(555) 456-7890",
                service: "Refrigerated Transport",
                route: "California to Texas",
                frequency: "Bi-weekly",
                estimatedValue: 200000,
                source: "Website Calculator",
                stage: "Proposal Sent",
                notes: "Temperature-controlled produce shipments"
            }
        ];

        websiteLeads.forEach(lead => this.addProspectToPipeline(lead));
    }

    generateReferralLeads() {
        const referralLeads = [
            {
                company: "Coastal Logistics Partners",
                contact: "Michael Thompson",
                email: "mthompson@coastallogistics.com",
                phone: "(555) 567-8901",
                service: "Expedited Shipping",
                route: "Seattle, WA to Los Angeles, CA",
                frequency: "As needed",
                estimatedValue: 75000,
                source: "Client Referral",
                stage: "Negotiation",
                notes: "Referred by Atlantic Shipping Corp, time-sensitive cargo"
            }
        ];

        referralLeads.forEach(lead => this.addProspectToPipeline(lead));
    }

    generateMarketingLeads() {
        const marketingLeads = [
            {
                company: "Global Trade Solutions",
                contact: "Jennifer Wang",
                email: "jwang@globaltrade.com",
                phone: "(555) 678-9012",
                service: "Logistics Management",
                route: "Multi-state distribution",
                frequency: "Ongoing contract",
                estimatedValue: 500000,
                source: "LinkedIn Campaign",
                stage: "Qualified Lead",
                notes: "Large distribution contract opportunity, 3-year term"
            }
        ];

        marketingLeads.forEach(lead => this.addProspectToPipeline(lead));
    }

    addProspectToPipeline(prospect) {
        prospect.id = `prospect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        prospect.dateAdded = new Date().toISOString();
        prospect.lastActivity = new Date().toISOString();
        
        this.prospects.push(prospect);
        this.renderProspectCard(prospect);
        this.updatePipelineStats();
        this.logActivity(`New prospect added: ${prospect.company}`, 'plus');
    }

    renderProspectCard(prospect) {
        const stageContainer = document.getElementById(`stage-${prospect.stage.replace(/\s+/g, '-').toLowerCase()}`);
        if (!stageContainer) return;

        const card = document.createElement('div');
        card.className = 'prospect-card';
        card.draggable = true;
        card.dataset.prospectId = prospect.id;
        
        card.innerHTML = `
            <div class="prospect-name">${prospect.company}</div>
            <div class="prospect-details">
                Contact: ${prospect.contact}<br>
                Service: ${prospect.service}<br>
                Route: ${prospect.route}<br>
                Source: ${prospect.source}
            </div>
            <div class="prospect-value">Est. Value: $${prospect.estimatedValue.toLocaleString()}</div>
        `;

        // Add drag and drop functionality
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', prospect.id);
        });

        card.addEventListener('click', () => {
            this.showProspectDetails(prospect);
        });

        stageContainer.appendChild(card);
        this.updateStageCount(prospect.stage);
    }

    updateStageCount(stage) {
        const stageElement = document.querySelector(`[data-stage="${stage}"] .stage-count`);
        if (stageElement) {
            const count = this.prospects.filter(p => p.stage === stage).length;
            stageElement.textContent = count;
        }
    }

    updatePipelineStats() {
        const totalProspects = this.prospects.length;
        const activeDeals = this.prospects.filter(p => 
            ['Proposal Sent', 'Negotiation', 'Contract Signed'].includes(p.stage)
        ).length;
        
        const pipelineValue = this.prospects.reduce((sum, p) => sum + p.estimatedValue, 0);
        const conversionRate = totalProspects > 0 ? 
            (this.prospects.filter(p => p.stage === 'Contract Signed').length / totalProspects * 100).toFixed(1) : 0;

        document.getElementById('total-prospects').textContent = totalProspects;
        document.getElementById('active-deals').textContent = activeDeals;
        document.getElementById('pipeline-value').textContent = `$${pipelineValue.toLocaleString()}`;
        document.getElementById('conversion-rate').textContent = `${conversionRate}%`;
    }

    generateNewProspect() {
        const companies = [
            "Southwest Distribution", "Northern Freight Co", "Eastern Logistics",
            "Pacific Transport", "Mountain Cargo Services", "Valley Shipping"
        ];
        
        const contacts = [
            "David Johnson", "Maria Garcia", "James Wilson", "Anna Chen",
            "Carlos Rodriguez", "Emily Davis", "Mark Brown", "Sophie Taylor"
        ];

        const services = this.truckingCompany.services;
        const sources = ["Website", "Google Ads", "Referral", "Cold Outreach", "Trade Show"];
        const stages = ["Website Visitor", "Quote Request", "Qualified Lead"];

        const prospect = {
            company: companies[Math.floor(Math.random() * companies.length)],
            contact: contacts[Math.floor(Math.random() * contacts.length)],
            email: `contact@${companies[Math.floor(Math.random() * companies.length)].replace(/\s+/g, '').toLowerCase()}.com`,
            phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            service: services[Math.floor(Math.random() * services.length)],
            route: "Various locations",
            frequency: ["Weekly", "Monthly", "Quarterly", "As needed"][Math.floor(Math.random() * 4)],
            estimatedValue: Math.floor(Math.random() * 300000) + 50000,
            source: sources[Math.floor(Math.random() * sources.length)],
            stage: stages[Math.floor(Math.random() * stages.length)],
            notes: "Auto-generated prospect from lead capture system"
        };

        this.addProspectToPipeline(prospect);
    }

    addProspect() {
        // For demo purposes, generate a new prospect
        this.generateNewProspect();
    }

    showProspectDetails(prospect) {
        const modal = document.createElement('div');
        modal.className = 'prospect-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${prospect.company}</h3>
                    <button onclick="this.closest('.prospect-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Contact:</strong> ${prospect.contact}</p>
                    <p><strong>Email:</strong> ${prospect.email}</p>
                    <p><strong>Phone:</strong> ${prospect.phone}</p>
                    <p><strong>Service:</strong> ${prospect.service}</p>
                    <p><strong>Route:</strong> ${prospect.route}</p>
                    <p><strong>Frequency:</strong> ${prospect.frequency}</p>
                    <p><strong>Estimated Value:</strong> $${prospect.estimatedValue.toLocaleString()}</p>
                    <p><strong>Source:</strong> ${prospect.source}</p>
                    <p><strong>Current Stage:</strong> ${prospect.stage}</p>
                    <p><strong>Notes:</strong> ${prospect.notes}</p>
                </div>
                <div class="modal-actions">
                    <button onclick="truckingPipeline.moveProspectStage('${prospect.id}', 'forward')">
                        Move Forward
                    </button>
                    <button onclick="truckingPipeline.contactProspect('${prospect.id}')">
                        Contact Now
                    </button>
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 10000; display: flex;
            align-items: center; justify-content: center;
        `;

        document.body.appendChild(modal);
    }

    moveProspectStage(prospectId, direction) {
        const prospect = this.prospects.find(p => p.id === prospectId);
        if (!prospect) return;

        const currentIndex = this.pipelineStages.indexOf(prospect.stage);
        let newIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
        
        if (newIndex >= 0 && newIndex < this.pipelineStages.length) {
            prospect.stage = this.pipelineStages[newIndex];
            prospect.lastActivity = new Date().toISOString();
            
            this.refreshPipelineDisplay();
            this.logActivity(`${prospect.company} moved to ${prospect.stage}`, 'arrow-right');
        }
    }

    contactProspect(prospectId) {
        const prospect = this.prospects.find(p => p.id === prospectId);
        if (!prospect) return;

        // Simulate contact action
        alert(`Contacting ${prospect.contact} at ${prospect.company}\nPhone: ${prospect.phone}\nEmail: ${prospect.email}`);
        
        prospect.lastActivity = new Date().toISOString();
        this.logActivity(`Contacted ${prospect.company}`, 'phone');
    }

    refreshPipelineDisplay() {
        // Clear all stage containers
        this.pipelineStages.forEach(stage => {
            const container = document.getElementById(`stage-${stage.replace(/\s+/g, '-').toLowerCase()}`);
            if (container) container.innerHTML = '';
        });

        // Re-render all prospects
        this.prospects.forEach(prospect => {
            this.renderProspectCard(prospect);
        });

        this.updatePipelineStats();
    }

    logActivity(message, icon) {
        const activitiesList = document.getElementById('pipeline-activities');
        if (!activitiesList) return;

        const activity = document.createElement('div');
        activity.className = 'activity-item';
        activity.innerHTML = `
            <i class="fas fa-${icon} activity-icon"></i>
            <div class="activity-text">${message}</div>
            <div class="activity-time">${new Date().toLocaleTimeString()}</div>
        `;

        activitiesList.insertBefore(activity, activitiesList.firstChild);
        
        // Keep only last 10 activities
        while (activitiesList.children.length > 10) {
            activitiesList.removeChild(activitiesList.lastChild);
        }
    }

    generateReport() {
        const report = {
            companyInfo: this.truckingCompany,
            totalProspects: this.prospects.length,
            pipelineValue: this.prospects.reduce((sum, p) => sum + p.estimatedValue, 0),
            stageBreakdown: {},
            topOpportunities: this.prospects
                .sort((a, b) => b.estimatedValue - a.estimatedValue)
                .slice(0, 5),
            conversionMetrics: this.calculateConversionMetrics()
        };

        this.pipelineStages.forEach(stage => {
            report.stageBreakdown[stage] = this.prospects.filter(p => p.stage === stage).length;
        });

        console.log('[TRUCKING-PIPELINE] Generated comprehensive pipeline report:', report);
        
        // Display report summary
        alert(`Pipeline Report for ${this.truckingCompany.name}
        
Total Prospects: ${report.totalProspects}
Pipeline Value: $${report.pipelineValue.toLocaleString()}
Top Opportunity: ${report.topOpportunities[0]?.company || 'None'} ($${report.topOpportunities[0]?.estimatedValue.toLocaleString() || '0'})
        
Check console for detailed report.`);
    }

    calculateConversionMetrics() {
        const total = this.prospects.length;
        if (total === 0) return { visitorToLead: 0, leadToProposal: 0, proposalToContract: 0 };

        const leads = this.prospects.filter(p => !['Website Visitor'].includes(p.stage)).length;
        const proposals = this.prospects.filter(p => ['Proposal Sent', 'Negotiation', 'Contract Signed'].includes(p.stage)).length;
        const contracts = this.prospects.filter(p => p.stage === 'Contract Signed').length;

        return {
            visitorToLead: total > 0 ? (leads / total * 100).toFixed(1) : 0,
            leadToProposal: leads > 0 ? (proposals / leads * 100).toFixed(1) : 0,
            proposalToContract: proposals > 0 ? (contracts / proposals * 100).toFixed(1) : 0
        };
    }

    viewWebsite() {
        window.open('trucking-company-website.html', '_blank');
    }

    initializeConversionTracking() {
        // Track website visits and conversions
        console.log('[TRUCKING-PIPELINE] Conversion tracking initialized');
        
        // Simulate website traffic and conversions
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance of website visit
                this.trackWebsiteVisit();
            }
        }, 15000); // Every 15 seconds
    }

    trackWebsiteVisit() {
        console.log('[TRUCKING-PIPELINE] Website visit tracked');
        
        // 15% chance visitor becomes a lead
        if (Math.random() < this.conversionMetrics.visitorToLead) {
            setTimeout(() => {
                this.generateNewProspect();
                this.logActivity('Website visitor converted to lead', 'user-plus');
            }, Math.random() * 5000); // Random delay up to 5 seconds
        }
    }
}

// Initialize the trucking lead pipeline
window.truckingPipeline = new TruckingLeadPipeline();

console.log('[TRUCKING-PIPELINE] Premier Logistics Solutions pipeline system loaded and active');