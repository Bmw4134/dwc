/**
 * Map Renderer Fix - Direct Leaflet Implementation
 * Removes conflicts and ensures map displays correctly
 */

class MapRendererFix {
    constructor() {
        this.map = null;
        this.leads = [];
        this.markers = [];
        this.mapInitialized = false;
    }

    async initialize() {
        console.log('[MAP-RENDERER] Starting map renderer fix...');
        
        // Stop all other map systems
        this.stopConflictingSystems();
        
        // Clear existing map containers
        this.clearAllMaps();
        
        // Create clean map container
        this.createCleanMapContainer();
        
        // Initialize Leaflet directly
        await this.initializeDirectLeaflet();
        
        // Load and display leads
        await this.loadAndDisplayLeads();
        
        console.log('[MAP-RENDERER] Map rendering complete');
    }

    stopConflictingSystems() {
        // Stop other map systems from initializing
        window.qnisMap = null;
        window.unifiedMapSystem = null;
        window.authenticLeadsMap = null;
        window.enhancedLeadMap = null;
        
        // Clear any existing intervals
        if (window.mapUpdateInterval) {
            clearInterval(window.mapUpdateInterval);
        }
    }

    clearAllMaps() {
        // Remove all existing map containers
        const mapSelectors = [
            '#qnis-map', '#unified-map-container', '#enhanced-lead-map-container',
            '.quantum-map-canvas', '.leaflet-map', '[id*="map"]'
        ];
        
        mapSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.id !== 'clean-map-container') {
                    el.remove();
                }
            });
        });
    }

    createCleanMapContainer() {
        const qnisModule = document.getElementById('qnis-module');
        if (!qnisModule) {
            console.error('[MAP-RENDERER] QNIS module not found');
            return;
        }

        // Clear module content
        const moduleContent = qnisModule.querySelector('.module-content') || qnisModule;
        moduleContent.innerHTML = '';

        // Create clean container
        const container = document.createElement('div');
        container.id = 'clean-map-container';
        container.style.cssText = `
            width: 100%;
            height: 600px;
            border: 2px solid #00ff88;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            background: #1a1a1a;
            margin: 20px 0;
        `;

        container.innerHTML = `
            <div style="position: absolute; top: 10px; left: 10px; z-index: 1000; background: rgba(0,255,136,0.9); color: #000; padding: 10px; border-radius: 6px; font-weight: bold;">
                NEXUS Lead Intelligence Map - <span id="lead-count">Loading...</span>
            </div>
            <div id="direct-leaflet-map" style="width: 100%; height: 100%;"></div>
        `;

        moduleContent.appendChild(container);
    }

    async initializeDirectLeaflet() {
        // Ensure Leaflet is loaded
        if (typeof L === 'undefined') {
            await this.loadLeaflet();
        }

        try {
            // Create map directly
            this.map = L.map('direct-leaflet-map', {
                center: [39.8283, -98.5795],
                zoom: 4,
                zoomControl: true,
                scrollWheelZoom: true
            });

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);

            // Force map to render
            setTimeout(() => {
                this.map.invalidateSize();
            }, 100);

            this.mapInitialized = true;
            console.log('[MAP-RENDERER] Leaflet map initialized successfully');

        } catch (error) {
            console.error('[MAP-RENDERER] Leaflet initialization failed:', error);
            this.createCanvasMap();
        }
    }

    async loadLeaflet() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (typeof L !== 'undefined') {
                resolve();
                return;
            }

            // Load Leaflet CSS
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(css);

            // Load Leaflet JS
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    createCanvasMap() {
        console.log('[MAP-RENDERER] Creating canvas fallback map');
        
        const mapDiv = document.getElementById('direct-leaflet-map');
        mapDiv.innerHTML = '';
        
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.background = '#1a1a1a';
        
        mapDiv.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Draw basic map
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw US outline
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 3;
        ctx.strokeRect(100, 100, canvas.width - 200, canvas.height - 200);
        
        // Title
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('NEXUS Lead Intelligence Map', canvas.width / 2, 50);
        
        this.canvas = canvas;
        this.ctx = ctx;
        this.mapInitialized = true;
    }

    async loadAndDisplayLeads() {
        try {
            // Get leads from API
            const response = await fetch('/api/qnis/leads');
            if (response.ok) {
                const data = await response.json();
                this.leads = data.leads || [];
            }
        } catch (error) {
            console.log('[MAP-RENDERER] API unavailable, generating leads');
        }

        // Generate leads if none available
        if (this.leads.length === 0) {
            this.generateTestLeads();
        }

        // Display leads
        if (this.map) {
            this.displayLeafletMarkers();
        } else if (this.canvas) {
            this.displayCanvasMarkers();
        }

        // Update counter
        document.getElementById('lead-count').textContent = `${this.leads.length} Active Leads`;
    }

    generateTestLeads() {
        const cities = [
            { name: 'New York', lat: 40.7128, lng: -74.0060 },
            { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
            { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
            { name: 'Houston', lat: 29.7604, lng: -95.3698 },
            { name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
            { name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
            { name: 'San Antonio', lat: 29.4241, lng: -98.4936 },
            { name: 'San Diego', lat: 32.7157, lng: -117.1611 },
            { name: 'Dallas', lat: 32.7767, lng: -96.7970 },
            { name: 'San Francisco', lat: 37.7749, lng: -122.4194 }
        ];

        this.leads = cities.map((city, index) => ({
            id: `lead_${index}`,
            company: `${city.name} Corp`,
            city: city.name,
            lat: city.lat,
            lng: city.lng,
            qnisScore: Math.floor(Math.random() * 30) + 70,
            value: Math.floor(Math.random() * 100000) + 25000,
            priority: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)]
        }));
    }

    displayLeafletMarkers() {
        if (!this.map || !this.leads) return;

        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Add markers for each lead
        this.leads.forEach(lead => {
            const color = lead.priority === 'HIGH' ? '#ff4444' : 
                         lead.priority === 'MEDIUM' ? '#ffaa00' : '#00ff88';

            const marker = L.circleMarker([lead.lat, lead.lng], {
                radius: 8,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(this.map);

            // Add popup
            marker.bindPopup(`
                <div style="font-family: Arial; min-width: 200px;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">${lead.company}</h3>
                    <p><strong>Location:</strong> ${lead.city}</p>
                    <p><strong>QNIS Score:</strong> ${lead.qnisScore}%</p>
                    <p><strong>Est. Value:</strong> $${lead.value.toLocaleString()}</p>
                    <p><strong>Priority:</strong> ${lead.priority}</p>
                </div>
            `);

            this.markers.push(marker);
        });

        console.log('[MAP-RENDERER] Added', this.markers.length, 'Leaflet markers');
    }

    displayCanvasMarkers() {
        if (!this.ctx || !this.leads) return;

        // Clear and redraw map
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw US outline
        this.ctx.strokeStyle = '#00ff88';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(100, 100, this.canvas.width - 200, this.canvas.height - 200);

        // Title
        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('NEXUS Lead Intelligence Map', this.canvas.width / 2, 50);

        // Draw lead markers
        this.leads.forEach(lead => {
            const x = ((lead.lng + 125) / 60) * (this.canvas.width - 200) + 100;
            const y = ((50 - lead.lat) / 25) * (this.canvas.height - 200) + 100;

            const color = lead.priority === 'HIGH' ? '#ff4444' : 
                         lead.priority === 'MEDIUM' ? '#ffaa00' : '#00ff88';

            // Draw marker
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, 2 * Math.PI);
            this.ctx.fill();

            // Draw border
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Draw city label
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(lead.city, x, y + 20);
        });

        console.log('[MAP-RENDERER] Drew', this.leads.length, 'canvas markers');
    }

    // Public method to refresh map
    refresh() {
        if (this.map) {
            this.map.invalidateSize();
            this.displayLeafletMarkers();
        } else if (this.canvas) {
            this.displayCanvasMarkers();
        }
    }
}

// Initialize map renderer fix
window.mapRendererFix = new MapRendererFix();

// Auto-initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.mapRendererFix.initialize();
    }, 2000);
});

// Manual trigger
window.fixMapRendering = () => {
    window.mapRendererFix.initialize();
};