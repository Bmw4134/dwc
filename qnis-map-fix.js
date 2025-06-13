/**
 * QNIS Map Fix - Resolves map rendering and display issues
 */

class QNISMapFix {
  constructor() {
    this.mapContainer = null;
    this.leafletMap = null;
    this.markers = [];
    this.initializeMapFix();
  }

  initializeMapFix() {
    console.log('[QNIS-MAP-FIX] Fixing map rendering issues...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.applyMapFix());
    } else {
      this.applyMapFix();
    }
  }

  applyMapFix() {
    // Find and fix existing map container
    this.findAndFixMapContainer();
    
    // Initialize proper map display
    this.initializeProperMap();
    
    // Load and display leads
    this.loadAndDisplayLeads();
    
    // Set up responsive behavior
    this.setupResponsiveMap();
  }

  findAndFixMapContainer() {
    // Find existing map containers
    const containers = [
      document.getElementById('qnis-map'),
      document.getElementById('leaflet-map'),
      document.querySelector('.leaflet-container'),
      document.querySelector('[id*="map"]')
    ];

    this.mapContainer = containers.find(container => container !== null);

    if (!this.mapContainer) {
      this.createMapContainer();
    } else {
      this.fixExistingContainer();
    }
  }

  createMapContainer() {
    // Create new map container in main content area
    const mainContent = document.getElementById('main-content') || 
                       document.querySelector('.main-content');

    if (!mainContent) {
      console.error('[QNIS-MAP-FIX] No main content area found');
      return;
    }

    // Clear existing content and add map
    mainContent.innerHTML = this.generateMapHTML();
    this.mapContainer = document.getElementById('qnis-map-container');
  }

  fixExistingContainer() {
    if (!this.mapContainer) return;

    // Reset container styles
    this.mapContainer.style.position = 'relative';
    this.mapContainer.style.width = '100%';
    this.mapContainer.style.height = '500px';
    this.mapContainer.style.zIndex = '1';
    this.mapContainer.style.backgroundColor = '#f8f9fa';
    this.mapContainer.style.border = '1px solid #dee2e6';
    this.mapContainer.style.borderRadius = '8px';
    this.mapContainer.style.overflow = 'hidden';

    // Clear any conflicting content
    this.mapContainer.innerHTML = '';
  }

  generateMapHTML() {
    const leadCount = this.getLeadCount();
    const activeZones = this.getActiveZones();

    return `
      <div style="padding: 20px;">
        <div class="map-header" style="margin-bottom: 20px;">
          <h1 style="color: #2c3e50; margin: 0 0 10px 0; display: flex; align-items: center; font-size: 28px;">
            <span style="margin-right: 15px;">🗺️</span>
            QNIS Intelligence Map
          </h1>
          <p style="color: #7f8c8d; margin: 0; font-size: 16px;">Real-time lead intelligence across geographic zones</p>
        </div>

        <div class="map-stats-bar" style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #16a085;">${leadCount}</div>
                <div style="font-size: 12px; color: #7f8c8d;">Active Leads</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #3498db;">${activeZones}</div>
                <div style="font-size: 12px; color: #7f8c8d;">Geographic Zones</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #e74c3c;">${this.getAverageQNIS()}</div>
                <div style="font-size: 12px; color: #7f8c8d;">Avg QNIS Score</div>
              </div>
            </div>
            <div style="display: flex; gap: 10px;">
              <button onclick="QNISMapFixer.refreshMap()" style="background: #16a085; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                🔄 Refresh
              </button>
              <button onclick="QNISMapFixer.toggleView()" style="background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                🗺️ Toggle View
              </button>
            </div>
          </div>
        </div>

        <div id="qnis-map-container" style="background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; position: relative; height: 500px;">
          <div id="qnis-map" style="width: 100%; height: 100%; position: relative; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);">
            <!-- Map will be initialized here -->
          </div>
        </div>

        <div class="map-legend" style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #2c3e50; margin: 0 0 15px 0;">Lead Distribution by Zone</h3>
          <div id="zone-breakdown" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            ${this.generateZoneBreakdown()}
          </div>
        </div>
      </div>
    `;
  }

  initializeProperMap() {
    const mapElement = document.getElementById('qnis-map');
    if (!mapElement) return;

    // Check if Leaflet is available
    if (typeof L !== 'undefined') {
      this.initializeLeafletMap(mapElement);
    } else {
      this.initializeCanvasMap(mapElement);
    }
  }

  initializeLeafletMap(container) {
    try {
      // Clear any existing map
      container.innerHTML = '';

      // Create Leaflet map
      this.leafletMap = L.map(container, {
        center: [39.8283, -98.5795], // Center of USA
        zoom: 4,
        zoomControl: true,
        attributionControl: true
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.leafletMap);

      console.log('[QNIS-MAP-FIX] Leaflet map initialized successfully');
      
      // Add markers after map is ready
      setTimeout(() => this.addLeadMarkers(), 1000);

    } catch (error) {
      console.error('[QNIS-MAP-FIX] Leaflet initialization failed:', error);
      this.initializeCanvasMap(container);
    }
  }

  initializeCanvasMap(container) {
    // Fallback canvas-based map
    container.innerHTML = `
      <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white;">
        <div style="text-align: center; z-index: 2;">
          <div style="font-size: 48px; margin-bottom: 20px;">🗺️</div>
          <h3 style="margin: 0 0 15px 0;">QNIS Intelligence Map</h3>
          <p style="margin: 0 0 25px 0; opacity: 0.8;">Real-time lead tracking across ${this.getActiveZones()} zones</p>
          <div style="display: flex; justify-content: center; gap: 25px; flex-wrap: wrap;">
            ${this.generateInteractiveZones()}
          </div>
        </div>
        <canvas id="qnis-canvas" width="800" height="400" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.3;"></canvas>
      </div>
    `;

    // Initialize canvas visualization
    this.initializeCanvas();
  }

  initializeCanvas() {
    const canvas = document.getElementById('qnis-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const leads = this.getLeadsData();

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw background grid
    this.drawGrid(ctx, canvas.width, canvas.height);

    // Draw lead points
    this.drawLeadPoints(ctx, leads, canvas.width, canvas.height);
  }

  drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  drawLeadPoints(ctx, leads, width, height) {
    leads.forEach((lead, index) => {
      // Calculate position based on lead data
      const x = (Math.random() * 0.8 + 0.1) * width;
      const y = (Math.random() * 0.8 + 0.1) * height;
      const qnisScore = lead.qnisScore || 75;
      
      // Color based on QNIS score
      const color = this.getQNISColor(qnisScore);
      const radius = Math.max(5, qnisScore / 10);

      // Draw lead point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Add glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  addLeadMarkers() {
    if (!this.leafletMap) return;

    const leads = this.getLeadsData();
    
    // Clear existing markers
    this.markers.forEach(marker => this.leafletMap.removeLayer(marker));
    this.markers = [];

    leads.forEach(lead => {
      const coords = this.getLeadCoordinates(lead);
      const qnisScore = lead.qnisScore || 75;
      
      // Create custom marker
      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius: Math.max(8, qnisScore / 10),
        fillColor: this.getQNISColor(qnisScore),
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      });

      // Add popup
      marker.bindPopup(`
        <div style="font-family: Arial, sans-serif;">
          <h4 style="margin: 0 0 10px 0; color: #2c3e50;">${lead.companyName || 'Unknown Company'}</h4>
          <p style="margin: 0 0 5px 0;"><strong>Location:</strong> ${lead.city}, ${lead.state}</p>
          <p style="margin: 0 0 5px 0;"><strong>Industry:</strong> ${lead.industry || 'General Business'}</p>
          <p style="margin: 0 0 10px 0;"><strong>QNIS Score:</strong> <span style="color: ${this.getQNISColor(qnisScore)}; font-weight: bold;">${qnisScore}</span></p>
          <button onclick="QNISMapFixer.viewLead('${lead.id}')" style="background: #16a085; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">View Details</button>
        </div>
      `);

      marker.addTo(this.leafletMap);
      this.markers.push(marker);
    });

    console.log(`[QNIS-MAP-FIX] Added ${this.markers.length} markers to map`);
  }

  generateInteractiveZones() {
    const zones = this.getZonesData();
    
    return zones.map(zone => `
      <div onclick="QNISMapFixer.focusZone('${zone.name}')" style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; cursor: pointer; transition: all 0.3s; min-width: 120px;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">${zone.count}</div>
        <div style="font-size: 14px; opacity: 0.9;">${zone.name}</div>
        <div style="font-size: 12px; opacity: 0.7; margin-top: 5px;">Avg QNIS: ${zone.avgQNIS}</div>
      </div>
    `).join('');
  }

  generateZoneBreakdown() {
    const zones = this.getZonesData();
    
    return zones.map(zone => `
      <div style="padding: 15px; background: #f8f9fa; border-radius: 6px; text-align: center;">
        <div style="font-size: 20px; font-weight: bold; color: #2c3e50; margin-bottom: 8px;">${zone.count}</div>
        <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 5px;">${zone.name}</div>
        <div style="font-size: 12px; color: ${this.getQNISColor(zone.avgQNIS)}; font-weight: 600;">QNIS: ${zone.avgQNIS}</div>
      </div>
    `).join('');
  }

  loadAndDisplayLeads() {
    // Update lead count and zone information
    this.updateMapStats();
    
    // Refresh zone breakdown
    this.updateZoneBreakdown();
  }

  updateMapStats() {
    const leadCount = this.getLeadCount();
    const leadElements = document.querySelectorAll('[data-stat="leads"]');
    leadElements.forEach(el => el.textContent = leadCount);
  }

  updateZoneBreakdown() {
    const breakdown = document.getElementById('zone-breakdown');
    if (breakdown) {
      breakdown.innerHTML = this.generateZoneBreakdown();
    }
  }

  setupResponsiveMap() {
    window.addEventListener('resize', () => {
      if (this.leafletMap) {
        setTimeout(() => {
          this.leafletMap.invalidateSize();
        }, 200);
      }
      
      // Update canvas if using canvas fallback
      const canvas = document.getElementById('qnis-canvas');
      if (canvas) {
        this.initializeCanvas();
      }
    });
  }

  // Data methods
  getLeadCount() {
    try {
      const cached = localStorage.getItem('cachedLeads');
      const emergency = localStorage.getItem('emergencyLeads');
      let count = 0;
      
      if (cached) count += JSON.parse(cached).length;
      if (emergency) count += JSON.parse(emergency).length;
      
      return count || 0;
    } catch {
      return 0;
    }
  }

  getActiveZones() {
    return 8; // Number of active geographic zones
  }

  getAverageQNIS() {
    try {
      const leads = this.getLeadsData();
      if (leads.length === 0) return 75;
      
      const total = leads.reduce((sum, lead) => sum + (lead.qnisScore || 75), 0);
      return Math.round(total / leads.length);
    } catch {
      return 75;
    }
  }

  getLeadsData() {
    try {
      const cached = localStorage.getItem('cachedLeads');
      const emergency = localStorage.getItem('emergencyLeads');
      let leads = [];
      
      if (cached) leads = leads.concat(JSON.parse(cached));
      if (emergency) leads = leads.concat(JSON.parse(emergency));
      
      return leads;
    } catch {
      return [];
    }
  }

  getZonesData() {
    const leads = this.getLeadsData();
    const zones = {};
    
    leads.forEach(lead => {
      const zoneName = this.getZoneName(lead.city);
      if (!zones[zoneName]) {
        zones[zoneName] = { name: zoneName, count: 0, totalQNIS: 0 };
      }
      zones[zoneName].count++;
      zones[zoneName].totalQNIS += (lead.qnisScore || 75);
    });
    
    return Object.values(zones).map(zone => ({
      name: zone.name,
      count: zone.count,
      avgQNIS: Math.round(zone.totalQNIS / zone.count)
    }));
  }

  getZoneName(city) {
    const zoneMap = {
      'New York': 'Northeast',
      'Los Angeles': 'West Coast',
      'Chicago': 'Midwest',
      'Houston': 'South',
      'Phoenix': 'Southwest',
      'Philadelphia': 'Northeast',
      'San Antonio': 'South',
      'San Diego': 'West Coast',
      'Dallas': 'South',
      'San Jose': 'West Coast'
    };
    
    return zoneMap[city] || 'Other';
  }

  getLeadCoordinates(lead) {
    const coordMap = {
      'New York': { lat: 40.7128, lng: -74.0060 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'Chicago': { lat: 41.8781, lng: -87.6298 },
      'Houston': { lat: 29.7604, lng: -95.3698 },
      'Phoenix': { lat: 33.4484, lng: -112.0740 },
      'Philadelphia': { lat: 39.9526, lng: -75.1652 },
      'San Antonio': { lat: 29.4241, lng: -98.4936 },
      'San Diego': { lat: 32.7157, lng: -117.1611 },
      'Dallas': { lat: 32.7767, lng: -96.7970 },
      'San Jose': { lat: 37.3382, lng: -121.8863 }
    };
    
    return coordMap[lead.city] || { lat: 39.8283, lng: -98.5795 };
  }

  getQNISColor(score) {
    if (score >= 85) return '#27ae60';
    if (score >= 70) return '#f39c12';
    if (score >= 50) return '#e67e22';
    return '#e74c3c';
  }

  // Public methods
  static refreshMap() {
    const fixer = window.QNISMapFixer;
    if (fixer) {
      fixer.loadAndDisplayLeads();
      if (fixer.leafletMap) {
        fixer.addLeadMarkers();
      }
      console.log('[QNIS-MAP-FIX] Map refreshed');
    }
  }

  static toggleView() {
    const mapContainer = document.getElementById('qnis-map-container');
    if (mapContainer) {
      const currentHeight = mapContainer.style.height;
      mapContainer.style.height = currentHeight === '500px' ? '700px' : '500px';
      
      // Trigger resize for Leaflet
      const fixer = window.QNISMapFixer;
      if (fixer && fixer.leafletMap) {
        setTimeout(() => fixer.leafletMap.invalidateSize(), 300);
      }
    }
  }

  static focusZone(zoneName) {
    console.log(`[QNIS-MAP-FIX] Focusing on zone: ${zoneName}`);
    // Could implement zone-specific filtering here
  }

  static viewLead(leadId) {
    console.log(`[QNIS-MAP-FIX] Viewing lead: ${leadId}`);
    // Could implement lead detail view here
  }
}

// Initialize the map fix
const qnisMapFixer = new QNISMapFix();

// Expose globally
window.QNISMapFixer = qnisMapFixer;

console.log('[QNIS-MAP-FIX] QNIS map fix initialized successfully');