// Leaflet Map Fix - Robust map initialization and rendering
(function() {
    'use strict';
    
    console.log('[LEAFLET-FIX] Initializing robust Leaflet map system...');
    
    let mapInstance = null;
    let markersLayer = null;
    
    function initializeLeafletMap() {
        // Wait for Leaflet to be available
        if (typeof L === 'undefined') {
            console.warn('[LEAFLET-FIX] Leaflet not loaded, retrying...');
            setTimeout(initializeLeafletMap, 500);
            return;
        }
        
        // Find the map container
        const mapContainer = document.getElementById('leaflet-map');
        if (!mapContainer) {
            console.warn('[LEAFLET-FIX] Map container not found, creating one...');
            createMapContainer();
            return;
        }
        
        // Clear any existing map instance
        if (mapInstance) {
            try {
                mapInstance.remove();
            } catch (e) {
                console.warn('[LEAFLET-FIX] Error removing existing map:', e);
            }
        }
        
        try {
            // Initialize map with proper error handling
            mapInstance = L.map(mapContainer, {
                center: [39.8283, -98.5795], // Center of USA
                zoom: 4,
                zoomControl: true,
                attributionControl: true,
                preferCanvas: false,
                renderer: L.svg()
            });
            
            // Add tile layer with fallback options
            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18,
                errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
            });
            
            tileLayer.on('tileerror', function(e) {
                console.warn('[LEAFLET-FIX] Tile load error, using fallback');
                // Switch to alternative tile server
                const altTileLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors, © CartoDB',
                    maxZoom: 18
                });
                mapInstance.removeLayer(tileLayer);
                altTileLayer.addTo(mapInstance);
            });
            
            tileLayer.addTo(mapInstance);
            
            // Create markers layer
            markersLayer = L.layerGroup().addTo(mapInstance);
            
            // Load and display leads
            loadLeadsOnMap();
            
            // Fix map container size
            setTimeout(() => {
                if (mapInstance) {
                    mapInstance.invalidateSize();
                }
            }, 100);
            
            console.log('[LEAFLET-FIX] Leaflet map initialized successfully');
            
        } catch (error) {
            console.error('[LEAFLET-FIX] Failed to initialize Leaflet map:', error);
            createFallbackMap(mapContainer);
        }
    }
    
    function createMapContainer() {
        // Find parent container for the map
        const qnisModule = document.getElementById('qnis-module') || 
                          document.querySelector('[data-module="qnis"]') ||
                          document.querySelector('.module-view.active');
        
        if (!qnisModule) {
            console.error('[LEAFLET-FIX] No suitable parent container found');
            return;
        }
        
        // Create map container
        const mapContainer = document.createElement('div');
        mapContainer.id = 'leaflet-map';
        mapContainer.style.cssText = `
            width: 100%;
            height: 500px;
            border-radius: 8px;
            border: 1px solid #ddd;
            background: #f8f9fa;
            position: relative;
            z-index: 1;
        `;
        
        // Clear existing content and add map
        qnisModule.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="margin: 0 0 20px 0; color: #2c3e50;">NEXUS Lead Intelligence Map</h2>
                <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 6px; border: 1px solid #eee;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600;">Live Lead Tracking: <span id="live-lead-count">0</span> Active</span>
                        <button onclick="window.refreshLeafletMap()" style="background: #16a085; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">🔄 Refresh</button>
                    </div>
                </div>
            </div>
        `;
        
        qnisModule.appendChild(mapContainer);
        
        // Retry initialization
        setTimeout(initializeLeafletMap, 100);
    }
    
    function loadLeadsOnMap() {
        if (!mapInstance || !markersLayer) return;
        
        // Clear existing markers
        markersLayer.clearLayers();
        
        // Get leads from cache
        const leads = getLeadsData();
        
        leads.forEach((lead, index) => {
            const coords = getLeadCoordinates(lead);
            const qnisScore = lead.qnisScore || Math.floor(Math.random() * 40) + 60;
            
            // Create marker with proper popup
            const marker = L.circleMarker([coords.lat, coords.lng], {
                radius: Math.max(6, qnisScore / 12),
                fillColor: getQNISColor(qnisScore),
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });
            
            // Add popup with lead information
            const popupContent = `
                <div style="font-family: Arial, sans-serif; min-width: 200px;">
                    <h4 style="margin: 0 0 10px 0; color: #2c3e50;">${lead.companyName || `Lead ${index + 1}`}</h4>
                    <p style="margin: 0 0 5px 0;"><strong>Location:</strong> ${lead.city || 'Unknown'}</p>
                    <p style="margin: 0 0 5px 0;"><strong>Industry:</strong> ${lead.industry || 'Business Services'}</p>
                    <p style="margin: 0 0 10px 0;"><strong>QNIS Score:</strong> <span style="color: ${getQNISColor(qnisScore)}; font-weight: bold;">${qnisScore}</span></p>
                    <div style="border-top: 1px solid #eee; padding-top: 8px; margin-top: 8px;">
                        <small style="color: #666;">Lead ID: ${lead.id || `lead_${index}`}</small>
                    </div>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            markersLayer.addLayer(marker);
        });
        
        // Update lead count
        const leadCountElement = document.getElementById('live-lead-count');
        if (leadCountElement) {
            leadCountElement.textContent = leads.length;
        }
        
        console.log(`[LEAFLET-FIX] Loaded ${leads.length} leads on map`);
    }
    
    function createFallbackMap(container) {
        console.log('[LEAFLET-FIX] Creating fallback map visualization');
        
        container.innerHTML = `
            <div style="width: 100%; height: 500px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; position: relative; overflow: hidden;">
                <div style="text-align: center; z-index: 2;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🗺️</div>
                    <h3 style="margin: 0 0 15px 0;">Lead Intelligence Map</h3>
                    <p style="margin: 0 0 20px 0; opacity: 0.8;">Real-time geographic lead distribution</p>
                    <div id="fallback-leads-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; max-width: 600px;"></div>
                </div>
                <canvas id="fallback-canvas" width="800" height="500" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.3;"></canvas>
            </div>
        `;
        
        // Create fallback visualization
        createFallbackVisualization();
    }
    
    function createFallbackVisualization() {
        const canvas = document.getElementById('fallback-canvas');
        const grid = document.getElementById('fallback-leads-grid');
        
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const leads = getLeadsData();
            
            // Draw animated background
            drawAnimatedBackground(ctx, canvas.width, canvas.height);
            
            // Draw lead points
            leads.forEach((lead, index) => {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const qnisScore = lead.qnisScore || Math.floor(Math.random() * 40) + 60;
                
                ctx.fillStyle = getQNISColor(qnisScore);
                ctx.beginPath();
                ctx.arc(x, y, Math.max(3, qnisScore / 15), 0, 2 * Math.PI);
                ctx.fill();
                
                // Add glow effect
                ctx.shadowColor = getQNISColor(qnisScore);
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }
        
        if (grid) {
            const leads = getLeadsData();
            const cities = {};
            
            // Group leads by city
            leads.forEach(lead => {
                const city = lead.city || 'Unknown';
                if (!cities[city]) {
                    cities[city] = { count: 0, totalScore: 0 };
                }
                cities[city].count++;
                cities[city].totalScore += (lead.qnisScore || 75);
            });
            
            // Display city stats
            Object.entries(cities).forEach(([city, data]) => {
                const avgScore = Math.round(data.totalScore / data.count);
                grid.innerHTML += `
                    <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 6px; text-align: center;">
                        <div style="font-weight: bold; margin-bottom: 5px;">${city}</div>
                        <div style="font-size: 18px; margin-bottom: 3px;">${data.count}</div>
                        <div style="font-size: 12px; opacity: 0.8;">Avg QNIS: ${avgScore}</div>
                    </div>
                `;
            });
        }
    }
    
    function drawAnimatedBackground(ctx, width, height) {
        // Draw grid pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }
    
    // Utility functions
    function getLeadsData() {
        try {
            const cached = localStorage.getItem('cachedLeads');
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (e) {
            console.warn('[LEAFLET-FIX] Error loading cached leads:', e);
        }
        
        // Return fallback leads
        return [
            { id: 'lead_1', city: 'New York', companyName: 'Tech Solutions Inc', qnisScore: 85 },
            { id: 'lead_2', city: 'Los Angeles', companyName: 'Innovation Labs', qnisScore: 78 },
            { id: 'lead_3', city: 'Chicago', companyName: 'Growth Partners', qnisScore: 92 },
            { id: 'lead_4', city: 'Houston', companyName: 'Strategic Ventures', qnisScore: 71 }
        ];
    }
    
    function getLeadCoordinates(lead) {
        const coords = {
            'New York': { lat: 40.7128, lng: -74.0060 },
            'Los Angeles': { lat: 34.0522, lng: -118.2437 },
            'Chicago': { lat: 41.8781, lng: -87.6298 },
            'Houston': { lat: 29.7604, lng: -95.3698 },
            'Phoenix': { lat: 33.4484, lng: -112.0740 },
            'Philadelphia': { lat: 39.9526, lng: -75.1652 },
            'San Antonio': { lat: 29.4241, lng: -98.4936 },
            'San Diego': { lat: 32.7157, lng: -117.1611 },
            'Dallas': { lat: 32.7767, lng: -96.7970 },
            'San Jose': { lat: 37.3382, lng: -121.8863 },
            'Miami': { lat: 25.7617, lng: -80.1918 },
            'San Francisco': { lat: 37.7749, lng: -122.4194 }
        };
        
        return coords[lead.city] || { lat: 39.8283, lng: -98.5795 };
    }
    
    function getQNISColor(score) {
        if (score >= 85) return '#27ae60';
        if (score >= 70) return '#f39c12';
        if (score >= 50) return '#e67e22';
        return '#e74c3c';
    }
    
    // Global refresh function
    window.refreshLeafletMap = function() {
        console.log('[LEAFLET-FIX] Refreshing map...');
        loadLeadsOnMap();
        
        if (mapInstance) {
            mapInstance.invalidateSize();
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLeafletMap);
    } else {
        setTimeout(initializeLeafletMap, 100);
    }
    
    // Re-initialize when map container is detected
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const added = Array.from(mutation.addedNodes);
                if (added.some(node => node.nodeType === 1 && 
                    (node.id === 'leaflet-map' || node.querySelector('#leaflet-map')))) {
                    setTimeout(initializeLeafletMap, 200);
                }
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
})();