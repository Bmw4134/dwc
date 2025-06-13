/**
 * QNIS Map Fix - Working Geographic Lead Visualization
 * Replaces conflicting map implementations with a single working solution
 */

class QNISMapFix {
    constructor() {
        this.mapContainer = null;
        this.canvas = null;
        this.ctx = null;
        this.leadData = [];
        this.isInitialized = false;
    }

    async initialize() {
        console.log('[QNIS-FIX] Initializing working map system');
        
        // Find or create map container
        this.findMapContainer();
        
        // Clear any existing map content
        this.clearContainer();
        
        // Try Leaflet first, fallback to canvas
        try {
            await this.initializeLeafletMap();
        } catch (error) {
            console.log('[QNIS-FIX] Using canvas fallback');
            this.initializeCanvasMap();
        }
        
        // Load and display leads
        await this.loadLeads();
        this.displayLeads();
        
        this.isInitialized = true;
        console.log('[QNIS-FIX] Map system ready');
    }

    findMapContainer() {
        // Try multiple possible container IDs
        const possibleIds = ['qnis-map', 'quantum-map-container', 'map-container'];
        
        for (const id of possibleIds) {
            this.mapContainer = document.getElementById(id);
            if (this.mapContainer) break;
        }
        
        // If no container found, create one
        if (!this.mapContainer) {
            this.createMapContainer();
        }
    }

    createMapContainer() {
        console.log('[QNIS-FIX] Creating map container');
        
        // Find QNIS module or create in dashboard
        const qnisModule = document.getElementById('qnis-module') || 
                          document.querySelector('[data-module="qnis"]') ||
                          document.querySelector('.qnis-container');
        
        if (qnisModule) {
            this.mapContainer = document.createElement('div');
            this.mapContainer.id = 'qnis-map';
            this.mapContainer.style.cssText = `
                width: 100%;
                height: 500px;
                background: #0f172a;
                border-radius: 8px;
                border: 1px solid #334155;
                margin: 20px 0;
                position: relative;
                overflow: hidden;
            `;
            qnisModule.appendChild(this.mapContainer);
        } else {
            // Fallback: create in body
            this.mapContainer = document.createElement('div');
            this.mapContainer.id = 'qnis-map';
            this.mapContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                height: 300px;
                background: #0f172a;
                border-radius: 8px;
                border: 1px solid #334155;
                z-index: 1000;
            `;
            document.body.appendChild(this.mapContainer);
        }
    }

    clearContainer() {
        if (this.mapContainer) {
            this.mapContainer.innerHTML = '';
        }
    }

    async initializeLeafletMap() {
        return new Promise((resolve, reject) => {
            // Check if Leaflet is available
            if (typeof L === 'undefined') {
                // Load Leaflet dynamically
                this.loadLeafletLibrary().then(() => {
                    this.createLeafletMap();
                    resolve();
                }).catch(reject);
            } else {
                this.createLeafletMap();
                resolve();
            }
        });
    }

    loadLeafletLibrary() {
        return new Promise((resolve, reject) => {
            // Load Leaflet CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(cssLink);

            // Load Leaflet JS
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    createLeafletMap() {
        console.log('[QNIS-FIX] Creating Leaflet map');
        
        this.map = L.map(this.mapContainer, {
            center: [39.8283, -98.5795], // Geographic center of USA
            zoom: 4,
            zoomControl: true,
            attributionControl: false
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            minZoom: 3
        }).addTo(this.map);

        this.isLeafletMap = true;
    }

    initializeCanvasMap() {
        console.log('[QNIS-FIX] Creating canvas map');
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.canvas.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
            cursor: crosshair;
        `;
        
        this.mapContainer.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Draw base map
        this.drawBaseMap();
        
        this.isLeafletMap = false;
    }

    drawBaseMap() {
        // Clear canvas
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#334155';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Add title
        this.ctx.fillStyle = '#64748b';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('QNIS Lead Map - USA', 20, 30);
    }

    async loadLeads() {
        try {
            // Fetch leads from API
            const response = await fetch('/api/qnis/leads');
            const data = await response.json();
            this.leadData = data || [];
        } catch (error) {
            console.log('[QNIS-FIX] Using sample lead data');
            this.leadData = this.generateSampleLeads();
        }
    }

    generateSampleLeads() {
        const cities = [
            { name: 'New York', lat: 40.7589, lng: -73.9851 },
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

        return cities.map((city, index) => ({
            id: `lead_${Date.now()}_${index}`,
            coordinates: { lat: city.lat, lng: city.lng, city: city.name },
            type: 'Enterprise',
            industry: 'Technology',
            qnis_score: Math.floor(Math.random() * 40) + 60,
            value_estimate: Math.floor(Math.random() * 50000) + 10000,
            priority: 'HIGH'
        }));
    }

    displayLeads() {
        if (this.isLeafletMap && this.map) {
            this.displayLeafletMarkers();
        } else if (this.canvas && this.ctx) {
            this.displayCanvasMarkers();
        }
    }

    displayLeafletMarkers() {
        console.log('[QNIS-FIX] Adding Leaflet markers');
        
        this.leadData.forEach(lead => {
            const marker = L.marker([lead.coordinates.lat, lead.coordinates.lng])
                .addTo(this.map)
                .bindPopup(`
                    <div style="color: #000;">
                        <strong>${lead.coordinates.city}</strong><br>
                        Type: ${lead.type}<br>
                        QNIS Score: ${lead.qnis_score}<br>
                        Value: $${lead.value_estimate.toLocaleString()}
                    </div>
                `);
        });
    }

    displayCanvasMarkers() {
        console.log('[QNIS-FIX] Adding canvas markers');
        
        this.leadData.forEach(lead => {
            // Convert lat/lng to canvas coordinates
            const x = this.longitudeToX(lead.coordinates.lng);
            const y = this.latitudeToY(lead.coordinates.lat);
            
            // Draw marker
            this.ctx.fillStyle = '#00ff88';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Draw city name
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(lead.coordinates.city, x + 12, y + 4);
        });
    }

    longitudeToX(lng) {
        // Convert longitude (-180 to 180) to canvas X (0 to width)
        return ((lng + 180) / 360) * this.canvas.width;
    }

    latitudeToY(lat) {
        // Convert latitude (-90 to 90) to canvas Y (height to 0)
        return ((90 - lat) / 180) * this.canvas.height;
    }
}

// Initialize the fixed map system
window.qnisMapFix = new QNISMapFix();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (!window.qnisMapFix.isInitialized) {
            window.qnisMapFix.initialize();
        }
    }, 2000);
});

// Export for use by other scripts
window.initializeQNISMap = function() {
    return window.qnisMapFix.initialize();
};