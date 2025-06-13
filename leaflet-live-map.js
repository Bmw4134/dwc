/**
 * Leaflet Live Map with Real-time Lead Generation
 * Professional mapping solution with layer controls and live data
 */

class LeafletLiveMap {
    constructor() {
        this.map = null;
        this.mapContainer = null;
        this.leadData = [];
        this.markers = [];
        this.layerGroups = {
            highPriority: null,
            mediumPriority: null,
            satellite: null,
            street: null,
            terrain: null
        };
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        console.log('[LEAFLET-LIVE] Initializing professional mapping system');
        
        // Find or create container
        this.findMapContainer();
        
        // Load Leaflet library if needed
        await this.ensureLeafletLoaded();
        
        // Create map with layers
        this.createMap();
        
        // Set up layer controls
        this.setupLayerControls();
        
        // Connect to live lead data
        await this.connectToLiveData();
        
        this.initialized = true;
        console.log('[LEAFLET-LIVE] Professional mapping system ready');
    }

    findMapContainer() {
        // Override any existing map containers
        const existingMaps = document.querySelectorAll('#qnis-map, #working-qnis-map, .quantum-map-container');
        existingMaps.forEach(el => el.remove());

        // Find QNIS module
        const qnisModule = document.getElementById('qnis-module');
        if (qnisModule) {
            this.mapContainer = document.createElement('div');
            this.mapContainer.id = 'leaflet-live-map';
            this.mapContainer.style.cssText = `
                width: 100%;
                height: 600px;
                margin: 20px 0;
                border: 2px solid #00ff88;
                border-radius: 12px;
                overflow: hidden;
                position: relative;
                z-index: 1;
            `;
            
            const moduleContent = qnisModule.querySelector('.module-content') || qnisModule;
            moduleContent.appendChild(this.mapContainer);
        } else {
            // Fallback positioning
            this.mapContainer = document.createElement('div');
            this.mapContainer.id = 'leaflet-live-map';
            this.mapContainer.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                width: 500px;
                height: 400px;
                z-index: 10000;
                border: 2px solid #00ff88;
                border-radius: 12px;
                overflow: hidden;
            `;
            document.body.appendChild(this.mapContainer);
        }
    }

    async ensureLeafletLoaded() {
        if (typeof L !== 'undefined') return;

        console.log('[LEAFLET-LIVE] Loading Leaflet library');
        
        return new Promise((resolve, reject) => {
            // Load CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            cssLink.crossOrigin = '';
            document.head.appendChild(cssLink);

            // Load JS
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = () => {
                console.log('[LEAFLET-LIVE] Leaflet library loaded');
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    createMap() {
        console.log('[LEAFLET-LIVE] Creating interactive map with layers');
        
        // Initialize map centered on USA
        this.map = L.map(this.mapContainer, {
            center: [39.8283, -98.5795],
            zoom: 4,
            zoomControl: true,
            attributionControl: true
        });

        // Create base layers
        this.layerGroups.street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            id: 'street'
        });

        this.layerGroups.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 18,
            id: 'satellite'
        });

        this.layerGroups.terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap contributors',
            maxZoom: 17,
            id: 'terrain'
        });

        // Add default layer
        this.layerGroups.street.addTo(this.map);

        // Create lead marker groups
        this.layerGroups.highPriority = L.layerGroup().addTo(this.map);
        this.layerGroups.mediumPriority = L.layerGroup().addTo(this.map);
    }

    setupLayerControls() {
        const baseLayers = {
            'Street Map': this.layerGroups.street,
            'Satellite': this.layerGroups.satellite,
            'Terrain': this.layerGroups.terrain
        };

        const overlayLayers = {
            'High Priority Leads': this.layerGroups.highPriority,
            'Medium Priority Leads': this.layerGroups.mediumPriority
        };

        L.control.layers(baseLayers, overlayLayers, {
            position: 'topright',
            collapsed: false
        }).addTo(this.map);

        // Add custom control panel
        this.addCustomControls();
    }

    addCustomControls() {
        const customControl = L.control({ position: 'topleft' });
        
        customControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'leaflet-control-custom');
            div.style.cssText = `
                background: rgba(15, 23, 42, 0.9);
                border: 2px solid #00ff88;
                border-radius: 8px;
                padding: 15px;
                color: white;
                font-family: Arial, sans-serif;
                min-width: 200px;
                backdrop-filter: blur(5px);
            `;
            
            div.innerHTML = `
                <div style="color: #00ff88; font-weight: bold; margin-bottom: 10px; font-size: 16px;">
                    QNIS Live Intelligence
                </div>
                <div id="live-stats">
                    <div>Leads: <span id="lead-count">0</span></div>
                    <div>High Priority: <span id="high-priority-count">0</span></div>
                    <div>Pipeline: $<span id="pipeline-value">0</span>K</div>
                    <div style="margin-top: 8px; display: flex; align-items: center;">
                        <div style="width: 6px; height: 6px; background: #00ff88; border-radius: 50%; margin-right: 6px; animation: pulse 2s infinite;"></div>
                        <span style="font-size: 12px;">Live Tracking</span>
                    </div>
                </div>
            `;
            
            return div;
        };
        
        customControl.addTo(this.map);
    }

    async connectToLiveData() {
        console.log('[LEAFLET-LIVE] Connecting to live lead generation API');
        
        // Initial load
        await this.updateLeadData();
        
        // Set up real-time updates matching server generation interval
        setInterval(async () => {
            await this.updateLeadData();
        }, 15000);
    }

    async updateLeadData() {
        try {
            const response = await fetch('/api/qnis/leads');
            if (!response.ok) throw new Error('API unavailable');
            
            const newData = await response.json();
            
            if (newData.length !== this.leadData.length) {
                this.leadData = newData;
                this.updateMapMarkers();
                this.updateStats();
                console.log('[LEAFLET-LIVE] Updated:', this.leadData.length, 'live leads');
            }
        } catch (error) {
            console.warn('[LEAFLET-LIVE] API connection failed, maintaining current data');
        }
    }

    updateMapMarkers() {
        // Clear existing markers
        this.layerGroups.highPriority.clearLayers();
        this.layerGroups.mediumPriority.clearLayers();
        this.markers = [];

        this.leadData.forEach(lead => {
            if (!lead.coordinates || !lead.coordinates.lat || !lead.coordinates.lng) return;

            const isHighPriority = lead.priority === 'HIGH';
            const markerColor = isHighPriority ? '#ff4444' : '#00ff88';
            const iconSize = isHighPriority ? 15 : 12;

            // Create custom icon
            const customIcon = L.divIcon({
                className: 'custom-lead-marker',
                html: `
                    <div style="
                        width: ${iconSize}px;
                        height: ${iconSize}px;
                        background: ${markerColor};
                        border: 2px solid white;
                        border-radius: 50%;
                        box-shadow: 0 0 10px ${markerColor};
                    "></div>
                `,
                iconSize: [iconSize, iconSize],
                iconAnchor: [iconSize/2, iconSize/2]
            });

            const marker = L.marker([lead.coordinates.lat, lead.coordinates.lng], {
                icon: customIcon
            }).bindPopup(`
                <div style="color: #000; font-family: Arial;">
                    <strong style="color: ${markerColor};">${lead.coordinates.city}</strong><br>
                    <strong>QNIS Score:</strong> ${lead.qnis_score}%<br>
                    <strong>Value:</strong> $${lead.value_estimate?.toLocaleString()}<br>
                    <strong>Priority:</strong> ${lead.priority}<br>
                    <strong>Type:</strong> ${lead.type}<br>
                    <strong>Industry:</strong> ${lead.industry}
                </div>
            `);

            // Add to appropriate layer group
            if (isHighPriority) {
                this.layerGroups.highPriority.addLayer(marker);
            } else {
                this.layerGroups.mediumPriority.addLayer(marker);
            }

            this.markers.push(marker);
        });
    }

    updateStats() {
        const leadCount = this.leadData.length;
        const highPriorityCount = this.leadData.filter(lead => lead.priority === 'HIGH').length;
        const totalValue = this.leadData.reduce((sum, lead) => sum + (lead.value_estimate || 0), 0);

        const leadCountEl = document.getElementById('lead-count');
        const highPriorityEl = document.getElementById('high-priority-count');
        const pipelineValueEl = document.getElementById('pipeline-value');

        if (leadCountEl) leadCountEl.textContent = leadCount;
        if (highPriorityEl) highPriorityEl.textContent = highPriorityCount;
        if (pipelineValueEl) pipelineValueEl.textContent = Math.round(totalValue / 1000);
    }
}

// Initialize the live map system
window.leafletLiveMap = new LeafletLiveMap();

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.leafletLiveMap.initialize();
    }, 2000);
});

// Add pulse animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Export for manual initialization
window.initializeLeafletLiveMap = () => window.leafletLiveMap.initialize();