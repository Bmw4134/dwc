/**
 * QNIS Map System - Hardened with DOM Safety Guards
 * Rebuilt map loader with proper DOM hydration timing
 */

class QNISMapHardened {
    constructor() {
        this.map = null;
        this.markers = [];
        this.isInitialized = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.loadAttempted = false;
        
        // Wait for both DOM and Leaflet to be ready
        this.initializeWhenReady();
    }

    initializeWhenReady() {
        // Check if DOMGuard is available
        if (typeof window.DOMGuard === 'undefined') {
            console.warn('[QNIS-MAP] DOMGuard not available, using fallback timing');
            this.fallbackInitialization();
            return;
        }

        // Use DOMGuard for safe initialization
        window.DOMGuard.whenReady(() => {
            this.waitForLeafletAndInitialize();
        }, 'qnis-map-init');
    }

    fallbackInitialization() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.waitForLeafletAndInitialize(), 100);
            });
        } else {
            setTimeout(() => this.waitForLeafletAndInitialize(), 100);
        }
    }

    waitForLeafletAndInitialize() {
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`[QNIS-MAP] Waiting for Leaflet... attempt ${this.retryCount}`);
                setTimeout(() => this.waitForLeafletAndInitialize(), 500);
                return;
            } else {
                console.error('[QNIS-MAP] Leaflet failed to load after maximum retries');
                return;
            }
        }

        // Check if map container exists
        const mapContainer = this.safeGetElement('#qnis-map');
        if (!mapContainer) {
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`[QNIS-MAP] Waiting for map container... attempt ${this.retryCount}`);
                setTimeout(() => this.waitForLeafletAndInitialize(), 500);
                return;
            } else {
                console.error('[QNIS-MAP] Map container not found after maximum retries');
                return;
            }
        }

        // Initialize the map
        this.initializeMap();
    }

    safeGetElement(selector) {
        if (typeof window.DOMGuard !== 'undefined') {
            return window.DOMGuard.safeQuerySelector(selector);
        }
        
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`[QNIS-MAP] Failed to query selector: ${selector}`, error);
            return null;
        }
    }

    safeSetText(element, text) {
        if (typeof window.DOMGuard !== 'undefined') {
            return window.DOMGuard.safeSetText(element, text);
        }
        
        if (!element) return false;
        try {
            element.textContent = text;
            return true;
        } catch (error) {
            console.warn('[QNIS-MAP] Failed to set text:', error);
            return false;
        }
    }

    safeSetHTML(element, html) {
        if (typeof window.DOMGuard !== 'undefined') {
            return window.DOMGuard.safeSetHTML(element, html);
        }
        
        if (!element) return false;
        try {
            element.innerHTML = html;
            return true;
        } catch (error) {
            console.warn('[QNIS-MAP] Failed to set HTML:', error);
            return false;
        }
    }

    initializeMap() {
        if (this.isInitialized) {
            console.log('[QNIS-MAP] Map already initialized');
            return;
        }

        const mapContainer = this.safeGetElement('#qnis-map');
        if (!mapContainer) {
            console.error('[QNIS-MAP] Map container not found during initialization');
            return;
        }

        try {
            // Create the map with error handling
            this.map = L.map('qnis-map', {
                center: [39.8283, -98.5795], // Geographic center of US
                zoom: 4,
                zoomControl: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                dragging: true
            });

            // Add tile layer with error handling
            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18,
                errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjEyOCIgeT0iMTI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiPk1hcCBUaWxlIEVycm9yPC90ZXh0Pjwvc3ZnPg=='
            });

            tileLayer.addTo(this.map);

            // Force map size recalculation after 500ms
            setTimeout(() => {
                if (this.map) {
                    try {
                        this.map.invalidateSize();
                        console.log('[QNIS-MAP] Map size invalidated for proper rendering');
                    } catch (error) {
                        console.warn('[QNIS-MAP] Failed to invalidate map size:', error);
                    }
                }
            }, 500);

            // Additional size check after 1 second
            setTimeout(() => {
                if (this.map) {
                    try {
                        this.map.invalidateSize();
                        console.log('[QNIS-MAP] Secondary map size invalidation');
                    } catch (error) {
                        console.warn('[QNIS-MAP] Failed secondary size invalidation:', error);
                    }
                }
            }, 1000);

            this.isInitialized = true;
            console.log('[QNIS-MAP] Map successfully initialized');

            // Load leads data
            this.loadLeadsData();

        } catch (error) {
            console.error('[QNIS-MAP] Failed to initialize map:', error);
            this.handleMapInitializationError(error);
        }
    }

    handleMapInitializationError(error) {
        const mapContainer = this.safeGetElement('#qnis-map');
        if (mapContainer) {
            this.safeSetHTML(mapContainer, `
                <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                    <div class="text-center p-6">
                        <div class="text-red-500 mb-2">⚠️</div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2">Map Initialization Failed</h3>
                        <p class="text-sm text-gray-500 mb-4">Unable to load the interactive map</p>
                        <button onclick="window.qnisMap?.reinitialize()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Retry
                        </button>
                    </div>
                </div>
            `);
        }
    }

    async loadLeadsData() {
        if (!this.map) {
            console.warn('[QNIS-MAP] Cannot load leads - map not initialized');
            return;
        }

        try {
            const response = await fetch('/api/leads');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const leads = await response.json();
            console.log(`[QNIS-MAP] Loaded ${leads.length} leads`);

            this.addLeadsToMap(leads);
            this.updateMapStats(leads);

        } catch (error) {
            console.error('[QNIS-MAP] Failed to load leads data:', error);
            this.handleLeadsLoadError(error);
        }
    }

    addLeadsToMap(leads) {
        if (!this.map || !Array.isArray(leads)) {
            console.warn('[QNIS-MAP] Cannot add leads - invalid state');
            return;
        }

        // Clear existing markers
        this.clearMarkers();

        leads.forEach((lead, index) => {
            try {
                const marker = this.createLeadMarker(lead, index);
                if (marker) {
                    this.markers.push(marker);
                }
            } catch (error) {
                console.warn(`[QNIS-MAP] Failed to create marker for lead ${lead.id}:`, error);
            }
        });

        console.log(`[QNIS-MAP] Added ${this.markers.length} markers to map`);
    }

    createLeadMarker(lead, index) {
        // Generate valid coordinates if missing or invalid
        let coordinates = lead.coordinates;
        
        if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
            coordinates = this.generateValidCoordinates(lead);
        }

        const [lat, lng] = coordinates;
        
        // Validate and fix coordinates
        let validLat = parseFloat(lat);
        let validLng = parseFloat(lng);
        
        if (isNaN(validLat) || validLat < -90 || validLat > 90) {
            validLat = this.getLatForCity(lead.city) || (Math.random() * 60 + 25); // US range
        }
        
        if (isNaN(validLng) || validLng < -180 || validLng > 180) {
            validLng = this.getLngForCity(lead.city) || (Math.random() * 60 - 125); // US range
        }

        try {
            // Create marker with validated coordinates
            const marker = L.marker([validLat, validLng], { icon: this.createCustomIcon() });

            // Create popup content
            const popupContent = this.createPopupContent(lead, index);
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });

            // Add to map
            marker.addTo(this.map);

            return marker;

        } catch (error) {
            console.error(`[QNIS-MAP] Failed to create marker for lead ${lead.id}:`, error);
            return null;
        }
    }

    generateValidCoordinates(lead) {
        // Generate coordinates based on city or use random US coordinates
        const lat = this.getLatForCity(lead.city) || (Math.random() * 30 + 30); // 30-60 latitude range
        const lng = this.getLngForCity(lead.city) || (Math.random() * 60 - 125); // -125 to -65 longitude range
        return [lat, lng];
    }

    getLatForCity(city) {
        const cityCoords = {
            'New York': 40.7128,
            'Los Angeles': 34.0522,
            'Chicago': 41.8781,
            'Houston': 29.7604,
            'Phoenix': 33.4484,
            'Philadelphia': 39.9526,
            'San Antonio': 29.4241,
            'San Diego': 32.7157,
            'Dallas': 32.7767,
            'San Jose': 37.3382,
            'Austin': 30.2672,
            'Jacksonville': 30.3322,
            'Fort Worth': 32.7555,
            'Columbus': 39.9612,
            'Charlotte': 35.2271,
            'San Francisco': 37.7749,
            'Indianapolis': 39.7684,
            'Seattle': 47.6062,
            'Denver': 39.7392,
            'Washington': 38.9072,
            'Boston': 42.3601,
            'El Paso': 31.7619,
            'Nashville': 36.1627,
            'Detroit': 42.3314,
            'Oklahoma City': 35.4676,
            'Portland': 45.5152,
            'Las Vegas': 36.1699,
            'Memphis': 35.1495,
            'Louisville': 38.2527,
            'Baltimore': 39.2904,
            'Milwaukee': 43.0389,
            'Albuquerque': 35.0844,
            'Tucson': 32.2226,
            'Fresno': 36.7378,
            'Sacramento': 38.5816,
            'Mesa': 33.4152,
            'Kansas City': 39.0997,
            'Atlanta': 33.7490,
            'Miami': 25.7617,
            'Raleigh': 35.7796,
            'Omaha': 41.2565,
            'Colorado Springs': 38.8339,
            'Virginia Beach': 36.8529
        };
        return cityCoords[city] || null;
    }

    getLngForCity(city) {
        const cityCoords = {
            'New York': -74.0060,
            'Los Angeles': -118.2437,
            'Chicago': -87.6298,
            'Houston': -95.3698,
            'Phoenix': -112.0740,
            'Philadelphia': -75.1652,
            'San Antonio': -98.4936,
            'San Diego': -117.1611,
            'Dallas': -96.7970,
            'San Jose': -121.8863,
            'Austin': -97.7431,
            'Jacksonville': -81.6557,
            'Fort Worth': -97.3308,
            'Columbus': -82.9988,
            'Charlotte': -80.8431,
            'San Francisco': -122.4194,
            'Indianapolis': -86.1581,
            'Seattle': -122.3321,
            'Denver': -104.9903,
            'Washington': -77.0369,
            'Boston': -71.0589,
            'El Paso': -106.4850,
            'Nashville': -86.7816,
            'Detroit': -83.0458,
            'Oklahoma City': -97.5164,
            'Portland': -122.6784,
            'Las Vegas': -115.1398,
            'Memphis': -90.0490,
            'Louisville': -85.7585,
            'Baltimore': -76.6122,
            'Milwaukee': -87.9065,
            'Albuquerque': -106.6504,
            'Tucson': -110.9747,
            'Fresno': -119.7871,
            'Sacramento': -121.4944,
            'Mesa': -111.8315,
            'Kansas City': -94.5786,
            'Atlanta': -84.3880,
            'Miami': -80.1918,
            'Raleigh': -78.6382,
            'Omaha': -95.9345,
            'Colorado Springs': -104.8214,
            'Virginia Beach': -75.9780
        };
        return cityCoords[city] || null;
    }

    createCustomIcon() {
        try {
            // Create custom icon
            const customIcon = L.divIcon({
                className: 'custom-lead-marker',
                html: `
                    <div class="lead-marker-container">
                        <div class="lead-marker-pin"></div>
                        <div class="lead-marker-pulse"></div>
                    </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

            // Create marker
            const marker = L.marker([lat, lng], { icon: customIcon });

            // Create popup content
            const popupContent = this.createPopupContent(lead, index);
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });

            // Add to map
            marker.addTo(this.map);

            return marker;

        } catch (error) {
            console.error(`[QNIS-MAP] Failed to create marker for lead ${lead.id}:`, error);
            return null;
        }
    }

    createPopupContent(lead, index) {
        return `
            <div class="lead-popup">
                <div class="lead-popup-header">
                    <h4 class="lead-popup-title">${this.escapeHTML(lead.company || 'Unknown Company')}</h4>
                    <span class="lead-popup-badge">Lead #${index + 1}</span>
                </div>
                <div class="lead-popup-content">
                    <div class="lead-popup-item">
                        <strong>Location:</strong> ${this.escapeHTML(lead.city || 'Unknown')}, ${this.escapeHTML(lead.state || 'Unknown')}
                    </div>
                    <div class="lead-popup-item">
                        <strong>Industry:</strong> ${this.escapeHTML(lead.industry || 'Unknown')}
                    </div>
                    <div class="lead-popup-item">
                        <strong>Value:</strong> $${this.formatNumber(lead.value || 0)}
                    </div>
                    <div class="lead-popup-item">
                        <strong>Status:</strong> 
                        <span class="lead-status ${(lead.status || '').toLowerCase().replace(' ', '-')}">${this.escapeHTML(lead.status || 'Unknown')}</span>
                    </div>
                </div>
                <div class="lead-popup-actions">
                    <button onclick="window.viewLead?.('${lead.id}')" class="btn-primary">View Details</button>
                    <button onclick="window.contactLead?.('${lead.id}')" class="btn-secondary">Contact</button>
                </div>
            </div>
        `;
    }

    escapeHTML(str) {
        if (typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    formatNumber(num) {
        return new Intl.NumberFormat('en-US').format(num);
    }

    clearMarkers() {
        if (this.markers && this.markers.length > 0) {
            this.markers.forEach(marker => {
                try {
                    if (this.map && marker) {
                        this.map.removeLayer(marker);
                    }
                } catch (error) {
                    console.warn('[QNIS-MAP] Failed to remove marker:', error);
                }
            });
            this.markers = [];
        }
    }

    updateMapStats(leads) {
        const statsContainer = this.safeGetElement('#map-stats');
        if (!statsContainer || !Array.isArray(leads)) return;

        const totalLeads = leads.length;
        const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
        const avgValue = totalLeads > 0 ? totalValue / totalLeads : 0;

        const statusCounts = leads.reduce((counts, lead) => {
            const status = lead.status || 'Unknown';
            counts[status] = (counts[status] || 0) + 1;
            return counts;
        }, {});

        const statsHTML = `
            <div class="map-stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${totalLeads}</div>
                    <div class="stat-label">Total Leads</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">$${this.formatNumber(totalValue)}</div>
                    <div class="stat-label">Total Value</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">$${this.formatNumber(Math.round(avgValue))}</div>
                    <div class="stat-label">Avg Value</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${statusCounts['Hot'] || 0}</div>
                    <div class="stat-label">Hot Leads</div>
                </div>
            </div>
        `;

        this.safeSetHTML(statsContainer, statsHTML);
    }

    handleLeadsLoadError(error) {
        const statsContainer = this.safeGetElement('#map-stats');
        if (statsContainer) {
            this.safeSetHTML(statsContainer, `
                <div class="error-state">
                    <div class="text-red-500 text-sm">
                        Failed to load leads data: ${error.message}
                    </div>
                    <button onclick="window.qnisMap?.loadLeadsData()" class="btn-retry">Retry</button>
                </div>
            `);
        }
    }

    reinitialize() {
        console.log('[QNIS-MAP] Reinitializing map system...');
        this.cleanup();
        this.retryCount = 0;
        this.isInitialized = false;
        this.initializeWhenReady();
    }

    cleanup() {
        if (this.map) {
            try {
                this.clearMarkers();
                this.map.remove();
                this.map = null;
            } catch (error) {
                console.warn('[QNIS-MAP] Error during cleanup:', error);
            }
        }
        this.isInitialized = false;
    }

    // Public API methods
    refreshData() {
        if (this.isInitialized) {
            this.loadLeadsData();
        }
    }

    getMap() {
        return this.map;
    }

    getMarkers() {
        return this.markers;
    }

    isReady() {
        return this.isInitialized && this.map !== null;
    }
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    const initializeQNISMap = () => {
        if (!window.qnisMap) {
            window.qnisMap = new QNISMapHardened();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeQNISMap);
    } else {
        // DOM is already ready
        setTimeout(initializeQNISMap, 100);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QNISMapHardened;
}