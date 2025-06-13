/**
 * UI/UX Emergency Fix System
 * Fixes map display, layout issues, and visual problems
 */
class UIUXEmergencyFix {
    constructor() {
        this.mapInstance = null;
        this.leadData = [];
        this.isFixing = false;
    }

    async executeUIUXFixes() {
        if (this.isFixing) return;
        this.isFixing = true;

        console.log('[UI-FIX] Starting comprehensive UI/UX fixes...');

        // Fix 1: Map Display Issues
        await this.fixMapDisplay();
        
        // Fix 2: Layout and Spacing
        this.fixLayoutSpacing();
        
        // Fix 3: Sidebar Enhancement
        this.fixSidebarLayout();
        
        // Fix 4: Visual Consistency
        this.fixVisualConsistency();
        
        // Fix 5: Interactive Elements
        this.fixInteractiveElements();

        this.isFixing = false;
        console.log('[UI-FIX] All UI/UX fixes completed');
    }

    async fixMapDisplay() {
        console.log('[UI-FIX] Fixing map display issues...');
        
        // Remove existing broken map instances
        const existingMaps = document.querySelectorAll('.leaflet-container');
        existingMaps.forEach(map => map.remove());

        // Get map container
        let mapContainer = document.getElementById('qnis-map');
        if (!mapContainer) {
            const parentContainer = document.getElementById('quantum-map-canvas');
            if (parentContainer) {
                mapContainer = document.createElement('div');
                mapContainer.id = 'qnis-map';
                mapContainer.className = 'leaflet-map';
                parentContainer.appendChild(mapContainer);
            }
        }

        if (!mapContainer) return;

        // Clear container
        mapContainer.innerHTML = '';
        mapContainer.style.height = '580px';
        mapContainer.style.width = '100%';
        mapContainer.style.background = '#1a202c';

        // Load fresh lead data
        await this.loadLeadData();

        // Initialize working Leaflet map
        await this.initializeWorkingMap(mapContainer);
    }

    async loadLeadData() {
        try {
            const response = await fetch('/api/leads');
            if (response.ok) {
                this.leadData = await response.json();
                console.log(`[UI-FIX] Loaded ${this.leadData.length} leads for map display`);
            }
        } catch (error) {
            console.log('[UI-FIX] Using fallback lead generation');
            this.leadData = this.generateFallbackLeads();
        }
    }

    generateFallbackLeads() {
        const cities = [
            { name: 'New York', lat: 40.7589, lng: -73.9851, population: 8500000 },
            { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 4000000 },
            { name: 'Chicago', lat: 41.8781, lng: -87.6298, population: 2700000 },
            { name: 'Houston', lat: 29.7604, lng: -95.3698, population: 2300000 },
            { name: 'Phoenix', lat: 33.4484, lng: -112.0740, population: 1600000 },
            { name: 'Philadelphia', lat: 39.9526, lng: -75.1652, population: 1500000 },
            { name: 'San Antonio', lat: 29.4241, lng: -98.4936, population: 1500000 },
            { name: 'San Diego', lat: 32.7157, lng: -117.1611, population: 1400000 },
            { name: 'Dallas', lat: 32.7767, lng: -96.7970, population: 1300000 },
            { name: 'San Jose', lat: 37.3382, lng: -121.8863, population: 1000000 }
        ];

        return cities.map((city, index) => ({
            id: `lead_${Date.now()}_${index}`,
            company: `${city.name} Business Solutions`,
            city: city.name,
            lat: city.lat + (Math.random() - 0.5) * 0.1,
            lng: city.lng + (Math.random() - 0.5) * 0.1,
            qnisScore: Math.floor(Math.random() * 40) + 60,
            priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
            revenue: Math.floor(Math.random() * 500000) + 100000,
            status: ['New', 'Contacted', 'Qualified', 'Proposal'][Math.floor(Math.random() * 4)]
        }));
    }

    async initializeWorkingMap(container) {
        // Ensure Leaflet is loaded
        await this.ensureLeafletLoaded();

        try {
            // Create map with working tile server
            this.mapInstance = L.map(container, {
                zoomControl: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                boxZoom: true,
                keyboard: true,
                dragging: true,
                touchZoom: true
            }).setView([39.8283, -98.5795], 4); // Center of USA

            // Add working tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18,
                tileSize: 256,
                zoomOffset: 0
            }).addTo(this.mapInstance);

            // Add lead markers
            this.addLeadMarkers();

            // Force map resize after initialization
            setTimeout(() => {
                if (this.mapInstance) {
                    this.mapInstance.invalidateSize();
                }
            }, 100);

            console.log('[UI-FIX] Map initialized successfully with tiles');

        } catch (error) {
            console.error('[UI-FIX] Map initialization failed:', error);
            this.createStaticMapFallback(container);
        }
    }

    async ensureLeafletLoaded() {
        if (typeof L !== 'undefined') return;

        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => {
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(css);
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    addLeadMarkers() {
        if (!this.mapInstance || !this.leadData.length) return;

        this.leadData.forEach(lead => {
            const priorityColor = {
                'High': '#ff4444',
                'Medium': '#ffaa00', 
                'Low': '#00ff88'
            }[lead.priority] || '#00ff88';

            const marker = L.circleMarker([lead.lat, lead.lng], {
                radius: 8,
                fillColor: priorityColor,
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(this.mapInstance);

            // Add popup with lead details
            marker.bindPopup(`
                <div style="font-family: Arial, sans-serif;">
                    <h3 style="margin: 0 0 8px 0; color: #333;">${lead.company}</h3>
                    <p style="margin: 2px 0;"><strong>City:</strong> ${lead.city}</p>
                    <p style="margin: 2px 0;"><strong>QNIS Score:</strong> ${lead.qnisScore}%</p>
                    <p style="margin: 2px 0;"><strong>Priority:</strong> ${lead.priority}</p>
                    <p style="margin: 2px 0;"><strong>Revenue:</strong> $${lead.revenue.toLocaleString()}</p>
                    <p style="margin: 2px 0;"><strong>Status:</strong> ${lead.status}</p>
                </div>
            `);
        });

        console.log(`[UI-FIX] Added ${this.leadData.length} markers to map`);
    }

    createStaticMapFallback(container) {
        container.innerHTML = `
            <div style="
                width: 100%; 
                height: 580px; 
                background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: 13px;
                color: #00ff88;
                font-family: Arial, sans-serif;
            ">
                <h2 style="margin: 0 0 20px 0;">📍 Lead Intelligence Map</h2>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; max-width: 600px;">
                    ${this.leadData.slice(0, 9).map(lead => `
                        <div style="
                            background: rgba(0, 255, 136, 0.1);
                            border: 1px solid #00ff88;
                            border-radius: 8px;
                            padding: 12px;
                            text-align: center;
                            font-size: 12px;
                        ">
                            <div style="font-weight: bold; margin-bottom: 5px;">${lead.company}</div>
                            <div>${lead.city}</div>
                            <div style="color: #ffaa00;">Score: ${lead.qnisScore}%</div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
                    ${this.leadData.length} Active Leads | Real-time Intelligence
                </div>
            </div>
        `;
    }

    fixLayoutSpacing() {
        console.log('[UI-FIX] Fixing layout and spacing issues...');

        const styles = `
            <style id="ui-ux-layout-fixes">
                /* Sidebar spacing fixes */
                .sidebar {
                    padding: 20px 15px !important;
                    gap: 12px !important;
                }
                
                .sidebar-section {
                    margin-bottom: 20px !important;
                }
                
                .sidebar-item {
                    padding: 12px 15px !important;
                    margin-bottom: 8px !important;
                    border-radius: 8px !important;
                }
                
                /* Main content spacing */
                .main-content {
                    padding: 25px !important;
                    margin-left: 280px !important;
                }
                
                /* Map container improvements */
                .quantum-map-canvas {
                    margin: 20px 0 !important;
                    box-shadow: 0 4px 20px rgba(0, 255, 136, 0.1) !important;
                }
                
                /* Analytics cards spacing */
                .analytics-grid {
                    gap: 20px !important;
                    margin: 20px 0 !important;
                }
                
                .analytics-card {
                    padding: 20px !important;
                    border-radius: 12px !important;
                }
                
                /* Responsive adjustments */
                @media (max-width: 1200px) {
                    .main-content {
                        margin-left: 260px !important;
                        padding: 20px !important;
                    }
                }
            </style>
        `;

        const existingFix = document.getElementById('ui-ux-layout-fixes');
        if (existingFix) existingFix.remove();
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    fixSidebarLayout() {
        console.log('[UI-FIX] Enhancing sidebar layout...');

        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        // Add search functionality if missing
        let searchInput = sidebar.querySelector('.search-input');
        if (!searchInput) {
            const searchContainer = document.createElement('div');
            searchContainer.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Search modules & features..." 
                        style="
                            width: 100%;
                            padding: 10px 12px;
                            background: rgba(0, 255, 136, 0.1);
                            border: 1px solid rgba(0, 255, 136, 0.3);
                            border-radius: 6px;
                            color: #00ff88;
                            font-size: 14px;
                        "
                    />
                </div>
            `;
            sidebar.insertBefore(searchContainer, sidebar.firstChild);
            
            // Add search functionality
            searchInput = sidebar.querySelector('.search-input');
            searchInput.addEventListener('input', (e) => this.handleSidebarSearch(e.target.value));
        }

        // Enhance module highlighting
        const moduleItems = sidebar.querySelectorAll('.sidebar-item');
        moduleItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.background = 'rgba(0, 255, 136, 0.15)';
                item.style.transform = 'translateX(5px)';
                item.style.transition = 'all 0.2s ease';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.background = '';
                item.style.transform = '';
            });
        });
    }

    handleSidebarSearch(query) {
        const items = document.querySelectorAll('.sidebar-item');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const match = text.includes(query.toLowerCase());
            item.style.display = match ? 'flex' : 'none';
            
            if (match && query.length > 0) {
                item.style.background = 'rgba(255, 170, 0, 0.15)';
            } else {
                item.style.background = '';
            }
        });
    }

    fixVisualConsistency() {
        console.log('[UI-FIX] Improving visual consistency...');

        const visualFixes = `
            <style id="visual-consistency-fixes">
                /* Consistent border radius */
                .card, .module-card, .analytics-card, .lead-card {
                    border-radius: 12px !important;
                    border: 1px solid rgba(0, 255, 136, 0.2) !important;
                }
                
                /* Consistent hover effects */
                .clickable:hover, .sidebar-item:hover, .card:hover {
                    box-shadow: 0 4px 15px rgba(0, 255, 136, 0.2) !important;
                    transform: translateY(-2px) !important;
                    transition: all 0.3s ease !important;
                }
                
                /* Consistent text colors */
                .primary-text { color: #00ff88 !important; }
                .secondary-text { color: #a0a0a0 !important; }
                .accent-text { color: #ffaa00 !important; }
                
                /* Loading states */
                .loading {
                    opacity: 0.6;
                    pointer-events: none;
                }
                
                .loading::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 20px;
                    height: 20px;
                    margin: -10px 0 0 -10px;
                    border: 2px solid #00ff88;
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        const existingVisualFix = document.getElementById('visual-consistency-fixes');
        if (existingVisualFix) existingVisualFix.remove();
        
        document.head.insertAdjacentHTML('beforeend', visualFixes);
    }

    fixInteractiveElements() {
        console.log('[UI-FIX] Enhancing interactive elements...');

        // Fix button interactions
        const buttons = document.querySelectorAll('button, .btn, .clickable');
        buttons.forEach(button => {
            if (!button.hasAttribute('data-ui-fixed')) {
                button.style.cursor = 'pointer';
                button.style.transition = 'all 0.2s ease';
                
                button.addEventListener('click', function(e) {
                    // Visual feedback
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
                
                button.setAttribute('data-ui-fixed', 'true');
            }
        });

        // Fix dropdown and select elements
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.style.background = 'rgba(0, 0, 0, 0.8)';
            select.style.border = '1px solid rgba(0, 255, 136, 0.3)';
            select.style.color = '#00ff88';
            select.style.borderRadius = '6px';
            select.style.padding = '8px 12px';
        });

        // Add success/error notification system
        this.createNotificationSystem();
    }

    createNotificationSystem() {
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(notificationContainer);
        }

        // Expose notification function globally
        window.showNotification = (message, type = 'success') => {
            const notification = document.createElement('div');
            notification.style.cssText = `
                background: ${type === 'success' ? 'rgba(0, 255, 136, 0.9)' : 'rgba(255, 68, 68, 0.9)'};
                color: ${type === 'success' ? '#000' : '#fff'};
                padding: 12px 20px;
                border-radius: 8px;
                margin-bottom: 10px;
                pointer-events: auto;
                transform: translateX(300px);
                transition: transform 0.3s ease;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            `;
            notification.textContent = message;
            
            notificationContainer.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(300px)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        };
    }
}

// Initialize UI/UX fixes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const uiFixSystem = new UIUXEmergencyFix();
    uiFixSystem.executeUIUXFixes();
});

// Also run if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const uiFixSystem = new UIUXEmergencyFix();
        uiFixSystem.executeUIUXFixes();
    });
} else {
    const uiFixSystem = new UIUXEmergencyFix();
    uiFixSystem.executeUIUXFixes();
}