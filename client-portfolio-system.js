/**
 * Client Portfolio Management System
 * Consolidated platform for hosting and developing multiple client websites
 */

class ClientPortfolioSystem {
    constructor() {
        this.clients = [
            {
                id: 'client_001',
                businessName: 'Game X Change',
                industry: 'Gaming Retail',
                contactInfo: {
                    email: 'corporate@gamexchange.com',
                    phone: '+1-555-0789',
                    website: 'gamexchange.com'
                },
                projectStatus: 'negotiation',
                estimatedValue: 2500000,
                confidence: 85,
                services: ['Pokemon Card Evaluation System', 'Multi-location Retail Automation', 'Inventory Management'],
                websiteStatus: 'in_development',
                priority: 'high',
                notes: 'Multi-location retail chain expansion, Pokemon card automation opportunity',
                lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'client_002',
                businessName: 'Blissful Memories',
                industry: 'Photography Services',
                contactInfo: {
                    email: 'info@blissfulmemories.com',
                    phone: '+1-555-0123',
                    website: 'blissfulmemories.com'
                },
                projectStatus: 'qualified',
                estimatedValue: 75000,
                confidence: 78,
                services: ['Photography Portfolio Website', 'Online Booking System', 'Client Gallery Management'],
                websiteStatus: 'planning',
                priority: 'medium',
                notes: 'Wedding and portrait photography studio, needs modern online presence',
                lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'client_003',
                businessName: 'Premier Logistics Solutions',
                industry: 'Transportation',
                contactInfo: {
                    email: 'dispatch@premierlogistics.com',
                    phone: '1-800-373-4448',
                    website: 'premierlogistics.com'
                },
                projectStatus: 'active',
                estimatedValue: 125000,
                confidence: 95,
                services: ['Pro Bono Website Development', 'Lead Generation System', 'Quote Calculator'],
                websiteStatus: 'live',
                priority: 'high',
                notes: 'DOT #1949781 - Pro bono trucking company website with integrated lead pipeline',
                lastActivity: new Date(),
                dotNumber: '1949781'
            },
            {
                id: 'client_004',
                businessName: 'Ragle Inc',
                industry: 'Corporate Services',
                contactInfo: {
                    email: 'contact@ragleinc.com',
                    phone: '+1-555-0456',
                    website: 'ragleinc.com'
                },
                projectStatus: 'qualified',
                estimatedValue: 25000,
                confidence: 89,
                services: ['Corporate Services Automation', 'Business Process Optimization'],
                websiteStatus: 'needs_assessment',
                priority: 'medium',
                notes: 'Corporate services automation opportunity, strong digital presence',
                lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'client_005',
                businessName: 'Dallas Tech Solutions',
                industry: 'Technology Services',
                contactInfo: {
                    email: 'info@dallastech.com',
                    phone: '+1-555-0234',
                    website: 'dallastech.com'
                },
                projectStatus: 'prospect',
                estimatedValue: 75000,
                confidence: 92.5,
                services: ['Technology Consulting Website', 'Service Portfolio Display'],
                websiteStatus: 'planning',
                priority: 'high',
                notes: 'Dallas-based technology services company',
                lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'client_006',
                businessName: 'Richardson Healthcare',
                industry: 'Healthcare Practices',
                contactInfo: {
                    email: 'admin@richardsonhealth.com',
                    phone: '+1-555-0345',
                    website: 'richardsonhealth.com'
                },
                projectStatus: 'prospect',
                estimatedValue: 95000,
                confidence: 91.3,
                services: ['Healthcare Practice Website', 'Patient Portal', 'HIPAA Compliance'],
                websiteStatus: 'planning',
                priority: 'high',
                notes: 'Healthcare practice with HIPAA compliance requirements',
                lastActivity: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
            }
        ];
        
        this.portfolioStats = {
            totalClients: this.clients.length,
            activeProjects: this.clients.filter(c => c.projectStatus === 'active').length,
            totalValue: this.clients.reduce((sum, c) => sum + c.estimatedValue, 0),
            websitesInDevelopment: this.clients.filter(c => c.websiteStatus === 'in_development').length,
            liveWebsites: this.clients.filter(c => c.websiteStatus === 'live').length
        };
        
        this.initializePortfolioSystem();
    }

    initializePortfolioSystem() {
        console.log('[PORTFOLIO] Initializing Client Portfolio Management System');
        this.createPortfolioModule();
        this.setupWebsiteHosting();
        this.initializeClientDashboards();
        console.log('[PORTFOLIO] Portfolio system active with', this.clients.length, 'clients');
    }

    createPortfolioModule() {
        const portfolioModule = document.createElement('div');
        portfolioModule.className = 'module-content';
        portfolioModule.id = 'portfolio-system-module';
        
        portfolioModule.innerHTML = `
            <div class="portfolio-header">
                <h2>Client Portfolio Management System</h2>
                <div class="portfolio-overview">
                    <div class="overview-card">
                        <span class="overview-value">${this.portfolioStats.totalClients}</span>
                        <span class="overview-label">Total Clients</span>
                    </div>
                    <div class="overview-card">
                        <span class="overview-value">${this.portfolioStats.activeProjects}</span>
                        <span class="overview-label">Active Projects</span>
                    </div>
                    <div class="overview-card">
                        <span class="overview-value">$${(this.portfolioStats.totalValue / 1000000).toFixed(1)}M</span>
                        <span class="overview-label">Portfolio Value</span>
                    </div>
                    <div class="overview-card">
                        <span class="overview-value">${this.portfolioStats.liveWebsites}</span>
                        <span class="overview-label">Live Websites</span>
                    </div>
                </div>
            </div>

            <div class="portfolio-filters">
                <button class="filter-btn active" onclick="clientPortfolio.filterClients('all')">All Clients</button>
                <button class="filter-btn" onclick="clientPortfolio.filterClients('active')">Active Projects</button>
                <button class="filter-btn" onclick="clientPortfolio.filterClients('high')">High Priority</button>
                <button class="filter-btn" onclick="clientPortfolio.filterClients('development')">In Development</button>
            </div>

            <div class="client-grid" id="client-portfolio-grid">
                ${this.clients.map(client => this.generateClientCard(client)).join('')}
            </div>

            <div class="portfolio-actions">
                <button class="action-btn primary" onclick="clientPortfolio.addNewClient()">
                    <i class="fas fa-plus"></i> Add New Client
                </button>
                <button class="action-btn" onclick="clientPortfolio.generatePortfolioReport()">
                    <i class="fas fa-chart-bar"></i> Portfolio Report
                </button>
                <button class="action-btn" onclick="clientPortfolio.manageHosting()">
                    <i class="fas fa-server"></i> Manage Hosting
                </button>
            </div>

            <div class="hosting-dashboard" id="hosting-dashboard">
                <h3>Website Hosting Dashboard</h3>
                <div class="hosting-grid">
                    ${this.generateHostingGrid()}
                </div>
            </div>
        `;

        // Add to existing module or create new section
        const leadGenModule = document.getElementById('lead-gen-module');
        if (leadGenModule) {
            const moduleContent = leadGenModule.querySelector('.module-content');
            if (moduleContent) {
                moduleContent.innerHTML = portfolioModule.innerHTML;
            }
        }

        this.addPortfolioStyles();
    }

    generateClientCard(client) {
        const statusColor = {
            'active': '#00ff88',
            'negotiation': '#ffaa00',
            'qualified': '#3182ce',
            'prospect': '#718096'
        };

        const websiteStatusIcon = {
            'live': '🌐',
            'in_development': '🚧',
            'planning': '📋',
            'needs_assessment': '🔍'
        };

        return `
            <div class="client-card" data-status="${client.projectStatus}" data-priority="${client.priority}">
                <div class="client-header">
                    <h3>${client.businessName}</h3>
                    <span class="client-status" style="background: ${statusColor[client.projectStatus]}">${client.projectStatus}</span>
                </div>
                
                <div class="client-info">
                    <p><strong>Industry:</strong> ${client.industry}</p>
                    <p><strong>Value:</strong> $${client.estimatedValue.toLocaleString()}</p>
                    <p><strong>Confidence:</strong> ${client.confidence}%</p>
                    <p><strong>Website:</strong> ${websiteStatusIcon[client.websiteStatus]} ${client.websiteStatus.replace('_', ' ')}</p>
                </div>

                <div class="client-services">
                    <strong>Services:</strong>
                    <div class="service-tags">
                        ${client.services.map(service => `<span class="service-tag">${service}</span>`).join('')}
                    </div>
                </div>

                <div class="client-actions">
                    <button onclick="clientPortfolio.viewClient('${client.id}')" class="btn-small">View Details</button>
                    <button onclick="clientPortfolio.editWebsite('${client.id}')" class="btn-small">Edit Website</button>
                    ${client.websiteStatus === 'live' ? 
                        `<button onclick="clientPortfolio.viewLiveWebsite('${client.id}')" class="btn-small primary">View Live</button>` : 
                        `<button onclick="clientPortfolio.developWebsite('${client.id}')" class="btn-small">Develop</button>`
                    }
                </div>

                <div class="client-notes">
                    <small>${client.notes}</small>
                </div>
            </div>
        `;
    }

    generateHostingGrid() {
        const liveWebsites = this.clients.filter(c => c.websiteStatus === 'live' || c.websiteStatus === 'in_development');
        
        return liveWebsites.map(client => `
            <div class="hosting-item">
                <div class="hosting-info">
                    <h4>${client.businessName}</h4>
                    <p>${client.contactInfo.website}</p>
                    <span class="hosting-status ${client.websiteStatus}">${client.websiteStatus}</span>
                </div>
                <div class="hosting-actions">
                    <button onclick="clientPortfolio.viewWebsite('${client.id}')" class="btn-small">
                        <i class="fas fa-external-link-alt"></i> View
                    </button>
                    <button onclick="clientPortfolio.editWebsite('${client.id}')" class="btn-small">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="clientPortfolio.manageHosting('${client.id}')" class="btn-small">
                        <i class="fas fa-cog"></i> Settings
                    </button>
                </div>
            </div>
        `).join('');
    }

    addPortfolioStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .portfolio-header {
                background: linear-gradient(135deg, #1a365d, #3182ce);
                color: white;
                padding: 2rem;
                border-radius: 12px;
                margin-bottom: 2rem;
            }

            .portfolio-overview {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-top: 1.5rem;
            }

            .overview-card {
                background: rgba(255,255,255,0.15);
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
            }

            .overview-value {
                display: block;
                font-size: 2rem;
                font-weight: bold;
                color: #00ff88;
            }

            .overview-label {
                font-size: 0.9rem;
                opacity: 0.9;
            }

            .portfolio-filters {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }

            .filter-btn {
                padding: 0.5rem 1rem;
                border: 2px solid #e2e8f0;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s;
            }

            .filter-btn.active, .filter-btn:hover {
                background: #3182ce;
                color: white;
                border-color: #3182ce;
            }

            .client-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            .client-card {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: transform 0.3s, box-shadow 0.3s;
            }

            .client-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }

            .client-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                border-bottom: 1px solid #f1f5f9;
                padding-bottom: 1rem;
            }

            .client-header h3 {
                margin: 0;
                color: #1a365d;
                font-size: 1.2rem;
            }

            .client-status {
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                color: white;
                font-size: 0.8rem;
                font-weight: bold;
                text-transform: uppercase;
            }

            .client-info {
                margin-bottom: 1rem;
            }

            .client-info p {
                margin: 0.5rem 0;
                color: #4a5568;
            }

            .client-services {
                margin-bottom: 1rem;
            }

            .service-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }

            .service-tag {
                background: #e2e8f0;
                color: #4a5568;
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                font-size: 0.8rem;
            }

            .client-actions {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }

            .btn-small {
                padding: 0.4rem 0.8rem;
                border: 1px solid #e2e8f0;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.3s;
            }

            .btn-small:hover {
                background: #f7fafc;
            }

            .btn-small.primary {
                background: #00ff88;
                color: white;
                border-color: #00ff88;
            }

            .client-notes {
                color: #718096;
                font-size: 0.9rem;
                font-style: italic;
                border-top: 1px solid #f1f5f9;
                padding-top: 0.5rem;
            }

            .portfolio-actions {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }

            .action-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
                background: #e2e8f0;
                color: #4a5568;
            }

            .action-btn.primary {
                background: #3182ce;
                color: white;
            }

            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .hosting-dashboard {
                background: #f7fafc;
                padding: 2rem;
                border-radius: 12px;
                margin-top: 2rem;
            }

            .hosting-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }

            .hosting-item {
                background: white;
                padding: 1rem;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .hosting-status {
                padding: 0.2rem 0.5rem;
                border-radius: 12px;
                font-size: 0.7rem;
                text-transform: uppercase;
                font-weight: bold;
            }

            .hosting-status.live {
                background: #00ff88;
                color: white;
            }

            .hosting-status.in_development {
                background: #ffaa00;
                color: white;
            }

            .hosting-actions {
                display: flex;
                gap: 0.5rem;
            }
        `;
        document.head.appendChild(style);
    }

    filterClients(filter) {
        const cards = document.querySelectorAll('.client-card');
        const buttons = document.querySelectorAll('.filter-btn');
        
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        cards.forEach(card => {
            const shouldShow = this.shouldShowCard(card, filter);
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    shouldShowCard(card, filter) {
        switch(filter) {
            case 'all': return true;
            case 'active': return card.dataset.status === 'active';
            case 'high': return card.dataset.priority === 'high';
            case 'development': return card.innerHTML.includes('in_development') || card.innerHTML.includes('🚧');
            default: return true;
        }
    }

    viewClient(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (!client) return;

        const modal = document.createElement('div');
        modal.className = 'client-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${client.businessName}</h3>
                    <button onclick="this.closest('.client-modal').remove()" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="client-details-grid">
                        <div class="detail-section">
                            <h4>Contact Information</h4>
                            <p><strong>Email:</strong> ${client.contactInfo.email}</p>
                            <p><strong>Phone:</strong> ${client.contactInfo.phone}</p>
                            <p><strong>Website:</strong> ${client.contactInfo.website}</p>
                        </div>
                        <div class="detail-section">
                            <h4>Project Details</h4>
                            <p><strong>Industry:</strong> ${client.industry}</p>
                            <p><strong>Status:</strong> ${client.projectStatus}</p>
                            <p><strong>Value:</strong> $${client.estimatedValue.toLocaleString()}</p>
                            <p><strong>Confidence:</strong> ${client.confidence}%</p>
                        </div>
                        <div class="detail-section">
                            <h4>Services</h4>
                            <ul>
                                ${client.services.map(service => `<li>${service}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="detail-section">
                            <h4>Website Status</h4>
                            <p><strong>Current Status:</strong> ${client.websiteStatus.replace('_', ' ')}</p>
                            <p><strong>Priority:</strong> ${client.priority}</p>
                        </div>
                    </div>
                    <div class="notes-section">
                        <h4>Notes</h4>
                        <p>${client.notes}</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button onclick="clientPortfolio.editWebsite('${client.id}')" class="btn-primary">
                        Edit Website
                    </button>
                    <button onclick="clientPortfolio.contactClient('${client.id}')" class="btn-secondary">
                        Contact Client
                    </button>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); z-index: 10000; display: flex;
            align-items: center; justify-content: center; padding: 2rem;
        `;

        document.body.appendChild(modal);
    }

    viewLiveWebsite(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (!client) return;

        if (client.businessName === 'Premier Logistics Solutions') {
            window.open('/trucking-company-website.html', '_blank');
        } else {
            alert(`${client.businessName} website will be available at: ${client.contactInfo.website}`);
        }
    }

    developWebsite(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (!client) return;

        if (client.businessName === 'Game X Change') {
            this.createGameExchangeWebsite();
        } else if (client.businessName === 'Blissful Memories') {
            this.createBlissfulMemoriesWebsite();
        } else {
            alert(`Initiating website development for ${client.businessName}...`);
        }
    }

    createGameExchangeWebsite() {
        alert('Developing Game X Change website with Pokemon card evaluation system and multi-location inventory management...');
        // This would trigger the website development process
    }

    createBlissfulMemoriesWebsite() {
        alert('Developing Blissful Memories photography website with portfolio gallery and booking system...');
        // This would trigger the website development process
    }

    generatePortfolioReport() {
        const report = {
            portfolioSummary: this.portfolioStats,
            clientBreakdown: {
                byStatus: this.getClientsByStatus(),
                byIndustry: this.getClientsByIndustry(),
                byPriority: this.getClientsByPriority()
            },
            websiteStatuses: this.getWebsiteStatuses(),
            revenueProjection: this.calculateRevenueProjection()
        };

        console.log('[PORTFOLIO] Generated comprehensive portfolio report:', report);
        
        alert(`Portfolio Report Generated:
        
Total Clients: ${this.portfolioStats.totalClients}
Portfolio Value: $${(this.portfolioStats.totalValue / 1000000).toFixed(1)}M
Active Projects: ${this.portfolioStats.activeProjects}
Live Websites: ${this.portfolioStats.liveWebsites}

Top Opportunity: Game X Change ($2.5M)
Next Priority: Richardson Healthcare ($95K)

Check console for detailed breakdown.`);
    }

    getClientsByStatus() {
        return this.clients.reduce((acc, client) => {
            acc[client.projectStatus] = (acc[client.projectStatus] || 0) + 1;
            return acc;
        }, {});
    }

    getClientsByIndustry() {
        return this.clients.reduce((acc, client) => {
            acc[client.industry] = (acc[client.industry] || 0) + 1;
            return acc;
        }, {});
    }

    getClientsByPriority() {
        return this.clients.reduce((acc, client) => {
            acc[client.priority] = (acc[client.priority] || 0) + 1;
            return acc;
        }, {});
    }

    getWebsiteStatuses() {
        return this.clients.reduce((acc, client) => {
            acc[client.websiteStatus] = (acc[client.websiteStatus] || 0) + 1;
            return acc;
        }, {});
    }

    calculateRevenueProjection() {
        return this.clients.reduce((total, client) => {
            return total + (client.estimatedValue * (client.confidence / 100));
        }, 0);
    }

    setupWebsiteHosting() {
        console.log('[PORTFOLIO] Setting up internal website hosting infrastructure');
        
        // Register hosting routes for each client
        this.clients.forEach(client => {
            if (client.websiteStatus === 'live' || client.websiteStatus === 'in_development') {
                this.registerHostingRoute(client);
            }
        });
    }

    registerHostingRoute(client) {
        const domain = client.contactInfo.website.replace(/https?:\/\//, '');
        console.log(`[PORTFOLIO] Registering hosting route for ${client.businessName} at /${domain}`);
        
        // This would register the actual hosting route in the server
        // For now, we'll log the registration
    }

    initializeClientDashboards() {
        console.log('[PORTFOLIO] Initializing individual client dashboards');
        
        this.clients.forEach(client => {
            this.createClientDashboard(client);
        });
    }

    createClientDashboard(client) {
        const dashboardUrl = `/clients/${client.id}/dashboard`;
        console.log(`[PORTFOLIO] Client dashboard created for ${client.businessName}: ${dashboardUrl}`);
        
        // Each client gets their own dashboard for tracking progress
        client.dashboardUrl = dashboardUrl;
    }
}

// Initialize the client portfolio system
window.clientPortfolio = new ClientPortfolioSystem();

console.log('[PORTFOLIO] Client Portfolio Management System loaded with', window.clientPortfolio.clients.length, 'clients');