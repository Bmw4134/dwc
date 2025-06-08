// Google My Business API Integration for Fort Worth Market Dominance

export interface BusinessListing {
  placeId: string;
  name: string;
  address: string;
  phone: string;
  website?: string;
  rating: number;
  reviewCount: number;
  businessHours: any;
  businessType: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  lastUpdated: Date;
}

export interface MarketIntelligence {
  totalBusinesses: number;
  averageRating: number;
  competitorGaps: string[];
  opportunityScore: number;
  recommendedActions: string[];
}

export class GoogleBusinessIntelligence {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Scan Fort Worth ZIP 76140 for business opportunities
  async scanFortWorthMarket(): Promise<{
    businesses: BusinessListing[];
    intelligence: MarketIntelligence;
  }> {
    const zipCode = '76140';
    const businessTypes = [
      'restaurant', 'retail_store', 'professional_services', 
      'healthcare', 'automotive', 'real_estate_agency',
      'accounting', 'law_firm', 'construction_company'
    ];

    const allBusinesses: BusinessListing[] = [];
    
    for (const businessType of businessTypes) {
      try {
        const businesses = await this.searchBusinessesByType(zipCode, businessType);
        allBusinesses.push(...businesses);
      } catch (error) {
        console.warn(`Failed to scan ${businessType}:`, error);
      }
    }

    const intelligence = this.analyzeMarketIntelligence(allBusinesses);
    
    return {
      businesses: allBusinesses,
      intelligence
    };
  }

  private async searchBusinessesByType(zipCode: string, businessType: string): Promise<BusinessListing[]> {
    const query = `${businessType} in ${zipCode} Fort Worth Texas`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${this.apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`API Error: ${data.status}`);
    }

    return data.results.map((place: any) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number || 'Not available',
      website: place.website,
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      businessHours: place.opening_hours,
      businessType: businessType,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      lastUpdated: new Date()
    }));
  }

  private analyzeMarketIntelligence(businesses: BusinessListing[]): MarketIntelligence {
    const totalBusinesses = businesses.length;
    const averageRating = businesses.reduce((sum, b) => sum + b.rating, 0) / totalBusinesses;
    
    // Identify automation opportunities
    const lowRatingBusinesses = businesses.filter(b => b.rating < 4.0);
    const noWebsiteBusinesses = businesses.filter(b => !b.website);
    const lowReviewBusinesses = businesses.filter(b => b.reviewCount < 10);
    
    const competitorGaps = [
      `${lowRatingBusinesses.length} businesses with ratings below 4.0`,
      `${noWebsiteBusinesses.length} businesses without websites`,
      `${lowReviewBusinesses.length} businesses with minimal online presence`
    ];

    const opportunityScore = Math.min(95, 
      (lowRatingBusinesses.length * 2) + 
      (noWebsiteBusinesses.length * 3) + 
      (lowReviewBusinesses.length * 1.5)
    );

    const recommendedActions = [
      `Target ${lowRatingBusinesses.length} businesses for reputation management`,
      `Offer website development to ${noWebsiteBusinesses.length} businesses`,
      `Provide review generation services to ${lowReviewBusinesses.length} businesses`,
      `Focus on ${businesses.filter(b => b.businessType === 'professional_services').length} professional service providers`
    ];

    return {
      totalBusinesses,
      averageRating: Math.round(averageRating * 10) / 10,
      competitorGaps,
      opportunityScore: Math.round(opportunityScore),
      recommendedActions
    };
  }

  // Generate qualified leads based on automation opportunities
  async generateQualifiedLeads(businesses: BusinessListing[]): Promise<Array<{
    business: BusinessListing;
    automationOpportunity: string;
    estimatedValue: number;
    priority: 'high' | 'medium' | 'low';
    contactStrategy: string;
  }>> {
    return businesses.map(business => {
      let automationOpportunity = '';
      let estimatedValue = 0;
      let priority: 'high' | 'medium' | 'low' = 'low';
      let contactStrategy = '';

      // High-value opportunities
      if (!business.website && business.rating >= 4.0) {
        automationOpportunity = 'Website + Online Presence Package';
        estimatedValue = 5000;
        priority = 'high';
        contactStrategy = 'Digital presence audit + free consultation';
      }
      // Medium-value opportunities  
      else if (business.rating < 4.0 && business.reviewCount > 5) {
        automationOpportunity = 'Reputation Management + Review Automation';
        estimatedValue = 2500;
        priority = 'medium';
        contactStrategy = 'Reputation analysis + improvement plan';
      }
      // Lower-value but volume opportunities
      else if (business.reviewCount < 10) {
        automationOpportunity = 'Review Generation + Local SEO';
        estimatedValue = 1500;
        priority = 'medium';
        contactStrategy = 'Local SEO audit + review strategy';
      }
      else {
        automationOpportunity = 'Advanced Analytics + Automation';
        estimatedValue = 3000;
        priority = 'low';
        contactStrategy = 'Business intelligence consultation';
      }

      return {
        business,
        automationOpportunity,
        estimatedValue,
        priority,
        contactStrategy
      };
    }).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
}

// Revenue calculation for lender presentation
export function calculateMarketRevenuePotential(leads: any[]): {
  totalPotentialRevenue: number;
  monthlyRecurringRevenue: number;
  breakEvenClients: number;
  marketPenetration: string;
} {
  const totalPotentialRevenue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
  const averageProjectValue = totalPotentialRevenue / leads.length;
  const monthlyRecurringRevenue = Math.round(totalPotentialRevenue * 0.15); // 15% monthly recurring
  const breakEvenClients = Math.ceil(25000 / averageProjectValue); // $25K operation cost
  const marketPenetration = `${Math.min(100, (leads.length / 500) * 100).toFixed(1)}%`;

  return {
    totalPotentialRevenue: Math.round(totalPotentialRevenue),
    monthlyRecurringRevenue,
    breakEvenClients,
    marketPenetration
  };
}