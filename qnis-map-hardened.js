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
        if (!lead.coordinates || !Array.isArray(lead.coordinates) || lead.coordinates.length !== 2) {
            console.warn(`[QNIS-MAP] Invalid coordinates for lead ${lead.id}`);
            return null;
        }

        const [lat, lng] = lead.coordinates;
        
        // Validate coordinates
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.warn(`[QNIS-MAP] Invalid coordinate values for lead ${lead.id}: [${lat}, ${lng}]`);
            return null;
        }

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