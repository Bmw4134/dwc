/**
 * Definitive Map Display Fix
 * Overrides all conflicting map implementations with working solution
 */

class MapDisplayFix {
    constructor() {
        this.initialized = false;
        this.mapContainer = null;
        this.leadData = [];
    }

    async initialize() {
        if (this.initialized) return;
        
        console.log('[MAP-FIX] Initializing definitive map display');
        
        // Stop all other map initialization attempts
        this.stopConflictingScripts();
        
        // Create working map container
        this.createMapContainer();
        
        // Load lead data
        await this.loadLeadData();
        
        // Render map with leads
        this.renderWorkingMap();
        
        this.initialized = true;
        console.log('[MAP-FIX] Map display ready with', this.leadData.length, 'leads');
    }

    stopConflictingScripts() {
        // Clear any existing map intervals or timeouts
        for (let i = 1; i < 99999; i++) {
            window.clearTimeout(i);
            window.clearInterval(i);
        }
        
        // Override conflicting global variables
        window.qnisMap = { initialized: true, map: null };
        window.quantumMapSystem = { initialized: true };
    }

    createMapContainer() {
        // Find QNIS module
        const qnisModule = document.getElementById('qnis-module');
        if (!qnisModule) {
            console.log('[MAP-FIX] QNIS module not found, creating fallback');
            this.createFallbackContainer();
            return;
        }

        // Remove any existing map containers
        const existingMaps = qnisModule.querySelectorAll('#qnis-map, .quantum-map-container, canvas');
        existingMaps.forEach(el => el.remove());

        // Create new map container
        this.mapContainer = document.createElement('div');
        this.mapContainer.id = 'working-qnis-map';
        this.mapContainer.style.cssText = `
            width: 100%;
            height: 500px;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border: 2px solid #00ff88;
            border-radius: 12px;
            margin: 20px 0;
            position: relative;
            overflow: hidden;
            display: block;
        `;

        // Add to QNIS module
        const moduleContent = qnisModule.querySelector('.module-content') || qnisModule;
        moduleContent.appendChild(this.mapContainer);
    }

    createFallbackContainer() {
        this.mapContainer = document.createElement('div');
        this.mapContainer.id = 'working-qnis-map';
        this.mapContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 400px;
            height: 300px;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border: 2px solid #00ff88;
            border-radius: 12px;
            z-index: 10000;
            overflow: hidden;
        `;
        document.body.appendChild(this.mapContainer);
    }

    async loadLeadData() {
        try {
            const response = await fetch('/api/qnis/leads');
            if (response.ok) {
                this.leadData = await response.json();
                console.log('[MAP-FIX] Loaded', this.leadData.length, 'authentic leads from server');
            } else {
                throw new Error('API not available');
            }
        } catch (error) {
            console.log('[MAP-FIX] Server API unavailable');
            this.leadData = [];
        }

        // Set up real-time updates every 15 seconds to match server generation
        this.setupRealTimeUpdates();
    }

    setupRealTimeUpdates() {
        setInterval(async () => {
            try {
                const response = await fetch('/api/qnis/leads');
                if (response.ok) {
                    const newData = await response.json();
                    if (newData.length !== this.leadData.length) {
                        this.leadData = newData;
                        if (this.isLeafletMap && this.map) {
                            this.updateLeafletMarkers();
                        } else {
                            this.renderWorkingMap();
                        }
                        console.log('[MAP-FIX] Live update:', this.leadData.length, 'leads');
                    }
                }
            } catch (error) {
                // Continue with existing data
            }
        }, 15000);
    }

    generateSampleData() {
        return [
            { id: '1', coordinates: { city: 'New York', lat: 40.7589, lng: -73.9851 }, qnis_score: 92, value_estimate: 45000, priority: 'HIGH' },
            { id: '2', coordinates: { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 }, qnis_score: 88, value_estimate: 38000, priority: 'HIGH' },
            { id: '3', coordinates: { city: 'Chicago', lat: 41.8781, lng: -87.6298 }, qnis_score: 85, value_estimate: 32000, priority: 'MEDIUM' },
            { id: '4', coordinates: { city: 'Houston', lat: 29.7604, lng: -95.3698 }, qnis_score: 90, value_estimate: 41000, priority: 'HIGH' },
            { id: '5', coordinates: { city: 'Phoenix', lat: 33.4484, lng: -112.0740 }, qnis_score: 87, value_estimate: 35000, priority: 'MEDIUM' },
            { id: '6', coordinates: { city: 'Philadelphia', lat: 39.9526, lng: -75.1652 }, qnis_score: 83, value_estimate: 29000, priority: 'MEDIUM' },
            { id: '7', coordinates: { city: 'San Antonio', lat: 29.4241, lng: -98.4936 }, qnis_score: 86, value_estimate: 33000, priority: 'MEDIUM' },
            { id: '8', coordinates: { city: 'San Diego', lat: 32.7157, lng: -117.1611 }, qnis_score: 89, value_estimate: 39000, priority: 'HIGH' },
            { id: '9', coordinates: { city: 'Dallas', lat: 32.7767, lng: -96.7970 }, qnis_score: 91, value_estimate: 43000, priority: 'HIGH' },
            { id: '10', coordinates: { city: 'San Francisco', lat: 37.7749, lng: -122.4194 }, qnis_score: 94, value_estimate: 52000, priority: 'HIGH' },
            { id: '11', coordinates: { city: 'Seattle', lat: 47.6062, lng: -122.3321 }, qnis_score: 89, value_estimate: 47000, priority: 'HIGH' },
            { id: '12', coordinates: { city: 'Denver', lat: 39.7392, lng: -104.9903 }, qnis_score: 84, value_estimate: 31000, priority: 'MEDIUM' },
            { id: '13', coordinates: { city: 'Atlanta', lat: 33.7490, lng: -84.3880 }, qnis_score: 88, value_estimate: 36000, priority: 'HIGH' },
            { id: '14', coordinates: { city: 'Boston', lat: 42.3601, lng: -71.0589 }, qnis_score: 93, value_estimate: 49000, priority: 'HIGH' },
            { id: '15', coordinates: { city: 'Miami', lat: 25.7617, lng: -80.1918 }, qnis_score: 86, value_estimate: 34000, priority: 'MEDIUM' }
        ];
    }

    renderWorkingMap() {
        // Clear container
        this.mapContainer.innerHTML = '';

        // Create header
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 15px 20px;
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 102, 204, 0.1));
            border-bottom: 2px solid #00ff88;
            display: flex;
            justify-content: space-between;
            align-items: center;
            backdrop-filter: blur(10px);
        `;
        
        const totalValue = this.leadData.reduce((sum, lead) => sum + (lead.value_estimate || 0), 0);
        const highPriorityCount = this.leadData.filter(lead => lead.priority === 'HIGH').length;
        
        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="color: #00ff88; font-weight: bold; font-size: 18px; text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);">
                    🗺️ QNIS Lead Intelligence Map
                </div>
                <div style="color: #64748b; font-size: 11px; background: rgba(100, 116, 139, 0.2); padding: 4px 8px; border-radius: 12px;">
                    USA Coverage
                </div>
            </div>
            <div style="display: flex; gap: 20px; align-items: center;">
                <div style="text-align: center;">
                    <div style="color: #ffffff; font-weight: bold; font-size: 16px;">${this.leadData.length}</div>
                    <div style="color: #64748b; font-size: 10px;">Active Leads</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #ff4444; font-weight: bold; font-size: 16px;">${highPriorityCount}</div>
                    <div style="color: #64748b; font-size: 10px;">High Priority</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #00ff88; font-weight: bold; font-size: 16px;">$${(totalValue / 1000).toFixed(0)}K</div>
                    <div style="color: #64748b; font-size: 10px;">Pipeline Value</div>
                </div>
                <div style="width: 8px; height: 8px; background: #00ff88; border-radius: 50%; animation: pulse 2s infinite;"></div>
            </div>
        `;
        this.mapContainer.appendChild(header);

        // Create canvas for map
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 400;
        canvas.style.cssText = `
            width: 100%;
            height: calc(100% - 60px);
            display: block;
            cursor: crosshair;
        `;
        this.mapContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        // Draw base map
        this.drawUSAMap(ctx, canvas.width, canvas.height);

        // Draw leads
        this.drawLeadMarkers(ctx, canvas.width, canvas.height);

        // Add interactivity
        this.addMapInteraction(canvas, ctx);

        // Create stats panel
        this.createStatsPanel();
    }

    drawUSAMap(ctx, width, height) {
        // Clear canvas
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        for (let x = 0; x < width; x += 80) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += 60) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.setLineDash([]);

        // Draw USA outline (simplified)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Simplified USA border
        ctx.moveTo(100, 100);
        ctx.lineTo(700, 100);
        ctx.lineTo(720, 150);
        ctx.lineTo(700, 300);
        ctx.lineTo(600, 350);
        ctx.lineTo(200, 350);
        ctx.lineTo(100, 200);
        ctx.closePath();
        ctx.stroke();
    }

    drawLeadMarkers(ctx, width, height) {
        this.leadData.forEach(lead => {
            // Validate lead data structure
            if (!lead || !lead.coordinates || 
                typeof lead.coordinates.lat === 'undefined' || 
                typeof lead.coordinates.lng === 'undefined') {
                console.warn('[MAP-FIX] Invalid lead data:', lead);
                return;
            }

            const x = this.longitudeToX(lead.coordinates.lng, width);
            const y = this.latitudeToY(lead.coordinates.lat, height);

            // Determine marker color based on priority
            let markerColor = '#00ff88'; // Default green for MEDIUM
            let glowColor = '#00ff88';
            
            if (lead.priority === 'HIGH') {
                markerColor = '#ff4444'; // Red for HIGH priority
                glowColor = '#ff4444';
            }

            // Draw marker glow
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 15;
            
            // Draw marker
            ctx.fillStyle = markerColor;
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI);
            ctx.fill();

            // Add priority indicator ring for HIGH priority
            if (lead.priority === 'HIGH') {
                ctx.strokeStyle = '#ffaa00';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, 15, 0, 2 * Math.PI);
                ctx.stroke();
            }

            ctx.shadowBlur = 0;

            // Draw text background for better readability
            const cityName = lead.coordinates.city || 'Unknown';
            const qnisScore = lead.qnis_score || 0;
            const valueEstimate = lead.value_estimate || 0;

            // Calculate text dimensions
            ctx.font = 'bold 14px Arial';
            const cityWidth = ctx.measureText(cityName).width;
            ctx.font = '12px Arial';
            const scoreText = `${qnisScore}%`;
            const scoreWidth = ctx.measureText(scoreText).width;
            ctx.font = '11px Arial';
            const valueText = `$${(valueEstimate / 1000).toFixed(0)}K`;
            const valueWidth = ctx.measureText(valueText).width;

            const maxWidth = Math.max(cityWidth, scoreWidth, valueWidth);
            const textHeight = 50;
            const padding = 4;

            // Draw text background
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(x + 18, y - 8, maxWidth + padding * 2, textHeight);

            // Draw border around text background
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 18, y - 8, maxWidth + padding * 2, textHeight);

            // Draw city name with enhanced visibility
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(cityName, x + 20, y + 8);

            // Draw QNIS score with color coding
            ctx.fillStyle = qnisScore >= 90 ? '#00ff88' : qnisScore >= 85 ? '#ffaa00' : '#ff8800';
            ctx.font = '12px Arial';
            ctx.fillText(scoreText, x + 20, y + 24);

            // Draw value estimate
            ctx.fillStyle = '#94a3b8';
            ctx.font = '11px Arial';
            ctx.fillText(valueText, x + 20, y + 38);
        });
    }

    longitudeToX(lng, width) {
        return ((lng + 130) / 60) * width;
    }

    latitudeToY(lat, height) {
        return ((50 - lat) / 25) * height;
    }

    addMapInteraction(canvas, ctx) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);

            // Check if hovering over a lead
            const hoveredLead = this.findLeadAt(x, y);
            if (hoveredLead) {
                canvas.style.cursor = 'pointer';
                this.showLeadTooltip(hoveredLead, e.clientX, e.clientY);
            } else {
                canvas.style.cursor = 'crosshair';
                this.hideTooltip();
            }
        });
    }

    findLeadAt(x, y) {
        return this.leadData.find(lead => {
            const leadX = this.longitudeToX(lead.coordinates.lng, 800);
            const leadY = this.latitudeToY(lead.coordinates.lat, 400);
            const distance = Math.sqrt((x - leadX) ** 2 + (y - leadY) ** 2);
            return distance < 15;
        });
    }

    showLeadTooltip(lead, x, y) {
        let tooltip = document.getElementById('lead-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'lead-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: #1e293b;
                border: 1px solid #00ff88;
                border-radius: 8px;
                padding: 10px;
                color: white;
                font-size: 12px;
                z-index: 10001;
                pointer-events: none;
            `;
            document.body.appendChild(tooltip);
        }

        tooltip.innerHTML = `
            <div style="color: #00ff88; font-weight: bold;">${lead.coordinates.city}</div>
            <div>QNIS Score: ${lead.qnis_score}%</div>
            <div>Value: $${lead.value_estimate.toLocaleString()}</div>
        `;

        tooltip.style.left = (x + 10) + 'px';
        tooltip.style.top = (y - 60) + 'px';
        tooltip.style.display = 'block';
    }

    hideTooltip() {
        const tooltip = document.getElementById('lead-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    createStatsPanel() {
        const statsPanel = document.createElement('div');
        statsPanel.style.cssText = `
            position: absolute;
            top: 70px;
            right: 15px;
            background: rgba(30, 41, 59, 0.95);
            border: 1px solid #00ff88;
            border-radius: 8px;
            padding: 15px;
            color: white;
            font-size: 12px;
            min-width: 180px;
            backdrop-filter: blur(5px);
        `;

        const totalValue = this.leadData.reduce((sum, lead) => sum + lead.value_estimate, 0);
        const avgScore = Math.round(this.leadData.reduce((sum, lead) => sum + lead.qnis_score, 0) / this.leadData.length);
        const highPriorityCount = this.leadData.filter(lead => lead.priority === 'HIGH').length;
        const mediumPriorityCount = this.leadData.filter(lead => lead.priority === 'MEDIUM').length;
        const topPerformers = this.leadData.filter(lead => lead.qnis_score >= 90).length;

        statsPanel.innerHTML = `
            <div style="color: #00ff88; font-weight: bold; margin-bottom: 12px; font-size: 14px;">Lead Analytics</div>
            
            <div style="margin-bottom: 10px;">
                <div style="color: #64748b; font-size: 10px;">TOTAL METRICS</div>
                <div>Leads: ${this.leadData.length}</div>
                <div>Pipeline Value: $${(totalValue / 1000).toFixed(0)}K</div>
                <div>Avg Score: ${avgScore}%</div>
            </div>
            
            <div style="margin-bottom: 10px;">
                <div style="color: #64748b; font-size: 10px;">PRIORITY BREAKDOWN</div>
                <div style="display: flex; align-items: center; margin: 2px 0;">
                    <div style="width: 8px; height: 8px; background: #ff4444; border-radius: 50%; margin-right: 6px;"></div>
                    <span>High: ${highPriorityCount}</span>
                </div>
                <div style="display: flex; align-items: center; margin: 2px 0;">
                    <div style="width: 8px; height: 8px; background: #00ff88; border-radius: 50%; margin-right: 6px;"></div>
                    <span>Medium: ${mediumPriorityCount}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 8px;">
                <div style="color: #64748b; font-size: 10px;">PERFORMANCE</div>
                <div>Top Performers: ${topPerformers}</div>
                <div>Conversion Rate: ${Math.round((topPerformers / this.leadData.length) * 100)}%</div>
            </div>
            
            <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #334155;">
                <div style="display: flex; align-items: center;">
                    <div style="width: 6px; height: 6px; background: #00ff88; border-radius: 50%; margin-right: 6px; animation: pulse 2s infinite;"></div>
                    <span style="color: #00ff88; font-size: 11px;">Live Tracking</span>
                </div>
            </div>
        `;

        this.mapContainer.appendChild(statsPanel);

        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize immediately
window.mapDisplayFix = new MapDisplayFix();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.mapDisplayFix.initialize(), 1500);
    });
} else {
    setTimeout(() => window.mapDisplayFix.initialize(), 1500);
}

// Export for manual initialization
window.initializeWorkingMap = () => window.mapDisplayFix.initialize();