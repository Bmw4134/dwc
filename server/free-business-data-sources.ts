import axios from 'axios';

export interface BusinessListing {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  source: string;
}

export class FreeBusinessDataSources {
  private baseDelay = 1000; // 1 second between requests to respect rate limits

  // OpenStreetMap Overpass API (Completely Free)
  async searchOpenStreetMap(location: string, businessType?: string): Promise<BusinessListing[]> {
    try {
      const query = this.buildOverpassQuery(location, businessType);
      
      const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
        headers: { 'Content-Type': 'text/plain' },
        timeout: 15000
      });

      return this.parseOverpassResponse(response.data);
    } catch (error) {
      console.error('OpenStreetMap API error:', error);
      return [];
    }
  }

  // US Business Directory API (Government data - completely free)
  async searchUSBusinessDirectory(location: string, businessType?: string): Promise<BusinessListing[]> {
    try {
      // Using OpenCorporates API (free tier available)
      const response = await axios.get('https://api.opencorporates.com/v0.4/companies/search', {
        params: {
          q: `${businessType || 'business'} ${location}`,
          format: 'json',
          per_page: 20,
          jurisdiction_code: 'us'
        },
        timeout: 10000
      });

      return this.parseOpenCorporatesResponse(response.data);
    } catch (error) {
      console.error('US Business Directory API error:', error);
      return [];
    }
  }

  // Nominatim (OpenStreetMap) - Free geocoding and business search
  async searchNominatim(location: string, businessType?: string): Promise<BusinessListing[]> {
    try {
      const query = businessType ? `${businessType} in ${location}` : location;
      
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          extratags: 1,
          limit: 25
        },
        headers: {
          'User-Agent': 'DWC-NEXUS-Platform/1.0'
        },
        timeout: 10000
      });

      return this.parseNominatimResponse(response.data);
    } catch (error) {
      console.error('Nominatim API error:', error);
      return [];
    }
  }

  // Foursquare Places API (Free tier available)
  async searchFoursquare(location: string, businessType?: string): Promise<BusinessListing[]> {
    const apiKey = process.env.FOURSQUARE_API_KEY;
    if (!apiKey) {
      return [];
    }

    try {
      const response = await axios.get('https://api.foursquare.com/v3/places/search', {
        headers: {
          'Authorization': apiKey,
          'Accept': 'application/json'
        },
        params: {
          near: location,
          query: businessType || '',
          limit: 20
        },
        timeout: 10000
      });

      return this.parseFoursquareResponse(response.data);
    } catch (error) {
      console.error('Foursquare API error:', error);
      return [];
    }
  }

  // Parse OpenCorporates API response
  private parseOpenCorporatesResponse(data: any): BusinessListing[] {
    const businesses: BusinessListing[] = [];
    
    if (data.results?.companies) {
      for (const company of data.results.companies) {
        businesses.push({
          name: company.company.name,
          address: company.company.registered_address_in_full || 'Address not available',
          category: company.company.company_type || 'Business',
          website: company.company.registry_url,
          source: 'OpenCorporates',
          coordinates: {
            lat: 0, // Will be geocoded separately if needed
            lng: 0
          }
        });
      }
    }
    
    return businesses;
  }

  // Parse Nominatim API response  
  private parseNominatimResponse(data: any[]): BusinessListing[] {
    const businesses: BusinessListing[] = [];
    
    for (const place of data) {
      if (place.extratags?.amenity || place.extratags?.shop || place.extratags?.office) {
        businesses.push({
          name: place.display_name.split(',')[0],
          address: place.display_name,
          category: place.extratags.amenity || place.extratags.shop || place.extratags.office || 'Business',
          phone: place.extratags.phone,
          website: place.extratags.website,
          source: 'OpenStreetMap',
          coordinates: {
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon)
          }
        });
      }
    }
    
    return businesses;
  }

  // Parse Foursquare API response
  private parseFoursquareResponse(data: any): BusinessListing[] {
    const businesses: BusinessListing[] = [];
    
    if (data.results) {
      for (const venue of data.results) {
        businesses.push({
          name: venue.name,
          address: `${venue.location.address || ''} ${venue.location.locality || ''} ${venue.location.region || ''}`.trim(),
          category: venue.categories?.[0]?.name || 'Business',
          source: 'Foursquare',
          coordinates: {
            lat: venue.geocodes?.main?.latitude || 0,
            lng: venue.geocodes?.main?.longitude || 0
          }
        });
      }
    }
    
    return businesses;
  }

  // Master search function that tries all available sources
  async searchAllSources(location: string, businessType?: string): Promise<BusinessListing[]> {
    const allBusinesses: BusinessListing[] = [];
    const sources = [
      () => this.searchNominatim(location, businessType),
      () => this.searchUSBusinessDirectory(location, businessType),
      () => this.searchOpenStreetMap(location, businessType)
    ];

    for (const searchSource of sources) {
      try {
        await this.delay(this.baseDelay);
        const results = await searchSource();
        allBusinesses.push(...results);
        
        if (allBusinesses.length >= 25) break;
      } catch (error) {
        console.error('Source search error:', error);
        continue;
      }
    }

    return this.deduplicateBusinesses(allBusinesses);
  }

  private deduplicateBusinesses(businesses: BusinessListing[]): BusinessListing[] {
    const seen = new Set<string>();
    return businesses.filter(business => {
      const key = `${business.name.toLowerCase()}-${business.address.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Additional parsing methods
  private buildOverpassQuery(location: string, businessType?: string): string {
    const bbox = this.getLocationBbox(location);
    return `[out:json][timeout:25];
(
  node["amenity"~"restaurant|cafe|shop|office"](${bbox});
  way["amenity"~"restaurant|cafe|shop|office"](${bbox});
  relation["amenity"~"restaurant|cafe|shop|office"](${bbox});
);
out center meta;`;
  }

  private getLocationBbox(location: string): string {
    // Simplified bbox for major US cities
    const cityBounds: Record<string, string> = {
      'new york': '40.4774,-74.2591,40.9176,-73.7004',
      'los angeles': '33.7037,-118.6681,34.3373,-118.1553',
      'chicago': '41.6444,-87.9073,42.0230,-87.5238',
      'houston': '29.5274,-95.8755,30.1100,-95.0667',
      'miami': '25.5516,-80.8315,25.9776,-80.1303'
    };
    
    return cityBounds[location.toLowerCase()] || '25.5516,-124.8315,49.3776,-66.9463'; // US bounds
  }

  private parseOverpassResponse(data: any): BusinessListing[] {
    const businesses: BusinessListing[] = [];
    
    if (data.elements) {
      for (const element of data.elements) {
        if (element.tags?.name) {
          businesses.push({
            name: element.tags.name,
            address: `${element.tags['addr:street'] || ''} ${element.tags['addr:city'] || ''}`.trim(),
            category: element.tags.amenity || element.tags.shop || 'Business',
            phone: element.tags.phone,
            website: element.tags.website,
            source: 'OpenStreetMap',
            coordinates: {
              lat: element.lat || element.center?.lat || 0,
              lng: element.lon || element.center?.lon || 0
            }
          });
        }
      }
    }
    
    return businesses;
        name: place.name,
        address: place.location.formatted_address,
        category: place.categories?.[0]?.name || 'Business',
        rating: place.rating,
        coordinates: {
          lat: place.geocodes.main.latitude,
          lng: place.geocodes.main.longitude
        },
        source: 'Foursquare'
      }));
    } catch (error) {
      console.error('Foursquare API error:', error);
      return [];
    }
  }

  // Yelp Fusion API (Free tier: 5,000 calls/month)
  async searchYelp(location: string, businessType?: string): Promise<BusinessListing[]> {
    const apiKey = process.env.YELP_API_KEY;
    if (!apiKey) {
      console.log('Yelp API key not configured');
      return [];
    }

    try {
      const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        params: {
          location: location,
          term: businessType || '',
          limit: 50,
          sort_by: 'rating'
        }
      });

      return response.data.businesses.map((business: any) => ({
        name: business.name,
        address: business.location.display_address.join(', '),
        phone: business.phone,
        website: business.url,
        category: business.categories?.[0]?.title || 'Business',
        rating: business.rating,
        reviewCount: business.review_count,
        coordinates: {
          lat: business.coordinates.latitude,
          lng: business.coordinates.longitude
        },
        source: 'Yelp'
      }));
    } catch (error) {
      console.error('Yelp API error:', error);
      return [];
    }
  }

  // Here Places API (Freemium: 1,000 requests/month free)
  async searchHerePlaces(location: string, businessType?: string): Promise<BusinessListing[]> {
    const apiKey = process.env.HERE_API_KEY;
    if (!apiKey) {
      console.log('Here API key not configured');
      return [];
    }

    try {
      const response = await axios.get('https://discover.search.hereapi.com/v1/discover', {
        params: {
          apiKey: apiKey,
          at: await this.geocodeLocation(location),
          q: businessType || 'business',
          limit: 50
        }
      });

      return response.data.items.map((item: any) => ({
        name: item.title,
        address: item.address.label,
        category: item.categories?.[0]?.name || 'Business',
        coordinates: {
          lat: item.position.lat,
          lng: item.position.lng
        },
        source: 'Here Places'
      }));
    } catch (error) {
      console.error('Here Places API error:', error);
      return [];
    }
  }

  // Web scraping approach for public business directories
  async scrapePublicDirectories(location: string): Promise<BusinessListing[]> {
    const businesses: BusinessListing[] = [];
    
    try {
      // Yellow Pages scraping (public data)
      const yellowPagesData = await this.scrapeYellowPages(location);
      businesses.push(...yellowPagesData);

      // BBB (Better Business Bureau) public directory
      const bbbData = await this.scrapeBBB(location);
      businesses.push(...bbbData);

    } catch (error) {
      console.error('Directory scraping error:', error);
    }

    return businesses;
  }

  // Comprehensive search using all available sources
  async findRealBusinesses(location: string, businessTypes: string[] = []): Promise<BusinessListing[]> {
    console.log(`🔍 Searching for real businesses near: ${location}`);
    
    const allBusinesses: BusinessListing[] = [];
    const sources = [
      () => this.searchOpenStreetMap(location),
      () => this.searchFoursquare(location),
      () => this.searchYelp(location),
      () => this.searchHerePlaces(location),
      () => this.scrapePublicDirectories(location)
    ];

    // Search each business type across all sources
    for (const businessType of businessTypes.length > 0 ? businessTypes : ['']) {
      for (const searchSource of sources) {
        try {
          const results = await searchSource();
          allBusinesses.push(...results);
          
          // Respect rate limits
          await this.delay(this.baseDelay);
        } catch (error) {
          console.error('Search source error:', error);
        }
      }
    }

    // Remove duplicates and return unique businesses
    return this.deduplicateBusinesses(allBusinesses);
  }

  private buildOverpassQuery(location: string, businessType?: string): string {
    // Build Overpass QL query for OpenStreetMap
    const tags = businessType ? 
      `["shop"]["name"]` : 
      `[~"^(shop|amenity|office|craft)$"~"."]["name"]`;
    
    return `
      [out:json][timeout:25];
      (
        area["name"~"${location}",i]->.searchArea;
        (
          node${tags}(area.searchArea);
          way${tags}(area.searchArea);
          relation${tags}(area.searchArea);
        );
      );
      out center meta;
    `;
  }

  private parseOverpassResponse(data: any): BusinessListing[] {
    if (!data.elements) return [];
    
    return data.elements
      .filter((element: any) => element.tags?.name)
      .map((element: any) => ({
        name: element.tags.name,
        address: this.buildAddressFromTags(element.tags),
        phone: element.tags.phone || element.tags['contact:phone'],
        website: element.tags.website || element.tags['contact:website'],
        category: this.categorizeFromTags(element.tags),
        coordinates: {
          lat: element.lat || element.center?.lat,
          lng: element.lon || element.center?.lng
        },
        source: 'OpenStreetMap'
      }))
      .filter(business => business.name && business.coordinates);
  }

  private buildAddressFromTags(tags: any): string {
    const parts = [
      tags['addr:housenumber'],
      tags['addr:street'],
      tags['addr:city'],
      tags['addr:state'],
      tags['addr:postcode']
    ].filter(Boolean);
    
    return parts.join(' ') || 'Address not available';
  }

  private categorizeFromTags(tags: any): string {
    if (tags.shop) return `${tags.shop} shop`;
    if (tags.amenity) return tags.amenity;
    if (tags.office) return `${tags.office} office`;
    if (tags.craft) return `${tags.craft} service`;
    return 'Business';
  }

  private async scrapeYellowPages(location: string): Promise<BusinessListing[]> {
    // Implementation for Yellow Pages scraping
    // Note: Respect robots.txt and terms of service
    return [];
  }

  private async scrapeBBB(location: string): Promise<BusinessListing[]> {
    // Implementation for BBB directory scraping
    // Note: Use public API if available
    return [];
  }

  private async geocodeLocation(location: string): Promise<string> {
    // Simple geocoding for Here API
    // In production, implement proper geocoding
    return '32.7767,-97.1298'; // Default to Fort Worth area
  }

  async scanMultipleSources(params: { location: string; businessTypes: string[] }): Promise<BusinessListing[]> {
    const { location, businessTypes } = params;
    let allBusinesses: BusinessListing[] = [];

    console.log(`🔍 Scanning multiple sources for businesses in ${location}`);

    for (const businessType of businessTypes) {
      try {
        // OpenStreetMap (always free)
        const osmResults = await this.searchOpenStreetMap(location, businessType);
        allBusinesses.push(...osmResults);

        await this.delay(this.baseDelay);

        // Foursquare (if API key available)
        const foursquareResults = await this.searchFoursquare(location, businessType);
        allBusinesses.push(...foursquareResults);

        await this.delay(this.baseDelay);

        // Yelp (if API key available)
        const yelpResults = await this.searchYelp(location, businessType);
        allBusinesses.push(...yelpResults);

        await this.delay(this.baseDelay);

        console.log(`✅ Found ${osmResults.length + foursquareResults.length + yelpResults.length} businesses for ${businessType}`);
      } catch (error) {
        console.error(`Error scanning ${businessType}:`, error);
      }
    }

    // Deduplicate and return
    const uniqueBusinesses = this.deduplicateBusinesses(allBusinesses);
    console.log(`📊 Total unique businesses found: ${uniqueBusinesses.length}`);
    
    return uniqueBusinesses;
  }

  private deduplicateBusinesses(businesses: BusinessListing[]): BusinessListing[] {
    const seen = new Set();
    return businesses.filter(business => {
      const key = `${business.name.toLowerCase()}_${business.address.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const freeBusinessSources = new FreeBusinessDataSources();