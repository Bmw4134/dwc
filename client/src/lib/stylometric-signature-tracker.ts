/**
 * Stylometric Signature Tracker
 * Invisible watermarking and IP protection for remix economy
 */

export interface StylemetricSignature {
  id: string;
  ghostId: string;
  authorId: string;
  timestamp: Date;
  originalTrackId: string;
  remixChain: string[];
  licenseType: 'original' | 'remix' | 'derivative' | 'commercial';
  watermarkPattern: string;
  ipTags: string[];
  verificationHash: string;
}

export interface RemixChainLink {
  stepId: string;
  authorId: string;
  transformationType: string;
  timestamp: Date;
  sourceSignature: string;
  confidence: number;
}

export interface LicenseMetadata {
  originalAuthor: string;
  remixRights: 'allowed' | 'restricted' | 'commercial_only';
  attribution: string;
  royaltyShare: number;
  expirationDate?: Date;
}

export class StylemetricSignatureTracker {
  private signatures: Map<string, StylemetricSignature> = new Map();
  private watermarkPatterns: Map<string, string> = new Map();
  private ipRegistry: Map<string, LicenseMetadata> = new Map();

  constructor() {
    this.initializeWatermarkPatterns();
  }

  private initializeWatermarkPatterns() {
    // Invisible Unicode watermark patterns
    this.watermarkPatterns.set('zero_width_space', '\u200B');
    this.watermarkPatterns.set('zero_width_joiner', '\u200D');
    this.watermarkPatterns.set('zero_width_non_joiner', '\u200C');
    this.watermarkPatterns.set('soft_hyphen', '\u00AD');
    this.watermarkPatterns.set('word_joiner', '\u2060');
  }

  generateGhostId(authorId: string, trackContent: string): string {
    // Create unique ghost ID based on content and author
    const contentHash = this.hashContent(trackContent);
    const timestamp = Date.now().toString(36);
    const randomSalt = Math.random().toString(36).substr(2, 8);
    
    return `ghost_${authorId}_${contentHash}_${timestamp}_${randomSalt}`;
  }

  private hashContent(content: string): string {
    // Simple hash function for content fingerprinting
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  embedWatermark(lyrics: string, signature: StylemetricSignature): string {
    const ghostId = signature.ghostId;
    const watermarkData = this.encodeGhostId(ghostId);
    
    // Insert invisible watermark at strategic positions
    const lines = lyrics.split('\n');
    let watermarkedLyrics = '';
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        // Insert watermark at beginning of verses and hooks
        if (line.startsWith('[') || index === 0) {
          watermarkedLyrics += watermarkData.substr(0, 3) + line + '\n';
        } else {
          // Distribute remaining watermark through the lyrics
          const wordCount = line.split(' ').length;
          const watermarkChunk = watermarkData.substr((index * 2) % watermarkData.length, 2);
          const midPoint = Math.floor(wordCount / 2);
          const words = line.split(' ');
          
          words.splice(midPoint, 0, watermarkChunk);
          watermarkedLyrics += words.join(' ') + '\n';
        }
      } else {
        watermarkedLyrics += line + '\n';
      }
    });

    return watermarkedLyrics;
  }

  private encodeGhostId(ghostId: string): string {
    // Convert ghost ID to invisible Unicode sequence
    const encoded = ghostId.split('').map((char, index) => {
      const charCode = char.charCodeAt(0);
      const patternKeys = Array.from(this.watermarkPatterns.keys());
      const patternKey = patternKeys[charCode % patternKeys.length];
      return this.watermarkPatterns.get(patternKey) || '';
    }).join('');
    
    return encoded;
  }

  extractWatermark(watermarkedLyrics: string): string | null {
    try {
      // Extract invisible Unicode characters
      const invisibleChars = watermarkedLyrics.match(/[\u200B\u200C\u200D\u00AD\u2060]/g);
      
      if (!invisibleChars) return null;
      
      // Decode ghost ID from invisible characters
      const decodedChars = invisibleChars.map(char => {
        for (const [key, pattern] of this.watermarkPatterns.entries()) {
          if (pattern === char) {
            return key.charAt(0);
          }
        }
        return '';
      }).join('');
      
      return decodedChars || null;
    } catch (error) {
      console.error('Watermark extraction failed:', error);
      return null;
    }
  }

  createSignature(
    authorId: string,
    trackContent: string,
    remixChain: string[] = [],
    licenseType: StylemetricSignature['licenseType'] = 'original'
  ): StylemetricSignature {
    const ghostId = this.generateGhostId(authorId, trackContent);
    const verificationHash = this.generateVerificationHash(ghostId, trackContent, authorId);
    
    const signature: StylemetricSignature = {
      id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ghostId,
      authorId,
      timestamp: new Date(),
      originalTrackId: remixChain.length > 0 ? remixChain[0] : ghostId,
      remixChain,
      licenseType,
      watermarkPattern: this.encodeGhostId(ghostId),
      ipTags: [authorId, `created_${new Date().toISOString().split('T')[0]}`],
      verificationHash
    };

    this.signatures.set(signature.id, signature);
    return signature;
  }

  private generateVerificationHash(ghostId: string, content: string, authorId: string): string {
    const combined = `${ghostId}:${content}:${authorId}:${Date.now()}`;
    return this.hashContent(combined);
  }

  verifyAuthorship(lyrics: string, claimedAuthorId: string): {
    verified: boolean;
    confidence: number;
    originalAuthor?: string;
    signature?: StylemetricSignature;
  } {
    const extractedWatermark = this.extractWatermark(lyrics);
    
    if (!extractedWatermark) {
      return { verified: false, confidence: 0 };
    }

    // Find matching signature
    const matchingSignature = Array.from(this.signatures.values()).find(sig => 
      extractedWatermark.includes(sig.ghostId.substr(6, 10)) // Partial match for robustness
    );

    if (!matchingSignature) {
      return { verified: false, confidence: 0.3 };
    }

    const verified = matchingSignature.authorId === claimedAuthorId;
    const confidence = verified ? 0.95 : 0.85; // High confidence for matches

    return {
      verified,
      confidence,
      originalAuthor: matchingSignature.authorId,
      signature: matchingSignature
    };
  }

  buildRemixChain(currentSignature: StylemetricSignature): RemixChainLink[] {
    const chain: RemixChainLink[] = [];
    let currentId = currentSignature.originalTrackId;
    
    // Build chain from original to current
    while (currentId) {
      const signature = Array.from(this.signatures.values()).find(sig => 
        sig.ghostId === currentId || sig.id === currentId
      );
      
      if (signature) {
        chain.push({
          stepId: signature.id,
          authorId: signature.authorId,
          transformationType: signature.licenseType,
          timestamp: signature.timestamp,
          sourceSignature: signature.ghostId,
          confidence: 0.9
        });
        
        // Move to parent in remix chain
        currentId = signature.remixChain.length > 0 ? signature.remixChain[0] : null;
      } else {
        break;
      }
    }

    return chain.reverse(); // Chronological order
  }

  registerLicense(
    signatureId: string,
    licenseData: LicenseMetadata
  ): void {
    this.ipRegistry.set(signatureId, licenseData);
  }

  checkLicenseCompliance(
    originalSignatureId: string,
    remixType: 'commercial' | 'personal' | 'derivative'
  ): {
    compliant: boolean;
    restrictions: string[];
    royaltyRequired: boolean;
    royaltyShare?: number;
  } {
    const license = this.ipRegistry.get(originalSignatureId);
    
    if (!license) {
      return {
        compliant: false,
        restrictions: ['No license found'],
        royaltyRequired: false
      };
    }

    const restrictions: string[] = [];
    let compliant = true;
    let royaltyRequired = false;

    // Check remix rights
    if (license.remixRights === 'restricted' && remixType !== 'personal') {
      compliant = false;
      restrictions.push('Remix not permitted for this license type');
    }

    if (license.remixRights === 'commercial_only' && remixType !== 'commercial') {
      compliant = false;
      restrictions.push('Only commercial remixes permitted');
    }

    // Check expiration
    if (license.expirationDate && new Date() > license.expirationDate) {
      compliant = false;
      restrictions.push('License has expired');
    }

    // Check royalty requirements
    if (license.royaltyShare > 0 && remixType === 'commercial') {
      royaltyRequired = true;
    }

    return {
      compliant,
      restrictions,
      royaltyRequired,
      royaltyShare: royaltyRequired ? license.royaltyShare : undefined
    };
  }

  generateIPReport(signatureId: string): {
    signature: StylemetricSignature;
    remixChain: RemixChainLink[];
    licenseStatus: any;
    verificationStatus: string;
  } | null {
    const signature = this.signatures.get(signatureId);
    if (!signature) return null;

    const remixChain = this.buildRemixChain(signature);
    const licenseStatus = this.ipRegistry.get(signatureId);
    
    let verificationStatus = 'Verified';
    try {
      // Additional verification checks
      const hash = this.generateVerificationHash(
        signature.ghostId,
        signature.watermarkPattern,
        signature.authorId
      );
      if (hash !== signature.verificationHash) {
        verificationStatus = 'Tampered';
      }
    } catch {
      verificationStatus = 'Error';
    }

    return {
      signature,
      remixChain,
      licenseStatus,
      verificationStatus
    };
  }

  exportSignatureForSUNO(signature: StylemetricSignature, lyrics: string): {
    watermarkedLyrics: string;
    signatureMetadata: string;
    ipCompliant: boolean;
  } {
    const watermarkedLyrics = this.embedWatermark(lyrics, signature);
    
    const signatureMetadata = JSON.stringify({
      ghostId: signature.ghostId.substr(0, 16), // Truncated for SUNO
      author: signature.authorId,
      timestamp: signature.timestamp.toISOString().split('T')[0],
      license: signature.licenseType
    });

    const compliance = this.checkLicenseCompliance(signature.id, 'commercial');

    return {
      watermarkedLyrics,
      signatureMetadata,
      ipCompliant: compliance.compliant
    };
  }

  cleanWatermarkForExport(lyrics: string): string {
    // Remove watermarks for clean export while preserving original structure
    return lyrics.replace(/[\u200B\u200C\u200D\u00AD\u2060]/g, '');
  }

  bulkVerifyRemixChain(signatures: string[]): Map<string, boolean> {
    const results = new Map<string, boolean>();
    
    signatures.forEach(sigId => {
      const signature = this.signatures.get(sigId);
      if (signature) {
        const chain = this.buildRemixChain(signature);
        const isValid = chain.every(link => link.confidence > 0.8);
        results.set(sigId, isValid);
      } else {
        results.set(sigId, false);
      }
    });

    return results;
  }
}

export const stylometricTracker = new StylemetricSignatureTracker();