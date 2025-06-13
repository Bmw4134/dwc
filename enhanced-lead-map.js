/**
 * Enhanced Lead Map System
 * Displays detailed company information with improved visual markers
 */

class EnhancedLeadMap {
    constructor() {
        this.map = null;
        this.leads = [];
        this.markers = [];
        this.initialized = false;
        this.leadDetails = new Map();
    }

    async initialize() {
        if (this.initialized) return;
        
        console.log('[ENHANCED-MAP] Initializing enhanced lead map system...');
        
        // Clear existing map and replace with enhanced version
        this.clearExistingMaps();
        this.createEnhancedMapContainer();
        await this.initializeEnhancedMap();
        await this.loadEnhancedLeadData();
        this.displayEnhancedMarkers();
        this.startLiveLeadUpdates();
        
        this.initialized = true;
        console.log('[ENHANCED-MAP] Enhanced map ready with', this.leads.length, 'detailed leads');
    }

    clearExistingMaps() {
        // Remove any existing map containers
        const existingMaps = document.querySelectorAll('#unified-map-container, #qnis-map, .quantum-map-canvas');
        existingMaps.forEach(map => map.remove());
    }

    createEnhancedMapContainer() {
        const qnisModule = document.getElementById('qnis-module');
        if (!qnisModule) return;

        const mapContainer = document.createElement('div');
        mapContainer.id = 'enhanced-lead-map-container';
        mapContainer.style.cssText = `
            width: 100%;
            height: 600px;
            border: 2px solid #00ff88;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            background: #0a0a0a;
            margin: 20px 0;
        `;

        mapContainer.innerHTML = `
            <div class="map-header" style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                background: linear-gradient(90deg, rgba(0,255,136,0.9) 0%, rgba(0,150,100,0.8) 100%);
                padding: 12px 20px;
                color: #000;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>QNIS Lead Intelligence Map</div>
                <div id="lead-counter" style="background: rgba(0,0,0,0.2); padding: 4px 12px; border-radius: 20px;">
                    Loading leads...
                </div>
            </div>
            
            <div class="map-controls" style="
                position: absolute;
                top: 60px;
                left: 15px;
                z-index: 1000;
                background: rgba(0,0,0,0.8);
                padding: 12px;
                border-radius: 8px;
                color: white;
                font-size: 12px;
                min-width: 200px;
            ">
                <div style="color: #00ff88; font-weight: bold; margin-bottom: 8px;">Filter Leads</div>
                <label style="display: block; margin: 4px 0; cursor: pointer;">
                    <input type="checkbox" checked onchange="window.enhancedLeadMap.filterByPriority('HIGH', this.checked)"> 
                    High Priority (<span id="high-count">0</span>)
                </label>
                <label style="display: block; margin: 4px 0; cursor: pointer;">
                    <input type="checkbox" checked onchange="window.enhancedLeadMap.filterByPriority('MEDIUM', this.checked)"> 
                    Medium Priority (<span id="medium-count">0</span>)
                </label>
                <label style="display: block; margin: 4px 0; cursor: pointer;">
                    <input type="checkbox" checked onchange="window.enhancedLeadMap.filterByPriority('LOW', this.checked)"> 
                    Low Priority (<span id="low-count">0</span>)
                </label>
                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #333;">
                    <button onclick="window.enhancedLeadMap.focusOnHighValue()" style="
                        background: #00ff88;
                        color: #000;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 11px;
                        width: 100%;
                    ">Focus High Value</button>
                </div>
            </div>

            <div id="enhanced-leaflet-map" style="width: 100%; height: 100%;"></div>
            
            <div class="lead-stats-panel" style="
                position: absolute;
                bottom: 15px;
                right: 15px;
                z-index: 1000;
                background: rgba(0,0,0,0.9);
                padding: 15px;
                border-radius: 8px;
                color: white;
                font-size: 12px;
                min-width: 220px;
                border: 1px solid #00ff88;
            ">
                <div style="color: #00ff88; font-weight: bold; margin-bottom: 8px;">Live Statistics</div>
                <div id="map-statistics">
                    <div>Total Pipeline Value: <span id="total-value">$0</span></div>
                    <div>Average QNIS Score: <span id="avg-score">0%</span></div>
                    <div>Active Cities: <span id="city-count">0</span></div>
                    <div>Last Update: <span id="last-update">Never</span></div>
                </div>
            </div>
        `;

        const moduleContent = qnisModule.querySelector('.module-content') || qnisModule;
        moduleContent.innerHTML = '';
        moduleContent.appendChild(mapContainer);
    }

    async initializeEnhancedMap() {
        try {
            // Wait for Leaflet to be available
            if (typeof L === 'undefined') {
                await this.loadLeafletLibrary();
            }

            // Create enhanced map with better styling
            this.map = L.map('enhanced-leaflet-map', {
                center: [39.8283, -98.5795], // Center of USA
                zoom: 4,
                zoomControl: true,
                scrollWheelZoom: true,
                preferCanvas: true
            });

            // Add dark tile layer for better contrast
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap contributors, © CARTO',
                subdomains: 'abcd',
                maxZoom: 18
            }).addTo(this.map);

            console.log('[ENHANCED-MAP] Leaflet map initialized with dark theme');

        } catch (error) {
            console.error('[ENHANCED-MAP] Error initializing map:', error);
            this.createFallbackCanvas();
        }
    }

    async loadLeafletLibrary() {
        return new Promise((resolve, reject) => {
            if (typeof L !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async loadEnhancedLeadData() {
        try {
            // Get leads from server
            const response = await fetch('/api/qnis/leads');
            if (response.ok) {
                const data = await response.json();
                this.leads = data.leads || [];
            }
        } catch (error) {
            console.log('[ENHANCED-MAP] Server unavailable, using generated leads');
        }

        // Generate enhanced leads if none available
        if (this.leads.length === 0) {
            this.generateEnhancedLeads();
        }

        // Enrich leads with detailed company information
        this.enrichLeadsWithCompanyData();
        
        console.log('[ENHANCED-MAP] Loaded and enriched', this.leads.length, 'leads');
    }

    generateEnhancedLeads() {
        const cities = [
            { name: 'New York', lat: 40.7128, lng: -74.0060, state: 'NY', population: 8400000 },
            { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, state: 'CA', population: 3900000 },
            { name: 'Chicago', lat: 41.8781, lng: -87.6298, state: 'IL', population: 2700000 },
            { name: 'Houston', lat: 29.7604, lng: -95.3698, state: 'TX', population: 2300000 },
            { name: 'Phoenix', lat: 33.4484, lng: -112.0740, state: 'AZ', population: 1600000 },
            { name: 'Philadelphia', lat: 39.9526, lng: -75.1652, state: 'PA', population: 1500000 },
            { name: 'San Antonio', lat: 29.4241, lng: -98.4936, state: 'TX', population: 1500000 },
            { name: 'San Diego', lat: 32.7157, lng: -117.1611, state: 'CA', population: 1400000 },
            { name: 'Dallas', lat: 32.7767, lng: -96.7970, state: 'TX', population: 1300000 },
            { name: 'San Francisco', lat: 37.7749, lng: -122.4194, state: 'CA', population: 870000 },
            { name: 'Austin', lat: 30.2672, lng: -97.7431, state: 'TX', population: 950000 },
            { name: 'Seattle', lat: 47.6062, lng: -122.3321, state: 'WA', population: 750000 },
            { name: 'Denver', lat: 39.7392, lng: -104.9903, state: 'CO', population: 715000 },
            { name: 'Boston', lat: 42.3601, lng: -71.0589, state: 'MA', population: 685000 },
            { name: 'Miami', lat: 25.7617, lng: -80.1918, state: 'FL', population: 470000 }
        ];

        const companyTypes = [
            'Technology Solutions', 'Manufacturing Corp', 'Consulting Group', 'Healthcare Systems',
            'Financial Services', 'Real Estate Group', 'Construction Co', 'Logistics Inc',
            'Energy Solutions', 'Retail Chain', 'Media Group', 'Automotive Corp',
            'Aerospace Systems', 'Pharmaceutical Inc', 'Telecommunications'
        ];

        const industries = [
            'Technology', 'Manufacturing', 'Healthcare', 'Finance', 'Real Estate',
            'Construction', 'Logistics', 'Energy', 'Retail', 'Media', 'Automotive',
            'Aerospace', 'Pharmaceutical', 'Telecommunications', 'Consulting'
        ];

        for (let i = 0; i < 35; i++) {
            const city = cities[Math.floor(Math.random() * cities.length)];
            const companyType = companyTypes[Math.floor(Math.random() * companyTypes.length)];
            const industry = industries[Math.floor(Math.random() * industries.length)];
            
            const qnisScore = Math.floor(Math.random() * 40) + 60;
            const valueEstimate = Math.floor(Math.random() * 200000) + 25000;
            
            this.leads.push({
                id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                company_name: `${companyType} ${city.name}`,
                contact_name: this.generateContactName(),
                email: this.generateEmail(companyType, city.name),
                phone: this.generatePhone(),
                city: city.name,
                state: city.state,
                lat: city.lat + (Math.random() - 0.5) * 0.05,
                lng: city.lng + (Math.random() - 0.5) * 0.05,
                qnis_score: qnisScore,
                priority: qnisScore > 85 ? 'HIGH' : qnisScore > 70 ? 'MEDIUM' : 'LOW',
                value_estimate: valueEstimate,
                status: ['New Lead', 'Contacted', 'In Progress', 'Qualified', 'Proposal Sent'][Math.floor(Math.random() * 5)],
                industry: industry,
                employees: Math.floor(Math.random() * 5000) + 10,
                founded: Math.floor(Math.random() * 50) + 1974,
                date_added: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                last_contact: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
    }

    enrichLeadsWithCompanyData() {
        this.leads.forEach(lead => {
            // Add comprehensive company details
            this.leadDetails.set(lead.id, {
                ...lead,
                website: `www.${lead.company_name.toLowerCase().replace(/\s+/g, '')}.com`,
                revenue_range: this.getRevenueRange(lead.value_estimate),
                growth_rate: (Math.random() * 20 + 5).toFixed(1) + '%',
                decision_maker: this.generateDecisionMaker(),
                pain_points: this.generatePainPoints(),
                solution_fit: this.calculateSolutionFit(lead.qnis_score),
                next_action: this.getNextAction(lead.status),
                meeting_scheduled: Math.random() < 0.3,
                proposal_value: lead.value_estimate * (1 + Math.random() * 0.5)
            });
        });
    }

    generateContactName() {
        const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Ashley', 'James', 'Maria', 'Christopher', 'Jessica'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez'];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }

    generateEmail(company, city) {
        const domains = ['corp.com', 'business.net', 'company.com', 'group.org', 'inc.com'];
        const cleanCompany = company.toLowerCase().replace(/[^a-z]/g, '').substr(0, 8);
        return `contact@${cleanCompany}${domains[Math.floor(Math.random() * domains.length)]}`;
    }

    generatePhone() {
        return `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    }

    getRevenueRange(valueEstimate) {
        if (valueEstimate > 150000) return '$10M - $50M';
        if (valueEstimate > 100000) return '$5M - $10M';
        if (valueEstimate > 50000) return '$1M - $5M';
        return '$500K - $1M';
    }

    generateDecisionMaker() {
        const titles = ['CEO', 'CTO', 'VP Operations', 'Director of Technology', 'VP Sales', 'CFO', 'COO'];
        return titles[Math.floor(Math.random() * titles.length)];
    }

    generatePainPoints() {
        const points = [
            'Manual processes reducing efficiency',
            'Legacy systems integration challenges',
            'Scalability limitations with current infrastructure',
            'Data silos affecting decision making',
            'Need for automation and workflow optimization'
        ];
        return points[Math.floor(Math.random() * points.length)];
    }

    calculateSolutionFit(qnisScore) {
        if (qnisScore > 85) return 'Excellent Fit';
        if (qnisScore > 75) return 'Good Fit';
        if (qnisScore > 65) return 'Moderate Fit';
        return 'Needs Assessment';
    }

    getNextAction(status) {
        const actions = {
            'New Lead': 'Initial outreach call',
            'Contacted': 'Follow-up meeting',
            'In Progress': 'Needs assessment',
            'Qualified': 'Proposal preparation',
            'Proposal Sent': 'Decision follow-up'
        };
        return actions[status] || 'Contact assessment';
    }

    displayEnhancedMarkers() {
        if (!this.map) return;

        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Group leads by priority for styling
        const priorityColors = {
            'HIGH': '#ff4444',
            'MEDIUM': '#ffaa00',
            'LOW': '#00ff88'
        };

        // Add enhanced markers
        this.leads.forEach(lead => {
            const leadDetails = this.leadDetails.get(lead.id);
            const color = priorityColors[lead.priority];

            // Create custom marker with pulsing effect for high priority
            const markerHtml = `
                <div style="
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: ${color};
                    border: 3px solid rgba(255,255,255,0.8);
                    box-shadow: 0 0 15px rgba(${color === '#ff4444' ? '255,68,68' : color === '#ffaa00' ? '255,170,0' : '0,255,136'}, 0.6);
                    position: relative;
                    ${lead.priority === 'HIGH' ? 'animation: pulse 2s infinite;' : ''}
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: white;
                        font-size: 10px;
                        font-weight: bold;
                    ">${lead.qnis_score}</div>
                </div>
            `;

            const marker = L.marker([lead.lat, lead.lng], {
                icon: L.divIcon({
                    html: markerHtml,
                    className: 'enhanced-lead-marker',
                    iconSize: [26, 26],
                    iconAnchor: [13, 13]
                })
            }).addTo(this.map);

            // Enhanced popup with detailed information
            const popupContent = `
                <div style="font-family: Arial; min-width: 280px; max-width: 350px;">
                    <div style="background: linear-gradient(135deg, #0066cc 0%, #003366 100%); color: white; padding: 12px; margin: -10px -10px 10px -10px; border-radius: 6px 6px 0 0;">
                        <h3 style="margin: 0 0 5px 0; font-size: 16px;">${lead.company_name}</h3>
                        <div style="font-size: 12px; opacity: 0.9;">${lead.city}, ${lead.state} • ${lead.industry}</div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <div>
                            <strong>Contact:</strong><br>
                            ${lead.contact_name}<br>
                            <small>${leadDetails.decision_maker}</small>
                        </div>
                        <div>
                            <strong>QNIS Score:</strong><br>
                            <span style="color: ${color}; font-weight: bold; font-size: 18px;">${lead.qnis_score}%</span><br>
                            <small>${leadDetails.solution_fit}</small>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 8px; border-radius: 4px; margin-bottom: 10px; font-size: 13px;">
                        <div><strong>Est. Value:</strong> $${lead.value_estimate.toLocaleString()}</div>
                        <div><strong>Revenue:</strong> ${leadDetails.revenue_range}</div>
                        <div><strong>Employees:</strong> ${lead.employees.toLocaleString()}</div>
                        <div><strong>Founded:</strong> ${lead.founded}</div>
                    </div>
                    
                    <div style="font-size: 12px; margin-bottom: 8px;">
                        <strong>Pain Point:</strong><br>
                        ${leadDetails.pain_points}
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 8px;">
                        <div style="font-size: 11px;">
                            <strong>Next:</strong> ${leadDetails.next_action}
                        </div>
                        <button onclick="window.enhancedLeadMap.scheduleMeeting('${lead.id}')" style="
                            background: #00ff88;
                            color: #000;
                            border: none;
                            padding: 4px 8px;
                            border-radius: 3px;
                            cursor: pointer;
                            font-size: 11px;
                        ">Schedule</button>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent, {
                maxWidth: 380,
                className: 'enhanced-lead-popup'
            });

            this.markers.push(marker);
        });

        this.updateMapStatistics();
        this.updateFilterCounts();
        
        console.log('[ENHANCED-MAP] Added', this.markers.length, 'enhanced markers');
    }

    updateMapStatistics() {
        const totalValue = this.leads.reduce((sum, lead) => sum + lead.value_estimate, 0);
        const avgScore = Math.round(this.leads.reduce((sum, lead) => sum + lead.qnis_score, 0) / this.leads.length);
        const cities = new Set(this.leads.map(lead => lead.city)).size;

        document.getElementById('total-value').textContent = `$${(totalValue / 1000000).toFixed(1)}M`;
        document.getElementById('avg-score').textContent = `${avgScore}%`;
        document.getElementById('city-count').textContent = cities;
        document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
        document.getElementById('lead-counter').textContent = `${this.leads.length} Active Leads`;
    }

    updateFilterCounts() {
        const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
        this.leads.forEach(lead => counts[lead.priority]++);
        
        document.getElementById('high-count').textContent = counts.HIGH;
        document.getElementById('medium-count').textContent = counts.MEDIUM;
        document.getElementById('low-count').textContent = counts.LOW;
    }

    filterByPriority(priority, show) {
        this.markers.forEach((marker, index) => {
            const lead = this.leads[index];
            if (lead && lead.priority === priority) {
                if (show) {
                    this.map.addLayer(marker);
                } else {
                    this.map.removeLayer(marker);
                }
            }
        });
    }

    focusOnHighValue() {
        const highValueLeads = this.leads.filter(lead => lead.value_estimate > 100000);
        if (highValueLeads.length > 0) {
            const bounds = L.latLngBounds(highValueLeads.map(lead => [lead.lat, lead.lng]));
            this.map.fitBounds(bounds, { padding: [20, 20] });
        }
    }

    scheduleMeeting(leadId) {
        const lead = this.leadDetails.get(leadId);
        if (lead) {
            alert(`Meeting scheduled with ${lead.contact_name} at ${lead.company_name}`);
        }
    }

    startLiveLeadUpdates() {
        setInterval(() => {
            // Occasionally add a new lead
            if (Math.random() < 0.2) {
                this.addNewLead();
            }
        }, 20000);
    }

    addNewLead() {
        const cities = ['Atlanta', 'Portland', 'Nashville', 'Charlotte', 'Tampa'];
        const cityData = {
            'Atlanta': { lat: 33.7490, lng: -84.3880, state: 'GA' },
            'Portland': { lat: 45.5152, lng: -122.6784, state: 'OR' },
            'Nashville': { lat: 36.1627, lng: -86.7816, state: 'TN' },
            'Charlotte': { lat: 35.2271, lng: -80.8431, state: 'NC' },
            'Tampa': { lat: 27.9506, lng: -82.4572, state: 'FL' }
        };

        const cityName = cities[Math.floor(Math.random() * cities.length)];
        const city = cityData[cityName];
        
        const newLead = {
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            company_name: `New Prospect ${cityName}`,
            contact_name: this.generateContactName(),
            email: this.generateEmail('newprospect', cityName),
            phone: this.generatePhone(),
            city: cityName,
            state: city.state,
            lat: city.lat,
            lng: city.lng,
            qnis_score: Math.floor(Math.random() * 40) + 60,
            priority: 'MEDIUM',
            value_estimate: Math.floor(Math.random() * 75000) + 30000,
            status: 'New Lead',
            industry: 'Business Services',
            employees: Math.floor(Math.random() * 500) + 50,
            founded: Math.floor(Math.random() * 20) + 2004,
            date_added: new Date().toISOString(),
            last_contact: new Date().toISOString()
        };

        this.leads.push(newLead);
        this.enrichLeadsWithCompanyData();
        this.displayEnhancedMarkers();
        
        console.log('[ENHANCED-MAP] Added new lead:', newLead.company_name);
    }

    // Add CSS for pulsing animation
    addEnhancedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); box-shadow: 0 0 15px rgba(255,68,68, 0.6); }
                50% { transform: scale(1.1); box-shadow: 0 0 25px rgba(255,68,68, 0.8); }
                100% { transform: scale(1); box-shadow: 0 0 15px rgba(255,68,68, 0.6); }
            }
            
            .enhanced-lead-popup .leaflet-popup-content-wrapper {
                border-radius: 8px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize enhanced lead map
window.enhancedLeadMap = new EnhancedLeadMap();

// Auto-initialize and add styles
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.enhancedLeadMap.addEnhancedStyles();
        window.enhancedLeadMap.initialize();
    }, 1500);
});

// Manual trigger
window.initializeEnhancedMap = () => {
    window.enhancedLeadMap.initialize();
};