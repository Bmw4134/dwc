/**
 * Map Visibility Fix - Resolves map container and Leaflet display issues
 */
class MapVisibilityFix {
    constructor() {
        this.mapContainer = null;
        this.leafletMap = null;
        this.leads = [];
    }

    async initializeMapFix() {
        console.log('[MAP-FIX] Starting comprehensive map visibility repair');
        
        // Step 1: Clean up existing broken maps
        this.cleanupBrokenMaps();
        
        // Step 2: Create proper map container
        this.createMapContainer();
        
        // Step 3: Initialize Leaflet with proper error handling
        await this.initializeLeafletMap();
        
        // Step 4: Load and display leads
        await this.loadLeadsData();
        
        // Step 5: Apply CSS fixes
        this.applyMapStyling();
        
        console.log('[MAP-FIX] Map visibility repair complete');
    }

    cleanupBrokenMaps() {
        // Remove any existing broken map instances
        const existingMaps = document.querySelectorAll('#qnis-map, .leaflet-container');
        existingMaps.forEach(map => {
            if (map._leaflet_id) {
                try {
                    map.remove();
                } catch (e) {
                    map.parentNode?.removeChild(map);
                }
            }
        });

        // Clear global map references
        if (window.qnisMap?.map) {
            try {
                window.qnisMap.map.remove();
            } catch (e) {}
        }
        
        console.log('[MAP-FIX] Cleaned up broken map instances');
    }

    createMapContainer() {
        // Find the QNIS module container
        const qnisModule = document.getElementById('qnis-module');
        if (!qnisModule) {
            console.error('[MAP-FIX] QNIS module not found');
            return;
        }

        // Create new map container
        this.mapContainer = document.createElement('div');
        this.mapContainer.id = 'qnis-map';
        this.mapContainer.style.cssText = `
            width: 100%;
            height: 500px;
            min-height: 500px;
            border: 2px solid #00ff88;
            border-radius: 8px;
            background: #0a0e1a;
            position: relative;
            z-index: 1;
            margin: 20px 0;
        `;

        // Insert map container into QNIS module
        const existingMap = qnisModule.querySelector('#qnis-map');
        if (existingMap) {
            existingMap.replaceWith(this.mapContainer);
        } else {
            qnisModule.appendChild(this.mapContainer);
        }

        console.log('[MAP-FIX] Created new map container');
    }

    async initializeLeafletMap() {
        if (!this.mapContainer) {
            console.error('[MAP-FIX] No map container available');
            return;
        }

        try {
            // Wait for Leaflet to be available
            if (typeof L === 'undefined') {
                await this.loadLeaflet();
            }

            // Initialize Leaflet map
            this.leafletMap = L.map(this.mapContainer, {
                center: [39.8283, -98.5795], // Center of USA
                zoom: 4,
                zoomControl: true,
                attributionControl: true
            });

            // Add tile layer with error handling
            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18,
                errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
            });

            tileLayer.addTo(this.leafletMap);

            // Force map to display
            setTimeout(() => {
                this.leafletMap.invalidateSize();
            }, 100);

            // Store global reference
            window.qnisMap = window.qnisMap || {};
            window.qnisMap.map = this.leafletMap;
            window.qnisMap.isInitialized = true;

            console.log('[MAP-FIX] Leaflet map initialized successfully');
            return true;

        } catch (error) {
            console.error('[MAP-FIX] Leaflet initialization failed:', error);
            this.createFallbackCanvas();
            return false;
        }
    }

    async loadLeaflet() {
        return new Promise((resolve, reject) => {
            if (typeof L !== 'undefined') {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async loadLeadsData() {
        try {
            // Fetch leads from server
            const response = await fetch('/api/qnis/leads');
            const data = await response.json();
            this.leads = data.leads || [];
            
            console.log(`[MAP-FIX] Loaded ${this.leads.length} leads`);
            
            // Add markers to map
            if (this.leafletMap && this.leads.length > 0) {
                this.addLeadMarkers();
            }
            
        } catch (error) {
            console.error('[MAP-FIX] Failed to load leads:', error);
            // Use cached leads if available
            this.leads = window.leadMapCache?.leads || [];
            if (this.leafletMap && this.leads.length > 0) {
                this.addLeadMarkers();
            }
        }
    }

    addLeadMarkers() {
        if (!this.leafletMap || !this.leads.length) return;

        const cityCoords = {
            'New York': [40.7128, -74.0060],
            'Los Angeles': [34.0522, -118.2437],
            'Chicago': [41.8781, -87.6298],
            'Houston': [29.7604, -95.3698],
            'Phoenix': [33.4484, -112.0740],
            'Philadelphia': [39.9526, -75.1652],
            'San Antonio': [29.4241, -98.4936],
            'Dallas': [32.7767, -96.7970],
            'San Francisco': [37.7749, -122.4194],
            'Miami': [25.7617, -80.1918]
        };

        this.leads.forEach(lead => {
            const city = lead.city || 'Houston';
            const coords = cityCoords[city] || [29.7604, -95.3698];
            const score = lead.qnisScore || 75;
            
            const color = score > 80 ? '#10b981' : score > 60 ? '#3b82f6' : '#f59e0b';
            
            const marker = L.circleMarker(coords, {
                radius: Math.max(8, score / 6),
                fillColor: color,
                color: '#ffffff',
                weight: 2,
                opacity: 0.9,
                fillOpacity: 0.7
            });

            marker.bindPopup(`
                <div style="font-family: Arial, sans-serif; min-width: 200px;">
                    <h4 style="margin: 0 0 10px 0; color: ${color};">${lead.company || lead.type || 'Business Lead'}</h4>
                    <div><strong>Location:</strong> ${city}</div>
                    <div><strong>QNIS Score:</strong> ${score}</div>
                    <div><strong>Industry:</strong> ${lead.industry || 'Business Services'}</div>
                </div>
            `);

            marker.addTo(this.leafletMap);
        });

        console.log(`[MAP-FIX] Added ${this.leads.length} markers to map`);
    }

    createFallbackCanvas() {
        if (!this.mapContainer) return;

        this.mapContainer.innerHTML = `
            <div style="width: 100%; height: 500px; background: #0a0e1a; border: 2px solid #00ff88; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <div style="color: #00ff88; font-size: 24px; margin-bottom: 20px;">🗺️ QNIS Intelligence Map</div>
                <div style="color: #ffffff; font-size: 16px; margin-bottom: 10px;">${this.leads.length} Business Leads Tracked</div>
                <div style="color: #888; font-size: 14px;">Map tiles loading...</div>
            </div>
        `;
        
        console.log('[MAP-FIX] Created fallback canvas display');
    }

    applyMapStyling() {
        // Add CSS to ensure map visibility
        const style = document.createElement('style');
        style.textContent = `
            #qnis-map {
                width: 100% !important;
                height: 500px !important;
                min-height: 500px !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 1 !important;
            }
            
            .leaflet-container {
                background: #0a0e1a !important;
                border: 2px solid #00ff88 !important;
                border-radius: 8px !important;
            }
            
            .leaflet-control-attribution {
                background: rgba(0, 0, 0, 0.8) !important;
                color: #fff !important;
            }
            
            .leaflet-popup-content-wrapper {
                background: #1a1a2e !important;
                color: #fff !important;
                border: 1px solid #00ff88 !important;
            }
            
            .leaflet-popup-tip {
                background: #1a1a2e !important;
                border: 1px solid #00ff88 !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log('[MAP-FIX] Applied map styling fixes');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const mapFix = new MapVisibilityFix();
        mapFix.initializeMapFix();
    }, 1000);
});

// Export for manual triggering
window.fixMapVisibility = function() {
    const mapFix = new MapVisibilityFix();
    mapFix.initializeMapFix();
};