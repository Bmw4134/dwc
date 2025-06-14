/**
 * NEXUS Visual Lead Scanner - Advanced OCR Pipeline
 * Extracts business lead data from uploaded images using OpenAI Vision + Tesseract.js
 */

import OpenAI from 'openai';
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';
import ExifReader from 'exifreader';
import axios from 'axios';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface ExtractedLead {
  id: string;
  companyName: string;
  website?: string;
  socialHandles: string[];
  phone?: string;
  email?: string;
  industry?: string;
  keywords: string[];
  extractedText: string;
  confidenceScore: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
  };
  metadata: {
    imageSource: string;
    processingMethod: 'openai' | 'tesseract' | 'hybrid';
    timestamp: string;
    imageSize: { width: number; height: number };
    gpsData?: any;
  };
}

export class NexusVisualLeadScanner {
  private tesseractWorker: any;
  private isInitialized = false;

  constructor() {
    this.initializeScanner();
  }

  async initializeScanner() {
    try {
      // Initialize Tesseract worker
      this.tesseractWorker = await createWorker('eng');
      this.isInitialized = true;
      console.log('[VISUAL-SCANNER] Nexus Visual Lead Scanner initialized');
    } catch (error) {
      console.error('[VISUAL-SCANNER] Failed to initialize Tesseract:', error);
    }
  }

  async processImage(imageBuffer: Buffer, filename: string): Promise<ExtractedLead> {
    try {
      console.log(`[VISUAL-SCANNER] Processing image: ${filename}`);
      
      // Extract image metadata and GPS data
      const metadata = await this.extractImageMetadata(imageBuffer);
      
      // Optimize image for OCR
      const optimizedImage = await this.optimizeImageForOCR(imageBuffer);
      
      // Run dual OCR processing
      const ocrResults = await this.runDualOCR(optimizedImage);
      
      // Extract lead data from OCR text
      const leadData = await this.extractLeadData(ocrResults, metadata);
      
      // Enrich lead with external data
      const enrichedLead = await this.enrichLeadData(leadData);
      
      // Generate final lead object
      const finalLead: ExtractedLead = {
        id: `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...enrichedLead,
        metadata: {
          imageSource: filename,
          processingMethod: ocrResults.method,
          timestamp: new Date().toISOString(),
          imageSize: metadata.imageSize,
          gpsData: metadata.gpsData
        }
      };

      console.log(`[VISUAL-SCANNER] Lead extracted: ${finalLead.companyName}`);
      return finalLead;

    } catch (error) {
      console.error('[VISUAL-SCANNER] Error processing image:', error);
      throw error;
    }
  }

  private async extractImageMetadata(imageBuffer: Buffer) {
    try {
      // Get image dimensions
      const imageInfo = await sharp(imageBuffer).metadata();
      
      // Extract EXIF data including GPS
      const exifData = ExifReader.load(imageBuffer);
      
      const gpsData = this.parseGPSData(exifData);
      
      return {
        imageSize: {
          width: imageInfo.width || 0,
          height: imageInfo.height || 0
        },
        gpsData: gpsData,
        exifData: exifData
      };
    } catch (error) {
      console.error('[VISUAL-SCANNER] Error extracting metadata:', error);
      return {
        imageSize: { width: 0, height: 0 },
        gpsData: null,
        exifData: null
      };
    }
  }

  private parseGPSData(exifData: any) {
    try {
      if (exifData.gps && exifData.gps.GPSLatitude && exifData.gps.GPSLongitude) {
        const lat = this.convertDMSToDD(
          exifData.gps.GPSLatitude.description,
          exifData.gps.GPSLatitudeRef.value[0]
        );
        const lng = this.convertDMSToDD(
          exifData.gps.GPSLongitude.description,
          exifData.gps.GPSLongitudeRef.value[0]
        );
        return { lat, lng };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private convertDMSToDD(dms: string, ref: string): number {
    const parts = dms.split(' ');
    const degrees = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    
    let dd = degrees + minutes/60 + seconds/3600;
    if (ref === 'S' || ref === 'W') dd = dd * -1;
    
    return dd;
  }

  private async optimizeImageForOCR(imageBuffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(imageBuffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .sharpen()
        .normalize()
        .png()
        .toBuffer();
    } catch (error) {
      console.error('[VISUAL-SCANNER] Error optimizing image:', error);
      return imageBuffer;
    }
  }

  private async runDualOCR(imageBuffer: Buffer) {
    const results = {
      openaiText: '',
      tesseractText: '',
      combinedText: '',
      method: 'hybrid' as 'openai' | 'tesseract' | 'hybrid'
    };

    try {
      // OpenAI Vision API
      if (process.env.OPENAI_API_KEY) {
        const base64Image = imageBuffer.toString('base64');
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all visible text from this image. Focus on business names, websites, phone numbers, social media handles, and any other contact information. Return the raw text exactly as it appears."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        });
        
        results.openaiText = response.choices[0].message.content || '';
        console.log('[VISUAL-SCANNER] OpenAI Vision extracted text');
      }
    } catch (error) {
      console.error('[VISUAL-SCANNER] OpenAI Vision error:', error);
    }

    try {
      // Tesseract.js OCR
      if (this.isInitialized && this.tesseractWorker) {
        const { data: { text } } = await this.tesseractWorker.recognize(imageBuffer);
        results.tesseractText = text;
        console.log('[VISUAL-SCANNER] Tesseract extracted text');
      }
    } catch (error) {
      console.error('[VISUAL-SCANNER] Tesseract error:', error);
    }

    // Combine and deduplicate results
    results.combinedText = this.combineOCRResults(results.openaiText, results.tesseractText);
    
    // Determine best method
    if (results.openaiText && results.tesseractText) {
      results.method = 'hybrid';
    } else if (results.openaiText) {
      results.method = 'openai';
    } else if (results.tesseractText) {
      results.method = 'tesseract';
    }

    return results;
  }

  private combineOCRResults(openaiText: string, tesseractText: string): string {
    const combined = new Set<string>();
    
    // Add OpenAI results
    openaiText.split('\n').forEach(line => {
      if (line.trim()) combined.add(line.trim());
    });
    
    // Add Tesseract results
    tesseractText.split('\n').forEach(line => {
      if (line.trim()) combined.add(line.trim());
    });
    
    return Array.from(combined).join('\n');
  }

  private async extractLeadData(ocrResults: any, metadata: any) {
    const text = ocrResults.combinedText;
    
    // Extract company name
    const companyName = this.extractCompanyName(text);
    
    // Extract contact information
    const website = this.extractWebsite(text);
    const phone = this.extractPhone(text);
    const email = this.extractEmail(text);
    const socialHandles = this.extractSocialHandles(text);
    
    // Extract industry keywords
    const keywords = this.extractKeywords(text);
    const industry = this.inferIndustry(text, keywords);
    
    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore({
      companyName,
      website,
      phone,
      email,
      socialHandles,
      keywords
    });

    return {
      companyName,
      website,
      phone,
      email,
      socialHandles,
      keywords,
      industry,
      extractedText: text,
      confidenceScore,
      location: metadata.gpsData ? await this.reverseGeocode(metadata.gpsData) : undefined
    };
  }

  private extractCompanyName(text: string): string {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Look for common business indicators
    const businessIndicators = /\b(LLC|Inc|Corp|Company|Co\.|Ltd|Limited|Group|Services|Solutions|Enterprise|Business)\b/i;
    
    for (const line of lines) {
      if (businessIndicators.test(line) && line.length < 60) {
        return line.trim();
      }
    }
    
    // Fallback to first substantial line
    for (const line of lines) {
      if (line.length > 3 && line.length < 60 && !/^\d+$/.test(line)) {
        return line.trim();
      }
    }
    
    return 'Unknown Business';
  }

  private extractWebsite(text: string): string | undefined {
    const websiteRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|org|net|edu|gov|co|io|ly|me|biz|info))/gi;
    const matches = text.match(websiteRegex);
    
    if (matches && matches.length > 0) {
      let website = matches[0].toLowerCase();
      if (!website.startsWith('http')) {
        website = 'https://' + website;
      }
      return website;
    }
    
    return undefined;
  }

  private extractPhone(text: string): string | undefined {
    const phoneRegex = /(\+?1?[-.\s]?)?(\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/g;
    const matches = text.match(phoneRegex);
    return matches ? matches[0].trim() : undefined;
  }

  private extractEmail(text: string): string | undefined {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex);
    return matches ? matches[0].toLowerCase() : undefined;
  }

  private extractSocialHandles(text: string): string[] {
    const handles: string[] = [];
    
    // Instagram handles
    const instagramRegex = /@([a-zA-Z0-9_.]+)/g;
    const instagramMatches = text.match(instagramRegex);
    if (instagramMatches) {
      handles.push(...instagramMatches.map(handle => `instagram.com/${handle.substring(1)}`));
    }
    
    // Facebook pages
    const facebookRegex = /facebook\.com\/([a-zA-Z0-9.]+)/gi;
    const facebookMatches = text.match(facebookRegex);
    if (facebookMatches) {
      handles.push(...facebookMatches);
    }
    
    // Twitter handles
    const twitterRegex = /twitter\.com\/([a-zA-Z0-9_]+)/gi;
    const twitterMatches = text.match(twitterRegex);
    if (twitterMatches) {
      handles.push(...twitterMatches);
    }
    
    return handles;
  }

  private extractKeywords(text: string): string[] {
    const businessKeywords = [
      'truck', 'trucking', 'logistics', 'transport', 'shipping', 'freight',
      'restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger',
      'retail', 'store', 'shop', 'market', 'boutique',
      'service', 'repair', 'maintenance', 'installation',
      'construction', 'contractor', 'builder', 'roofing',
      'medical', 'dental', 'health', 'clinic', 'pharmacy',
      'automotive', 'auto', 'car', 'mechanic', 'garage',
      'real estate', 'property', 'realty', 'homes',
      'legal', 'law', 'attorney', 'lawyer'
    ];
    
    const foundKeywords: string[] = [];
    const lowerText = text.toLowerCase();
    
    businessKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });
    
    return foundKeywords;
  }

  private inferIndustry(text: string, keywords: string[]): string {
    const industryMap: { [key: string]: string[] } = {
      'Transportation & Logistics': ['truck', 'trucking', 'logistics', 'transport', 'shipping', 'freight'],
      'Food & Beverage': ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger'],
      'Retail': ['retail', 'store', 'shop', 'market', 'boutique'],
      'Professional Services': ['service', 'repair', 'maintenance', 'installation'],
      'Construction': ['construction', 'contractor', 'builder', 'roofing'],
      'Healthcare': ['medical', 'dental', 'health', 'clinic', 'pharmacy'],
      'Automotive': ['automotive', 'auto', 'car', 'mechanic', 'garage'],
      'Real Estate': ['real estate', 'property', 'realty', 'homes'],
      'Legal Services': ['legal', 'law', 'attorney', 'lawyer']
    };
    
    for (const [industry, industryKeywords] of Object.entries(industryMap)) {
      if (industryKeywords.some(keyword => keywords.includes(keyword))) {
        return industry;
      }
    }
    
    return 'General Business';
  }

  private calculateConfidenceScore(data: any): number {
    let score = 0;
    
    if (data.companyName && data.companyName !== 'Unknown Business') score += 30;
    if (data.website) score += 25;
    if (data.phone) score += 20;
    if (data.email) score += 15;
    if (data.socialHandles.length > 0) score += 10;
    
    return Math.min(score, 100);
  }

  private async reverseGeocode(gpsData: { lat: number; lng: number }) {
    try {
      // Use OpenStreetMap Nominatim for reverse geocoding
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gpsData.lat}&lon=${gpsData.lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'DWC-NEXUS-Visual-Scanner/1.0'
          }
        }
      );
      
      const data = response.data;
      return {
        lat: gpsData.lat,
        lng: gpsData.lng,
        address: data.display_name,
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state
      };
    } catch (error) {
      console.error('[VISUAL-SCANNER] Reverse geocoding error:', error);
      return {
        lat: gpsData.lat,
        lng: gpsData.lng
      };
    }
  }

  private async enrichLeadData(leadData: any): Promise<any> {
    try {
      // If we have a company name, try to enrich with additional data
      if (leadData.companyName && leadData.companyName !== 'Unknown Business') {
        // This would integrate with Google Places API, Clearbit, etc.
        // For now, return the base data
        console.log(`[VISUAL-SCANNER] Enriching lead data for: ${leadData.companyName}`);
      }
      
      return leadData;
    } catch (error) {
      console.error('[VISUAL-SCANNER] Error enriching lead data:', error);
      return leadData;
    }
  }

  async cleanup() {
    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate();
    }
  }
}

// Export singleton instance
export const visualLeadScanner = new NexusVisualLeadScanner();