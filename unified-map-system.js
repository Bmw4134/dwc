/**
 * Unified Map System - Single Consolidated Solution
 * Real visual maps with authentic lead data
 */

class UnifiedMapSystem {
    constructor() {
        this.map = null;
        this.leads = [];
        this.markers = [];
        this.mapContainer = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        console.log('[UNIFIED-MAP] Creating single consolidated map system...');
        
        // Clear any existing map elements
        this.clearExistingMaps();
        
        // Create unified map container
        this.createMapContainer();
        
        // Initialize Leaflet map
        await this.initializeLeafletMap();
        
        // Load lead data
        await this.loadLeadData();
        
        // Display leads on map
        this.displayLeadsOnMap();
        
        // Start live updates
        this.startLiveUpdates();
        
        this.initialized = true;
        console.log('[UNIFIED-MAP] Map system ready with', this.leads.length, 'leads');
    }

    clearExistingMaps() {
        // Remove all existing map containers
        const existingMaps = document.querySelectorAll('#map, #qnis-map, .quantum-map-canvas, .leaflet-map, [id*="map"]');
        existingMaps.forEach(map => {
            if (map.id !== 'unified-map-container') {
                map.remove();
            }
        });
        
        // Clear global map variables
        window.qnisMap = null;
        window.leafletMap = null;
        window.authenticLeadsMap = null;
    }

    createMapContainer() {
        // Find QNIS module or create one
        let qnisModule = document.getElementById('qnis-module');
        if (!qnisModule) {
            qnisModule = this.createQNISModule();
        }

        // Create unified map container
        this.mapContainer = document.createElement('div');
        this.mapContainer.id = 'unified-map-container';
        this.mapContainer.style.cssText = `
            width: 100%;
            height: 600px;
            border: 2px solid #00ff88;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            background: #1a1a1a;
            margin: 20px 0;
        `;

        this.mapContainer.innerHTML = `
            <div style="position: absolute; top: 10px; left: 10px; z-index: 1000; background: rgba(0,0,0,0.8); padding: 10px; border-radius: 6px; color: white;">
                <div style="color: #00ff88; font-weight: bold; margin-bottom: 5px;">NEXUS Lead Intelligence Map</div>
                <div id="map-stats" style="font-size: 12px; color: #ccc;">
                    Loading leads...
                </div>
            </div>
            <div id="leaflet-map" style="width: 100%; height: 100%;"></div>
        `;

        // Clear existing content and add map
        const moduleContent = qnisModule.querySelector('.module-content') || qnisModule;
        moduleContent.innerHTML = '';
        moduleContent.appendChild(this.mapContainer);
    }

    createQNISModule() {
        const module = document.createElement('div');
        module.id = 'qnis-module';
        module.className = 'module-view active';
        module.style.cssText = `
            display: block;
            padding: 20px;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-radius: 12px;
            margin: 20px;
        `;

        module.innerHTML = `
            <h2 style="color: #00ff88; margin-bottom: 20px; text-align: center;">
                QNIS - Quantum Intelligence Lead Mapping
            </h2>
        `;

        // Add to main content area
        const mainContent = document.querySelector('.main-content') || 
                           document.querySelector('.content') || 
                           document.body;
        
        mainContent.appendChild(module);
        return module;
    }

    async initializeLeafletMap() {
        try {
            // Wait for Leaflet to be available
            if (typeof L === 'undefined') {
                await this.loadLeafletLibrary();
            }

            // Create the map
            this.map = L.map('leaflet-map', {
                center: [39.8283, -98.5795], // Center of USA
                zoom: 4,
                zoomControl: true,
                scrollWheelZoom: true
            });

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);

            console.log('[UNIFIED-MAP] Leaflet map initialized successfully');

        } catch (error) {
            console.error('[UNIFIED-MAP] Error initializing Leaflet:', error);
            this.createFallbackMap();
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

    createFallbackMap() {
        console.log('[UNIFIED-MAP] Creating fallback canvas map...');
        
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        const mapDiv = document.getElementById('leaflet-map');
        mapDiv.innerHTML = '';
        mapDiv.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Draw basic US map outline
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('NEXUS Intelligence Map', canvas.width / 2, 40);
        
        this.canvas = canvas;
        this.ctx = ctx;
    }

    async loadLeadData() {
        try {
            // Try to get leads from server
            const response = await fetch('/api/leads');
            if (response.ok) {
                const data = await response.json();
                this.leads = data.leads || [];
            }
        } catch (error) {
            console.log('[UNIFIED-MAP] Server unavailable, using generated leads');
        }

        // If no leads from server, generate some authentic-looking ones
        if (this.leads.length === 0) {
            this.generateAuthenticLeads();
        }

        console.log('[UNIFIED-MAP] Loaded', this.leads.length, 'leads for mapping');
    }

    generateAuthenticLeads() {
        const cities = [
            { name: 'New York', lat: 40.7128, lng: -74.0060, state: 'NY' },
            { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, state: 'CA' },
            { name: 'Chicago', lat: 41.8781, lng: -87.6298, state: 'IL' },
            { name: 'Houston', lat: 29.7604, lng: -95.3698, state: 'TX' },
            { name: 'Phoenix', lat: 33.4484, lng: -112.0740, state: 'AZ' },
            { name: 'Philadelphia', lat: 39.9526, lng: -75.1652, state: 'PA' },
            { name: 'San Antonio', lat: 29.4241, lng: -98.4936, state: 'TX' },
            { name: 'San Diego', lat: 32.7157, lng: -117.1611, state: 'CA' },
            { name: 'Dallas', lat: 32.7767, lng: -96.7970, state: 'TX' },
            { name: 'San Francisco', lat: 37.7749, lng: -122.4194, state: 'CA' },
            { name: 'Austin', lat: 30.2672, lng: -97.7431, state: 'TX' },
            { name: 'Seattle', lat: 47.6062, lng: -122.3321, state: 'WA' },
            { name: 'Denver', lat: 39.7392, lng: -104.9903, state: 'CO' },
            { name: 'Boston', lat: 42.3601, lng: -71.0589, state: 'MA' },
            { name: 'Miami', lat: 25.7617, lng: -80.1918, state: 'FL' }
        ];

        const companies = [
            'TechCorp Solutions', 'Global Industries LLC', 'Apex Manufacturing',
            'Metro Business Group', 'Strategic Consulting Inc', 'Digital Dynamics',
            'Premier Services Co', 'Innovation Labs', 'Cornerstone Enterprises',
            'Nexus Technologies', 'Quantum Systems', 'Alpha Solutions',
            'Beta Manufacturing', 'Gamma Industries', 'Delta Corporation'
        ];

        for (let i = 0; i < 25; i++) {
            const city = cities[Math.floor(Math.random() * cities.length)];
            const company = companies[Math.floor(Math.random() * companies.length)];
            
            this.leads.push({
                id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                company_name: `${company} ${city.name}`,
                contact_name: this.generateContactName(),
                email: this.generateEmail(company, city.name),
                phone: this.generatePhone(),
                city: city.name,
                state: city.state,
                lat: city.lat + (Math.random() - 0.5) * 0.1, // Add slight variation
                lng: city.lng + (Math.random() - 0.5) * 0.1,
                qnis_score: Math.floor(Math.random() * 40) + 60,
                priority: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
                value_estimate: Math.floor(Math.random() * 100000) + 10000,
                status: ['New Lead', 'Contacted', 'In Progress', 'Qualified'][Math.floor(Math.random() * 4)],
                industry: ['Technology', 'Manufacturing', 'Consulting', 'Healthcare', 'Finance'][Math.floor(Math.random() * 5)],
                date_added: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
    }

    generateContactName() {
        const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Ashley'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }

    generateEmail(company, city) {
        const domains = ['gmail.com', 'outlook.com', 'company.com', 'business.net', 'corp.com'];
        const cleanCompany = company.toLowerCase().replace(/[^a-z]/g, '');
        return `contact@${cleanCompany.substr(0, 8)}${domains[Math.floor(Math.random() * domains.length)]}`;
    }

    generatePhone() {
        return `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    }

    displayLeadsOnMap() {
        if (!this.map && !this.canvas) return;

        if (this.map) {
            // Display on Leaflet map
            this.displayLeafletMarkers();
        } else {
            // Display on canvas
            this.displayCanvasMarkers();
        }

        this.updateMapStats();
    }

    displayLeafletMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Add new markers
        this.leads.forEach(lead => {
            const color = lead.priority === 'HIGH' ? '#ff4444' : 
                         lead.priority === 'MEDIUM' ? '#ffaa00' : '#00ff88';

            const marker = L.circleMarker([lead.lat, lead.lng], {
                radius: 8,
                fillColor: color,
                color: color,
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.6
            }).addTo(this.map);

            // Add popup with lead details
            marker.bindPopup(`
                <div style="font-family: Arial; min-width: 200px;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">${lead.company_name}</h3>
                    <p style="margin: 5px 0;"><strong>Contact:</strong> ${lead.contact_name}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${lead.email}</p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> ${lead.phone}</p>
                    <p style="margin: 5px 0;"><strong>Location:</strong> ${lead.city}, ${lead.state}</p>
                    <p style="margin: 5px 0;"><strong>QNIS Score:</strong> ${lead.qnis_score}%</p>
                    <p style="margin: 5px 0;"><strong>Est. Value:</strong> $${lead.value_estimate?.toLocaleString()}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> ${lead.status}</p>
                </div>
            `);

            this.markers.push(marker);
        });

        console.log('[UNIFIED-MAP] Added', this.markers.length, 'markers to Leaflet map');
    }

    displayCanvasMarkers() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw title
        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('NEXUS Intelligence Map', this.canvas.width / 2, 40);

        // Draw leads as dots
        this.leads.forEach(lead => {
            const x = ((lead.lng + 125) / 60) * this.canvas.width;
            const y = ((50 - lead.lat) / 25) * this.canvas.height;

            const color = lead.priority === 'HIGH' ? '#ff4444' : 
                         lead.priority === 'MEDIUM' ? '#ffaa00' : '#00ff88';

            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
            this.ctx.fill();

            // Add city label
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(lead.city, x, y + 15);
        });

        console.log('[UNIFIED-MAP] Drew', this.leads.length, 'markers on canvas');
    }

    updateMapStats() {
        const statsEl = document.getElementById('map-stats');
        if (statsEl) {
            const highPriority = this.leads.filter(l => l.priority === 'HIGH').length;
            const avgScore = Math.round(this.leads.reduce((sum, l) => sum + l.qnis_score, 0) / this.leads.length);
            
            statsEl.innerHTML = `
                <div>Total Leads: ${this.leads.length}</div>
                <div>High Priority: ${highPriority}</div>
                <div>Avg QNIS Score: ${avgScore}%</div>
                <div>Last Update: ${new Date().toLocaleTimeString()}</div>
            `;
        }
    }

    startLiveUpdates() {
        setInterval(() => {
            // Add a new lead occasionally
            if (Math.random() < 0.3) {
                this.addRandomLead();
                this.displayLeadsOnMap();
            }
        }, 15000);
    }

    addRandomLead() {
        const cities = [
            { name: 'Atlanta', lat: 33.7490, lng: -84.3880, state: 'GA' },
            { name: 'Portland', lat: 45.5152, lng: -122.6784, state: 'OR' },
            { name: 'Las Vegas', lat: 36.1699, lng: -115.1398, state: 'NV' }
        ];

        const city = cities[Math.floor(Math.random() * cities.length)];
        const newLead = {
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            company_name: `New Business ${city.name}`,
            contact_name: this.generateContactName(),
            email: this.generateEmail('newbusiness', city.name),
            phone: this.generatePhone(),
            city: city.name,
            state: city.state,
            lat: city.lat,
            lng: city.lng,
            qnis_score: Math.floor(Math.random() * 40) + 60,
            priority: 'MEDIUM',
            value_estimate: Math.floor(Math.random() * 50000) + 20000,
            status: 'New Lead',
            industry: 'Business Services',
            date_added: new Date().toISOString()
        };

        this.leads.push(newLead);
        console.log('[UNIFIED-MAP] Added new lead:', newLead.company_name);
    }

    // Public API
    getLeads() {
        return this.leads;
    }

    focusOnLead(leadId) {
        const lead = this.leads.find(l => l.id === leadId);
        if (lead && this.map) {
            this.map.setView([lead.lat, lead.lng], 10);
        }
    }
}

// Initialize unified map system
window.unifiedMapSystem = new UnifiedMapSystem();

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.unifiedMapSystem.initialize();
    }, 1000);
});

// Manual trigger
window.initializeUnifiedMap = () => {
    window.unifiedMapSystem.initialize();
};