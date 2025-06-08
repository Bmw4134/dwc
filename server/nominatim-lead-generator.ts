/**
 * Free Lead Generation using OpenStreetMap Nominatim API
 * No API key required - completely free alternative to Google Places
 */

export interface NominatimBusiness {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  shop?: string;
  amenity?: string;
  office?: string;
  tourism?: string;
}

export interface Lead {
  businessName: string;
  address: string;
  industry: string;
  zipCode: string;
  phoneNumber?: string;
  website?: string;
  employeeCount?: number;
  estimatedRevenue?: number;
  priority: string;
  status: string;
  source: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export class NominatimLeadGenerator {
  private baseUrl = 'https://nominatim.openstreetmap.org/search';
  private rateLimitDelay = 1000; // 1 second between requests (Nominatim requirement)

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async searchBusinessesByZipCode(zipCode: string, businessTypes: string[] = []): Promise<Lead[]> {
    const leads: Lead[] = [];
    
    // Default business types if none specified
    const defaultTypes = [
      'shop=*',
      'office=*',
      'amenity=restaurant',
      'amenity=cafe',
      'amenity=bar',
      'amenity=bank',
      'amenity=pharmacy',
      'amenity=hospital',
      'amenity=dentist',
      'amenity=veterinary',
      'tourism=hotel',
      'craft=*'
    ];

    const searchTypes = businessTypes.length > 0 ? businessTypes : defaultTypes;

    for (const businessType of searchTypes) {
      try {
        await this.delay(this.rateLimitDelay);
        
        const params = new URLSearchParams({
          format: 'json',
          addressdetails: '1',
          limit: '50',
          countrycodes: 'us',
          postalcode: zipCode,
          q: businessType
        });

        const response = await fetch(`${this.baseUrl}?${params}`, {
          headers: {
            'User-Agent': 'DWC-Systems-Lead-Generator/1.0'
          }
        });

        if (!response.ok) {
          console.warn(`Nominatim API error: ${response.status}`);
          continue;
        }

        const businesses: NominatimBusiness[] = await response.json();
        
        for (const business of businesses) {
          const lead = this.convertToLead(business, zipCode);
          if (lead && !leads.find(l => l.businessName === lead.businessName)) {
            leads.push(lead);
          }
        }
      } catch (error) {
        console.error(`Error searching for ${businessType}:`, error);
      }
    }

    return leads;
  }

  async searchBusinessesByCity(city: string, state: string): Promise<Lead[]> {
    const leads: Lead[] = [];
    
    const businessTypes = [
      'shop=*',
      'office=*',
      'amenity=restaurant',
      'amenity=cafe',
      'amenity=bank',
      'craft=*'
    ];

    for (const businessType of businessTypes) {
      try {
        await this.delay(this.rateLimitDelay);
        
        const params = new URLSearchParams({
          format: 'json',
          addressdetails: '1',
          limit: '30',
          countrycodes: 'us',
          city: city,
          state: state,
          q: businessType
        });

        const response = await fetch(`${this.baseUrl}?${params}`, {
          headers: {
            'User-Agent': 'DWC-Systems-Lead-Generator/1.0'
          }
        });

        if (!response.ok) continue;

        const businesses: NominatimBusiness[] = await response.json();
        
        for (const business of businesses) {
          const zipCode = business.address?.postcode || '';
          const lead = this.convertToLead(business, zipCode);
          if (lead && !leads.find(l => l.businessName === lead.businessName)) {
            leads.push(lead);
          }
        }
      } catch (error) {
        console.error(`Error searching ${city}, ${state}:`, error);
      }
    }

    return leads;
  }

  private convertToLead(business: NominatimBusiness, zipCode: string): Lead | null {
    const businessName = this.extractBusinessName(business);
    if (!businessName) return null;

    const address = this.formatAddress(business);
    const industry = this.determineIndustry(business);
    
    return {
      businessName,
      address,
      industry,
      zipCode: business.address?.postcode || zipCode,
      priority: this.calculatePriority(business),
      status: 'new',
      source: 'nominatim',
      coordinates: {
        lat: parseFloat(business.lat),
        lon: parseFloat(business.lon)
      },
      estimatedRevenue: this.estimateRevenue(business)
    };
  }

  private extractBusinessName(business: NominatimBusiness): string {
    // Try to extract a clean business name from display_name
    const parts = business.display_name.split(',');
    let name = parts[0].trim();
    
    // Remove common prefixes that aren't business names
    const nonBusinessPrefixes = ['unnamed', 'untitled', 'building', 'address'];
    if (nonBusinessPrefixes.some(prefix => name.toLowerCase().includes(prefix))) {
      return '';
    }

    // Clean up the name
    name = name.replace(/^\d+\s+/, ''); // Remove leading numbers
    name = name.replace(/\s+/g, ' ').trim();
    
    return name.length > 2 ? name : '';
  }

  private formatAddress(business: NominatimBusiness): string {
    const addr = business.address;
    if (!addr) return business.display_name;

    const parts = [
      addr.house_number,
      addr.road,
      addr.city,
      addr.state,
      addr.postcode
    ].filter(Boolean);

    return parts.join(', ');
  }

  private determineIndustry(business: NominatimBusiness): string {
    // Map Nominatim categories to industries
    const industryMap: Record<string, string> = {
      'restaurant': 'Food Service',
      'cafe': 'Food Service',
      'bar': 'Food Service',
      'bank': 'Financial Services',
      'pharmacy': 'Healthcare',
      'hospital': 'Healthcare',
      'dentist': 'Healthcare',
      'veterinary': 'Healthcare',
      'hotel': 'Hospitality',
      'shop': 'Retail',
      'office': 'Professional Services',
      'craft': 'Manufacturing'
    };

    // Check amenity first
    if (business.amenity && industryMap[business.amenity]) {
      return industryMap[business.amenity];
    }

    // Check shop type
    if (business.shop) {
      return 'Retail';
    }

    // Check office type
    if (business.office) {
      return 'Professional Services';
    }

    // Check tourism
    if (business.tourism && industryMap[business.tourism]) {
      return industryMap[business.tourism];
    }

    // Default based on class
    if (business.class === 'shop') return 'Retail';
    if (business.class === 'amenity') return 'Services';
    if (business.class === 'office') return 'Professional Services';

    return 'Other';
  }

  private calculatePriority(business: NominatimBusiness): string {
    // Higher priority for certain business types
    const highPriorityTypes = ['bank', 'office', 'hospital', 'hotel'];
    const mediumPriorityTypes = ['restaurant', 'cafe', 'pharmacy', 'shop'];

    if (business.amenity && highPriorityTypes.includes(business.amenity)) {
      return 'high';
    }

    if (business.amenity && mediumPriorityTypes.includes(business.amenity)) {
      return 'medium';
    }

    if (business.office || business.class === 'office') {
      return 'high';
    }

    return 'low';
  }

  private estimateRevenue(business: NominatimBusiness): number {
    // Rough revenue estimates based on business type
    const revenueEstimates: Record<string, number> = {
      'bank': 2000000,
      'hospital': 5000000,
      'hotel': 1500000,
      'restaurant': 800000,
      'office': 1200000,
      'pharmacy': 600000,
      'cafe': 300000,
      'shop': 400000
    };

    if (business.amenity && revenueEstimates[business.amenity]) {
      return revenueEstimates[business.amenity];
    }

    if (business.office) return 1200000;
    if (business.shop) return 400000;

    return 250000; // Default estimate
  }

  async getBusinessDetails(placeId: string): Promise<any> {
    try {
      await this.delay(this.rateLimitDelay);
      
      const params = new URLSearchParams({
        format: 'json',
        addressdetails: '1',
        extratags: '1',
        namedetails: '1',
        place_id: placeId
      });

      const response = await fetch(`https://nominatim.openstreetmap.org/details?${params}`, {
        headers: {
          'User-Agent': 'DWC-Systems-Lead-Generator/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching business details:', error);
      return null;
    }
  }
}

export const nominatimLeadGenerator = new NominatimLeadGenerator();