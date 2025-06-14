/**
 * NEXUS Visual Lead Scanner - ES Module Implementation
 * Extracts business lead data from uploaded images using OpenAI Vision API
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

class NexusVisualScanner {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.isInitialized = !!this.apiKey;
        this.processedLeads = new Map();
        
        if (this.isInitialized) {
            console.log('[VISUAL-SCANNER] Nexus Visual Lead Scanner initialized with OpenAI Vision');
        } else {
            console.warn('[VISUAL-SCANNER] OpenAI API key not found - visual scanning disabled');
        }
    }

    async processImage(imageBuffer, filename) {
        try {
            console.log(`[VISUAL-SCANNER] Processing image: ${filename}`);
            
            if (!this.isInitialized) {
                throw new Error('Visual scanner not initialized - missing OpenAI API key');
            }

            // Convert buffer to base64
            const base64Image = imageBuffer.toString('base64');
            
            // Extract text using OpenAI Vision
            const extractedText = await this.extractTextWithOpenAI(base64Image);
            
            // Parse extracted text into lead data
            const leadData = await this.parseLeadData(extractedText, filename);
            
            // Generate final lead object
            const finalLead = {
                id: `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                ...leadData,
                metadata: {
                    imageSource: filename,
                    processingMethod: 'openai-vision',
                    timestamp: new Date().toISOString(),
                    imageSize: this.estimateImageSize(imageBuffer)
                }
            };

            // Store processed lead
            this.processedLeads.set(finalLead.id, finalLead);
            
            console.log(`[VISUAL-SCANNER] Lead extracted: ${finalLead.companyName}`);
            return finalLead;

        } catch (error) {
            console.error('[VISUAL-SCANNER] Error processing image:', error.message);
            throw error;
        }
    }

    async extractTextWithOpenAI(base64Image) {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Analyze this business image and extract all visible information. Focus on:
                                1. Company/Business name
                                2. Website URLs or domain names
                                3. Phone numbers
                                4. Email addresses
                                5. Social media handles (@username, facebook.com/page, etc.)
                                6. Industry keywords or services offered
                                7. Address or location information
                                
                                Return the extracted text exactly as it appears, line by line.`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000,
                temperature: 0.1
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const extractedText = response.data.choices[0].message.content || '';
            console.log('[VISUAL-SCANNER] OpenAI Vision extracted text successfully');
            return extractedText;

        } catch (error) {
            console.error('[VISUAL-SCANNER] OpenAI Vision API error:', error.response?.data || error.message);
            throw new Error('Failed to extract text from image');
        }
    }

    async parseLeadData(extractedText, filename) {
        // Extract company name
        const companyName = this.extractCompanyName(extractedText);
        
        // Extract contact information
        const website = this.extractWebsite(extractedText);
        const phone = this.extractPhone(extractedText);
        const email = this.extractEmail(extractedText);
        const socialHandles = this.extractSocialHandles(extractedText);
        
        // Extract industry keywords
        const keywords = this.extractKeywords(extractedText);
        const industry = this.inferIndustry(keywords);
        
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
            extractedText,
            confidenceScore,
            location: this.inferLocationFromText(extractedText)
        };
    }

    extractCompanyName(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        
        // Look for common business indicators
        const businessIndicators = /\b(LLC|Inc|Corp|Company|Co\.|Ltd|Limited|Group|Services|Solutions|Enterprise|Business|Trucking|Transport|Logistics|Restaurant|Cafe|Store|Shop|Market)\b/i;
        
        for (const line of lines) {
            if (businessIndicators.test(line) && line.length < 80 && line.length > 3) {
                return line;
            }
        }
        
        // Look for lines that appear to be business names (capitalized, reasonable length)
        for (const line of lines) {
            if (line.length > 3 && line.length < 60 && 
                /^[A-Z]/.test(line) && 
                !/^\d+$/.test(line) && 
                !/^(www\.|http|@)/.test(line.toLowerCase())) {
                return line;
            }
        }
        
        return 'Unknown Business';
    }

    extractWebsite(text) {
        // Enhanced website regex
        const websiteRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|org|net|edu|gov|co|io|ly|me|biz|info|us|ca))\b/gi;
        const matches = text.match(websiteRegex);
        
        if (matches && matches.length > 0) {
            let website = matches[0].toLowerCase().trim();
            if (!website.startsWith('http')) {
                website = 'https://' + website;
            }
            return website;
        }
        
        return undefined;
    }

    extractPhone(text) {
        // Multiple phone number patterns
        const phonePatterns = [
            /(\+?1?[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g,
            /(\d{3}[-.\s]\d{3}[-.\s]\d{4})/g,
            /(\(\d{3}\)\s?\d{3}-\d{4})/g
        ];
        
        for (const pattern of phonePatterns) {
            const matches = text.match(pattern);
            if (matches) {
                return matches[0].trim();
            }
        }
        
        return undefined;
    }

    extractEmail(text) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = text.match(emailRegex);
        return matches ? matches[0].toLowerCase() : undefined;
    }

    extractSocialHandles(text) {
        const handles = [];
        
        // Instagram handles
        const instagramRegex = /@([a-zA-Z0-9_.]+)/g;
        let match;
        while ((match = instagramRegex.exec(text)) !== null) {
            handles.push(`instagram.com/${match[1]}`);
        }
        
        // Facebook pages
        const facebookRegex = /facebook\.com\/([a-zA-Z0-9.]+)/gi;
        while ((match = facebookRegex.exec(text)) !== null) {
            handles.push(match[0]);
        }
        
        // Twitter/X handles
        const twitterRegex = /(?:twitter|x)\.com\/([a-zA-Z0-9_]+)/gi;
        while ((match = twitterRegex.exec(text)) !== null) {
            handles.push(match[0]);
        }
        
        return [...new Set(handles)]; // Remove duplicates
    }

    extractKeywords(text) {
        const businessKeywords = [
            'truck', 'trucking', 'logistics', 'transport', 'shipping', 'freight', 'delivery',
            'restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger', 'kitchen',
            'retail', 'store', 'shop', 'market', 'boutique', 'outlet',
            'service', 'repair', 'maintenance', 'installation', 'cleaning',
            'construction', 'contractor', 'builder', 'roofing', 'plumbing',
            'medical', 'dental', 'health', 'clinic', 'pharmacy', 'doctor',
            'automotive', 'auto', 'car', 'mechanic', 'garage', 'tires',
            'real estate', 'property', 'realty', 'homes', 'realtor',
            'legal', 'law', 'attorney', 'lawyer', 'firm',
            'insurance', 'finance', 'bank', 'credit', 'loan',
            'salon', 'beauty', 'spa', 'barber', 'nails',
            'fitness', 'gym', 'training', 'sports', 'yoga'
        ];
        
        const foundKeywords = [];
        const lowerText = text.toLowerCase();
        
        businessKeywords.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                foundKeywords.push(keyword);
            }
        });
        
        return [...new Set(foundKeywords)];
    }

    inferIndustry(keywords) {
        const industryMap = {
            'Transportation & Logistics': ['truck', 'trucking', 'logistics', 'transport', 'shipping', 'freight', 'delivery'],
            'Food & Beverage': ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'burger', 'kitchen'],
            'Retail': ['retail', 'store', 'shop', 'market', 'boutique', 'outlet'],
            'Professional Services': ['service', 'repair', 'maintenance', 'installation', 'cleaning'],
            'Construction': ['construction', 'contractor', 'builder', 'roofing', 'plumbing'],
            'Healthcare': ['medical', 'dental', 'health', 'clinic', 'pharmacy', 'doctor'],
            'Automotive': ['automotive', 'auto', 'car', 'mechanic', 'garage', 'tires'],
            'Real Estate': ['real estate', 'property', 'realty', 'homes', 'realtor'],
            'Legal Services': ['legal', 'law', 'attorney', 'lawyer', 'firm'],
            'Financial Services': ['insurance', 'finance', 'bank', 'credit', 'loan'],
            'Beauty & Wellness': ['salon', 'beauty', 'spa', 'barber', 'nails'],
            'Fitness & Recreation': ['fitness', 'gym', 'training', 'sports', 'yoga']
        };
        
        for (const [industry, industryKeywords] of Object.entries(industryMap)) {
            if (industryKeywords.some(keyword => keywords.includes(keyword))) {
                return industry;
            }
        }
        
        return 'General Business';
    }

    calculateConfidenceScore(data) {
        let score = 0;
        
        if (data.companyName && data.companyName !== 'Unknown Business') score += 25;
        if (data.website) score += 25;
        if (data.phone) score += 20;
        if (data.email) score += 15;
        if (data.socialHandles.length > 0) score += 10;
        if (data.keywords.length > 0) score += 5;
        
        return Math.min(score, 100);
    }

    inferLocationFromText(text) {
        // Look for US states and major cities
        const locations = [
            'California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania',
            'Los Angeles', 'New York City', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
            'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
            'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle'
        ];
        
        const lowerText = text.toLowerCase();
        for (const location of locations) {
            if (lowerText.includes(location.toLowerCase())) {
                return { city: location };
            }
        }
        
        return undefined;
    }

    estimateImageSize(buffer) {
        // Basic buffer size estimation
        return {
            width: 0,
            height: 0,
            fileSize: buffer.length
        };
    }

    getAllProcessedLeads() {
        return Array.from(this.processedLeads.values());
    }

    getProcessedLead(id) {
        return this.processedLeads.get(id);
    }

    injectLeadIntoQNIS(lead) {
        try {
            // Create QNIS-compatible lead object
            const qnisLead = {
                id: lead.id,
                name: lead.companyName,
                company: lead.companyName,
                industry: lead.industry,
                phone: lead.phone,
                email: lead.email,
                website: lead.website,
                city: lead.location?.city || 'Unknown',
                status: 'High Priority',
                source: 'Visual OCR Ingestion',
                qnisScore: Math.max(lead.confidenceScore, 75), // Ensure high priority
                lastContact: new Date().toISOString(),
                notes: `Extracted from image: ${lead.metadata.imageSource}`,
                extractedText: lead.extractedText,
                socialHandles: lead.socialHandles,
                keywords: lead.keywords
            };

            // Add to global QNIS engine if available
            if (global.qnisEngine && typeof global.qnisEngine.addLead === 'function') {
                global.qnisEngine.addLead(qnisLead);
                console.log(`[VISUAL-SCANNER] Lead injected into QNIS: ${lead.companyName}`);
                return true;
            }

            console.warn('[VISUAL-SCANNER] QNIS engine not available for lead injection');
            return false;

        } catch (error) {
            console.error('[VISUAL-SCANNER] Error injecting lead into QNIS:', error);
            return false;
        }
    }
}

// Export singleton instance
const visualScanner = new NexusVisualScanner();
export { NexusVisualScanner, visualScanner };