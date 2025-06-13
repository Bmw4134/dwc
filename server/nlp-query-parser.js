/**
 * NLP Query Parser for Geographic Lead Intelligence
 * Processes natural language queries using OpenAI and local fallback
 */

class NLPQueryParser {
    constructor(apiKeyVault) {
        this.keyVault = apiKeyVault;
        this.cities = {
            'new york': { lat: 40.7589, lng: -73.9851, state: 'NY' },
            'los angeles': { lat: 34.0522, lng: -118.2437, state: 'CA' },
            'chicago': { lat: 41.8781, lng: -87.6298, state: 'IL' },
            'houston': { lat: 29.7604, lng: -95.3698, state: 'TX' },
            'phoenix': { lat: 33.4484, lng: -112.0740, state: 'AZ' },
            'philadelphia': { lat: 39.9526, lng: -75.1652, state: 'PA' },
            'san antonio': { lat: 29.4241, lng: -98.4936, state: 'TX' },
            'dallas': { lat: 32.7767, lng: -96.7970, state: 'TX' },
            'san francisco': { lat: 37.7749, lng: -122.4194, state: 'CA' },
            'miami': { lat: 25.7617, lng: -80.1918, state: 'FL' },
            'atlanta': { lat: 33.7490, lng: -84.3880, state: 'GA' },
            'california': { lat: 36.7783, lng: -119.4179, state: 'CA', isState: true },
            'texas': { lat: 31.9686, lng: -99.9018, state: 'TX', isState: true },
            'florida': { lat: 27.7663, lng: -82.6404, state: 'FL', isState: true }
        };
        
        this.industries = [
            'technology', 'tech', 'software', 'it',
            'healthcare', 'medical', 'health',
            'finance', 'financial', 'banking', 'fintech',
            'manufacturing', 'industrial',
            'retail', 'ecommerce', 'commerce',
            'consulting', 'services',
            'legal', 'law', 'attorney',
            'real estate', 'property',
            'education', 'academic',
            'nonprofit', 'non-profit'
        ];
    }

    async parseQuery(query, leads) {
        console.log(`[NLP] Processing query: "${query}"`);
        
        // Try OpenAI parsing first
        try {
            const openaiResult = await this.parseWithOpenAI(query);
            if (openaiResult) {
                const results = this.executeQuery(openaiResult, leads);
                return {
                    success: true,
                    parsedQuery: openaiResult,
                    results: results,
                    method: 'OpenAI'
                };
            }
        } catch (error) {
            console.log('[NLP] OpenAI parsing failed, falling back to local parser');
        }

        // Fallback to local parsing
        const localResult = this.parseWithLocalNLP(query);
        const results = this.executeQuery(localResult, leads);
        
        return {
            success: true,
            parsedQuery: localResult,
            results: results,
            method: 'Local'
        };
    }

    async parseWithOpenAI(query) {
        const aiKey = this.keyVault.getKeyByScope('ai');
        if (!aiKey) {
            throw new Error('No AI API key available');
        }

        const prompt = `
Parse this lead search query and extract structured information. Return JSON only.

Query: "${query}"

Extract:
- location: city name or state (null if not specified)
- industry: industry category (null if not specified)  
- minScore: minimum QNIS score (null if not specified)
- minValue: minimum lead value in dollars (null if not specified)
- priority: HIGH, MEDIUM, LOW, or null
- action: "show", "find", "highlight", "filter"

Example queries:
"Show me tech leads in California over $50k" -> {"location": "california", "industry": "technology", "minValue": 50000, "action": "show"}
"Find legal contacts near Dallas with score 70+" -> {"location": "dallas", "industry": "legal", "minScore": 70, "action": "find"}

Return only valid JSON:`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${aiKey.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a query parser. Return only valid JSON with the specified structure.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 200,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        try {
            return JSON.parse(content);
        } catch (error) {
            console.error('[NLP] Failed to parse OpenAI response as JSON:', content);
            throw error;
        }
    }

    parseWithLocalNLP(query) {
        const normalizedQuery = query.toLowerCase();
        
        const parsed = {
            location: null,
            industry: null,
            minScore: null,
            minValue: null,
            priority: null,
            action: 'show'
        };

        // Extract action
        if (normalizedQuery.includes('find')) parsed.action = 'find';
        else if (normalizedQuery.includes('highlight')) parsed.action = 'highlight';
        else if (normalizedQuery.includes('filter')) parsed.action = 'filter';

        // Extract location
        for (const [cityName, cityData] of Object.entries(this.cities)) {
            if (normalizedQuery.includes(cityName)) {
                parsed.location = cityName;
                break;
            }
        }

        // Extract industry
        for (const industry of this.industries) {
            if (normalizedQuery.includes(industry)) {
                parsed.industry = this.normalizeIndustry(industry);
                break;
            }
        }

        // Extract minimum score
        const scoreMatch = normalizedQuery.match(/score\s*(\d+)/i);
        if (scoreMatch) {
            parsed.minScore = parseInt(scoreMatch[1]);
        }

        // Extract minimum value
        const valueMatches = [
            normalizedQuery.match(/\$(\d+)k/i),
            normalizedQuery.match(/over\s*\$?(\d+),?(\d+)/i),
            normalizedQuery.match(/above\s*\$?(\d+)/i)
        ];

        for (const match of valueMatches) {
            if (match) {
                let value = parseInt(match[1]);
                if (normalizedQuery.includes('k')) {
                    value *= 1000;
                }
                parsed.minValue = value;
                break;
            }
        }

        // Extract priority
        if (normalizedQuery.includes('high priority')) parsed.priority = 'HIGH';
        else if (normalizedQuery.includes('medium priority')) parsed.priority = 'MEDIUM';
        else if (normalizedQuery.includes('low priority')) parsed.priority = 'LOW';

        return parsed;
    }

    normalizeIndustry(industry) {
        const mapping = {
            'tech': 'Technology',
            'technology': 'Technology',
            'software': 'Technology',
            'it': 'Technology',
            'healthcare': 'Healthcare',
            'medical': 'Healthcare',
            'health': 'Healthcare',
            'finance': 'Finance',
            'financial': 'Finance',
            'banking': 'Finance',
            'fintech': 'Finance',
            'manufacturing': 'Manufacturing',
            'industrial': 'Manufacturing',
            'retail': 'Retail',
            'ecommerce': 'Retail',
            'commerce': 'Retail',
            'consulting': 'Consulting',
            'services': 'Consulting',
            'legal': 'Legal',
            'law': 'Legal',
            'attorney': 'Legal'
        };

        return mapping[industry.toLowerCase()] || industry;
    }

    executeQuery(parsedQuery, leads) {
        let filteredLeads = [...leads];

        // Filter by location
        if (parsedQuery.location) {
            const locationData = this.cities[parsedQuery.location.toLowerCase()];
            if (locationData) {
                if (locationData.isState) {
                    // State-level search
                    filteredLeads = filteredLeads.filter(lead => 
                        this.isInState(lead.coordinates.city, locationData.state)
                    );
                } else {
                    // City-level search (within 50 miles)
                    filteredLeads = filteredLeads.filter(lead => 
                        this.calculateDistance(
                            lead.coordinates.lat, 
                            lead.coordinates.lng,
                            locationData.lat,
                            locationData.lng
                        ) <= 50
                    );
                }
            }
        }

        // Filter by industry
        if (parsedQuery.industry) {
            filteredLeads = filteredLeads.filter(lead => 
                lead.industry.toLowerCase().includes(parsedQuery.industry.toLowerCase())
            );
        }

        // Filter by minimum score
        if (parsedQuery.minScore) {
            filteredLeads = filteredLeads.filter(lead => 
                lead.qnis_score >= parsedQuery.minScore
            );
        }

        // Filter by minimum value
        if (parsedQuery.minValue) {
            filteredLeads = filteredLeads.filter(lead => 
                lead.value_estimate >= parsedQuery.minValue
            );
        }

        // Filter by priority
        if (parsedQuery.priority) {
            filteredLeads = filteredLeads.filter(lead => 
                lead.priority === parsedQuery.priority
            );
        }

        // Sort by QNIS score descending
        filteredLeads.sort((a, b) => b.qnis_score - a.qnis_score);

        // Calculate map center and zoom
        let mapCenter = null;
        let mapZoom = 4;

        if (parsedQuery.location && this.cities[parsedQuery.location.toLowerCase()]) {
            const locationData = this.cities[parsedQuery.location.toLowerCase()];
            mapCenter = { lat: locationData.lat, lng: locationData.lng };
            mapZoom = locationData.isState ? 6 : 10;
        } else if (filteredLeads.length > 0) {
            // Center on results
            const bounds = this.calculateBounds(filteredLeads);
            mapCenter = bounds.center;
            mapZoom = bounds.zoom;
        }

        return {
            leads: filteredLeads,
            count: filteredLeads.length,
            mapCenter: mapCenter,
            mapZoom: mapZoom,
            query: parsedQuery
        };
    }

    isInState(cityName, state) {
        const cityData = this.cities[cityName.toLowerCase()];
        return cityData && cityData.state === state;
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 3959; // Earth radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    calculateBounds(leads) {
        if (leads.length === 0) {
            return { center: { lat: 39.8283, lng: -98.5795 }, zoom: 4 };
        }

        const lats = leads.map(l => l.coordinates.lat);
        const lngs = leads.map(l => l.coordinates.lng);
        
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        // Calculate appropriate zoom level
        const latDiff = maxLat - minLat;
        const lngDiff = maxLng - minLng;
        const maxDiff = Math.max(latDiff, lngDiff);

        let zoom = 10;
        if (maxDiff > 20) zoom = 4;
        else if (maxDiff > 10) zoom = 5;
        else if (maxDiff > 5) zoom = 6;
        else if (maxDiff > 2) zoom = 7;
        else if (maxDiff > 1) zoom = 8;

        return {
            center: { lat: centerLat, lng: centerLng },
            zoom: zoom
        };
    }
}

export default NLPQueryParser;