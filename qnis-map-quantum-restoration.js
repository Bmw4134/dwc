/**
 * QNIS Map Quantum Restoration System
 * Dual-layer geographic intelligence with toggleable views
 */

class QNISMapQuantumRestoration {
    constructor() {
        this.mapContainer = null;
        this.currentView = 'nexus'; // 'nexus' or 'geographic'
        this.mapLayers = new Map();
        this.leadMarkers = new Map();
        this.cityCluster = new Map();
        this.qnisOverlays = new Map();
        this.isInitialized = false;
        this.fallbackCanvas = null;
        this.activeLeads = [];
    }

    async initializeDualLayerSystem() {
        console.log('[QNIS-QUANTUM] Initializing dual-layer geographic intelligence system');
        
        this.mapContainer = document.getElementById('qnis-map');
        if (!this.mapContainer) {
            console.error('[QNIS-QUANTUM] Map container not found');
            return false;
        }

        // Create layer toggle controls
        this.createLayerControls();
        
        // Initialize both map systems
        await this.initializeNexusView();
        await this.initializeGeographicView();
        
        // Load authentic lead data
        await this.loadAuthenticLeadData();
        
        // Apply QNIS scoring overlays
        this.applyQNISOverlays();
        
        this.isInitialized = true;
        console.log('[QNIS-QUANTUM] Dual-layer system initialized successfully');
        return true;
    }

    createLayerControls() {
        const controlsHTML = `
            <div class="qnis-map-controls">
                <div class="view-toggle">
                    <button id="nexus-view-btn" class="view-btn active" onclick="window.qnisQuantum.switchToNexusView()">
                        🌌 NEXUS View
                    </button>
                    <button id="geographic-view-btn" class="view-btn" onclick="window.qnisQuantum.switchToGeographicView()">
                        🗺️ Geographic View
                    </button>
                </div>
                <div class="layer-options">
                    <label class="layer-toggle">
                        <input type="checkbox" id="qnis-overlay-toggle" checked onchange="window.qnisQuantum.toggleQNISOverlay()">
                        <span>QNIS Score Overlay</span>
                    </label>
                    <label class="layer-toggle">
                        <input type="checkbox" id="city-cluster-toggle" checked onchange="window.qnisQuantum.toggleCityCluster()">
                        <span>City Clustering</span>
                    </label>
                    <label class="layer-toggle">
                        <input type="checkbox" id="street-layer-toggle" onchange="window.qnisQuantum.toggleStreetLayer()">
                        <span>Street Layer</span>
                    </label>
                </div>
                <div class="map-info">
                    <span id="active-leads-count">0 leads</span>
                    <span id="avg-qnis-score">QNIS: --</span>
                </div>
            </div>
        `;

        this.mapContainer.insertAdjacentHTML('beforebegin', controlsHTML);
    }

    async initializeNexusView() {
        console.log('[QNIS-QUANTUM] Initializing NEXUS quantum view');
        
        const nexusContainer = document.createElement('div');
        nexusContainer.id = 'nexus-quantum-view';
        nexusContainer.className = 'map-layer active';
        nexusContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            overflow: hidden;
        `;

        // Create quantum field visualization
        const quantumField = document.createElement('canvas');
        quantumField.id = 'quantum-field-canvas';
        quantumField.width = 800;
        quantumField.height = 600;
        quantumField.style.cssText = 'width: 100%; height: 100%; position: absolute; top: 0; left: 0;';
        
        nexusContainer.appendChild(quantumField);
        this.mapContainer.appendChild(nexusContainer);
        
        // Initialize quantum field rendering
        this.renderQuantumField(quantumField);
        
        this.mapLayers.set('nexus', nexusContainer);
    }

    async initializeGeographicView() {
        console.log('[QNIS-QUANTUM] Initializing authentic geographic view');
        
        const geoContainer = document.createElement('div');
        geoContainer.id = 'geographic-real-view';
        geoContainer.className = 'map-layer';
        geoContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f0f8ff;
            display: none;
        `;

        // Try Leaflet first, fall back to canvas if needed
        try {
            await this.initializeLeafletMap(geoContainer);
        } catch (error) {
            console.log('[QNIS-QUANTUM] Leaflet failed, using enhanced canvas fallback');
            this.initializeCanvasMap(geoContainer);
        }
        
        this.mapContainer.appendChild(geoContainer);
        this.mapLayers.set('geographic', geoContainer);
    }

    async initializeLeafletMap(container) {
        return new Promise((resolve, reject) => {
            try {
                // Check if Leaflet is available
                if (typeof L === 'undefined') {
                    reject(new Error('Leaflet not available'));
                    return;
                }

                const map = L.map(container, {
                    center: [39.8283, -98.5795], // Geographic center of USA
                    zoom: 4,
                    maxZoom: 18,
                    minZoom: 3
                });

                // Add tile layers with multiple providers
                const baseLayers = {
                    'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }),
                    'CartoDB': L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                        attribution: '© CARTO'
                    }),
                    'Stamen Terrain': L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
                        attribution: '© Stamen Design'
                    })
                };

                baseLayers['OpenStreetMap'].addTo(map);
                L.control.layers(baseLayers).addTo(map);

                // Add custom controls
                this.addLeafletControls(map);
                
                this.mapLayers.set('leaflet', map);
                resolve(map);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    initializeCanvasMap(container) {
        console.log('[QNIS-QUANTUM] Initializing enhanced canvas map fallback');
        
        const canvas = document.createElement('canvas');
        canvas.id = 'geographic-canvas-map';
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.cssText = 'width: 100%; height: 100%; cursor: grab;';
        
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Draw US outline and state boundaries
        this.drawUSGeography(ctx, canvas.width, canvas.height);
        
        // Add interaction handlers
        this.addCanvasInteractions(canvas);
        
        this.fallbackCanvas = canvas;
    }

    drawUSGeography(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
        
        // Draw ocean background
        ctx.fillStyle = '#e6f3ff';
        ctx.fillRect(0, 0, width, height);
        
        // Draw simplified US landmass
        ctx.fillStyle = '#f0f8e8';
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        
        // Simplified US outline (approximate)
        ctx.beginPath();
        ctx.moveTo(150, 400); // West coast start
        ctx.lineTo(120, 350);
        ctx.lineTo(100, 300);
        ctx.lineTo(130, 250);
        ctx.lineTo(180, 200);
        ctx.lineTo(220, 180);
        ctx.lineTo(300, 160);
        ctx.lineTo(400, 150);
        ctx.lineTo(500, 140);
        ctx.lineTo(600, 160);
        ctx.lineTo(680, 200);
        ctx.lineTo(720, 250); // East coast
        ctx.lineTo(700, 300);
        ctx.lineTo(650, 350);
        ctx.lineTo(600, 400);
        ctx.lineTo(550, 450);
        ctx.lineTo(400, 480);
        ctx.lineTo(300, 470);
        ctx.lineTo(200, 450);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Add state grid lines
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 0.5;
        for (let i = 200; i < 700; i += 100) {
            ctx.beginPath();
            ctx.moveTo(i, 150);
            ctx.lineTo(i, 450);
            ctx.stroke();
        }
        for (let i = 180; i < 450; i += 60) {
            ctx.beginPath();
            ctx.moveTo(150, i);
            ctx.lineTo(720, i);
            ctx.stroke();
        }
    }

    addCanvasInteractions(canvas) {
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;
        let offsetX = 0;
        let offsetY = 0;
        let scale = 1;

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            canvas.style.cursor = 'grabbing';
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                offsetX += deltaX;
                offsetY += deltaY;
                
                canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
                
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            scale *= delta;
            scale = Math.max(0.5, Math.min(3, scale));
            
            canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        });
    }

    renderQuantumField(canvas) {
        const ctx = canvas.getContext('2d');
        let animationFrame = 0;
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw quantum field grid
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
            ctx.lineWidth = 1;
            
            const gridSize = 50;
            const time = animationFrame * 0.01;
            
            for (let x = 0; x < canvas.width; x += gridSize) {
                for (let y = 0; y < canvas.height; y += gridSize) {
                    const wave = Math.sin(time + x * 0.01 + y * 0.01) * 10;
                    
                    ctx.beginPath();
                    ctx.moveTo(x, y + wave);
                    ctx.lineTo(x + gridSize, y + wave);
                    ctx.moveTo(x + wave, y);
                    ctx.lineTo(x + wave, y + gridSize);
                    ctx.stroke();
                }
            }
            
            // Draw quantum particles
            this.renderQuantumParticles(ctx, time);
            
            animationFrame++;
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    renderQuantumParticles(ctx, time) {
        this.activeLeads.forEach((lead, index) => {
            const x = (lead.coordinates?.lng || -98.5795 + index * 0.1) * 4 + 400;
            const y = (39.8283 - (lead.coordinates?.lat || 39.8283 - index * 0.1)) * 8 + 100;
            
            // Quantum particle glow
            const radius = 8 + Math.sin(time + index) * 3;
            const opacity = 0.7 + Math.sin(time * 2 + index) * 0.3;
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00ff88';
            ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // QNIS score display
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'white';
            ctx.font = '12px monospace';
            ctx.fillText(lead.qnisScore || '85', x - 10, y - 15);
        });
    }

    async loadAuthenticLeadData() {
        try {
            const response = await fetch('/api/qnis/leads');
            if (response.ok) {
                const data = await response.json();
                this.activeLeads = data.leads || [];
                console.log(`[QNIS-QUANTUM] Loaded ${this.activeLeads.length} authentic leads`);
            } else {
                // Fallback to cached data
                const cacheResponse = await fetch('/cached_leads.json');
                if (cacheResponse.ok) {
                    this.activeLeads = await cacheResponse.json();
                    console.log(`[QNIS-QUANTUM] Loaded ${this.activeLeads.length} cached leads`);
                }
            }
        } catch (error) {
            console.error('[QNIS-QUANTUM] Failed to load authentic lead data:', error);
        }
        
        this.updateMapInfo();
    }

    applyQNISOverlays() {
        this.activeLeads.forEach(lead => {
            this.addLeadMarker(lead);
        });
    }

    addLeadMarker(lead) {
        const coordinates = this.getLeadCoordinates(lead);
        
        if (this.currentView === 'geographic' && this.mapLayers.has('leaflet')) {
            const map = this.mapLayers.get('leaflet');
            const marker = L.circleMarker([coordinates.lat, coordinates.lng], {
                radius: this.getQNISRadius(lead.qnisScore),
                color: this.getQNISColor(lead.qnisScore),
                fillColor: this.getQNISColor(lead.qnisScore),
                fillOpacity: 0.7
            }).addTo(map);
            
            marker.bindPopup(`
                <div class="qnis-popup">
                    <h4>${lead.location || 'Unknown Location'}</h4>
                    <p>QNIS Score: <strong>${lead.qnisScore || 85}</strong></p>
                    <p>Value: <strong>$${lead.estimatedValue || 50000}</strong></p>
                    <button onclick="window.qnisQuantum.viewLeadDetails('${lead.id}')">View Details</button>
                </div>
            `);
            
            this.leadMarkers.set(lead.id, marker);
        }
    }

    getLeadCoordinates(lead) {
        // Use authentic coordinates if available, otherwise approximate by city
        if (lead.coordinates) {
            return lead.coordinates;
        }
        
        // City coordinate mapping
        const cityCoords = {
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
            'Austin': { lat: 30.2672, lng: -97.7431 },
            'Jacksonville': { lat: 30.3322, lng: -81.6557 },
            'Fort Worth': { lat: 32.7555, lng: -97.3308 },
            'Columbus': { lat: 39.9612, lng: -82.9988 },
            'San Francisco': { lat: 37.7749, lng: -122.4194 },
            'Charlotte': { lat: 35.2271, lng: -80.8431 },
            'Indianapolis': { lat: 39.7684, lng: -86.1581 },
            'Seattle': { lat: 47.6062, lng: -122.3321 },
            'Denver': { lat: 39.7392, lng: -104.9903 },
            'Boston': { lat: 42.3601, lng: -71.0589 },
            'El Paso': { lat: 31.7619, lng: -106.4850 },
            'Detroit': { lat: 42.3314, lng: -83.0458 },
            'Nashville': { lat: 36.1627, lng: -86.7816 },
            'Portland': { lat: 45.5152, lng: -122.6784 },
            'Memphis': { lat: 35.1495, lng: -90.0490 },
            'Oklahoma City': { lat: 35.4676, lng: -97.5164 },
            'Las Vegas': { lat: 36.1699, lng: -115.1398 },
            'Louisville': { lat: 38.2527, lng: -85.7585 },
            'Baltimore': { lat: 39.2904, lng: -76.6122 },
            'Milwaukee': { lat: 43.0389, lng: -87.9065 },
            'Albuquerque': { lat: 35.0844, lng: -106.6504 },
            'Tucson': { lat: 32.2226, lng: -110.9747 },
            'Fresno': { lat: 36.7378, lng: -119.7871 },
            'Sacramento': { lat: 38.5816, lng: -121.4944 },
            'Mesa': { lat: 33.4152, lng: -111.8315 },
            'Kansas City': { lat: 39.0997, lng: -94.5786 },
            'Atlanta': { lat: 33.7490, lng: -84.3880 },
            'Long Beach': { lat: 33.7701, lng: -118.1937 },
            'Colorado Springs': { lat: 38.8339, lng: -104.8214 },
            'Raleigh': { lat: 35.7796, lng: -78.6382 },
            'Miami': { lat: 25.7617, lng: -80.1918 },
            'Virginia Beach': { lat: 36.8529, lng: -75.9780 },
            'Omaha': { lat: 41.2565, lng: -95.9345 },
            'Oakland': { lat: 37.8044, lng: -122.2712 },
            'Minneapolis': { lat: 44.9778, lng: -93.2650 },
            'Tulsa': { lat: 36.1540, lng: -95.9928 },
            'Arlington': { lat: 32.7357, lng: -97.1081 },
            'New Orleans': { lat: 29.9511, lng: -90.0715 }
        };
        
        return cityCoords[lead.location] || { lat: 39.8283, lng: -98.5795 };
    }

    getQNISRadius(score) {
        return Math.max(5, Math.min(20, (score || 85) / 5));
    }

    getQNISColor(score) {
        const normalizedScore = (score || 85) / 100;
        if (normalizedScore > 0.8) return '#00ff88';
        if (normalizedScore > 0.6) return '#ffaa00';
        return '#ff4444';
    }

    switchToNexusView() {
        this.currentView = 'nexus';
        this.mapLayers.get('nexus').style.display = 'block';
        this.mapLayers.get('geographic').style.display = 'none';
        
        document.getElementById('nexus-view-btn').classList.add('active');
        document.getElementById('geographic-view-btn').classList.remove('active');
        
        console.log('[QNIS-QUANTUM] Switched to NEXUS view');
    }

    switchToGeographicView() {
        this.currentView = 'geographic';
        this.mapLayers.get('nexus').style.display = 'none';
        this.mapLayers.get('geographic').style.display = 'block';
        
        document.getElementById('nexus-view-btn').classList.remove('active');
        document.getElementById('geographic-view-btn').classList.add('active');
        
        console.log('[QNIS-QUANTUM] Switched to Geographic view');
    }

    toggleQNISOverlay() {
        const toggle = document.getElementById('qnis-overlay-toggle');
        const isEnabled = toggle.checked;
        
        this.leadMarkers.forEach(marker => {
            if (isEnabled) {
                marker.addTo(this.mapLayers.get('leaflet'));
            } else {
                marker.remove();
            }
        });
    }

    toggleCityCluster() {
        const toggle = document.getElementById('city-cluster-toggle');
        console.log(`[QNIS-QUANTUM] City clustering ${toggle.checked ? 'enabled' : 'disabled'}`);
    }

    toggleStreetLayer() {
        const toggle = document.getElementById('street-layer-toggle');
        console.log(`[QNIS-QUANTUM] Street layer ${toggle.checked ? 'enabled' : 'disabled'}`);
    }

    updateMapInfo() {
        const leadsCount = document.getElementById('active-leads-count');
        const avgScore = document.getElementById('avg-qnis-score');
        
        if (leadsCount) {
            leadsCount.textContent = `${this.activeLeads.length} leads`;
        }
        
        if (avgScore && this.activeLeads.length > 0) {
            const avg = this.activeLeads.reduce((sum, lead) => sum + (lead.qnisScore || 85), 0) / this.activeLeads.length;
            avgScore.textContent = `QNIS: ${Math.round(avg)}`;
        }
    }

    viewLeadDetails(leadId) {
        const lead = this.activeLeads.find(l => l.id === leadId);
        if (lead) {
            console.log('[QNIS-QUANTUM] Viewing lead details:', lead);
            // Implement lead details modal or navigation
        }
    }
}

// Initialize global instance
if (typeof window !== 'undefined') {
    window.qnisQuantum = new QNISMapQuantumRestoration();
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('qnis-map')) {
                window.qnisQuantum.initializeDualLayerSystem();
            }
        });
    } else if (document.getElementById('qnis-map')) {
        window.qnisQuantum.initializeDualLayerSystem();
    }
}

export default QNISMapQuantumRestoration;