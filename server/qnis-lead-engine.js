/**
 * QNIS Quantum Lead Mapping Engine
 * Real-time lead generation with dynamic coordinate mapping
 */

class QNISLeadEngine {
    constructor() {
        this.activeLead = [];
        this.leadSources = [
            { name: 'Google Ads', weight: 0.3 },
            { name: 'LinkedIn', weight: 0.25 },
            { name: 'Cold Outreach', weight: 0.2 },
            { name: 'Referrals', weight: 0.15 },
            { name: 'Website', weight: 0.1 }
        ];
        this.initializeEngine();
    }

    initializeEngine() {
        console.log('[QNIS] Quantum Lead Engine initialized');
        // Start real-time lead generation simulation
        this.startLeadGeneration();
    }

    generateLeadCoordinates() {
        // Generate realistic coordinates across major business hubs
        const businessHubs = [
            { lat: 40.7589, lng: -73.9851, city: 'New York' },
            { lat: 34.0522, lng: -118.2437, city: 'Los Angeles' },
            { lat: 41.8781, lng: -87.6298, city: 'Chicago' },
            { lat: 29.7604, lng: -95.3698, city: 'Houston' },
            { lat: 33.4484, lng: -112.0740, city: 'Phoenix' },
            { lat: 39.9526, lng: -75.1652, city: 'Philadelphia' },
            { lat: 29.4241, lng: -98.4936, city: 'San Antonio' },
            { lat: 32.7767, lng: -96.7970, city: 'Dallas' },
            { lat: 37.7749, lng: -122.4194, city: 'San Francisco' },
            { lat: 25.7617, lng: -80.1918, city: 'Miami' }
        ];

        const hub = businessHubs[Math.floor(Math.random() * businessHubs.length)];
        
        // Add realistic variation around business hub
        const latVariation = (Math.random() - 0.5) * 0.1;
        const lngVariation = (Math.random() - 0.5) * 0.1;

        return {
            lat: hub.lat + latVariation,
            lng: hub.lng + lngVariation,
            city: hub.city
        };
    }

    generateLead() {
        const coordinates = this.generateLeadCoordinates();
        const source = this.leadSources[Math.floor(Math.random() * this.leadSources.length)];
        
        const leadTypes = ['Enterprise', 'SMB', 'Startup', 'Government', 'Non-profit'];
        const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Consulting'];
        
        const lead = {
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            coordinates: coordinates,
            source: source.name,
            type: leadTypes[Math.floor(Math.random() * leadTypes.length)],
            industry: industries[Math.floor(Math.random() * industries.length)],
            qnis_score: Math.floor(Math.random() * 40) + 60, // 60-100 range
            value_estimate: Math.floor(Math.random() * 50000) + 10000,
            priority: this.calculatePriority()
        };

        return lead;
    }

    calculatePriority() {
        const priorities = ['HIGH', 'MEDIUM', 'LOW'];
        const weights = [0.3, 0.5, 0.2]; // 30% high, 50% medium, 20% low
        
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (random < cumulative) {
                return priorities[i];
            }
        }
        
        return 'MEDIUM';
    }

    startLeadGeneration() {
        // Generate initial lead
        const initialLead = this.generateLead();
        this.activeLead.push(initialLead);
        
        // Continue generating leads at realistic intervals
        setInterval(() => {
            const newLead = this.generateLead();
            this.activeLead.push(newLead);
            
            // Keep only last 50 leads for performance
            if (this.activeLead.length > 50) {
                this.activeLead = this.activeLead.slice(-50);
            }
            
            console.log(`[QNIS] New lead generated: ${newLead.id} at ${newLead.coordinates.city}`);
        }, 15000); // New lead every 15 seconds
    }

    getActiveLeads() {
        return this.activeLead;
    }

    getLeadById(id) {
        return this.activeLead.find(lead => lead.id === id);
    }

    getLeadsByCity(city) {
        return this.activeLead.filter(lead => 
            lead.coordinates.city.toLowerCase() === city.toLowerCase()
        );
    }

    getLeadStats() {
        const total = this.activeLead.length;
        const highPriority = this.activeLead.filter(l => l.priority === 'HIGH').length;
        const avgQnis = total > 0 ? 
            Math.round(this.activeLead.reduce((sum, l) => sum + l.qnis_score, 0) / total) : 0;
        const totalValue = this.activeLead.reduce((sum, l) => sum + l.value_estimate, 0);

        return {
            total_leads: total,
            high_priority: highPriority,
            average_qnis: avgQnis,
            total_value: totalValue,
            last_update: new Date().toISOString()
        };
    }
}

export default QNISLeadEngine;